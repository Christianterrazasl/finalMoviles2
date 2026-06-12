import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import { PlaceResponse } from '@/types/types';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/colors';

function getImageUri(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.startsWith('http') ? url : `http://${url}`;
}

export default function PlaceRow({ place }: { place: PlaceResponse }) {
  const photoUri = getImageUri(place.fotos?.[0]?.url);

  return (
    <View style={styles.container}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <FontAwesome name="image" size={28} color={Colors.textMuted} />
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {place.nombre}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {place.descripcion}
        </Text>
        <View style={styles.metaRow}>
          <FontAwesome name="user" size={12} color={Colors.textMuted} />
          <Text style={styles.metaText}>Hasta {place.cantPersonas} personas</Text>
        </View>
        <Text style={styles.price}>
          ${place.precioNoche} <Text style={styles.priceUnit}>/ noche</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 10,
    backgroundColor: Colors.surface,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  description: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  metaText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 2,
  },
  priceUnit: {
    fontSize: 13,
    fontWeight: 'normal',
    color: Colors.textMuted,
  },
});
