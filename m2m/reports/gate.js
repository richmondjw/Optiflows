(function () {
  'use strict';

  var password = 'm2m2026';
  var storageKey = 'm2m_reports_access';
  if (sessionStorage.getItem(storageKey) === '1') return;

  function initialise() {
    var style = document.createElement('style');
    style.textContent =
      '#m2m-access-gate{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:24px;background:#f3f7f7;color:#102e34;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}' +
      '#m2m-access-card{width:min(100%,380px);padding:32px;background:#fff;border:1px solid #c9d8d9;border-radius:10px;box-shadow:0 18px 60px rgba(16,46,52,.14)}' +
      '#m2m-access-card h1{margin:0 0 8px;font-size:1.35rem;letter-spacing:-.02em}' +
      '#m2m-access-card p{margin:0 0 22px;color:#587075;font-size:.9rem;line-height:1.5}' +
      '#m2m-access-input{width:100%;box-sizing:border-box;padding:12px;border:1px solid #9fb6b9;border-radius:6px;font:inherit}' +
      '#m2m-access-input:focus{outline:2px solid #00afaa;outline-offset:2px}' +
      '#m2m-access-button{width:100%;margin-top:12px;padding:12px;border:0;border-radius:6px;background:#003640;color:#fff;font:700 .9rem/1 system-ui,-apple-system,"Segoe UI",sans-serif;cursor:pointer}' +
      '#m2m-access-error{min-height:1.3em;margin:10px 0 0;color:#a11d1d;font-size:.8rem}';
    document.head.appendChild(style);

    var gate = document.createElement('section');
    gate.id = 'm2m-access-gate';
    gate.setAttribute('role', 'dialog');
    gate.setAttribute('aria-modal', 'true');
    gate.setAttribute('aria-labelledby', 'm2m-access-title');
    gate.innerHTML = '<div id="m2m-access-card"><h1 id="m2m-access-title">M2M Reports</h1><p>Enter the access password to continue.</p><input id="m2m-access-input" type="password" autocomplete="current-password" placeholder="Password" aria-label="Password"><button id="m2m-access-button" type="button">Continue</button><div id="m2m-access-error" aria-live="polite"></div></div>';
    document.documentElement.style.overflow = 'hidden';
    document.body.appendChild(gate);

    var input = gate.querySelector('#m2m-access-input');
    var error = gate.querySelector('#m2m-access-error');
    function unlock() {
      sessionStorage.setItem(storageKey, '1');
      document.documentElement.style.overflow = '';
      gate.remove();
    }
    function check() {
      if (input.value === password) {
        error.textContent = '';
        unlock();
      } else {
        error.textContent = 'Incorrect password. Try again.';
        input.value = '';
        input.focus();
      }
    }
    gate.querySelector('#m2m-access-button').addEventListener('click', check);
    input.addEventListener('keydown', function (event) { if (event.key === 'Enter') check(); });
    input.focus();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise);
  else initialise();
}());
