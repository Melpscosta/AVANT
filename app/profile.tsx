import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
  Animated
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '../src/context/UserContext';
import { useTrilha } from '../src/context/TrilhaContext';
import storage from '../src/services/storage';

const { width } = Dimensions.get('window');

// ------------------------------------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------------------------------------------
export default function Profile() {
  const insets = useSafeAreaInsets();
  const { logoutUser } = useUser();
  const { modulos } = useTrilha();

  const [loggedUser, setLoggedUser] = useState<any>(null);
  const [progresso, setProgresso] = useState(0);
  const [concluidos, setConcluidos] = useState(0);
  const [trilhasConcluidas, setTrilhasConcluidas] = useState(0);

  // --- certificados desbloqueados ---
  const [certsDisponiveis, setCertsDisponiveis] = useState<any[]>([]);

  // --- modal ---
  const [modalVisible, setModalVisible] = useState(false);
  const [certSelecionado, setCertSelecionado] = useState<any>(null);
  const fadeAnim = new Animated.Value(0);

  // --------------------------------------------------------------------------------------------
  // CARREGA USUÁRIO
  // --------------------------------------------------------------------------------------------
  useEffect(() => {
    const session = storage.getObject("mock_session");
    if (session) setLoggedUser(session);
  }, []);

  // --------------------------------------------------------------------------------------------
  // CARREGA PROGRESSO + CERTIFICADOS
  // --------------------------------------------------------------------------------------------
  useEffect(() => {
    const meta = storage.getString("mock_meta_selecionada");
    if (!meta) return;

    const progressoSalvo = Number(storage.getString(`mock_progress_${meta}`) || 0);

    setProgresso(progressoSalvo);

    // módulos concluídos
    const concluidosCount = modulos.filter(m => m.concluido).length;
    setConcluidos(concluidosCount);

    // trilha concluída
    setTrilhasConcluidas(progressoSalvo === 100 ? 1 : 0);

    // certificados desbloqueáveis
    const certificados = [];

    if (progressoSalvo >= 30) {
      certificados.push({
        id: 1,
        titulo: "Certificado Bronze",
        nivel: "Bronze",
        porcentagem: 30,
        cor: ['#a78bfa', '#7c3aed'],
        meta
      });
    }
    if (progressoSalvo >= 60) {
      certificados.push({
        id: 2,
        titulo: "Certificado Prata",
        nivel: "Prata",
        porcentagem: 60,
        cor: ['#c084fc', '#a855f7'],
        meta
      });
    }
    if (progressoSalvo === 100) {
      certificados.push({
        id: 3,
        titulo: "Certificado Ouro",
        nivel: "Ouro",
        porcentagem: 100,
        cor: ['#e879f9', '#d946ef'],
        meta
      });
    }

    setCertsDisponiveis(certificados);
  }, [modulos]);

  // --------------------------------------------------------------------------------------------
  // LOGOUT
  // --------------------------------------------------------------------------------------------
  const handleLogout = () => {
    Alert.alert("Sair", "Deseja realmente sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => {
          storage.remove("mock_session");
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

  // --------------------------------------------------------------------------------------------
  // OPEN CERTIFICATE MODAL
  // --------------------------------------------------------------------------------------------
  const openCertModal = (cert: any) => {
    setCertSelecionado(cert);
    setModalVisible(true);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 280,
      useNativeDriver: true
    }).start();
  };

  const closeCertModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true
    }).start(() => {
      setModalVisible(false);
      setCertSelecionado(null);
    });
  };

  // --------------------------------------------------------------------------------------------
  // INICIAIS DO NOME
  // --------------------------------------------------------------------------------------------
  const getInitials = (name?: string) => {
    if (!name) return "US";
    const p = name.trim().split(" ");
    return (p[0][0] + (p[1]?.[0] || "")).toUpperCase();
  };

  // --------------------------------------------------------------------------------------------
  // UI
  // --------------------------------------------------------------------------------------------
  return (
    <LinearGradient
      colors={['#14001f', '#2b0050', '#3c0075']}
      style={[styles.container, { paddingTop: insets.top + 20 }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 26, paddingBottom: 80 }}
      >

        {/* VOLTAR */}
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#c084fc" />
        </TouchableOpacity>

        <Text style={styles.title}>MEU DESEMPENHO</Text>

        {/* AVATAR */}
        <View style={styles.avatarContainer}>
          <LinearGradient colors={['#a855f7', '#9333ea']} style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(loggedUser?.nome)}</Text>
          </LinearGradient>
        </View>

        {/* USER INFO */}
        <Text style={styles.company}>
          {loggedUser?.tipo === "gerente"
            ? `Gerente ${loggedUser?.nome}`
            : `Colaborador ${loggedUser?.nome}`}
        </Text>

        <Text style={styles.role}>{loggedUser?.cargo || "Funcionário"}</Text>
        <Text style={styles.email}>{loggedUser?.email}</Text>

        {/* PROGRESSO */}
        <View style={styles.progressWrapper}>
          <Text style={styles.progressLabel}>Progresso da trilha: {progresso}%</Text>

          <View style={styles.progressBg}>
            <LinearGradient
              colors={['#a855f7', '#7c3aed']}
              style={[styles.progressFill, { width: `${progresso}%` }]}
            />
          </View>
        </View>

        {/* ESTATÍSTICAS */}
        <View style={styles.statsRow}>
          <Stat icon="checkmark-done-outline" number={concluidos} label="Concluídos" />
          <Stat icon="layers-outline" number={trilhasConcluidas} label="Trilhas" />
          <Stat icon="trophy-outline" number={certsDisponiveis.length} label="Certificados" />
        </View>

        {/* CERTIFICADOS */}
        <Text style={styles.certTitle}>Meus Certificados</Text>

        {certsDisponiveis.length === 0 && (
          <Text style={styles.noCertText}>Nenhum certificado desbloqueado ainda.</Text>
        )}

        {certsDisponiveis.map(cert => (
          <TouchableOpacity
            key={cert.id}
            style={styles.certCard}
            onPress={() => openCertModal(cert)}
          >
            <LinearGradient colors={cert.cor} style={styles.certGradient}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Ionicons name="ribbon-outline" size={26} color="#FFF" />
                <View>
                  <Text style={styles.certName}>{cert.titulo}</Text>
                  <Text style={styles.certMeta}>Meta: {cert.meta}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        ))}

        {/* LOGOUT */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ----------------------------------------------------- */}
      {/* MODAL FUTURISTA DO CERTIFICADO                         */}
      {/* ----------------------------------------------------- */}
      <Modal visible={modalVisible} animationType="none" transparent>
        <Animated.View
          style={[
            styles.modalOverlay,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.modalContent}>
            <LinearGradient
              colors={certSelecionado?.cor || ['#7c3aed', '#4c1d95']}
              style={styles.certificateBox}
            >
              <Text style={styles.certBigTitle}>{certSelecionado?.titulo}</Text>

              <Text style={styles.certUserName}>{loggedUser?.nome}</Text>

              <Text style={styles.certMetaText}>
                Conquista por atingir {certSelecionado?.porcentagem}% na trilha:
              </Text>

              <Text style={styles.certMetaName}>{certSelecionado?.meta}</Text>

              <View style={styles.certDivider} />

              <Text style={styles.certDate}>
                {new Date().toLocaleDateString('pt-BR')}
              </Text>

              <Ionicons
                name="ribbon-outline"
                size={34}
                color="#fff"
                style={{ marginTop: 10 }}
              />
            </LinearGradient>

            <TouchableOpacity style={styles.closeBtn} onPress={closeCertModal}>
              <Ionicons name="close" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </LinearGradient>
  );
}

// --------------------------------------------------------------------------------------------
// COMPONENTE DE ESTATÍSTICA
// --------------------------------------------------------------------------------------------
const Stat = ({ icon, number, label }: any) => (
  <View style={styles.statCard}>
    <Ionicons name={icon} size={26} color="#c084fc" />
    <Text style={styles.statNumber}>{number}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// --------------------------------------------------------------------------------------------
// STYLES
// --------------------------------------------------------------------------------------------
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
    color: "#e9d5ff",
    fontFamily: "Lexend-Regular",
    marginBottom: 30
  },

  avatarContainer: { alignItems: "center", marginBottom: 20 },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(167,139,250,0.7)"
  },

  avatarText: {
    fontSize: 40,
    fontFamily: "Lexend-Regular",
    color: "#FFF"
  },

  company: {
    textAlign: "center",
    fontSize: 14,
    color: "#ddd",
    fontFamily: "Lexend-Regular",
  },

  role: {
    textAlign: "center",
    fontSize: 14,
    color: "#c084fc",
    fontFamily: "Lexend-Regular",
    marginBottom: 4
  },

  email: {
    textAlign: "center",
    color: "#aaa",
    fontSize: 12,
    fontFamily: "Lexend-Light",
    marginBottom: 30
  },

  progressWrapper: { width: "100%", marginBottom: 40 },

  progressLabel: {
    fontSize: 12,
    color: "#ddd",
    fontFamily: "Lexend-Light",
    marginBottom: 6
  },

  progressBg: {
    width: "100%",
    height: 8,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden"
  },

  progressFill: {
    height: "100%",
    borderRadius: 6
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40
  },

  statCard: {
    width: (width - 70) / 3,
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.25)"
  },

  statNumber: {
    marginTop: 6,
    fontSize: 18,
    color: "#e9d5ff",
    fontFamily: "Lexend-Regular"
  },

  statLabel: {
    fontSize: 12,
    color: "#c4b5fd",
    fontFamily: "Lexend-Light"
  },

  certTitle: {
    fontSize: 16,
    fontFamily: "Lexend-Regular",
    color: "#e9d5ff",
    marginBottom: 16
  },

  noCertText: {
    color: "#aaa",
    fontFamily: "Lexend-Light",
    marginBottom: 20
  },

  certCard: {
    marginBottom: 14,
    borderRadius: 16,
    overflow: 'hidden'
  },

  certGradient: {
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  certName: {
    color: "#fff",
    fontFamily: "Lexend-Regular",
    fontSize: 15
  },

  certMeta: {
    color: "#f5e8ff",
    fontFamily: "Lexend-Light",
    fontSize: 12
  },

  logoutButton: {
    marginTop: 30,
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
  },

  // ------------------ MODAL ------------------
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },

  modalContent: {
    width: "100%",
    alignItems: "center"
  },

  certificateBox: {
    width: "100%",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center"
  },

  certBigTitle: {
    color: "#fff",
    fontFamily: "Lexend-Regular",
    fontSize: 22,
    marginBottom: 20,
    letterSpacing: 1
  },

  certUserName: {
    color: "#fff",
    fontFamily: "Lexend-Regular",
    fontSize: 18,
    marginBottom: 10
  },

  certMetaText: {
    color: "#f3e8ff",
    fontFamily: "Lexend-Light",
    fontSize: 13
  },

  certMetaName: {
    color: "#fff",
    fontFamily: "Lexend-Regular",
    fontSize: 15,
    marginTop: 4
  },

  certDivider: {
    width: "80%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginVertical: 20
  },

  certDate: {
    color: "#f3e8ff",
    fontFamily: "Lexend-Light",
    fontSize: 13
  },

  closeBtn: {
    marginTop: 26,
    padding: 10
  }
});
