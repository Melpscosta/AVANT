import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { router } from 'expo-router';
import storage from '../src/services/storage';

const { width, height } = Dimensions.get('window');

export default function LoadingScreen() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }).start(() => animate());
    };
    animate();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const titulo = storage.getString("mock_meta_selecionada") || "";
      router.replace(`/trilha?titulo=${encodeURIComponent(titulo)}`);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <ImageBackground
      source={require('../assets/backgrounds/animated_bg.gif')}
      style={styles.bg}
      resizeMode="cover"
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View style={styles.overlay}>
        <View style={styles.centerContent}>
          <Image
            source={require('../assets/logos/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.barContainer}>
            <Animated.View style={[styles.barFill, { width: widthInterpolated }]} />
          </View>
        </View>

        <Text style={styles.footerText}>
          Conectando habilidades para o seu futuro...
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    width,
    height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    width: 220,
    height: 60,
    marginBottom: 40,
  },
  barContainer: {
    width: width * 0.6,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
  },
  footerText: {
    position: 'absolute',
    bottom: 80,
    fontSize: 12,
    fontFamily: 'Lexend-Light',
    color: '#6B7280',
  },
});
