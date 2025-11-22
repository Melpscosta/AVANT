import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLoading } from '../LoadingContext';

const options = [
  { id: '1', title: 'Automação de processos', description: 'Torne seu trabalho mais rápido e eficiente.', icon: 'flash-outline' },
  { id: '2', title: 'Dados & Analytics', description: 'Descubra insights e tome decisões melhores', icon: 'stats-chart-outline' },
  { id: '3', title: 'Inteligência Artificial', description: 'Aprenda a usar IA para impulsionar sua carreira.', icon: 'hardware-chip-outline' },
  { id: '4', title: 'Cibersegurança', description: 'Proteger, prevenir e antecipar riscos.', icon: 'shield-checkmark-outline' },
  { id: '5', title: 'Tecnologia & Programação', description: 'Construa bases sólidas em desenvolvimento de software.', icon: 'code-slash-outline' },
  { id: '6', title: 'Cultura Digital & Soft Skills', description: 'Habilidades humanas para o futuro do trabalho', icon: 'person-outline' },
];

export default function Selection() {
  const insets = useSafeAreaInsets();
  const { showLoading } = useLoading();

  const handleSelect = (metaSelecionada: string) => {
    showLoading({
      pathname: '/LoadingScreen',
      params: { titulo: metaSelecionada }
    } as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 40 }
        ]}
        showsVerticalScrollIndicator={false}
      >

        {/* LOGO — agora usando sua imagem */}
        <Image
          source={require('../assets/logos/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* TEXTO */}
        <Text style={styles.descriptionText}>
          Para personalizarmos sua trilha de aprendizado com a nossa I A,{' '}
          <Text style={styles.highlightText}>
            selecione sua meta de carreira
          </Text>
        </Text>

        {/* GRID */}
        <View style={styles.grid}>
          {options.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => handleSelect(item.title)}
              activeOpacity={0.85}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon as any} size={26} color="#7E22CE" />
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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 60
  },

  logo: {
    width: 150,
    height: 50,
    alignSelf: 'flex-start',
    marginBottom: 24
  },

  descriptionText: {
    fontSize: 18,
    color: '#1F2937',
    fontFamily: 'Lexend-Regular',
    lineHeight: 26,
    marginBottom: 32
  },

  highlightText: {
    color: '#A855F7',
    fontFamily: 'Lexend-Regular'
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16
  },

  card: {
    width: '48%',
    backgroundColor: '#F3F4F6',
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    minHeight: 160,
    justifyContent: 'space-between'
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14
  },

  cardTitle: {
    fontSize: 15,
    color: '#111827',
    fontFamily: 'Lexend-Regular',
    marginBottom: 4
  },

  cardDescription: {
    fontSize: 12,
    color: '#4B5563',
    fontFamily: 'Lexend-Light'
  }
});
