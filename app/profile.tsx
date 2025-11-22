import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '../src/context/UserContext';

const { width } = Dimensions.get('window');

export default function Profile() {
  const insets = useSafeAreaInsets();
  const { user, logoutUser } = useUser();

  const getInitials = (name?: string) => {
    if (!name) return "US";
    const p = name.trim().split(" ");
    return (p[0][0] + (p[1]?.[0] || "")).toUpperCase();
  };

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja realmente sair da conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => {
          logoutUser();
          router.replace("/");
        }
      }
    ]);
  };

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/selection");
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F4EEFF']}
      style={[styles.container, { paddingTop: insets.top + 20 }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 26, paddingBottom: 50 }}
      >

        {/* TOP NAV */}
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#4A148C" />
        </TouchableOpacity>

        <Text style={styles.title}>MEU DESEMPENHO</Text>

        {/* AVATAR */}
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={['#A855F7', '#7C3AED']}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{getInitials(user?.nome)}</Text>
          </LinearGradient>
        </View>

        {/* USER INFO */}
        <Text style={styles.company}>{user?.empresa || "Colaborador Avantia"}</Text>
        <Text style={styles.role}>{user?.cargo || "Assistente Administrativo"}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        {/* PROGRESS BAR */}
        <View style={styles.progressWrapper}>
          <Text style={styles.progressLabel}>Progresso da trilha: 0%</Text>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: "0%" }]} />
          </View>
        </View>

        {/* STATISTICS */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-done-outline" size={26} color="#7C3AED" />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Concluídos</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={26} color="#7C3AED" />
            <Text style={styles.statNumber}>0h</Text>
            <Text style={styles.statLabel}>Horas</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="trophy-outline" size={26} color="#7C3AED" />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Certificados</Text>
          </View>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  backBtn: {
    position: "absolute",
    left: 20,
    top: 25,
    padding: 6,
    zIndex: 10
  },

  title: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 18,
    letterSpacing: 2,
    color: "#4A148C",
    fontFamily: "Lexend-Regular",
    marginBottom: 30
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 20
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center"
  },

  avatarText: {
    fontSize: 40,
    fontFamily: "Lexend-Regular",
    color: "#FFF"
  },

  company: {
    textAlign: "center",
    fontSize: 14,
    color: "#111",
    fontFamily: "Lexend-Regular",
  },

  role: {
    textAlign: "center",
    fontSize: 14,
    color: "#7C3AED",
    fontFamily: "Lexend-Regular",
    marginBottom: 4
  },

  email: {
    textAlign: "center",
    color: "#666",
    fontSize: 12,
    fontFamily: "Lexend-Light",
    marginBottom: 30
  },

  progressWrapper: { width: "100%", marginBottom: 40 },

  progressLabel: {
    fontSize: 12,
    color: "#444",
    fontFamily: "Lexend-Light",
    marginBottom: 4
  },

  progressBg: {
    width: "100%",
    height: 6,
    borderRadius: 4,
    backgroundColor: "#E0D4FF",
    overflow: "hidden"
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#7C3AED"
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40
  },

  statCard: {
    width: (width - 70) / 3,
    backgroundColor: "#F3E8FF",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center"
  },

  statNumber: {
    marginTop: 6,
    fontSize: 18,
    color: "#4A148C",
    fontFamily: "Lexend-Regular"
  },

  statLabel: {
    fontSize: 12,
    color: "#4A148C",
    fontFamily: "Lexend-Light"
  },

  logoutButton: {
    marginTop: 10,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.5)",
    alignItems: "center"
  },

  logoutText: {
    color: "#EF4444",
    fontFamily: "Lexend-Regular",
    fontSize: 14
  }
});
