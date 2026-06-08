import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import TextButton from '@/components/TextButton';

export default function LoginScreen() {
    return <View style={styles.container}>
        <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'black', marginBottom: 20 }}>Login</Text>
        <View style={styles.form}>
            <TextInput placeholder="Email" style={styles.input} />
            <TextInput placeholder="Password" style={styles.input} />
        </View>
        <Pressable style={styles.button}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>Continuar</Text>
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
