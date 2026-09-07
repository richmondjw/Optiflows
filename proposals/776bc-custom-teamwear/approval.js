
(function(){
  var ENDPOINT = 'https://formspree.io/f/meelyrkd';
  var KEY = 'optiflows-proposal-776bc-teamwear-v1-3-approval';
  var PROPOSAL = 'Custom Teamwear Discovery (776BC), 7 September 2026, v1.3';

  var form = document.getElementById('approvalForm');
  var nameEl = document.getElementById('name');
  var roleEl = document.getElementById('role');
  var dateEl = document.getElementById('date');
  var consentEl = document.getElementById('consent');
  var msg = document.getElementById('msg');
  var submitBtn = document.getElementById('submitBtn');
  var pad = document.getElementById('pad');
  var canvas = document.getElementById('sigpad');
  var ctx = canvas.getContext('2d');
  var hasInk = false, drawing = false, last = null, pendingRecord = null;
  var CONSENT = document.querySelector('label[for=consent]').textContent;

  /* ---- date default: today ---- */
  function pad2(n){ return (n < 10 ? '0' : '') + n; }
  var now = new Date();
  dateEl.value = now.getFullYear() + '-' + pad2(now.getMonth() + 1) + '-' + pad2(now.getDate());

  /* ---- signature pad ---- */
  function setupCanvas(){
    var snapshot = hasInk ? canvas.toDataURL('image/png') : null;
    var r = pad.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#053D3D';
    if (snapshot){
      var im = new Image();
      im.onload = function(){ ctx.drawImage(im, 0, 0, r.width, r.height); };
      im.src = snapshot;
    }
  }
  function pos(e){
    var r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  canvas.addEventListener('pointerdown', function(e){
    e.preventDefault();
    drawing = true; last = pos(e);
    canvas.setPointerCapture(e.pointerId);
    ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(last.x + 0.1, last.y + 0.1); ctx.stroke();
    hasInk = true; pad.classList.add('inked'); pad.classList.remove('invalid');
  });
  canvas.addEventListener('pointermove', function(e){
    if (!drawing) return;
    var p = pos(e);
    ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    last = p;
  });
  function stop(e){ drawing = false; last = null; }
  canvas.addEventListener('pointerup', stop);
  canvas.addEventListener('pointercancel', stop);
  canvas.addEventListener('pointerleave', stop);
  document.getElementById('clearSig').addEventListener('click', function(){
    hasInk = false; pad.classList.remove('inked');
    ctx.save(); ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0,0,canvas.width,canvas.height); ctx.restore();
  });
  setupCanvas();
  var resizeTimer;
  window.addEventListener('resize', function(){ clearTimeout(resizeTimer); resizeTimer = setTimeout(setupCanvas, 150); });

  function exportSignature(){
    var w = 520, h = Math.round(w * canvas.height / canvas.width);
    var off = document.createElement('canvas'); off.width = w; off.height = h;
    off.getContext('2d').drawImage(canvas, 0, 0, w, h);
    return off.toDataURL('image/png');
  }

  /* ---- approval record ---- */
  function fmtDate(iso){
    var d = new Date(iso + 'T00:00:00');
    return isNaN(d) ? iso : d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  function fmtStamp(iso){
    var d = new Date(iso);
    return d.toLocaleString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
  }
  function render(rec){
    document.getElementById('recId').textContent = rec.record_id;
    document.getElementById('recConsent').textContent = rec.consent;
    document.getElementById('recName').textContent = rec.name;
    document.getElementById('recRole').textContent = rec.role || '';
    document.getElementById('recRole').hidden = !rec.role;
    document.getElementById('recDate').textContent = fmtDate(rec.date);
    document.getElementById('recStamp').textContent = fmtStamp(rec.approved_at);
    document.getElementById('recSig').src = rec.signature;
    document.getElementById('approvalRecord').hidden = false;
    document.getElementById('printBlank').hidden = true;
    form.hidden = true;
    document.body.classList.add('is-approved');
    document.getElementById('statusText').textContent = 'Approval submitted ' + fmtDate(rec.date);
    document.title = 'Custom Teamwear Discovery | Approval submitted';
  }
  try {
    var saved = localStorage.getItem(KEY);
    if (saved){ var record = JSON.parse(saved); if(record.proposal === PROPOSAL && record.consent === CONSENT && record.record_id && /^data:image\/png;base64,/.test(record.signature || '')) render(record); }
  } catch(e){}

  form.addEventListener('input', function(){ if (!submitBtn.disabled) pendingRecord = null; });
  canvas.addEventListener('pointerdown', function(){ if (!submitBtn.disabled) pendingRecord = null; });
  document.getElementById('clearSig').addEventListener('click', function(){ pendingRecord = null; });
  /* ---- submit ---- */
  function mark(id, bad){ document.getElementById(id).classList.toggle('invalid', bad); }
  form.addEventListener('submit', function(e){
    e.preventDefault();
    if (submitBtn.disabled) return;
    var name = nameEl.value.trim();
    var bad = false;
    mark('fName', !name); bad = bad || !name;
    mark('fRole', !roleEl.value.trim()); bad = bad || !roleEl.value.trim();
    mark('fDate', !dateEl.value); bad = bad || !dateEl.value;
    pad.classList.toggle('invalid', !hasInk); bad = bad || !hasInk;
    mark('fConsent', !consentEl.checked); bad = bad || !consentEl.checked;
    if (bad){
      msg.className = 'msg';
      msg.textContent = !hasInk ? 'Add your signature to approve.' : 'Complete the highlighted fields to approve.';
      return;
    }
    var rec = pendingRecord || {
      record_id: crypto.randomUUID(),
      proposal_version: '1.3',
      consent: CONSENT,
      scope: 'Four-week Discovery, D1–D4',
      fee_aud_ex_gst: 18000,
      payment_milestones: 'A$9,000 on PMA signing before kickoff; A$9,000 on D1–D4 acceptance',
      approval_type: 'In principle; separate Project Management Agreement required',
      proposal_text: document.body.innerText.split('Approve Discovery in principle')[0],
      proposal: PROPOSAL,
      client: '776BC',
      name: name,
      role: roleEl.value.trim(),
      date: dateEl.value,
      approved_at: new Date().toISOString(),
      signature: exportSignature(),
      page: location.href,
      _subject: 'PROPOSAL APPROVAL IN PRINCIPLE: Custom Teamwear Discovery signed by ' + name
    };
    pendingRecord = rec;
    submitBtn.disabled = true;
    msg.className = 'msg ok';
    msg.textContent = 'Recording your approval...';
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(rec)
    }).then(function(res){
      if (!res.ok) throw new Error('HTTP ' + res.status);
      try { localStorage.setItem(KEY, JSON.stringify(rec)); } catch(err){}
      msg.textContent = '';
      render(rec);
      document.getElementById('approve').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }).catch(function(err){
      submitBtn.disabled = false;
      msg.className = 'msg';
      msg.textContent = 'The approval could not be sent. Check your connection and try again, or email james.richmond@optiflows.com.au.';
    });
  });

  /* ---- PDF ---- */
  var printBtns = document.querySelectorAll('[data-print]');
  for (var i = 0; i < printBtns.length; i++){
    printBtns[i].addEventListener('click', function(){ window.print(); });
  }
})();
