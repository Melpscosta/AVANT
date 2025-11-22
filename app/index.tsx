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

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';

import { useUser } from '../src/context/UserContext';
import api from '../src/services/api';

const AUTH_API_URL =
  Platform.OS === 'android' ? 'http://localhost:5008/' : 'http://localhost:5008/';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { loginUser } = useUser();

const handleLogin = async () => {
    if (!email || !senha)
      return Alert.alert('Atenção', 'Preencha todos os campos.');

    setLoading(true);

    try {
      const response = await api.post(
        '/api/v1/Autenticacao/login',
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

      if (dados.perfil === 'Gerente') {
        router.replace('/manager');
      } else {
        router.replace('/selection');
      }
    } catch (error: any) {
      // --- INÍCIO DO TRATAMENTO DE ERROS MELHORADO ---
      let errorMessage = 'Ocorreu um erro desconhecido.';
      
      if (error.response) {
        // O servidor respondeu com um código de status fora do range 2xx
        const status = error.response.status;

        if (status === 401 || status === 400) {
          // 401 Unauthorized (Não Autorizado) ou 400 Bad Request
          errorMessage = 'E-mail ou senha incorretos. Tente novamente.';
        } else if (status === 500) {
          // 500 Internal Server Error
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
        } else {
          // Outros erros de status, como 403, 404, etc.
          errorMessage = `Erro na requisição (Status ${status}).`;
        }
      } else if (error.request) {
        // A requisição foi feita, mas não houve resposta (ex: servidor offline)
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão ou tente mais tarde.';
      }
      
      console.error("Detalhes do erro:", error);
      Alert.alert('Falha no Login', errorMessage);
      // --- FIM DO TRATAMENTO DE ERROS MELHORADO ---
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#060013', '#120424', '#3B0B65']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* LOGO */}
          <View style={styles.logoBox}>
            <Image
              source={require('../assets/logos/avant_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* TEXTO SUPERIOR */}
          <Text style={styles.accessText}>
            DIGITE SEU E-MAIL CORPORATIVO E SENHA{'\n'}
            PARA PREPARARMOS SUA JORNADA.
          </Text>

          {/* INPUTS */}
          <View style={styles.formArea}>
            {/* EMAIL */}
            <BlurView intensity={45} tint="dark" style={styles.inputGlass}>
              <Ionicons name="mail-outline" size={18} color="#C9C9DA" />
              <TextInput
                placeholder="E-MAIL"
                placeholderTextColor="rgba(255,255,255,0.55)"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </BlurView>

            {/* SENHA */}
            <BlurView intensity={45} tint="dark" style={styles.inputGlass}>
              <Ionicons name="lock-closed-outline" size={18} color="#C9C9DA" />
              <TextInput
                placeholder="SENHA"
                placeholderTextColor="rgba(255,255,255,0.55)"
                style={styles.input}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ paddingLeft: 6 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color="#C9C9DA"
                />
              </TouchableOpacity>
            </BlurView>
          </View>

          {/* BOTÃO SETA */}
          <TouchableOpacity style={styles.circleBtn} onPress={handleLogin}>
            <LinearGradient
              colors={['#ffffff90', '#ffffffcc']}
              style={styles.circleInner}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Ionicons name="arrow-forward" size={20} color="#000" />
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* LINHA FINAL - AVANCE / CRIAR CONTA */}
          <View style={styles.bottomRow}>
            {/* ESQUERDA */}
            <TouchableOpacity onPress={() => router.push('/about')}>
              <Text style={styles.advanceText}>AVANCE</Text>
              <Text style={styles.advanceText}>CONOSCO</Text>
            </TouchableOpacity>

            {/* DIREITA */}
            <TouchableOpacity
              onPress={() => router.push('/register')}
              style={{ alignItems: 'flex-end' }}
            >
              <Text style={styles.managerLabel}>GESTOR NOVO?</Text>
              <Text style={styles.managerLink}>CRIAR CONTA</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  scroll: {
    alignItems: 'center',
    paddingTop: 110,
    paddingBottom: 120
  },

  logoBox: { marginBottom: 60, alignItems: 'center' },
  logo: { width: 180, height: 60 },

  accessText: {
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Lexend-Light',
    fontSize: 15,
    marginBottom: 40,
    lineHeight: 22,
    letterSpacing: 1.2
  },

  formArea: { width: '88%' },

  inputGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)'
  },

  input: {
    flex: 1,
    marginLeft: 10,
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Lexend-Light',
    textTransform: 'uppercase'
  },

  circleBtn: {
    marginTop: 10,
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: 'hidden'
  },

  circleInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '88%',
    marginTop: 60,
    alignItems: 'center'
  },

  advanceText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Lexend-Light',
    letterSpacing: 2,
    lineHeight: 14,
    textTransform: 'uppercase'
  },

  managerLabel: {
    color: '#D1D1D8',
    fontFamily: 'Lexend-Light',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },

  managerLink: {
    color: '#A855F7',
    fontFamily: 'Lexend-light',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase'
  }
});
