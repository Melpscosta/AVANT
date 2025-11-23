import React, { createContext, useContext, useState } from 'react';
import storage from "../services/storage";

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

// ------------------------------------------------------------
// POSIÇÕES VISUAIS
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// CONTEÚDO MOCK
// ------------------------------------------------------------
const CONTEUDO_MOCK: Record<string, { titulo: string; descricao: string }[]> = {
  "Automação de processos": [
    { titulo: "Introdução a RPA", descricao: "O que é Robotic Process Automation." },
    { titulo: "Mapeamento de Processos", descricao: "Identificando gargalos manuais." },
    { titulo: "Ferramentas Low-Code", descricao: "Power Automate e Zapier." },
    { titulo: "Python para Automação", descricao: "Scripts básicos para tarefas repetitivas." },
    { titulo: "Integração de APIs", descricao: "Conectando sistemas diferentes." },
    { titulo: "Projeto: Bot de E-mail", descricao: "Automatizando respostas." },
  ],
  "Dados & Analytics": [
    { titulo: "Fundamentos de Dados", descricao: "Diferença entre dados e informação." },
    { titulo: "Excel Avançado", descricao: "Tabelas dinâmicas e Power Query." },
    { titulo: "Introdução ao SQL", descricao: "Consultas básicas." },
    { titulo: "Power BI Essencial", descricao: "Dashboards interativos." },
    { titulo: "Storytelling com Dados", descricao: "Como apresentar insights." },
    { titulo: "Projeto: Dashboard de Vendas", descricao: "Análise real." },
  ],
  "Inteligência Artificial": [
    { titulo: "IA Generativa", descricao: "ChatGPT, Claude, Stable Diffusion." },
    { titulo: "Engenharia de Prompt", descricao: "Como pedir corretamente." },
    { titulo: "IA no Dia a Dia", descricao: "Ferramentas úteis." },
    { titulo: "Ética e IA", descricao: "Viés, copyright e segurança." },
    { titulo: "No-Code AI", descricao: "Criando apps sem programar." },
    { titulo: "Projeto: Assistente Virtual", descricao: "Construindo um bot." },
  ],
  "Cibersegurança": [
    { titulo: "Higiene Cibernética", descricao: "Senhas, 2FA, Phishing." },
    { titulo: "Tipos de Ataques", descricao: "Ransomware, Engenharia Social." },
    { titulo: "Segurança de Redes", descricao: "VPN, Firewalls." },
    { titulo: "LGPD e Privacidade", descricao: "Legislação." },
    { titulo: "Criptografia Básica", descricao: "Proteção de dados." },
    { titulo: "Projeto: Auditoria", descricao: "Verificando vulnerabilidades." },
  ],
  "Tecnologia & Programação": [
    { titulo: "Lógica de Programação", descricao: "Algoritmos." },
    { titulo: "HTML & CSS", descricao: "Base da Web." },
    { titulo: "JavaScript Básico", descricao: "Interatividade." },
    { titulo: "Git e GitHub", descricao: "Versionamento." },
    { titulo: "Introdução ao React", descricao: "Componentização." },
    { titulo: "Projeto: Portfólio", descricao: "Fazendo seu site." },
  ],
  "Cultura Digital & Soft Skills": [
    { titulo: "Mindset Ágil", descricao: "Scrum e Kanban." },
    { titulo: "Comunicação Assíncrona", descricao: "Trabalho remoto." },
    { titulo: "Resolução de Problemas", descricao: "Design Thinking." },
    { titulo: "Gestão de Tempo", descricao: "Pomodoro." },
    { titulo: "Adaptabilidade", descricao: "Aprender sempre." },
    { titulo: "Projeto: Plano de Carreira", descricao: "Próximos passos." },
  ],
};

// ------------------------------------------------------------
// PROVIDER COMPLETO
// ------------------------------------------------------------
export function TrilhaProvider({ children }: { children: React.ReactNode }) {

  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ------------------------------------------------------------
  // CARREGAR A TRILHA
  // ------------------------------------------------------------
  const carregarTrilha = async (metaEscolhida: string) => {
    setIsLoading(true);

    // guardar a meta selecionada
    storage.setString("mock_meta_selecionada", metaEscolhida);

    const conteudo = CONTEUDO_MOCK[metaEscolhida] ?? [];

    const session = storage.getObject("mock_session");
    const workers = storage.getObject("mock_workers") || [];

    let progresso = 0;

    if (session?.tipo === "funcionario") {
      const worker = workers.find((w: any) => w.id === session.id);
      progresso = worker?.progresso ?? 0;
    }

    const total = conteudo.length;
    const concluidos = Math.floor((progresso / 100) * total);

    const lista: Modulo[] = conteudo.map((item, index) => {
      const visual = POSICOES_VISUAIS[index % POSICOES_VISUAIS.length];

      return {
        id: String(index + 1),
        titulo: item.titulo,
        descricao: item.descricao,
        concluido: index < concluidos,
        bloqueado: index > concluidos,
        ...visual
      };
    });

    setTimeout(() => {
      setModulos(lista);
      setIsLoading(false);
    }, 300);
  };

  // ------------------------------------------------------------
  // CONCLUIR MÓDULO (AGORA SALVA NO FUNCIONÁRIO)
  // ------------------------------------------------------------
  const concluirModulo = async (id: string) => {

    const novaLista = [...modulos];
    const index = novaLista.findIndex(m => m.id === id);
    if (index === -1) return;

    // concluir atual
    novaLista[index].concluido = true;
    novaLista[index].bloqueado = false;

    // liberar próximo
    if (index + 1 < novaLista.length) {
      novaLista[index + 1].bloqueado = false;
    }

    setModulos(novaLista);

    // progresso final
    const total = novaLista.length;
    const concluídos = novaLista.filter(x => x.concluido).length;
    const porcentagem = Math.round((concluídos / total) * 100);

    // atualizar funcionário logado
    const session = storage.getObject("mock_session");
    const workers = storage.getObject("mock_workers") || [];

    if (session?.tipo === "funcionario") {

      const wIndex = workers.findIndex((w: any) => w.id === session.id);
      if (wIndex !== -1) {
        workers[wIndex].progresso = porcentagem;
        storage.setObject("mock_workers", workers);

        // atualizar session
        storage.setObject("mock_session", {
          ...session,
          progresso: porcentagem
        });
      }
    }
  };

  return (
    <TrilhaContext.Provider
      value={{
        modulos,
        concluirModulo,
        carregarTrilha,
        isLoading
      }}
    >
      {children}
    </TrilhaContext.Provider>
  );
}

export const useTrilha = () => useContext(TrilhaContext);
