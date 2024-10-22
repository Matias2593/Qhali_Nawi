import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';

const CampimetryRealExam = () => {
  const router = useRouter(); // Obtiene la instancia del enrutador

  // Función para navegar a la pantalla de carga
  const handleNavigateToUpload = () => {
    router.push('/upload'); // Cambia a la ruta de UploadScreen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio del Examen de Campimetría</Text>
       
        {/* WebView para mostrar el stream del ESP32 */}
        <WebView
        source={{ uri: 'http://10.101.48.143:81/stream' }}  // URL del ESP32 http://10.101.48.143:81/stream http://10.100.70.61:5000/video_feed
        style={styles.webview}
        scalesPageToFit={true}  // Ajusta el contenido a la pantalla
      />

      <Button title="Ir a Carga de Resultados" onPress={handleNavigateToUpload} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F3F4F6', // Fondo gris claro
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4C51BF', // Azul oscuro
    textAlign: 'center',
  },
  webview: {
    width: 300,
    height: 300,
    flex: 0.5, // Ajustar el contenido al WebView
  },

});

export default CampimetryRealExam;

