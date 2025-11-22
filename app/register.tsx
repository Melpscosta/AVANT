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

const AUTH_API_URL =
    Platform.OS === 'android' ? 'http://localhost:5008/' : 'http://localhost:5008/';

export default function CadastroGestorScreen() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

   const handleRegister = async () => {
        if (!nome || !email || !senha)
            return Alert.alert('Erro', 'Preencha todos os campos.');

        setLoading(true);
        try {
            await api.post(
                '/api/v1/Autenticacao/registrar-gerente',
                { nome, email, senha },
                { baseURL: AUTH_API_URL }
            );

            Alert.alert('Sucesso', 'Gestor cadastrado!', [
                { text: 'OK', onPress: () => router.replace('/') }
            ]);
        } catch (error: any) {
            console.error("Detalhes do erro no cadastro:", error);
            
            let errorMessage = 'Falha no cadastro. Tente novamente.';

            if (error.response) {
                const status = error.response.status;

                if (status === 400) {
                    // 400 Bad Request (Pode ser validação de email/senha ou duplicidade não tratada)
                    // Se o backend retornar detalhes no body do 400, você pode usá-los (error.response.data)
                    errorMessage = 'Dados inválidos. Verifique se o e-mail já está em uso ou se a senha atende aos requisitos.';
                } else if (status === 500) {
                    // 500 Internal Server Error (Problema no banco de dados/lógica)
                    errorMessage = 'Erro interno do servidor. Não foi possível completar o cadastro. Por favor, avise o suporte.';
                } else if (status === 409) {
                    // Se o backend for corrigido para retornar 409 (Conflict) em caso de duplicidade
                    errorMessage = 'Este e-mail já está cadastrado no sistema.';
                }
            } else if (error.request) {
                // A requisição foi feita, mas não houve resposta (servidor inacessível)
                errorMessage = 'Não foi possível conectar ao servidor. Verifique sua rede.';
            }

            Alert.alert('Erro de Cadastro', errorMessage);
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
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >

                    {/* VOLTAR */}
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={26} color="#FFF" />
                    </TouchableOpacity>

                    {/* CABEÇALHO */}
                    <View style={styles.header}>
                        <Text style={styles.title}>NOVO GESTOR</Text>
                        <Text style={styles.subtitle}>
                            Crie sua conta de gestor para administrar sua equipe.
                        </Text>
                    </View>

                    {/* FORM */}
                    <View style={styles.form}>

                        {/* NOME */}
                        <View style={styles.inputWrapper}>
                            <Ionicons name="person-outline" size={20} color="#A1A1AA" style={styles.icon} />
                            <TextInput
                                placeholder="NOME COMPLETO"
                                placeholderTextColor="rgba(255,255,255,0.55)"
                                style={styles.input}
                                value={nome}
                                onChangeText={setNome}
                            />
                        </View>

                        {/* EMAIL */}
                        <View style={styles.inputWrapper}>
                            <Ionicons name="mail-outline" size={20} color="#A1A1AA" style={styles.icon} />
                            <TextInput
                                placeholder="E-MAIL CORPORATIVO"
                                placeholderTextColor="rgba(255,255,255,0.55)"
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        {/* SENHA */}
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color="#A1A1AA" style={styles.icon} />
                            <TextInput
                                placeholder="SENHA"
                                placeholderTextColor="rgba(255,255,255,0.55)"
                                style={styles.input}
                                value={senha}
                                onChangeText={setSenha}
                                secureTextEntry
                            />
                        </View>

                        {/* BOTÃO */}
                        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                            <LinearGradient
                                colors={['#7C3AED', '#6D28D9']}
                                style={styles.gradientBtn}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <Text style={styles.btnText}>CADASTRAR</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    scrollContent: {
        flexGrow: 1,
        padding: 24,
        paddingTop: 120
    },

    backButton: {
        position: 'absolute',
        top: 60,
        left: 24,
        zIndex: 10
    },

    header: {
        marginBottom: 50
    },

    title: {
        fontSize: 26,
        color: '#FFF',
        fontFamily: 'LexendZetta-Regular',  // ← título grande e estiloso
        textTransform: 'uppercase',
        marginBottom: 6,
        letterSpacing: 1
    },

    subtitle: {
        fontSize: 15,
        color: '#A1A1AA',
        fontFamily: 'Lexend-Light',
        marginRight: 10,
        lineHeight: 20
    },

    form: {
        width: '100%',
        marginTop: 10
    },

    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 54,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)'
    },

    icon: { marginRight: 12 },

    input: {
        flex: 1,
        color: '#FFF',
        fontFamily: 'Lexend-Light',
        fontSize: 14,
        textTransform: 'uppercase'
    },

    button: {
        height: 54,
        borderRadius: 14,
        overflow: 'hidden',
        marginTop: 10
    },

    gradientBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    btnText: {
        color: '#FFF',
        fontFamily: 'Lexend-Regular',
        fontSize: 15,
        letterSpacing: 1
    }
});
