/**
 * Configuração Global do Diagnóstico - Mapa de Gestão da Sua Empresa
 */
const CONFIG = {
  // Webhook para envio dos dados do lead e diagnóstico (Google Sheets, n8n, CRM, etc)
  webhookUrl: "https://webhook.site/placeholder-diagnostico-pme", // Substitua pelo seu endpoint real

  // Telefone da equipe comercial para recebimento no WhatsApp (Formato internacional sem o +)
  whatsappNumber: "5511999999999",

  // URL da Política de Privacidade
  privacyPolicyUrl: "#politica-de-privacidade",

  // Nome da Empresa/Consultoria responsável
  companyName: "Mapa de Gestão PME",

  // Chaves de LocalStorage / SessionStorage
  storageKey: "mapa_gestao_pme_state",

  // Eventos habilitados no console e/ou dataLayer
  enableAnalyticsLog: true
};

// Congelar objeto para evitar modificações acidentais
Object.freeze(CONFIG);
