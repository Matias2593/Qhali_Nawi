import firebase_admin
from firebase_admin import credentials, firestore, storage
from flask import Flask, jsonify
from reportlab.lib.pagesizes import letter, A4
from reportlab.pdfgen import canvas
from io import BytesIO
import os
import pandas as pd
import numpy as np
from flask_cors import CORS

# Configura la ruta de R
os.environ['R_HOME'] = "C:\\Program Files\\R_2"  # Asegúrate de que esta ruta sea correcta

# Inicializa la aplicación de Firebase con tus credenciales
if not firebase_admin._apps:
    try:
        cred = credentials.Certificate("eyesaviors-firebase-adminsdk-7r41j-4c8d1e5775.json")
        firebase_admin.initialize_app(cred, {
            'storageBucket': 'eyesaviors.appspot.com'
        })
    except Exception as e:
        print(f"Error al inicializar Firebase: {str(e)}")
        exit(1)

# Inicializa Firestore
db = firestore.client()

# Crea la app Flask
app = Flask(__name__)
CORS(app)  # Esto permitirá solicitudes desde cualquier origen

@app.route('/', methods=['GET'])
def get_input_data():
    try:
        # Accede al documento del último paciente
        doc_ref = db.collection('lastpatient').document('lastpatient')
        doc = doc_ref.get()

        # Verifica si el documento existe y luego obtiene los datos
        if doc.exists:
            patient_data = doc.to_dict()
            ID = patient_data.get("id")
            FDN = patient_data.get("dob")
            sexo = patient_data.get("gender")
            edad = patient_data.get("age")
            estimulo = patient_data.get("examConfig", {}).get("stimulusSize")
            patron = patient_data.get("examConfig", {}).get("pattern")
            ojo = patient_data.get("examConfig", {}).get("eye")
            diametro = 4  # Valor fijo, ajusta según tu lógica
            apellido = patient_data.get("lastName")
        else:
            return jsonify({"error": "No se encontró el documento del paciente."}), 404
               
        bucket = storage.bucket()
        if not bucket:
            raise Exception("No se pudo acceder al bucket de almacenamiento.")

        # Descarga el archivo input_data.txt
        file_name = f'results/{ID}_{apellido}.txt'
        blob = bucket.blob(file_name)
        input_data = blob.download_as_text()

        # Procesar el contenido del archivo para extraer los números en un array llamado data_array
        def extract_numbers_from_positions(data):
            lines = data.splitlines()
            numbers = []
            for line in lines:
                if line.startswith("Posición"):
                    try:
                        _, value = line.split(":")
                        numbers.append(int(value.strip()))
                    except ValueError:
                        continue
            return numbers

        # Extraer números de las posiciones
        data_array = extract_numbers_from_positions(input_data)

        from PyVisualFields import vfprogression, visualFields
        
        # Genera la imagen y guarda en un archivo temporal
        vfprogression.plotValues(data_array, title='Test results', save=True, filename="test_results", fmt='png')

        #Ajustar tabla
        # Define los encabezados para las nuevas columnas y sus valores iniciales
        extra_columns = {
            "id": [ID],
            "eye": [ojo],
            "date": [pd.to_datetime("2008-08-13")], 
            "time": ["00:00:00"],
            "age": [edad],
            "type": ["pwg"],
            "fpr": [0],
            "fnr": [0.0],
            "fl": [0.00],
            "duration": ["00:00:00"]
        }
        # Crea una lista de encabezados de columna desde l1 a l54
        column_headers = [f"l{i}" for i in range(1, 55)]

        # Convierte el array de datos en un DataFrame de una sola fila con columnas l1-l54
        df_values = pd.DataFrame([data_array], columns=column_headers)

        # Convierte las columnas adicionales en un DataFrame y concatena a la izquierda de df_values
        df_extra = pd.DataFrame(extra_columns)
        df = pd.concat([df_extra, df_values], axis=1)
        
        df_td, df_tdp, df_gi, df_gip, df_pd, df_pdp, gh = visualFields.getallvalues(df)
        
        #TOTAL DEVIATION
        l_columns = df_td.loc[:, 'l1':'l54']
        l_array = l_columns.values
        patient_td = np.round(l_array[0,:], 1)
              
        vfprogression.plotValues(patient_td, title= 'Total Deviation',save=True, filename='total_deviation', fmt='png')
        
        #TOTAL DEVIATION PROBABILITY
        l_columns_tdp = df_tdp.loc[:, 'l1':'l54']
        l_array_tdp = l_columns_tdp.values
        patient_tdp = np.round(l_array_tdp[0,:], 1)
        
        vfprogression.plotProbabilities(patient_tdp, title= 'Total Deviation Probablity', save=True, filename='total_deviation_probability', fmt='png')  

        
        #PATTERN DEVIATION
        l_columns_pd = df_pd.loc[:, 'l1':'l54']
        l_array_pd = l_columns_pd.values
        patient_pd = np.round(l_array_pd[0,:], 1)
        
        vfprogression.plotValues(patient_pd, title='Pattern deviation', save=True, filename='pd', fmt='png')
        
        #PATTERN DEVIATION PROBABILITY
        l_columns_pdp = df_pdp.loc[:, 'l1':'l54']
        l_array_pdp = l_columns_pdp.values
        patient_pdp = np.round(l_array_pdp[0,:], 1)
        
        vfprogression.plotProbabilities(patient_pdp, title='Pattern deviation probability', save=True, filename='pdp', fmt='png')

        #ESCALA DE GRISES
        visualFields.vfplot(df, type='s', save=True, filename='greyscale_results', fmt='png') # types: s, td,pd, tds, pds

        # Crear un buffer en memoria para el PDF
        pdf_buffer = BytesIO()
        c = canvas.Canvas(pdf_buffer, pagesize=A4)

        # Añadir título al PDF
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, 800, "Resultados del test de campo visual")
        c.setFont("Helvetica", 10)
        c.drawString(50, 780, f"ID: {ID}")
        c.drawString(50, 760, f"FDN: {FDN}")
        c.drawString(50, 740, f"Edad: {edad}")
        c.drawString(50, 720, f"Sexo: {sexo}")
        c.drawString(50, 700, f"Monitor de fijación: Eye-tracking")
        c.drawString(50, 680, f"Objetivo de fijación: Central")

        # Resultados del examen como array
        perdida_fijacion = 0 
        falsos_positivos = 0
        falsos_negativos = 0
        duracion = 4.5  # minutos
        
        c.drawString(250, 780, f"Pérdidas de fijación: {perdida_fijacion}/10")
        c.drawString(250, 760, f"Errores falsos pos.: {falsos_positivos}%")
        c.drawString(250, 740, f"Errores falsos neg.: {falsos_negativos}%")
        c.drawString(250, 720, f"Duración: {duracion} min")
        c.drawString(430, 780, f"Estímulo: {estimulo}, Blanco")
        c.drawString(430, 760, f"Fondo: 31.5 asb")
        c.drawString(430, 740, f"Estrategia: SITA-Estándar")
        c.drawString(430, 720, f"Patrón: {patron}")
        c.drawString(430, 700, f"Diámetro de la pupila: {diametro} mm")
        c.drawString(430, 680, f"Ojo: {ojo}")

        # Añadir la imagen generada al PDF
        c.drawImage("test_results.png",50,450, width=200, height=200)
        c.drawImage("greyscale_results.png",300,450, width=200, height=200)
        c.drawImage("total_deviation.png",50,250, width=200, height=200)
        c.drawImage("pd.png",300,250, width=200, height=200)
        c.drawImage("total_deviation_probability.png",50,50, width=200, height=200)
        c.drawImage("pdp.png",300,50, width=200, height=200)

        # Finaliza el PDF
        c.showPage()
        c.save()
        pdf_buffer.seek(0)

        # Sube el PDF a Firebase Storage
        file_name = f'uploads/{ID}.pdf'
        pdf_blob = bucket.blob(file_name)
        pdf_blob.upload_from_file(pdf_buffer, content_type='application/pdf')

        # Asegura que el archivo PDF sea público y obtiene la URL
        pdf_blob.make_public()
        pdf_public_url = pdf_blob.public_url
        
        # Estructura de datos para Firestore
        document_data = {
            "name": f'{ID}.pdf',  
            "patientId": ID,  
            "url": pdf_public_url
        }

        # Guarda el documento en Firestore
        db.collection('pdfUploads').add(document_data)  
        
        # Limpia el archivo de imagen temporal
        if os.path.exists("test_results.png"):
            os.remove("test_results.png")

        return jsonify({
            "message": "PDF generado y subido exitosamente",
            "pdf_url": pdf_public_url
        }), 200

    except Exception as e:
        return jsonify({"error": f"Error al generar o subir el PDF: {str(e)}"}), 500

# Ejecuta el servidor Flask en el puerto 5000 sin hilos
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Escuchar en todas las interfaces de red, incluyendo Wi-Fi
