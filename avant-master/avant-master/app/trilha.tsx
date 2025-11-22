import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Importamos o Hook do Contexto
import { Modulo, useTrilha } from '../src/context/TrilhaContext';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.40;

// Grid Background Visual
const GridBackground = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={{flexDirection:'row', justifyContent:'space-between', height:'100%'}}>
      {[...Array(6)].map((_, i) => <View key={`v-${i}`} style={{width:1, backgroundColor:'rgba(255,255,255,0.05)'}} />)}
    </View>
    <View style={{flexDirection:'column', justifyContent:'space-between', width:'100%', position:'absolute', height:'100%'}}>
      {[...Array(10)].map((_, i) => <View key={`h-${i}`} style={{height:1, backgroundColor:'rgba(255,255,255,0.05)'}} />)}
    </View>
  </View>
);

export default function Trilha() {
  // Pega o parâmetro da URL (ex: ?titulo=Java)
  const { titulo } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  // USANDO O CONTEXTO (Cérebro da Trilha)
  const { modulos, carregarTrilha, isLoading } = useTrilha();

  useEffect(() => {
    if (titulo) {
      // Carrega a trilha baseada no título escolhido
      carregarTrilha(titulo as string);
    }
  }, [titulo]);

  const handlePressModule = (mod: Modulo) => {
    if (!mod.bloqueado) {
      router.push({ 
        pathname: '/aula', 
        params: { 
          capitulo: mod.titulo, 
          idModulo: mod.id 
        } 
      });
    }
  };

  return (
    <LinearGradient colors={['#050011', '#240046', '#4B0082']} style={styles.container}>
      <GridBackground />

      <ScrollView 
        contentContainerStyle={[
          styles.content, 
          { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 40 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            {/* Certifique-se que a imagem existe ou use um Text provisório */}
             <Image 
              source={require('../assets/images/avant_logo.png')} 
                style={styles.headerLogo}
                resizeMode="contain"
             />
          </TouchableOpacity>

          {/* Botão Perfil (Vai para /profile) */}
          <TouchableOpacity onPress={() => router.push('/profile')} style={styles.iconBtn}>
            <Ionicons name="person-outline" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Intro */}
        <View style={styles.introContainer}>
            <Text style={styles.introText}>
                Sua trilha está pronta!{'\n'}
                O caminho personalizado para o seu sucesso.
            </Text>
            <Text style={styles.trackTitle}>
            Trilha: {titulo || 'Carregando...'}
            </Text>
        </View>

                <View style={styles.pathContainer}>
            {modulos.map((mod) => {
              const isLocked = mod.bloqueado;
              const isCompleted = mod.concluido;

              return (
                <TouchableOpacity
                  key={mod.id}
                  activeOpacity={isLocked ? 1 : 0.7}
                  onPress={() => handlePressModule(mod)}
                  style={[
                    styles.circleWrapper,
                    {
                      alignSelf: mod.align,
                      marginTop: mod.marginTop,
                      marginLeft: mod.marginLeft || 0,
                      marginRight: mod.marginRight || 0,
                      opacity: isLocked ? 0.5 : 1
                    }
                  ]}
                >
                  <BlurView intensity={isLocked ? 10 : 40} tint="dark" style={styles.blurCircle}>
                    <LinearGradient
                      colors={isCompleted
                        ? ['rgba(74, 222, 128, 0.2)', 'rgba(74, 222, 128, 0.05)']
                        : ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.02)']
                      }
                      style={styles.innerCircleContent}
                    >
                      <Text style={styles.moduleTitle}>{mod.titulo}</Text>

                      {isLocked && (
                        <Ionicons name="lock-closed" size={18} color="rgba(255,255,255,0.5)" style={{ marginTop: 8 }} />
                      )}

                      {isCompleted && (
                        <Ionicons name="checkmark-circle" size={20} color="#4ade80" style={{ marginTop: 8 }} />
                      )}
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>
              );
            })}
            </View>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24 },
  headerRow: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    marginBottom: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', paddingBottom: 15
  },
  headerLogo: { width: 130, height: 40, tintColor: '#FFF' },
  iconBtn: { padding: 4 },
  introContainer: { marginBottom: 40 },
  introText: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontFamily: 'Lexend-Light', marginBottom: 16 },
  trackTitle: { fontSize: 20, color: '#FFF', fontFamily: 'Lexend-Regular' },
  pathContainer: { flexDirection: 'column', paddingBottom: 40 },
  circleWrapper: {
    width: CIRCLE_SIZE, height: CIRCLE_SIZE, borderRadius: CIRCLE_SIZE / 2,
    shadowColor: "#a855f7", shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4, shadowRadius: 15, elevation: 10,
  },
  blurCircle: {
    flex: 1, borderRadius: CIRCLE_SIZE / 2, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  innerCircleContent: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16,
  },
  moduleTitle: { 
    color: '#FFF', fontSize: 12, textAlign: 'center',
    fontFamily: 'Lexend-Regular', lineHeight: 16, paddingHorizontal: 4
  },
});