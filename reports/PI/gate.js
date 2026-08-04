(function () {
  'use strict';

  // GitHub Pages is static. This is a session gate, not server-side access control.
  var password = 'pi2026';
  var storageKey = 'pi_reports_access';
  if (sessionStorage.getItem(storageKey) === '1') return;

  function initialise() {
    var style = document.createElement('style');
    style.textContent =
      '#pi-access-gate{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:24px;background:#f9f3e8;color:#1a1a1a;font-family:Arial,sans-serif}' +
      '#pi-access-card{width:min(100%,380px);padding:32px;background:#fff;border:1px solid #ddd;border-radius:10px;box-shadow:0 18px 60px rgba(0,0,0,.16)}' +
      '#pi-access-card h1{margin:0 0 8px;font:normal 1.55rem Georgia,serif;color:#2d6a4f}' +
      '#pi-access-card p{margin:0 0 22px;color:#666;font-size:.9rem;line-height:1.5}' +
      '#pi-access-input{width:100%;box-sizing:border-box;padding:12px;border:1px solid #bbb;border-radius:6px;font:inherit}' +
      '#pi-access-input:focus{outline:2px solid #2d6a4f;outline-offset:2px}' +
      '#pi-access-button{width:100%;margin-top:12px;padding:12px;border:0;border-radius:6px;background:#2d6a4f;color:#fff;font:700 .9rem/1 Arial,sans-serif;cursor:pointer}' +
      '#pi-access-error{min-height:1.3em;margin:10px 0 0;color:#a11d1d;font-size:.8rem}';
    document.head.appendChild(style);

    var gate = document.createElement('section');
    gate.id = 'pi-access-gate';
    gate.setAttribute('role', 'dialog');
    gate.setAttribute('aria-modal', 'true');
    gate.setAttribute('aria-labelledby', 'pi-access-title');
    gate.innerHTML = '<div id="pi-access-card"><h1 id="pi-access-title">Peninsula Insider reports</h1><p>Enter the access password to continue.</p><input id="pi-access-input" type="password" autocomplete="current-password" placeholder="Password" aria-label="Password"><button id="pi-access-button" type="button">Continue</button><div id="pi-access-error" aria-live="polite"></div></div>';
    document.documentElement.style.overflow = 'hidden';
    document.body.appendChild(gate);

    var input = gate.querySelector('#pi-access-input');
    var error = gate.querySelector('#pi-access-error');
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
    gate.querySelector('#pi-access-button').addEventListener('click', check);
    input.addEventListener('keydown', function (event) { if (event.key === 'Enter') check(); });
    input.focus();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise);
  else initialise();
}());
