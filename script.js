/* ============================================================
   Общий скрипт для всех страниц
   ============================================================ */

/* --- мобильное меню --- */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

function toggleMenu(force){
  if (!burger || !mobileMenu) return;
  const open = force !== undefined ? force : !mobileMenu.classList.contains('open');
  mobileMenu.classList.toggle('open', open);
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
}

if (burger && mobileMenu){
  burger.addEventListener('click', () => toggleMenu());
  mobileMenu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => toggleMenu(false))
  );
}

/* --- тень у шапки при скролле --- */
const header = document.getElementById('header');
if (header){
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12);
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
}

/* --- появление блоков при скролле --- */
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length){
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, {threshold:0.12, rootMargin:'0px 0px -40px'});
  revealEls.forEach(el => observer.observe(el));
}

/* --- форма записи: собираем заявку и открываем WhatsApp ---
   Номер берётся из data-whatsapp на самой форме (contacts.html).
   Указывать только цифры, без + и пробелов.
*/
const form = document.getElementById('bookingForm');
if (form){
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const number = (form.dataset.whatsapp || '').replace(/\D/g, '');
    const val = (id) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };

    const lines = [
      'Заявка с сайта',
      '',
      'Имя: ' + val('name'),
      'Телефон: ' + val('phone'),
      'Процедура: ' + val('service'),
    ];
    const comment = val('comment');
    if (comment) lines.push('Комментарий: ' + comment);

    const ok = document.getElementById('formOk');
    if (ok) ok.classList.add('show');

    if (!number) return; // номер не задан — просто показываем подтверждение

    const url = 'https://wa.me/' + number + '?text=' + encodeURIComponent(lines.join('\n'));
    const win = window.open(url, '_blank');
    if (win) {
      win.opener = null;
    } else {
      window.location.href = url; // если всплывающее окно заблокировано
    }
  });
}
