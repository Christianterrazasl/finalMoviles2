import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, router } from 'expo-router';
import { getReservations } from '@/repositories/reservations';
import { ReservaResponse } from '@/types/types';
import Colors from '@/constants/colors';

function formatDisplayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function getReservationPlace(reservation: ReservaResponse) {
  return reservation.lugar?.[0];
}

function ReservationCard({
  reservation,
  onPress,
}: {
  reservation: ReservaResponse;
  onPress: () => void;
}) {
  const place = getReservationPlace(reservation);
  const placeName = place?.nombre ?? 'Lugar sin nombre';

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.cardTitle}>{placeName}</Text>
      {place?.ciudad ? (
        <Text style={styles.cardSubtitle}>{place.ciudad}</Text>
      ) : null}

      <DetailRow label="Desde" value={formatDisplayDate(reservation.fechaInicio)} />
      <DetailRow label="Hasta" value={formatDisplayDate(reservation.fechaFin)} />
      <DetailRow label="Precio noches" value={`$${reservation.precioNoches}`} />
      <DetailRow label="Limpieza" value={`$${reservation.precioLimpieza}`} />
      <DetailRow label="Total" value={`$${reservation.precioTotal}`} />
    </Pressable>
  );
}

export default function MyReservations() {
  const [reservations, setReservations] = useState<ReservaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReservations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        setError('Debe iniciar sesión para ver sus reservas');
        setReservations([]);
        return;
      }

      const data = await getReservations(Number(userId));
      setReservations(Array.isArray(data) ? data : []);
    } catch {
      setError('No se pudieron cargar las reservas');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadReservations();
    }, [loadReservations]),
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        {error.includes('sesión') ? (
          <Pressable style={styles.actionButton} onPress={() => router.push('/login')}>
            <Text style={styles.actionButtonText}>Ir a login</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.actionButton} onPress={loadReservations}>
            <Text style={styles.actionButtonText}>Reintentar</Text>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis reservas</Text>

      {reservations.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Aún no tienes reservas</Text>
          <Pressable style={styles.actionButton} onPress={() => router.push('/home')}>
            <Text style={styles.actionButtonText}>Buscar lugares</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ReservationCard
              reservation={item}
              onPress={() => {
                const placeId = getReservationPlace(item)?.id;
                if (!placeId) return;
                router.push({
                  pathname: '/place',
                  params: { placeId: String(placeId) },
                });
              }}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingBottom: 80,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
  },
});
