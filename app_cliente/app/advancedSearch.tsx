import { View, Text, StyleSheet, TextInput, Pressable, FlatList, Switch, Alert } from 'react-native';
import React, { useRef, useState } from 'react';
import { PlaceResponse, AdvancedSearch } from '@/types/types';
import { advancedSearchPlaces } from '@/repositories/places';
import PlaceRow from '@/components/PlaceRow';
import { router } from 'expo-router';
import MapView, { Marker, MapMarker } from 'react-native-maps';

export default function advancedSearch() {
  const [ciudad, setCiudad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cantPersonas, setCantPersonas] = useState('');
  const [cantCamas, setCantCamas] = useState('');
  const [cantBanios, setCantBanios] = useState('');
  const [cantHabitaciones, setCantHabitaciones] = useState('');
  const [tieneWifi, setTieneWifi] = useState(false);
  const [cantVehiculosParqueo, setCantVehiculosParqueo] = useState('');
  const [precioNoche, setPrecioNoche] = useState('');
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

  const handleSearch = async () => {
    if (ciudad.length < 1 || descripcion.length < 1 || cantPersonas.length < 1 || cantCamas.length < 1 || cantBanios.length < 1 || cantHabitaciones.length < 1 || cantVehiculosParqueo.length < 1 || precioNoche.length < 1) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
      return;
    }
    setLoading(true);
    try {
      const params: AdvancedSearch = {
        ciudad,
        descripcion,
        cantPersonas: Number(cantPersonas) || 0,
        cantCamas: Number(cantCamas) || 0,
        cantBanios: Number(cantBanios) || 0,
        cantHabitaciones: Number(cantHabitaciones) || 0,
        tieneWifi: tieneWifi ? 1 : 0,
        cantVehiculosParqueo: Number(cantVehiculosParqueo) || 0,
        precioNoche: Number(precioNoche) || 0,
      };
      const response = await advancedSearchPlaces(params);
      setPlaces(response);
      setSelectedPlaceId(null);
      setCalloutPlaceId(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>
        <Text style={styles.title}>Buscar avanzado</Text>

        <TextInput placeholder="Ciudad" style={styles.input} value={ciudad} onChangeText={setCiudad} />
        <TextInput placeholder="Descripción" style={styles.input} value={descripcion} onChangeText={setDescripcion} />

        <View style={styles.numericRow}>
          <TextInput
            placeholder="Personas"
            style={styles.numericInput}
            value={cantPersonas}
            onChangeText={setCantPersonas}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Camas"
            style={styles.numericInput}
            value={cantCamas}
            onChangeText={setCantCamas}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Baños"
            style={styles.numericInput}
            value={cantBanios}
            onChangeText={setCantBanios}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.numericRow}>
          <TextInput
            placeholder="Habitaciones"
            style={styles.numericInput}
            value={cantHabitaciones}
            onChangeText={setCantHabitaciones}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Parqueo"
            style={styles.numericInput}
            value={cantVehiculosParqueo}
            onChangeText={setCantVehiculosParqueo}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Precio/noche"
            style={styles.numericInput}
            value={precioNoche}
            onChangeText={setPrecioNoche}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Tiene WiFi</Text>
          <Switch value={tieneWifi} onValueChange={setTieneWifi} trackColor={{ true: '#FF5A5F' }} thumbColor={'white'} />
        </View>

        <View style={styles.buttonRow}>
          <Pressable onPress={handleSearch} style={styles.button} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Buscando...' : 'Buscar'}</Text>
          </Pressable>
          <Pressable
            onPress={() => { setMapVisible(!mapVisible); setCalloutPlaceId(null); }}
            style={[styles.button, styles.buttonSecondary]}
          >
            <Text style={styles.buttonText}>Mapa</Text>
          </Pressable>
        </View>

        {loading && <Text>Cargando...</Text>}
        {places.length > 0 && (
          <Text style={styles.resultsCount}>{places.length} lugares encontrados</Text>
        )}
      </View>

      {mapVisible ? (
        <MapView
          style={styles.map}
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
        </MapView>
      ) : (
        <FlatList
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
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  map: {
    flex: 1,
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
    color: 'black',
  },
  numericRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  numericInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    color: 'black',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: 'black',
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
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsCount: {
    color: 'black',
  },
  selectedRow: {
    backgroundColor: '#FFF0F0',
    borderRadius: 10,
  },
});
