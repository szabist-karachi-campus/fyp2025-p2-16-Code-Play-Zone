import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Tts from 'react-native-tts';

const VoiceoverScreen1IP = ({ navigation }) => {
  useEffect(() => {
    // TTS Configuration
    Tts.setDefaultLanguage('en-US');
  }, []);

  const handleSpeak = (title, text) => {
    Tts.stop();
    Tts.speak(`${title}. ${text}`);
  };

  const handleStop = () => {
    Tts.stop();
  };

  const handleNavigate = () => {
    navigation.navigate('PuzzleScreen');
  };

  

  const content = [
    {
      title: 'What is programming?',
      text: 'Programming is like giving instructions to a computer so it can do amazing things for us! Just like a teacher gives you instructions to solve a math problem, programmers tell computers how to solve problems using code.',
    },
    {
      title: 'Why is it important?',
      text: 'Programming helps us create things we use every day—like video games, apps on your phone, or even robots! Without programming, your favorite games and apps wouldn’t exist.',
    },
    {
      title: 'Real-world examples of programming in action',
      text: 'Programming helps us create things we use every day—like video games, apps on your phone, or even robots! Without programming, your favorite games and apps wouldn’t exist.',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.heading}>Introduction to Programming</Text>
      </View>

      {/* Content Section */}
      {content.map((item, index) => (
        <View key={index} style={styles.section}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <TouchableOpacity
              style={styles.speakerButton}
              onPress={() => handleSpeak(item.title, item.text)}
            >
              <Text style={styles.speakerIcon}>🔊</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      ))}

      {/* Listen Button */}
      <TouchableOpacity
        style={styles.listenButton}
        onPress={() =>
          handleSpeak(
            'Introduction to Programming',
            content.map((item) => `${item.title}. ${item.text}`).join(' ')
          )
        }
      >
        <Text style={styles.listenButtonText}>LISTEN 🔊</Text>
      </TouchableOpacity>

      {/* Page Navigation */}
      <View style={styles.pageNumber}>
        <Text style={styles.pageText}>1/8</Text>
      </View>

      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={() => {handleStop(); navigation.navigate('Dashboard')}}
        >
          <Text style={styles.navigationIcon}>⬅️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.stopButton}
          onPress={handleStop}
        >
          <Text style={styles.stopButtonText}>STOP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.stopButton}
          onPress={handleNavigate}
        >
          <Text style={styles.stopButtonText}>SKIP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => {handleStop(); navigation.navigate('VoiceoverScreen2UBS')}}
        >
          <Text style={styles.nextButtonText}>➡️</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6F61',
  },
  section: {
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  speakerButton: {
    marginLeft: 8,
  },
  speakerIcon: {
    fontSize: 18,
    color: '#FF6F61',
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginTop: 8,
  },
  listenButton: {
    backgroundColor: '#FF6F61',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  // listenButton: {
  //   backgroundColor: '#FF6F61',
  //   width: 100, // Set the width to your desired size
  //   height: 100, // Set the height equal to width
  //   borderRadius: 50, // Half of the width/height 
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginTop: 10,
  // },
  listenButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pageNumber: {
    alignItems: 'center',
    marginVertical: 10,
  },
  pageText: {
    fontSize: 16,
    color: '#555',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  navigationButton: {
    alignSelf: 'center',
    backgroundColor: '#E0F2F1',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationIcon: {
    fontSize: 24,
    color: '#00796B',
  },
  stopButton: {
    alignSelf: 'center',
    backgroundColor: '#E0F2F1',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButtonText: {
    fontSize: 16,
    color: '#ff',
    fontWeight: 'bold',
  },
  nextButton: {
    alignSelf: 'center',
    backgroundColor: '#E0F2F1',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 24,
    color: '#00796B',
  },
});

export default VoiceoverScreen1IP;
