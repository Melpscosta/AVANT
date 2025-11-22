import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Fundo de Grade (Grid) para manter a consistência visual com a Trilha
const GridBackground = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={{flexDirection:'row', justifyContent:'space-between', height:'100%'}}>
      {[...Array(6)].map((_, i) => <View key={`v-${i}`} style={{width:1, backgroundColor:'rgba(255,255,255,0.03)'}} />)}
    </View>
    <View style={{flexDirection:'column', justifyContent:'space-between', width:'100%', position:'absolute', height:'100%'}}>
      {[...Array(10)].map((_, i) => <View key={`h-${i}`} style={{height:1, backgroundColor:'rgba(255,255,255,0.03)'}} />)}
    </View>
  </View>
);

export default function About() {

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <LinearGradient
      colors={['#050011', '#1e1b4b', '#312e81']} // Gradiente levemente ajustado (Indigo profundo)
      style={styles.container}
    >
      {/* Adiciona o Grid Tech no fundo */}
      <GridBackground />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>INSTITUCIONAL</Text>
          <View style={{ width: 40 }} /> 
        </View>

        {/* Área da Marca */}
        <View style={styles.brandSection}>
          <View style={styles.logoGlowContainer}>
             {/* LOGO DA EMPRESA */}
             <Image 
                source={require('../assets/images/avant_logo.png')} 
                style={styles.logoImage}
                resizeMode="contain"
             />
          </View>
          
          <Text style={styles.tagline}>
            Tecnologia que <Text style={styles.highlightText}>transforma</Text>.
          </Text>
        </View>

        {/* Texto de Introdução */}
        <View style={styles.introBox}>
          <Text style={styles.introText}>
            Somos especialistas em criar soluções de engenharia, segurança e tecnologia. 
            Nossa missão é integrar inovação e inteligência para resolver desafios complexos do mundo real.
          </Text>
        </View>

        {/* Cards de Valores */}
        <View style={styles.valuesContainer}>
          <Text style={styles.sectionTitle}>Nossos Pilares</Text>
          
          {/* Card 1 - Inovação */}
          <BlurView intensity={30} tint="dark" style={styles.valueCard}>
            <LinearGradient colors={['#7C3AED', '#4C1D95']} style={styles.iconBox}>
              <Ionicons name="rocket" size={20} color="#FFF" />
            </LinearGradient>
            <View style={styles.textCol}>
              <Text style={styles.cardTitle}>Inovação Contínua</Text>
              <Text style={styles.cardDesc}>Buscamos o novo constantemente para estar sempre à frente do tempo.</Text>
            </View>
          </BlurView>

          {/* Card 2 - Segurança */}
          <BlurView intensity={30} tint="dark" style={styles.valueCard}>
            <LinearGradient colors={['#10B981', '#047857']} style={styles.iconBox}>
              <Ionicons name="shield-checkmark" size={20} color="#FFF" />
            </LinearGradient>
            <View style={styles.textCol}>
              <Text style={styles.cardTitle}>Segurança & Confiança</Text>
              <Text style={styles.cardDesc}>Proteção e integridade são a base inegociável de tudo o que construímos.</Text>
            </View>
          </BlurView>

          {/* Card 3 - Pessoas */}
          <BlurView intensity={30} tint="dark" style={styles.valueCard}>
             <LinearGradient colors={['#0EA5E9', '#0284C7']} style={styles.iconBox}>
              <Ionicons name="people" size={20} color="#FFF" />
            </LinearGradient>
            <View style={styles.textCol}>
              <Text style={styles.cardTitle}>Foco nas Pessoas</Text>
              <Text style={styles.cardDesc}>Valorizamos talentos, diversidade e promovemos o aprendizado contínuo.</Text>
            </View>
          </BlurView>
        </View>

        {/* Footer / Contato */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Acompanhe a Avantia</Text>
          
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} onPress={() => openLink('https://avantia.com.br')}>
              <Ionicons name="globe-outline" size={22} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} onPress={() => openLink('https://linkedin.com')}>
              <Ionicons name="logo-linkedin" size={22} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} onPress={() => openLink('https://instagram.com')}>
              <Ionicons name="logo-instagram" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />
          
          <Text style={styles.versionText}>Versão 1.0.0 (Build 240)</Text>
          <Text style={styles.copyright}>© 2025 Avantia. Todos os direitos reservados.</Text>
        </View>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 40 },
  
  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 },
  backButton: { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, justifyContent:'center', alignItems:'center' },
  headerTitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontFamily: 'Lexend-Regular', letterSpacing: 2 },

  // Brand
  brandSection: { alignItems: 'center', marginBottom: 32 },
  logoGlowContainer: {
    marginBottom: 16,
    shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, shadowRadius: 30, // Efeito Neon atrás da logo
  },
  logoImage: { width: 200, height: 60, tintColor: '#FFF' }, // Logo Branco
  tagline: { fontSize: 16, color: '#d1d5db', fontFamily: 'Lexend-Light' },
  highlightText: { color: '#A855F7', fontFamily: 'Lexend-Bold' },

  // Intro
  introBox: { 
    backgroundColor: 'rgba(0,0,0,0.2)', 
    padding: 20, borderRadius: 16, marginBottom: 40,
    borderLeftWidth: 2, borderLeftColor: '#7C3AED' // Detalhe roxo na lateral
  },
  introText: { fontSize: 14, color: '#E5E7EB', textAlign: 'left', lineHeight: 24, fontFamily: 'Lexend-Regular' },

  // Values
  valuesContainer: { gap: 12, marginBottom: 50 },
  sectionTitle: { fontSize: 18, color: '#FFF', fontFamily: 'Lexend-Bold', marginBottom: 12 },
  
  valueCard: {
    flexDirection: 'row', alignItems: 'center', padding: 16,
    borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.02)'
  },
  iconBox: { 
    width: 40, height: 40, borderRadius: 10, 
    justifyContent: 'center', alignItems: 'center', marginRight: 16 
  },
  textCol: { flex: 1 },
  cardTitle: { fontSize: 14, color: '#FFF', fontFamily: 'Lexend-Bold', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: '#9ca3af', lineHeight: 18, fontFamily: 'Lexend-Light' },

  // Footer
  footer: { alignItems: 'center' },
  footerTitle: { fontSize: 14, color: '#FFF', fontFamily: 'Lexend-Regular', marginBottom: 20 },
  socialRow: { flexDirection: 'row', gap: 16, marginBottom: 30 },
  socialBtn: { 
    width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.05)', 
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'
  },
  divider: { width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 20 },
  versionText: { fontSize: 12, color: '#666', fontFamily: 'Lexend-Regular', marginBottom: 4 },
  copyright: { fontSize: 12, color: '#444', fontFamily: 'Lexend-Light' }
});