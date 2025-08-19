import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const LandingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../pictures/backgroundimage.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../pictures/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.appName}>CODE PLAYZONE</Text>
          <Text style={styles.tagline}>Play, Learn, Code;</Text>
        </View>
      </ImageBackground>

      <Text style={styles.title}>Let's Get Started!</Text>

      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <LinearGradient
          colors={['#FF512F', '#F09819']}
          style={styles.button}
        >
          <Text style={styles.buttonText}>SIGN IN</Text>       
          </LinearGradient>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>DIDN'T HAVE ACCOUNT?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupLink}> SIGN UP NOW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundImage: {
    width: '100%',
    height: '57%', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 200, 
    height: 200,
    marginBottom: 10,
    marginTop: 150,
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
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textAlign: 'center',
    marginVertical: 20,
  },
  button: {
    width: 200,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    fontSize: 14,
    color: '#aaa',
  },
  signupLink: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
});
