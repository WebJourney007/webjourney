/* ===== AUDIT TOOL — Web Journey ===== */

(function () {
  'use strict';

  const formEl      = document.getElementById('audit-form');
  const urlInput    = document.getElementById('audit-url');
  const formError   = document.getElementById('audit-form-error');
  const loaderEl    = document.getElementById('audit-loader');
  const loaderStep  = document.getElementById('audit-loader-step');
  const loaderUrl   = document.getElementById('audit-loader-url');
  const resultsEl   = document.getElementById('audit-results');
  const errorEl     = document.getElementById('audit-error');
  const errorMsg    = document.getElementById('audit-error-message');
  const leadForm    = document.getElementById('audit-lead-form');
  const leadSuccess = document.getElementById('audit-lead-success');
  const leadErrorEl = document.getElementById('audit-lead-error');

  let currentUrl     = '';
  let currentScores  = {};
  let resultsCache   = { mobile: null, desktop: null };
  let activeStrategy = 'mobile';

  // ---- Helpers ----

  function scoreColor(s) {
    if (s == null) return '#aaa';
    if (s >= 90) return '#0cce6b';
    if (s >= 50) return '#ffa400';
    return '#ff4e42';
  }

  function scoreClass(s) {
    if (s == null) return 'unavailable';
    if (s >= 90) return 'good';
    if (s >= 50) return 'average';
    return 'poor';
  }

  function scoreLabel(s) {
    if (s == null) return 'Non disponible';
    if (s >= 90) return 'Bon';
    if (s >= 50) return 'À améliorer';
    return 'Faible';
  }

  function normalizeUrl(raw) {
    raw = raw.trim();
    if (!/^https?:\/\//i.test(raw)) raw = 'https://' + raw;
    try { new URL(raw); return raw; }
    catch { return null; }
  }

  function show(el) { el.classList.add('is-visible'); }
  function hide(el) { el.classList.remove('is-visible'); }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ---- Ring chart ----

  function buildRing(containerId, score) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const r    = 28;
    const circ = 2 * Math.PI * r;
    const color  = scoreColor(score);

    if (score == null) {
      container.innerHTML = `
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <circle class="audit-score-card__ring-bg" cx="32" cy="32" r="${r}"/>
        </svg>
        <div class="audit-score-card__value" style="color:${color};">—</div>
      `;
      return;
    }

    const offset = circ - (score / 100) * circ;
    container.innerHTML = `
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle class="audit-score-card__ring-bg" cx="32" cy="32" r="${r}"/>
        <circle class="audit-score-card__ring-fill"
          cx="32" cy="32" r="${r}"
          stroke="${color}"
          stroke-dasharray="${circ}"
          stroke-dashoffset="${circ}"
        />
      </svg>
      <div class="audit-score-card__value" style="color:${color};">${score}</div>
    `;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const fill = container.querySelector('.audit-score-card__ring-fill');
        if (fill) fill.style.strokeDashoffset = offset;
      });
    });
  }

  // ---- Display ----

  function displayResults(data) {
    const scores   = data.scores;
    const issues   = data.issues   || [];
    const positives = data.positives || [];
    const vitals   = data.vitals   || {};
    const meta     = data.meta     || {};

    currentScores = scores;

    // Global
    const globalCircle = document.getElementById('audit-global-circle');
    if (globalCircle) {
      globalCircle.style.color       = scoreColor(scores.global);
      globalCircle.style.borderColor = scoreColor(scores.global);
      document.getElementById('audit-global-number').textContent = scores.global;
    }

    // 4 rings
    buildRing('ring-performance',  scores.performance);
    buildRing('ring-seo',          scores.seo);
    buildRing('ring-accessibility', scores.accessibility);
    buildRing('ring-bestpractices', scores.bestPractices);

    [
      { key: 'performance',  score: scores.performance },
      { key: 'seo',          score: scores.seo },
      { key: 'accessibility', score: scores.accessibility },
      { key: 'bestpractices', score: scores.bestPractices },
    ].forEach(({ key, score }) => {
      const el = document.getElementById(`status-${key}`);
      if (el) {
        el.textContent = scoreLabel(score);
        el.className   = `audit-score-card__status status-${scoreClass(score)}`;
      }
    });

    // Vitals
    const vitalMap = { 'vital-fcp': vitals.fcp, 'vital-lcp': vitals.lcp, 'vital-cls': vitals.cls, 'vital-tbt': vitals.tbt, 'vital-si': vitals.si, 'vital-tti': vitals.tti };
    for (const [id, val] of Object.entries(vitalMap)) {
      const el = document.getElementById(id);
      if (el) el.textContent = val || '—';
    }

    // Meta
    const metaEl = document.getElementById('audit-meta-info');
    if (metaEl) {
      metaEl.innerHTML = [
        meta.response_ms ? `Réponse serveur : <strong>${meta.response_ms}ms</strong>` : '',
        meta.https !== undefined ? `HTTPS : <strong>${meta.https ? 'Oui' : 'Non'}</strong>` : '',
      ].filter(Boolean).join(' &nbsp;·&nbsp; ');
    }

    // Issues
    const issuesContainer = document.getElementById('audit-issues-list');
    if (issuesContainer) {
      issuesContainer.innerHTML = issues.length === 0
        ? `<div class="audit-no-issues"><span>✓</span><span>Aucun problème critique détecté — excellent !</span></div>`
        : issues.map(i => `
            <div class="audit-issue-item">
              <div class="audit-issue-item__icon ${i.level === 'critical' ? 'is-poor' : 'is-average'}">!</div>
              <div class="audit-issue-item__text">
                <div class="audit-issue-item__title">${escapeHtml(i.title)}</div>
                <div class="audit-issue-item__desc">${escapeHtml(i.desc)}</div>
              </div>
            </div>`).join('');
    }

    // Positives
    const posContainer = document.getElementById('audit-positives-list');
    if (posContainer) {
      if (positives.length > 0) {
        posContainer.innerHTML = positives.map(p => `
          <div class="audit-positive-item">
            <span class="audit-positive-item__icon">✓</span>
            <div class="audit-positive-item__text">
              <span class="audit-positive-item__title">${escapeHtml(p.title)}</span>
              ${p.desc ? `<span class="audit-positive-item__desc">${escapeHtml(p.desc)}</span>` : ''}
            </div>
          </div>`).join('');
        posContainer.closest('.audit-issues').style.display = '';
      } else {
        posContainer.closest('.audit-issues').style.display = 'none';
      }
    }

    // URL
    const urlDisplay = document.getElementById('audit-analyzed-url');
    if (urlDisplay) urlDisplay.textContent = data.url || currentUrl;

    show(resultsEl);
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---- Fetch ----

  async function fetchStrategy(url, strategy) {
    const res  = await fetch(`/audit-api.php?url=${encodeURIComponent(url)}&strategy=${strategy}`);
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || 'Erreur inconnue');
    return data;
  }

  async function runAudit(url) {
    currentUrl     = url;
    resultsCache   = { mobile: null, desktop: null };
    activeStrategy = 'mobile';

    hide(resultsEl);
    hide(errorEl);
    formError.classList.remove('is-visible');

    loaderUrl.textContent  = url;
    loaderStep.textContent = 'Analyse mobile en cours…';
    show(loaderEl);

    urlInput.disabled = true;
    const btn = formEl.querySelector('.audit-form__btn');
    btn.disabled = true;

    // Reset desktop tab
    const desktopTab = document.getElementById('tab-desktop');
    if (desktopTab) {
      desktopTab.disabled = true;
      if (!desktopTab.querySelector('.audit-tab__loading')) {
        desktopTab.innerHTML = 'Desktop <span class="audit-tab__loading">…</span>';
      }
    }

    try {
      const mobileData = await fetchStrategy(url, 'mobile');
      resultsCache.mobile = mobileData;

      hide(loaderEl);
      displayResults(mobileData);
      setActiveTab('mobile');

      // Desktop en arrière-plan
      fetchStrategy(url, 'desktop').then(desktopData => {
        resultsCache.desktop = desktopData;
        if (desktopTab) {
          desktopTab.disabled = false;
          desktopTab.textContent = 'Desktop';
        }
      }).catch(() => {
        if (desktopTab) {
          desktopTab.disabled = false;
          desktopTab.textContent = 'Desktop';
        }
      });

    } catch (err) {
      hide(loaderEl);
      errorMsg.textContent = 'Impossible d\'analyser ce site. Vérifiez que l\'URL est accessible publiquement.';
      show(errorEl);
    } finally {
      urlInput.disabled = false;
      btn.disabled = false;
    }
  }

  function setActiveTab(strategy) {
    activeStrategy = strategy;
    document.querySelectorAll('.audit-tab').forEach(t => {
      t.classList.toggle('is-active', t.dataset.strategy === strategy);
    });
    const data = resultsCache[strategy];
    if (data) displayResults(data);
  }

  // ---- Events ----

  formEl.addEventListener('submit', function (e) {
    e.preventDefault();
    const url = normalizeUrl(urlInput.value);
    if (!url) {
      formError.textContent = 'Entrez une URL valide (ex: monsite.ch)';
      show(formError);
      return;
    }
    hide(formError);
    runAudit(url);
  });

  document.querySelectorAll('.audit-tab').forEach(tab => {
    tab.addEventListener('click', function () {
      if (this.disabled) return;
      setActiveTab(this.dataset.strategy);
    });
  });

  document.getElementById('audit-retry-btn')?.addEventListener('click', function () {
    hide(resultsEl);
    hide(errorEl);
    urlInput.value = '';
    urlInput.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.getElementById('audit-error-retry')?.addEventListener('click', function () {
    hide(errorEl);
    urlInput.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- Lead form ----

  leadForm?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const emailInput = leadForm.querySelector('input[type="email"]');
    const submitBtn  = leadForm.querySelector('button[type="submit"]');
    const email      = emailInput.value.trim();
    if (!email) return;

    submitBtn.disabled    = true;
    submitBtn.textContent = 'Envoi…';
    hide(leadErrorEl);

    const body = new FormData();
    body.append('email',      email);
    body.append('url',        currentUrl);
    body.append('score_perf', currentScores.performance  ?? 0);
    body.append('score_seo',  currentScores.seo          ?? 0);
    body.append('score_a11y', currentScores.accessibility ?? 0);
    body.append('score_bp',   currentScores.bestPractices ?? 0);

    try {
      const res  = await fetch('/send-audit-lead.php', { method: 'POST', body });
      const data = await res.json();
      if (data.success) {
        leadForm.style.display = 'none';
        show(leadSuccess);
      } else {
        leadErrorEl.textContent = data.message || 'Erreur lors de l\'envoi.';
        show(leadErrorEl);
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Recevoir le rapport';
      }
    } catch {
      leadErrorEl.textContent = 'Erreur réseau. Réessayez.';
      show(leadErrorEl);
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Recevoir le rapport';
    }
  });

})();
