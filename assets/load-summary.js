(() => {
  'use strict';

  const form = document.getElementById('loadSummaryForm');
  if (!form) return;

  const status = document.getElementById('loadWorksheetStatus');
  const toast = document.getElementById('loadSummaryToast');
  const whatsappNumber = '919823012044';

  const clean = (value, fallback = 'Not provided') => {
    const normalized = String(value || '').replace(/\s+/g, ' ').trim();
    return normalized || fallback;
  };

  const fieldValue = (name, fallback) => {
    const field = form.elements.namedItem(name);
    return clean(field ? field.value : '', fallback);
  };

  const announce = (message) => {
    if (status) status.textContent = message;
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(announce.timer);
    announce.timer = window.setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3600);
  };

  form.addEventListener('invalid', () => {
    announce('Please complete the highlighted required fields before preparing the summary.');
  }, true);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      announce('Please complete the highlighted required fields before preparing the summary.');
      form.reportValidity();
      return;
    }

    const lines = [
      'Hello Venkatesh Bhat,',
      '',
      'I would like an engineering review of this generator load summary.',
      '',
      'LOAD SUMMARY',
      `Application / facility: ${fieldValue('application')}`,
      `Site location: ${fieldValue('location')}`,
      `Known running load: ${fieldValue('running_load', 'Not known yet')}`,
      `Largest motor or starting load: ${fieldValue('largest_motor', 'Not known yet')}`,
      `Start method: ${fieldValue('start_method', 'Not sure')}`,
      `Intended duty: ${fieldValue('duty')}`,
      `Future expansion: ${fieldValue('expansion', 'Not specified')}`,
      `AMF / changeover requirement: ${fieldValue('amf')}`,
      `Additional notes: ${fieldValue('notes', 'None provided')}`,
      '',
      'I understand this worksheet does not calculate or recommend generator kVA. Final selection requires engineering review of the load, starting behaviour, duty and site conditions.'
    ];

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
    const reviewLink = document.createElement('a');
    reviewLink.href = whatsappUrl;
    reviewLink.target = '_blank';
    reviewLink.rel = 'noopener noreferrer';
    reviewLink.click();

    announce('Your load summary is ready to review in WhatsApp. Nothing was stored or sent by this website.');
  });
})();
