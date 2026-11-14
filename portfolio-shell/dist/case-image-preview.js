/* Progressive image previews for existing CAFEKOK and OFFER figures.
   No image URLs are created or replaced; originals remain authoritative. */
(() => {
  'use strict';
  const groups = [
    { selector: '#screens figure.ed-phone', name: '카페콕' },
    { selector: '#responsive .ed-devices figure', name: 'OFFER' },
  ];
  const figures = groups.flatMap(group => Array.from(document.querySelectorAll(group.selector))
    .map(figure => ({ figure, name: group.name })));
  if (!figures.length || typeof HTMLDialogElement === 'undefined') return;
  const dialog = document.createElement('dialog');
  dialog.className = 'case-preview-dialog';
  dialog.setAttribute('aria-label', '프로토타입 화면 확대');
  dialog.innerHTML = '<div class="case-preview-heading"><p class="case-preview-title" id="case-preview-label"></p><button type="button" class="case-preview-close" aria-label="확대 화면 닫기">×</button></div><div class="case-preview-content"><img class="case-preview-image" alt=""><p class="case-preview-message" role="status" hidden></p></div>';
  document.body.appendChild(dialog);
  const heading = dialog.querySelector('.case-preview-title');
  const image = dialog.querySelector('.case-preview-image');
  const message = dialog.querySelector('.case-preview-message');
  const close = dialog.querySelector('.case-preview-close');
  let trigger = null;
  const reset = () => { image.removeAttribute('src'); image.alt = ''; image.hidden = false; message.hidden = true; message.textContent = ''; };
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { reset(); if (trigger && trigger.isConnected) trigger.focus(); trigger = null; });
  for (const {figure, name} of figures) {
    const source = figure.querySelector('img');
    if (!source || !source.getAttribute('src') || figure.querySelector('.case-preview-cta')) continue;
    const caption = figure.querySelector('figcaption');
    const label = (caption?.textContent || source.alt || `${name} 화면`).trim();
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'case-preview-cta';
    button.textContent = '화면 크게 보기 ↗';
    button.setAttribute('aria-label', `${label} 화면 확대`);
    button.addEventListener('click', () => {
      trigger = button;
      reset();
      heading.textContent = label;
      image.alt = source.alt || label;
      image.onload = () => { image.hidden = false; message.hidden = true; };
      image.onerror = () => { image.hidden = true; message.hidden = false; message.textContent = '이미지를 불러오지 못했습니다. 원본 화면에서 이미지 경로를 확인해 주세요.'; };
      dialog.showModal();
      image.src = source.currentSrc || source.src;
      close.focus();
    });
    figure.appendChild(button);
  }
})();
