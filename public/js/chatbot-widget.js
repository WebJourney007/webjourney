(function () {
  'use strict';

  var WA_URL = 'https://wa.me/41768445869';

  var style = document.createElement('style');
  style.textContent = `
    .wj-wa-btn {
      position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9998;
      width: 56px; height: 56px; border-radius: 50%;
      background: #25D366;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 24px rgba(0,0,0,0.18);
      transition: transform 0.2s, box-shadow 0.2s;
      text-decoration: none;
    }
    .wj-wa-btn:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(0,0,0,0.24); }
    .wj-wa-btn svg { width: 32px; height: 32px; }
    @media (max-width: 480px) {
      .wj-wa-btn { right: 0.75rem; bottom: 1rem; }
    }
  `;
  document.head.appendChild(style);

  var btn = document.createElement('a');
  btn.href = WA_URL;
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.className = 'wj-wa-btn';
  btn.setAttribute('aria-label', 'Nous contacter sur WhatsApp');
  btn.innerHTML = `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.5L4 29l7.75-1.812A11.94 11.94 0 0 0 16 28c6.627 0 12-5.373 12-12S22.627 3 16 3Z" fill="#fff"/>
    <path d="M16 5.5c-5.247 0-9.5 4.253-9.5 9.5 0 2.01.627 3.873 1.695 5.41l.195.284-1.07 3.936 4.037-1.057.273.162A9.46 9.46 0 0 0 16 24.5c5.247 0 9.5-4.253 9.5-9.5S21.247 5.5 16 5.5Zm5.02 13.478c-.213.598-1.234 1.144-1.71 1.216-.437.065-.99.092-1.597-.1-.368-.12-.84-.28-1.443-.548-2.535-1.095-4.19-3.64-4.315-3.81-.125-.17-1.02-1.357-1.02-2.588 0-1.23.645-1.836.874-2.086a.924.924 0 0 1 .67-.315c.166 0 .332.003.477.01.153.007.358-.058.56.427.208.498.706 1.728.768 1.853.063.125.104.27.02.436-.083.166-.125.269-.248.415-.124.146-.26.326-.37.438-.124.124-.253.258-.109.506.145.248.643 1.06 1.38 1.717.948.843 1.748 1.104 1.997 1.228.248.124.393.104.538-.062.145-.167.622-.726.788-.976.166-.249.332-.207.559-.124.228.083 1.45.684 1.698.808.249.124.414.186.477.29.062.103.062.598-.15 1.195Z" fill="#25D366"/>
  </svg>`;

  document.body.appendChild(btn);

  btn.addEventListener('click', function () {
    if (typeof fbq === 'function') fbq('track', 'Contact');
  });

})();
