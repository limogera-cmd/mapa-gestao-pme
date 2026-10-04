/**
 * Componente Visual do Mapa de Gestão — Redesign Premium
 * Trilha visual com linha conectora, indicadores numerados, glow no estágio ativo.
 */

const MapComponent = {
  desktopContainer: null,
  mobileModalBody: null,

  init() {
    this.desktopContainer = document.getElementById("map-desktop-container");
    this.mobileModalBody = document.getElementById("map-mobile-modal-body");
    this._bindMobileEvents();
    // Render neutro inicial no desktop
    this.render({ stageId: null, segmentLabel: "", challengeLabel: "" });
  },

  _bindMobileEvents() {
    const openBtn   = document.getElementById("btn-open-map");
    const closeBtn  = document.getElementById("btn-close-map");
    const backdrop  = document.getElementById("map-mobile-backdrop");
    const overlay   = document.getElementById("map-mobile-overlay");

    const open  = () => { if (overlay) { overlay.classList.add("active"); document.body.classList.add("modal-open"); } };
    const close = () => { if (overlay) { overlay.classList.remove("active"); document.body.classList.remove("modal-open"); } };

    if (openBtn)   openBtn.addEventListener("click", open);
    if (closeBtn)  closeBtn.addEventListener("click", close);
    if (backdrop)  backdrop.addEventListener("click", close);
  },

  render(state) {
    const { stageId, segmentLabel, challengeLabel } = state;

    const html = this._buildMapHTML(stageId, segmentLabel, challengeLabel);

    if (this.desktopContainer) this.desktopContainer.innerHTML = html;
    if (this.mobileModalBody)   this.mobileModalBody.innerHTML  = html;

    // Mobile strip dots
    this._updateMobileStrip(stageId);
  },

  _updateMobileStrip(stageId) {
    const strip = document.getElementById("map-mobile-strip");
    const dots  = document.querySelectorAll("#strip-dots .sdot");
    const info  = document.getElementById("strip-info");

    if (!strip) return;

    // Show strip after quiz starts
    if (stageId) {
      strip.style.display = "block";
    }

    dots.forEach(dot => {
      const id = parseInt(dot.dataset.stage, 10);
      dot.classList.remove("active", "done");
      if (id === stageId)      dot.classList.add("active");
      else if (id < stageId)   dot.classList.add("done");
    });

    if (info && stageId) {
      const stage = STAGES.find(s => s.id === stageId);
      info.innerHTML = stage
        ? `Estágio: <strong>${stage.name}</strong>`
        : "Mapa de Gestão";
    }
  },

  _buildMapHTML(activeStageId, segmentLabel, challengeLabel) {
    const hasStage     = !!activeStageId;
    const hasSegment   = !!segmentLabel;
    const hasChallenge = !!challengeLabel;

    const stagesHTML = STAGES.map((stage, idx) => {
      const isActive = activeStageId === stage.id;
      const isPast   = activeStageId && stage.id < activeStageId;
      const isFuture = !activeStageId || stage.id > activeStageId;
      const isLast   = idx === STAGES.length - 1;

      // Context text shown inside active card
      let contextHTML = "";
      if (isActive && hasSegment) {
        const phrase = getSegmentContextPhrase(stage.id, segmentLabel);
        if (hasChallenge) {
          contextHTML = `
            <div class="ms-context">
              <p class="ms-context-phrase">${phrase}</p>
              <div class="ms-priority-pill">
                <span class="ms-priority-icon">⚡</span>
                <span>${challengeLabel}</span>
              </div>
            </div>`;
        } else {
          contextHTML = `
            <div class="ms-context">
              <p class="ms-context-phrase">${phrase}</p>
            </div>`;
        }
      }

      // State classes
      const stateClass = isActive ? "ms-item--active"
                       : isPast   ? "ms-item--past"
                       : isFuture && hasStage ? "ms-item--future"
                       : "ms-item--neutral";

      // Connector line
      const connectorHTML = isLast ? "" : `
        <div class="ms-connector">
          <div class="ms-connector-line ${isPast || isActive ? "ms-connector-line--lit" : ""}"></div>
        </div>`;

      return `
        <div class="ms-item ${stateClass}" data-stage-id="${stage.id}">
          <div class="ms-item-left">
            <!-- Number bubble + connector -->
            <div class="ms-bubble-wrap">
              <div class="ms-bubble ${isActive ? "ms-bubble--active" : ""} ${isPast ? "ms-bubble--past" : ""}">
                ${isPast
                  ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`
                  : `<span>${stage.id}</span>`
                }
                ${isActive ? `<span class="ms-bubble-pulse"></span>` : ""}
              </div>
              ${connectorHTML}
            </div>
          </div>

          <div class="ms-item-body">
            ${isActive ? `<div class="ms-you-are-here">📍 Sua empresa está aqui</div>` : ""}

            <div class="ms-item-head">
              <span class="ms-icon">${stage.icon}</span>
              <div>
                <h4 class="ms-name">${stage.name}</h4>
                <span class="ms-range">${stage.rangeLabel}</span>
              </div>
            </div>

            <p class="ms-desc">${stage.shortDesc}</p>
            ${contextHTML}
          </div>
        </div>`;
    }).join("");

    return `
      <div class="map-shell">
        <!-- Header -->
        <div class="map-shell-header">
          <div class="map-shell-header-top">
            <div class="map-shell-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
              </svg>
            </div>
            <div>
              <p class="map-shell-label">Mapa de Gestão</p>
              <p class="map-shell-sublabel">5 estágios de crescimento</p>
            </div>
          </div>
          <div class="map-shell-progress-bar">
            <div class="map-shell-progress-fill" style="width: ${activeStageId ? (activeStageId / 5) * 100 : 0}%"></div>
          </div>
          ${activeStageId ? `
            <div class="map-shell-stats">
              <div class="map-shell-stat">
                <span class="map-shell-stat-num">${activeStageId}</span>
                <span class="map-shell-stat-label">de 5 estágios</span>
              </div>
              ${hasChallenge ? `
                <div class="map-shell-stat">
                  <span class="map-shell-stat-num map-shell-stat-num--amber">✓</span>
                  <span class="map-shell-stat-label">Diagnóstico completo</span>
                </div>` : `
                <div class="map-shell-stat">
                  <span class="map-shell-stat-num map-shell-stat-num--dim">${hasSegment ? "2" : "1"}/3</span>
                  <span class="map-shell-stat-label">Respostas</span>
                </div>`
              }
            </div>` : `
            <p class="map-shell-cta-hint">Responda as perguntas para revelar seu estágio →</p>`
          }
        </div>

        <!-- Stages Trail -->
        <div class="map-stages-trail">
          ${stagesHTML}
        </div>
      </div>`;
  }
};
