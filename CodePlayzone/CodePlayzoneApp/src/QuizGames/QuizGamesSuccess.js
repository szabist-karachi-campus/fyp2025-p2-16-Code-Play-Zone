import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';

const QuizGamesSuccess = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Congratulations</Text>
      <Text style={styles.subtitle}>You have completed the quiz!</Text>

      <Animatable.View
        animation="bounce" // Continuous bounce animation
        duration={1500}
        iterationCount="infinite" // Loop the animation
        style={styles.imageContainer}
      >
        <Image
          source={require('../../pictures/robot.png')} // Replace with your robot image
          style={styles.robotImage}
        />
      </Animatable.View>

      <Text style={styles.successText}>Good Job!</Text>

      <TouchableOpacity style={styles.navigateButton}>
      onPress={() => navigation.navigate('CodeWritingStart')}
        <Text style={styles.buttonText}>ON TO THE NEXT</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navigateButton, styles.spacing]}
        onPress={() => navigation.navigate('QuizScreen')}
      >
        <Text style={styles.buttonText}>RESTART QUIZ GAMES</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6347',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff6347',
    marginBottom: 50,
  },
  imageContainer: {
    marginBottom: 20,
  },
  robotImage: {
    width: 150,
    height: 150,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginBottom: 20,
  },
  navigateButton: {
    backgroundColor: '#ff7f50',
    paddingVertical: 10,
    width: 250, // Set a fixed width for uniform button size
    borderRadius: 25,
    alignItems: 'center', // Center text horizontally
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  spacing: {
    marginTop: 15, // Adjust for desired spacing
  },
});

export default QuizGamesSuccess;
