import React, { useState } from 'react';
import { View, Button, Text, Alert, ActivityIndicator, TextInput, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { storage, db } from '../firebaseConfig'; // Asegúrate de que tu configuración de Firebase está correcta
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

const Upload = () => {
  const [fileName, setFileName] = useState('');
  const [patientId, setPatientId] = useState(''); // Estado para el ID del paciente
  const [loading, setLoading] = useState(false);

  const handleFileSelection = async () => {
    if (!patientId.trim()) {
      Alert.alert('Error', 'Por favor ingrese el ID del paciente antes de continuar.');
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result && !result.canceled) {
        const selectedFile = result.assets[0];
        setFileName(selectedFile.name);
        
        // Confirmación antes de subir el archivo
        Alert.alert(
          'Confirmar',
          `¿Está seguro de que desea subir el archivo "${selectedFile.name}"?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Aceptar', onPress: () => uploadFile(selectedFile.uri, selectedFile.name) },
          ]
        );
      } else {
        console.warn('File selection canceled or failed:', result);
        setFileName('');
      }
    } catch (error) {
      console.error('Error during file selection:', error);
      Alert.alert('Error', 'Error durante la selección del archivo.');
    }
  };

  const uploadFile = async (uri, name) => {
    setLoading(true);
    const fileRef = ref(storage, `uploads/${name}`);

    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      await uploadBytes(fileRef, blob);
      const downloadURL = await getDownloadURL(fileRef);

      // Guardar en Firestore
      await addDoc(collection(db, 'pdfUploads'), {
        name,
        patientId,
        url: downloadURL,
      });

      Alert.alert('Éxito', '¡Archivo subido correctamente!');
    } catch (error) {
      console.error('Error uploading file:', error);
      Alert.alert('Error', 'Error al subir el archivo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el ID del paciente"
        value={patientId}
        onChangeText={setPatientId}
      />
      <Button title="Seleccionar PDF" onPress={handleFileSelection} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <Text style={styles.fileName}>{fileName || 'No se ha seleccionado ningún archivo'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#EDEDED',
    marginBottom: 20,
  },
  fileName: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Upload;
