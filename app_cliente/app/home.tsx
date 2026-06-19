import { View, Text, StyleSheet, TextInput, Pressable, Alert, FlatList } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlaceResponse } from '@/types/types';
import { searchPlaces } from '@/repositories/places';
import PlaceRow from '@/components/PlaceRow';
import { router } from 'expo-router';
import MapView, { Marker, MapMarker } from 'react-native-maps';
import Fontisto from '@expo/vector-icons/Fontisto';



export default function home() {

  const [searchquery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState<PlaceResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const [calloutPlaceId, setCalloutPlaceId] = useState<number | null>(null);
  const markerRefs = useRef<Record<number, MapMarker | null>>({});

  const goToPlace = (id: number) => {
    router.push({
      pathname: '/place',
      params: { placeId: String(id) },
    });
  };

  const handleMarkerPress = (placeId: number) => {
    if (calloutPlaceId === placeId) {
      goToPlace(placeId);
      setCalloutPlaceId(null);
      return;
    }
    setCalloutPlaceId(placeId);
    markerRefs.current[placeId]?.showCallout();
  };

  const handlePlacePress = (placeId: number) => {
    if (selectedPlaceId === placeId) {
      goToPlace(placeId);
      setSelectedPlaceId(null);
      return;
    }
    setSelectedPlaceId(placeId);
  };

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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>

      <View style={styles.content}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

        <Text style={styles.title}>Home</Text>
        <Pressable onPress={() => router.push('/myReservations')}>
          <Fontisto name="date" size={24} color="black" />
        </Pressable>
        </View>
        <TextInput placeholder="Nombre" style={styles.input} value={searchquery} onChangeText={setSearchQuery} />
        <View style={styles.buttonRow}>
          <Pressable onPress={handleSearch} style={styles.button}>
            <Text style={styles.buttonText}>Buscar</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/advancedSearch')} style={[styles.button, styles.buttonSecondary]}>
            <Text style={styles.buttonText}>Buscar avanzado</Text>
          </Pressable>
          <Pressable onPress={() => { setMapVisible(!mapVisible); setCalloutPlaceId(null); }} style={[styles.button, styles.buttonSecondary]}>
            <Text style={styles.buttonText}>Mapa</Text>
          </Pressable>
        </View>
        {loading && <Text>Loading...</Text>}
        {places.length > 0 && (
          <Text style={styles.resultsCount}>{places.length} Lugares encontrados</Text>
        )}
      </View>

      {mapVisible ? <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: -16.2902,
          longitude: -63.5887,
          latitudeDelta: 12,
          longitudeDelta: 12,
        }}
      >

        {places.map((place) => (
          <Marker
            key={place.id}
            ref={(ref) => { markerRefs.current[place.id] = ref; }}
            coordinate={{ latitude: Number(place.latitud), longitude: Number(place.longitud) }}
            title={place.nombre}
            description={place.descripcion}
            onPress={() => handleMarkerPress(place.id)}
          />
        ))}
      </MapView> : <FlatList
        style={styles.container}
        data={places}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => goToPlace(item.id)}
            style={selectedPlaceId === item.id ? styles.selectedRow : undefined}
          >
            <PlaceRow place={item} />
          </Pressable>
        )}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      />}
    </View>
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
    color: 'black',
  },
  selectedRow: {
    backgroundColor: '#FFF0F0',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});