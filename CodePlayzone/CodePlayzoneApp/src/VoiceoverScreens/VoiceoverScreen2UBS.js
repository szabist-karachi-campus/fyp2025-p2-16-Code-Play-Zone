import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Tts from 'react-native-tts';

const VoiceoverScreen2UBS = ({ navigation }) => {
  useEffect(() => {
    // TTS Configuration
    Tts.setDefaultLanguage('en-US');
  }, []);

  const handleSpeak = (title, text) => {
    Tts.stop();
    Tts.speak(`${title}. ${text}`);
  };

  const stopVoiceover = () => {
    Tts.stop();
  };

  const handleNavigate = () => {
    navigation.navigate('PuzzleScreen');
  };


  const content = [
    {
      title: 'Definition of a program and code',
      text: 'A program is like a list of instructions that tells the computer what to do. Code is the language we use to write these instructions.',
    },
    {
      title: 'What is a compiler or interpreter?',
      text: 'When we write code, the computer doesn’t understand it directly. A compiler or interpreter is like a translator—it converts the code we write into a language the computer can understand.',
    },
    {
      title: 'Simple analogy: Comparing code to a recipe',
      text: 'Imagine you’re baking a cake. The recipe tells you what to do step by step—mix the ingredients, bake the batter, and decorate it. Code works the same way, telling the computer step by step what to do!',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.heading}>Understanding Basic Terms</Text>
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

      {/* Listen Again Button */}
      <TouchableOpacity
        style={styles.listenButton}
        onPress={() =>
          handleSpeak(
            'Understanding Basic Terms',
            content.map((item) => `${item.title}. ${item.text}`).join(' ')
          )
        }
      >
        <Text style={styles.listenButtonText}>LISTEN 🔊</Text>
      </TouchableOpacity>

      {/* Page Navigation */}
      <View style={styles.pageNumber}>
        <Text style={styles.pageText}>2/8</Text>
      </View>

      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={() => {
            stopVoiceover();
            navigation.navigate('VoiceoverScreen1IP');
          }}
        >
          <Text style={styles.navigationIcon}>⬅️</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.stopButton} onPress={stopVoiceover}>
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
            navigation.navigate('VoiceoverScreen3PS');
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
    marginTop: 20,
    alignItems: 'center',
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

export default VoiceoverScreen2UBS;
