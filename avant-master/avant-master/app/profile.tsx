import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 1. Importamos o Contexto para pegar os dados
import { useUser } from '../src/context/UserContext';

export default function Profile() {
  const insets = useSafeAreaInsets();

  // 2. Pegamos o usuário logado e a função de logout
  const { user, logoutUser } = useUser();

  // Função auxiliar para pegar as iniciais (Ex: Melps Costa -> MC)
  const getInitials = (name?: string) => {
    if (!name) return 'US';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair da conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          logoutUser(); // Limpa o token e dados
          router.replace('/'); // Volta pro login
        }
      }
    ]);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/selection');
    }
  };

  return (
    <LinearGradient
      colors={['#050011', '#240046']}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }
        ]}
      >
        
        {/* Barra de Navegação */}
        <View style={styles.navBar}>
          <TouchableOpacity 
            onPress={handleBack}
            style={styles.iconButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          
          <Text style={styles.pageTitle}>MEU PERFIL</Text>
          
          {/* Botão invisível só para balancear o layout */}
          <View style={{ width: 44 }} /> 
        </View>

        {/* Cabeçalho do Usuário - AGORA COM DADOS REAIS */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
             <LinearGradient colors={['#7C3AED', '#A78BFA']} style={styles.avatar}>
              {/* Mostra as iniciais do nome real */}
              <Text style={styles.avatarText}>
                {getInitials(user?.nome)}
              </Text>
             </LinearGradient>
             <View style={styles.onlineBadge} />
          </View>
          
          {/* Dados vindos do Contexto */}
          <Text style={styles.userName}>{user?.nome || "Visitante"}</Text>
          <Text style={styles.userRole}>{user?.cargo || "Colaborador Externo"}</Text>
          <Text style={styles.userEmail}>{user?.email || ""}</Text>
        </View>

        {/* Grid de Estatísticas (Mockados por enquanto, pois não temos endpoint de stats ainda) */}
        <View style={styles.statsGrid}>
          <BlurView intensity={20} tint="light" style={styles.statCard}>
            <Ionicons name="checkmark-circle-outline" size={28} color="#00A3FF" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Concluídos</Text>
          </BlurView>

          <BlurView intensity={20} tint="light" style={styles.statCard}>
            <Ionicons name="time-outline" size={28} color="#7C3AED" />
            <Text style={styles.statValue}>0h</Text>
            <Text style={styles.statLabel}>Horas</Text>
          </BlurView>
           
          <BlurView intensity={20} tint="light" style={styles.statCard}>
            <Ionicons name="trophy-outline" size={28} color="#F59E0B" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Certificados</Text>
          </BlurView>
        </View>

        {/* Configurações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={20} color="#FFF" style={styles.menuIcon} />
            <Text style={styles.menuText}>Preferências da Conta</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={20} color="#FFF" style={styles.menuIcon} />
            <Text style={styles.menuText}>Notificações</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/about')}
          >
            <Ionicons name="information-circle-outline" size={20} color="#FFF" style={styles.menuIcon} />
            <Text style={styles.menuText}>Sobre a Avantia</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Botão de Logout Funcional */}
        <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
        >
            <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 24 },
  navBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  iconButton: { padding: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
  pageTitle: { fontSize: 14, color: '#FFF', fontWeight: 'bold', letterSpacing: 1 },
  
  profileHeader: { alignItems: 'center', marginBottom: 40 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' },
  avatarText: { fontSize: 32, color: '#FFF', fontWeight: 'bold' },
  onlineBadge: { width: 20, height: 20, backgroundColor: '#10B981', borderRadius: 10, position: 'absolute', bottom: 5, right: 5, borderWidth: 3, borderColor: '#240046' },

  userName: { fontSize: 22, color: '#FFF', fontFamily: 'Lexend-Bold', marginBottom: 4, textAlign: 'center' },
  userRole: { fontSize: 14, color: '#00A3FF', fontFamily: 'Lexend-Regular', marginBottom: 4 },
  userEmail: { fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'Lexend-Light' },

  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  statCard: { width: '31%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  statValue: { fontSize: 20, color: '#FFF', fontWeight: 'bold', marginTop: 8 },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 2 },

  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, color: '#FFF', fontWeight: 'bold', marginBottom: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  menuIcon: { marginRight: 16 },
  menuText: { flex: 1, color: '#FFF', fontSize: 16, fontFamily: 'Lexend-Regular' },

  logoutButton: { marginTop: 10, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.5)', alignItems: 'center', marginBottom: 20 },
  logoutText: { color: '#EF4444', fontWeight: 'bold', fontFamily: 'Lexend-Bold' }
});