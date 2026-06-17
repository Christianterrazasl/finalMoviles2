import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { PlaceResponse, Foto } from '@/types/types';
import { getPlaceById } from '@/repositories/places';
import Colors from '@/constants/colors';

function getImageUri(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.startsWith('http') ? url : `http://${url}`;
}

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function PlaceDetail() {
  const { placeId } = useLocalSearchParams<{ placeId: string }>();
  const { width } = useWindowDimensions();
  const photoWidth = width * 0.75;
  const [place, setPlace] = useState<PlaceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const fotos = place.fotos ?? [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{place.nombre}</Text>
      <Text style={styles.description}>{place.descripcion}</Text>

      <DetailRow label="Ciudad" value={place.ciudad} />
      <DetailRow label="Personas" value={place.cantPersonas} />
      <DetailRow label="Camas" value={place.cantCamas} />
      <DetailRow label="Baños" value={place.cantBanios} />
      <DetailRow label="Habitaciones" value={place.cantHabitaciones} />
      <DetailRow label="WiFi" value={place.tieneWifi ? 'Sí' : 'No'} />
      <DetailRow label="Vehículos en parqueo" value={place.cantVehiculosParqueo} />
      <DetailRow label="Precio por noche" value={`$${place.precioNoche}`} />
      <DetailRow label="Costo de limpieza" value={`$${place.costoLimpieza}`} />
      <DetailRow label="Arrendatario" value={place.arrendatario.nombrecompleto} />

      <Pressable
        style={styles.payButton}
        onPress={() =>
          router.push({
            pathname: '/placeConfirmation',
            params: { placeId: String(place.id) },
          })
        }
      >
        <Text style={styles.payButtonText}>Ir a pagar</Text>
      </Pressable>

      {fotos.length > 0 ? (
        <>
          <Text style={styles.photosTitle}>Fotos</Text>
          <FlatList
            horizontal
            data={fotos}
            keyExtractor={(item) => String(item.id)}
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            contentContainerStyle={styles.photosList}
            renderItem={({ item }: { item: Foto }) => {
              const uri = getImageUri(item.url);
              return uri ? (
                <Image
                  source={{ uri }}
                  style={[styles.photo, { width: photoWidth }]}
                  resizeMode="cover"
                />
              ) : null;
            }}
          />
        </>
      ) : (
        <Text style={styles.emptyPhotos}>Este lugar no tiene fotos</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
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
  },
  description: {
    fontSize: 15,
    color: Colors.textMuted,
    lineHeight: 22,
    marginBottom: 8,
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
  photosTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  payButton: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  photosList: {
    paddingVertical: 4,
    gap: 12,
  },
  photo: {
    height: 220,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: Colors.surface,
  },
  emptyPhotos: {
    fontSize: 14,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
  },
});
