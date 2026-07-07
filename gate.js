(function() {
  'use strict';
  var PASS = 'oflow2026';
  var KEY = 'optiflows_authed';
  if (sessionStorage.getItem(KEY) === '1') return;

  function init() {
    var styles = document.createElement('style');
    styles.textContent =
      '#of-gate{position:fixed;inset:0;z-index:99999;background:#053d3d;' +
      'display:flex;align-items:center;justify-content:center;font-family:' +
      "'Space Mono',system-ui,-apple-system,sans-serif}" +
      '#of-gate__box{background:#fff;padding:40px 32px;border-radius:12px;' +
      'width:100%;max-width:360px;text-align:center;box-shadow:0 24px 80px rgba(0,0,0,0.35)}' +
      '#of-gate__box h2{margin:0 0 8px;font-size:20px;color:#053d3d}' +
      '#of-gate__box p{margin:0 0 24px;font-size:13px;color:#6b8a8a}' +
      '#of-gate__input{width:100%;padding:12px 14px;font-size:15px;' +
      'border:1.5px solid #c2d1d1;border-radius:8px;outline:none;' +
      'box-sizing:border-box;font-family:inherit;margin-bottom:12px}' +
      '#of-gate__input:focus{border-color:#053d3d}' +
      '#of-gate__btn{width:100%;padding:12px;font-size:14px;font-weight:700;' +
      'color:#fff;background:#053d3d;border:none;border-radius:8px;cursor:pointer;' +
      'font-family:inherit}' +
      '#of-gate__btn:hover{background:#042f2f}' +
      '#of-gate__err{color:#c0392b;font-size:12px;margin-top:10px;min-height:18px}';
    document.head.appendChild(styles);

    var box = document.createElement('div');
    box.id = 'of-gate';
    box.innerHTML =
      '<div id="of-gate__box">' +
      '<h2>OptiFlows</h2>' +
      '<p>Enter password to continue</p>' +
      '<input id="of-gate__input" type="password" placeholder="Password" autocomplete="off" />' +
      '<button id="of-gate__btn" type="button">Enter</button>' +
      '<div id="of-gate__err"></div>' +
      '</div>';
    document.documentElement.style.overflow = 'hidden';

    function unlock() {
      sessionStorage.setItem(KEY, '1');
      document.documentElement.style.overflow = '';
      box.remove();
    }

    function check() {
      var val = input.value.trim();
      var err = box.querySelector('#of-gate__err');
      if (val === PASS) {
        err.textContent = '';
        unlock();
      } else {
        err.textContent = 'Incorrect password. Try again.';
        input.value = '';
        input.focus();
      }
    }

    document.body.appendChild(box);
    var input = box.querySelector('#of-gate__input');
    var btn = box.querySelector('#of-gate__btn');
    btn.addEventListener('click', check);
    input.addEventListener('keydown', function(e) { if (e.key === 'Enter') check(); });
    input.focus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
