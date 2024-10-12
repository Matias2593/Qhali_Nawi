import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const Tutorial = () => {
  const router = useRouter();

  const handleConfirm = () => {
    router.push('/campimetry-test');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tutorial del Examen</Text>
      <Text style={styles.description}>Por favor, observe el video tutorial y siga las instrucciones proporcionadas por el técnico.</Text>
      <Button title="He entendido el tutorial" onPress={handleConfirm} color="#8E44AD" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
  },
});

export default Tutorial;
