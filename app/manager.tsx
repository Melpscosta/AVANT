// ============================================================================
// MANAGER DASHBOARD – AVANT DIGITAL
// Painel gerencial moderno com:
// - Indicadores superiores
// - Equipes / Funcionários
// - Meta padrão "Trilha Default"
// - Certificados Bronze / Prata / Ouro
// ============================================================================

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useUser } from '../src/context/UserContext';
import storage from '../src/services/storage';

// Meta padrão dos funcionários criados
const META_PADRAO = "Trilha Default";

export default function ManagerDashboard() {

  const { logoutUser } = useUser();

  // --------------------------------------------------------------------------
  // ESTADOS
  // --------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState(0);

  const [equipes, setEquipes] = useState<any[]>([]);
  const [funcionarios, setFuncionarios] = useState<any[]>([]);

  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [teamModalVisible, setTeamModalVisible] = useState(false);

  const [nomeEquipe, setNomeEquipe] = useState('');
  const [nomeFunc, setNomeFunc] = useState('');
  const [emailFunc, setEmailFunc] = useState('');
  const [senhaFunc, setSenhaFunc] = useState('');
  const [planoFunc, setPlanoFunc] = useState('');
  const [equipeIdFunc, setEquipeIdFunc] = useState('');

  const [selectedFuncId, setSelectedFuncId] = useState('');
  const [novoPlano, setNovoPlano] = useState('');

  const [loggedUser, setLoggedUser] = useState<any>(null);

  // --------------------------------------------------------------------------
  // CARREGAR SESSION + STORAGE
  // --------------------------------------------------------------------------
  useEffect(() => {
    const session = storage.getObject("mock_session");
    if (session) setLoggedUser(session);

    carregarEquipes();
    carregarFuncionarios();
  }, []);

  const carregarEquipes = () => {
    const data = storage.getObject("mock_teams") || [];
    setEquipes(data);
  };

  const carregarFuncionarios = () => {
    const data = storage.getObject("mock_workers") || [];
    setFuncionarios(data);
  };

  const salvarEquipes = (teams: any[]) => {
    storage.setObject("mock_teams", teams);
    setEquipes(teams);
  };

  const salvarFuncionarios = (workers: any[]) => {
    storage.setObject("mock_workers", workers);
    setFuncionarios(workers);
  };

  // --------------------------------------------------------------------------
  // LOGOUT
  // --------------------------------------------------------------------------
  const handleLogout = () => {
    Alert.alert("Sair", "Deseja desconectar da sua conta?", [
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

  // --------------------------------------------------------------------------
  // CRIAR EQUIPE
  // --------------------------------------------------------------------------
  const handleCreateTeam = () => {
    if (!nomeEquipe) return Alert.alert("Erro", "Digite o nome da equipe.");

    const newTeam = {
      id: crypto.randomUUID(),
      nome: nomeEquipe,
      gerenteId: loggedUser?.id
    };

    salvarEquipes([...equipes, newTeam]);

    Alert.alert("Sucesso", "Equipe criada!");
    setNomeEquipe("");
  };

  // --------------------------------------------------------------------------
  // CRIAR FUNCIONÁRIO
  // --------------------------------------------------------------------------
  const handleCreateEmployee = () => {
    if (!nomeFunc || !emailFunc || !senhaFunc || !equipeIdFunc) {
      return Alert.alert("Atenção", "Preencha todos os campos.");
    }

    const newWorker = {
      id: crypto.randomUUID(),
      nome: nomeFunc,
      email: emailFunc,
      senha: senhaFunc,
      planoCarreira: planoFunc || "Iniciante",
      equipeId: equipeIdFunc,

      // IMPORTANTE — META PADRÃO
      metaSelecionada: META_PADRAO,

      progresso: 0
    };

    salvarFuncionarios([...funcionarios, newWorker]);

    Alert.alert("Sucesso", "Funcionário cadastrado!");

    setNomeFunc("");
    setEmailFunc("");
    setSenhaFunc("");
    setPlanoFunc("");
    setEquipeIdFunc("");
  };

  // --------------------------------------------------------------------------
  // EXCLUIR FUNCIONÁRIO
  // --------------------------------------------------------------------------
  const handleDeleteEmployee = (id: string) => {
    Alert.alert("Confirmar", "Excluir funcionário?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          const updated = funcionarios.filter(f => f.id !== id);
          salvarFuncionarios(updated);
        }
      }
    ]);
  };

  // --------------------------------------------------------------------------
  // EDITAR PLANO DE CARREIRA
  // --------------------------------------------------------------------------
  const handleUpdateCareerPlan = () => {
    if (!novoPlano) return Alert.alert("Erro", "Digite o novo plano.");

    const updated = funcionarios.map(f =>
      f.id === selectedFuncId
        ? { ...f, planoCarreira: novoPlano }
        : f
    );

    salvarFuncionarios(updated);

    Alert.alert("Sucesso", "Plano atualizado!");
    setModalVisible(false);
  };

  // --------------------------------------------------------------------------
  // VISUAIS
  // --------------------------------------------------------------------------
  const toggleTeamExpand = (id: string) =>
    setExpandedTeamId(prev => (prev === id ? null : id));

  const getProgressColor = (p: number) => {
    if (p >= 100) return "#10B981";
    if (p >= 60) return "#34D399";
    if (p >= 30) return "#FBBF24";
    return "#EF4444";
  };

  const calcularCertificados = (progresso: number) => {
    const lista = [];
    if (progresso >= 30) lista.push("Bronze");
    if (progresso >= 60) lista.push("Prata");
    if (progresso >= 100) lista.push("Ouro");
    return lista;
  };

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------
  return (
    <LinearGradient colors={['#080014', '#1e0b3a', '#3b0d70']} style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* ------------------------------------------------------------------ */}
        {/* HEADER SUPERIOR */}
        {/* ------------------------------------------------------------------ */}
        <View style={styles.header}>
          <Text style={styles.title}>Painel Gerencial</Text>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity onPress={() => { carregarEquipes(); carregarFuncionarios(); }} style={styles.iconBtn}>
              <Ionicons name="refresh" size={22} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              style={[styles.iconBtn, { backgroundColor: "rgba(239, 68, 68, 0.2)" }]}
            >
              <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ------------------------------------------------------------------ */}
        {/* INDICADORES SUPERIORES */}
        {/* ------------------------------------------------------------------ */}
        <View style={styles.dashboardRow}>
          <View style={styles.dashboardCard}>
            <Ionicons name="people-outline" size={26} color="#c084fc" />
            <Text style={styles.dashNumber}>{funcionarios.length}</Text>
            <Text style={styles.dashLabel}>Funcionários</Text>
          </View>

          <View style={styles.dashboardCard}>
            <Ionicons name="albums-outline" size={26} color="#c084fc" />
            <Text style={styles.dashNumber}>{equipes.length}</Text>
            <Text style={styles.dashLabel}>Equipes</Text>
          </View>

          <View style={styles.dashboardCard}>
            <Ionicons name="ribbon-outline" size={26} color="#c084fc" />
            <Text style={styles.dashNumber}>
              {funcionarios.reduce((acc, f) => acc + calcularCertificados(f.progresso).length, 0)}
            </Text>
            <Text style={styles.dashLabel}>Certificados</Text>
          </View>
        </View>

        {/* ------------------------------------------------------------------ */}
        {/* TABS */}
        {/* ------------------------------------------------------------------ */}
        <View style={styles.tabs}>
          <TouchableOpacity
            onPress={() => setActiveTab(0)}
            style={[styles.tab, activeTab === 0 && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>
              Equipes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab(1)}
            style={[styles.tab, activeTab === 1 && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>
              Funcionários
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================================================================== */}
        {/* ----------------------------- ABA EQUIPES ------------------------ */}
        {/* ================================================================== */}
        {activeTab === 0 && (
          <>
            <Text style={styles.sectionTitle}>Criar nova equipe</Text>

            <View style={styles.formCard}>
              <TextInput
                style={styles.input}
                placeholder="Nome da Equipe"
                placeholderTextColor="#777"
                value={nomeEquipe}
                onChangeText={setNomeEquipe}
              />

              <TouchableOpacity style={styles.actionBtn} onPress={handleCreateTeam}>
                <Text style={styles.btnText}>Criar Equipe</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Suas equipes</Text>
            <Text style={styles.hintText}>Toque na equipe para ver os membros</Text>

            {equipes.map(eq => {
              const membros = funcionarios.filter(f => f.equipeId === eq.id);
              const expanded = expandedTeamId === eq.id;

              return (
                <View key={eq.id} style={styles.teamCardWrapper}>
                  <TouchableOpacity
                    style={styles.teamHeader}
                    onPress={() => toggleTeamExpand(eq.id)}
                  >
                    <View>
                      <Text style={styles.itemTitle}>{eq.nome}</Text>
                      <Text style={styles.itemSub}>{membros.length} membros</Text>
                    </View>

                    <Ionicons
                      name={expanded ? "chevron-up" : "chevron-down"}
                      size={22}
                      color="#FFF"
                    />
                  </TouchableOpacity>

                  {expanded && (
                    <View style={styles.teamMembersList}>
                      {membros.length === 0 ? (
                        <Text style={styles.emptyText}>Nenhum funcionário nesta equipe.</Text>
                      ) : (
                        membros.map(m => {
                          const certificados = calcularCertificados(m.progresso);

                          return (
                            <View key={m.id} style={styles.memberRow}>
                              <View style={{ flex: 1 }}>
                                <Text style={styles.memberTitle}>{m.nome}</Text>
                                <Text style={styles.memberSub}>{m.planoCarreira}</Text>

                                {/* Progresso */}
                                <View style={styles.progressBg}>
                                  <View
                                    style={[
                                      styles.progressFill,
                                      {
                                        width: `${m.progresso}%`,
                                        backgroundColor: getProgressColor(m.progresso)
                                      }
                                    ]}
                                  />
                                </View>

                                {/* Certificados */}
                                <View style={{ flexDirection: "row", marginTop: 6, gap: 6 }}>
                                  {certificados.includes("Bronze") && <Ionicons name="ribbon-outline" size={16} color="#cd7f32" />}
                                  {certificados.includes("Prata") && <Ionicons name="ribbon-outline" size={16} color="#e5e7eb" />}
                                  {certificados.includes("Ouro") && <Ionicons name="ribbon-outline" size={16} color="#facc15" />}
                                </View>
                              </View>

                              <TouchableOpacity onPress={() => handleDeleteEmployee(m.id)}>
                                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                              </TouchableOpacity>
                            </View>
                          );
                        })
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </>
        )}

        {/* ================================================================== */}
        {/* ------------------------- ABA FUNCIONÁRIOS ----------------------- */}
        {/* ================================================================== */}
        {activeTab === 1 && (
          <>
            <Text style={styles.sectionTitle}>Novo funcionário</Text>

            <View style={styles.formCard}>
              <TextInput
                style={styles.input}
                placeholder="Nome"
                placeholderTextColor="#777"
                value={nomeFunc}
                onChangeText={setNomeFunc}
              />
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#777"
                autoCapitalize="none"
                value={emailFunc}
                onChangeText={setEmailFunc}
              />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#777"
                secureTextEntry
                value={senhaFunc}
                onChangeText={setSenhaFunc}
              />
              <TextInput
                style={styles.input}
                placeholder="Plano (ex: Júnior)"
                placeholderTextColor="#777"
                value={planoFunc}
                onChangeText={setPlanoFunc}
              />

              {/* Selecionar equipe */}
              <TouchableOpacity
                style={[styles.input, { justifyContent: "center" }]}
                onPress={() => setTeamModalVisible(true)}
              >
                <Text
                  style={{
                    color: equipeIdFunc ? "#FFF" : "#777",
                    fontFamily: "Lexend-Regular"
                  }}
                >
                  {equipeIdFunc
                    ? equipes.find(e => e.id === equipeIdFunc)?.nome
                    : "Selecione a equipe"}
                </Text>

                <Ionicons
                  name="chevron-down"
                  size={20}
                  color="#777"
                  style={{ position: "absolute", right: 14 }}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn} onPress={handleCreateEmployee}>
                <Text style={styles.btnText}>Cadastrar</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Colaboradores</Text>

            {funcionarios.map(func => {
              const certificados = calcularCertificados(func.progresso);

              return (
                <View key={func.id} style={styles.listItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{func.nome}</Text>
                    <Text style={styles.itemSub}>{func.email}</Text>
                    <Text style={styles.itemSub}>
                      {equipes.find(e => e.id === func.equipeId)?.nome || "Sem equipe"}
                    </Text>

                    <View style={{ marginTop: 10 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between"
                        }}
                      >
                        <Text style={{ color: "#AAA", fontSize: 10 }}>Progresso</Text>
                        <Text
                          style={{
                            fontSize: 10,
                            color: getProgressColor(func.progresso)
                          }}
                        >
                          {func.progresso}%
                        </Text>
                      </View>

                      <View style={styles.progressBg}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${func.progresso}%`,
                              backgroundColor: getProgressColor(func.progresso)
                            }
                          ]}
                        />
                      </View>
                    </View>

                    {/* Certificados */}
                    <View style={{ flexDirection: "row", marginTop: 6, gap: 6 }}>
                      {certificados.includes("Bronze") && <Ionicons name="ribbon-outline" size={16} color="#cd7f32" />}
                      {certificados.includes("Prata") && <Ionicons name="ribbon-outline" size={16} color="#e5e7eb" />}
                      {certificados.includes("Ouro") && <Ionicons name="ribbon-outline" size={16} color="#facc15" />}
                    </View>
                  </View>

                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedFuncId(func.id);
                        setNovoPlano(func.planoCarreira);
                        setModalVisible(true);
                      }}
                      style={styles.miniBtn}
                    >
                      <Ionicons name="create-outline" size={18} color="#3B82F6" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDeleteEmployee(func.id)}
                      style={styles.miniBtn}
                    >
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>

      {/* ================================================================== */}
      {/* ------------------------------- MODAIS --------------------------- */}
      {/* ================================================================== */}

      {/* Editar plano */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Plano</Text>

            <TextInput
              style={[
                styles.input,
                { width: "100%", backgroundColor: "#EAEAEA", color: "#000" }
              ]}
              value={novoPlano}
              onChangeText={setNovoPlano}
            />

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                marginTop: 20,
                width: "100%"
              }}
            >
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalBtn, { backgroundColor: "#DDD" }]}
              >
                <Text style={{ color: "#333" }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUpdateCareerPlan}
                style={[styles.modalBtn, { backgroundColor: "#4F46E5" }]}
              >
                <Text style={{ color: "#FFF" }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Selecionar equipe */}
      <Modal visible={teamModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: "60%" }]}>
            <Text style={styles.modalTitle}>Selecione a Equipe</Text>

            <ScrollView
              style={{
                width: "100%",
                marginBottom: 20
              }}
            >
              {equipes.map(eq => (
                <TouchableOpacity
                  key={eq.id}
                  style={styles.selectItem}
                  onPress={() => {
                    setEquipeIdFunc(eq.id);
                    setTeamModalVisible(false);
                  }}
                >
                  <Text style={styles.selectItemText}>{eq.nome}</Text>

                  {eq.id === equipeIdFunc && (
                    <Ionicons name="checkmark" size={22} color="#4F46E5" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setTeamModalVisible(false)}
              style={[styles.modalBtn, { backgroundColor: "#DDD", width: "100%" }]}
            >
              <Text style={{ color: "#333" }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </LinearGradient>
  );
}

// ============================================================================
// ESTILOS
// ============================================================================
const styles = StyleSheet.create({
  container: { flex: 1 },

  scrollContent: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30
  },

  title: {
    color: "#FFF",
    fontSize: 20,
    fontFamily: "Lexend-Regular",
    letterSpacing: 1
  },

  // INDICADORES
  dashboardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30
  },

  dashboardCard: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)"
  },

  dashNumber: {
    color: "#e9d5ff",
    fontSize: 18,
    fontFamily: "Lexend-Regular",
    marginTop: 4
  },

  dashLabel: {
    color: "#c4b5fd",
    fontFamily: "Lexend-Light",
    fontSize: 12
  },

  iconBtn: {
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14
  },

  tabs: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 4,
    marginBottom: 25
  },

  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10
  },

  activeTab: {
    backgroundColor: "#6D28D9"
  },

  tabText: {
    color: "#AAA",
    fontFamily: "Lexend-Regular",
    fontSize: 14
  },

  activeTabText: {
    color: "#FFF",
    fontFamily: "Lexend-Regular"
  },

  sectionTitle: {
    color: "#FFF",
    fontFamily: "Lexend-Regular",
    fontSize: 16,
    marginBottom: 12
  },

  hintText: {
    color: "#AAA",
    fontSize: 12,
    marginBottom: 8,
    fontFamily: "Lexend-Regular"
  },

  formCard: {
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 12
  },

  input: {
    backgroundColor: "#00000030",
    padding: 14,
    borderRadius: 10,
    color: "#FFF",
    fontFamily: "Lexend-Regular",
    borderWidth: 1,
    borderColor: "#222"
  },

  actionBtn: {
    backgroundColor: "#6D28D9",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8
  },

  btnText: {
    color: "#FFF",
    fontFamily: "Lexend-Regular",
    fontSize: 14
  },

  listItem: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)"
  },

  itemTitle: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: "Lexend-Regular"
  },

  itemSub: {
    color: "#AAA",
    fontSize: 12,
    fontFamily: "Lexend-Regular"
  },

  actionsRow: {
    flexDirection: "row",
    gap: 10
  },

  miniBtn: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8
  },

  teamCardWrapper: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)"
  },

  teamHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16
  },

  teamMembersList: {
    backgroundColor: "rgba(0,0,0,0.25)",
    padding: 12
  },

  memberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)"
  },

  memberTitle: {
    color: "#E5E7EB",
    fontFamily: "Lexend-Regular",
    fontSize: 13
  },

  memberSub: {
    color: "#9CA3AF",
    fontSize: 11,
    fontFamily: "Lexend-Regular"
  },

  progressBg: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 6
  },

  progressFill: {
    height: "100%",
    borderRadius: 4
  },

  emptyText: {
    color: "#AAA",
    fontFamily: "Lexend-Regular",
    textAlign: "center",
    padding: 10
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },

  modalContent: {
    backgroundColor: "#FFF",
    width: "100%",
    padding: 24,
    borderRadius: 20,
    alignItems: "center"
  },

  modalTitle: {
    fontSize: 18,
    fontFamily: "Lexend-Regular",
    marginBottom: 16
  },

  modalBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center"
  },

  selectItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD"
  },

  selectItemText: {
    fontSize: 16,
    fontFamily: "Lexend-Regular",
    color: "#333"
  }
});
