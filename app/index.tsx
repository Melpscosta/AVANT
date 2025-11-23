import React, { useState, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
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
import { useUser } from '../src/context/UserContext';

import storage from '../src/services/storage';

// ======================================================
//                 MOCK LOGIN – OFFLINE
// ======================================================
function mockLogin(email: string, senha: string) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const managers = storage.getJSON("mock_users") || [];
      const workers = storage.getJSON("mock_workers") || [];

      // unir tudo
      const users = [...managers, ...workers];

      const found = users.find(
        (u: any) => u.email === email && u.senha === senha
      );

      if (!found) {
        reject({ code: 401, message: "Credenciais inválidas" });
        return;
      }

      const token = crypto.randomUUID();

      storage.setJSON("mock_session", {
        token,
        id: found.id,
        nome: found.nome,
        email: found.email,
        tipo: found.tipo || "funcionario", // padrão para workers
        cargo: found.planoCarreira || "Funcionário"
      });

      resolve({
        token,
        nome: found.nome,
        email: found.email,
        perfil: found.tipo === "gerente" ? "Gerente" : "Funcionário",
        id: found.id
      });
    }, 600);
  });
}


// ======================================================
//        INICIAR USUÁRIOS PADRÃO (somente gerente)
// ======================================================
(function initDefaultMockUsers() {
  const stored = storage.getJSON("mock_users") || [];

  const defaults = [
    {
      id: "ger1",
      nome: "Gerente Teste",
      email: "gerente@avant.com",
      senha: "123456",
      tipo: "gerente"
    }
  ];

  defaults.forEach((user) => {
    if (!stored.find((u: any) => u.email === user.email)) {
      stored.push(user);
    }
  });

  storage.setJSON("mock_users", stored);
})();


// ======================================================
//                TELA DE LOGIN
// ======================================================
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { loginUser } = useUser();

  // ---------------- TOAST ----------------
  const toastY = useRef(new Animated.Value(-80)).current;
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    Animated.timing(toastY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      setTimeout(() => {
        Animated.timing(toastY, {
          toValue: -80,
          duration: 300,
          useNativeDriver: true
        }).start();
      }, 1800);
    });
  };
  // -----------------------------------------


  const handleLogin = async () => {
    if (!email || !senha) {
      showToast('Preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      const dados: any = await mockLogin(email, senha);

      loginUser({
        nome: dados.nome,
        email: dados.email,
        cargo: dados.perfil,
        token: dados.token,
        id: dados.id
      });

      showToast('Login realizado!');

      setTimeout(() => {
        if (dados.perfil === 'Gerente') {
          router.replace('/manager');
        } else {
          router.replace('/selection');
        }
      }, 1500);

    } catch (err: any) {
      showToast("E-mail ou senha incorretos.");
    }

    setLoading(false);
  };


  return (
    <LinearGradient
      colors={['#060013', '#120424', '#3B0B65']}
      style={styles.container}
    >
      {/* TOAST */}
      <Animated.View style={[styles.toast, { transform: [{ translateY: toastY }] }]}>
        <Text style={styles.toastText}>{toastMsg}</Text>
      </Animated.View>

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

          {/* TEXTO */}
          <Text style={styles.accessText}>
            DIGITE SEU E-MAIL CORPORATIVO E SENHA{'\n'}
            PARA PREPARARMOS SUA JORNADA.
          </Text>

          {/* INPUTS */}
          <View style={styles.formArea}>
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
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color="#C9C9DA"
                />
              </TouchableOpacity>
            </BlurView>
          </View>

          {/* BOTÃO */}
          <TouchableOpacity style={styles.circleBtn} onPress={handleLogin}>
            <LinearGradient colors={['#ffffff90', '#ffffffcc']} style={styles.circleInner}>
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Ionicons name="arrow-forward" size={20} color="#000" />
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* RODAPÉ */}
          <View style={styles.bottomRow}>
            <TouchableOpacity onPress={() => router.push('/about')}>
              <Text style={styles.advanceText}>AVANCE</Text>
              <Text style={styles.advanceText}>CONOSCO</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/register')} style={{ alignItems: 'flex-end' }}>
              <Text style={styles.managerLabel}>GESTOR NOVO?</Text>
              <Text style={styles.managerLink}>CRIAR CONTA</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}


// ======================================================
//                     STYLES
// ======================================================
const styles = StyleSheet.create({
  container: { flex: 1 },

  toast: {
    position: 'absolute',
    top: 40,
    backgroundColor: '#7c3aed',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    zIndex: 9999
  },
  toastText: {
    color: '#fff',
    fontFamily: 'Lexend-Regular',
    fontSize: 13,
    textTransform: 'uppercase'
  },

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
    fontFamily: 'Lexend-Light',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase'
  }
});
