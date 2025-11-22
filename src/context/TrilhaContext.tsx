import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';
import { useUser } from './UserContext';

export interface Modulo {
  id: string;
  titulo: string;
  descricao: string;
  bloqueado: boolean;
  concluido: boolean;
  align: 'flex-start' | 'flex-end' | 'center';
  marginTop: number;
  marginLeft?: number;
  marginRight?: number;
}

interface TrilhaContextData {
  modulos: Modulo[];
  concluirModulo: (id: string) => Promise<void>;
  carregarTrilha: (meta: string) => void;
  isLoading: boolean;
}

const TrilhaContext = createContext<TrilhaContextData>({} as TrilhaContextData);

const POSICOES_VISUAIS = [
  { align: 'flex-start', marginTop: 0, marginLeft: 20 },
  { align: 'flex-end', marginTop: -20, marginRight: 20 },
  { align: 'flex-end', marginTop: 20, marginRight: 40 },
  { align: 'center', marginTop: 40 },
  { align: 'flex-start', marginTop: 30, marginLeft: 40 },
  { align: 'center', marginTop: 30 },
  { align: 'flex-end', marginTop: 20 },
  { align: 'flex-start', marginTop: 20, marginLeft: 20 },
];

// --- CONTEÚDO MOCK ---
const CONTEUDO_MOCK: Record<string, { titulo: string, descricao: string }[]> = {
  'Automação de processos': [
    { titulo: 'Introdução a RPA', descricao: 'O que é Robotic Process Automation.' },
    { titulo: 'Mapeamento de Processos', descricao: 'Identificando gargalos manuais.' },
    { titulo: 'Ferramentas Low-Code', descricao: 'Power Automate e Zapier.' },
    { titulo: 'Python para Automação', descricao: 'Scripts básicos para tarefas repetitivas.' },
    { titulo: 'Integração de APIs', descricao: 'Conectando sistemas diferentes.' },
    { titulo: 'Projeto: Bot de E-mail', descricao: 'Automatizando respostas.' },
  ],
  'Dados & Analytics': [
    { titulo: 'Fundamentos de Dados', descricao: 'Diferença entre dados e informação.' },
    { titulo: 'Excel Avançado', descricao: 'Tabelas dinâmicas e Power Query.' },
    { titulo: 'Introdução ao SQL', descricao: 'Consultas básicas em bancos de dados.' },
    { titulo: 'Power BI Essencial', descricao: 'Criando dashboards interativos.' },
    { titulo: 'Storytelling com Dados', descricao: 'Como apresentar insights.' },
    { titulo: 'Projeto: Dashboard de Vendas', descricao: 'Análise real de performance.' },
  ],
  'Inteligência Artificial': [
    { titulo: 'O que é IA Generativa', descricao: 'Entendendo ChatGPT e Midjourney.' },
    { titulo: 'Engenharia de Prompt', descricao: 'Como pedir corretamente para a IA.' },
    { titulo: 'IA no Dia a Dia', descricao: 'Ferramentas de produtividade.' },
    { titulo: 'Ética e IA', descricao: 'Viés, copyright e segurança.' },
    { titulo: 'No-Code AI', descricao: 'Criando soluções sem programar.' },
    { titulo: 'Projeto: Assistente Virtual', descricao: 'Criando um bot personalizado.' },
  ],
  'Cibersegurança': [
    { titulo: 'Higiene Cibernética', descricao: 'Senhas, 2FA e Phishing.' },
    { titulo: 'Tipos de Ataques', descricao: 'Ransomware, Malware e Engenharia Social.' },
    { titulo: 'Segurança de Redes', descricao: 'VPNs, Firewalls e Protocolos.' },
    { titulo: 'LGPD e Privacidade', descricao: 'Legislação de dados no Brasil.' },
    { titulo: 'Criptografia Básica', descricao: 'Como proteger informações.' },
    { titulo: 'Projeto: Auditoria de Segurança', descricao: 'Verificando vulnerabilidades.' },
  ],
  'Tecnologia & Programação': [
    { titulo: 'Lógica de Programação', descricao: 'Algoritmos e pensamento computacional.' },
    { titulo: 'HTML & CSS', descricao: 'Estrutura e estilo da Web.' },
    { titulo: 'JavaScript Básico', descricao: 'Dando vida às páginas.' },
    { titulo: 'Git e GitHub', descricao: 'Versionamento de código.' },
    { titulo: 'Introdução ao React', descricao: 'Componentes e interfaces.' },
    { titulo: 'Projeto: Portfólio Pessoal', descricao: 'Seu primeiro site no ar.' },
  ],
  'Cultura Digital & Soft Skills': [
    { titulo: 'Mindset Ágil', descricao: 'Scrum e Kanban no dia a dia.' },
    { titulo: 'Comunicação Assíncrona', descricao: 'Trabalho remoto eficiente.' },
    { titulo: 'Resolução de Problemas', descricao: 'Design Thinking aplicado.' },
    { titulo: 'Gestão de Tempo', descricao: 'Técnica Pomodoro e Deep Work.' },
    { titulo: 'Adaptabilidade', descricao: 'Aprendendo a aprender (Lifelong Learning).' },
    { titulo: 'Projeto: Plano de Carreira', descricao: 'Desenhando seus próximos passos.' },
  ],
};

export function TrilhaProvider({ children }: { children: React.ReactNode }) {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  const carregarTrilha = async (metaEscolhida: string) => {
    setIsLoading(true);
    setModulos([]);

    try {
      // --- 1. BUSCA O PROGRESSO SALVO NO BACKEND ---
      let progressoUsuario = 0;
      let totalModulos = 0;

      if (user?.token) {
        try {
          const decoded: any = jwtDecode(user.token);
          const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || decoded.sub || decoded.id;

          // Rota que já existe: GET /api/v1/Funcionarios/{id}
          const response = await api.get(`/api/v1/Funcionarios/${userId}`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
          });

              progressoUsuario = response.data.progresso || 0;

            } catch (err) {
              console.warn("Não foi possível carregar o progresso da API, começando do zero.");
            }
        }

      // 2. BUSCA O CONTEÚDO E CALCULA O ESTADO
      const conteudoSelecionado = CONTEUDO_MOCK[metaEscolhida] || [];
      totalModulos = conteudoSelecionado.length;

      // Regra de 3: Quantos módulos foram completados?
      const qtdConcluidos = Math.floor((progressoUsuario / 100) * totalModulos);

      // 3. MONTA A TRILHA VISUAL APLICANDO O ESTADO SALVO
      const trilhaFormatada = conteudoSelecionado.map((item, index) => {
        const estilo = POSICOES_VISUAIS[index % POSICOES_VISUAIS.length];

          const estaConcluido = index < qtdConcluidos;
          const estaBloqueado = index > qtdConcluidos; 

          return {
            id: String(index + 1),
            titulo: item.titulo,
            descricao: item.descricao,
            bloqueado: estaBloqueado,
            concluido: estaConcluido,
            ...estilo
          } as Modulo;
        });

      setTimeout(() => {
        setModulos(trilhaFormatada);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error("Erro crítico ao montar trilha:", error);
      setIsLoading(false);
    }
  };

  const concluirModulo = async (idConcluido: string) => {
    // 1. Cria nova lista aplicando as regras de conclusão
    const novaLista = [...modulos];
    const index = novaLista.findIndex(m => m.id === idConcluido);
    if (index === -1) return;

    novaLista[index] = { ...novaLista[index], concluido: true, bloqueado: false };
    if (index + 1 < novaLista.length) {
      novaLista[index + 1] = { ...novaLista[index + 1], bloqueado: false };
    }

    // 2. Atualiza o Estado Visual (Otimista)
    setModulos(novaLista);

    // 3. Calcula nova porcentagem
    const total = novaLista.length;
    const concluidos = novaLista.filter(m => m.concluido).length;
    const porcentagem = Math.round((concluidos / total) * 100);

    // 4. Envia para a API (PATCH)
    try {
      if (!user?.token) return;

      const decoded: any = jwtDecode(user.token);
      const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || decoded.sub || decoded.id;

      await api.patch(`/api/v1/Funcionarios/${userId}/progresso`,
        { progresso: porcentagem },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(`Progresso salvo no Backend: ${porcentagem}%`);

    } catch (error) {
      console.error("Erro ao salvar progresso na API:", error);
    }
  };

  return (
    <TrilhaContext.Provider value={{ modulos, concluirModulo, carregarTrilha, isLoading }}>
      {children}
    </TrilhaContext.Provider>
  );
}

export const useTrilha = () => useContext(TrilhaContext);