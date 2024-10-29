import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';

const ExamComplete = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/'); // Redirige a la pantalla principal o a cualquier otra pantalla inicial.
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Examen Completado!</Text>
      <Text style={styles.message}>
        Se ha culminado el examen. Le comunicaremos los resultados pronto.
      </Text>
      <Button title="Volver a la pantalla principal" onPress={handleGoBack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F3F4F6',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4C51BF',
    textAlign: 'center',
    marginBottom: 20,
  },
  message: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
});

export default ExamComplete;
