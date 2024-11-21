import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import { db } from '../firebaseConfig'; // Importa solo Firestore
import { doc, updateDoc } from 'firebase/firestore'; // Importa funciones para Firestore

const EyeTracking = () => {
  const { id } = useLocalSearchParams(); // Recupera el id del paciente

  const router = useRouter();
  const [fixationLossCounter, setFixationLossCounter] = useState(0);
  const [alertShown, setAlertShown] = useState(false);

  const fetchFixationLossCounter = async () => {
    try {
      const response = await fetch('http://10.100.69.251:5000/fixation_loss_counter');
      const data = await response.json();
      setFixationLossCounter(data.fixation_loss_counter);

      if (data.fixation_loss_counter >= 5 && !alertShown) {
        //Alert.alert("Límite Excedido", "La prueba es inválida debido a la superación del límite de pérdidas de fijación.");
        //setAlertShown(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const startTracking = async () => {
    try {
      await fetch('http://10.100.69.251:5000/start_tracking', { method: 'POST' });
      Alert.alert("Inicio", "El seguimiento ha comenzado.");

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const pauseTracking = async () => {
    try {
      await fetch('http://10.100.69.251:5000/pause_tracking', { method: 'POST' });
      Alert.alert("Pausa", "El seguimiento ha sido pausado.");
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resumeTracking = async () => {
    try {
      await fetch('http://10.100.69.251:5000/start_tracking', { method: 'POST' });
      Alert.alert("Reanudado", "El seguimiento ha sido reanudado.");
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const startExam = async () => {
    try {
      const docRef = doc(db, 'Estado_examen', '1');
      await updateDoc(docRef, {
        INICIO: 'ON',
      });
      Alert.alert("Iniciado", "El examen ha sido iniciado.");
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const pauseExam = async () => {
    try {
      const docRef = doc(db, 'Estado_examen', '1');
      await updateDoc(docRef, {
        PAUSA: 'ON',
      });
      Alert.alert("Pausado", "El examen ha sido pausado.");
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resumeExam = async () => {
    try {
      const docRef = doc(db, 'Estado_examen', '1');
      await updateDoc(docRef, {
        PAUSA: 'OFF',
      });
      Alert.alert("Reanudado", "El examen ha sido reanudado.");
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFinishExam = async () => {
    try {
      router.push(`/exam-complete?id=${id}`);

      // Cambiar INICIO a "OFF" en Firestore
      const docRef = doc(db, 'Estado_examen', '1');
      await updateDoc(docRef, {
        INICIO: 'OFF',
      });

      Alert.alert("Examen Finalizado", "El examen ha finalizado.");
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchFixationLossCounter();
    const intervalId = setInterval(fetchFixationLossCounter, 2000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Examen de Campimetría</Text>
      <Text style={styles.counterText}>
        Pérdidas de Fijación: {fixationLossCounter}
      </Text>

      <WebView
        source={{ uri: 'http://10.100.69.251:5000/video_feed' }}
        style={styles.webview}
        scalesPageToFit={true}
      />

      <View style={styles.buttonContainer}>
        <View style={styles.column}>
          <TouchableOpacity style={styles.button} onPress={startTracking}>
            <Text style={styles.buttonText}>Iniciar Tracking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={pauseTracking}>
            <Text style={styles.buttonText}>Pausar Tracking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={resumeTracking}>
            <Text style={styles.buttonText}>Reanudar Tracking</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.column}>
          <TouchableOpacity style={styles.button} onPress={startExam}>
            <Text style={styles.buttonText}>Iniciar Examen</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={pauseExam}>
            <Text style={styles.buttonText}>Pausar Examen</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={resumeExam}>
            <Text style={styles.buttonText}>Reanudar Examen</Text>
          </TouchableOpacity>
        </View>
        
        {/* El botón de Finalizar Examen ocupa todo el ancho */}
        <TouchableOpacity style={[styles.button, styles.fullWidthButton]} onPress={handleFinishExam}>
          <Text style={styles.buttonText}>Finalizar Examen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F3F4F6',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4C51BF',
    textAlign: 'center',
    marginBottom: 20,
  },
  counterText: {
    fontSize: 20,
    color: '#FF6347',
    marginBottom: 10,
  },
  webview: {
    width: 500,
    height: 1000,
    transform: [{ rotate: '90deg' }], // Cambia '90deg' al ángulo necesario
    //flex: 0.5,
    //marginBottom: 20,
  },
  buttonContainer: {
    width: '100%', // Aseguramos que el contenedor ocupe todo el ancho disponible
    flexDirection: 'row', // Disposición en filas (row) para las dos columnas
    justifyContent: 'space-between', // Espaciado entre las columnas
    flexWrap: 'wrap', // Asegura que los elementos de las columnas se ajusten
    marginTop: 20,
  },
  column: {
    flexDirection: 'column', // Distribuye los botones verticalmente
    width: '48%', // Cada columna ocupa el 48% del contenedor para estar en 2 columnas
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#6B46C1', // Azul
    borderRadius: 20, // Bordes redondeados
    marginVertical: 10, // Separación entre los botones
    paddingVertical: 12, // Ajuste del padding vertical
    paddingHorizontal: 20, // Ajuste del padding horizontal
    elevation: 5, // Sombra del botón
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 0, height: 4 }, // Desplazamiento de la sombra
    shadowOpacity: 0.1, // Opacidad de la sombra
    shadowRadius: 6, // Radio de la sombra
  },
  fullWidthButton: {
    width: '100%', // Hace que el botón ocupe todo el ancho
    marginTop: 20, // Separación adicional para el botón final
  },
  buttonText: {
    color: '#fff', // Color del texto
    fontSize: 16,
    textAlign: 'center',
  },
});

export default EyeTracking;