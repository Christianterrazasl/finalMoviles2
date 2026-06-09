import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: '100%',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
});