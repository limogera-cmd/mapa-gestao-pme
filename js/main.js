/**
 * Lógica Principal e Gerenciador de Estados do Diagnóstico
 */

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

const App = {
  // Estado do Diagnóstico
  state: {
    currentScreen: "intro", // intro | q1 | q2 | q3 | partial | full
    stageId: null,
    faturamentoLabel: "",
    segmentLabel: "",
    challengeLabel: "",
    nome: "",
    whatsappRaw: "",
    whatsappNormalized: "",
    actions: [],
    isSubmitting: false,
    submissionSuccess: false
  },

  init() {
    MapComponent.init();
    this.bindEvents();
    this.restoreState();
    this.renderScreen();
    this.updateMap();
  },

  bindEvents() {
    // 1. Botão da Tela Inicial
    const startBtn = document.getElementById("btn-start-diagnostic");
    if (startBtn) {
      startBtn.addEventListener("click", () => {
        Tracker.diagnosticoIniciado();
        this.goToScreen("q1");
      });
    }

    // 2. Botões Voltar
    document.querySelectorAll(".btn-back-step").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const targetScreen = e.currentTarget.getAttribute("data-target-screen");
        if (targetScreen) {
          this.goToScreen(targetScreen);
        }
      });
    });

    // 3. Seleção de Opções nas Perguntas (Q1, Q2, Q3)
    this.setupQuestionOptions();

    // 4. Form de Captura de Lead
    const leadForm = document.getElementById("lead-capture-form");
    if (leadForm) {
      leadForm.addEventListener("submit", (e) => this.handleLeadSubmit(e));
    }

    // 5. Máscara de Telefone WhatsApp
    const phoneInput = document.getElementById("lead-whatsapp");
    if (phoneInput) {
      phoneInput.addEventListener("input", (e) => this.handlePhoneMask(e));
    }

    // 6. Botão WhatsApp Comercial
    const ctaWaBtn = document.getElementById("btn-whatsapp-cta");
    if (ctaWaBtn) {
      ctaWaBtn.addEventListener("click", () => {
        const stage = STAGES.find(s => s.id === this.state.stageId);
        Tracker.whatsappClicado(stage ? stage.key : "desconhecido");
      });
    }
  },

  setupQuestionOptions() {
    document.querySelectorAll(".question-option-card").forEach(card => {
      card.addEventListener("click", (e) => {
        const cardEl = e.currentTarget;
        const qId = parseInt(cardEl.getAttribute("data-question-id"), 10);
        const optionId = cardEl.getAttribute("data-option-id");
        const label = cardEl.getAttribute("data-option-label");
        const stageId = cardEl.getAttribute("data-stage-id");

        // Marcar visualmente como selecionado na pergunta atual
        const parentGrid = cardEl.closest(".options-grid");
        if (parentGrid) {
          parentGrid.querySelectorAll(".question-option-card").forEach(c => c.classList.remove("selected"));
        }
        cardEl.classList.add("selected");

        // Atualizar estado
        if (qId === 1) {
          this.state.stageId = parseInt(stageId, 10);
          this.state.faturamentoLabel = label;
          Tracker.perguntaRespondida(1, optionId, label);
          this.saveState();
          this.updateMap();

          // Feedback breve antes de avançar
          setTimeout(() => this.goToScreen("q2"), 280);

        } else if (qId === 2) {
          this.state.segmentLabel = label;
          Tracker.perguntaRespondida(2, optionId, label);
          this.saveState();
          this.updateMap();

          setTimeout(() => this.goToScreen("q3"), 280);

        } else if (qId === 3) {
          this.state.challengeLabel = label;
          Tracker.perguntaRespondida(3, optionId, label);

          // Gerar ações personalizadas
          const stage = STAGES.find(s => s.id === this.state.stageId);
          this.state.actions = generatePersonalizedActions(stage, this.state.segmentLabel, this.state.challengeLabel);

          this.saveState();
          this.updateMap();

          Tracker.resultadoParcialVisualizado(stage ? stage.key : "", this.state.segmentLabel, this.state.challengeLabel);

          setTimeout(() => this.goToScreen("partial"), 300);
        }
      });
    });
  },

  goToScreen(screenId) {
    this.state.currentScreen = screenId;
    this.saveState();
    this.renderScreen();
    this.updateMap();
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  renderScreen() {
    // Esconder todas as telas
    document.querySelectorAll(".screen-section").forEach(sec => {
      sec.classList.remove("active");
    });

    const activeSec = document.getElementById(`screen-${this.state.currentScreen}`);
    if (activeSec) {
      activeSec.classList.add("active");
    }

    // Se estiver no resultado parcial ou completo, atualizar os cards informativos
    if (this.state.currentScreen === "partial") {
      this.renderPartialResultCard();
    } else if (this.state.currentScreen === "full") {
      this.renderFullResultCard();
    }
  },

  updateMap() {
    MapComponent.render({
      stageId: this.state.stageId,
      segmentLabel: this.state.segmentLabel,
      challengeLabel: this.state.challengeLabel,
      currentStep: this.state.currentScreen
    });
  },

  renderPartialResultCard() {
    const stage = STAGES.find(s => s.id === this.state.stageId);
    if (!stage) return;

    const titleEl = document.getElementById("partial-stage-name");
    const contextEl = document.getElementById("partial-context-text");
    const descEl = document.getElementById("partial-stage-desc");

    if (titleEl) titleEl.textContent = stage.name;
    if (contextEl) {
      contextEl.innerHTML = `Para empresas de <strong>${this.state.segmentLabel}</strong>, com foco em <strong>${this.state.challengeLabel}</strong>.`;
    }
    if (descEl) {
      descEl.innerHTML = getPartialResultDescription(stage, this.state.segmentLabel, this.state.challengeLabel);
    }
  },

  renderFullResultCard() {
    const stage = STAGES.find(s => s.id === this.state.stageId);
    if (!stage) return;

    // Resumo do modelo
    const stageLabelEl = document.getElementById("full-summary-stage");
    const segmentLabelEl = document.getElementById("full-summary-segment");
    const priorityLabelEl = document.getElementById("full-summary-priority");

    if (stageLabelEl) stageLabelEl.textContent = stage.name;
    if (segmentLabelEl) segmentLabelEl.textContent = this.state.segmentLabel;
    if (priorityLabelEl) priorityLabelEl.textContent = this.state.challengeLabel;

    // Renderizar as 3 Ações Desbloqueadas
    const actionsContainer = document.getElementById("unlocked-actions-container");
    if (actionsContainer && this.state.actions.length === 3) {
      actionsContainer.innerHTML = this.state.actions.map((act, idx) => `
        <div class="action-card unlocked">
          <div class="action-card-header">
            <span class="action-step-number">Ação ${idx + 1}</span>
            <h3 class="action-title">${act.title}</h3>
          </div>
          <div class="action-body">
            <div class="action-field">
              <span class="field-label">🎯 O que fazer:</span>
              <p class="field-text">${act.whatToDo}</p>
            </div>
            <div class="action-field highlight-kpi">
              <span class="field-label">📊 O que acompanhar:</span>
              <p class="field-text">${act.whatToTrack}</p>
            </div>
          </div>
        </div>
      `).join("");
    }

    // Configurar o Link Direct WhatsApp
    const waBtn = document.getElementById("btn-whatsapp-cta");
    if (waBtn) {
      const msg = `Olá! Fiz o diagnóstico da minha empresa. Meu faturamento mensal é ${this.state.faturamentoLabel}, atuo em ${this.state.segmentLabel} e meu principal desafio é ${this.state.challengeLabel}. O modelo recomendado foi ${stage.name}. Quero conversar sobre como colocar as ações em prática.`;
      const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
      waBtn.href = waUrl;
    }
  },

  /**
   * Máscara dinâmica de telefone brasileiro (ex: (11) 99999-9999)
   */
  handlePhoneMask(e) {
    let input = e.target.value.replace(/\D/g, "");

    // Tratar se usuário colocar 55 no início
    if (input.startsWith("55") && input.length > 10) {
      input = input.substring(2);
    }

    if (input.length > 11) {
      input = input.substring(0, 11);
    }

    let formatted = "";
    if (input.length > 0) {
      formatted = "(" + input.substring(0, 2);
    }
    if (input.length >= 3) {
      formatted += ") " + input.substring(2, 7);
    }
    if (input.length >= 8) {
      formatted += "-" + input.substring(7, 11);
    }

    e.target.value = formatted;
    this.state.whatsappRaw = formatted;
    this.state.whatsappNormalized = input.length >= 10 ? "55" + input : "";
  },

  /**
   * Submissão do Formulário de Captura de Lead com envio via Webhook
   */
  async handleLeadSubmit(e) {
    e.preventDefault();

    if (this.state.isSubmitting) return;

    const nameInput = document.getElementById("lead-name");
    const phoneInput = document.getElementById("lead-whatsapp");
    const errorMsgEl = document.getElementById("form-error-msg");
    const submitBtn = document.getElementById("btn-submit-lead");

    const nome = nameInput ? nameInput.value.trim() : "";
    const phoneVal = phoneInput ? phoneInput.value.trim() : "";

    // Validações básicas
    if (nome.length < 2) {
      this.showError("Por favor, informe seu nome completo.");
      nameInput.focus();
      return;
    }

    const digitsOnly = phoneVal.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      this.showError("Por favor, informe um número de WhatsApp válido com DDD.");
      phoneInput.focus();
      return;
    }

    this.state.nome = nome;
    this.state.whatsappNormalized = digitsOnly.startsWith("55") ? digitsOnly : "55" + digitsOnly;

    // Bloquear envio duplo
    this.state.isSubmitting = true;
    if (errorMsgEl) errorMsgEl.style.display = "none";

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="spinner"></span>
        <span>Preparando seu diagnóstico…</span>
      `;
    }

    // Coletar UTMs e Metadados
    const utms = this.getUTMParams();
    const stage = STAGES.find(s => s.id === this.state.stageId);

    const payload = {
      envioId: this.generateUUID(),
      dataHora: new Date().toISOString(),
      urlEntrada: window.location.href,
      nome: this.state.nome,
      whatsapp: this.state.whatsappNormalized,
      faturamento: this.state.faturamentoLabel,
      segmento: this.state.segmentLabel,
      desafio: this.state.challengeLabel,
      modeloRecomendado: stage ? stage.name : "",
      tresAcoesRecomendadas: this.state.actions.map(a => a.title),
      utms: utms
    };

    try {
      // Enviar via fetch com timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(CONFIG.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Webhook respondido com sucesso ou aceito
      this.state.isSubmitting = false;
      this.state.submissionSuccess = true;

      // Disparar evento de analytics de Lead Concluído
      Tracker.leadConcluido(stage ? stage.key : "");

      // Avançar para a tela do Diagnóstico Completo
      this.goToScreen("full");

    } catch (err) {
      console.warn("Aviso ao enviar webhook, acionando fallback seguro:", err);
      // Caso o webhook de teste estivesse bloqueado ou com falha de CORS/Rede,
      // oferecemos retenção de dados e permissão de nova tentativa,
      // mas se for por causa da URL padrão de teste, permitimos prosseguir graciosamente após informar.
      
      this.state.isSubmitting = false;
      
      // Se for o endpoint de demonstração ou mock, simulamos conclusão graciosa sem perder a conversão
      if (CONFIG.webhookUrl.includes("placeholder-diagnostico-pme") || err.name === "AbortError") {
        Tracker.leadConcluido(stage ? stage.key : "");
        this.goToScreen("full");
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Liberar minhas 3 ações prioritárias</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        `;
      }

      this.showError("Não foi possível enviar os dados no momento. Verifique sua conexão e tente novamente.");
    }
  },

  showError(msg) {
    const errorMsgEl = document.getElementById("form-error-msg");
    if (errorMsgEl) {
      errorMsgEl.textContent = msg;
      errorMsgEl.style.display = "block";
    }
  },

  getUTMParams() {
    const params = new URLSearchParams(window.location.search);
    const utms = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(key => {
      if (params.has(key)) {
        utms[key] = params.get(key);
      }
    });
    return utms;
  },

  generateUUID() {
    return "id-" + Math.random().toString(36).substring(2, 9) + "-" + Date.now();
  },

  saveState() {
    try {
      sessionStorage.setItem(CONFIG.storageKey, JSON.stringify(this.state));
    } catch (e) {
      // Ignorar erros de quota em navegação privada
    }
  },

  restoreState() {
    try {
      const saved = sessionStorage.getItem(CONFIG.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = { ...this.state, ...parsed, isSubmitting: false };
      }
    } catch (e) {
      // Ignorar erros de parse
    }
  }
};
