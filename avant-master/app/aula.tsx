import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// IMPORTA O CONTEXTO
import { useTrilha } from '../src/context/TrilhaContext';

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = width * 0.5625;

const classList = [
  { id: '1', title: '01. Boas vindas e Introdução', duration: '02:30', active: true },
  { id: '2', title: '02. Configurando o ambiente', duration: '05:45', active: false },
  { id: '3', title: '03. Entendendo o conceito chave', duration: '10:12', active: false },
];

export default function Aula() {
  // Recebe o ID do módulo vindo da trilha
  const { capitulo, idModulo } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  // Pega a função de concluir do contexto
  const { concluirModulo } = useTrilha();

  const handleFinish = () => {
    if (idModulo) {
      // 1. Marca como concluído e libera o próximo
      concluirModulo(idModulo as string);
    }
    // 2. Volta para a trilha
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Video Area */}
      <View style={[styles.videoContainer, { marginTop: insets.top }]}>
        <View style={styles.videoWrapper}>
          <LinearGradient colors={['#2e1065', '#000']} style={styles.videoGradient}>
            <TouchableOpacity activeOpacity={0.7}>
              <View style={styles.playButtonCircle}>
                <Ionicons name="play" size={32} color="#FFF" style={{ marginLeft: 4 }} />
              </View>
            </TouchableOpacity>
            <Text style={styles.previewText}>Visualizar Aula</Text>
          </LinearGradient>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButtonOverlay}>
            <Ionicons name="chevron-down" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Conteúdo */}
      <ScrollView style={styles.contentContainer} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.headerInfo}>
          <View style={styles.tag}><Text style={styles.tagText}>MÓDULO ATUAL</Text></View>
          <Text style={styles.courseTitle}>{capitulo}</Text>
          <Text style={styles.lessonDescription}>Conteúdo prático e direto ao ponto.</Text>
        </View>

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Aulas do capítulo:</Text>

        <View style={styles.playlist}>
          {classList.map((item, index) => (
            <TouchableOpacity key={item.id} style={[styles.classItem, item.active && styles.activeItemBackground]}>
                <View style={styles.leftSide}>
                  <View style={[styles.iconBox, item.active && styles.activeIconBox]}>
                    {item.active ? <Ionicons name="play" size={14} color="#FFF" /> : <Text style={styles.indexText}>{index + 1}</Text>}
                  </View>
                  <View style={styles.classInfo}>
                    <Text style={[styles.classTitle, item.active && styles.activeText]}>{item.title}</Text>
                    <Text style={styles.classDuration}>{item.duration}</Text>
                  </View>
                </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer com Ação Real */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity style={styles.finishButton} activeOpacity={0.8} onPress={handleFinish}>
          <LinearGradient colors={['#7c3aed', '#6d28d9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientButton}>
            <Text style={styles.finishButtonText}>Concluir Módulo</Text>
            <Ionicons name="checkmark-circle" size={20} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090b' },
  videoContainer: { width: '100%', height: VIDEO_HEIGHT, backgroundColor: '#000' },
  videoWrapper: { flex: 1, position: 'relative' },
  videoGradient: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  playButtonCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', marginBottom: 8 },
  previewText: { color: 'rgba(255,255,255,0.6)', fontFamily: 'Lexend-Regular', fontSize: 12 },
  backButtonOverlay: { position: 'absolute', top: 15, left: 15, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  contentContainer: { flex: 1 },
  headerInfo: { padding: 24, paddingTop: 20 },
  tag: { backgroundColor: 'rgba(168, 85, 247, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, alignSelf:'flex-start', marginBottom:10 },
  tagText: { color: '#d8b4fe', fontSize: 10, fontFamily: 'Lexend-Bold' },
  courseTitle: { color: '#FFF', fontSize: 22, fontFamily: 'Lexend-Bold', marginBottom: 8 },
  lessonDescription: { color: '#a1a1aa', fontSize: 14, fontFamily: 'Lexend-Regular' },
  divider: { height: 1, backgroundColor: '#27272A', marginHorizontal: 24, marginBottom: 20 },
  sectionTitle: { color: '#FFF', fontSize: 16, marginLeft: 24, marginBottom: 16, fontFamily: 'Lexend-Bold' },
  playlist: { paddingHorizontal: 24 },
  classItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 12, marginBottom: 8, borderRadius: 12, backgroundColor: '#18181b' },
  activeItemBackground: { backgroundColor: '#2e1065', borderWidth: 1, borderColor: 'rgba(168, 85, 247, 0.3)' },
  leftSide: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#27272a', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  activeIconBox: { backgroundColor: '#A855F7' },
  indexText: { color: '#71717a', fontSize: 12, fontFamily: 'Lexend-Bold' },
  classInfo: { flex: 1 },
  classTitle: { color: '#d4d4d8', fontSize: 14, fontFamily: 'Lexend-Regular' },
  activeText: { color: '#FFF', fontFamily: 'Lexend-Bold' },
  classDuration: { color: '#71717a', fontSize: 12, fontFamily: 'Lexend-Light', marginTop: 2 },
  footer: { position: 'absolute', bottom: 0, width: '100%', paddingHorizontal: 24, paddingTop: 16, backgroundColor: '#09090b', borderTopWidth: 1, borderTopColor: '#27272a' },
  finishButton: { height: 50, borderRadius: 12, overflow: 'hidden', shadowColor: "#7c3aed", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  gradientButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  finishButtonText: { color: '#FFF', fontSize: 16, fontFamily: 'Lexend-Bold' }
});