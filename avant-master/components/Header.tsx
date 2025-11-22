import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../src/context/UserContext'; // Importe seu contexto

export function Header() {
  const { logoutUser } = useUser();

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          logoutUser(); // Limpa o token do contexto/storage
          router.replace('/'); // Manda de volta pro Login
        }
      }
    ]);
  };

  const handleProfile = () => {
    // Redireciona para a tela de perfil (crie essa rota depois se não tiver)
    router.push('/profile'); 
  };

  return (
    <View style={styles.container}>
      {/* LADO ESQUERDO: LOGO */}
      <Text style={styles.logoText}>AVANT</Text>

      {/* LADO DIREITO: BOTÕES */}
      <View style={styles.actionsContainer}>
        
        {/* Botão Perfil */}
        <TouchableOpacity onPress={handleProfile} style={styles.iconBtn}>
          <Ionicons name="person-circle-outline" size={28} color="#FFF" />
        </TouchableOpacity>

        {/* Botão Logout */}
        <TouchableOpacity onPress={handleLogout} style={styles.iconBtn}>
          <Ionicons name="log-out-outline" size={26} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#050011', // Cor de fundo escura do seu app
    paddingHorizontal: 20,
    paddingBottom: 15,
    // Ajuste para a barra de status (Notch)
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  logoText: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Lexend-Bold', // Sua fonte
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15, // Espaço entre o perfil e o logout
  },
  iconBtn: {
    padding: 4,
  }
});