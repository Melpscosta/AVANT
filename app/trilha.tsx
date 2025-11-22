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

import { Modulo, useTrilha } from '../src/context/TrilhaContext';

// --- DIMENSÕES ---
const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.42; // ligeiramente maior, igual ao print

// --- GRADE DE FUNDO ---
const GridBackground = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Linhas verticais */}
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: '100%' }}>
      {[...Array(7)].map((_, i) => (
        <View
          key={`v-${i}`}
          style={{ width: 1, backgroundColor: 'rgba(255,0,255,0.15)' }}
        />
      ))}
    </View>

    {/* Linhas horizontais */}
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      {[...Array(14)].map((_, i) => (
        <View
          key={`h-${i}`}
          style={{ height: 1, backgroundColor: 'rgba(255,0,255,0.15)', marginBottom: 35 }}
        />
      ))}
    </View>
  </View>
);

export default function Trilha() {
  const { titulo } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const { modulos, carregarTrilha } = useTrilha();

  useEffect(() => {
    if (titulo) carregarTrilha(titulo as string);
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
    <LinearGradient 
      colors={['#0A001A', '#30005A', '#5A00A0']}
      style={styles.container}
    >
      <GridBackground />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 10,
            paddingBottom: insets.bottom + 60
          }
        ]}
        showsVerticalScrollIndicator={false}
      >

        {/* --------- HEADER --------- */}
        <View style={styles.headerRow}>
          <Image
            source={require('../assets/logos/avant_logo.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />

          <TouchableOpacity onPress={() => router.push('/profile')} style={styles.iconBtn}>
            <Ionicons name="person-outline" size={26} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* --------- INTRO --------- */}
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>Sua trilha está pronta!</Text>

          <Text style={styles.introSubtitle}>
            Criamos um caminho personalizado para impulsionar seu desenvolvimento.
          </Text>

          <Text style={styles.trackTitle}>
            Trilha inteligente para{' '}
            <Text style={{ color: '#FFF' }}>{titulo}</Text>
          </Text>
        </View>

        {/* --------- LISTA DE MÓDULOS --------- */}
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
                    opacity: isLocked ? 0.45 : 1
                  }
                ]}
              >
                <BlurView
                  intensity={isLocked ? 10 : 40}
                  tint="dark"
                  style={styles.blurCircle}
                >
                  <LinearGradient
                    colors={
                      isCompleted
                        ? ['rgba(74, 222, 128, 0.25)', 'rgba(74, 222, 128, 0.10)']
                        : ['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.04)']
                    }
                    style={styles.innerCircleContent}
                  >
                    <Text style={styles.moduleTitle}>{mod.titulo}</Text>

                    {isLocked && (
                      <Ionicons
                        name="lock-closed"
                        size={18}
                        color="rgba(255,255,255,0.5)"
                        style={{ marginTop: 8 }}
                      />
                    )}

                    {isCompleted && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#4ade80"
                        style={{ marginTop: 8 }}
                      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)'
  },

  headerLogo: {
    width: 120,
    height: 40,
    tintColor: '#FFF'
  },

  iconBtn: { padding: 6 },

  introContainer: {
    marginBottom: 40
  },

  introTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    fontFamily: 'Lexend-Regular',
    marginBottom: 4
  },

  introSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Lexend-Light',
    marginBottom: 14
  },

  trackTitle: {
    fontSize: 16,
    color: '#D9C5FF',
    fontFamily: 'Lexend-Regular',
    lineHeight: 22
  },

  pathContainer: {
    flexDirection: 'column',
    paddingBottom: 50
  },

  circleWrapper: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
  },

  blurCircle: {
    flex: 1,
    borderRadius: CIRCLE_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 1.2,
    borderColor: 'rgba(255,255,255,0.35)'
  },

  innerCircleContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12
  },

  moduleTitle: {
    color: '#FFF',
    fontSize: 13,
    textAlign: 'center',
    fontFamily: 'Lexend-Regular',
    lineHeight: 18
  }
});
