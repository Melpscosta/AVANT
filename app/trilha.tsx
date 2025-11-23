import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Modulo, useTrilha } from '../src/context/TrilhaContext';
import storage from '../src/services/storage';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.42;

export default function Trilha() {
  const insets = useSafeAreaInsets();
  const { modulos, carregarTrilha, isLoading } = useTrilha();

  const meta = storage.getString("mock_meta_selecionada") || "";

  useEffect(() => {
    if (meta) carregarTrilha(meta);
  }, [meta]);

  const handlePressModule = (mod: Modulo) => {
    if (!mod.bloqueado) {
      router.push({
        pathname: '/aula',
        params: { capitulo: mod.titulo, idModulo: mod.id }
      });
    }
  };

  if (isLoading || modulos.length === 0) {
    return (
      <LinearGradient colors={['#0A001A', '#30005A', '#5A00A0']} style={styles.loading}>
        <ActivityIndicator size="large" color="#a855f7" />
        <Text style={styles.loadingText}>Carregando trilha...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0A001A', '#30005A', '#5A00A0']} style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: 100 }
        ]}
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}
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

        {/* INTRO */}
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>Sua trilha está pronta!</Text>
          <Text style={styles.introSubtitle}>Criamos um caminho personalizado para você.</Text>

          <Text style={styles.trackTitle}>
            Trilha inteligente para{' '}
            <Text style={{ color: '#FFF' }}>{meta}</Text>
          </Text>
        </View>

        {/* MÓDULOS */}
        <View style={styles.pathContainer}>
          {modulos.map(mod => (
            <TouchableOpacity
              key={mod.id}
              activeOpacity={mod.bloqueado ? 1 : 0.7}
              onPress={() => handlePressModule(mod)}
              style={[
                styles.circleWrapper,
                {
                  alignSelf: mod.align,
                  marginTop: mod.marginTop,
                  opacity: mod.bloqueado ? 0.45 : 1
                }
              ]}
            >
              <BlurView
                intensity={mod.bloqueado ? 10 : 40}
                tint="dark"
                style={styles.blurCircle}
              >
                <LinearGradient
                  colors={
                    mod.concluido
                      ? ['rgba(74, 222, 128, 0.25)', 'rgba(74, 222, 128, 0.10)']
                      : ['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.04)']
                  }
                  style={styles.innerCircleContent}
                >
                  <Text style={styles.moduleTitle}>{mod.titulo}</Text>

                  {mod.bloqueado && (
                    <Ionicons name="lock-closed" size={18} color="rgba(255,255,255,0.5)" />
                  )}

                  {mod.concluido && (
                    <Ionicons name="checkmark-circle" size={20} color="#4ade80" />
                  )}
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontFamily: 'Lexend-Regular'
  },

  container: { flex: 1 },
  content: { paddingHorizontal: 24 },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },

  headerLogo: {
    width: 120,
    height: 40,
    tintColor: '#FFF'
  },

  iconBtn: { padding: 6 },

  introContainer: { marginBottom: 40 },

  introTitle: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
    fontFamily: 'Lexend-Regular'
  },

  introSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Lexend-Light',
    marginBottom: 10
  },

  trackTitle: {
    fontSize: 16,
    color: '#D9C5FF',
    fontFamily: 'Lexend-Regular',
  },

  pathContainer: {
    flexDirection: 'column',
    paddingBottom: 80
  },

  circleWrapper: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2
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
    lineHeight: 18,
    fontFamily: 'Lexend-Regular'
  }
});
