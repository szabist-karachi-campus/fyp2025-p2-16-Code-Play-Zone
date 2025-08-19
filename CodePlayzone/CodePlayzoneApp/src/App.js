import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Image, Animated, Easing} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const rotateValue = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    checkAuthStatus();
  }, [rotateValue]);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      console.log('Token:', token);
      if (!token) {
        setTimeout(() => {
          navigation.replace('LandingScreen');
          setIsCheckingAuth(false);
        }, 3000);
        return;
      }

      const response = await fetch('http://10.0.2.2:8000/api/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      console.log('Response status:', response);
      if (response.ok) {
        const userData = await response.json();

        setTimeout(() => {
          navigation.replace('Dashboard');
          setIsCheckingAuth(false);
        }, 3000);
      } else {
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('total_points');

        setTimeout(() => {
          navigation.replace('LandingScreen');
          setIsCheckingAuth(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Auth check error:', error);

      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('total_points');

      setTimeout(() => {
        navigation.replace('LandingScreen');
        setIsCheckingAuth(false);
      }, 3000);
    }
  };

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, {transform: [{rotate}]}]}>
        <Image
          source={require('../pictures/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
      <Text style={styles.loadingText}>
        {isCheckingAuth ? 'CHECKING SESSION...' : 'LOADING...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  circle: {
    width: 200,
    height: 200,
    borderWidth: 5,
    borderRadius: 100,
    borderColor: 'transparent',
    borderTopColor: '#00FF76',
    borderRightColor: '#00FF76',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
  loadingText: {
    fontSize: 18,
    color: '#FF4B2B',
    fontWeight: 'bold',
    marginTop: 20,
  },
});
