import { View, Text, StyleSheet, TextInput, Pressable, FlatList, Switch, Alert } from 'react-native';
import React, { useState } from 'react';
import { PlaceResponse, AdvancedSearch } from '@/types/types';
import { advancedSearchPlaces } from '@/repositories/places';
import PlaceRow from '@/components/PlaceRow';

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
    } finally {
      setLoading(false);
    }
  };

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

          <Pressable onPress={handleSearch} style={styles.button} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Buscando...' : 'Buscar'}</Text>
          </Pressable>

          {loading && <Text>Cargando...</Text>}
          {places.length > 0 && (
            <Text style={styles.resultsCount}>{places.length} lugares encontrados</Text>
          )}
        </View>
      }
    />
  );
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
  button: {
    backgroundColor: '#FF5A5F',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    width: '40%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsCount: {
    marginBottom: 20,
    color: 'black',
  },
});
