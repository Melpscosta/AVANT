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

import api from '../src/services/api';

const AUTH_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5008' : 'http://localhost:5008';

export default function CadastroFuncionarioScreen() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!nome || !email || !senha) return Alert.alert('Erro', 'Preencha todos os campos.');

        setLoading(true);
        try {
          // Supondo que exista uma rota pública para cadastro de funcionário.
          // Se não existir, você pode usar a rota genérica ou ajustar conforme seu backend.
          await api.post('/api/v1/Autenticacao/registrar', {
              nome,
              email,
              senha
        }, { baseURL: AUTH_API_URL });

          Alert.alert('Sucesso', 'Conta criada! Faça login.', [
              { text: 'OK', onPress: () => router.replace('/') }
          ]);
      } catch (error: any) {
          console.error(error);
            Alert.alert('Erro', 'Falha no cadastro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient colors={['#050011', '#180b26', '#2e1065']} style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.title}>Novo Funcionário</Text>
                        <Text style={styles.subtitle}>Crie sua conta para acessar os cursos.</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="person-outline" size={20} color="#A1A1AA" style={styles.icon} />
                            <TextInput
                                placeholder="Nome Completo" placeholderTextColor="#52525B" style={styles.input}
                                value={nome} onChangeText={setNome}
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <Ionicons name="mail-outline" size={20} color="#A1A1AA" style={styles.icon} />
                            <TextInput
                                placeholder="E-mail" placeholderTextColor="#52525B" style={styles.input}
                                value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color="#A1A1AA" style={styles.icon} />
                            <TextInput
                                placeholder="Senha" placeholderTextColor="#52525B" style={styles.input}
                                value={senha} onChangeText={setSenha} secureTextEntry
                            />
                        </View>

                        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                            <LinearGradient colors={['#7C3AED', '#6D28D9']} style={styles.gradientBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>CADASTRAR</Text>}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* --- LINK PARA CADASTRO DE GERENTE --- */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Você é um Gestor?</Text>
                        <TouchableOpacity onPress={() => router.push('/register')}>
                            <Text style={styles.footerLink}>Clique aqui</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { flexGrow: 1, padding: 24, justifyContent: 'center' },
    backButton: { position: 'absolute', top: 60, left: 24, zIndex: 10 },
    header: { marginBottom: 40, marginTop: 60 },
    title: { fontSize: 32, color: '#FFF', fontFamily: 'Lexend-Bold', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#A1A1AA', fontFamily: 'Lexend-Regular' },
    form: { width: '100%' },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, marginBottom: 16, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    icon: { marginRight: 12 },
    input: { flex: 1, color: '#FFF', fontFamily: 'Lexend-Regular' },
    button: { height: 56, borderRadius: 14, overflow: 'hidden', marginTop: 16 },
    gradientBtn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    btnText: { color: '#FFF', fontFamily: 'Lexend-Bold', fontSize: 16 },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30, gap: 6 },
    footerText: { color: '#71717A', fontFamily: 'Lexend-Regular' },
    footerLink: { color: '#4F46E5', fontFamily: 'Lexend-Bold' }
});