import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {captureRef} from 'react-native-view-shot';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';

const {width, height} = Dimensions.get('window');

const CertificateScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const certificateRef = React.useRef();

  useEffect(() => {
    fetchUserInfo();
    requestStoragePermission();
  }, []);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to storage to save certificates',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const response = await fetch('http://10.0.2.2:8000/api/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      const userData = await response.json();
      if (response.ok && userData.username) {
        setUsername(userData.username);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const downloadCertificateAsImage = async () => {
    try {
      setIsGenerating(true);

      const uri = await captureRef(certificateRef, {
        format: 'jpg',
        quality: 1,
      });

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `CodePlayzone_Certificate_${username}_${timestamp}.jpg`;

      let downloadPath;
      if (Platform.OS === 'android') {
        downloadPath = `${RNFS.DownloadDirectoryPath}/${filename}`;
      } else {
        downloadPath = `${RNFS.DocumentDirectoryPath}/${filename}`;
      }

      await RNFS.copyFile(uri, downloadPath);

      setIsGenerating(false);

      Alert.alert(
        'Certificate Downloaded!',
        `Your certificate has been saved as:\n${filename}`,
        [
          {
            text: 'OK',
            onPress: () => console.log('Certificate downloaded successfully'),
          },
        ],
      );
    } catch (error) {
      setIsGenerating(false);
      console.error('Error generating certificate:', error);
      Alert.alert('Error', 'Failed to download certificate');
    }
  };

  const downloadCertificateAsPDF = async () => {
    try {
      setIsGenerating(true);

      // First capture the certificate as base64
      const uri = await captureRef(certificateRef, {
        format: 'jpg',
        quality: 1,
        result: 'base64',
      });

      // Create simple HTML content with just the certificate image in landscape
      const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @page {
          size: A4 landscape;
          margin: 0;
        }
        body {
          margin: 0;
          padding: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .certificate-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      </style>
    </head>
    <body>
      <img src="data:image/jpeg;base64,${uri}" class="certificate-image" alt="Certificate" />
    </body>
    </html>
    `;

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `CodePlayzone_Certificate_${username}_${timestamp}`;

      // Generate PDF to a temporary location first
      const options = {
        html: htmlContent,
        fileName: filename,
        directory: 'Documents',
        width: 842, // A4 width in landscape (points)
        height: 595, // A4 height in landscape (points)
      };

      const pdf = await RNHTMLtoPDF.convert(options);

      // Move the PDF to the public Downloads folder
      const publicDownloadPath = `${RNFS.DownloadDirectoryPath}/${filename}.pdf`;

      // Copy the generated PDF to the public Downloads folder
      await RNFS.copyFile(pdf.filePath, publicDownloadPath);

      // Delete the temporary file
      try {
        await RNFS.unlink(pdf.filePath);
      } catch (deleteError) {
        console.log('Could not delete temporary file:', deleteError);
      }

      setIsGenerating(false);

      Alert.alert(
        'PDF Certificate Generated!',
        `Your certificate PDF has been saved to Downloads folder as:\n${filename}.pdf`,
        [
          {
            text: 'OK',
            onPress: () =>
              console.log('PDF Certificate generated successfully'),
          },
        ],
      );
    } catch (error) {
      setIsGenerating(false);
      console.error('Error generating PDF certificate:', error);
      Alert.alert('Error', 'Failed to generate PDF certificate');
    }
  };

  const showDownloadOptions = () => {
    Alert.alert('Download Certificate', 'Choose your preferred format:', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Download as Image',
        onPress: downloadCertificateAsImage,
      },
      {
        text: 'Download as PDF',
        onPress: downloadCertificateAsPDF,
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Certificate</Text>
      </View>

      {/* Certificate Container - This will be captured */}
      <View style={styles.certificateWrapper}>
        <View ref={certificateRef} style={styles.certificateContainer}>
          {/* Your Certificate Background Image */}
          <Image
            source={require('../pictures/certificateempty.png')}
            style={styles.certificateBackground}
            resizeMode="contain"
          />

          {/* Username Overlay - Positioned where "Customized Name" appears */}
          <View style={styles.nameOverlay}>
            <Text style={styles.userName}>{username}</Text>
          </View>
        </View>
      </View>

      {/* Congratulations Message */}
      <View style={styles.messageContainer}>
        <Text style={styles.congratsTitle}>🎉 Congratulations! 🎉</Text>
        <Text style={styles.congratsMessage}>
          You have successfully completed all games in Code Playzone!
        </Text>
      </View>

      {/* Download Button */}
      <TouchableOpacity
        style={[
          styles.downloadButton,
          isGenerating && styles.downloadButtonDisabled,
        ]}
        onPress={showDownloadOptions}
        disabled={isGenerating}>
        {isGenerating ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#fff" size="small" />
            <Text style={styles.loadingText}>Generating...</Text>
          </View>
        ) : (
          <Text style={styles.downloadButtonText}>📱 Download Certificate</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: '#FF6F61',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginRight: 50,
  },
  certificateWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  certificateContainer: {
    width: width * 0.9,
    aspectRatio: 1.4,
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  certificateBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  nameOverlay: {
    position: 'absolute',
    top: '45%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 26,
    fontWeight: '400',
    color: '#333',
    // color: '#4A90A4',
    fontFamily: 'monospace',
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  congratsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6F61',
    marginBottom: 10,
    textAlign: 'center',
  },
  congratsMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  downloadButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 3,
  },
  downloadButtonDisabled: {
    backgroundColor: '#ccc',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default CertificateScreen;
