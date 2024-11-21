import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const Tutorial = () => {
  const { id } = useLocalSearchParams(); // Recupera el id del paciente

  const router = useRouter();
  const [hasWatched, setHasWatched] = useState(false); //Estado para controlar el switch

  const handleConfirm = () => {
    if (!hasWatched) {
      Alert.alert('Error', 'Debes confirmar que has visto el video antes de continuar.');
    } else {
      router.push(`/eye-tracking?id=${id}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tutorial del Examen</Text>
      <Text style={styles.description}>
        Por favor, observe el video tutorial y marque la casilla si ha completado las instrucciones proporcionadas por el técnico.
      </Text>
      
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>He visto el video</Text>
        <Switch
          value={hasWatched}
          onValueChange={(value) => setHasWatched(value)}
          thumbColor={hasWatched ? '#6B46C1' : '#ccc'} //Cambia el color del switch segun el estado
          trackColor={{ false: '#ccc', true: '#D6BCFA' }} //Cambia el color de la pista
        />
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: hasWatched ? '#6B46C1' : '#ccc' }]} //Cambia el color del boton segun el estado
        onPress={handleConfirm}
        disabled={!hasWatched} //Deshabilita el boton si no se ha marcado el switch
      >
        <Text style={styles.buttonText}>Siguiente</Text>
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
    backgroundColor: '#F3F4F6', //Fondo gris claro
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4C51BF', //Azul oscuro
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: '#4A5568', //Gris oscuro
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  switchLabel: {
    fontSize: 18,
    color: '#4A5568', //Gris oscuro
    marginRight: 10,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5, //Sombra en Android
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default Tutorial;


