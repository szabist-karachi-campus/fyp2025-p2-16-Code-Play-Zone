import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import App from './App'; // Correct path for App.js
import LandingScreen from './LandingScreen'; // Correct path for LandingScreen.js
import SignIn from './SignIn';
import SignUp from './SignUp';
import Dashboard from './Dashboard';
import SocialScreen from './SocialScreen';
import VoiceoverScreen1IP from './VoiceoverScreens/VoiceoverScreen1IP';
import VoiceoverScreen2UBS from './VoiceoverScreens/VoiceoverScreen2UBS';
import VoiceoverScreen3PS from './VoiceoverScreens/VoiceoverScreen3PS';
import VoiceoverScreen4Variables from './VoiceoverScreens/VoiceoverScreen4Variables';
import VoiceoverScreen5AO from './VoiceoverScreens/VoiceoverScreen5AO';
import VoiceoverScreen6CS from './VoiceoverScreens/VoiceoverScreen6CS';
import VoiceoverScreen7Loops from './VoiceoverScreens/VoiceoverScreen7Loops';
import VoiceoverScreen8Functions from './VoiceoverScreens/VoiceoverScreen8Functions';
import PuzzleScreen from './PuzzleGames/PuzzleScreen';
import PuzzleGame1PS from './PuzzleGames/PuzzleGame1PS';
import PuzzleGame2Variables from './PuzzleGames/PuzzleGame2Variables';
import PuzzleGame3AO from './PuzzleGames/PuzzleGame3AO';
import PuzzleGame4CS from './PuzzleGames/PuzzleGame4CS';
import PuzzleGame5Loops from './PuzzleGames/PuzzleGame5Loops';
import PuzzleGame6Functions from './PuzzleGames/PuzzleGame6Functions';
import PuzzleGamesSuccess from './PuzzleGames/PuzzleGamesSuccess';
import QuizScreen from './QuizGames/QuizScreen';
import QuizGameLevel1 from './QuizGames/QuizGameLevel1';
import QuizGameLevel2 from './QuizGames/QuizGameLevel2';
import QuizGameLevel3 from './QuizGames/QuizGameLevel3';
import QuizGameLevel4 from './QuizGames/QuizGameLevel4';
import QuizGameLevel5 from './QuizGames/QuizGameLevel5';
import QuizGameLevel6 from './QuizGames/QuizGameLevel6';
import QuizGameLevel7 from './QuizGames/QuizGameLevel7';
import QuizGameLevel8 from './QuizGames/QuizGameLevel8';
import QuizGamesSuccess from './QuizGames/QuizGamesSuccess';
import CodeWritingGameOne from './CodeWritingGames/CodeWritingGameOne'; 
import CodeWritingGameTwo from './CodeWritingGames/CodeWritingGameTwo';
import CodeWritingGameThree from './CodeWritingGames/CodeWritingGameThree';
import CodeWritingStart from './CodeWritingGames/CodeWritingStart';
import CodeWritingScreen from './CodeWritingGames/CodeWritingScreen';
import CodeWritingGamesSuccess from './CodeWritingGames/CodeWritingGamesSuccess';
import CertificateScreen from './Certificate';
// import CodeWritingGameTwo from './CodeWritingGames/CodeWritingGameTwo';
// import CodeWritingGameThree from './CodeWritingGames/CodeWritingGameThree';

const Stack = createStackNavigator();

export default function Main() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="App" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="App" component={App} options={{ headerShown: false }} />
        <Stack.Screen name="LandingScreen" component={LandingScreen} options={{ headerShown: false }}/> 
        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }}/> 
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }}/> 
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }}/> 
        <Stack.Screen name="SocialScreen" component={SocialScreen} options={{ title: 'Social' }} />
        <Stack.Screen name="VoiceoverScreen1IP" component={VoiceoverScreen1IP} options={{ headerShown: false }}/> 
        <Stack.Screen name="VoiceoverScreen2UBS" component={VoiceoverScreen2UBS} options={{ headerShown: false }}/> 
        <Stack.Screen name="VoiceoverScreen3PS" component={VoiceoverScreen3PS} options={{ headerShown: false }}/> 
        <Stack.Screen name="VoiceoverScreen4Variables" component={VoiceoverScreen4Variables} options={{ headerShown: false }}/> 
        <Stack.Screen name="VoiceoverScreen5AO" component={VoiceoverScreen5AO} options={{headerShown: false }}/>
        <Stack.Screen name="VoiceoverScreen6CS" component={VoiceoverScreen6CS} options={{headerShown: false }}/>
        <Stack.Screen name="VoiceoverScreen7Loops" component={VoiceoverScreen7Loops} options={{headerShown: false }}/>
        <Stack.Screen name="VoiceoverScreen8Functions" component={VoiceoverScreen8Functions} options={{headerShown: false}}/>
        <Stack.Screen name="PuzzleScreen" component={PuzzleScreen} options={{headerShown: false}}/>
        <Stack.Screen name="PuzzleGame1PS" component={PuzzleGame1PS} options={{headerShown: false}}/>
        <Stack.Screen name="PuzzleGame2Variables" component={PuzzleGame2Variables} options={{headerShown: false}}/>
        <Stack.Screen name="PuzzleGame3AO" component={PuzzleGame3AO} options={{headerShown: false}}/>
        <Stack.Screen name="PuzzleGame4CS" component={PuzzleGame4CS} options={{headerShown: false}}/>      
        <Stack.Screen name="PuzzleGame5Loops" component={PuzzleGame5Loops} options={{headerShown: false}}/>
        <Stack.Screen name="PuzzleGame6Functions" component={PuzzleGame6Functions} options={{headerShown: false}}/>
        <Stack.Screen name="PuzzleGamesSuccess" component={PuzzleGamesSuccess} options={{headerShown: false}}/>
        <Stack.Screen name="QuizScreen" component={QuizScreen} options={{headerShown: false}}/>
        <Stack.Screen name="QuizGameLevel1" component={QuizGameLevel1} options={{headerShown: false}}/>
        <Stack.Screen name="QuizGameLevel2" component={QuizGameLevel2} options={{headerShown: false}}/>
        <Stack.Screen name="QuizGameLevel3" component={QuizGameLevel3} options={{headerShown: false}}/>
        <Stack.Screen name="QuizGameLevel4" component={QuizGameLevel4} options={{headerShown: false}}/>
        <Stack.Screen name="QuizGameLevel5" component={QuizGameLevel5} options={{headerShown: false}}/>
        <Stack.Screen name="QuizGameLevel6" component={QuizGameLevel6} options={{headerShown: false}}/>
        <Stack.Screen name="QuizGameLevel7" component={QuizGameLevel7} options={{headerShown: false}}/>
        <Stack.Screen name="QuizGameLevel8" component={QuizGameLevel8} options={{headerShown: false}}/>
        <Stack.Screen name="QuizGamesSuccess" component={QuizGamesSuccess} options={{headerShown: false}}/>
        <Stack.Screen name="CodeWritingStart" component={CodeWritingStart} options={{headerShown: false}}/>
        <Stack.Screen name="CodeWritingScreen" component={CodeWritingScreen} options={{headerShown: false}}/>
        <Stack.Screen name="CodeWritingGamesSuccess" component={CodeWritingGamesSuccess} options={{headerShown: false}}/>
        <Stack.Screen name="CodeWritingGameOne" component={CodeWritingGameOne} options={{headerShown: false}}/>
        <Stack.Screen name="CodeWritingGameTwo" component={CodeWritingGameTwo} options={{headerShown: false}}/> 
        <Stack.Screen name="CodeWritingGameThree" component={CodeWritingGameThree} options={{headerShown: false}}/>
        <Stack.Screen name="CertificateScreen" component={CertificateScreen} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
