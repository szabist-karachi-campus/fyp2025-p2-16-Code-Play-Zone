import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const CodeWritingScreen = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../../pictures/backgroundimage.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../pictures/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.appName}>CODE PLAYZONE</Text>
        </View>
        <Text style={styles.header}>Code Writing Challenges</Text>
        <Text style={styles.subHeader}>
          Write code to solve problems and see it in action!
        </Text>

        <TouchableOpacity
          style={styles.gameButton}
          onPress={() => navigation.navigate('CodeWritingGameOne')}>
          <Text style={styles.buttonText}>Game 1: The Basics</Text>
          <Text style={styles.buttonSubText}>
            Print, Variables & Arithmetic
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gameButton}
          onPress={() => navigation.navigate('CodeWritingGameTwo')}>
          <Text style={styles.buttonText}>Game 2: Logic Gates</Text>
          <Text style={styles.buttonSubText}>Conditionals & Functions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gameButton}
          onPress={() => navigation.navigate('CodeWritingGameThree')}>
          <Text style={styles.buttonText}>Game 3: Automation</Text>
          <Text style={styles.buttonSubText}>Loops & Functions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.gameButton}
          onPress={() => navigation.navigate('CodeWritingStart')}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {flex: 1, resizeMode: 'cover'},
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  logoContainer: {alignItems: 'center', marginBottom: 20},
  logo: {width: 100, height: 100},
  appName: {fontSize: 24, fontWeight: 'bold', color: '#000'},
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#005096',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  gameButton: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#005096',
    elevation: 5,
  },
  buttonText: {fontSize: 20, fontWeight: 'bold', color: '#005096'},
  buttonSubText: {fontSize: 14, color: '#555'},
});

export default CodeWritingScreen;
