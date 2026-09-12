/* ==========================================================================
   intake.js — Secure Client Intake Board
   --------------------------------------------------------------------------
   Handles:
     - Pre-selection of the service tier from a ?service= query parameter
       (set by the "Initiate Case with this Tier" buttons on services.html)
     - Multi-step form navigation with per-step validation
     - Review panel before submission
     - Submission routing to intake@abyssinianintel.com

   ROUTING NOTE
   ------------
   GitHub Pages serves static files only — it cannot run a mail script.
   Two routes are supported below; pick one in CONFIG:

     mode: 'mailto'   (default, zero setup)
       Composes a structured message in the user's mail client, addressed to
       intake@abyssinianintel.com. Nothing is transmitted until the user
       presses send in their own client.

     mode: 'endpoint' (recommended for production)
       POSTs the form as JSON to a third-party form backend (Formspree,
       Basin, Getform, Netlify Forms, Cloudflare Worker, etc.) configured to
       forward to intake@abyssinianintel.com. Set ENDPOINT to your URL.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- CONFIG ---------- */
  var CONFIG = {
    mode: 'endpoint',                              // 'mailto' | 'endpoint'
    endpoint: 'https://formspree.io/f/xeaqwygk',               // e.g. 'https://formspree.io/f/xxxxxxx'
    inbox: 'intake@abyssinianintel.com'
  };

  /* ---------- Service catalogue (keys must match services.html links) ---------- */
  var SERVICES = [
    { key: 'family-reunification',   label: 'Tier 01 — Family & Personal Reunification' },
    { key: 'tenant-vetting',         label: 'Tier 02 — Residential & Commercial Tenant Vetting' },
    { key: 'employee-vetting',       label: 'Tier 03 — Corporate & Small Business Employee Vetting' },
    { key: 'relationship-diligence', label: 'Tier 04 — Relationship & Personal Due Diligence' },
    { key: 'fraud-trace',            label: 'Tier 05 — Digital Fraud Recovery & Trace Assistance' },
    { key: 'custom-osint',           label: 'Tier 06 — Custom OSINT & Bespoke Intelligence' },
    { key: 'unsure',                 label: 'Not sure — please advise which tier applies' }
  ];

  var form, steps, chips, currentStep = 0;

  /* ---------- Populate the service <select> ---------- */
  function populateServices() {
    var sel = document.getElementById('service');
    if (!sel) return;

    SERVICES.forEach(function (s) {
      var opt = document.createElement('option');
      opt.value = s.key;
      opt.textContent = s.label;
      sel.appendChild(opt);
    });

    // Pre-select from ?service=... (set by services.html tier buttons)
    var params = new URLSearchParams(window.location.search);
    var requested = params.get('service');
    if (requested && SERVICES.some(function (s) { return s.key === requested; })) {
      sel.value = requested;
      var flag = document.getElementById('preselect-flag');
      if (flag) {
        flag.hidden = false;
        flag.querySelector('[data-tier-label]').textContent =
          SERVICES.filter(function (s) { return s.key === requested; })[0].label;
      }
    }
  }

  /* ---------- Step navigation ---------- */
  function showStep(i) {
    currentStep = Math.max(0, Math.min(steps.length - 1, i));

    steps.forEach(function (s, n) { s.hidden = n !== currentStep; });
    chips.forEach(function (c, n) {
      c.classList.toggle('is-active', n === currentStep);
      c.classList.toggle('is-done', n < currentStep);
    });

    if (currentStep === steps.length - 1) buildReview();

    // Keep the form head in view when stepping on small screens
    var shell = document.querySelector('.form-shell');
    if (shell && window.scrollY > shell.offsetTop) {
      shell.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* ---------- Validation ---------- */
  function setError(field, message) {
    var box = document.querySelector('[data-err-for="' + field.id + '"]');
    if (!box) return;
    box.textContent = message || '';
    box.hidden = !message;
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function validateStep(i) {
    var ok = true;
    var scope = steps[i];

    scope.querySelectorAll('[data-required]').forEach(function (field) {
      var value = (field.type === 'checkbox') ? field.checked : field.value.trim();

      if (!value) {
        setError(field, field.getAttribute('data-msg') || 'This field is required.');
        ok = false;
        return;
      }
      if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        setError(field, 'Enter a valid email address so we can reach you.');
        ok = false;
        return;
      }
      if (field.id === 'scope' && String(value).length < 40) {
        setError(field, 'Please give us at least a few sentences — a vague scope cannot be assessed.');
        ok = false;
        return;
      }
      setError(field, '');
    });

    if (!ok) {
      var firstBad = scope.querySelector('[aria-invalid="true"]');
      if (firstBad) firstBad.focus();
    }
    return ok;
  }

  /* ---------- Collect values ---------- */
  function collect() {
    var get = function (id) {
      var el = document.getElementById(id);
      if (!el) return '';
      if (el.type === 'checkbox') return el.checked ? 'YES' : 'NO';
      if (el.tagName === 'SELECT') return el.options[el.selectedIndex] ? el.options[el.selectedIndex].text : '';
      return el.value.trim();
    };

    return {
      'Client Name / Organisation Alias': get('client'),
      'Secure Email Contact':             get('email'),
      'Preferred Contact Protocol':       get('protocol'),
      'Service Category':                 get('service'),
      'Jurisdiction / Region':            get('jurisdiction'),
      'Urgency':                          get('urgency'),
      'Case Scope / Objective':           get('scope'),
      'Lawful Purpose & Non-PI Acknowledgement': get('terms-check'),
      'Confidentiality Protocol Acknowledged':   get('privacy')
    };
  }

  /* ---------- Review panel ---------- */
  function buildReview() {
    var dl = document.getElementById('review');
    if (!dl) return;
    var data = collect();

    dl.innerHTML = Object.keys(data).map(function (k) {
      var v = data[k] || '<span class="dim">— not provided —</span>';
      return '<div class="review-line"><dt>' + k + '</dt><dd>' + escapeHtml(v) + '</dd></div>';
    }).join('');
  }

  function escapeHtml(s) {
    // Allow the single dim span we inject above; escape everything else.
    if (/^<span class="dim">/.test(s)) return s;
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  /* ---------- Submission ---------- */
  function buildPlainText(data) {
    var lines = [
      'VANTAGE POINT INVESTIGATIONS — SECURE CASE INTAKE',
      'Submitted: ' + new Date().toISOString(),
      '=================================================',
      ''
    ];
    Object.keys(data).forEach(function (k) {
      lines.push(k.toUpperCase());
      lines.push(data[k] || '—');
      lines.push('');
    });
    lines.push('-------------------------------------------------');
    lines.push('Submitted via abyssinianintel.com secure intake board.');
    lines.push('Client affirms lawful purpose and acknowledges that Vantage Point');
    lines.push('Investigations provides OSINT analysis, not licensed private');
    lines.push('investigation services.');
    return lines.join('\n');
  }

  function submitViaMailto(data) {
    var subject = 'CASE INTAKE — ' + (data['Service Category'] || 'Unspecified Tier') +
                  ' — ' + (data['Client Name / Organisation Alias'] || 'Unnamed');
    var href = 'mailto:' + CONFIG.inbox +
               '?subject=' + encodeURIComponent(subject) +
               '&body=' + encodeURIComponent(buildPlainText(data));
    window.location.href = href;
    showConfirmation('mailto', data);
  }

  function submitViaEndpoint(data) {
    var btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.textContent = 'Transmitting…';

    fetch(CONFIG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Transmission failed (' + res.status + ')');
        showConfirmation('endpoint', data);
      })
      .catch(function () {
        // Fall back to mailto so no submission is ever silently lost.
        btn.disabled = false;
        btn.textContent = 'Transmit Secure Intake';
        submitViaMailto(data);
      });
  }

  function showConfirmation(mode, data) {
    var shell = document.querySelector('.form-shell');
    if (!shell) return;

    var body = (mode === 'mailto')
      ? '<p>Your secure mail client should now be open with the intake brief composed and addressed to ' +
        '<strong>' + CONFIG.inbox + '</strong>. <strong>Press send in that client to complete transmission</strong> — ' +
        'nothing has been sent yet, and nothing has left your device.</p>' +
        '<p class="small dim">If no mail client opened, copy the brief below and send it manually to ' +
        '<a href="mailto:' + CONFIG.inbox + '">' + CONFIG.inbox + '</a>.</p>' +
        '<textarea readonly style="min-height:220px;font-family:var(--font-mono);font-size:.78rem">' +
        escapeHtml(buildPlainText(data)) + '</textarea>'
      : '<p>Your intake brief has been transmitted to <strong>' + CONFIG.inbox + '</strong> and queued for ' +
        'analyst review. You will receive a scoping response, typically within one business day.</p>';

    shell.innerHTML =
      '<div class="notice notice--cyan mb-2"><span class="notice__title">Intake Registered</span>' +
      '<p class="mb-0 small">Reference your submission by the email subject line if you need to follow up.</p></div>' +
      '<h2>Transmission Complete</h2>' + body +
      '<div class="notice mt-2"><span class="notice__title">What Happens Next</span>' +
      '<ol class="small mb-0" style="padding-left:1.2rem">' +
      '<li>An analyst reviews your scope for lawfulness and feasibility — typically within one business day.</li>' +
      '<li>You receive either a written scope and fixed fee, or a plain explanation of why we cannot take the matter on.</li>' +
      '<li>Nothing is invoiced until you approve the written scope in advance.</li>' +
      '</ol></div>' +
      '<div class="btn-row mt-2"><a class="btn btn--ghost" href="index.html">Return to Home</a>' +
      '<a class="btn btn--cyan" href="services.html">Review Service Tiers</a></div>';

    shell.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    form  = document.getElementById('intake-form');
    if (!form) return;

    steps = Array.prototype.slice.call(form.querySelectorAll('.fstep'));
    chips = Array.prototype.slice.call(document.querySelectorAll('.step-chip'));

    populateServices();
    showStep(0);

    // Next / Back buttons
    form.addEventListener('click', function (e) {
      var next = e.target.closest('[data-next]');
      var back = e.target.closest('[data-back]');
      if (next) {
        e.preventDefault();
        if (validateStep(currentStep)) showStep(currentStep + 1);
      }
      if (back) {
        e.preventDefault();
        showStep(currentStep - 1);
      }
    });

    // Clear errors as the user corrects them
    form.addEventListener('input', function (e) {
      if (e.target.matches('[data-required]')) setError(e.target, '');
    });
    form.addEventListener('change', function (e) {
      if (e.target.matches('[data-required]')) setError(e.target, '');
    });

    // Submit
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateStep(currentStep)) return;

      // Re-validate every step before transmitting
      for (var i = 0; i < steps.length; i++) {
        if (!validateStep(i)) { showStep(i); return; }
      }

      var data = collect();
      if (CONFIG.mode === 'endpoint' && CONFIG.endpoint) submitViaEndpoint(data);
      else submitViaMailto(data);
    });
  });
})();