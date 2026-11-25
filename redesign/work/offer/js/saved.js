/* The list and calendar both read the same collection of saved offer IDs. */
offerReady.then(() => {
  const U = OFFER;
  const main = document.getElementById('main');
  let filter = 'all';
  let sort = 'ending';
  const statuses = [['all', '전체'], ['active', '진행 중'], ['ending', '마감 임박'], ['upcoming', '예정'], ['ended', '종료']];
  const requestedView = () => new URLSearchParams(location.search).get('view') === 'calendar' ? 'calendar' : 'list';
  let view = requestedView();

  main.innerHTML = `<div class="container page-content saved-page">
    <div class="page-intro collection-heading">
      <div><h1>Saved<span class="heading-dot">.</span></h1><p>저장한 혜택과 프로모션 일정을 한곳에서 관리하세요.</p></div>
    </div>
    <div class="saved-toolbar">
      <p id="saved-count" aria-live="polite"></p>
      <div class="saved-switch" role="group" aria-label="저장한 혜택 보기">
        <button type="button" data-view="list" aria-pressed="false" aria-controls="saved-list">List</button>
        <button type="button" data-view="calendar" aria-pressed="false" aria-controls="saved-calendar">Calendar</button>
      </div>
    </div>
    <div id="saved-list">
      <div class="saved-list-tools">
        <div class="state-filters" id="saved-filters" role="group" aria-label="혜택 진행 상태"></div>
        <label class="saved-sort"><span class="sr-only">정렬</span><select id="saved-sort">
          <option value="ending">마감일 가까운 순</option><option value="recent">최근 저장 순</option>
        </select></label>
      </div>
      <div id="saved-content"></div>
    </div>
    <section id="saved-calendar" aria-label="저장한 혜택 캘린더" hidden></section>
  </div>`;

  const list = document.getElementById('saved-list');
  const calendarRoot = document.getElementById('saved-calendar');
  const calendar = OfferCalendar.mount(calendarRoot);
  const content = document.getElementById('saved-content');
  const filters = document.getElementById('saved-filters');

  function render() {
    const all = U.savedItems();
    document.getElementById('saved-count').textContent = `저장한 혜택 ${all.length}개`;
    main.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', button.dataset.view === view));
    list.hidden = view !== 'list';
    calendarRoot.hidden = view !== 'calendar';
    if (view === 'calendar') {
      calendar.refresh();
      return;
    }
    const visible = all.filter(offer => U.matchesState(offer, filter));
    if (sort === 'ending') visible.sort(U.byDeadline);
    filters.innerHTML = statuses.map(([key, label]) => `<button class="filter" type="button" data-state="${key}" aria-pressed="${key === filter}">${label} <span>${all.filter(offer => U.matchesState(offer, key)).length}</span></button>`).join('');
    content.innerHTML = visible.length ? U.grid(visible, false, 'saved') : all.length ?
      '<div class="empty-state"><div><h3>이 상태의 저장한 혜택이 없어요.</h3><p>전체 목록에서 저장한 혜택을 확인할 수 있어요.</p></div><button class="button button-primary" type="button" data-show-all>전체 저장 보기</button></div>' :
      U.empty('아직 저장한 혜택이 없어요.', '혜택 카드의 북마크를 눌러 여기에 모아보세요.');
  }

  const activeView = () => main.querySelector('[data-view][aria-pressed="true"]');
  const selectFilter = key => {
    filter = key;
    render();
    filters.querySelector(`[data-state="${key}"]`).focus();
  };

  main.querySelector('.saved-switch').addEventListener('click', event => {
    const button = event.target.closest('[data-view]');
    if (!button || button.dataset.view === view) return;
    view = button.dataset.view;
    const url = new URL(location.href);
    if (view === 'calendar') url.searchParams.set('view', 'calendar');
    else url.searchParams.delete('view');
    history.replaceState(history.state, '', url);
    render();
  });
  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-state]');
    if (button) selectFilter(button.dataset.state);
  });
  content.addEventListener('click', event => {
    if (event.target.closest('[data-show-all]')) selectFilter('all');
  });
  document.getElementById('saved-sort').addEventListener('change', event => {
    sort = event.target.value;
    render();
  });

  function update() {
    const focus = document.activeElement;
    const saves = [...content.querySelectorAll('[data-save]')];
    const index = saves.indexOf(focus);
    const state = filters.contains(focus) ? focus.dataset.state : null;
    const href = content.contains(focus) ? focus.getAttribute('href') : null;
    const inList = content.contains(focus);
    render();
    if (index !== -1) {
      const next = [...content.querySelectorAll('[data-save]')];
      (next.find(button => button.dataset.save === focus.dataset.save) ||
        next[Math.min(index, next.length - 1)] || content.querySelector('.button') || activeView()).focus();
    } else if (state) {
      filters.querySelector(`[data-state="${state}"]`)?.focus();
    } else if (inList) {
      ([...content.querySelectorAll('a')].find(link => link.getAttribute('href') === href) ||
        content.querySelector('.button') || activeView()).focus();
    }
  }

  document.addEventListener('offer:storage', event => {
    if (event.detail.key === 'savedOffers') update();
  });
  document.addEventListener('offer:external-storage', update);
  window.addEventListener('popstate', () => { view = requestedView(); render(); });
  render();
});