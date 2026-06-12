import { View, Text, StyleSheet, TextInput, Pressable, Alert, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlaceResponse } from '@/types/types';
import { searchPlaces } from '@/repositories/places';
import PlaceRow from '@/components/PlaceRow';
import { router } from 'expo-router';



export default function home() {

  const [searchquery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState<PlaceResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUserId = async () => {
      const userId = await AsyncStorage.getItem('userId');
      console.log(userId);
    };
    loadUserId();
  }, []);

  const handleSearch = async () => {
    if (searchquery.length < 1) {
      Alert.alert('Error', 'El nombre debe tener al menos 1 caracter');
      return;
    }
    setLoading(true);
    const response = await searchPlaces(searchquery);
    setPlaces(response);
    setLoading(false);
  }

  return (
    <FlatList
      style={styles.container}
      data={places}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <PlaceRow place={item} />}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>Home</Text>
          <TextInput placeholder="Nombre" style={styles.input} value={searchquery} onChangeText={setSearchQuery} />
          <View style={styles.buttonRow}>
            <Pressable onPress={handleSearch} style={styles.button}>
              <Text style={styles.buttonText}>Buscar</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/advancedSearch')} style={[styles.button, styles.buttonSecondary]}>
              <Text style={styles.buttonText}>Buscar avanzado</Text>
            </Pressable>
          </View>
          {loading && <Text>Loading...</Text>}
          {places.length > 0 && (
            <Text style={styles.resultsCount}>{places.length} Lugares encontrados</Text>
          )}
        </View>
      }
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF5A5F',
    padding: 10,
    borderRadius: 5,
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: 'gray',
  },
  resultsCount: {
    marginBottom: 20,
    color: 'black',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});