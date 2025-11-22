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

const LOCAL_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5008' : 'http://localhost:5008';

export default function ManagerDashboard() {
    const { user, logoutUser } = useUser();

    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Listas de Dados
    const [equipes, setEquipes] = useState<any[]>([]);
    const [funcionarios, setFuncionarios] = useState<any[]>([]);

    // Controle de UI
    const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [teamModalVisible, setTeamModalVisible] = useState(false);

    // Formulários
    const [nomeEquipe, setNomeEquipe] = useState('');
    const [nomeFunc, setNomeFunc] = useState('');
    const [emailFunc, setEmailFunc] = useState('');
    const [senhaFunc, setSenhaFunc] = useState('');
    const [planoFunc, setPlanoFunc] = useState('');
    const [equipeIdFunc, setEquipeIdFunc] = useState(''); 

    // Edição
    const [selectedFuncId, setSelectedFuncId] = useState('');
    const [novoPlano, setNovoPlano] = useState('');

    const getAuthConfig = () => {
        return {
            baseURL: LOCAL_API_URL,
            headers: {
                'Authorization': `Bearer ${user?.token}`,
                'Content-Type': 'application/json'
            }
        };
    };

    // --- CORREÇÃO DO ERRO DE NAVEGAÇÃO ---
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!user || !user.token) {
                Alert.alert('Sessão expirada', 'Faça login novamente.');
                router.replace('/gestor-login');
                return;
            }
            // Se tem usuário, busca os dados
            fetchData();
        }, 100); // Pequeno delay para garantir que a navegação montou

        return () => clearTimeout(timer);
    }, [activeTab]); // Recarrega ao mudar de aba ou montar

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
                text: 'Sair', style: 'destructive', onPress: () => {
                    logoutUser();
                    router.replace('/');
                }
            }
        ]);
    };

    const listarEquipes = async () => {
        try {
            if (!user?.token) return;
            const decoded: any = jwtDecode(user.token);
            const meuId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || decoded.sub || decoded.id;

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
            return Alert.alert('Atenção', 'Preencha todos os campos e selecione uma equipe.');
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
            setNomeFunc(''); setEmailFunc(''); setSenhaFunc(''); setPlanoFunc(''); setEquipeIdFunc('');
            listarFuncionarios();
        } catch (error: any) {
            const msg = error.response?.data?.detail || 'Falha ao criar funcionário.';
            Alert.alert('Erro', msg);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEmployee = async (id: string) => {
        Alert.alert('Confirmar', 'Excluir funcionário?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir', style: 'destructive', onPress: async () => {
                    try {
                        await api.delete(`/api/v1/funcionarios/${id}`, getAuthConfig());
                        listarFuncionarios();
                    } catch (e) { Alert.alert('Erro', 'Não foi possível excluir.'); }
                }
            }
        ]);
    };

    const handleUpdateCareerPlan = async () => {
        if (!novoPlano) return Alert.alert('Erro', 'Digite o novo plano.');
        try {
            await api.put(`/api/v1/funcionarios/${selectedFuncId}/plano-carreira`, JSON.stringify(novoPlano), getAuthConfig());
            Alert.alert('Sucesso', 'Plano atualizado!');
            setModalVisible(false);
            listarFuncionarios();
        } catch (e) {
            try {
                await api.put(`/api/v1/funcionarios/${selectedFuncId}/plano-carreira`, { plano: novoPlano }, getAuthConfig());
                setModalVisible(false);
                listarFuncionarios();
            } catch (e2) { Alert.alert('Erro', 'Falha ao atualizar.'); }
        }
    };

    const getSelectedTeamName = () => {
        const selected = equipes.find(e => e.id === equipeIdFunc);
        return selected ? selected.nome : 'Selecione a Equipe';
    };

    const toggleTeamExpand = (id: string) => {
        if (expandedTeamId === id) {
            setExpandedTeamId(null);
        } else {
            setExpandedTeamId(id);
        }
    };

    const getProgressColor = (progresso: number) => {
        if (progresso >= 100) return '#10B981';
        if (progresso >= 70) return '#34D399';
        if (progresso >= 30) return '#FBBF24';
        return '#EF4444';
    };

    // --- LOADING INICIAL DE SEGURANÇA ---
    if (!user || !user.token) {
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

                {/* HEADER */}
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Painel Gerencial</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TouchableOpacity onPress={fetchData} style={styles.iconBtn}>
                            <Ionicons name="refresh" size={22} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLogout} style={[styles.iconBtn, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* TABS */}
                <View style={styles.tabs}>
                    <TouchableOpacity onPress={() => setActiveTab(0)} style={[styles.tab, activeTab === 0 && styles.activeTab]}>
                        <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>Equipes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab(1)} style={[styles.tab, activeTab === 1 && styles.activeTab]}>
                        <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>Funcionários</Text>
                    </TouchableOpacity>
                </View>

                {/* CONTEUDO */}
                <View style={styles.contentContainer}>
                    {activeTab === 0 ? (
                        <>
                            <Text style={styles.sectionTitle}>Nova Equipe</Text>
                            <View style={styles.formCard}>
                                <TextInput style={styles.input} placeholder="Nome da Equipe" placeholderTextColor="#888" value={nomeEquipe} onChangeText={setNomeEquipe} />
                                <TouchableOpacity style={styles.actionBtn} onPress={handleCreateTeam} disabled={loading}>
                                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Criar Equipe</Text>}
                                </TouchableOpacity>
                            </View>

                            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Suas Equipes</Text>
                            <Text style={styles.hintText}>Toque na equipe para ver os membros</Text>

                            {equipes.map((eq, index) => {
                                const membros = funcionarios.filter(f => {
                                    const idEquipeFunc = f.equipe?.id || f.equipeId || f.EquipeId;
                                    return idEquipeFunc === eq.id;
                                });

                                const isExpanded = expandedTeamId === eq.id;

                                return (
                                    <View key={eq.id || index} style={styles.teamCardWrapper}>
                                        <TouchableOpacity
                                            style={styles.teamHeader}
                                            onPress={() => toggleTeamExpand(eq.id)}
                                        >
                                            <View>
                                                <Text style={styles.itemTitle}>{eq.nome}</Text>
                                                <Text style={styles.itemSub}>{membros.length} Membros</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                <TouchableOpacity onPress={() => { setEquipeIdFunc(eq.id); setActiveTab(1); Alert.alert("ID da Equipe copiado para o cadastro!"); }}>
                                                    <Ionicons name="add-circle-outline" size={24} color="#A855F7" />
                                                </TouchableOpacity>
                                                <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#FFF" />
                                            </View>
                                        </TouchableOpacity>

                                        {isExpanded && (
                                            <View style={styles.teamMembersList}>
                                                {membros.length === 0 ? (
                                                    <Text style={styles.emptyText}>Nenhum funcionário nesta equipe.</Text>
                                                ) : (
                                                    membros.map(membro => {
                                                        const progresso = membro.progresso || 0;
                                                        return (
                                                            <View key={membro.id} style={styles.memberRow}>
                                                                <View style={{ flex: 1, paddingRight: 10 }}>
                                                                    <Text style={styles.memberTitle}>{membro.nome}</Text>
                                                                    <Text style={styles.memberSub}>{membro.planoCarreira}</Text>

                                                                    <View style={{ marginTop: 6 }}>
                                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                            <Text style={{ fontSize: 9, color: '#AAA' }}>Progresso</Text>
                                                                            <Text style={{ fontSize: 9, color: getProgressColor(progresso) }}>{progresso}%</Text>
                                                                        </View>
                                                                        <View style={styles.progressBg}>
                                                                            <View style={[styles.progressFill, { width: `${progresso}%`, backgroundColor: getProgressColor(progresso) }]} />
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                                <TouchableOpacity onPress={() => handleDeleteEmployee(membro.id)}>
                                                                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
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
                    ) : (
                            <>
                                <Text style={styles.sectionTitle}>Novo Funcionário</Text>
                                <View style={styles.formCard}>
                                    <TextInput style={styles.input} placeholder="Nome" placeholderTextColor="#888" value={nomeFunc} onChangeText={setNomeFunc} />
                                    <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#888" value={emailFunc} onChangeText={setEmailFunc} autoCapitalize='none' />
                                    <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#888" value={senhaFunc} onChangeText={setSenhaFunc} secureTextEntry />
                                    <TextInput style={styles.input} placeholder="Plano (Ex: Junior)" placeholderTextColor="#888" value={planoFunc} onChangeText={setPlanoFunc} />

                                    <TouchableOpacity
                                        style={[styles.input, { justifyContent: 'center' }]}
                                        onPress={() => setTeamModalVisible(true)}
                                    >
                                        <Text style={{ color: equipeIdFunc ? '#FFF' : '#888', fontFamily: 'Lexend-Regular' }}>
                                            {getSelectedTeamName()}
                                        </Text>
                                        <Ionicons name="chevron-down" size={20} color="#888" style={{ position: 'absolute', right: 14 }} />
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.actionBtn} onPress={handleCreateEmployee} disabled={loading}>
                                        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Cadastrar</Text>}
                                    </TouchableOpacity>
                                </View>

                                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Todos os Colaboradores</Text>
                                {funcionarios.map((func, index) => {
                                    const progresso = func.progresso || 0;
                                    return (
                                        <View key={func.id || index} style={styles.listItem}>
                                            <View style={{ flex: 1, marginRight: 10 }}>
                                                <Text style={styles.itemTitle}>{func.nome}</Text>
                                                <Text style={styles.itemSub}>{func.email}</Text>
                                                <Text style={[styles.itemSub, { marginTop: 2, color: '#9CA3AF' }]}>
                                                    {func.equipe?.nome || 'Equipe desconhecida'}
                                                </Text>

                                                <View style={{ marginTop: 10 }}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                                        <Text style={{ color: '#AAA', fontSize: 10, fontFamily: 'Lexend-Regular' }}>Trilha de Aprendizado</Text>
                                                        <Text style={{ color: getProgressColor(progresso), fontSize: 10, fontFamily: 'Lexend-Bold' }}>{progresso}%</Text>
                                                    </View>
                                                    <View style={styles.progressBg}>
                                                        <View style={[styles.progressFill, { width: `${progresso}%`, backgroundColor: getProgressColor(progresso) }]} />
                                                    </View>
                                            </View>

                                        </View>
                                        <View style={styles.actionsRow}>
                                            <TouchableOpacity onPress={() => { setSelectedFuncId(func.id); setNovoPlano(func.planoCarreira); setModalVisible(true); }} style={styles.miniBtn}>
                                                <Ionicons name="create-outline" size={18} color="#3B82F6" />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleDeleteEmployee(func.id)} style={styles.miniBtn}>
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

            {/* MODAIS */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Plano</Text>
                        <TextInput style={[styles.input, { width: '100%', backgroundColor: '#F4F4F5', color: '#000' }]} value={novoPlano} onChangeText={setNovoPlano} placeholder="Novo Cargo" />
                        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16, width: '100%' }}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.modalBtn, { backgroundColor: '#E5E7EB' }]}><Text style={{ color: '#000' }}>Cancelar</Text></TouchableOpacity>
                            <TouchableOpacity onPress={handleUpdateCareerPlan} style={[styles.modalBtn, { backgroundColor: '#4F46E5' }]}><Text style={{ color: '#FFF' }}>Salvar</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={teamModalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { maxHeight: '60%' }]}>
                        <Text style={styles.modalTitle}>Selecione a Equipe</Text>
                        {equipes.length === 0 ? (
                            <Text style={{ color: '#666', marginBottom: 20 }}>Nenhuma equipe encontrada.</Text>
                        ) : (
                            <ScrollView style={{ width: '100%', marginBottom: 16 }}>
                                {equipes.map((eq) => (
                                    <TouchableOpacity
                                        key={eq.id}
                                        style={styles.selectItem}
                                        onPress={() => { setEquipeIdFunc(eq.id); setTeamModalVisible(false); }}
                                    >
                                        <Text style={styles.selectItemText}>{eq.nome}</Text>
                                        {equipeIdFunc === eq.id && <Ionicons name="checkmark" size={20} color="#4F46E5" />}
                                    </TouchableOpacity>
                                ))}
                                </ScrollView>
                        )}
                        <TouchableOpacity onPress={() => setTeamModalVisible(false)} style={[styles.modalBtn, { backgroundColor: '#E5E7EB', width: '100%' }]}>
                            <Text style={{ color: '#000' }}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    iconBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
    title: { fontSize: 20, color: '#FFF', fontFamily: 'Lexend-Bold' },
    tabs: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4, marginBottom: 20 },
    tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
    activeTab: { backgroundColor: '#7C3AED' },
    tabText: { color: '#AAA', fontFamily: 'Lexend-Regular' },
    activeTabText: { color: '#FFF', fontFamily: 'Lexend-Bold' },
    sectionTitle: { color: '#FFF', fontSize: 16, fontFamily: 'Lexend-Bold', marginBottom: 12 },
    hintText: { color: '#AAA', fontSize: 12, marginBottom: 10, fontStyle: 'italic' },
    formCard: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', gap: 12 },
    input: { backgroundColor: '#000', color: '#FFF', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#333', fontFamily: 'Lexend-Regular' },
    actionBtn: { backgroundColor: '#10B981', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 },
    btnText: { color: '#FFF', fontFamily: 'Lexend-Bold' },
    listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    itemTitle: { color: '#FFF', fontFamily: 'Lexend-Bold', fontSize: 14 },
    itemSub: { color: '#AAA', fontSize: 12 },
    itemBadge: { color: '#FBBF24', fontSize: 11, marginTop: 4 },
    actionsRow: { flexDirection: 'row', gap: 8 },
    miniBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 },
    teamCardWrapper: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, marginBottom: 10, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    teamHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    teamMembersList: { backgroundColor: 'rgba(0,0,0,0.2)', padding: 10 },
    memberRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    memberTitle: { color: '#E2E8F0', fontSize: 13, fontFamily: 'Lexend-Regular' },
    memberSub: { color: '#64748B', fontSize: 11 },
    emptyText: { color: '#666', fontStyle: 'italic', fontSize: 12, textAlign: 'center', padding: 10 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContent: { width: '100%', backgroundColor: '#FFF', borderRadius: 20, padding: 24, alignItems: 'center' },
    modalTitle: { fontSize: 18, fontFamily: 'Lexend-Bold', marginBottom: 12 },
    modalBtn: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center' },
    selectItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#EEE', width: '100%' },
    selectItemText: { fontSize: 16, color: '#333', fontFamily: 'Lexend-Regular' },
    progressBg: { width: '100%', height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 2 }
});