import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CampimetryRealExam = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio del Examen de Campimetría</Text>
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
  },
});

export default CampimetryRealExam;
