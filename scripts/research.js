/* A fixed-axis comparison of original mean task completion times. */
const result = document.querySelector('#task-result');
if (result) {
  const tasks = {
    climate: {
      label: '공조 조절', heading: ['통합형에서', '더 빠르게 조절했습니다.'],
      values: [15.15, 19.14, 22.32, 17.96], best: 0,
      note: '상단형 22.32초 대비 평균 7.17초 짧음',
      stat: '통합형 ↔ 상단형: Tukey HSD 사후검정에서 차이 확인'
    },
    menu: {
      label: '메뉴 탐색', heading: ['측면형에서', '더 빠르게 탐색했습니다.'],
      values: [22.15, 24.74, 28.71, 19.49], best: 3,
      note: '상단형 28.71초 대비 평균 9.22초 짧음',
      stat: '측면형 ↔ 상단형: Tukey HSD 사후검정에서 차이 확인'
    },
    phone: {
      label: '전화 걸기', heading: ['측면형에서', '더 빠르게 연결했습니다.'],
      values: [15.35, 20.14, 16.05, 13.87], best: 3,
      note: '더블 탭형 20.14초 대비 평균 6.27초 짧음',
      stat: '측면형 ↔ 더블 탭형: Tukey HSD 사후검정에서 차이 확인'
    }
  };
  const names = ['통합 메뉴형', '더블 탭 메뉴형', '상단 메뉴형', '측면 메뉴형'];
  const buttons = [...document.querySelectorAll('[data-research-task]')];
  const rows = [...result.querySelectorAll('.time-row')];
  const chart = result.querySelector('[data-time-chart]');
  const announcement = document.querySelector('[data-result-announcement]');
  const setText = (selector, text) => { result.querySelector(selector).textContent = text; };

  function selectTask(key) {
    const task = tasks[key];
    if (!task) return;
    buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.researchTask === key)));
    setText('[data-result-label]', task.label);
    const heading = result.querySelector('[data-result-heading]');
    heading.replaceChildren(document.createTextNode(task.heading[0]), document.createElement('br'), document.createTextNode(task.heading[1]));
    setText('[data-result-value]', task.values[task.best].toFixed(2));
    setText('[data-result-note]', task.note);
    setText('[data-result-stat]', task.stat);
    rows.forEach((row, index) => {
      const best = index === task.best;
      row.classList.toggle('is-best', best);
      row.querySelector('[data-time-name]').textContent = `${names[index]}${best ? ' · 최단' : ''}`;
      row.querySelector('[data-time-value]').textContent = `${task.values[index].toFixed(2)}초`;
      row.querySelector('.time-track > span').style.setProperty('--value', `${task.values[index] / 30 * 100}%`);
    });
    chart.setAttribute('aria-label', `${task.label} 평균 수행시간. ${names.map((name, index) => `${name} ${task.values[index].toFixed(2)}초`).join(', ')}.`);
    announcement.textContent = `${task.label}. ${names[task.best]} 평균 ${task.values[task.best].toFixed(2)}초로 최단. ${task.note}. ${task.stat}.`;
  }
  buttons.forEach((button) => button.addEventListener('click', () => selectTask(button.dataset.researchTask)));
}
