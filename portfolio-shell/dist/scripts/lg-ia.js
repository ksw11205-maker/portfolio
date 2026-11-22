const diagram = document.querySelector('.lg-ia');
const canvas = diagram.querySelector('.lg-ia-svg');
const nodes = Object.fromEntries([...diagram.querySelectorAll('[data-ia-node]')].map(node => [node.dataset.iaNode, node]));

function pathThrough(points) {
  const [start, ...rest] = points;
  return 'M' + start.join(' ') + rest.map(([x, y], index) => {
    const next = rest[index + 1];
    const [px, py] = points[index];
    if (!next) return ' L' + x + ' ' + y;
    const radius = Math.min(8, Math.hypot(x - px, y - py) / 2, Math.hypot(next[0] - x, next[1] - y) / 2);
    const before = [x - Math.sign(x - px) * radius, y - Math.sign(y - py) * radius];
    const after = [x + Math.sign(next[0] - x) * radius, y + Math.sign(next[1] - y) * radius];
    return ' L' + before.join(' ') + ' Q' + x + ' ' + y + ' ' + after.join(' ');
  }).join('');
}

function draw() {
  const frame = canvas.getBoundingClientRect();
  const position = (name, side, ratio = .5) => {
    const { left, top, width, height } = nodes[name].getBoundingClientRect();
    const x = left - frame.left;
    const y = top - frame.top;
    if (side === 'left') return [x, y + height * ratio];
    if (side === 'right') return [x + width, y + height * ratio];
    return [x + width * ratio, side === 'bottom' ? y + height : y];
  };
  const set = (name, points) => canvas.querySelector('[data-ia-edge="' + name + '"]').setAttribute('d', pathThrough(points));
  const markJunction = (index, [x, y]) => {
    const dot = canvas.querySelectorAll('.lg-ia-junction')[index];
    dot.setAttribute('cx', x);
    dot.setAttribute('cy', y);
  };
  const [login, home, input, analysis, generate, compare, history] = Object.keys(nodes);
  const column = getComputedStyle(nodes[home]).gridColumnStart === '1';
  const main = [[login, home], [home, input], [input, analysis], [analysis, generate], [generate, compare]];
  canvas.setAttribute('viewBox', `0 0 ${frame.width} ${frame.height}`);

  main.forEach(([from, to]) => {
    if (!column && from === home) {
      const a = position(from, 'bottom');
      const b = position(to, 'top');
      const bend = (a[1] + b[1]) / 2;
      set(from, [a, [a[0], bend], [b[0], bend], b]);
      return;
    }
    set(from, [position(from, column ? 'bottom' : 'right'), position(to, column ? 'top' : 'left')]);
  });

  if (column) {
    const a = position(compare, 'right');
    const b = position(generate, 'right');
    const loopRail = a[0] + 18;
    set('loop', [a, [loopRail, a[1]], [loopRail, b[1]], b]);
    const fromAnalysis = position(analysis, 'left');
    const fromCompare = position(compare, 'left');
    const intoHistory = position(history, 'left');
    const recordRail = fromAnalysis[0] - 18;
    const junction = [recordRail, fromCompare[1]];
    set('analysis-record', [fromAnalysis, [recordRail, fromAnalysis[1]], junction]);
    set('compare-record', [fromCompare, junction]);
    set('record-stem', [junction, [recordRail, intoHistory[1]], intoHistory]);
    markJunction(0, junction);
    return;
  }

  const a = position(compare, 'bottom', .44);
  const b = position(generate, 'bottom');
  const loopRail = a[1] + 24;
  set('loop', [a, [a[0], loopRail], [b[0], loopRail], b]);
  const fromAnalysis = position(analysis, 'bottom');
  const fromCompare = position(compare, 'bottom', .83);
  const intoHistory = position(history, 'top');
  const recordRail = intoHistory[1] - 18;
  const junction = [intoHistory[0], recordRail];
  set('analysis-record', [fromAnalysis, [fromAnalysis[0], recordRail], junction]);
  set('compare-record', [fromCompare, [fromCompare[0], recordRail], junction]);
  set('record-stem', [junction, intoHistory]);
  markJunction(0, junction);
}

const observer = new ResizeObserver(draw);
observer.observe(diagram);
Object.values(nodes).forEach(node => observer.observe(node));
draw();
