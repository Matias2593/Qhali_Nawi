from flask import Flask, Response, jsonify
import cv2
import numpy as np

app = Flask(__name__)

# URL del stream
#stream_url = "http://192.168.18.21:81/stream"
stream_url = "http://10.101.48.143:81/stream"
cap = cv2.VideoCapture(stream_url)

if not cap.isOpened():
    print("No se puede abrir el stream de video.")
    exit()

# Variables de control
fixation_loss_counter = 0
is_tracking = False  # Variable para controlar el estado de seguimiento
reconnect_message_shown = False  # Variable para mostrar mensaje una sola vez

# Nueva función para detectar el círculo más grande (posible pupila)
def detect_largest_circle(frame):
    # Convertir a escala de grises y ecualizar histograma para mejorar contraste
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray = cv2.equalizeHist(gray)

    # Aplicar desenfoque para reducir ruido
    blurred = cv2.GaussianBlur(gray, (7, 7), 0)

    # Aplicar umbral adaptativo para adaptarse a variaciones de iluminación
    thres = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                  cv2.THRESH_BINARY_INV, 11, 2)

    # Aplicar operaciones morfológicas para eliminar áreas pequeñas (ruido de pestañas/cejas)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    morph = cv2.morphologyEx(thres, cv2.MORPH_OPEN, kernel)

    # Detectar círculos (posible iris/pupila) con la Transformada de Hough
    circles = cv2.HoughCircles(morph, cv2.HOUGH_GRADIENT, dp=1.5, minDist=30,
                               param1=50, param2=30, minRadius=15, maxRadius=40)
    
    if circles is not None:
        # Redondear las coordenadas y seleccionar el círculo con el mayor radio
        circles = np.round(circles[0, :]).astype("int")
        
        # Filtrar círculos por tamaño y posición plausible para la pupila
        valid_circles = [c for c in circles if 10 < c[2] < 50]  # Radio entre 10 y 50 px
        if valid_circles:
            largest_circle = max(valid_circles, key=lambda c: c[2])
            x, y, r = largest_circle
            cv2.circle(frame, (x, y), 5, (0, 255, 0), -1)  # Centro en verde
            return frame, True  # Pupila detectada
    
    return frame, False  # No se detectó pupila

# Generar frames para el stream de video
def generate_frames():
    global cap, fixation_loss_counter, is_tracking
    while True:
        ret, frame = cap.read()
        if not ret:
            if not reconnect_message_shown:
                print("No se pudo reconectar al stream.")
                reconnect_message_shown = True
            cap.release()
            cap = cv2.VideoCapture(stream_url)
            continue
        
        frame = cv2.rotate(frame, cv2.ROTATE_90_COUNTERCLOCKWISE)
        
        # Aplicar detección de pupilas usando la nueva función
        frame, pupil_detected = detect_largest_circle(frame)
        
        # Incrementar el contador de pérdidas de fijación si no se detecta la pupila
        if is_tracking and not pupil_detected:
            fixation_loss_counter += 1
            print("Pérdida de fijación detectada. Contador:", fixation_loss_counter)
        
        ret, buffer = cv2.imencode('.jpg', frame)
        if not ret:
            break
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# Rutas de Flask
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/fixation_loss_counter', methods=['GET'])
def get_fixation_loss_counter():
    return jsonify({"fixation_loss_counter": fixation_loss_counter})

@app.route('/start_tracking', methods=['POST'])
def start_tracking():
    global is_tracking, fixation_loss_counter
    is_tracking = True
    fixation_loss_counter = 0  # Reiniciar el contador al iniciar el seguimiento
    return jsonify({"message": "Tracking started"})

@app.route('/pause_tracking', methods=['POST'])
def pause_tracking():
    global is_tracking
    is_tracking = False
    return jsonify({"message": "Tracking paused"})

@app.route('/')
def home():
    return "¡Bienvenido a la API de detección de pupilas! Usa /video_feed para ver el stream."

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
