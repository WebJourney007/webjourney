(function () {
  'use strict';

  // Sur chatbot.webjourney.ch : même origine. Sur webjourney.ch : appeler le sous-domaine.
  var host = typeof window !== 'undefined' && window.location && window.location.hostname ? window.location.hostname : '';
  var API_URL = (host === 'chatbot.webjourney.ch' || host === 'localhost' || host === '127.0.0.1')
    ? '/api/chat'
    : 'https://chatbot.webjourney.ch/api/chat';

  function byId(id) {
    return document.getElementById(id);
  }

  function createEl(tag, className, content) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (content !== undefined) el.textContent = content;
    return el;
  }

  function appendMessage(container, role, text, isError) {
    var msg = createEl('div', 'wj-chat-msg ' + (isError ? 'error' : role));
    var label = createEl('div', 'label', role === 'user' ? 'Vous' : 'Web Journey');
    var body = createEl('div', '', text);
    msg.appendChild(label);
    msg.appendChild(body);
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  function setLoading(loading) {
    var sendBtn = byId('wj-chat-send');
    var input = byId('wj-chat-input');
    if (sendBtn) {
      sendBtn.disabled = loading;
      sendBtn.setAttribute('aria-busy', loading ? 'true' : 'false');
    }
    if (input) input.disabled = loading;
  }

  function openPanel() {
    var panel = byId('wj-chat-panel');
    if (panel) panel.classList.add('is-open');
  }

  function closePanel() {
    var panel = byId('wj-chat-panel');
    if (panel) panel.classList.remove('is-open');
  }

  function togglePanel() {
    var panel = byId('wj-chat-panel');
    if (panel && panel.classList.contains('is-open')) closePanel();
    else openPanel();
  }

  function sendMessage() {
    var input = byId('wj-chat-input');
    var messagesEl = byId('wj-chat-messages');
    if (!input || !messagesEl) return;

    var text = (input.value || '').trim();
    if (!text) return;

    input.value = '';
    appendMessage(messagesEl, 'user', text);
    setLoading(true);

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error(data.error || 'Erreur technique.');
          return data;
        });
      })
      .then(function (data) {
        appendMessage(messagesEl, 'bot', data.answer || '');
      })
      .catch(function (err) {
        appendMessage(messagesEl, 'bot', (err && err.message) || 'Erreur technique. Veuillez réessayer.', true);
      })
      .finally(function () {
        setLoading(false);
      });
  }

  function bootstrap() {
    var trigger = byId('wj-chat-trigger');
    var panel = byId('wj-chat-panel');
    var form = byId('wj-chat-form');
    var input = byId('wj-chat-input');
    var sendBtn = byId('wj-chat-send');

    if (trigger) {
      trigger.addEventListener('click', togglePanel);
      trigger.setAttribute('aria-label', 'Ouvrir le chat');
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        sendMessage();
      });
    }

    if (sendBtn) sendBtn.addEventListener('click', sendMessage);

    if (input) {
      input.setAttribute('placeholder', 'Posez votre question…');
      input.setAttribute('aria-label', 'Message');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
