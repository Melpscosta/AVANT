import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLoading } from '../LoadingContext';

// Opções IGUAIS À IMAGEM enviada
const options = [
  { 
    id: '1', 
    title: 'Automação de processos', 
    description: 'Torne seu trabalho mais rápido e eficiente.', 
    icon: 'flash-outline' 
  },
  { 
    id: '2', 
    title: 'Dados & Analytics', 
    description: 'Descubra insights e tome decisões melhores', 
    icon: 'stats-chart-outline' 
  },
  { 
    id: '3', 
    title: 'Inteligência Artificial', 
    description: 'Aprenda a usar IA para impulsionar sua carreira.', 
    icon: 'hardware-chip-outline' 
  },
  { 
    id: '4', 
    title: 'Cibersegurança', 
    description: 'Proteger, prevenir e antecipar riscos.', 
    icon: 'shield-checkmark-outline' 
  },
  { 
    id: '5', 
    title: 'Tecnologia & Programação', 
    description: 'Construa bases sólidas em desenvolvimento de software.', 
    icon: 'code-slash-outline' 
  },
  { 
    id: '6', 
    title: 'Cultura Digital & Soft Skills', 
    description: 'Habilidades humanas para o futuro do trabalho', 
    icon: 'person-outline' 
  },
];

export default function Selection() {
  const insets = useSafeAreaInsets();
  const { showLoading } = useLoading();

  const handleSelect = (metaSelecionada: string) => {
  // Passamos o NOME DA META para a próxima tela
    showLoading({
      pathname: '/trilha',
      params: { titulo: metaSelecionada }
    } as any);
  };

  // ... (O resto do return e styles continua igual ao anterior, focado no layout visual)
  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image source={require('../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.descriptionText}>
            Para personalizarmos sua trilha de aprendizado com a nossa I A,{' '}
            <Text style={styles.highlightText}>selecione sua meta de carreira</Text>
          </Text>
        </View>

        <View style={styles.grid}>
          {options.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card} 
              onPress={() => handleSelect(item.title)}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon as any} size={28} color="#000" />
              </View>
              <View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  header: { marginBottom: 30 },
  logo: { width: 180, height: 50, marginBottom: 16, alignSelf: 'flex-start' },
  descriptionText: { fontSize: 18, color: '#1F2937', fontFamily: 'Lexend-Regular' },
  highlightText: { color: '#A855F7', fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  card: { width: '48%', backgroundColor: '#F3F4F6', padding: 16, borderRadius: 16, justifyContent: 'space-between', marginBottom: 12, aspectRatio: 0.85 },
  iconContainer: { width: 40, height: 40, borderWidth: 1.5, borderColor: '#7C3AED', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginBottom: 12 },
  cardTitle: { fontSize: 15, fontFamily: 'Lexend-Bold', color: '#111827', marginBottom: 4 },
  cardDescription: { fontSize: 12, color: '#4B5563', fontFamily: 'Lexend-Regular' }
});