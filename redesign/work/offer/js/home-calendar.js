/* One calendar instance keeps its month and date when the layout changes. */
window.mountHomeCalendar = main => {
  const U = OFFER;
  const wide = matchMedia('(min-width: 1824px)');
  const desktop = matchMedia('(min-width: 1200px)');
  const header = document.getElementById('site-header');
  const headerActions = header.querySelector('.header-actions');
  headerActions.insertAdjacentHTML('afterbegin', `<button type="button" class="icon-button home-calendar-trigger"
    aria-label="내 캘린더 열기" aria-expanded="false">${U.icon('calendar')}</button>`);
  const trigger = headerActions.querySelector('.home-calendar-trigger');

  const content = document.createElement('div');
  content.className = 'home-content';
  content.append(...main.children);
  main.append(content);
  main.insertAdjacentHTML('beforeend', `<aside class="home-calendar-rail" aria-label="저장한 혜택 일정">
    <button type="button" class="calendar-icon calendar-restore" hidden aria-label="내 캘린더 펼치기"
      aria-controls="home-calendar-panel" aria-expanded="false">${U.icon('calendar')}</button>
  </aside>`);
  document.body.insertAdjacentHTML('beforeend', `
    <dialog id="home-calendar-popover" class="home-calendar-overlay" popover="auto" aria-labelledby="home-calendar-title"></dialog>
    <dialog id="home-calendar-dialog" class="home-calendar-overlay" closedby="any" aria-labelledby="home-calendar-title"></dialog>`);

  const rail = main.querySelector('.home-calendar-rail');
  const restore = rail.querySelector('.calendar-restore');
  const panel = document.createElement('div');
  panel.id = 'home-calendar-panel';
  panel.className = 'home-calendar-panel';
  panel.innerHTML = `<div class="home-calendar-heading">
    <div><p class="eyebrow">MY OFFERS</p><h2 id="home-calendar-title">My Calendar<span class="heading-dot">.</span></h2></div>
    <button type="button" class="calendar-icon calendar-dismiss" aria-label="내 캘린더 접기">
      ${U.icon('close')}
    </button>
  </div>
  <p class="home-calendar-copy">저장한 혜택의 일정을 확인하세요.</p>
  <div id="home-calendar"></div>`;

  const popover = document.getElementById('home-calendar-popover');
  const dialog = document.getElementById('home-calendar-dialog');
  const dismiss = panel.querySelector('.calendar-dismiss');
  const calendar = OfferCalendar.mount(panel.querySelector('#home-calendar'), { mini: true });
  const fullLink = panel.querySelector('.calendar-full-link');
  const scrollArea = document.createElement('div');
  scrollArea.className = 'home-calendar-scroll';
  scrollArea.append(...panel.children);
  panel.append(scrollArea, fullLink);
  const nativePopover = typeof popover.showPopover === 'function';
  const surfaceType = () => wide.matches ? 'rail' : desktop.matches && nativePopover ? 'popover' : 'dialog';
  let collapsed = false;
  let mode;

  function positionPopover() {
    const rect = trigger.getBoundingClientRect();
    popover.style.setProperty('--calendar-overlay-right', Math.max(16, document.documentElement.clientWidth - rect.right) + 'px');
    popover.style.setProperty('--calendar-overlay-top', Math.max(rect.bottom + 10, header.getBoundingClientRect().bottom + 8) + 'px');
  }

  // Keep the rail in the normal page flow whenever the entire panel cannot fit.
  function syncSticky() {
    if (mode !== 'rail') return;
    rail.style.setProperty('--calendar-sticky-top', header.offsetHeight + 20 + 'px');
    const height = collapsed ? restore.offsetHeight : panel.offsetHeight;
    rail.classList.toggle('can-stick', height + header.offsetHeight + 40 <= window.innerHeight);
  }

  function updateRail() {
    if (mode !== 'rail') return;
    panel.hidden = collapsed;
    restore.hidden = !collapsed;
    syncSticky();
  }

  function configure() {
    const next = surfaceType();
    if (mode === next) {
      if (mode === 'popover') positionPopover();
      syncSticky();
      return;
    }
    const focusWasInside = panel.contains(document.activeElement) ||
      document.activeElement === trigger || document.activeElement === restore;
    if (mode === 'popover' && popover.matches(':popover-open')) popover.hidePopover();
    if (dialog.open) dialog.close();
    mode = next;
    const isRail = mode === 'rail';
    const isPopover = mode === 'popover';
    trigger.hidden = isRail;
    trigger.setAttribute('aria-controls', isPopover ? popover.id : dialog.id);
    trigger.setAttribute('aria-expanded', 'false');
    dismiss.toggleAttribute('autofocus', !isRail);
    dismiss.setAttribute('aria-label', isRail ? '내 캘린더 접기' : '내 캘린더 닫기');
    panel.hidden = false;
    restore.hidden = true;
    (isRail ? rail : isPopover ? popover : dialog).append(panel);
    if (isRail) updateRail();
    if (focusWasInside) (isRail ? (collapsed ? restore : dismiss) : trigger).focus({ preventScroll: true });
  }

  trigger.addEventListener('click', () => {
    if (mode === 'popover') {
      if (popover.matches(':popover-open')) popover.hidePopover();
      else {
        positionPopover();
        popover.showPopover({ source: trigger });
        dismiss.focus({ preventScroll: true });
      }
    } else if (mode === 'dialog') {
      dialog.showModal();
      trigger.setAttribute('aria-expanded', 'true');
    }
  });
  dismiss.addEventListener('click', () => {
    if (mode === 'rail') {
      collapsed = true;
      updateRail();
      restore.focus({ preventScroll: true });
    } else if (mode === 'popover') {
      popover.hidePopover();
      trigger.focus({ preventScroll: true });
    } else {
      dialog.close();
    }
  });
  restore.addEventListener('click', () => {
    collapsed = false;
    updateRail();
    dismiss.focus({ preventScroll: true });
  });

  let backdropPressed = false;
  dialog.addEventListener('pointerdown', event => { backdropPressed = event.target === dialog; });
  dialog.addEventListener('pointerup', event => {
    if (backdropPressed && event.target === dialog && !('closedBy' in dialog)) dialog.close();
    backdropPressed = false;
  });
  dialog.addEventListener('close', () => {
    if (mode === 'dialog' && !dialog.open) trigger.setAttribute('aria-expanded', 'false');
  });
  popover.addEventListener('toggle', event => {
    if (mode === 'popover') trigger.setAttribute('aria-expanded', event.newState === 'open');
  });

  const refresh = () => { calendar.refresh(); syncSticky(); };
  document.addEventListener('offer:storage', event => {
    if (event.detail.key === 'savedOffers') refresh();
  });
  document.addEventListener('offer:external-storage', refresh);
  window.addEventListener('resize', configure);
  const observer = new ResizeObserver(syncSticky);
  observer.observe(panel);
  observer.observe(header);
  configure();
};