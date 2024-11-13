import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const CampimetryTest = () => {
  const { id } = useLocalSearchParams(); // Recupera el id del paciente

  const [countdown, setCountdown] = useState(30);
  const [isTestStarted, setIsTestStarted] = useState(false); // Estado para controlar si se ha iniciado la prueba
  const [isRepeatEnabled, setIsRepeatEnabled] = useState(false); // Estado para habilitar Repetir Prueba
  const [isNextEnabled, setIsNextEnabled] = useState(false); // Estado para habilitar Siguiente
  const router = useRouter();

  useEffect(() => {
    let timer;
    if (isTestStarted && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && isTestStarted) {
      setIsRepeatEnabled(true); //Habilitar el boton Repetir Prueba cuando el conteo termina
      setIsNextEnabled(true); //Habilitar el boton Siguiente
    }
    return () => clearTimeout(timer);
  }, [countdown, isTestStarted]);

  const handleStartTest = () => {
    setIsTestStarted(true); //Iniciar la prueba
  };

  const handleRepeatTest = () => {
    setCountdown(30); //Reiniciar el contador
    setIsTestStarted(true); //Volver a iniciar la prueba
    setIsRepeatEnabled(false); //Deshabilitar el botón Repetir Prueba
  };

  const handleNext = () => {
    router.push(`/eye-tracking?id=${id}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Examen de Prueba</Text>
      <Text style={styles.countdown}>{countdown > 0 ? `${countdown}s` : 'Prueba finalizada'}</Text>
      
      {/* Botón para Iniciar Prueba */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: isTestStarted ? '#ccc' : '#6B46C1' }]}
        onPress={handleStartTest}
        disabled={isTestStarted} //Deshabilitar si ya se ha iniciado la prueba
      >
        <Text style={styles.buttonText}>Iniciar Prueba</Text>
      </TouchableOpacity>

      {/* Botón para Repetir Prueba */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: isRepeatEnabled ? '#6B46C1' : '#ccc' }]}
        onPress={handleRepeatTest}
        disabled={!isRepeatEnabled} //Habilitar solo si la prueba ha terminado
      >
        <Text style={styles.buttonText}>Repetir Prueba</Text>
      </TouchableOpacity>

      {/* Botón para ir al siguiente frame */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: isNextEnabled ? '#6B46C1' : '#ccc' }]}
        onPress={handleNext}
        disabled={!isNextEnabled} //Habilitar solo cuando el conteo ha terminado
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
    marginBottom: 40,
  },
  countdown: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#4A5568', //Gris oscuro
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#6B46C1', //Morado vibrante
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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

export default CampimetryTest;