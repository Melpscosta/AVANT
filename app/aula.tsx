import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// CONTEXTO
import { useTrilha } from '../src/context/TrilhaContext';

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = width * 0.55;

const classList = [
  { id: '1', title: '01. Boas vindas e Introdução', duration: '02:30', active: true },
  { id: '2', title: '02. Configurando o ambiente', duration: '05:45', active: false },
  { id: '3', title: '03. Entendendo o conceito chave', duration: '10:12', active: false },
];

export default function Aula() {
  const { capitulo, idModulo } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const { concluirModulo } = useTrilha();

  const handleFinish = () => {
    if (idModulo) {
      concluirModulo(idModulo as string);
    }
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* PLAYER */}
      <View style={[styles.videoContainer, { marginTop: insets.top }]}>
        <LinearGradient
          colors={['#2E1065', '#4C1D95', '#6D28D9']}
          style={styles.videoGradient}
        >
          <TouchableOpacity activeOpacity={0.7} style={styles.playButtonCircle}>
            <Ionicons name="play" size={32} color="#FFF" style={{ marginLeft: 4 }} />
          </TouchableOpacity>

          <Text style={styles.previewText}>Visualizar Aula</Text>

          <TouchableOpacity onPress={() => router.back()} style={styles.backButtonOverlay}>
            <Ionicons name="chevron-down" size={26} color="#FFF" />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* CONTEÚDO */}
      <ScrollView style={styles.contentContainer} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* HEADER DO MÓDULO */}
        <View style={styles.headerInfo}>
          <Text style={styles.trackTitle}>{capitulo}</Text>

          <Text style={styles.moduleDescription}>
            Conteúdo prático, direto ao ponto e desenvolvido para sua evolução profissional.
          </Text>
        </View>

        {/* AULAS */}
        <Text style={styles.sectionTitle}>Aulas do Capítulo</Text>

        <View style={styles.playlist}>
          {classList.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.classItem,
                item.active && styles.classActive
              ]}
            >
              <View style={styles.leftSide}>
                <View style={[styles.iconCircle, item.active && styles.iconCircleActive]}>
                  {item.active ? (
                    <Ionicons name="play" size={16} color="#FFF" />
                  ) : (
                    <Text style={styles.indexNumber}>{index + 1}</Text>
                  )}
                </View>

                <View>
                  <Text style={[styles.classTitle, item.active && styles.classTitleActive]}>
                    {item.title}
                  </Text>
                  <Text style={styles.classDuration}>{item.duration}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* BOTÃO FINAL */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
        <TouchableOpacity activeOpacity={0.8} onPress={handleFinish}>
          <LinearGradient
            colors={['#9333EA', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.finishButton}
          >
            <Text style={styles.finishText}>Concluir Módulo</Text>
            <Ionicons name="checkmark-circle" size={20} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ========================= STYLES =============================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B011A' },

  videoContainer: { width: '100%', height: VIDEO_HEIGHT },
  videoGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  playButtonCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginBottom: 8
  },

  previewText: {
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Lexend-Regular',
    fontSize: 14
  },

  backButtonOverlay: {
    position: 'absolute',
    top: 18,
    left: 18,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  contentContainer: { flex: 1 },

  headerInfo: { padding: 24 },
  trackTitle: {
    color: '#FFF',
    fontSize: 22,
    fontFamily: 'Lexend-Regular',
    marginBottom: 8
  },

  moduleDescription: {
    color: '#D1D5DB',
    fontFamily: 'Lexend-Light',
    fontSize: 14,
    lineHeight: 20
  },

  sectionTitle: {
    marginLeft: 24,
    marginTop: 10,
    marginBottom: 12,
    color: '#EDE9FE',
    fontFamily: 'Lexend-Regular',
    fontSize: 16
  },

  playlist: { paddingHorizontal: 24 },

  classItem: {
    backgroundColor: '#130524',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },

  classActive: {
    backgroundColor: '#3C0F77',
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.4)'
  },

  leftSide: { flexDirection: 'row', alignItems: 'center', flex: 1 },

  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2A1E3E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14
  },

  iconCircleActive: {
    backgroundColor: '#A855F7'
  },

  indexNumber: {
    color: '#A1A1AA',
    fontFamily: 'Lexend-Regular',
    fontSize: 13
  },

  classTitle: {
    color: '#D1D5DB',
    fontFamily: 'Lexend-Regular',
    fontSize: 14
  },

  classTitleActive: {
    color: '#FFFFFF',
    fontFamily: 'Lexend-Regular'
  },

  classDuration: {
    color: '#9CA3AF',
    fontFamily: 'Lexend-Light',
    fontSize: 12,
    marginTop: 2
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 24,
    backgroundColor: '#0B011A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)'
  },

  finishButton: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },

  finishText: {
    color: '#FFF',
    fontFamily: 'Lexend-Regular',
    fontSize: 16
  }
});
