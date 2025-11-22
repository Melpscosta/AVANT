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

// Importa os contextos e API
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
      // Chamada para a sua rota LOCAL
      const response = await api.post('/api/v1/autenticacao/login', {
        email: email,
        senha: senha
      });

      const dados = response.data;

      // Log para vermos o que a API retornou (ajuda a debugar)
      console.log("Login Resposta:", dados);

      // Salvamos no Contexto Global para usar na Trilha depois
      // Ajuste os campos abaixo conforme o JSON exato que sua API retorna
      loginUser({
        nome: dados.nome || 'Funcionário',
        email: email,
        // O cargo é crucial para a IA. Se a API não retornar 'cargo', usamos um padrão.
        cargo: dados.cargo || dados.funcao || 'Analista de Sistemas'
      });

      // Navega para a seleção de metas
      router.replace('/selection');

    } catch (error: any) {
      console.error("Erro no login:", error);
      Alert.alert(
        'Erro de Acesso',
        'Não foi possível entrar. Verifique suas credenciais ou se o servidor está rodando.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#050011', '#180b26', '#2e1065']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Logo Area */}
          <View style={styles.logoContainer}>
            <View style={styles.glowEffect} />
            <Image 
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.subtitle}>Learning Platform</Text>
          </View>

          {/* Form Area */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>Acesse sua conta</Text>

            {/* Input Email */}
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#A1A1AA" style={styles.inputIcon} />
              <TextInput
                placeholder="Seu e-mail corporativo"
                placeholderTextColor="#52525B"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Input Senha */}
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#A1A1AA" style={styles.inputIcon} />
              <TextInput
                placeholder="Sua senha"
                placeholderTextColor="#52525B"
                style={styles.input}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#A1A1AA"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotPass}>
              <Text style={styles.forgotPassText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            {/* Botão Entrar */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={loading}
            >
              <LinearGradient
                colors={['#7C3AED', '#6D28D9']}
                style={styles.gradientBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.loginBtnText}>ENTRAR</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Não tem acesso?</Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Fale com o RH</Text>
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

  logoContainer: { alignItems: 'center', marginBottom: 50, marginTop: 40 },
  logo: { width: 220, height: 60, tintColor: '#FFF' },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: 'Lexend-Regular', letterSpacing: 4, marginTop: 8, textTransform: 'uppercase' },
  glowEffect: { position: 'absolute', width: 150, height: 150, backgroundColor: '#7C3AED', borderRadius: 75, opacity: 0.15, filter: 'blur(40px)', top: -20 },

  formContainer: { width: '100%' },
  label: { color: '#FFF', fontSize: 20, fontFamily: 'Lexend-Bold', marginBottom: 24, textAlign: 'center' },

  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 16, paddingHorizontal: 16, height: 56
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#FFF', fontFamily: 'Lexend-Regular', fontSize: 16, height: '100%' },

  forgotPass: { alignSelf: 'flex-end', marginBottom: 32 },
  forgotPassText: { color: '#A1A1AA', fontSize: 14, fontFamily: 'Lexend-Regular' },

  loginButton: {
    width: '100%', height: 56, borderRadius: 14, overflow: 'hidden',
    shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5
  },
  gradientBtn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loginBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Lexend-Bold', letterSpacing: 1 },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 40, gap: 6 },
  footerText: { color: '#71717A', fontFamily: 'Lexend-Regular' },
  footerLink: { color: '#A855F7', fontFamily: 'Lexend-Bold' }
});