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

const CodeWritingGamesSuccess = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../../pictures/backgroundimage.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image
          source={require('../../pictures/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.message}>
          You have successfully completed all the code writing challenges.
          You're on your way to becoming a coding master!
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.buttonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {flex: 1, resizeMode: 'cover'},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#005096',
    textAlign: 'center',
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CodeWritingGamesSuccess;
