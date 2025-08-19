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
  KeyboardAvoidingView, // Import this
  Platform, // And this
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CharacterSvg from '../components/CharacterSvg';

const levels = [
  {
    id: 1,
    title: 'The "for" Loop',
    prompt:
      'Use a `for` loop to make the character move right 4 times. Call `character.moveRight()` inside the loop.',
    expectedActions: ['right', 'right', 'right', 'right'],
    initialCode: `for (let i = 0; i < 4; i++) {\n  // your code here\n}`,
  },
  {
    id: 2,
    title: 'Functions and Loops',
    prompt:
      'Create a function `moveInSquare()` that makes the character move right, down, left, and then up to return to the start.',
    expectedActions: ['right', 'down', 'left', 'up'],
    initialCode: `function moveInSquare() {\n  // Call the four move functions in order\n}\n\nmoveInSquare();`,
  },
];

const CodeWritingGameThree = () => {
  const navigation = useNavigation();
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [code, setCode] = useState('');
  const [gameState, setGameState] = useState('playing');
  const [arenaSize, setArenaSize] = useState({width: 0, height: 0});

  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showPointsPopup, setShowPointsPopup] = useState(false);
  const timerRef = useRef(null);
  const pointsAnim = useRef(new Animated.Value(0)).current;

  const characterPos = useRef(new Animated.ValueXY()).current;
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
    // Reset position to center when level changes or arena size is known
    if (arenaSize.width > 0) {
      characterPos.setValue({
        x: arenaSize.width / 2 - 25, // half of arena width - half of character width
        y: arenaSize.height / 2 - 37.5, // half of arena height - half of character height
      });
    }
  }, [currentLevelIndex, arenaSize]);

  const runCharacterAnimation = async recordedActions => {
    const sequence = [];
    let currentPos = characterPos.getLayout();
    // Extract numeric values from the animated layout
    let currentX = currentPos.left._value;
    let currentY = currentPos.top._value;

    const step = 50;

    recordedActions.forEach(action => {
      if (action === 'right') currentX += step;
      else if (action === 'left') currentX -= step;
      else if (action === 'down') currentY += step;
      else if (action === 'up') currentY -= step;

      sequence.push(
        Animated.timing(characterPos, {
          toValue: {x: currentX, y: currentY},
          duration: 500,
          useNativeDriver: false,
        }),
      );
    });

    Animated.sequence(sequence).start(async () => {
      setGameState('success');
      let points = Math.max(0, 100 - secondsElapsed * 2);
      setPointsEarned(points);
      // triggerPointsAnimation(); // You can enable this
      await saveProgress(points);
      Alert.alert('Success!', `You earned ${points} points!`);
    });
  };

  // ... (runCode and other functions remain the same)
  const runCode = async () => {
    const recordedActions = [];
    const character = {
      moveRight: () => recordedActions.push('right'),
      moveLeft: () => recordedActions.push('left'),
      moveUp: () => recordedActions.push('up'),
      moveDown: () => recordedActions.push('down'),
    };

    try {
      const userCodeExecutor = new Function('character', code);
      userCodeExecutor(character);

      const isCorrect =
        JSON.stringify(recordedActions) ===
        JSON.stringify(currentLevel.expectedActions);

      if (isCorrect) {
        runCharacterAnimation(recordedActions);
      } else {
        Alert.alert(
          'Incorrect Logic',
          `The character's path wasn't right. It tried: [${recordedActions.join(
            ', ',
          )}]. Check your loop and function calls.`,
        );
      }
    } catch (error) {
      Alert.alert('Code Error', `Check your syntax. ${error.message}`);
    }
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
          progress_item: `Code Writing Game 3 - Level ${currentLevel.id} Completed`,
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

  const goToNextLevel = () => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
    } else {
      navigation.navigate('CodeWritingGamesSuccess');
      Alert.alert(
        'Congratulations!',
        'You have mastered the basics of coding!',
      );
    }
  };

  return (
    <ImageBackground
      source={require('../../pictures/backgroundimage.png')}
      style={styles.backgroundImage}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
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

          <View style={styles.gameArea}>
            <Text style={styles.promptText}>{currentLevel.prompt}</Text>
            <View
              style={styles.arena}
              onLayout={event => {
                const {width, height} = event.nativeEvent.layout;
                setArenaSize({width, height});
              }}>
              <Animated.View
                style={[styles.characterContainer, characterPos.getLayout()]}>
                <CharacterSvg />
              </Animated.View>
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
              <TouchableOpacity
                style={styles.nextButton}
                onPress={goToNextLevel}>
                <Text style={styles.buttonText}>
                  {currentLevelIndex < levels.length - 1
                    ? 'Next Level'
                    : 'Finish All Games'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {flex: 1},
  keyboardAvoidingView: {flex: 1}, // Added for keyboard
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
  gameArea: {
    minHeight: 200, // FIXED: Prevents this area from shrinking
    alignItems: 'center',
    marginBottom: 10,
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
    width: '95%',
  },
  arena: {
    flex: 1,
    width: '95%',
    backgroundColor: '#a2d2ff',
    borderWidth: 3,
    borderColor: '#005096',
    borderRadius: 10,
  },
  characterContainer: {
    position: 'absolute',
    width: 50,
    height: 75,
  },
  codingArea: {
    flex: 1, // Let this area grow and shrink
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
  exitButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default CodeWritingGameThree;
