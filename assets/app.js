(() => {
  'use strict';
  const projects = Array.isArray(window.LAUNCHPAD_PROJECTS)
    ? window.LAUNCHPAD_PROJECTS.filter(item => item && /^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/.test(item.url || '')) : [];
  const grid = document.querySelector('#projects');
  const filters = document.querySelector('#filters');
  const search = document.querySelector('#search');
  const empty = document.querySelector('#empty');
  const categories = ['Todos', ...new Set(projects.map(item => item.category || 'Outros'))];
  let selected = 'Todos';
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  document.querySelector('#year').textContent = String(new Date().getFullYear());
  document.querySelector('#project-count').textContent = String(projects.length);
  const affiliate = window.LAUNCHPAD_CONFIG?.hostingerAffiliateUrl;
  if (typeof affiliate === 'string' && /^https:\/\//i.test(affiliate)) document.querySelector('#hostinger-link').href = affiliate;
  const renderFilters = () => {
    filters.replaceChildren();
    categories.forEach(category => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'filter' + (selected === category ? ' active' : '');
      button.textContent = category;
      button.setAttribute('aria-pressed', String(category === selected));
      button.addEventListener('click', () => { selected = category; renderFilters(); renderProjects(); });
      filters.appendChild(button);
    });
  };
  const renderProjects = () => {
    const term = search.value.trim().toLocaleLowerCase('pt');
    const items = projects.filter(p =>
      (selected === 'Todos' || (p.category || 'Outros') === selected) &&
      [p.name, p.description, p.category, ...(p.stack || [])].join(' ').toLocaleLowerCase('pt').includes(term));
    grid.innerHTML = items.map(p => `<article class="project-card"><div class="card-top"><span class="project-icon ${escapeHTML(['purple','blue','green','amber'].includes(p.color) ? p.color : 'purple')}">${escapeHTML(p.icon || '◈')}</span><span class="open-tag">● OPEN SOURCE</span></div><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.description || '')}</p><div class="tags">${(p.stack || []).map(s => `<span>${escapeHTML(s)}</span>`).join('')}</div><div class="card-bottom"><span>${escapeHTML(p.license || 'Licença a verificar')}</span><a href="${escapeHTML(p.url)}" target="_blank" rel="noopener noreferrer">Ver repositório ↗</a></div></article>`).join('');
    empty.hidden = items.length > 0;
    empty.textContent = projects.length === 0 ? 'Ainda não foram adicionados projetos. Edita assets/projects.js para publicar o primeiro.' : 'Nenhum projeto corresponde à pesquisa.';
  };
  search.addEventListener('input', renderProjects);
  renderFilters();
  renderProjects();
})();