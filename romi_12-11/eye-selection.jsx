import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const EyeSelectionScreen = () => {
  const { id } = useLocalSearchParams(); // Recupera el id del paciente
  const [selectedEye, setSelectedEye] = useState(null);
  const router = useRouter();

  const handleSaveEyeSelection = async (eye) => {
    setSelectedEye(eye);
    try {
      await setDoc(
        doc(db, 'patients', id),
        { examConfig: { eye } },
        { merge: true }
      );

      await setDoc(
        doc(db, 'lastpatient', 'lastpatient'),
        { examConfig: { eye } },
        { merge: true }
      );

      Alert.alert('Éxito', 'Configuración guardada correctamente en el perfil del paciente.');
      router.push(`/tutorial?id=${id}`);
    } catch (error) {
      console.error("Error al guardar los datos: ", error);
      Alert.alert('Error', 'No se pudo guardar la configuración.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Selecciona el ojo a evaluar</Text>

        {/* Mostrar el ID del Paciente */}
        <Text style={styles.label}>ID del Paciente:</Text>
        <TextInput style={styles.disabledInput} value={id} editable={false} />

        <TouchableOpacity style={styles.button} onPress={() => handleSaveEyeSelection('OD')}>
          <Text style={styles.buttonText}>Ojo Derecho (OD)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleSaveEyeSelection('OI')}>
          <Text style={styles.buttonText}>Ojo Izquierdo (OI)</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4C51BF',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 8,
  },
  disabledInput: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#EDEDED',
    marginBottom: 20,
    fontSize: 16,
    color: '#718096',
  },
  button: {
    backgroundColor: '#6B46C1',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EyeSelectionScreen;
