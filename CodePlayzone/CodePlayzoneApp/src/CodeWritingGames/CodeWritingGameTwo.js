import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Animated,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CharacterSvg from '../components/CharacterSvg';

const levels = [
  {
    id: 1,
    title: 'The "if" Statement',
    prompt:
      "A barrier is ahead! Use an `if` statement to check if the `obstacle` is a 'barrier' and call `character.jump()`.",
    obstacles: [{type: 'barrier', x: 250}],
    expectedActions: ['jump'],
    initialCode: `if (obstacle === 'barrier') {\n  // your code here\n}`,
  },
  {
    id: 2,
    title: 'The "if-else" Statement',
    prompt:
      "Now there's a low pole. Use `if-else` to `jump()` over a 'barrier' or `duck()` under a 'pole'.",
    obstacles: [
      {type: 'barrier', x: 180},
      {type: 'pole', x: 320},
    ],
    expectedActions: ['jump', 'duck'],
    initialCode: `if (obstacle === 'barrier') {\n  \n} else if (obstacle === 'pole') {\n  \n}`,
  },
];

const CodeWritingGameTwo = () => {
  const navigation = useNavigation();
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [code, setCode] = useState('');
  const [gameState, setGameState] = useState('playing');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showPointsPopup, setShowPointsPopup] = useState(false);
  const timerRef = useRef(null);
  const pointsAnim = useRef(new Animated.Value(0)).current;

  const characterY = useRef(new Animated.Value(0)).current;
  const characterX = useRef(new Animated.Value(50)).current;

  const currentLevel = levels[currentLevelIndex];

  useEffect(() => {
    timerRef.current = setInterval(() => setSecondsElapsed(p => p + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const newLevel = levels[currentLevelIndex];
    setCode(newLevel.initialCode);
    setGameState('playing');
    setSecondsElapsed(0);
    characterX.setValue(50);
    characterY.setValue(0);
  }, [currentLevelIndex]);

  const triggerPointsAnimation = () => {
    setShowPointsPopup(true);
    pointsAnim.setValue(0);
    Animated.timing(pointsAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => setShowPointsPopup(false), 1200);
    });
  };

  const runCharacterAnimation = async recordedActions => {
    const sequence = [];
    recordedActions.forEach((action, index) => {
      const obstacle = currentLevel.obstacles[index];
      sequence.push(
        Animated.timing(characterX, {
          toValue: obstacle.x - 10,
          duration: 1000,
          useNativeDriver: false,
        }),
      );
      if (action === 'jump') {
        sequence.push(
          Animated.sequence([
            Animated.timing(characterY, {
              toValue: -50,
              duration: 300,
              useNativeDriver: false,
            }),
            Animated.timing(characterY, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }),
          ]),
        );
      } else if (action === 'duck') {
        sequence.push(
          Animated.sequence([
            Animated.timing(characterY, {
              toValue: 10,
              duration: 200,
              useNativeDriver: false,
            }),
            Animated.timing(characterY, {
              toValue: 0,
              duration: 200,
              useNativeDriver: false,
            }),
          ]),
        );
      }
    });

    Animated.sequence(sequence).start(async () => {
      setGameState('success');
      let points = Math.max(0, 100 - secondsElapsed * 2);
      setPointsEarned(points);
      triggerPointsAnimation();
      await saveProgress(points);
      Alert.alert('Success!', `You earned ${points} points!`);
    });
  };

  const saveProgress = async points => {
    try {
      const authToken = await AsyncStorage.getItem('auth_token');
      if (!authToken) return;

      await fetch('http://10.0.2.2:8000/api/game/progress/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          progress_item: `Code Writing Game 2 - Level ${currentLevel.id} Completed`,
          points: points,
        }),
      });

      const storedPoints = await AsyncStorage.getItem('total_points');
      const totalPoints = (parseInt(storedPoints) || 0) + points;
      await AsyncStorage.setItem('total_points', totalPoints.toString());
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const runCode = async () => {
    const recordedActions = [];
    const character = {
      jump: () => recordedActions.push('jump'),
      duck: () => recordedActions.push('duck'),
    };

    try {
      if (currentLevel.id < 3) {
        const userCodeExecutor = new Function('obstacle', 'character', code);
        currentLevel.obstacles.forEach(obstacle => {
          userCodeExecutor(obstacle.type, character);
        });
      } else {
        const userCodeExecutor = new Function('character', code);
        userCodeExecutor(character);
      }

      const isCorrect =
        JSON.stringify(recordedActions) ===
        JSON.stringify(currentLevel.expectedActions);

      if (isCorrect) {
        runCharacterAnimation(recordedActions);
      } else {
        Alert.alert(
          'Incorrect Logic',
          `The character tried to do: [${recordedActions.join(
            ', ',
          )}], but that wasn't right. Try again!`,
        );
      }
    } catch (error) {
      Alert.alert('Code Error', `Check your syntax. ${error.message}`);
    }
  };

  const goToNextLevel = () => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
    } else {
      navigation.navigate('CodeWritingGameThree');
      Alert.alert('Congratulations!', 'You are a functions master!');
    }
  };

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

        <Text style={styles.levelTitle}>
          Level {currentLevel.id}: {currentLevel.title}
        </Text>
        <Text style={styles.timerText}>🕒 Time: {secondsElapsed}s</Text>

        <View style={styles.gameArea}>
          <Text style={styles.promptText}>{currentLevel.prompt}</Text>
          <View style={styles.ground}>
            <Animated.View
              style={[
                styles.characterContainer,
                {
                  transform: [
                    {translateX: characterX},
                    {translateY: characterY},
                  ],
                },
              ]}>
              <CharacterSvg />
            </Animated.View>
            {currentLevel.obstacles.map((obs, index) => (
              <View
                key={index}
                style={[
                  styles.obstacle,
                  {left: obs.x},
                  obs.type === 'pole' && styles.pole,
                ]}>
                <Text
                  style={
                    obs.type !== 'pole'
                      ? styles.obstacleEmoji
                      : styles.obstaclePole
                  }>
                  {obs.type === 'barrier' ? '🧱' : '🌴'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.codingArea}>
          <TextInput
            style={styles.codeInput}
            multiline
            value={code}
            onChangeText={setCode}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {gameState === 'playing' ? (
            <>
              <TouchableOpacity style={styles.runButton} onPress={runCode}>
                <Text style={styles.buttonText}>Run Code</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.exitButton}
                onPress={() => navigation.navigate('CodeWritingStart')}>
                <Text style={styles.buttonText}>Exit Game</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.nextButton} onPress={goToNextLevel}>
              <Text style={styles.buttonText}>
                {currentLevelIndex < levels.length - 1
                  ? 'Next Level'
                  : 'Finish'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {showPointsPopup && (
        <Animated.View
          style={[
            styles.pointsPopup,
            {
              opacity: pointsAnim,
              transform: [
                {
                  translateY: pointsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}>
          <Text style={styles.pointsPopupText}>+{pointsEarned} Points!</Text>
        </Animated.View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {flex: 1, resizeMode: 'cover'},
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  logoContainer: {alignItems: 'center', marginTop: 20},
  logo: {width: 80, height: 80},
  appName: {fontSize: 22, fontWeight: 'bold', color: '#000'},
  levelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
    color: '#333',
  },
  timerText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  gameArea: {
    flex: 0.4,
    justifyContent: 'flex-end',
  },
  promptText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 80, 150, 0.8)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  ground: {
    height: 150,
    backgroundColor: '#8B4513',
    borderTopWidth: 5,
    borderColor: '#228B22',
    position: 'relative',
    overflow: 'hidden',
  },
  characterContainer: {
    position: 'absolute',
    bottom: 0,
    width: 50,
    height: 75,
    zIndex: 10,
  },
  obstacle: {
    position: 'absolute',
    bottom: 0,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  pole: {
    backgroundColor: '#8B4513',
  },
  obstaclePole: {
    fontSize: 90,
    width: 90,
  },
  obstacleEmoji: {
    fontSize: 36,
  },
  codingArea: {
    flex: 0.6,
    paddingTop: 10,
  },
  codeInput: {
    flex: 1,
    backgroundColor: '#2d2d2d',
    color: '#33FF33',
    fontSize: 15,
    fontFamily: 'monospace',
    padding: 15,
    borderRadius: 8,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#444',
  },
  runButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  nextButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
  pointsPopup: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsPopupText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  exitButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default CodeWritingGameTwo;
