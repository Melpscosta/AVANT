import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  StatusBar, // <--- Importe StatusBar para controlar a barra do topo
  StyleSheet,
  Text,
  View
} from 'react-native';

// Pegamos as dimensões exatas da janela do dispositivo
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

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    // ImageBackground como container raiz
    <ImageBackground 
      source={require('../../assets/backgrounds/animated_bg.gif')} 
            style={styles.fullScreenBackground}
      resizeMode="cover" // O cover estica a imagem para cobrir tudo (cropando se necessário)
    >
      {/* Torna a barra de status transparente para o GIF aparecer atrás dela */}
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Overlay Branco/Preto */}
      <View style={styles.overlay}>
        
        <View style={styles.centerContent}>
          <Image
            source={require('../../assets/images/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.barContainer}>
            <Animated.View
              style={[
                styles.barFill,
                { width: widthInterpolated }
              ]}
            />
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
  fullScreenBackground: {
    // Força bruta para ocupar a tela inteira
    width: width,
    height: height,
    position: 'absolute', // Garante que fique por cima de outras telas se for um modal
    top: 0,
    left: 0,
    zIndex: 9999,
  },
  overlay: {
    flex: 1,
    // Ajuste a opacidade aqui para ver mais ou menos do GIF
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
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
    bottom: 80, // Subi um pouco para garantir que não fique "colado" no fim da tela em iPhones novos
    fontSize: 12,
    fontFamily: 'Lexend-Light',
    color: '#6B7280',
  }
});