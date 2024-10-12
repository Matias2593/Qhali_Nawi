import React from 'react';
import { View, Text, Button, StyleSheet, Picker, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const ExamConfig = () => {
  const [pattern, setPattern] = React.useState('10-2');
  const [stimulusSize, setStimulusSize] = React.useState('Tamaño III');
  const router = useRouter();

  const handleSave = () => {
    if (!pattern || !stimulusSize) {
      Alert.alert('Error', 'Debe seleccionar las configuraciones del examen.');
      return;
    }
    router.push('/tutorial');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Configurar Patrón del Examen</Text>
      <Picker selectedValue={pattern} onValueChange={(itemValue) => setPattern(itemValue)}>
        <Picker.Item label="10-2" value="10-2" />
        <Picker.Item label="24-2" value="24-2" />
        <Picker.Item label="30-2" value="30-2" />
      </Picker>

      <Text style={styles.label}>Tamaño del Estímulo</Text>
      <Picker selectedValue={stimulusSize} onValueChange={(itemValue) => setStimulusSize(itemValue)}>
        <Picker.Item label="Tamaño III" value="Tamaño III" />
        <Picker.Item label="Tamaño V" value="Tamaño V" />
      </Picker>

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
});

export default ExamConfig;
