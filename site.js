/* ================== CONFIG ================== */
// Paste your Google Apps Script Web App URL here (see apps-script.gs for the setup steps)
const SHEET_WEB_APP_URL = '';
const WA_NUMBER = '201027058317';

/* ================== Send lead to Google Sheet ================== */
async function sendToSheet(payload) {
  if (typeof gtag === 'function') gtag('event', 'generate_lead', { event_category: 'Registration', event_label: payload.source });
  if (!SHEET_WEB_APP_URL) {
    console.error('SHEET_WEB_APP_URL is empty — set it in site.js so leads reach your Google Sheet.');
    throw new Error('not-configured');
  }
  // text/plain + no-cors avoids the CORS preflight that Apps Script does not answer
  await fetch(SHEET_WEB_APP_URL, {
    method: 'POST', mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(Object.assign({ timestamp: new Date().toISOString(), page: location.pathname }, payload))
  });
}

function setBusy(btn, busy, label) {
  if (!btn) return;
  if (busy) { btn.dataset.label = btn.innerHTML; btn.disabled = true; btn.style.opacity = .7; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...'; }
  else { btn.disabled = false; btn.style.opacity = 1; btn.innerHTML = label || btn.dataset.label; }
}
function showFormError(form) {
  let box = form.querySelector('.form-error');
  if (!box) { box = document.createElement('p'); box.className = 'form-error text-sm text-it_red mt-3 text-center'; form.appendChild(box); }
  box.innerHTML = 'Something went wrong. Please try again or <a class="underline font-bold" target="_blank" href="https://wa.me/' + WA_NUMBER + '">message us on WhatsApp</a>.';
}
function clearFormError(form) { const b = form.querySelector('.form-error'); if (b) b.remove(); }

/* ================== Register modal ================== */
function openModal(id) {
  const m = document.getElementById(id); if (!m) return;
  m.classList.remove('opacity-0', 'pointer-events-none');
  m.querySelector('#modal-content').classList.remove('scale-95');
  const s = document.getElementById('register-success'); s.classList.add('hidden'); s.classList.remove('flex');
  const f = m.querySelector('form'); f.reset(); clearFormError(f);
}
function closeModal(id) {
  const m = document.getElementById(id); if (!m) return;
  m.classList.add('opacity-0', 'pointer-events-none');
  m.querySelector('#modal-content').classList.add('scale-95');
}
async function handleRegistration(e) {
  e.preventDefault();
  const form = e.target, btn = form.querySelector('button[type=submit]');
  clearFormError(form); setBusy(btn, true);
  try {
    await sendToSheet({ source: 'Register Modal', name: form.elements.name.value, email: form.elements.email.value, phone: form.elements.phone.value, interest: form.elements.interest ? form.elements.interest.value : '' });
    const s = document.getElementById('register-success'); s.classList.remove('hidden'); s.classList.add('flex'); form.reset();
  } catch (err) { showFormError(form); }
  setBusy(btn, false);
}
async function handleEligibility(e) {
  e.preventDefault();
  const form = e.target, btn = form.querySelector('button[type=submit]');
  clearFormError(form); setBusy(btn, true);
  try {
    await sendToSheet({ source: 'Eligibility Form', name: form.elements.name.value, phone: form.elements.phone.value, gpa: form.elements.gpa.value, major: form.elements.major.value });
    const s = document.getElementById('eligibility-success'); s.classList.remove('hidden'); s.classList.add('flex'); form.reset();
  } catch (err) { showFormError(form); }
  setBusy(btn, false);
}

/* ================== Page behaviours ================== */
function initReveal() {
  const obs = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('active'); obs.unobserve(en.target); } }), { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  window._revealObs = obs;
}
function observeNewReveals(root) { (root || document).querySelectorAll('.reveal:not(.active)').forEach(el => window._revealObs && window._revealObs.observe(el)); }

document.addEventListener('DOMContentLoaded', () => {
  initReveal();

  const nav = document.querySelector('.site-nav');
  if (nav) { const f = () => nav.classList.toggle('scrolled', window.scrollY > 40); f(); window.addEventListener('scroll', f, { passive: true }); }

  const burger = document.getElementById('burger'), mobile = document.getElementById('mobile-menu');
  if (burger && mobile) {
    burger.addEventListener('click', () => mobile.classList.toggle('hidden'));
    mobile.querySelectorAll('a,button').forEach(a => a.addEventListener('click', () => mobile.classList.add('hidden')));
  }

  const modal = document.getElementById('register-modal');
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal('register-modal'); });

  // counters
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    let done = false;
    const co = new IntersectionObserver(es => {
      if (es[0].isIntersecting && !done) {
        done = true;
        counters.forEach(c => {
          const target = +c.dataset.target, inc = target / (2000 / 16); let cur = 0;
          (function tick() { cur += inc; if (cur < target) { c.innerText = Math.ceil(cur); requestAnimationFrame(tick); } else c.innerText = target; })();
        });
      }
    }, { threshold: .5 });
    co.observe(counters[0]);
  }

  // FAQ
  document.querySelectorAll('.faq-btn').forEach(btn => btn.addEventListener('click', () => {
    const content = btn.nextElementSibling, icon = btn.querySelector('i'), wasOpen = !!content.style.maxHeight;
    document.querySelectorAll('.faq-content').forEach(el => el.style.maxHeight = null);
    document.querySelectorAll('.faq-btn i').forEach(el => el.classList.remove('rotate-45'));
    if (!wasOpen) { content.style.maxHeight = content.scrollHeight + 'px'; icon.classList.add('rotate-45'); }
  }));

  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal('register-modal'); if (window.closeUni) closeUni(); } });
});
