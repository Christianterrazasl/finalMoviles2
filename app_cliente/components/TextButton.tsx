import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'

export default function TextButton({ onPress, title, color }: { onPress: () => void, title: string, color: string }) {


  const styles = StyleSheet.create({
    button: {
        backgroundColor: color,
        padding: 20,
        borderRadius: 10,
    },
    text: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
})

  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  )
}

