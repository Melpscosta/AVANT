import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useUser } from '../src/context/UserContext';
import api from '../src/services/api';

const LOCAL_API_URL = Platform.OS === 'android'
    ? 'http://localhost:5008/'
    : 'http://localhost:5008/';

export default function ManagerDashboard() {
    const { user, logoutUser } = useUser();

    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

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

    const getAuthConfig = () => ({
        baseURL: LOCAL_API_URL,
        headers: {
            'Authorization': `Bearer ${user?.token}`,
            'Content-Type': 'application/json'
        }
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!user || !user.token) {
                router.replace('/');
                return;
            }
            fetchData();
        }, 100);

        return () => clearTimeout(timer);
    }, [activeTab]);

    const fetchData = async () => {
        setRefreshing(true);
        try {
            await listarEquipes();
            await listarFuncionarios();
        } finally {
            setRefreshing(false);
        }
    };

const handleLogout = () => {
    Alert.alert('Sair', 'Deseja desconectar da sua conta?', [
        { text: 'Cancelar', style: 'cancel' },
        {
            text: 'Sair',
            style: 'destructive',
            onPress: () => {
                logoutUser();          // limpa o contexto
                router.dismissAll();   // limpa TODAS as rotas da pilha
                router.replace('/');   // volta para app/index.tsx
            }
        }
    ]);
};
    const listarEquipes = async () => {
        try {
            if (!user?.token) return;

            const decoded: any = jwtDecode(user.token);
            const meuId =
                decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
                || decoded.sub
                || decoded.id;

            const response = await api.get('/api/v1/equipes', getAuthConfig());
            const dados = Array.isArray(response.data) ? response.data : [response.data];

            const minhasEquipes = dados.filter((eq: any) => eq.gerenteId === meuId);
            setEquipes(minhasEquipes);
        } catch (error) {
            console.log("Erro ao listar equipes:", error);
        }
    };

    const handleCreateTeam = async () => {
        if (!nomeEquipe) return Alert.alert('Erro', 'Digite o nome da equipe');
        setLoading(true);
        try {
            await api.post('/api/v1/equipes', { nome: nomeEquipe }, getAuthConfig());
            Alert.alert('Sucesso', 'Equipe criada!');
            setNomeEquipe('');
            listarEquipes();
        } catch (error) {
            Alert.alert('Erro', 'Falha ao criar equipe.');
        } finally {
            setLoading(false);
        }
    };

    const listarFuncionarios = async () => {
        try {
            const config = { ...getAuthConfig(), params: { pagina: 1, tamanhoPagina: 100 } };
            const response = await api.get('/api/v1/funcionarios', config);

            if (response.data && response.data.itens) setFuncionarios(response.data.itens);
            else if (Array.isArray(response.data)) setFuncionarios(response.data);
        } catch (error) {
            console.log("Erro funcionarios:", error);
        }
    };

    const handleCreateEmployee = async () => {
        if (!nomeFunc || !emailFunc || !senhaFunc || !equipeIdFunc) {
            return Alert.alert('Atenção', 'Preencha todos os campos.');
        }
        setLoading(true);
        try {
            await api.post('/api/v1/funcionarios', {
                nome: nomeFunc,
                email: emailFunc,
                senha: senhaFunc,
                planoCarreira: planoFunc || 'Iniciante',
                equipeId: equipeIdFunc
            }, getAuthConfig());

            Alert.alert('Sucesso', 'Funcionário criado!');
            setNomeFunc('');
            setEmailFunc('');
            setSenhaFunc('');
            setPlanoFunc('');
            setEquipeIdFunc('');
            listarFuncionarios();
        } catch (error: any) {
            Alert.alert('Erro', error.response?.data?.detail || 'Falha ao criar funcionário.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEmployee = (id: string) => {
        Alert.alert('Confirmar', 'Excluir funcionário?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await api.delete(`/api/v1/funcionarios/${id}`, getAuthConfig());
                        listarFuncionarios();
                    } catch {
                        Alert.alert('Erro', 'Não foi possível excluir.');
                    }
                }
            }
        ]);
    };

    const handleUpdateCareerPlan = async () => {
        if (!novoPlano) return Alert.alert('Erro', 'Digite o novo plano.');
        try {
            await api.put(`/api/v1/funcionarios/${selectedFuncId}/plano-carreira`,
                { plano: novoPlano },
                getAuthConfig()
            );
            Alert.alert('Sucesso', 'Plano atualizado!');
            setModalVisible(false);
            listarFuncionarios();
        } catch {
            Alert.alert('Erro', 'Falha ao atualizar.');
        }
    };

    const toggleTeamExpand = (id: string) => {
        setExpandedTeamId(prev => prev === id ? null : id);
    };

    const getProgressColor = (p: number) => {
        if (p >= 100) return '#10B981';
        if (p >= 70) return '#34D399';
        if (p >= 30) return '#FBBF24';
        return '#EF4444';
    };

    if (!user?.token) {
        return (
            <View style={{ flex: 1, backgroundColor: '#050011', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#A855F7" />
                <Text style={{ color: '#AAA', marginTop: 10 }}>Verificando credenciais...</Text>
            </View>
        );
    }

    return (
        <LinearGradient colors={['#050011', '#1e1b4b']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* HEADER — sem seta, apenas título e logout */}
                <View style={styles.header}>
                    <Text style={styles.title}>Painel Gerencial</Text>

                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity onPress={fetchData} style={styles.iconBtn}>
                            <Ionicons name="refresh" size={22} color="#FFF" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleLogout}
                            style={[styles.iconBtn, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* TABS */}
                <View style={styles.tabs}>
                    <TouchableOpacity onPress={() => setActiveTab(0)} style={[styles.tab, activeTab === 0 && styles.activeTab]}>
                        <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>
                            Equipes
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setActiveTab(1)} style={[styles.tab, activeTab === 1 && styles.activeTab]}>
                        <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>
                            Funcionários
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* CONTEÚDO DAS ABAS */}
                <View style={styles.contentContainer}>
                    {activeTab === 0 ? (

                        /* ------------------------- EQUIPES --------------------------- */
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
                                const membros = funcionarios.filter(f => {
                                    const idEquipe = f.equipe?.id || f.equipeId;
                                    return idEquipe === eq.id;
                                });

                                const expanded = expandedTeamId === eq.id;

                                return (
                                    <View key={eq.id} style={styles.teamCardWrapper}>
                                        <TouchableOpacity style={styles.teamHeader} onPress={() => toggleTeamExpand(eq.id)}>
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
                                                    membros.map(m => (
                                                        <View key={m.id} style={styles.memberRow}>
                                                            <View style={{ flex: 1 }}>
                                                                <Text style={styles.memberTitle}>{m.nome}</Text>
                                                                <Text style={styles.memberSub}>{m.planoCarreira}</Text>

                                                                <View style={styles.progressBg}>
                                                                    <View
                                                                        style={[
                                                                            styles.progressFill,
                                                                            {
                                                                                width: `${m.progresso || 0}%`,
                                                                                backgroundColor: getProgressColor(m.progresso || 0)
                                                                            }
                                                                        ]}
                                                                    />
                                                                </View>
                                                            </View>

                                                            <TouchableOpacity onPress={() => handleDeleteEmployee(m.id)}>
                                                                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                                                            </TouchableOpacity>
                                                        </View>
                                                    ))
                                                )}
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </>

                    ) : (

                        /* ---------------------- FUNCIONARIOS ---------------------- */
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
                                    autoCapitalize='none'
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

                                {/* Selecionar Equipe */}
                                <TouchableOpacity
                                    style={[styles.input, { justifyContent: 'center' }]}
                                    onPress={() => setTeamModalVisible(true)}
                                >
                                    <Text style={{ color: equipeIdFunc ? '#FFF' : '#777', fontFamily: "Lexend-Regular" }}>
                                        {equipeIdFunc
                                            ? (equipes.find(e => e.id === equipeIdFunc)?.nome || "Equipe")
                                            : "Selecione a equipe"}
                                    </Text>
                                    <Ionicons
                                        name="chevron-down"
                                        size={20}
                                        color="#777"
                                        style={{ position: 'absolute', right: 14 }}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.actionBtn} onPress={handleCreateEmployee}>
                                    <Text style={styles.btnText}>Cadastrar</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Colaboradores</Text>

                            {funcionarios.map(func => {
                                const progresso = func.progresso || 0;

                                return (
                                    <View key={func.id} style={styles.listItem}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.itemTitle}>{func.nome}</Text>
                                            <Text style={styles.itemSub}>{func.email}</Text>
                                            <Text style={styles.itemSub}>{func.equipe?.nome || "Equipe desconhecida"}</Text>

                                            <View style={{ marginTop: 10 }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                                                    <Text style={{ color: '#AAA', fontSize: 10 }}>Progresso</Text>
                                                    <Text style={{ fontSize: 10, color: getProgressColor(progresso) }}>
                                                        {progresso}%
                                                    </Text>
                                                </View>

                                                <View style={styles.progressBg}>
                                                    <View
                                                        style={[
                                                            styles.progressFill,
                                                            {
                                                                width: `${progresso}%`,
                                                                backgroundColor: getProgressColor(progresso)
                                                            }
                                                        ]}
                                                    />
                                                </View>
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
                </View>
            </ScrollView>

            {/* MODAL EDITAR PLANO */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Plano</Text>

                        <TextInput
                            style={[styles.input, { width: "100%", backgroundColor: "#EAEAEA", color: "#000" }]}
                            value={novoPlano}
                            onChangeText={setNovoPlano}
                        />

                        <View style={{ flexDirection: 'row', gap: 10, marginTop: 20, width: "100%" }}>
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

            {/* MODAL SELECIONAR EQUIPE */}
            <Modal visible={teamModalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { maxHeight: '60%' }]}>
                        <Text style={styles.modalTitle}>Selecione a Equipe</Text>

                        <ScrollView style={{ width: '100%', marginBottom: 20 }}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollContent: {
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: 20
    },

    /* HEADER */
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

    iconBtn: {
        padding: 10,
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: 14
    },

    /* TABS */
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
