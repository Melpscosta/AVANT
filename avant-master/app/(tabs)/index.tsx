import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
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

// Contexto e API
import { useUser } from '../../src/context/UserContext';
import api from '../../src/services/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { loginUser } = useUser();

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/v1/autenticacao/login', {
        email: email,
        senha: senha
      });

      const dados = response.data;

      loginUser({
        nome: dados.nome || 'Funcionário',
        email: email,
        cargo: dados.cargo || dados.funcao || 'Analista de Sistemas'
      });

      router.replace('/selection');

    } catch {
      Alert.alert(
        'Erro de Acesso',
        'Credenciais inválidas ou servidor offline.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0A0017', '#120425', '#3B0B65']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>

          {/* LOGO */}
          <View style={styles.logoArea}>
            <Image
              source={require('../../assets/logos/avant_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* TEXTO DO Figma */}
          <Text style={styles.accessText}>
            Digite seu e-mail corporativo e senha{'\n'}
            para prepararmos sua jornada.
          </Text>

          {/* INPUTS */}
          <View style={{ width: '100%', marginTop: 40 }}>

            {/* EMAIL */}
            <BlurView intensity={50} tint="dark" style={styles.glassInput}>
              <Ionicons name="mail-outline" size={20} color="#ADADBC" />
              <TextInput
                placeholder="E-mail corporativo"
                placeholderTextColor="rgba(255,255,255,0.45)"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </BlurView>

            {/* SENHA */}
            <BlurView intensity={50} tint="dark" style={styles.glassInput}>
              <Ionicons name="lock-closed-outline" size={20} color="#ADADBC" />
              <TextInput
                placeholder="Senha"
                placeholderTextColor="rgba(255,255,255,0.45)"
                style={styles.input}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#ADADBC"
                />
              </TouchableOpacity>
            </BlurView>

          </View>

          {/* BOTÃO SETA */}
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={handleLogin}
            disabled={loading}
          >
            <LinearGradient
              colors={['#ffffffaa', '#ffffffdd']}
              style={styles.arrowButtonGradient}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Ionicons name="arrow-forward" size={22} color="#000" />
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* AVANCE CONOSCO */}
          <TouchableOpacity
            style={{ marginTop: 50, alignSelf: 'center' }}
            onPress={() => router.push('/about')}
          >
            <Text style={styles.advanceText}>AVANCE</Text>
            <Text style={styles.advanceText}>CONOSCO</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    padding: 20,
    paddingTop: 100,
    paddingBottom: 100,
    alignItems: 'center',
  },

  logoArea: { marginBottom: 60 },
  logo: { width: 170, height: 60 },

  accessText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Lexend-Light',
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.95
  },

  glassInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
    height: 55,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },

  input: {
    flex: 1,
    marginLeft: 12,
    color: '#FFF',
    fontFamily: 'Lexend-Light',
    fontSize: 16,
  },

  arrowButton: {
    marginTop: 10,
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
  },
  arrowButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  advanceText: {
    color: '#FFF',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Lexend-Light',
    letterSpacing: 2,
  },
});
