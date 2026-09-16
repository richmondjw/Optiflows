/* First-party lead capture client. It deliberately has no Formspree fallback. */
(function (global) {
  'use strict';

  var allowedFields = ['full_name', 'email', 'company_name', 'message', 'inquiry_type', 'cta_location', 'estimated_annual_drag'];

  function endpoint() {
    var meta = document.querySelector('meta[name="optiflows-lead-api"]');
    return meta && meta.content ? meta.content : '/api/leads';
  }

  function requestId() {
    if (global.crypto && typeof global.crypto.randomUUID === 'function') return global.crypto.randomUUID();
    var bytes = new Uint32Array(4);
    global.crypto.getRandomValues(bytes);
    return Array.prototype.map.call(bytes, function (value) { return value.toString(16); }).join('-');
  }

  function clean(value, limit) {
    return String(value || '').trim().slice(0, limit);
  }

  function payload(form, extra) {
    var data = new FormData(form);
    var lead = {
      idempotency_key: form.dataset.leadCaptureId || requestId(),
      source: clean((extra && extra.source) || global.location.pathname, 256),
      submitted_from: clean(global.location.pathname, 256),
      form_started_at: clean(data.get('form_started_at'), 32),
      utm: {}
    };
    allowedFields.forEach(function (name) {
      var limit = name === 'message' ? 4000 : 256;
      lead[name] = clean(data.get(name), limit);
    });
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function (name) {
      lead.utm[name] = clean(new URLSearchParams(global.location.search).get(name), 256);
    });
    return lead;
  }

  function initialise(form) {
    if (!form) return;
    var started = form.querySelector('input[name="form_started_at"]');
    if (!started) {
      started = document.createElement('input');
      started.type = 'hidden';
      started.name = 'form_started_at';
      form.appendChild(started);
    }
    if (!started.value) started.value = String(Date.now());
    form.dataset.leadCaptureReady = 'true';
  }

  async function submit(form, options) {
    initialise(form);
    if (!form.reportValidity()) throw new Error('validation');
    var body = payload(form, options);
    form.dataset.leadCaptureId = body.idempotency_key;
    var response = await fetch(endpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Idempotency-Key': body.idempotency_key },
      body: JSON.stringify(body),
      credentials: 'omit'
    });
    if (!response.ok) throw new Error('submission_unavailable');
    var result = await response.json();
    if (!result || result.accepted !== true || !result.id) throw new Error('invalid_response');
    delete form.dataset.leadCaptureId;
    return result;
  }

  global.OptiflowsLeadCapture = { initialise: initialise, submit: submit };
})(window);
