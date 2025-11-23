import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState, useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import storage from '../src/services/storage';


// ======================================================
//              MOCK: REGISTRAR GERENTE
// ======================================================
function mockRegistrarGerente(nome: string, email: string, senha: string) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = storage.getJSON("mock_users") || [];

            const exists = users.find((u: any) => u.email === email);
            if (exists) {
                reject({ code: 409, message: "E-mail já cadastrado." });
                return;
            }

            const novo = {
                id: crypto.randomUUID(),
                nome,
                email,
                senha,
                tipo: "gerente"
            };

            users.push(novo);
            storage.setJSON("mock_users", users);

            resolve(novo);
        }, 600);
    });
}

// ======================================================
//               COMPONENTE DA TELA
// ======================================================
export default function CadastroGestorScreen() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    // ---------------- TOAST ----------------
    const toastY = useRef(new Animated.Value(-80)).current;
    const [toastMsg, setToastMsg] = useState('');

    const showToast = (msg: string) => {
        setToastMsg(msg);

        Animated.timing(toastY, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true
        }).start(() => {
            setTimeout(() => {
                Animated.timing(toastY, {
                    toValue: -80,
                    duration: 400,
                    useNativeDriver: true
                }).start();
            }, 2000);
        });
    };
    // ---------------------------------------------------

    const handleRegister = async () => {
        if (!nome || !email || !senha) {
            showToast("Preencha todos os campos.");
            return;
        }

        setLoading(true);

        try {
            await mockRegistrarGerente(nome, email, senha);

            showToast("Cadastro efetuado com sucesso!");

            setTimeout(() => {
                router.push('/');
            }, 1800);

        } catch (err: any) {
            let msg = "Falha no cadastro.";

            if (err.code === 409) msg = "Este e-mail já está cadastrado.";
            if (err.code === 400) msg = "Dados inválidos.";

            showToast(msg);
        }

        setLoading(false);
    };

    return (
        <LinearGradient
            colors={['#050011', '#180b26', '#2e1065']}
            style={styles.container}
        >
            {/* TOAST */}
            <Animated.View style={[styles.toast, { transform: [{ translateY: toastY }] }]}>
                <Text style={styles.toastText}>{toastMsg}</Text>
            </Animated.View>

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


// ======================================================
//                     ESTILOS
// ======================================================
const styles = StyleSheet.create({

    container: { flex: 1 },

    toast: {
        position: 'absolute',
        top: 40,
        alignSelf: 'center',
        backgroundColor: '#22c55e',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
        zIndex: 9999,
        elevation: 6
    },
    toastText: {
        color: '#fff',
        fontFamily: 'Lexend-Regular',
        fontSize: 14,
        textAlign: 'center'
    },

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
        fontFamily: 'LexendZetta-Regular',
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
