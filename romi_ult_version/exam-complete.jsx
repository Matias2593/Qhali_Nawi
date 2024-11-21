import React, { useState } from 'react';
import { Button, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const ExamenCompletado = ({ navigation }) => {
  
  const router = useRouter();
  const { id } = useLocalSearchParams(); 

  const handleGoBack = () => {
    router.push(`/eye-selection?id=${id}`);
  };

  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);

  const fetchWithTimeout = (url, options, timeout = 10000) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Request timed out")), timeout);
      fetch(url, options)
        .then(response => {
          clearTimeout(timer);
          resolve(response);
        })
        .catch(error => {
          clearTimeout(timer);
          reject(error);
        });
    });
  };
  
  const generarPdf = async () => {
    try {
      const response = await fetchWithTimeout('http://127.0.0.1:5000', {
        method: 'GET',
      }, 20000); // Timeout de 20 segundos
  
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
  
      const data = await response.json();
      setPdfUrl(data.pdf_url);
    } catch (err) {
      setError(`Error al generar el reporte: ${err.message}`);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Examen Completado!</Text>
      <Text style={styles.message}>
        Se ha culminado el examen. Le comunicaremos los resultados pronto.
      </Text>
      
      {/* Botón para generar el PDF */}
      <TouchableOpacity style={styles.button} onPress={generarPdf}>
        <Text style={styles.buttonText}>Enviar resultados</Text>
      </TouchableOpacity>

      {/* Mostrar URL del PDF si está disponible */}
      {pdfUrl && (
        <Text style={styles.pdfText}>PDF generado: {pdfUrl}</Text>
      )}

      {/* Mostrar mensaje de error si ocurre */}
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {/* Botón para volver a la pantalla principal */}
      <TouchableOpacity style={styles.button} onPress={handleGoBack}>
        <Text style={styles.buttonText}>Continuar con el siguiente ojo</Text>
      </TouchableOpacity>

      {/* Botón para volver al inicio */}
      <Text style={styles.explanation}>Si ya completó el examen con ambos ojos:</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
        <Text style={styles.buttonText}>Volver al inicio</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },

  explanation: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 5,
  },
  pdfText: {
    fontSize: 14,
    color: '#007BFF',
    marginVertical: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    marginVertical: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6B46C1', // Color morado
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25, // Bordes redondeados
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ExamenCompletado;