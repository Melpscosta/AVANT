import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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

export default function GestorLoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { loginUser } = useUser();

  const handleLogin = async () => {
    if (!email || !senha) return Alert.alert('Atenção', 'Preencha todos os campos.');
    
    setLoading(true);

    try {
      console.log(`[Gestor] Autenticando em: ${AUTH_API_URL}/api/v1/autenticacao/login`);
      
      const response = await api.post('/api/v1/autenticacao/login', 
        { email, senha }, 
        { baseURL: AUTH_API_URL }
      );

      const dados = response.data;
      console.log("Login realizado. Perfil:", dados.perfil);

      // SEGURANÇA: Verifica se é realmente um Gerente
      if (dados.perfil !== 'Gerente') {
        Alert.alert('Acesso Negado', 'Esta área é restrita para gestores.');
        setLoading(false);
        return;
      }

      // Salva o Token e os dados no Contexto Global
      loginUser({
        nome: dados.nome,
        email: dados.email,
        cargo: dados.perfil,
        token: dados.token // <--- O token JWT vem aqui
      });

      // Vai para o Painel Manager
      router.replace('/manager');

    } catch (error: any) {
      console.error("Erro Login Gestor:", error);
      const status = error.response?.status;
      if (status === 401) Alert.alert('Falha', 'Credenciais inválidas.');
      else Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0f172a', '#1e1b4b', '#312e81']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>

          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.iconBg}>
              <Ionicons name="briefcase" size={32} color="#6366F1" />
            </View>
            <Text style={styles.title}>Área do Gestor</Text>
            <Text style={styles.subtitle}>Administre sua equipe e colaboradores</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.label}>E-mail Corporativo</Text>
            <View style={styles.inputRow}>
              <Ionicons name="person" size={20} color="#64748B" style={{marginRight: 10}} />
              <TextInput 
                style={styles.input} 
                placeholder="seu.email@empresa.com" 
                placeholderTextColor="#64748B"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed" size={20} color="#64748B" style={{marginRight: 10}} />
              <TextInput 
                style={styles.input} 
                placeholder="••••••" 
                placeholderTextColor="#64748B"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
               {loading ? <ActivityIndicator color="#FFF"/> : <Text style={styles.btnText}>ACESSAR PAINEL</Text>}
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  backBtn: { position: 'absolute', top: 60, left: 24, padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
  header: { alignItems: 'center', marginBottom: 40 },
  iconBg: { width: 70, height: 70, backgroundColor: 'rgba(99, 102, 241, 0.2)', borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 26, fontFamily: 'Lexend-Bold', color: '#FFF' },
  subtitle: { fontSize: 14, fontFamily: 'Lexend-Regular', color: '#94A3B8', marginTop: 8 },
  formCard: { backgroundColor: '#1E293B', padding: 24, borderRadius: 24, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  label: { color: '#E2E8F0', fontSize: 14, fontFamily: 'Lexend-Bold', marginBottom: 8, marginTop: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F172A', borderRadius: 12, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: '#334155' },
  input: { flex: 1, color: '#FFF', fontFamily: 'Lexend-Regular', fontSize: 16, height: '100%' },
  loginBtn: { backgroundColor: '#4F46E5', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 32 },
  btnText: { color: '#FFF', fontFamily: 'Lexend-Bold', fontSize: 16, letterSpacing: 1 }
});