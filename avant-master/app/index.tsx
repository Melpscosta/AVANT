import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
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

const AUTH_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5008' : 'http://localhost:5008';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { loginUser } = useUser();

  const handleLogin = async () => {
    if (!email || !senha) return Alert.alert('Atenção', 'Preencha todos os campos.');
    setLoading(true);

    try {
      const response = await api.post('/api/v1/Autenticacao/login',
        { email, senha },
        { baseURL: AUTH_API_URL }
      );

      const dados = response.data;

      loginUser({
        nome: dados.nome,
        email: dados.email,
        cargo: dados.perfil || 'Funcionário',
        token: dados.token
      });

      // Lógica de Redirecionamento Inteligente
      if (dados.perfil === 'Gerente') {
        router.replace('/manager');
      } else {
        router.replace('/selection');
      }

    } catch (error: any) {
      console.error("Erro no login:", error);
      Alert.alert('Falha', error.response?.status === 401 ? 'Credenciais inválidas.' : 'Erro no servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#050011', '#180b26', '#2e1065']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <View style={styles.logoContainer}>
            <View style={styles.glowEffect} />
            <Image source={require('../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
            <Text style={styles.subtitle}>Learning Platform</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Acesse sua conta</Text>

            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#A1A1AA" style={styles.inputIcon} />
              <TextInput 
                placeholder="E-mail" placeholderTextColor="#52525B" style={styles.input}
                value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#A1A1AA" style={styles.inputIcon} />
              <TextInput
                placeholder="Senha" placeholderTextColor="#52525B" style={styles.input}
                value={senha} onChangeText={setSenha} secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#A1A1AA" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
              <LinearGradient colors={['#7C3AED', '#6D28D9']} style={styles.gradientBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.loginBtnText}>ENTRAR</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* --- RODAPÉ COM AS DUAS OPÇÕES --- */}
          <View style={styles.footerContainer}>
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Gestor novo?</Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.footerLink}>Crie sua conta</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Já possui conta como gestor?</Text>
              <TouchableOpacity onPress={() => router.push('/gestor-login')}>
                <Text style={[styles.footerLink, { color: '#4F46E5' }]}>Acessar</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 40, marginTop: 40 },
  logo: { width: 200, height: 50, tintColor: '#FFF' },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'Lexend-Regular', letterSpacing: 4, marginTop: 8, textTransform: 'uppercase' },
  glowEffect: { position: 'absolute', width: 150, height: 150, backgroundColor: '#7C3AED', borderRadius: 75, opacity: 0.15, top: -20 },
  formContainer: { width: '100%' },
  label: { color: '#FFF', fontSize: 20, fontFamily: 'Lexend-Bold', marginBottom: 24, textAlign: 'center' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 16, paddingHorizontal: 16, height: 56 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#FFF', fontFamily: 'Lexend-Regular', fontSize: 16, height: '100%' },
  loginButton: { width: '100%', height: 56, borderRadius: 14, overflow: 'hidden', marginTop: 10 },
  gradientBtn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loginBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Lexend-Bold', letterSpacing: 1 },

  // Novos Estilos do Footer
  footerContainer: { marginTop: 40, alignItems: 'center', gap: 12 },
  footerRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  footerText: { color: '#71717A', fontFamily: 'Lexend-Regular' },
  footerLink: { color: '#A855F7', fontFamily: 'Lexend-Bold' },
  divider: { width: 50, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' }
});