/* Dates are UTC day coordinates for KST civil dates, with inclusive offer ranges. */
window.OfferCalendar = (() => {
  const U = OFFER;
  const DAY = 86_400_000;
  const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
  const iso = day => new Date(day).toISOString().slice(0, 10);
  const format = (options) => new Intl.DateTimeFormat('ko-KR', { timeZone: 'UTC', ...options });
  const monthLabel = format({ year: 'numeric', month: 'long' });
  const dateLabel = format({ year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  const detailLabel = format({ month: 'long', day: 'numeric', weekday: 'long' });
  const monthStart = day => U.day(iso(day).slice(0, 7) + '-01');
  const monthAt = (day, offset) => {
    const date = new Date(day);
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + offset, 1);
  };
  const weekday = day => new Date(day).getUTCDay();
  const atDate = (offer, day) => U.day(offer.period.start) <= day && U.day(offer.period.end) >= day;
  const offerLink = offer => 'offer.html?id=' + encodeURIComponent(offer.id);
  const fullDate = date => `<time datetime="${date}">${date.replaceAll('-', '.')}</time>`;
  const iconButton = (action, label, icon) => `<button class="calendar-icon" type="button" data-action="${action}" aria-label="${label}">${U.icon(icon)}</button>`;

  function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
    const day = U.day(value);
    return iso(day) === value ? day : null;
  }

  function weekStarts(month, mini) {
    const first = month - weekday(month) * DAY;
    const next = monthAt(month, 1);
    const count = mini ? 6 : Math.ceil((next - first) / (7 * DAY));
    return Array.from({ length: count }, (_, index) => first + index * 7 * DAY);
  }

  function weekEvents(week, offers) {
    const last = week + 6 * DAY;
    const items = offers.map(offer => ({
      offer, from: U.day(offer.period.start), to: U.day(offer.period.end)
    })).filter(({ from, to }) => from <= last && to >= week);

    // The same sort order prioritizes continuous bars across adjacent weeks.
    items.sort((a, b) => a.from - b.from || b.to - a.to || U.byDeadline(a.offer, b.offer));
    const ends = [];
    const overflow = Array(7).fill(0);
    const visible = [];
    for (const item of items) {
      const start = Math.max(0, (item.from - week) / DAY);
      const end = Math.min(6, (item.to - week) / DAY);
      let lane = ends.findIndex(previousEnd => previousEnd < start);
      if (lane === -1) lane = ends.length;
      ends[lane] = end;
      if (lane >= 3) {
        for (let index = start; index <= end; index++) overflow[index]++;
        continue;
      }
      visible.push({ ...item, start, end, lane, last, week });
    }
    return { visible, overflow, lanes: Math.min(3, ends.length) };
  }

  function eventBar({ offer, start, end, lane, from, to, week, last }) {
    const tone = U.state(offer) === 'ended' ? ' is-ended' : U.status(offer).urgent ? ' is-urgent' : '';
    const continuation = (from < week ? ' continues-before' : '') + (to > last ? ' continues-after' : '');
    const name = U.escape(offer.brandName + ' · ' + offer.title);
    return `<a class="calendar-event${tone}${continuation}" href="${offerLink(offer)}"
      style="--event-start:${start + 1};--event-end:${end + 2};--event-row:${lane + 2}"
      aria-label="${name}, ${offer.period.start} ~ ${offer.period.end}"
      title="${name} · ${offer.period.start} – ${offer.period.end}">
      <span><b>${U.escape(offer.brandName)}</b> · ${U.escape(offer.title)}</span></a>`;
  }

  function closestSchedule(offers, day) {
    const nearest = offer => Math.min(Math.max(day, U.day(offer.period.start)), U.day(offer.period.end));
    return offers.map(nearest).reduce((closest, candidate) =>
      Math.abs(candidate - day) < Math.abs(closest - day) ? candidate : closest);
  }

  function offerRows(offers, mini) {
    return `<ul class="calendar-offers">${[...offers].sort(U.byDeadline).map(offer => {
      const brand = OFFER_DATA.brands.find(item => item.id === offer.brandId);
      const name = U.escape(offer.brandName);
      const title = U.escape(offer.title);
      const upcoming = U.state(offer) === 'upcoming';
      return `<li class="calendar-offer">
        ${brand ? U.brandLogo(brand) : ''}
        <div class="calendar-offer-info">
          <span class="calendar-offer-brand">${name}</span>
          <a href="${offerLink(offer)}">${title}</a>
          <p>${mini ? '종료 ' + fullDate(offer.period.end) :
            '<strong>' + U.escape(offer.discount.label) + '</strong> · ' +
            fullDate(offer.period.start) + ' – ' + fullDate(offer.period.end)}</p>
        </div>
        ${upcoming ? '<span class="status">예정 · D-' + U.remaining(offer) + '</span>' : U.badge(offer)}
        ${U.saveButton(offer)}
      </li>`;
    }).join('')}</ul>`;
  }

  function mount(root, { mini = false } = {}) {
    const initial = mini ? null : validDate(new URLSearchParams(location.search).get('date')) ?? U.today();
    let selected = initial;
    let month = monthStart(initial ?? U.today());
    let focusedDay = selected ?? U.today();
    const titleId = root.id + '-month';
    const detailsId = root.id + '-details';
    const calendarHref = 'saved.html?view=calendar';
    root.classList.add(mini ? 'mini-calendar' : 'full-calendar');
    root.innerHTML = `<div class="calendar-toolbar">
      <h2 class="calendar-month" id="${titleId}" aria-live="polite"></h2>
      <div class="calendar-controls">
        ${mini ? '' : '<button type="button" class="calendar-today" data-action="today">오늘</button>'}
        ${iconButton('previous', '이전 달', 'prev')}${iconButton('next', '다음 달', 'next')}
      </div>
    </div>
    <div class="calendar-grid" role="group" aria-labelledby="${titleId}"></div>
    ${mini ? '<p class="calendar-legend"><span><i class="calendar-marker" aria-hidden="true"></i>시작</span><span><i class="calendar-marker is-end" aria-hidden="true"></i>마감</span></p>' : ''}
    <div class="calendar-details" id="${detailsId}"></div>
    ${mini ? '<a class="calendar-full-link text-link" href="' + calendarHref + '">전체 캘린더 보기 ' + U.icon('arrow') + '</a>' : ''}`;

    const grid = root.querySelector('.calendar-grid');
    const details = root.querySelector('.calendar-details');
    const fullLink = root.querySelector('.calendar-full-link');
    const title = root.querySelector('.calendar-month');

    function dayButton(day, today, offers) {
      const value = iso(day);
      const count = offers.filter(offer => atDate(offer, day)).length;
      const starts = mini && offers.some(offer => offer.period.start === value);
      const ends = mini && offers.some(offer => offer.period.end === value);
      const description = count ? `, 이용 가능 혜택 ${count}개` : '';
      return `<button class="calendar-day" type="button" data-date="${value}"
        aria-label="${dateLabel.format(day)}${description}${starts ? ', 시작 일정 있음' : ''}${ends ? ', 마감 일정 있음' : ''}"
        aria-pressed="${day === selected}" ${day === today ? 'aria-current="date"' : ''}
        tabindex="${day === focusedDay ? '0' : '-1'}">
        <span>${new Date(day).getUTCDate()}</span>
        ${mini ? '<i class="calendar-markers" aria-hidden="true">' +
          (starts ? '<i class="calendar-marker"></i>' : '') + (ends ? '<i class="calendar-marker is-end"></i>' : '') + '</i>' : ''}
      </button>`;
    }

    function renderWeek(week, today, offers) {
      const events = mini ? null : weekEvents(week, offers);
      const cells = WEEKDAYS.map((_, index) => {
        const day = week + index * DAY;
        const classes = (monthStart(day) !== month ? ' is-outside' : '') + (day === selected ? ' is-selected' : '');
        return `<div class="calendar-cell${classes}" style="--column:${index + 1}">${dayButton(day, today, offers)}</div>`;
      }).join('');
      const hasMore = events?.overflow.some(Boolean);
      const more = hasMore ? events.overflow.map((count, index) => count ?
        `<button class="calendar-more" type="button" data-more="${iso(week + index * DAY)}"
          aria-label="${dateLabel.format(week + index * DAY)}, 추가 일정 ${count}개"
          style="--column:${index + 1}">+${count}</button>` : '').join('') : '';
      return `<div class="calendar-week${hasMore ? ' has-more' : ''}" style="--lanes:${Math.max(1, events?.lanes ?? 0)}">
        ${cells}${events ? events.visible.map(eventBar).join('') : ''}${more}
      </div>`;
    }

    function renderDetails(offers) {
      const upcoming = mini && selected === null;
      const matches = upcoming
        ? offers.filter(offer => U.active(offer) && U.remaining(offer) <= 3).sort(U.byDeadline).slice(0, 3)
        : offers.filter(offer => atDate(offer, selected));
      const heading = upcoming ? '마감 임박' : detailLabel.format(selected);
      let content = matches.length ? offerRows(matches, mini) : '';
      if (!offers.length) {
        content = '<p class="calendar-empty">관심 있는 혜택을 저장하면 일정을 확인할 수 있어요.</p>' +
          '<a class="text-link calendar-explore" href="explore.html">혜택 둘러보기 ' + U.icon('arrow') + '</a>';
      } else if (!matches.length) {
        content = `<p class="calendar-empty">${upcoming ? '곧 마감하는 저장 혜택이 없어요.' : '이날 이용할 수 있는 저장 혜택이 없어요.'}</p>`;
        if (!mini && !offers.some(offer => U.day(offer.period.start) < monthAt(month, 1) && U.day(offer.period.end) >= month)) {
          const target = closestSchedule(offers, selected);
          content += `<button type="button" class="calendar-jump text-link" data-jump="${iso(target)}">가장 가까운 저장 일정 보기 ${U.icon('arrow')}</button>`;
        }
      }
      details.innerHTML = `<h3 tabindex="-1">${heading}<span>${matches.length}개</span></h3>${content}`;
    }

    function refresh() {
      const previous = document.activeElement;
      const inDetails = details.contains(previous);
      const within = grid.contains(previous) || inDetails;
      const offers = U.savedItems();
      const today = U.today();
      const label = monthLabel.format(month);
      const monthChanged = title.textContent && title.textContent !== label;
      title.textContent = label;
      grid.innerHTML = `<div class="calendar-weekdays" aria-hidden="true">${WEEKDAYS.map(day => '<span>' + day + '</span>').join('')}</div>
        ${weekStarts(month, mini).map(week => renderWeek(week, today, offers)).join('')}`;
      renderDetails(offers);
      if (monthChanged && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        grid.getAnimations().forEach(animation => animation.cancel());
        grid.animate([{ opacity: .58 }, { opacity: 1 }], { duration: 170, easing: 'ease-out' });
      }
      if (mini) {
        const date = selected ?? (month === monthStart(today) ? null : month);
        fullLink.href = calendarHref + (date === null ? '' : '&date=' + iso(date));
      }
      if (!within) return;
      const date = previous.dataset.date;
      const more = previous.dataset.more;
      const save = previous.dataset.save;
      const href = previous.getAttribute('href');
      const scope = save || inDetails ? details : root;
      const equivalent = [...scope.querySelectorAll('button, a')].find(el =>
        (date && el.dataset.date === date) || (more && el.dataset.more === more) ||
        (save && el.dataset.save === save) || (href && el.getAttribute('href') === href));
      (equivalent || details.querySelector('h3')).focus({ preventScroll: true });
    }

    function select(day, detailFocus = false) {
      selected = focusedDay = day;
      month = monthStart(day);
      refresh();
      const target = detailFocus ? details.querySelector('h3') : grid.querySelector(`[data-date="${iso(day)}"]`);
      target.focus({ preventScroll: !detailFocus });
    }

    root.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      const { date, action, more, jump } = button.dataset;
      if (date || more || jump) {
        select(U.day(date || more || jump), Boolean(more || jump));
      } else if (action) {
        const today = U.today();
        month = action === 'today' ? monthStart(today) : monthAt(month, action === 'next' ? 1 : -1);
        focusedDay = month === monthStart(today) ? today : month;
        selected = mini ? null : focusedDay;
        refresh();
      }
    });

    grid.addEventListener('keydown', event => {
      if (!event.target.matches('[data-date]')) return;
      const day = U.day(event.target.dataset.date);
      const offset = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7,
        Home: -weekday(day), End: 6 - weekday(day) }[event.key];
      if (offset === undefined) return;
      event.preventDefault();
      focusedDay = day + offset * DAY;
      month = monthStart(focusedDay);
      refresh();
      grid.querySelector(`[data-date="${iso(focusedDay)}"]`).focus();
    });

    refresh();
    return { refresh };
  }

  return { mount };
})();