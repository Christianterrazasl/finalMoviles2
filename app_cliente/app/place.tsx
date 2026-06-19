import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { PlaceResponse } from '@/types/types';
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
  const [place, setPlace] = useState<PlaceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

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

  useEffect(() => {
    setSelectedPhotoIndex(0);
  }, [place?.id]);

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
  const selectedPhoto = fotos[selectedPhotoIndex];
  const selectedUri = getImageUri(selectedPhoto?.url);
  const mainPhotoWidth = width - 40;

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
        <View style={styles.photosSection}>
          <Text style={styles.photosTitle}>Fotos</Text>

          {selectedUri ? (
            <Image
              source={{ uri: selectedUri }}
              style={[styles.mainPhoto, { width: mainPhotoWidth }]}
              resizeMode="cover"
            />
          ) : null}

          {fotos.length > 1 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbnailRow}
            >
              {fotos.map((item, index) => {
                const uri = getImageUri(item.url);
                if (!uri) return null;

                const isSelected = index === selectedPhotoIndex;

                return (
                  <Pressable key={item.id} onPress={() => setSelectedPhotoIndex(index)}>
                    <Image
                      source={{ uri }}
                      style={[styles.thumbnail, isSelected && styles.thumbnailSelected]}
                      resizeMode="cover"
                    />
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : null}
        </View>
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
  photosSection: {
    gap: 12,
  },
  mainPhoto: {
    height: 260,
    borderRadius: 10,
    backgroundColor: Colors.surface,
  },
  thumbnailRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailSelected: {
    borderColor: Colors.primary,
    opacity: 1,
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
