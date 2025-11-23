# AVANT - Plataforma Corporativa de Qualificação Tecnológica

<div align="center">
  <img src="assets/logos/avant_logo.png" alt="AVANT Logo" width="200"/>

  <h3>Plataforma moderna de qualificação tecnológica e automação interna para empresas</h3>

  [![Expo Version](https://img.shields.io/badge/Expo-54.0.25-blue)](https://expo.dev)
  [![React Native](https://img.shields.io/badge/React_Native-0.81.5-green)](https://reactnative.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)](https://www.typescriptlang.org)
</div>

---

## 🎯 Sobre o Projeto

**AVANT** é uma plataforma corporativa inovadora desenvolvida para qualificação tecnológica e automação interna de funcionários. Empresas privadas podem contratar nossos serviços para capacitar suas equipes com conteúdo educacional personalizado e gamificado.

### Nossa Proposta

- 🏢 **Foco Corporativo**: Solução completa para qualificação de equipes empresariais
- 📈 **Acompanhamento em Tempo Real**: Gerentes podem monitorar a evolução de seus funcionários
- 🏆 **Sistema de Competições**: Gamificação com prêmios e reconhecimento para motivar times
- 🎯 **Trilhas Personalizadas**: Conteúdo adaptado às necessidades específicas de cada função
- 📱 **Experiência Mobile**: Interface moderna e responsiva para acesso em qualquer dispositivo

---

## 🎥 Demonstração

Assista ao nosso vídeo de demonstração para conhecer todas as funcionalidades:

[![Assista à Demonstração](https://img.youtube.com/vi/_OKKwFN-1bs/0.jpg)](https://youtu.be/_OKKwFN-1bs)

---

## 👥 Equipe de Desenvolvimento

Este projeto foi desenvolvido por:

- **Melissa Perreira** - Frontend & Design
- **Lu Vieira** - Backend & Arquitetura
- **Diego Furigo** - Mobile & DevOps

---

## 🏗️ Arquitetura da Solução

### Tecnologias Utilizadas

#### Frontend Mobile
- **React Native 0.81.5** - Framework principal de desenvolvimento
- **Expo SDK 54** - Plataforma de desenvolvimento e deploy
- **TypeScript 5.9.2** - Tipagem e desenvolvimento seguro
- **Expo Router** - Sistema de navegação baseado em arquivos
- **React Navigation** - Navegação avançada entre telas

#### Estilização & UI/UX
- **Expo Linear Gradient** - Gradientes modernos
- **Expo Blur** - Efeitos de desfoque e glassmorfismo
- **Expo Vector Icons** - Ícones vetoriais de alta qualidade
- **React Native Reanimated** - Animações fluidas e performáticas
- **React Native Gesture Handler** - Controle avançado de gestos

#### Estado & Dados
- **React Context API** - Gerenciamento de estado global
- **Axios** - Cliente HTTP para integração com APIs
- **Async Storage** - Armazenamento local persistente
- **JWT Decode** - Manipulação de tokens de autenticação

---

## 📱 Funcionalidades Principais

### 👤 Para Funcionários

- **Login Corporativo**: Autenticação segura com credenciais empresariais
- **Seleção de Trilhas**: Escolha de percursos de aprendizado personalizados
- **Aulas Interativas**: Conteúdo multimídia e engajador
- **Progresso Individual**: Acompanhamento detalhado da evolução
- **Perfil Personalizado**: Informações e conquistas individuais

### 👨‍💼 Para Gerentes

- **Dashboard Completo**: Visão geral do desempenho da equipe
- **Gestão de Equipes**: Criação e administração de times
- **Cadastro de Funcionários**: Onboarding rápido de novos membros
- **Definição de Metas**: Estabelecimento de objetivos personalizados
- **Análise de Desempenho**: Relatórios e métricas detalhadas
- **Sistema de Certificações**: Bronze, Prata e Ouro conforme progresso

---

## 🚀 Instalação e Configuração

### Pré-requisitos Obrigatórios

- **Node.js 18+** - [Download aqui](https://nodejs.org)
- **Git** - [Download aqui](https://git-scm.com)
- **Editor de código** - VS Code [recomendado](https://code.visualstudio.com/)

### Ambiente de Desenvolvimento

#### Opção 1: Expo Go (Recomendado para início rápido)
1. Instale o **Expo Go** no seu dispositivo:
   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS](https://apps.apple.com/app/expo-go/id982107779)

#### Opção 2: Emuladores (Para desenvolvimento avançado)
- **Android Studio** - [Download aqui](https://developer.android.com/studio)
- **Xcode** (macOS apenas) - [Download aqui](https://developer.apple.com/xcode/)

### Passo a Passo Detalhado

#### 1. Clonar o Projeto
```bash
# Clone o repositório
git clone <URL-DO-REPOSITORIO>

# Navegue até a pasta do projeto
cd "Entregas GS 2025/mobile/AVANT"
```

#### 2. Instalar Dependências
```bash
# Instale todas as dependências do projeto
npm install

# Verifique se não há erros
npm ls
```

#### 3. Iniciar o Servidor de Desenvolvimento
```bash
# Inicie o servidor Expo
npm start
```

**O que acontece depois:**
- O terminal exibirá um QR code
- Abra o Expo Go no seu celular e escaneie o QR code
- Ou use as opções abaixo para emuladores

#### 4. Executar em Diferentes Plataformas

```bash
# Android (requer Android Studio configurado)
npm run android

# iOS (requer Xcode, apenas macOS)
npm run ios

# Web (navegador padrão)
npm run web
```

### 📱 Acesso Rápido (Modo Demo)

#### Credenciais para Teste
- **Email Gerente**: `gerente@avant.com`
- **Senha Gerente**: `123456`

#### Acessando o App
1. Após escanear o QR code, aguarde o carregamento
2. Use as credenciais acima para login como gerente
3. Explore as funcionalidades disponíveis

### 🔧 Solução de Problemas Comuns

#### Problema: "Metro bundler não inicia"
```bash
# Limpe o cache e reinicie
npx expo start -c
```

#### Problema: "Dependências não encontradas"
```bash
# Reinstale as dependências
rm -rf node_modules
npm install
npm start
```

#### Problema: "Erro no Android"
```bash
# Verifique se o ADB está funcionando
adb devices

# Limpe o projeto Android
cd android
./gradlew clean
cd ..
npm run android
```

#### Problema: "Erro no iOS (macOS)"
```bash
# Limpe o cache do CocoaPods
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### 🌐 Acessando o App pelo Navegador

1. Inicie com `npm start`
2. No terminal, procure a linha `Web` ou pressione `w`
3. Acesse: `http://localhost:19006`

### 📱 App no Dispositivo Físico (Android)

#### Pré-requisitos
- Cabo USB
- Depuração USB ativada no celular

#### Passos
1. Conecte o celular ao computador
2. Ative "Depuração USB" nas opções do desenvolvedor
3. Execute:
   ```bash
   npm run android
   ```
4. Selecione seu dispositivo na lista

### 🛠️ Configuração do VS Code (Opcional)

#### Extensões Recomendadas
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-json",
    "expo.vscode-expo-tools"
  ]
}
```

#### Configurações do Workspace
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### 🔄 Fluxo de Trabalho Recomendado

#### Para Desenvolvimento
```bash
# 1. Iniciar servidor
npm start

# 2. Abrir no emulador/dispositivo
# Use as teclas de atalho no terminal:
# a → Android
# i → iOS
# w → Web

# 3. Modo desenvolvimento
npm start -- --clear
```

#### Para Build de Produção
```bash
# Verificar tipo de build
npx expo install --fix

# Gerar build
expo build:android
# ou
expo build:ios
```

---

## 🔧 Estrutura do Projeto

```
AVANT/
├── app/                    # Telas principais da aplicação
│   ├── index.tsx          # Tela de login
│   ├── manager.tsx        # Dashboard do gerente
│   ├── trilha.tsx         # Trilhas de aprendizado
│   ├── aula.tsx           # Tela de aulas
│   ├── profile.tsx        # Perfil do usuário
│   └── _layout.tsx        # Layout principal
├── src/
│   ├── context/           # Contextos React (estado global)
│   │   ├── UserContext.tsx
│   │   └── TrilhaContext.tsx
│   ├── services/          # Serviços e APIs
│   │   ├── api.ts         # Configuração Axios
│   │   └── storage.ts     # Armazenamento local
│   └── utils/             # Utilitários diversos
├── assets/                # Recursos estáticos
│   ├── logos/            # Logotipos e imagens
│   └── images/           # Imens da aplicação
└── scripts/              # Scripts de automação
```

---

## 🔐 Acesso Demonstraçã

Para testes e demonstrações, utilize as credenciais padrão:

- **Gerente**: `gerente@avant.com` / `123456`
- **Funcionários**: Disponíveis no dashboard do gerente

---

## 🌐 Integrações

### Backend/API

O aplicativo se integra com o backend hospedado em:
- **API Principal**: `https://globalsolution-66v2.onrender.com`
- **Autenticação**: Baseada em JWT
- **Endpoints**: Usuários, Cursos, Trilhas, Progresso

### Firebase (Futuro)

Planejamos integrar com Firebase para:
- 🔔 Notificações push
- 📊 Analytics e métricas
- ☁️ Sincronização em tempo real

---

## 📋 Scripts Disponíveis

```bash
npm start          # Inicia o servidor Expo
npm run android    # Executa no Android
npm run ios        # Executa no iOS
npm run web        # Executa no navegador
npm run lint       # Verifica qualidade do código
npm reset-project  # Reseta o projeto para estado inicial
```

---

## 🎨 Design System

### Identidade Visual

- **Cores Primárias**: Gradiente roxo (#060013 → #3B0B65)
- **Glassmorfismo**: Efeitos de desfoque e transparência
- **Tipografia**: Lexend (Light, Regular, SemiBold)
- **Ícones**: Ionicons adaptados ao design

### Componentes Reutilizáveis

- Cards com gradientes e blur
- Botões interativos com feedback tátil
- Modais e formulários modernos
- Indicadores de progresso animados

---

## 🔮 Roadmap Futuro

### Versão 2.0 (Planejado)

- [ ] Sistema de notificações push
- [ ] Chat interno entre equipes
- [ ] Integração com sistemas RH
- [ ] Relatórios avançados e exportação
- [ ] Gamificação com rankings e badges
- [ ] Conteúdo gerado por IA
- [ ] Vídeos ao vivo e webinars

### Versão 3.0 (Visão)

- [ ] Aplicativo desktop (Windows/Mac)
- [ ] API pública para integrações
- [ ] Sistema de certificados digitais
- [ ] Analytics comportamental
- [ ] Inteligência artificial para recomendações

---

## 📞 Contato e Suporte

Para dúvidas, sugestões ou suporte técnico:

- **Email**: `contato@avant.com`
- **Website**: `www.avant.com.br`
- **Documentação**: Em desenvolvimento

---

## 📄 Licença

Este projeto é proprietário e confidencial. Todos os direitos reservados à AVANT Platform © 2024.

---

## 🙏 Agradecimentos

Agradecemos a todos que contribuíram para este projeto, especialmente às empresas parceiras que acreditaram em nossa visão de transformar a qualificação corporativa através da tecnologia.

<div align="center">
  <sub>Criado com ❤️ pela equipe AVANT</sub>
</div>