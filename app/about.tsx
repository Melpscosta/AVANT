import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function AboutScreen() {
  return (
    <LinearGradient
      colors={['#050011', '#180b26', '#2e1065']}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>

        {/* BOTÃO VOLTAR */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')}>
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
        </TouchableOpacity>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>AVANT</Text>
          <Text style={styles.subtitle}>
            Tecnologia que transforma pessoas, equipes e resultados.
          </Text>
        </View>

        {/* MISSÃO */}
        <LinearGradient colors={['#ffffff15', '#ffffff08']} style={styles.card}>
          <Text style={styles.cardText}>
            Somos especialistas em integrar pessoas, inovação e tecnologia.
            Ajudamos profissionais a evoluírem continuamente e a se prepararem
            para o futuro com confiança.
          </Text>
        </LinearGradient>

        {/* BENEFÍCIOS */}
        <Text style={styles.sectionTitle}>Benefícios da Plataforma</Text>

        {benefits.map((item, index) => (
          <LinearGradient
            key={index}
            colors={['#ffffff12', '#ffffff05']}
            style={styles.benefitCard}
          >
            <Ionicons name={item.icon} size={28} color="#A855F7" />

            {/* BLOCO DE TEXTO AJUSTADO */}
            <View style={styles.benefitTextBlock}>
              <Text style={styles.benefitTitle}>{item.title}</Text>
              <Text style={styles.benefitDesc}>{item.desc}</Text>
            </View>

          </LinearGradient>
        ))}

        {/* AVANTIA */}
        <Text style={styles.sectionTitle}>AVANTIA — Nossa IA</Text>

        <LinearGradient colors={['#ffffff15', '#ffffff08']} style={styles.card}>
          <Text style={styles.cardText}>
            A <Text style={styles.bold}>AVANTIA</Text> analisa seu{" "}
            <Text style={styles.bold}>cargo</Text>, sua{" "}
            <Text style={styles.bold}>meta escolhida</Text> e o contexto da empresa
            para gerar uma trilha de aprendizado{" "}
            <Text style={styles.bold}>perfeita para você</Text>.
          </Text>

          <Text style={[styles.cardText, { marginTop: 10 }]}>
            Ela simplifica o aprendizado de tecnologia, automatiza o que é repetitivo,
            aumenta sua produtividade e ajuda você a evoluir diariamente.
          </Text>
        </LinearGradient>

        {/* REDES SOCIAIS */}
        <View style={styles.socialContainer}>
          <Text style={styles.sectionTitle}>Acompanhe a Avantia</Text>

          <View style={styles.socialRow}>
            <Ionicons name="globe-outline" size={28} color="#FFFFFF" />
            <Ionicons name="logo-linkedin" size={28} color="#FFFFFF" />
            <Ionicons name="logo-instagram" size={28} color="#FFFFFF" />
          </View>

          <Text style={styles.version}>Versão 1.0.0 (Build 240)</Text>
          <Text style={styles.footerText}>© 2025 Avantia. Todos os direitos reservados.</Text>
        </View>

      </ScrollView>
    </LinearGradient>
  );
}

const benefits = [
  { icon: "sparkles-outline", title: "Inovação Contínua", desc: "Aprenda sem dificuldade e evolua no seu ritmo." },
  { icon: "shield-checkmark-outline", title: "Segurança & Confiança", desc: "Conheça práticas essenciais para o dia a dia corporativo." },
  { icon: "analytics-outline", title: "Análise de Dados", desc: "Domine conceitos que tornam seu trabalho mais estratégico." },
  { icon: "time-outline", title: "Automação", desc: "Elimine tarefas repetitivas e ganhe tempo criativo." },
  { icon: "bulb-outline", title: "Produtividade", desc: "Use tecnologia para entregar mais com menos esforço." }
];

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 90,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20
  },

  header: {
    marginTop: 20,
    marginBottom: 30,
  },

  title: {
    fontSize: 28,
    fontFamily: "LexendZetta-Regular",
    color: "#FFFFFF",
    letterSpacing: 4,
    marginBottom: 8
  },

  subtitle: {
    fontSize: 15,
    fontFamily: "Lexend-Light",
    color: "rgba(255,255,255,0.75)"
  },

  sectionTitle: {
    fontSize: 20,
    marginTop: 40,
    marginBottom: 12,
    fontFamily: "Lexend-Regular",
    color: "#FFFFFF",
    letterSpacing: 1
  },

  card: {
    borderRadius: 14,
    padding: 18,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)"
  },

  cardText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Lexend-Light",
    lineHeight: 20,
    textAlign: "justify"
  },

  bold: {
    fontFamily: "Lexend-Regular",
    color: "#A855F7"
  },

  benefitCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 14,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)"
  },

  benefitTextBlock: {
    marginLeft: 12,
    flexShrink: 1,
    flexWrap: "wrap",
    maxWidth: "85%"
  },

  benefitTitle: {
    fontSize: 15,
    fontFamily: "Lexend-Regular",
    color: "#FFFFFF"
  },

  benefitDesc: {
    fontSize: 13,
    fontFamily: "Lexend-Light",
    color: "rgba(255,255,255,0.75)",
    marginTop: 3,
    lineHeight: 18,
    textAlign: "justify"
  },

  socialContainer: {
    marginTop: 60,
    paddingBottom: 60,
    alignItems: "center"
  },

  socialRow: {
    flexDirection: "row",
    gap: 26,
    marginVertical: 12
  },

  version: {
    color: "rgba(255,255,255,0.6)",
    fontFamily: "Lexend-Light",
    marginTop: 10
  },

  footerText: {
    color: "rgba(255,255,255,0.6)",
    fontFamily: "Lexend-Light",
    marginTop: 4
  }
});
