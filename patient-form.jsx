import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, Switch, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, addDoc } from 'firebase/firestore'; //Importar Firestore
import { db } from '../firebaseConfig'; //Importar la configuración de Firebase
import { StyleSheet } from 'react-native';

const PatientForm = () => {
  const [patientData, setPatientData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    age: '',
    dob: '',
    gender: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [dataConsent, setDataConsent] = useState(false);
  const router = useRouter();

  // Validacion de ID (solo numeros)
  const handleIdChange = (text) => {
    if (/^\d*$/.test(text)) {
      setPatientData({ ...patientData, id: text });
    }
  };

  // Validacion de edad (solo numeros)
  const handleAgeChange = (text) => {
    if (/^\d*$/.test(text)) {
      setPatientData({ ...patientData, age: text });
    }
  };

  // Validacion de fecha de nacimiento (AAAA-MM-DD)
  const handleDobChange = (text) => {
    if (/^\d{0,4}-?\d{0,2}-?\d{0,2}$/.test(text)) {
      setPatientData({ ...patientData, dob: text });
    }
  };

  const handleSave = async () => {
    if (!patientData.id || !patientData.firstName || !patientData.lastName || !patientData.age || !patientData.dob || !patientData.gender) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    if (!dataConsent) {
      Alert.alert('Error', 'Debe aceptar el uso de sus datos para fines médicos.');
      return;
    }

    try {
      //Guardar los datos en Firestore
      await addDoc(collection(db, 'patients'), {
        id: patientData.id,
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        age: patientData.age,
        dob: patientData.dob,
        gender: patientData.gender,
      });

      Alert.alert('Éxito', 'Datos guardados correctamente.');
      router.push('/exam-config');
    } catch (error) {
      console.error("Error al guardar los datos: ", error);
      Alert.alert('Error', 'No se pudo guardar la información.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Formulario del Paciente</Text>
        
        <Text style={styles.label}>ID del paciente</Text>
        <TextInput
          style={styles.disabledInput}
          value={patientData.id}
          onChangeText={handleIdChange}
          keyboardType="numeric"
          placeholder="Solo números"
        />

        <Text style={styles.label}>Nombres</Text>
        <TextInput
          style={styles.disabledInput}
          value={patientData.firstName}
          onChangeText={(text) => setPatientData({ ...patientData, firstName: text })}
          placeholder="Ingrese su nombre"
        />

        <Text style={styles.label}>Apellidos</Text>
        <TextInput
          style={styles.disabledInput}
          value={patientData.lastName}
          onChangeText={(text) => setPatientData({ ...patientData, lastName: text })}
          placeholder="Ingrese su apellido"
        />

        <Text style={styles.label}>Edad</Text>
        <TextInput
          style={styles.disabledInput}
          value={patientData.age}
          onChangeText={handleAgeChange}
          keyboardType="numeric"
          placeholder="Solo números"
        />

        <Text style={styles.label}>Fecha de Nacimiento (AAAA-MM-DD)</Text>
        <TextInput
          style={styles.disabledInput}
          value={patientData.dob}
          onChangeText={handleDobChange}
          placeholder="Formato AAAA-MM-DD"
        />

        <Text style={styles.label}>Género</Text>
        <TouchableOpacity
          style={styles.pickerToggle}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.pickerText}>{patientData.gender || 'Seleccione género'}</Text>
        </TouchableOpacity>

        {/* Modal para selección de género */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Seleccionar Género</Text>
              <TouchableOpacity onPress={() => { setPatientData({ ...patientData, gender: 'Masculino' }); setModalVisible(false); }}>
                <Text style={styles.modalOption}>Masculino</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setPatientData({ ...patientData, gender: 'Femenino' }); setModalVisible(false); }}>
                <Text style={styles.modalOption}>Femenino</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setPatientData({ ...patientData, gender: 'Otro' }); setModalVisible(false); }}>
                <Text style={styles.modalOption}>Otro</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Acepto el uso de datos para fines médicos</Text>
          <Switch
            value={dataConsent}
            onValueChange={setDataConsent}
            trackColor={{ false: '#767577', true: '#6B46C1' }}
            thumbColor={dataConsent ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Guardar y Continuar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F3F4F6', //Fondo gris claro
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4C51BF', //Azul oscuro
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#4A5568', //Gris oscuro
    marginBottom: 8,
  },
  pickerToggle: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#CBD5E0', //Gris claro
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  pickerText: {
    fontSize: 16,
    color: '#4A5568', //Gris oscuro
  },
  predeterminadoHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20, //Mayor espacio debajo del encabezado
    color: '#4C51BF', //Azul oscuro
  },
  disabledInput: {
    borderWidth: 1,
    borderColor: '#CBD5E0', //Gris claro
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#EDEDED', //Fondo gris claro para inputs deshabilitados
    marginBottom: 20, //Espacio adicional entre campos
    fontSize: 16,
    color: '#718096', //Gris oscuro para el texto
  },
  button: {
    backgroundColor: '#6B46C1', //Morado vibrante
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5, //Sombra en Android
    marginTop: 20, //Mayor espacio entre el último campo y el botón
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4C51BF',
  },
  modalOption: {
    fontSize: 16,
    paddingVertical: 10,
    color: '#4A5568',
  },
});

export default PatientForm;
