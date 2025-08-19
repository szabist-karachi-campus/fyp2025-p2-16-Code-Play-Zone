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

// Updated Level configurations
const levels = [
  {
    id: 1,
    title: 'Print Statements',
    prompt:
      'Make the character say "Hello, everyone!" using the print() command.',
    initialCode: 'print("")',
    validate: (output, vars) =>
      output.length === 1 &&
      output[0].toLowerCase().trim() === 'hello, everyone!',
  },
  {
    id: 2,
    title: 'Variables',
    prompt: 'Good job! Now, create three variables: a = 10, b = 5, and c = 2.',
    initialCode: 'a = \nb = ',
    validate: (output, vars) => vars.a === 10 && vars.b === 5 && vars.c === 2,
  },
  {
    id: 3,
    title: 'Arithmetic Operations',
    prompt: 'Excellent! Now, print the result of the expression: a * b + c',
    initialCode: 'print()',
    validate: (output, vars) => output.length === 1 && Number(output[0]) === 52,
  },
];

const CodeWritingGameOne = () => {
  const navigation = useNavigation();
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [code, setCode] = useState('');
  const [variables, setVariables] = useState({});
  const [characterMessage, setCharacterMessage] = useState('');
  const [gameState, setGameState] = useState('playing'); // playing, success

  // State for timer and points, consistent with other games
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showPointsPopup, setShowPointsPopup] = useState(false);
  const timerRef = useRef(null);
  const pointsAnim = useRef(new Animated.Value(0)).current;
  const bubbleOpacity = useRef(new Animated.Value(0)).current;

  const currentLevel = levels[currentLevelIndex];

  useEffect(() => {
    // Start timer when component mounts
    timerRef.current = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    // Reset state for the new level
    const newLevel = levels[currentLevelIndex];
    setCode(newLevel.initialCode);
    setCharacterMessage('');
    setGameState('playing');
    bubbleOpacity.setValue(0);
    // Reset timer for each level
    setSecondsElapsed(0);
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

  const showBubble = message => {
    setCharacterMessage(message);
    Animated.timing(bubbleOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const runCode = async () => {
    try {
      const lines = code.split('\n');
      const outputs = [];
      let tempVariables = {...variables}; // Use variables from previous levels

      lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('print')) {
          const match = trimmedLine.match(/print\((.*)\)/);
          if (match && match[1]) {
            const valueToPrint = new Function(
              ...Object.keys(tempVariables),
              `return ${match[1]}`,
            )(...Object.values(tempVariables));
            outputs.push(String(valueToPrint));
          }
        } else if (trimmedLine.includes('=')) {
          const parts = trimmedLine.split('=').map(s => s.trim());
          const varName = parts[0];
          const varValue = parts[1];
          if (varName && varValue && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varName)) {
            tempVariables[varName] = new Function(
              ...Object.keys(tempVariables),
              `return ${varValue}`,
            )(...Object.values(tempVariables));
          }
        }
      });

      if (currentLevel.validate(outputs, tempVariables)) {
        setGameState('success');
        setVariables(tempVariables); // Persist variables for next level
        const message =
          outputs.length > 0 ? outputs.join('\n') : 'Task Complete!';
        showBubble(message);

        // Calculate and award points
        let points = 0;
        if (secondsElapsed <= 10) points = 100;
        else if (secondsElapsed <= 20) points = 50;
        else if (secondsElapsed <= 30) points = 25;
        setPointsEarned(points);
        triggerPointsAnimation();

        await saveProgress(points);
        Alert.alert('Success!', `You earned ${points} points!`);
      } else {
        Alert.alert(
          'Incorrect',
          "That's not quite right. Check your code and try again!",
        );
        bubbleOpacity.setValue(0);
      }
    } catch (error) {
      Alert.alert(
        'Code Error',
        `Something went wrong. Please check your syntax.\nError: ${error.message}`,
      );
      bubbleOpacity.setValue(0);
    }
  };

  const goToNextLevel = () => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
    } else {
      navigation.navigate('CodeWritingGameTwo'); // Navigate to the next game
      Alert.alert(
        'Congratulations!',
        'You have completed this set of challenges!',
      );
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
          progress_item: `Code Writing Game 1 - Level ${currentLevel.id} Completed`,
          points: points,
        }),
      });

      const storedPoints = await AsyncStorage.getItem('total_points');
      const totalPoints = (parseInt(storedPoints) || 0) + points;
      await AsyncStorage.setItem('total_points', totalPoints.toString());
    } catch (error) {
      console.error('Failed to save progress:', error);
      Alert.alert('Error', 'Failed to save progress.');
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
          {/* Replace Image with CharacterSvg */}
          <CharacterSvg width={80} height={120} style={styles.character} />
          {characterMessage ? (
            <Animated.View
              style={[styles.speechBubble, {opacity: bubbleOpacity}]}>
              <Text style={styles.bubbleText}>{characterMessage}</Text>
            </Animated.View>
          ) : null}
        </View>

        <View style={styles.codingArea}>
          <TextInput
            style={styles.codeInput}
            multiline
            value={code}
            onChangeText={setCode}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Write your code here..."
            placeholderTextColor="#555"
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
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
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
  character: {
    width: 80,
    height: 120,
    resizeMode: 'contain',
  },
  speechBubble: {
    position: 'absolute',
    top: 60,
    right: 40,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    maxWidth: '50%',
    borderWidth: 2,
    borderColor: '#005096',
  },
  bubbleText: {fontSize: 14, color: '#000'},
  codingArea: {
    flex: 0.6,
    padding: 5,
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
export default CodeWritingGameOne;
