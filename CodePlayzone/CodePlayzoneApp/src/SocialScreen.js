import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Animated, Easing, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SocialScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the spinning animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const fetchUsers = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        const response = await fetch('http://10.0.2.2:8000/api/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        if (!response.ok) throw new Error();
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        Alert.alert('System temporarily unavailable. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.Image
          source={require('../pictures/logo.png')}
          style={[styles.loadingLogo, { transform: [{ rotate: spin }] }]}
        />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <Image source={require('../pictures/logo.png')} style={styles.headerLogo} />
        <Text style={styles.title}>Social Leaderboard</Text>
        <Text style={styles.subtitle}>See how you compare with others!</Text>
      </View>
      <FlatList
        data={users.sort((a, b) => b.points - a.points)}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <View style={[
            styles.userBox,
            index === 0 && styles.gold,
            index === 1 && styles.silver,
            index === 2 && styles.bronze,
          ]}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.points}>{item.points} pts</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F8FB' },
  headerBox: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  headerLogo: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  userBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 32,
    color: '#1976D2',
    textAlign: 'center',
  },
  username: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  points: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6F61',
  },
  gold: {
    borderWidth: 2,
    borderColor: '#FFD700',
    backgroundColor: '#FFFBEA',
  },
  silver: {
    borderWidth: 2,
    borderColor: '#C0C0C0',
    backgroundColor: '#F6F6F6',
  },
  bronze: {
    borderWidth: 2,
    borderColor: '#CD7F32',
    backgroundColor: '#FDF3E7',
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F8FB' },
  loadingLogo: { width: 80, height: 80, marginBottom: 20 },
  loadingText: { fontSize: 18, color: '#888' },
});