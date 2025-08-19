import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Tts from 'react-native-tts';

const VoiceoverScreen5AO = ({ navigation }) => {
  useEffect(() => {
    // TTS Configuration
    Tts.setDefaultLanguage('en-US');
  }, []);

  const speakText = (text) => {
    Tts.stop();
    Tts.speak(text);
  };

  const stopVoiceover = () => {
    Tts.stop();
  };

  const handleNavigate = () => {
    navigation.navigate('PuzzleScreen');
  };


  const content = [
    {
      title: 'Basic operations: Addition, Subtraction, Multiplication, and Division',
      text: 'Programming can do math too! We can add (+), subtract (-), multiply (*), and divide (/). For example, 2 + 2 will give you 4!',
    },
    {
      title: 'Using programming to solve math problems',
      text: 'You can write code to solve problems like this: \n\nprint(10 * 5)\n\nThis will multiply 10 and 5, and the computer will show the answer: 50. Isn\'t that cool?',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.heading}>Arithmetic Operations</Text>
      </View>

      {/* Content Section */}
      {content.map((item, index) => (
        <View key={index} style={styles.section}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <TouchableOpacity
              style={styles.speakerButton}
              onPress={() => speakText(item.text)}
            >
              <Text style={styles.speakerIcon}>🔊</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      ))}

      {/* Listen Again Button */}
      <TouchableOpacity
        style={styles.listenButton}
        onPress={() =>
          speakText(
            content.map((item) => `${item.title}. ${item.text}`).join(' ')
          )
        }
      >
        <Text style={styles.listenButtonText}>LISTEN 🔊</Text>
      </TouchableOpacity>

      {/* Page Navigation */}
      <View style={styles.pageNumber}>
        <Text style={styles.pageText}>5/8</Text>
      </View>

      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={() => {
            stopVoiceover();
            navigation.navigate('VoiceoverScreen4Variables');
          }}
        >
          <Text style={styles.navigationIcon}>⬅️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.stopButton}
          onPress={stopVoiceover}
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
          onPress={() => {
            stopVoiceover();
            navigation.navigate('VoiceoverScreen6CS');
          }}
        >
          <Text style={styles.nextButtonText}>➡️</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    alignItems: 'center',
    marginTop: 20,
  },
  navigationButton: {
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

export default VoiceoverScreen5AO;
