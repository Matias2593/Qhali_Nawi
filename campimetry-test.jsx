import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const CampimetryTest = () => {
  const [countdown, setCountdown] = React.useState(30);

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Examen de Campimetría</Text>
      <Text style={styles.countdown}>{countdown > 0 ? `Tiempo restante: ${countdown}s` : 'Prueba finalizada'}</Text>
      <Button title="Repetir Prueba" onPress={() => setCountdown(30)} color="#8E44AD" disabled={countdown > 0} />
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
  countdown: {
    fontSize: 50,
    marginBottom: 40,
  },
});

export default CampimetryTest;
