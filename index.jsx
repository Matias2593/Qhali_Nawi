import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const router = useRouter();

  const handleStart = () => {
    router.push('/patient-form'); //formulario del paciente
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QHALI ÑAWI</Text>
      <Text style={styles.subtitle}>Detección de glaucoma mediante realidad virtual</Text>
      <Button title="EMPEZAR" onPress={handleStart} color="#8E44AD" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EDE7F6',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#5E35B1',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default HomeScreen;
