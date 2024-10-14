import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, addDoc } from 'firebase/firestore'; //Importar Firestore
import { db } from '../firebaseConfig'; //Importar la configuracion de Firebase

const ExamConfig = () => {
  const [pattern, setPattern] = useState('10-2');
  const [stimulusSize, setStimulusSize] = useState('Tamaño III');

  //Estados para controlar la visibilidad de los modales
  const [showPatternModal, setShowPatternModal] = useState(false);
  const [showStimulusModal, setShowStimulusModal] = useState(false);

  const router = useRouter();

  const handleSave = async () => {
    try {
      //Guardar la configuración del examen en Firestore
      await addDoc(collection(db, 'examConfigs'), {
        pattern,
        stimulusSize,
        stimulusColor: "Blanco",
        backgroundColor: "Blanco 31.5 asb",
        strategy: "SITA Estándar",
      });

      Alert.alert('Éxito', 'Configuración guardada correctamente.');
      router.push('/tutorial');
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
        <Text style={styles.title}>Configuración del Examen</Text>

        {/* Configuración de Patrón */}
        <TouchableOpacity
          style={styles.pickerToggle}
          onPress={() => setShowPatternModal(true)}
        >
          <Text style={styles.label}>Configurar Patrón del Examen</Text>
          <Text style={styles.pickerText}>{pattern}</Text>
        </TouchableOpacity>

        {/* Modal para el Patrón */}
        <Modal
          transparent={true}
          visible={showPatternModal}
          animationType="slide"
          onRequestClose={() => setShowPatternModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Seleccionar Patrón del Examen</Text>
              <TouchableOpacity onPress={() => { setPattern('10-2'); setShowPatternModal(false); }}>
                <Text style={styles.modalOption}>10-2</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setPattern('24-2'); setShowPatternModal(false); }}>
                <Text style={styles.modalOption}>24-2</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setPattern('30-2'); setShowPatternModal(false); }}>
                <Text style={styles.modalOption}>30-2</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Configuración de Tamaño del Estímulo */}
        <TouchableOpacity
          style={styles.pickerToggle}
          onPress={() => setShowStimulusModal(true)}
        >
          <Text style={styles.label}>Tamaño del Estímulo</Text>
          <Text style={styles.pickerText}>{stimulusSize}</Text>
        </TouchableOpacity>

        {/* Modal para Tamaño del Estímulo */}
        <Modal
          transparent={true}
          visible={showStimulusModal}
          animationType="slide"
          onRequestClose={() => setShowStimulusModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Seleccionar Tamaño del Estímulo</Text>
              <TouchableOpacity onPress={() => { setStimulusSize('Tamaño III'); setShowStimulusModal(false); }}>
                <Text style={styles.modalOption}>Tamaño III</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setStimulusSize('Tamaño V'); setShowStimulusModal(false); }}>
                <Text style={styles.modalOption}>Tamaño V</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Campos Predeterminados */}
        <Text style={styles.predeterminadoHeader}>Predeterminado:</Text>
        <Text style={styles.label}>Color de Estímulo</Text>
        <TextInput style={styles.disabledInput} value="Blanco" editable={false} />
        <Text style={styles.label}>Color de Fondo</Text>
        <TextInput style={styles.disabledInput} value="Blanco 31.5 asb" editable={false} />
        <Text style={styles.label}>Estrategia</Text>
        <TextInput style={styles.disabledInput} value="SITA Estándar" editable={false} />

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
    marginTop: 20, //Mayor espacio entre el ultimo campo y el boton
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

export default ExamConfig;
