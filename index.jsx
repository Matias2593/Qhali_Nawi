import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const router = useRouter();

  const handleStart = () => {
    router.push('/patient-form');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>QHALI ÑAWI</Text>
      <Text style={styles.subtitle}>Detección de glaucoma mediante realidad virtual</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>EMPEZAR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E0E7FF',  //Fondo azul claro
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4C51BF',  //Azul oscuro
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 20,
    color: '#718096',  //Gris tenue
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#6B46C1',  //Morado vibrante
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,  //Sombra en Android
  },
  buttonText: {
    color: '#FFFFFF',  //Texto blanco
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default HomeScreen;
