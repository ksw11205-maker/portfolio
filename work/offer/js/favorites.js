/* Personal brand collection and discovery directory share one follow action. */
offerReady.then(({ brands, promotions }) => {
  const U = OFFER;
  const main = document.getElementById('main');
  const brandLink = brand => 'brand.html?id=' + encodeURIComponent(brand.id);
  const identity = (brand, description) => `
    <div class="brand-row-identity">
      ${U.brandLogo(brand)}
      <div><h3><a href="${brandLink(brand)}">${U.escape(brand.name)}</a></h3><p>${description}</p></div>
    </div>`;

  main.innerHTML = `<div class="container page-content">
    <div class="page-intro collection-heading">
      <div><h1>Follow<span class="heading-dot">.</span></h1>
      <p>관심 브랜드의 새로운 혜택과 진행 중인 프로모션을 한곳에서 확인하세요.</p></div>
      <p class="collection-count" id="favorite-count" aria-live="polite"></p>
    </div>
    <div id="favorite-content"></div>
    <section id="all-brands" class="section directory-section" aria-labelledby="brand-directory-title">
      <div class="section-heading"><h2 id="brand-directory-title">BRANDS</h2></div>
      <div class="brand-rows brand-directory">${brands.map(brand => `<article class="brand-row">
        ${identity(brand, U.escape(brand.category.toUpperCase()))}${U.followButton(brand)}
      </article>`).join('')}</div>
    </section>
  </div>`;

  const content = document.getElementById('favorite-content');
  function render() {
    const followed = brands.filter(brand => U.has('favoriteBrands', brand.id));
    document.getElementById('favorite-count').innerHTML = `<strong>${followed.length}</strong>팔로우한 브랜드`;
    content.innerHTML = followed.length ? followed.map(brand => {
      const active = promotions.filter(offer => offer.brandId === brand.id && U.active(offer));
      const highlights = [...active].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);
      return `<section class="follow-collection" aria-label="${U.escape(brand.name)} 프로모션">
        <div class="brand-row">
          ${identity(brand, `진행 중인 혜택 ${active.length}개`)}
          <div class="brand-row-actions">
            <a class="text-link" href="${brandLink(brand)}">브랜드 보기 ${U.icon('arrow')}</a>
            ${U.followButton(brand)}
          </div>
        </div>
        ${highlights.length ? U.grid(highlights) : '<p class="follow-no-offers">현재 진행 중인 혜택이 없어요.</p>'}
      </section>`;
    }).join('') : U.empty('아직 팔로우한 브랜드가 없어요.',
      '관심 브랜드를 팔로우하면 새로운 혜택을 바로 확인할 수 있어요.', '#all-brands', '브랜드 둘러보기');
  }

  function update() {
    const focused = document.activeElement;
    if (!content.contains(focused)) {
      render();
      return;
    }
    const { follow, save } = focused.dataset;
    const href = focused.getAttribute('href');
    render();
    const localMatches = [...content.querySelectorAll('a, button')];
    const target = localMatches.find(el => (follow && el.dataset.follow === follow) ||
      (save && el.dataset.save === save) || (href && el.getAttribute('href') === href));
    const directoryButton = follow && document.querySelector(`.brand-directory [data-follow="${CSS.escape(follow)}"]`);
    (target || directoryButton || content.querySelector('a'))?.focus({ preventScroll: Boolean(target) });
  }

  render();
  document.addEventListener('offer:storage', event => {
    if (event.detail.key === 'favoriteBrands') update();
  });
  document.addEventListener('offer:external-storage', update);
});