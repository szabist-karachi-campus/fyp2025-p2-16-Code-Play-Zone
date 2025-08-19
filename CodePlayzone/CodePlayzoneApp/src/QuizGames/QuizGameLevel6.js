// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image, Alert } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// const questions = [
//   {
//     question: 'What will be printed by the following code?\n\nCode: x = 10\nif x > 5:\n    print(\"Greater\")\nelse:\n    print(\"Smaller\")\n',
//     options: [
//       'Greater',
//       'Smaller',
//       'Error'
//     ],
//     correctAnswer: 0,
//   },
//   {
//     question: 'Which of the following is a correct if-else statement?',
//     options: [
//       'if x > 10: print(\"Big\"); else: print(\"Small\")',
//       'if x > 10 print(\"Big\"); else: print(\"Small\")',
//       'if x > 10: print(\"Big\") else print(\"Small\")'
//     ],
//     correctAnswer: 0,
//   }
// ];

// const QuizGameLevel6 = () => {
//   const [selectedOptions, setSelectedOptions] = useState(Array(questions.length).fill(null));
//   const [score, setScore] = useState(0);
//   const navigation = useNavigation();

//   const handleAnswer = (questionIndex, optionIndex) => {
//     const newSelections = [...selectedOptions];
//     newSelections[questionIndex] = optionIndex;
//     setSelectedOptions(newSelections);

//     if (optionIndex === questions[questionIndex].correctAnswer) {
//       setScore(prevScore => prevScore + 1);
//     }

//     if (newSelections.every(selection => selection !== null)) {
//       Alert.alert('Level 6 Completed', `Your score: ${score + (optionIndex === questions[questionIndex].correctAnswer ? 1 : 0)}`, [
//         { text: 'Next Level', onPress: () => navigation.navigate('QuizGameLevel7') }
//       ]);
//     }
//   };

//   return (
//     <ImageBackground source={require('../../pictures/backgroundimage.png')} style={styles.backgroundImage}>
//       <View style={styles.container}>
//         <View style={styles.logoContainer}>
//           <Image source={require('../../pictures/logo.png')} style={styles.logo} />
//           <Text style={styles.appName}>CODE PLAYZONE</Text>
//           <Text style={styles.tagline}>Play, Learn, Code;</Text>
//         </View>
//         <Text style={styles.levelTitle}>Level 6: Conditional Statements</Text>
//         {questions.map((q, qIndex) => (
//           <View key={qIndex} style={styles.questionBlock}>
//             <Text style={styles.question}>{q.question}</Text>
//             {q.options.map((option, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={[
//                   styles.option,
//                   selectedOptions[qIndex] !== null && index === q.correctAnswer ? styles.correct : selectedOptions[qIndex] === index ? styles.wrong : null
//                 ]}
//                 onPress={() => handleAnswer(qIndex, index)}
//                 disabled={selectedOptions[qIndex] !== null}
//               >
//                 <Text style={styles.optionText}>{option}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         ))}
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.8)' },
//   backgroundImage: { flex: 1, resizeMode: 'cover', justifyContent: 'center' },
//   logoContainer: { alignItems: 'center', marginBottom: 20 },
//   logo: { width: 100, height: 100 },
//   appName: { fontSize: 24, fontWeight: 'bold', color: '#000' },
//   tagline: { fontSize: 18, color: '#555', marginBottom: 20 },
//   levelTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#000' },
//   questionBlock: { marginBottom: 20 },
//   question: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#333' },
//   option: { padding: 15, marginVertical: 5, backgroundColor: 'white', borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
//   optionText: { fontSize: 16 },
//   correct: { backgroundColor: 'green' },
//   wrong: { backgroundColor: 'red' },
// });

// export default QuizGameLevel6;


import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  Alert,
  Animated,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const questions = [
  {
    question: 'What will be printed by the following code?\n\nCode: x = 10\nif x > 5:\n    print("Greater")\nelse:\n    print("Smaller")\n',
    options: [
      'Greater',
      'Smaller',
      'Error'
    ],
    correctAnswer: 0,
  },
  {
    question: 'Which of the following is a correct if-else statement?',
    options: [
      'if x > 10: print("Big"); else: print("Small")',
      'if x > 10 print("Big"); else: print("Small")',
      'if x > 10: print("Big") else print("Small")'
    ],
    correctAnswer: 0,
  }
];

const QuizGameLevel6 = () => {
  const [selectedOptions, setSelectedOptions] = useState(Array(questions.length).fill(null));
  const [score, setScore] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showPointsPopup, setShowPointsPopup] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const pointsAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const triggerPointsAnimation = () => {
    setShowPointsPopup(true);
    pointsAnim.setValue(0);
    Animated.timing(pointsAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => setShowPointsPopup(false), 1000);
    });
  };

  const handleAnswer = async (questionIndex, optionIndex) => {
    const newSelections = [...selectedOptions];
    if (newSelections[questionIndex] !== null) return;

    newSelections[questionIndex] = optionIndex;
    setSelectedOptions(newSelections);

    if (optionIndex === questions[questionIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    const allAnswered = newSelections.every((selection) => selection !== null);
    if (allAnswered) {
      clearInterval(timerRef.current);

      let correctCount = 0;
      let wrongCount = 0;

      newSelections.forEach((selected, index) => {
        if (selected === questions[index].correctAnswer) {
          correctCount++;
        } else {
          wrongCount++;
        }
      });

      let basePoints = 0;
      if (secondsElapsed <= 10) basePoints = 100;
      else if (secondsElapsed <= 20) basePoints = 50;
      else if (secondsElapsed <= 30) basePoints = 25;

      let finalPoints = basePoints;
      if (wrongCount === 1) finalPoints -= 10;
      else if (wrongCount === 2) finalPoints = 0;

      finalPoints = Math.max(finalPoints, 0); // prevent negative points
      setPointsEarned(finalPoints);
      triggerPointsAnimation();

      try {
        const authToken = await AsyncStorage.getItem('auth_token');
        if (authToken) {
          const response = await fetch('http://10.0.2.2:8000/api/game/progress/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              progress_item: 'Quiz Level 6 Completed',
              points: finalPoints,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update progress.');
          }

          const storedPoints = await AsyncStorage.getItem('total_points');
          const totalPoints = (parseInt(storedPoints) || 0) + finalPoints;
          await AsyncStorage.setItem('total_points', totalPoints.toString());
        }
      } catch (error) {
        console.error('Error saving progress:', error);
        Alert.alert('Error', error.message || 'Failed to save progress.');
      }

      let reason = '';
      if (correctCount === 1) {
        reason = '\n(10 points were deducted because 1 answer was incorrect)';
      } else if (correctCount === 0) {
        reason = '\n(You earned 0 points because both answers were incorrect)';
      }

      Alert.alert(
        'Level 6 Completed',
        `Correct Answers: ${correctCount}\nYou earned ${finalPoints} points!${reason}`,
        [{ text: 'Next Level', onPress: () => navigation.navigate('QuizGameLevel7') }]
      );
    }
  };

  // --- Skip and Exit functionality ---
  const handleSkip = () => {
    Alert.alert(
      "Confirm Skip",
      "Do you want to skip this level or game?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Level", onPress: () => navigation.navigate("QuizGameLevel7") },
        { text: "Game", onPress: () => navigation.navigate("CodeWritingStart") },
      ]
    );
  };

  const handleExit = () => {
    Alert.alert(
      "Confirm Exit",
      "Are you sure you want to exit?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => navigation.navigate("QuizScreen") },
      ]
    );
  };
  // --- End Skip and Exit functionality ---

  return (
    <ImageBackground source={require('../../pictures/backgroundimage.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          <View style={styles.logoContainer}>
            <Image source={require('../../pictures/logo.png')} style={styles.logo} />
            <Text style={styles.appName}>CODE PLAYZONE</Text>
            <Text style={styles.tagline}>Play, Learn, Code;</Text>
          </View>

          <Text style={styles.levelTitle}>Level 6: Conditional Statements</Text>
          <Text style={styles.timerText}>🕒 Time Elapsed: {secondsElapsed} sec</Text>

          {questions.map((q, qIndex) => (
            <View key={qIndex} style={styles.questionBlock}>
              <Text style={styles.question}>{q.question}</Text>
              {q.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.option,
                    selectedOptions[qIndex] !== null && index === q.correctAnswer
                      ? styles.correct
                      : selectedOptions[qIndex] === index
                      ? styles.wrong
                      : null,
                  ]}
                  onPress={() => handleAnswer(qIndex, index)}
                  disabled={selectedOptions[qIndex] !== null}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>

        {/* Skip and Exit Buttons */}
        <View style={styles.buttonContainer}>
          <Text style={styles.skipButton} onPress={handleSkip}>SKIP</Text>
          <Text style={styles.exitButton} onPress={handleExit}>EXIT</Text>
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
          ]}
        >
          <Text style={styles.pointsPopupText}>+{pointsEarned} Points!</Text>
        </Animated.View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.8)'
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center'
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  logo: {
    width: 100,
    height: 100
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000'
  },
  tagline: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20
  },
  levelTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000'
  },
  timerText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20
  },
  questionBlock: {
    marginBottom: 20
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
  option: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  optionText: {
    fontSize: 16
  },
  correct: {
    backgroundColor: 'green'
  },
  wrong: {
    backgroundColor: 'red'
  },
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
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 30,
    gap: 12
  },
  skipButton: {
    flex: 1,
    color: '#1976D2',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 4,
    paddingVertical: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    overflow: 'hidden',
    textAlign: 'center',
    maxWidth: 140
  },
  exitButton: {
    flex: 1,
    color: '#FF6F61',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 4,
    paddingVertical: 10,
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    overflow: 'hidden',
    textAlign: 'center',
    maxWidth: 140
  }
});

export default QuizGameLevel6;