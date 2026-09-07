(function () {
  "use strict";

  const escapeHtml = (value) => String(value == null ? "" : value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[character]));

  const nl2br = (value) => escapeHtml(value).replace(/\n/g, "<br>");

  function emailPlainText(issue) {
    const email = issue.email;
    const lines = [
      `SUBJECT: ${email.subject}`,
      `PREHEADER: ${email.preheader}`,
      "",
      email.kicker,
      email.heading,
      "",
      email.intro
    ];
    (email.paragraphs || []).forEach((paragraph) => lines.push("", paragraph));
    if (email.bullets && email.bullets.length) {
      lines.push("");
      email.bullets.forEach((bullet) => lines.push(`- ${bullet}`));
    }
    (email.blocks || []).forEach((block) => lines.push("", block.title, block.body));
    lines.push("", `BUTTON: ${email.button}`, `DESTINATION: ${email.destination}`);
    (email.textLinks || []).forEach((link) => lines.push(`TEXT LINK: ${link}`));
    lines.push("", ...(email.signoff || []), "", email.footer);
    return lines.join("\n");
  }

  function assetPlainText(asset) {
    const lines = [asset.id, `${asset.channel} | ${asset.format}`, `STATE: ${asset.state}`];
    asset.fields.forEach((field) => lines.push("", `${field.label.toUpperCase()}:`, field.text));
    lines.push("", "RELEASE GATE:", asset.gate);
    return lines.join("\n");
  }

  function renderEmail(issue, index, brand) {
    const email = issue.email;
    const paragraphs = (email.paragraphs || []).map((paragraph) => `<p>${nl2br(paragraph)}</p>`).join("");
    const bullets = email.bullets && email.bullets.length
      ? `<ul>${email.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>`
      : "";
    const blocks = (email.blocks || []).map((block) => `<div class="pcs-email-block"><small>${escapeHtml(block.label || "Field note")}</small><h4>${escapeHtml(block.title)}</h4><p>${nl2br(block.body)}</p></div>`).join("");
    const textLinks = (email.textLinks || []).map((link) => `<span class="pcs-email-text-link">${escapeHtml(link)}</span>`).join("");
    const signoff = (email.signoff || []).map((line) => `<span>${escapeHtml(line)}</span>`).join("");
    const note = email.note ? `<p class="pcs-variant-note"><strong>Production note:</strong> ${escapeHtml(email.note)}</p>` : "";

    return `<article class="pcs-email-issue${index === 0 ? " is-active" : ""}" data-pcs-email="${escapeHtml(issue.id)}">
      <div class="pcs-email-stage">
        <div class="pcs-email-frame" role="document" aria-label="${escapeHtml(issue.title)} email design">
          <span class="pcs-visually-hidden">${escapeHtml(email.preheader)}</span>
          <header class="pcs-email-masthead">
            <div class="pcs-email-brand"><img src="${escapeHtml(brand.icon)}" alt=""><span>${escapeHtml(brand.firstWord)} <strong>${escapeHtml(brand.accentWord)}</strong></span></div>
            <span>${escapeHtml(email.publication || "The Insider Note")}</span>
          </header>
          <div class="pcs-email-issue-line"><span>${escapeHtml(issue.date)}</span><span>${escapeHtml(issue.id)}</span></div>
          <img class="pcs-email-hero" src="${escapeHtml(issue.hero)}" alt="${escapeHtml(issue.heroAlt)}">
          <div class="pcs-email-body">
            <p class="pcs-email-kicker">${escapeHtml(email.kicker)}</p>
            <h3>${escapeHtml(email.heading)}</h3>
            <p class="pcs-email-intro">${nl2br(email.intro)}</p>
            ${paragraphs}${bullets}${blocks}
            <span class="pcs-email-cta">${escapeHtml(email.button)} <b aria-hidden="true">→</b></span>
            ${textLinks}
            <div class="pcs-email-signoff">${signoff}</div>
          </div>
          <div class="pcs-email-footer">${escapeHtml(email.footer)}</div>
        </div>
      </div>
      <aside class="pcs-email-spec">
        <div class="pcs-complete-badge">Complete email copy</div>
        <p class="pcs-email-number">Email ${String(index + 1).padStart(2, "0")} / ${escapeHtml(issue.title)}</p>
        <h3>${escapeHtml(email.subject)}</h3>
        <dl>
          <div><dt>Subject</dt><dd>${escapeHtml(email.subject)}</dd></div>
          <div><dt>Preheader</dt><dd>${escapeHtml(email.preheader)}</dd></div>
          <div><dt>Audience</dt><dd>${escapeHtml(email.audience)}</dd></div>
          <div><dt>Sender</dt><dd>${escapeHtml(email.sender)}</dd></div>
          <div><dt>Primary CTA</dt><dd>${escapeHtml(email.button)}<small>${escapeHtml(email.destination)}</small></dd></div>
          <div><dt>Release gate</dt><dd>${escapeHtml(email.gate)}</dd></div>
        </dl>
        ${note}
        <button class="pcs-copy-action" type="button" data-copy-email="${escapeHtml(issue.id)}">Copy complete email</button>
        <details class="pcs-plain-text"><summary>Plain-text fallback</summary><pre>${escapeHtml(emailPlainText(issue))}</pre></details>
      </aside>
    </article>`;
  }

  function renderAsset(asset) {
    const fields = asset.fields.map((field) => `<div class="pcs-copy-field"><dt>${escapeHtml(field.label)}</dt><dd>${nl2br(field.text)}</dd></div>`).join("");
    return `<details class="pcs-asset-copy">
      <summary>
        <span><small>${escapeHtml(asset.channel)} · ${escapeHtml(asset.format)}</small><strong>${escapeHtml(asset.id)}</strong></span>
        <span class="pcs-copy-state">${escapeHtml(asset.state)}</span>
      </summary>
      <div class="pcs-asset-copy-body"><dl>${fields}</dl><div class="pcs-copy-gate"><strong>Release gate</strong><span>${escapeHtml(asset.gate)}</span></div><button class="pcs-copy-action pcs-copy-action--dark" type="button" data-copy-asset="${escapeHtml(asset.id)}">Copy this asset brief</button></div>
    </details>`;
  }

  function renderIssueRegister(issue) {
    return `<article class="pcs-register-issue">
      <header><div><small>${escapeHtml(issue.label)}</small><h3>${escapeHtml(issue.title)}</h3></div><span>${issue.assets.length}/${issue.assets.length} complete</span></header>
      <div class="pcs-asset-list">${issue.assets.map(renderAsset).join("")}</div>
    </article>`;
  }

  function wireCopyActions(root, data) {
    const emailMap = new Map(data.issues.map((issue) => [issue.id, emailPlainText(issue)]));
    const assetMap = new Map(data.issues.flatMap((issue) => issue.assets.map((asset) => [asset.id, assetPlainText(asset)])));
    const copyText = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch (error) {
        const field = document.createElement("textarea");
        field.value = text;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        document.execCommand("copy");
        field.remove();
      }
    };
    root.querySelectorAll("[data-copy-email]").forEach((button) => button.addEventListener("click", async () => {
      await copyText(emailMap.get(button.dataset.copyEmail));
      const original = button.textContent;
      button.textContent = "Email copied";
      setTimeout(() => { button.textContent = original; }, 1400);
    }));
    root.querySelectorAll("[data-copy-asset]").forEach((button) => button.addEventListener("click", async () => {
      await copyText(assetMap.get(button.dataset.copyAsset));
      const original = button.textContent;
      button.textContent = "Asset copy copied";
      setTimeout(() => { button.textContent = original; }, 1400);
    }));
  }

  function mount(options) {
    const data = options.data;
    const emailRoot = document.getElementById(options.emailRoot);
    const registerRoot = document.getElementById(options.registerRoot);
    if (!data || !emailRoot || !registerRoot) return;

    const assetCount = data.issues.reduce((total, issue) => total + issue.assets.length, 0);
    emailRoot.innerHTML = `<section class="pcs-section pcs-email-studio" aria-labelledby="pcs-email-title">
      <header class="pcs-section-head"><div><p class="pcs-eyebrow">Email production studio</p><h2 id="pcs-email-title">The Insider Note, designed.</h2></div><p>Four complete emails with subject, preheader, body, CTA, accessible hero treatment and plain-text fallback. These are review designs, not send authority.</p></header>
      <div class="pcs-email-toolbar"><div class="pcs-email-tabs" role="tablist" aria-label="Choose email issue">${data.issues.map((issue, index) => `<button type="button" role="tab" data-pcs-email-tab="${escapeHtml(issue.id)}" aria-selected="${index === 0}">${escapeHtml(issue.shortTitle)}</button>`).join("")}</div><div class="pcs-device-toggle" aria-label="Email preview size"><button type="button" data-pcs-device="desktop" aria-pressed="true">Desktop</button><button type="button" data-pcs-device="mobile" aria-pressed="false">Mobile</button></div></div>
      <div class="pcs-email-issues">${data.issues.map((issue, index) => renderEmail(issue, index, data.brand)).join("")}</div>
    </section>`;

    registerRoot.innerHTML = `<section class="pcs-section pcs-copy-register" aria-labelledby="pcs-register-title">
      <header class="pcs-section-head"><div><p class="pcs-eyebrow">Production copy register</p><h2 id="pcs-register-title">Every asset has words.</h2></div><p>The register carries the exact channel job, complete copy, CTA, accessibility treatment and release gate. Nothing relies on a thumbnail or a hidden manuscript reference.</p></header>
      <div class="pcs-register-summary"><div><strong>${assetCount}</strong><span>asset jobs</span></div><div><strong>${assetCount}</strong><span>complete copy sets</span></div><div><strong>0</strong><span>blank production fields</span></div></div>
      <div class="pcs-register-list">${data.issues.map(renderIssueRegister).join("")}</div>
    </section>`;

    emailRoot.querySelectorAll("[data-pcs-email-tab]").forEach((button) => button.addEventListener("click", () => {
      const issueId = button.dataset.pcsEmailTab;
      emailRoot.querySelectorAll("[data-pcs-email-tab]").forEach((tab) => tab.setAttribute("aria-selected", String(tab === button)));
      emailRoot.querySelectorAll("[data-pcs-email]").forEach((issue) => issue.classList.toggle("is-active", issue.dataset.pcsEmail === issueId));
    }));
    emailRoot.querySelectorAll("[data-pcs-device]").forEach((button) => button.addEventListener("click", () => {
      const mobile = button.dataset.pcsDevice === "mobile";
      emailRoot.querySelectorAll("[data-pcs-device]").forEach((control) => control.setAttribute("aria-pressed", String(control === button)));
      emailRoot.classList.toggle("pcs-mobile-preview", mobile);
    }));
    wireCopyActions(emailRoot, data);
    wireCopyActions(registerRoot, data);
  }

  window.PICopyStudio = { mount };
}());
