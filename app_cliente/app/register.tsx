import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <View style={styles.form}>
        <TextInput placeholder="Nombre completo" style={styles.input} autoCapitalize="words" />
        <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" autoCapitalize="none" />
        <TextInput placeholder="Password" style={styles.input} secureTextEntry />
        <TextInput placeholder="Teléfono" style={styles.input} keyboardType="phone-pad" />
      </View>
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Continuar</Text>
      </Pressable>
      <Text style={styles.footer}>
        ¿Ya tienes una cuenta?{' '}
        <Text style={styles.link} onPress={() => router.push('/login')}>
          Iniciá sesión
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 100,
    width: '100%',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  form: {
    width: '80%',
    gap: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgb(160, 160, 160)',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  button: {
    width: '40%',
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#FF5A5F',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    fontSize: 16,
    color: 'black',
  },
  link: {
    color: '#FF5A5F',
    fontWeight: 'bold',
  },
});
