import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScrollView} from 'react-native-gesture-handler';
import {useFocusEffect} from '@react-navigation/native';

export default function Dashboard({navigation}) {
  const [points, setPoints] = useState(0);
  const [username, setUsername] = useState('');
  const [showCertificateButton, setShowCertificateButton] = useState(false); // NEW
  const TOTAL_LEVELS = 18;

  const fetchPointsAndUser = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const response = await fetch(
        'http://10.0.2.2:8000/api/game/progress',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      );
      const data = await response.json();
      if (response.ok && data.total_points !== undefined) {
        setPoints(data.total_points);
        // Check if user has completed all levels
        if (data.progress && data.progress.length >= TOTAL_LEVELS) {
          setShowCertificateButton(true);
        }
      }

      // Fetch user info
      const userResponse = await fetch('http://10.0.2.2:8000/api/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      const userData = await userResponse.json();
      if (userResponse.ok && userData.username) {
        setUsername(userData.username);
      }
    } catch (error) {
      console.error('Error fetching points or user:', error);
    }
  };

  useEffect(() => {
    fetchPointsAndUser();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchPointsAndUser();
    }, []),
  );
  const handleShowProgress = async progressType => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const response = await fetch(
        'http://10.0.2.2:8000/api/game/progress',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      );
      const data = await response.json();
      if (response.ok && data.progress) {
        // Filter progress based on type
        let filteredProgress = [];
        if (progressType === 'Quiz Game') {
          filteredProgress = data.progress.filter(item =>
            item.toLowerCase().includes('quiz'),
          );
        } else if (progressType === 'Puzzle Game') {
          filteredProgress = data.progress.filter(item =>
            item.toLowerCase().includes('puzzle'),
          );
        } else if (progressType === 'Code the Basics') {
          filteredProgress = data.progress.filter(item =>
            item.toLowerCase().includes('code writing game 1'),
          );
        } else if (progressType === 'Code Logic Gates') {
          filteredProgress = data.progress.filter(item =>
            item.toLowerCase().includes('code writing game 2'),
          );
        } else if (progressType === 'Code Automation') {
          filteredProgress = data.progress.filter(item =>
            item.toLowerCase().includes('code writing game 3'),
          );
        } else {
          filteredProgress = data.progress;
        }

        const message =
          filteredProgress.length > 0
            ? filteredProgress.join('\n')
            : 'No progress yet.';

        setTimeout(() => {
          Alert.alert(`${progressType} Progress`, message);
        }, 200);
      } else {
        setTimeout(() => {
          Alert.alert('Error', 'Could not fetch progress.');
        }, 200);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
      setTimeout(() => {
        Alert.alert('Error', 'Could not fetch progress.');
      }, 200);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Points Display */}
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsLabel}>Points:</Text>
          <Text style={styles.pointsValue}>{points}</Text>
        </View>

        {/* Logo and App Name */}
        <View style={styles.logoContainer}>
          <Image source={require('../pictures/logo.png')} style={styles.logo} />
          <Text style={styles.appName}>CODE PLAYZONE</Text>
          <Text style={styles.tagline}>Play, Learn, Code;</Text>
        </View>

        {showCertificateButton && (
          <TouchableOpacity
            style={styles.certificateButton}
            onPress={() => navigation.navigate('CertificateScreen')}>
            <Text style={styles.certificateButtonText}>
              🏆 Get Your Certificate!
            </Text>
          </TouchableOpacity>
        )}
        {/* Quiz, Puzzle, and Code the Basics Logos */}
        <View style={styles.featureLogosContainer}>
          <TouchableOpacity
            style={styles.featureLogoBox}
            onPress={() => handleShowProgress('Quiz Game')}>
            <Image
              source={require('../pictures/quizlogo.jpeg')}
              style={styles.featureLogo}
              resizeMode="contain"
            />
            <Text style={styles.featureLogoLabel}>Quiz Game Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.featureLogoBox}
            onPress={() => handleShowProgress('Puzzle Game')}>
            <Image
              source={require('../pictures/puzzlelogo.png')}
              style={styles.featureLogo}
              resizeMode="contain"
            />
            <Text style={styles.featureLogoLabel}>Puzzle Game Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.featureLogoBox}
            onPress={() => handleShowProgress('Code the Basics')}>
            <Image
              source={require('../pictures/codethebasicslogo.png')}
              style={styles.featureLogo}
              resizeMode="contain"
            />
            <Text style={styles.featureLogoLabel}>
              Code the Basics Progress
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.featureLogoBox}
            onPress={() => handleShowProgress('Code Logic Gates')}>
            <Image
              source={require('../pictures/codelogicgates.png')}
              style={styles.featureLogo}
              resizeMode="contain"
            />
            <Text style={styles.featureLogoLabel}>
              Code Logic Gates Progress
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.featureLogoBox}
            onPress={() => handleShowProgress('Code Automation')}>
            <Image
              source={require('../pictures/codeautomation.png')}
              style={styles.featureLogo}
              resizeMode="contain"
            />
            <Text style={styles.featureLogoLabel}>
              Code Automation Progress
            </Text>
          </TouchableOpacity>
        </View>

        {/* Social Screen Navigation Button */}
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => navigation.navigate('SocialScreen')}>
          <Text style={styles.playButtonText}>SOCIAL LEADERBOARD</Text>
        </TouchableOpacity>

        {/* Welcome Message */}
        <Text style={styles.welcomeText}>Welcome Aboard!</Text>
        <Text style={styles.welcomeTextHighlight}>
          {' '}
          {username ? `${username}` : ''}
        </Text>
        <Text style={styles.welcomeTextHighlight2}>
          Let's start your Journey
        </Text>

        {/* Play Button */}
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => navigation.navigate('VoiceoverScreen1IP')}>
          <Text style={styles.playButtonText}>LET'S GO</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            try {
              await AsyncStorage.clear();
              setTimeout(() => {
                Alert.alert(
                  'Logged out',
                  'You have been logged out successfully.',
                );
                navigation.navigate('SignIn');
              }, 200);
            } catch (error) {
              console.error('Error clearing AsyncStorage:', error);
              setTimeout(() => {
                Alert.alert('Error', 'Something went wrong while logging out.');
              }, 200);
            }
          }}>
          <Text style={styles.logoutText}>LOG OUT</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  pointsLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  pointsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6F61',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10, // reduced space
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 10, // reduced space
  },
  featureLogosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, // reduced space
    width: '100%',
    gap: 20,
  },
  featureLogoBox: {
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 10,
  },
  featureLogo: {
    width: 70,
    height: 70,
    borderRadius: 15,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
  featureLogoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
    width: 90,
  },
  socialButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 20,
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '400',
    color: '#000',
  },
  welcomeTextHighlight: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF6F61',
    marginBottom: 10,
  },
  welcomeTextHighlight2: {
    fontSize: 20,
    color: '#333',
    marginBottom: 20,
  },
  playButton: {
    backgroundColor: '#FF6F61',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 10, // reduced space
  },
  playButtonText: {
    fontSize: 18,
    color: '#FFFFFF', // Ensure white text
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 0, // remove extra space above logout
    marginBottom: 10, // less space below logout
  },
  logoutText: {
    fontSize: 16,
    color: '#FF6F61',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  certificateButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginBottom: 15,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#FFA000',
  },
  certificateButtonText: {
    color: '#FF6F61',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
