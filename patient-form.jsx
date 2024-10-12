import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const PatientForm = () => {
  const [patientData, setPatientData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    age: '',
    dob: '',
    gender: '',
  });
  const router = useRouter();

  const handleSave = () => {
    if (!patientData.id || !patientData.firstName || !patientData.lastName || !patientData.age || !patientData.dob || patientData.gender === '') {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }
    router.push('/exam-config');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ID del paciente</Text>
      <TextInput style={styles.input} value={patientData.id} onChangeText={(text) => setPatientData({ ...patientData, id: text })} />
      <Text style={styles.label}>Nombres</Text>
      <TextInput style={styles.input} value={patientData.firstName} onChangeText={(text) => setPatientData({ ...patientData, firstName: text })} />
      <Text style={styles.label}>Apellidos</Text>
      <TextInput style={styles.input} value={patientData.lastName} onChangeText={(text) => setPatientData({ ...patientData, lastName: text })} />
      <Text style={styles.label}>Edad</Text>
      <TextInput style={styles.input} value={patientData.age} keyboardType="numeric" onChangeText={(text) => setPatientData({ ...patientData, age: text })} />
      <Text style={styles.label}>Fecha de Nacimiento (AAAA-MM-DD)</Text>
      <TextInput style={styles.input} value={patientData.dob} onChangeText={(text) => setPatientData({ ...patientData, dob: text })} />
      <Text style={styles.label}>Género</Text>
      <TextInput style={styles.input} value={patientData.gender} onChangeText={(text) => setPatientData({ ...patientData, gender: text })} />
      <Button title="Guardar y Continuar" onPress={handleSave} color="#8E44AD" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default PatientForm;
