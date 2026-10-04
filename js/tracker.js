/**
 * Sistema de Tracking e Disparo de Eventos de Analytics
 */

const Tracker = {
  /**
   * Dispara um evento para dataLayer, gtag, pixel ou console
   * @param {string} eventName Nome do evento
   * @param {Object} [payload] Dados adicionais (sem PII)
   */
  track(eventName, payload = {}) {
    // Garantir que nenhum PII (nome, telefone) seja enviado para analytics
    const safePayload = { ...payload };
    delete safePayload.nome;
    delete safePayload.whatsapp;
    delete safePayload.phone;

    const eventData = {
      event: eventName,
      timestamp: new Date().toISOString(),
      ...safePayload
    };

    if (CONFIG.enableAnalyticsLog) {
      console.log(`[Analytics Event]: ${eventName}`, eventData);
    }

    // Google Tag Manager / GA4
    if (typeof window.dataLayer !== "undefined" && Array.isArray(window.dataLayer)) {
      window.dataLayer.push(eventData);
    }

    // Meta Pixel (fbq)
    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", eventName, safePayload);
    }

    // Custom Event listener no window para integrações próprias
    window.dispatchEvent(new CustomEvent("diagnostico_event", { detail: eventData }));
  },

  // Eventos específicos
  diagnosticoIniciado() {
    this.track("diagnostico_iniciado");
  },

  perguntaRespondida(perguntaId, opcaoId, label) {
    this.track(`pergunta_${perguntaId}_respondida`, {
      pergunta_id: perguntaId,
      opcao_id: opcaoId,
      opcao_label: label
    });
  },

  resultadoParcialVisualizado(estagioKey, segmento, desafio) {
    this.track("resultado_parcial_visualizado", {
      estagio: estagioKey,
      segmento: segmento,
      desafio: desafio
    });
  },

  leadConcluido(estagioKey) {
    this.track("lead_concluido", {
      estagio: estagioKey
    });
  },

  whatsappClicado(estagioKey) {
    this.track("whatsapp_clicado", {
      estagio: estagioKey
    });
  }
};
