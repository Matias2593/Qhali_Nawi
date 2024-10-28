from flask import Flask, Response, jsonify
import cv2
import numpy as np

app = Flask(__name__)

# URL del stream
stream_url = "http://10.101.48.143:81/stream"
cap = cv2.VideoCapture(stream_url)

if not cap.isOpened():
    print("No se puede abrir el stream de video.")
    exit()

# Variables de control
previous_position = None
fixation_loss_counter = 0
is_tracking = False  # Variable para controlar el estado de seguimiento

# Función para detectar la pupila en el frame
def detect_pupil(frame):
    global previous_position, fixation_loss_counter, is_tracking

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (7, 7), 0)
    _, thres = cv2.threshold(blurred, 50, 255, cv2.THRESH_BINARY_INV)
    
    kernel = np.ones((3, 3), np.uint8)
    morph = cv2.morphologyEx(thres, cv2.MORPH_CLOSE, kernel)

    contours, _ = cv2.findContours(morph, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key=lambda x: cv2.contourArea(x), reverse=True)

    frame_color = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)

    if contours:
        (x, y, w, h) = cv2.boundingRect(contours[0])
        pupil_center = (x + w // 2, y + h // 2)

        # Contar solo si el seguimiento está activo
        if is_tracking and previous_position:
            distance = np.linalg.norm(np.array(pupil_center) - np.array(previous_position))
            if distance >= 4:
                fixation_loss_counter += 1

        previous_position = pupil_center
        #cv2.rectangle(frame_color, (x, y), (x + w, y + h), (0, 0, 255), 2)
        cv2.circle(frame_color, pupil_center, 5, (0, 255, 0), -1)
    
    return frame_color

# Generar frames para el stream de video
def generate_frames():
    global cap
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Reintentando conectar al stream...")
            cap.release()
            cap = cv2.VideoCapture(stream_url)
            if not cap.isOpened():
                print("No se pudo reconectar al stream.")
                break
            continue

        frame = detect_pupil(frame)
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
    global is_tracking
    is_tracking = True
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
