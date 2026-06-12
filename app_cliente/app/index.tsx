import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import TextButton from '@/components/TextButton';
import { Redirect } from 'expo-router';


export default function HomeScreen() {


  return <Redirect href="/home" />;

  return <View style={styles.container}>
    <View style={styles.titleContainer}>
      <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'black', marginBottom: -30 }}>Aire BnB</Text>
      <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'black', marginBottom: 20 }}>(Clientes)</Text>
      <FontAwesome name="home" size={180} color="#FF5A5F" />
    </View>
    <View style={styles.column}>
      <TextButton title="Login" onPress={() => router.push('/login')} color={'#FF5A5F'} />
      <TextButton title="Register" onPress={() => router.push('/register')} color={'rgba(25, 25, 25, 1)'} />
    </View>
  </View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 20,
  },
  titleContainer: {
    paddingVertical: 100,
    alignItems: 'center',
    gap: 20,
    flex: 1,
    justifyContent: 'center',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    gap: 15,
    width: '100%',
    paddingHorizontal: 20,
  },
});
