// import React, { useState } from 'react';
// import { StyleSheet, Text, View, Alert, PanResponder, Animated } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';


// const PuzzleGame5Loops = ({ navigation }) => {
  // const initialPositionsPlain = {
  //   'print(5)': { x: 10, y: 10 },
  //   'i': { x: 110, y: 10 },
  //   'i==5;': { x: 210, y: 10 },
  //   'in': { x: 310, y: 10 },
  //   'run()': { x: 10, y: 90 },
  //   'walk()': { x: 110, y: 90 },
  //   'range(5):': { x: 210, y: 90 },
  //   'jump()': { x: 310, y: 90 },
  //   '01234': { x: 10, y: 170 },
  //   'print(i)': { x: 110, y: 170 },
  //   'for': { x: 210, y: 170 },
  //   'range(6):': { x: 310, y: 170 },
  //   'i<5:' : { x: 110, y: 250 },
  //   'i>5:' : { x: 210, y: 250 },   
  // };

//   const initialPositions = Object.fromEntries(
//     Object.entries(initialPositionsPlain).map(([key, pos]) => [key, new Animated.ValueXY(pos)])
//   );

//   const [blockPositions] = useState(initialPositions);
//   const [placedBlocks, setPlacedBlocks] = useState([]);
//   const [dropZoneDimensions, setDropZoneDimensions] = useState(null);
  

  // const requiredBlocksOptions = ['for', 'i', 'in', 'range(5):', 'print(i)'];

//   const handleDrop = (blockText, dropZoneY) => {
//            if (dropZoneDimensions) {
//              const { y, height } = dropZoneDimensions;
//              if (dropZoneY >= y && dropZoneY <= y + height) {
//                setPlacedBlocks((prevBlocks) => {
//                  if (!prevBlocks.includes(blockText)) {
//                    return [...prevBlocks, blockText];
//                  }
//                  return prevBlocks;
//                });
//              }
//            }
         
//            Animated.spring(blockPositions[blockText], {
//              toValue: initialPositionsPlain[blockText], // Return to original position
//              useNativeDriver: false,
//            }).start();
//          };

//   const panResponders = {};
//   Object.keys(blockPositions).forEach((blockText) => {
//     panResponders[blockText] = PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onPanResponderGrant: () => {
//         blockPositions[blockText].setOffset({
//           x: blockPositions[blockText].x._value,
//           y: blockPositions[blockText].y._value,
//         });
//         blockPositions[blockText].setValue({ x: 0, y: 0 });
//       },
//       onPanResponderMove: Animated.event(
//         [null, { dx: blockPositions[blockText].x, dy: blockPositions[blockText].y }],
//         { useNativeDriver: false }
//       ),
//       onPanResponderRelease: (evt, gestureState) => {
//         blockPositions[blockText].flattenOffset();
//         handleDrop(blockText, gestureState.moveY);
//       },
//     });
//   });

//   const handleCheck = async () => {
//     try {
//       const authToken = await AsyncStorage.getItem('auth_token');
  
//       if (!authToken) {
//         Alert.alert('Error', 'You need to log in to save your progress.');
//         return;
//       }
  
//       const isSolutionCorrect = (() => {
//         if (Array.isArray(requiredBlocksOptions[0])) {
//           // Handle case where requiredBlocksOptions is an array of arrays
//           return requiredBlocksOptions.some(
//             (option) =>
//               Array.isArray(option) &&
//               option.length === placedBlocks.length &&
//               option.every((block, index) => block === placedBlocks[index])
//           );
//         } else {
//           // Handle case where requiredBlocksOptions is a flat array
//           return (
//             Array.isArray(requiredBlocksOptions) &&
//             requiredBlocksOptions.length === placedBlocks.length &&
//             requiredBlocksOptions.every((block, index) => block === placedBlocks[index])
//           );
//         }
//       })();
  
//       if (isSolutionCorrect) {
//         try {
//           const response = await fetch('http://10.0.2.2:8000/api/game/progress/add', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Bearer ${authToken}`,
//             },
//             body: JSON.stringify({ progress_item: 'Puzzle Level 5 Completed' }),
//           });
  
//           if (response.ok) {
//             const data = await response.json();
//             console.log('Progress updated successfully:', data);
//             Alert.alert('Success', 'You placed the correct blocks in the correct order!');
//             navigation.navigate('PuzzleGame6Functions');
//           } else {
//             const errorData = await response.json();
//             console.error('Failed to update progress:', errorData);
//             Alert.alert('Error', errorData.message || 'Failed to update progress. Please try again.');
//           }
//         } catch (error) {
//           console.error('Error updating progress:', error);
//           Alert.alert('Error', 'An error occurred while updating progress. Please try again.');
//         }
//       } else {
//         Alert.alert('Incorrect', 'Wrong blocks. Make sure to place the correct blocks in order.');
//       }
//     } catch (error) {
//       console.error('Error in handleCheck:', error);
//       Alert.alert('Error', 'An unexpected error occurred. Please try again.');
//     }
//   };
  
  

//   const handleReset = () => {
//     setPlacedBlocks([]);
//     Object.keys(initialPositionsPlain).forEach((blockText) => {
//       blockPositions[blockText].setValue(initialPositionsPlain[blockText]);
//     });
//   };

//   const handleExit = () => {
//         Alert.alert(
//           "Confirm Exit", // Title
//           "Are you sure you want to exit?", // Message
//           [
//             {
//               text: "Cancel",
//               style: "cancel",
//             },
//             {
//               text: "Yes",
//               onPress: () => navigation.navigate("PuzzleScreen"),
//             },
//           ],
//           { cancelable: false }
//         );
//       };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Loops</Text>
//       <Text style={styles.objective}>Objective</Text>
//       <Text style={styles.instruction}>
//         Drag and arrange blocks to create logic where the first five numbers (0-4) are printed using a loop.
//       </Text>

//       <View style={styles.dropZone}
//          onLayout={(event) => {
//           const { y, height } = event.nativeEvent.layout;
//            setDropZoneDimensions({ y, height });
//           }}
//           >
//         <Text style={styles.dropZoneText}>
          
//         {placedBlocks.length
//             ? `You placed:\n${placedBlocks
//               .map((block, index) =>
//               (block === 'print(i)') && index !== 0
//               ? `\n${block}` // Add newline only if it's not the first block
//               : block
//             )
//         .join(' ')}` // Join everything into a single string
//         : 'Drop Blocks over here'}
//               </Text>
//       </View>

//       <View style={styles.draggableContainer}>
//         {Object.keys(blockPositions).map((blockText, index) => (
//           <Animated.View
//             key={index}
//             style={[blockPositions[blockText].getLayout(), styles.draggableBlock]}
//             {...panResponders[blockText].panHandlers}
//           >
//             <Text style={styles.blockText}>
//               {placedBlocks.includes(blockText) ? `★ ${blockText}` : blockText}
//             </Text>
//           </Animated.View>
//         ))}
//       </View>

//       <View style={styles.buttonContainer}>
//        <Text style={styles.checkButton} onPress={handleCheck}>
//           CHECK
//        </Text>
//         <Text style={styles.resetButton} onPress={handleReset}>
//            RESET
//          </Text>
//          <Text style={styles.exitButton} onPress={handleExit}>
//             EXIT
//           </Text>
//          </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#FF5733',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   objective: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FF5733',
//   },
//   instruction: {
//     fontSize: 16,
//     marginVertical: 10,
//     color: '#555',
//   },
//   dropZone: {
//     height: 100,
//     borderWidth: 2,
//     borderColor: '#FFA500',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 50,
//   },
//   dropZoneText: {
//     fontSize: 16,
//     color: '#FFA500',
//   },
//   draggableContainer: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//   },
//   draggableBlock: {
//     position: 'absolute',
//     width: 80,
//     height: 80,
//     backgroundColor: '#f0ad4e',
//     borderRadius: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   blockText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   buttonContainer: {
//     position: 'absolute',
//     bottom: 50,
//     width: '100%',
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   checkButton: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     backgroundColor: '#FF5733',
//     color: '#fff',
//     padding: 10,
//     borderRadius: 5,
//   },
//   resetButton: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     backgroundColor: '#555',
//     color: '#fff',
//     padding: 10,
//     borderRadius: 5,
//   },
//   exitButton: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     backgroundColor: '#d9534f',
//     color: '#fff',
//     padding: 10,
//     borderRadius: 5,
//   },
// });

// export default PuzzleGame5Loops;

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, Alert, PanResponder, Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PuzzleGame5Loops = ({ navigation }) => {
  const initialPositionsPlain = {
    'print(5)': { x: 10, y: 10 },
    'i': { x: 110, y: 10 },
    'i==5;': { x: 210, y: 10 },
    'in': { x: 310, y: 10 },
    'run()': { x: 10, y: 90 },
    'walk()': { x: 110, y: 90 },
    'range(5):': { x: 210, y: 90 },
    'jump()': { x: 310, y: 90 },
    '01234': { x: 10, y: 170 },
    'print(i)': { x: 110, y: 170 },
    'for': { x: 210, y: 170 },
    'range(6):': { x: 310, y: 170 },
    'i<5:': { x: 110, y: 250 },
    'i>5:': { x: 210, y: 250 },
  };

  const initialPositions = Object.fromEntries(
    Object.entries(initialPositionsPlain).map(([key, pos]) => [key, new Animated.ValueXY(pos)])
  );

  const [blockPositions] = useState(initialPositions);
  const [placedBlocks, setPlacedBlocks] = useState([]);
  const [dropZoneDimensions, setDropZoneDimensions] = useState(null);

  // Allow multiple correct solutions by using an array of arrays
  const requiredBlocksOptions = [
    ['for', 'i', 'in', 'range(5):', 'print(i)'],
    // Add more arrays here for other valid solutions if needed
  ];

  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const timerRef = useRef(null);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showPoints, setShowPoints] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Timer effect
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  // Fade in-out animation for points
  const triggerPointsAnimation = () => {
    setShowPoints(true);
    fadeAnim.setValue(1);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => setShowPoints(false));
  };

  const handleDrop = (blockText, dropZoneY) => {
    if (dropZoneDimensions) {
      const { y, height } = dropZoneDimensions;
      if (dropZoneY >= y && dropZoneY <= y + height) {
        setPlacedBlocks((prevBlocks) => {
          if (!prevBlocks.includes(blockText)) {
            return [...prevBlocks, blockText];
          }
          return prevBlocks;
        });
      }
    }

    Animated.spring(blockPositions[blockText], {
      toValue: initialPositionsPlain[blockText],
      useNativeDriver: false,
    }).start();
  };

  const panResponders = {};
  Object.keys(blockPositions).forEach((blockText) => {
    panResponders[blockText] = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        blockPositions[blockText].setOffset({
          x: blockPositions[blockText].x._value,
          y: blockPositions[blockText].y._value,
        });
        blockPositions[blockText].setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: blockPositions[blockText].x, dy: blockPositions[blockText].y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (evt, gestureState) => {
        blockPositions[blockText].flattenOffset();
        handleDrop(blockText, gestureState.moveY);
      },
    });
  });

  const handleCheck = async () => {
    try {
      const authToken = await AsyncStorage.getItem('auth_token');
      if (!authToken) {
        Alert.alert('Error', 'You need to log in to save your progress.');
        return;
      }

      // Check if placedBlocks matches any of the arrays in requiredBlocksOptions
      const isSolutionCorrect = requiredBlocksOptions.some(
        (option) =>
          Array.isArray(option) &&
          option.length === placedBlocks.length &&
          option.every((block, index) => block === placedBlocks[index])
      );

      if (isSolutionCorrect) {
        clearInterval(timerRef.current);

        // Calculate points
        let points = 0;
        if (secondsElapsed <= 10) points = 100;
        else if (secondsElapsed <= 20) points = 50;
        else if (secondsElapsed <= 30) points = 25;

        setPointsEarned(points);
        triggerPointsAnimation();

        // Update backend
        const progressResponse = await fetch('http://10.0.2.2:8000/api/game/progress/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ progress_item: 'Puzzle Level 5 Completed', points }),
        });

        if (!progressResponse.ok) {
          const errorData = await progressResponse.json();
          throw new Error(errorData.message || 'Failed to update progress.');
        }

        // Save points locally
        const storedPoints = await AsyncStorage.getItem('total_points');
        const totalPoints = (parseInt(storedPoints) || 0) + points;
        await AsyncStorage.setItem('total_points', totalPoints.toString());

        Alert.alert('Success', `You earned ${points} points!`);
        navigation.navigate('PuzzleGame6Functions');
      } else {
        Alert.alert('Incorrect', 'Wrong blocks. Make sure to place the correct blocks in order.');
      }
    } catch (error) {
      console.error('Check error:', error);
      Alert.alert('Error', error.message || 'Something went wrong!');
    }
  };

  const handleReset = () => {
    setPlacedBlocks([]);
    setSecondsElapsed(0);
    Object.keys(initialPositionsPlain).forEach((blockText) => {
      blockPositions[blockText].setValue(initialPositionsPlain[blockText]);
    });
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
  };

  const handleExit = () => {
    Alert.alert("Confirm Exit", "Are you sure you want to exit?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: () => navigation.navigate("PuzzleScreen") },
    ]);
  };

  const handleSkip = () => {
    Alert.alert("Confirm Skip", "Do you want to skip this level or game?", [
      { text: "Cancel", style: "cancel" },
      { text: "Level", onPress: () => navigation.navigate("PuzzleGame6Functions") },
      { text: "Game", onPress: () => navigation.navigate("QuizScreen") },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Loops</Text>
      <Text style={styles.objective}>Objective</Text>
      <Text style={styles.instruction}>
        Drag and arrange blocks to create logic where the first five numbers (0-4) are printed using a loop.
      </Text>
      <Text style={styles.timer}>🕒 Time: {secondsElapsed}s</Text>

      <View style={styles.dropZone}
        onLayout={(event) => {
          const { y, height } = event.nativeEvent.layout;
          setDropZoneDimensions({ y, height });
        }}
      >
        <Text style={styles.dropZoneText}>
          {placedBlocks.length
            ? `You placed:\n${placedBlocks
                .map((block, index) =>
                  (block === 'print(i)') && index !== 0
                    ? `\n${block}`
                    : block
                )
                .join(' ')}`
            : 'Drop Blocks over here'}
        </Text>
      </View>

      <View style={styles.draggableContainer}>
        {Object.keys(blockPositions).map((blockText, index) => (
          <Animated.View
            key={index}
            style={[blockPositions[blockText].getLayout(), styles.draggableBlock]}
            {...panResponders[blockText].panHandlers}
          >
            <Text style={styles.blockText}>
              {placedBlocks.includes(blockText) ? `★ ${blockText}` : blockText}
            </Text>
          </Animated.View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Text style={styles.checkButton} onPress={handleCheck}>
          CHECK
        </Text>
        <Text style={styles.resetButton} onPress={handleReset}>
          RESET
        </Text>
        <Text style={styles.resetButton} onPress={handleSkip}>SKIP</Text>
        <Text style={styles.exitButton} onPress={handleExit}>
          EXIT
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#FF5733', textAlign: 'center', marginBottom: 20 },
  objective: { fontSize: 18, fontWeight: 'bold', color: '#FF5733' },
  instruction: { fontSize: 16, marginVertical: 10, color: '#555' },
  timer: { fontSize: 16, color: '#008080', marginBottom: 10, fontWeight: 'bold' },
  dropZone: {
    height: 100,
    borderWidth: 2,
    borderColor: '#FFA500',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 50,
  },
  dropZoneText: { fontSize: 16, color: '#FFA500' },
  draggableContainer: { flex: 1, justifyContent: 'flex-start', alignItems: 'center' },
  draggableBlock: {
    position: 'absolute',
    width: 80,
    height: 80,
    backgroundColor: '#f0ad4e',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockText: { color: '#fff', fontWeight: 'bold' },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  checkButton: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#FF5733',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
  resetButton: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#555',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
  exitButton: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#d9534f',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
  pointsBubble: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: '#28a745',
    padding: 20,
    borderRadius: 20,
    zIndex: 10,
  },
  pointsText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default PuzzleGame5Loops;
