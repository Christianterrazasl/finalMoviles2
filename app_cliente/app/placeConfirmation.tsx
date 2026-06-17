import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { PlaceResponse } from '@/types/types';
import { getPlaceById } from '@/repositories/places';
import Colors from '@/constants/colors';

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function PlaceConfirmation() {
  const { placeId } = useLocalSearchParams<{ placeId: string }>();
  const [place, setPlace] = useState<PlaceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noches, setNoches] = useState('');

  useEffect(() => {
    const loadPlace = async () => {
      const id = Number(placeId);
      if (Number.isNaN(id)) {
        setError('ID de lugar inválido');
        setLoading(false);
        return;
      }

      try {
        const data = await getPlaceById(id);
        setPlace(data);
      } catch {
        setError('No se pudo cargar el lugar');
      } finally {
        setLoading(false);
      }
    };

    loadPlace();
  }, [placeId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error || !place) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error ?? 'Lugar no encontrado'}</Text>
      </View>
    );
  }

  const numNoches = Number(noches) || 0;
  const precioNoches = Number(place.precioNoche) * Number(numNoches);
  const precioTotal = Number(precioNoches) + Number(place.costoLimpieza);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmar reserva</Text>
      <Text style={styles.subtitle}>{place.nombre}</Text>

      <DetailRow label="Precio por noche" value={`$${place.precioNoche}`} />
      <DetailRow label="Costo de limpieza" value={`$${place.costoLimpieza}`} />

      <Text style={styles.inputLabel}>Número de noches</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 3"
        value={noches}
        onChangeText={setNoches}
        keyboardType="numeric"
      />

      {numNoches > 0 && (
        <>
          <DetailRow label="Subtotal noches" value={`$${precioNoches}`} />
          <DetailRow label="Precio total" value={`$${precioTotal}`} />
        </>
      )}

      <Pressable style={styles.confirmButton} onPress={() => {}}>
        <Text style={styles.confirmButtonText}>Confirmar reserva</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 8,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  inputLabel: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 8,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
  },
});
