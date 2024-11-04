import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { db } from '../firebaseConfig'; // Importa solo Firestore
import { doc, updateDoc } from 'firebase/firestore'; // Importa funciones para Firestore

const EyeTracking = () => {
  const router = useRouter();
  const [fixationLossCounter, setFixationLossCounter] = useState(0);
  const [alertShown, setAlertShown] = useState(false);

  const fetchFixationLossCounter = async () => {
    try {
      const response = await fetch('http://10.100.69.122:5000/fixation_loss_counter');
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
      await fetch('http://10.100.69.122:5000/start_tracking', { method: 'POST' });
      Alert.alert("Inicio", "El seguimiento ha comenzado.");

      // Cambiar INICIO a "ON" en Firestore
      const docRef = doc(db, 'Estado_examen', '1');
      await updateDoc(docRef, {
        INICIO: 'ON',
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const pauseTracking = async () => {
    try {
      await fetch('http://10.100.69.122:5000/pause_tracking', { method: 'POST' });
      Alert.alert("Pausa", "El seguimiento ha sido pausado.");
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resumeTracking = async () => {
    try {
      await fetch('http://10.100.69.122:5000/start_tracking', { method: 'POST' });
      Alert.alert("Reanudado", "El seguimiento ha sido reanudado.");
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFinishExam = async () => {
    try {
      router.push('/exam-complete');

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
        source={{ uri: 'http://10.100.69.122:5000/video_feed' }}
        style={styles.webview}
        scalesPageToFit={true}
      />

      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button title="Iniciar" onPress={startTracking} />
        </View>
        <View style={styles.button}>
          <Button title="Pausa" onPress={pauseTracking} />
        </View>
        <View style={styles.button}>
          <Button title="Reanudar" onPress={resumeTracking} />
        </View>
        <View style={styles.button}>
          <Button title="Finalizar Examen" onPress={handleFinishExam} />
        </View>
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
    width: 300,
    height: 500,
    flex: 0.5,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
    marginTop: 20,
  },
  button: {
    marginBottom: 10,
  },
});

export default EyeTracking;





