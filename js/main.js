/**
 * Manna Home Care: main site behaviour
 * - WhatsApp link helper (all links already have working hrefs in the HTML;
 *   this keeps any [data-wa] link in sync with the shared message list)
 * - Contact form validation → formatted WhatsApp message
 * - Footer year
 */
(() => {
  'use strict';

  const WHATSAPP_NUMBER = '918157087549';

  const MESSAGES = {
    general: 'Hello Manna Home Care, I would like to know more about your home healthcare services.',
    nursing: 'Hello Manna Home Care, I am interested in nursing and patient care services.',
    gda: 'Hello Manna Home Care, I would like to enquire about GDA staffing services.',
    doctor: 'Hello Manna Home Care, I would like to enquire about a doctor home visit.',
    physio: 'Hello Manna Home Care, I am interested in home physiotherapy services.',
    baby: 'Hello Manna Home Care, I would like to know more about your baby care services.',
    equipment:
      'Hello Manna Home Care, I would like to enquire about medical equipment availability and rental options.',
  };

  const waUrl = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  /* ---------- WhatsApp links ---------- */
  document.querySelectorAll('[data-wa]').forEach((link) => {
    const message = MESSAGES[link.dataset.wa] || MESSAGES.general;
    link.href = waUrl(message);
    link.target = '_blank';
    link.rel = 'noopener';
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Contact form ---------- */
  const form = document.getElementById('enquiry-form');
  if (!form) return;

  const status = document.getElementById('form-status');
  const fields = {
    name: form.elements.namedItem('name'),
    phone: form.elements.namedItem('phone'),
    service: form.elements.namedItem('service'),
    location: form.elements.namedItem('location'),
    details: form.elements.namedItem('details'),
  };

  // Pre-select a service when arriving from a link such as contact.html?service=nursing
  const SERVICE_PARAM = {
    nursing: 'Nursing & Patient Care',
    gda: 'GDA Staffing',
    doctor: 'Doctor Home Visit',
    physio: 'Home Physiotherapy',
    baby: 'Baby Care',
    equipment: 'Medical Equipment',
  };
  const requested = new URLSearchParams(window.location.search).get('service');
  if (requested && SERVICE_PARAM[requested]) fields.service.value = SERVICE_PARAM[requested];

  const normalisePhone = (value) => value.replace(/[\s\-().]/g, '');

  // Accepts Indian numbers (10 digits, optional +91 / 91 / 0 prefix) and
  // other international numbers written with a leading +.
  const isValidPhone = (value) => {
    const v = normalisePhone(value);
    return /^(?:\+?91|0)?[6-9]\d{9}$/.test(v) || /^\+\d{8,15}$/.test(v);
  };

  const validators = {
    name: (v) => (v.trim().length >= 2 ? '' : 'Please enter your full name.'),
    phone: (v) => {
      if (!v.trim()) return 'Please enter a phone number we can reach you on.';
      return isValidPhone(v) ? '' : 'Please enter a valid phone number, e.g. 98XXXXXXXX or +91 98XXXXXXXX.';
    },
    service: (v) => (v ? '' : 'Please choose the service you need.'),
    location: (v) => (v.trim().length >= 2 ? '' : 'Please tell us the patient’s area or locality.'),
  };

  function showError(name, message) {
    const input = fields[name];
    const error = document.getElementById(`${name}-error`);
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (error) {
      error.textContent = message;
      error.classList.toggle('is-visible', Boolean(message));
    }
  }

  function validateField(name) {
    const message = validators[name](fields[name].value);
    showError(name, message);
    return !message;
  }

  // Validate on blur, and re-validate live once a field has shown an error
  Object.keys(validators).forEach((name) => {
    const input = fields[name];
    input.addEventListener('blur', () => {
      if (input.value.trim() !== '' || input.getAttribute('aria-invalid') === 'true') validateField(name);
    });
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') validateField(name);
    });
    input.addEventListener('change', () => {
      if (input.getAttribute('aria-invalid') === 'true') validateField(name);
    });
  });

  function buildMessage() {
    const lines = [
      'Hello Manna Home Care, I would like to enquire about home healthcare support.',
      '',
      `*Name:* ${fields.name.value.trim()}`,
      `*Phone:* ${fields.phone.value.trim()}`,
      `*Service required:* ${fields.service.value}`,
      `*Patient location:* ${fields.location.value.trim()}`,
    ];
    const details = fields.details.value.trim();
    if (details) lines.push(`*Requirements:* ${details}`);
    lines.push('', 'Sent from the Manna Home Care website.');
    return lines.join('\n');
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.hidden = true;

    const invalid = Object.keys(validators).filter((name) => !validateField(name));
    if (invalid.length) {
      fields[invalid[0]].focus();
      return;
    }

    const url = waUrl(buildMessage());
    // ('noopener' in the features string would make window.open return null,
    //  so detach the opener manually instead.)
    const opened = window.open(url, '_blank');
    if (opened) opened.opener = null;

    status.innerHTML =
      'Thank you! WhatsApp should now be open with your message ready. Just press <strong>Send</strong>. ' +
      `If it didn’t open, <a href="${url}" target="_blank" rel="noopener">tap here to continue on WhatsApp</a>.`;
    status.hidden = false;

    // Popup blocked (some in-app browsers): continue in the same tab
    if (!opened) window.location.href = url;
  });
})();
