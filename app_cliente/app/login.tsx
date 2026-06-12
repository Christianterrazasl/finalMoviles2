import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import TextButton from '@/components/TextButton';
import { login } from '@/repositories/auth';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginScreen() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if(email === '' || password === '') {
            Alert.alert('Error', 'Por favor, ingrese un email y contraseña');
            return;
        }
        try {
            setLoading(true);
            const response = await login(email, password);
            if(response.status === 200) {
                await AsyncStorage.setItem('userId', response.data.id.toString());
                router.push('/home');
            } else {
                Alert.alert('Error', 'Credenciales incorrectas');
            }
            console.log(response);
        } catch {
            Alert.alert('Error', 'Credenciales incorrectas');
        } finally {
            setLoading(false);
        }
    }

    return <View style={styles.container}>
        <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'black', marginBottom: 20 }}>Login</Text>
        <View style={styles.form}>
            <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
            <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} />
        </View>
        <Pressable disabled={loading} style={styles.button} onPress={handleLogin}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>{loading ? 'Cargando...' : 'Continuar'}</Text>
        </Pressable>
        <Text style={{ fontSize: 16, color: 'black' }}>
          No tienes una cuenta?{' '}
          <Text style={{ color: '#FF5A5F', fontWeight: 'bold' }} onPress={() => router.push('/register')}>
            Registrate
          </Text>
        </Text>
    </View>;
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
        color: 'white',
    },
});
