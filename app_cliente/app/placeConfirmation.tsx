import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { PlaceResponse } from '@/types/types';
import { getPlaceById } from '@/repositories/places';
import { makeReservation } from '@/repositories/reservations';
import Colors from '@/constants/colors';

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function calculateNights(start: Date, end: Date): number {
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((endUtc - startUtc) / (1000 * 60 * 60 * 24));
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function DateField({
  label,
  value,
  onPress,
}: {
  label: string;
  value: Date | null;
  onPress: () => void;
}) {
  return (
    <>
      <Text style={styles.inputLabel}>{label}</Text>
      <Pressable style={styles.dateInput} onPress={onPress}>
        <Text style={value ? styles.dateText : styles.datePlaceholder}>
          {value ? formatDate(value) : 'Seleccionar fecha'}
        </Text>
      </Pressable>
    </>
  );
}

export default function PlaceConfirmation() {
  const { placeId } = useLocalSearchParams<{ placeId: string }>();
  const [place, setPlace] = useState<PlaceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const numNoches =
    fechaInicio && fechaFin ? calculateNights(fechaInicio, fechaFin) : 0;
  const precioNoches = Number(place.precioNoche) * numNoches;
  const precioTotal = precioNoches + Number(place.costoLimpieza);

  const handleStartDateChange = (_event: DateTimePickerEvent, date?: Date) => {
    setShowStartPicker(false);
    if (!date) return;

    setFechaInicio(date);
    if (fechaFin && date >= fechaFin) {
      setFechaFin(null);
    }
  };

  const handleEndDateChange = (_event: DateTimePickerEvent, date?: Date) => {
    setShowEndPicker(false);
    if (date) {
      setFechaFin(date);
    }
  };

  const handleConfirmReservation = async () => {
    if (!fechaInicio || !fechaFin) {
      Alert.alert('Error', 'Seleccione las fechas de inicio y fin');
      return;
    }

    if (numNoches < 1) {
      Alert.alert('Error', 'La fecha fin debe ser posterior a la fecha inicio');
      return;
    }

    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      Alert.alert('Error', 'Debe iniciar sesión para reservar');
      return;
    }

    setSubmitting(true);
    try {
      await makeReservation({
        lugar_id: place.id,
        cliente_id: Number(userId),
        fechaInicio: formatDate(fechaInicio),
        fechaFin: formatDate(fechaFin),
        precioTotal,
        precioLimpieza: Number(place.costoLimpieza),
        precioNoches,
        precioServicio: 0,
      });
      router.push('/home');
    } catch {
      Alert.alert('Error', 'No se pudo confirmar la reserva');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmar reserva</Text>
      <Text style={styles.subtitle}>{place.nombre}</Text>

      <DetailRow label="Precio por noche" value={`$${place.precioNoche}`} />
      <DetailRow label="Costo de limpieza" value={`$${place.costoLimpieza}`} />

      <DateField
        label="Fecha inicio"
        value={fechaInicio}
        onPress={() => setShowStartPicker(true)}
      />
      {showStartPicker && (
        <DateTimePicker
          value={fechaInicio ?? new Date()}
          mode="date"
          minimumDate={new Date()}
          onChange={handleStartDateChange}
        />
      )}

      <DateField
        label="Fecha fin"
        value={fechaFin}
        onPress={() => setShowEndPicker(true)}
      />
      {showEndPicker && (
        <DateTimePicker
          value={fechaFin ?? (fechaInicio ? addDays(fechaInicio, 1) : addDays(new Date(), 1))}
          mode="date"
          minimumDate={fechaInicio ? addDays(fechaInicio, 1) : addDays(new Date(), 1)}
          onChange={handleEndDateChange}
        />
      )}

      {numNoches > 0 && (
        <>
          <DetailRow label="Número de noches" value={numNoches} />
          <DetailRow label="Subtotal noches" value={`$${precioNoches}`} />
          <DetailRow label="Precio total" value={`$${precioTotal}`} />
        </>
      )}

      <Pressable
        style={[styles.confirmButton, submitting && styles.confirmButtonDisabled]}
        onPress={handleConfirmReservation}
        disabled={submitting}
      >
        <Text style={styles.confirmButtonText}>
          {submitting ? 'Confirmando...' : 'Confirmar reserva'}
        </Text>
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
  dateInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: Colors.text,
  },
  datePlaceholder: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  confirmButtonDisabled: {
    opacity: 0.7,
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
