import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function PuzzleScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../../pictures/logo.png')} // Replace with your logo file path
        style={styles.logo}
      />
      {/* App Name and Tagline */}
      <Text style={styles.appName}>CODE PLAYZONE</Text>
      <Text style={styles.tagline}>Play, Learn, Code;</Text>
      
      {/* Title */}
      <Text style={styles.title}>Quizzes</Text>

      {/* Puzzle Image */}
      <Image
        source={require('../../pictures/quizrobot.png')}
        style={styles.image}
      />

      {/* Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('QuizGameLevel1')}
      >
        <Text style={styles.buttonText}>LET'S GO</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button} // Back button with same styling as "LET'S GO" button
        onPress={() => navigation.navigate('PuzzleGamesSuccess')}
      >
        <Text style={styles.buttonText}>BACK</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CodeWritingStart')}
      >
        <Text style={styles.buttonText}>SKIP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 18,
    color: '#555',
    marginTop: 5,
    marginBottom: 20, // Added margin-bottom for spacing
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B', // Adjust the color to match the design
    marginBottom: 10, // Reduced margin-bottom
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20, // Reduced margin-bottom
  },
  button: {
    backgroundColor: '#FF6B6B',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginVertical: 8, // Reduced spacing between buttons
    width: 200, // Added fixed width
    height: 50, // Added fixed height
    justifyContent: 'center', // Center text vertically
    alignItems: 'center', // Center text horizontally
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
