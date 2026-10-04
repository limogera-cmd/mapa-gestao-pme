/**
 * Dados e regras de personalização do Diagnóstico
 */

const STAGES = [
  {
    id: 1,
    key: "validacao",
    rangeLabel: "até R$ 10 mil/mês",
    name: "Validação",
    shortDesc: "Organizar o caixa e encontrar uma oferta que gere vendas consistentes.",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`
  },
  {
    id: 2,
    key: "tracao",
    rangeLabel: "acima de R$ 10 mil até R$ 30 mil/mês",
    name: "Tração",
    shortDesc: "Criar uma rotina comercial para atrair clientes e vender com mais frequência.",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`
  },
  {
    id: 3,
    key: "escala",
    rangeLabel: "acima de R$ 30 mil até R$ 100 mil/mês",
    name: "Escala",
    shortDesc: "Estruturar processos e equipe para crescer preservando a margem.",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`
  },
  {
    id: 4,
    key: "profissionalizacao",
    rangeLabel: "acima de R$ 100 mil até R$ 300 mil/mês",
    name: "Profissionalização",
    shortDesc: "Acompanhar resultados e distribuir responsabilidades para reduzir a dependência do dono.",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`
  },
  {
    id: 5,
    key: "expansao",
    rangeLabel: "acima de R$ 300 mil/mês",
    name: "Expansão",
    shortDesc: "Planejar novos mercados e canais com estrutura e controle financeiro.",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
  }
];

const QUESTIONS = [
  {
    id: 1,
    title: "Quanto sua empresa fatura por mês, em média?",
    supportText: "Uma estimativa é suficiente para identificar seu momento atual.",
    progressText: "1 de 3",
    options: [
      { id: "val_10k", label: "Até R$ 10 mil", stageId: 1, feedback: "Seu estágio apareceu no mapa. Agora vamos ajustar a orientação à realidade do seu negócio." },
      { id: "trac_30k", label: "Acima de R$ 10 mil até R$ 30 mil", stageId: 2, feedback: "Seu estágio apareceu no mapa. Agora vamos ajustar a orientação à realidade do seu negócio." },
      { id: "esc_100k", label: "Acima de R$ 30 mil até R$ 100 mil", stageId: 3, feedback: "Seu estágio apareceu no mapa. Agora vamos ajustar a orientação à realidade do seu negócio." },
      { id: "prof_300k", label: "Acima de R$ 100 mil até R$ 300 mil", stageId: 4, feedback: "Seu estágio apareceu no mapa. Agora vamos ajustar a orientação à realidade do seu negócio." },
      { id: "exp_plus", label: "Acima de R$ 300 mil", stageId: 5, feedback: "Seu estágio apareceu no mapa. Agora vamos ajustar a orientação à realidade do seu negócio." }
    ]
  },
  {
    id: 2,
    title: "Em qual segmento sua empresa atua?",
    supportText: "O que funciona para uma empresa de serviços pode precisar de ajustes em um comércio.",
    progressText: "2 de 3",
    options: [
      { id: "comercio", label: "Comércio e varejo" },
      { id: "alimentacao", label: "Alimentação e bebidas" },
      { id: "servicos", label: "Serviços profissionais" },
      { id: "saude", label: "Saúde e bem-estar" },
      { id: "educacao", label: "Educação e cursos" },
      { id: "tecnologia", label: "Tecnologia" },
      { id: "industria", label: "Indústria e produção" },
      { id: "creator", label: "Creator / Criador de Conteúdo" },
      { id: "outro_seg", label: "Outro" }
    ]
  },
  {
    id: 3,
    title: "O que mais trava o crescimento da sua empresa hoje?",
    supportText: "Escolha o problema que mais pesa na sua rotina.",
    progressText: "3 de 3",
    options: [
      { id: "atrair", label: "Atrair mais clientes" },
      { id: "converter", label: "Transformar oportunidades em vendas" },
      { id: "fidelizar", label: "Fazer clientes voltarem a comprar" },
      { id: "lucro", label: "Melhorar o lucro e controlar os custos" },
      { id: "equipe", label: "Organizar a equipe e reduzir a dependência de mim" },
      { id: "outro_dor", label: "Outro" }
    ]
  }
];

/**
 * Retorna uma frase contextualizada para o Mapa (Estágio + Segmento)
 */
function getSegmentContextPhrase(stageId, segmentLabel) {
  const isComercio = segmentLabel.includes("Comércio");
  const isAlim = segmentLabel.includes("Alimentação");
  const isServ = segmentLabel.includes("Serviços");
  const isSaude = segmentLabel.includes("Saúde");
  const isTech = segmentLabel.includes("Tecnologia");
  const isCreator = segmentLabel.includes("Creator") || segmentLabel.includes("Criador");

  if (stageId === 1) { // Validação
    if (isCreator) return "Na validação como creator, a prioridade é encontrar um formato de conteúdo que gere seguidores engajados e testar a primeira oferta monetizável — seja um produto digital, mentoria ou serviço.";
    if (isComercio) return `Em ${segmentLabel}, a prioridade é validar os produtos de maior giro e controlar o caixa diário.`;
    if (isAlim) return `Na área de ${segmentLabel}, o foco é padronizar a oferta inicial e garantir margem positiva em cada item.`;
    if (isServ) return `Em ${segmentLabel}, o objetivo é fechar os primeiros clientes recorrentes para estabilizar a receita.`;
    return `Para ${segmentLabel}, o objetivo atual é organizar a entrada de caixa e validar sua proposta de valor principal.`;
  }

  if (stageId === 2) { // Tração
    if (isCreator) return "Sua prioridade é converter audiência em receita recorrente: lançamentos estruturados, assinaturas, clubes ou pacotes de mentoria com previsibilidade de caixa.";
    if (isComercio) return "Sua prioridade é transformar o movimento em vendas e acompanhar o giro dos produtos.";
    if (isServ) return "Sua prioridade é gerar oportunidades qualificadas e aumentar o fechamento de propostas.";
    if (isAlim) return "Sua prioridade é aumentar o ticket médio por cliente e criar previsibilidade no movimento semanal.";
    if (isSaude) return "Sua prioridade é organizar a agenda de atendimentos e fidelizar os primeiros pacientes.";
    return `Para empresas de ${segmentLabel} em Tração, o foco é construir uma rotina comercial constante de atração.`;
  }

  if (stageId === 3) { // Escala
    if (isCreator) return "Crescer como creator neste volume exige separar a operação de conteúdo do negócio: equipe de produção, gestor de tráfego e processo claro de lançamento para não depender só de você.";
    if (isAlim) return "Seu crescimento pede uma operação consistente, com atenção a desperdícios, equipe e margem.";
    if (isComercio) return "Escalar no comércio exige gestão rígida de estoque, compras estratégicas e processos operacionais.";
    if (isServ) return "Escalar serviços exige criar padrões de entrega para atender mais clientes sem perder a qualidade.";
    if (isTech) return "Escalar em tecnologia exige estruturar suporte e onboarding para suportar novos usuários.";
    return `Para empresas de ${segmentLabel} em Escala, o foco é crescer mantendo processos organizados e margem protegida.`;
  }

  if (stageId === 4) { // Profissionalização
    if (isCreator) return "Com este volume, o creator vira CEO do próprio negócio: contratar um COO ou gestor de operações, automatizar lançamentos e criar múltiplas fontes de receita independentes da sua presença.";
    if (isServ) return "Seu próximo passo é organizar entregas, indicadores e responsabilidades para reduzir a dependência de você.";
    if (isComercio) return "Profissionalizar o comércio exige gerentes de loja/operação treinados e dashboards de margem bruta.";
    if (isAlim) return "Profissionalizar pede supervisão de turno, fichas técnicas padronizadas e controle rigoroso de CMV.";
    return `Para ${segmentLabel}, o desafio central é descentralizar decisões e liderar por meio de indicadores claros.`;
  }

  // Stage 5: Expansão
  if (isCreator) return "Na Expansão, o creator constrói um ecossistema: comunidade paga, SaaS, produto físico ou franquia digital — com marca própria que existe além do conteúdo individual.";
  if (isTech || isServ) return `Em Expansão, ${segmentLabel} exige novos canais de distribuição, parcerias e governança sólida.`;
  return `Na Expansão de ${segmentLabel}, o foco estratégico é diversificar mercados com planejamento e controle financeiro robusto.`;
}

/**
 * Gera a descrição personalizada do card de resultado parcial (2 frases)
 */
function getPartialResultDescription(stage, segmentLabel, challengeLabel) {
  const isEquipe = challengeLabel.includes("dependência") || challengeLabel.includes("equipe");
  const isLucro = challengeLabel.includes("lucro") || challengeLabel.includes("custos");
  const isAtrair = challengeLabel.includes("Atrair");
  const isVendas = challengeLabel.includes("vendas") || challengeLabel.includes("oportunidades");

  let desc = `Seu negócio está no estágio de **${stage.name}**. `;

  if (stage.id === 1) {
    if (isLucro) desc += "Para crescer de forma sustentável, o foco inicial é garantir precificação correta e separar as contas pessoais das contas da empresa.";
    else desc += "Neste momento, a prioridade máxima é validar uma oferta simples que traga receita constante antes de criar custos fixos elevados.";
  } else if (stage.id === 2) {
    if (isAtrair) desc += "Para consolidar este momento, você precisa implementar um canal diário de prospecção ou divulgação para alimentar suas vendas.";
    else if (isVendas) desc += "O foco agora é organizar o processo de fechamento de vendas para que nenhuma oportunidade seja perdida por falta de acompanhamento.";
    else desc += "Nesta fase, criar rotinas claras de atendimento e controle financeiro básico garantirá o salto para a próxima etapa.";
  } else if (stage.id === 3) {
    if (isEquipe) desc += "Para crescer com controle, o foco agora é organizar a operação e distribuir responsabilidades, especialmente porque muitas decisões ainda dependem de você.";
    else if (isLucro) desc += "Como o volume aumentou, proteger sua margem contra desperdícios e custos operacionais é a chave para transformar vendas em caixa.";
    else desc += "Nesta fase de aceleração, estruturar procedimentos operacionais padrão evitará gargalos na qualidade da entrega.";
  } else if (stage.id === 4) {
    if (isEquipe) desc += "Neste nível de maturidade, sua função deve migrar de executor da operação para gestor estratégico guiado por metas e indicadores.";
    else desc += "Com a estrutura consolidada, o próximo salto exige um quadro gerencial autônomo e auditoria mensal de resultados.";
  } else {
    desc += "Com operação madura, a meta é planejar novas unidades, produtos ou canais de distribuição preservando a liquidez financeira.";
  }

  return desc;
}

/**
 * Motor de recomendações de 3 Ações Personalizadas (Estágio x Segmento x Desafio)
 */
function generatePersonalizedActions(stage, segmentLabel, challengeLabel) {
  const stageId = stage.id;
  const isAtrair = challengeLabel.includes("Atrair");
  const isVendas = challengeLabel.includes("oportunidades") || challengeLabel.includes("vendas");
  const isFidelizar = challengeLabel.includes("voltarem");
  const isLucro = challengeLabel.includes("lucro") || challengeLabel.includes("custos");
  const isEquipe = challengeLabel.includes("equipe") || challengeLabel.includes("dependência");

  let action1 = { title: "", whatToDo: "", whatToTrack: "" };
  let action2 = { title: "", whatToDo: "", whatToTrack: "" };
  let action3 = { title: "", whatToDo: "", whatToTrack: "" };

  // --- AÇÃO 1: Atacar a dor principal escolhida ---
  if (isAtrair) {
    action1 = {
      title: "Mapear e ativar o canal de atração mais rápido",
      whatToDo: `Defina 1 canal principal adequado a ${segmentLabel} (ex: WhatsApp ativo, tráfego local ou parcerias) para alcançar novos clientes semanalmente. Evite tentar estar em todas as redes ao mesmo tempo sem consistência.`,
      whatToTrack: "Número de novos contatos/leads gerados por semana."
    };
  } else if (isVendas) {
    action1 = {
      title: "Implantar roteiro de acompanhamento de vendas (Follow-up)",
      whatToDo: "Crie um padrão simples para responder orçamentos e entrar em contato em até 24 horas com quem não fechou de imediato. A maioria das vendas acontece na segunda ou terceira abordagem.",
      whatToTrack: "Taxa de conversão de propostas enviadas em vendas fechadas."
    };
  } else if (isFidelizar) {
    action1 = {
      title: "Criar campanha de recompra para a base atual",
      whatToDo: "Listar clientes que não compram há mais de 30 ou 60 dias e enviar uma oferta exclusiva ou convite direto de retorno. Vender para quem já confia na sua marca custa até 5 vezes menos.",
      whatToTrack: "Percentual de clientes recorrentes na receita mensal."
    };
  } else if (isLucro) {
    action1 = {
      title: "Revisar precificação e mapear gargalos de custos",
      whatToDo: "Calcule a margem de contribuição de cada produto ou serviço vendido, incluindo impostos e taxas. Elimine ou renegocie os 3 maiores custos que não trazem retorno direto ao cliente.",
      whatToTrack: "Margem de Lucro Bruta por linha de produto/serviço."
    };
  } else if (isEquipe) {
    action1 = {
      title: "Mapear as 5 tarefas diárias do dono que devem ser delegadas",
      whatToDo: "Liste todas as atividades operacionais executadas por você nesta semana e escolha a primeira para documentar um passo a passo simples e treinar um colaborador direto.",
      whatToTrack: "Horas semanais do dono liberadas da operação."
    };
  } else { // Outro
    action1 = {
      title: "Priorizar o gargalo operacional crítico",
      whatToDo: `Identifique a única atividade em ${segmentLabel} que, se resolvida hoje, destravará o trabalho do restante da empresa. Concentre os esforços da semana unicamente nesse ponto.`,
      whatToTrack: "Tempo de ciclo de entrega ou atendimento."
    };
  }

  // --- AÇÃO 2: Organizar a base necessária conforme o Estágio (com variante Creator) ---
  const isCreatorSeg = segmentLabel.includes("Creator") || segmentLabel.includes("Criador");

  if (stageId === 1) { // Validação
    action2 = isCreatorSeg ? {
      title: "Criar e publicar conteúdo em uma única plataforma com consistência",
      whatToDo: "Escolha uma plataforma principal (Instagram, YouTube ou TikTok) e publique ao menos 3 vezes por semana por 60 dias sem parar. Consistência é o ativo mais valioso nesta fase.",
      whatToTrack: "Taxa de crescimento de seguidores por semana."
    } : {
      title: "Separar rigorosamente as contas da empresa e do dono",
      whatToDo: "Defina um pró-labore fixo mensal para suas despesas pessoais e abra uma conta bancária exclusiva para a pessoa jurídica. Não pague contas da casa com o caixa da empresa.",
      whatToTrack: "Saldo diário em caixa e valor de pró-labore mantido."
    };
  } else if (stageId === 2) { // Tração
    action2 = isCreatorSeg ? {
      title: "Criar a primeira esteira de monetização documentada",
      whatToDo: "Mapeie o caminho do seguidor até a compra: conteúdo gratuito → isca digital → produto de entrada → produto principal. Cada etapa precisa de uma oferta clara com preço e prazo definidos.",
      whatToTrack: "Taxa de conversão de seguidores em compradores."
    } : {
      title: "Padronizar a rotina de atendimento e vendas",
      whatToDo: "Registre em um documento curto os passos necessários para atender o cliente, do primeiro contato até o pós-venda. Isso garante que a equipe entregue a mesma experiência.",
      whatToTrack: "Tempo médio de resposta a um novo cliente."
    };
  } else if (stageId === 3) { // Escala
    action2 = isCreatorSeg ? {
      title: "Contratar editor de vídeo e gestor de comunidade para desafogar o criador",
      whatToDo: "Documente o processo criativo (roteiro, gravação, edição, publicação) e delegue as etapas técnicas. O creator deve focar em aparecer — não em operar a produção.",
      whatToTrack: "Horas semanais do creator liberadas da produção operacional."
    } : {
      title: "Documentar os Procedimentos Operacionais Padrão (POPs)",
      whatToDo: "Crie manuais visuais simples para as principais rotinas da empresa. Isso permite contratar e treinar novos colaboradores sem exigir a presença constante do proprietário.",
      whatToTrack: "Índice de retrabalho ou falhas operacionais."
    };
  } else if (stageId === 4) { // Profissionalização
    action2 = isCreatorSeg ? {
      title: "Contratar um gestor de operações (COO) para a estrutura de negócio",
      whatToDo: "O creator deve estar 80% focado em conteúdo e estratégia. O COO cuida de equipe, processos, fornecedores e indicadores financeiros. Defina KPIs claros para essa contratação.",
      whatToTrack: "Percentual do tempo do creator dedicado à criação vs. gestão."
    } : {
      title: "Implementar reuniões semanais de alinhamento com lideranças",
      whatToDo: "Realize um alinhamento focado de 45 minutos às segundas-feiras com os responsáveis por área para checar metas da semana anterior e remover impedimentos operacionais.",
      whatToTrack: "Percentual de metas semanais cumpridas por setor."
    };
  } else { // Expansão
    action2 = isCreatorSeg ? {
      title: "Desenvolver produto ou empresa independente da sua presença pessoal",
      whatToDo: "Invista em um SaaS, comunidade paga, produto físico ou franquia digital que gere receita mesmo sem conteúdo novo. Diversifique para não depender unicamente do algoritmo.",
      whatToTrack: "Percentual da receita total que é independente do volume de conteúdo publicado."
    } : {
      title: "Estruturar governança e orçamento anual descentralizado",
      whatToDo: "Aloque orçamentos por departamento com limites claros de decisão para seus gestores, vinculando bônus a metas globais de Ebitda e crescimento.",
      whatToTrack: "Variação entre o Orçado x Realizado mensal."
    };
  }

  // --- AÇÃO 3: Acompanhar um indicador para avaliar o progresso ---
  if (stageId <= 2) {
    action3 = {
      title: "Acompanhar semanalmente o DRE Simplificado",
      whatToDo: "Anote ao final de cada semana: Receita Total (-) Custos Variáveis (-) Custos Fixos = Lucro Operacional. Acompanhar este número evita surpresas no fim do mês.",
      whatToTrack: "Lucro Operacional Líquido semanal em R$."
    };
  } else if (stageId === 3) {
    action3 = {
      title: "Monitorar o Custo de Aquisição (CAC) e o Faturamento por Colaborador",
      whatToDo: "Divida o faturamento total pelo número de pessoas da equipe para medir a eficiência da operação à medida que novos funcionários são admitidos.",
      whatToTrack: "Faturamento médio mensal por colaborador."
    };
  } else {
    action3 = {
      title: "Implementar um Dashboard de Indicadores em Tempo Real",
      whatToDo: "Painel simples com 5 métricas essenciais: Vendas, Margem de Lucro, Satisfação do Cliente (NPS), Rotatividade de Equipe e Necessidade de Capital de Giro.",
      whatToTrack: "Índice de previsibilidade de caixa para 90 dias."
    };
  }

  return [action1, action2, action3];
}
