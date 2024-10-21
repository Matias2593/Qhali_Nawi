import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const CampimetryRealExam = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio del Examen de Campimetría</Text>

      {/* WebView para mostrar el stream del ESP32 */}
      <WebView
        source={{ uri: 'http://10.101.48.143:81/stream' }}  // URL del ESP32
        style={styles.webview}
        scalesPageToFit={true}  // Ajusta el contenido a la pantalla
      />
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
  webview: {
    width: 300,
    height: 300,
    flex: 1, // Ajustar el contenido al WebView
  },
});

export default CampimetryRealExam;
