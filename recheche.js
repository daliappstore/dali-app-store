document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchBar');
  const appsGrid = document.getElementById('appsGrid');
  const categoryButtons = document.querySelectorAll('.category-btn');

  const getAppCards = () => appsGrid.querySelectorAll('.app-card');

  const escapeRegExp = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const removeHighlights = () => {
    getAppCards().forEach(card => {
      ['.app-name', '.app-description'].forEach(selector => {
        const el = card.querySelector(selector);
        if (el?.dataset.original) {
          el.textContent = el.dataset.original;
          delete el.dataset.original;
        }
      });
    });
  };

  const showNoResults = show => {
    let noResults = appsGrid.querySelector('.no-results');
    if (show && !noResults) {
      noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.innerHTML = `
        <i class="fas fa-search"></i>
        <h3>No apps found</h3>
        <p>Try different search terms or browse categories</p>
      `;
      appsGrid.appendChild(noResults);
    } else if (!show && noResults) {
      noResults.remove();
    }
  };

  const highlightText = (el, regex) => {
    if (!el) return;
    const original = el.dataset.original || el.textContent;
    el.dataset.original = original;
    el.innerHTML = original.replace(regex, match => `<span class="highlight">${match}</span>`);
  };

  searchInput.addEventListener('input', () => {
    const term = searchInput.value.trim().toLowerCase();
    const regex = term ? new RegExp(escapeRegExp(term), 'gi') : null;
    let hasResults = false;

    removeHighlights();

    getAppCards().forEach(card => {
      const dataName = card.getAttribute('data-name')?.toLowerCase() || '';
      const appNameText = card.querySelector('.app-name')?.textContent.toLowerCase() || '';
      const appDescText = card.querySelector('.app-description')?.textContent.toLowerCase() || '';

      const match = dataName.includes(term) || appNameText.includes(term) || appDescText.includes(term);
      card.style.display = match ? 'flex' : 'none';
      if (match) {
        hasResults = true;
        if (regex) {
          highlightText(card.querySelector('.app-name'), regex);
          highlightText(card.querySelector('.app-description'), regex);
        }
      }
    });

    showNoResults(!hasResults);
    if (!term) removeHighlights();
  });

  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      getAppCards().forEach(card => {
        const match = category === 'all' || card.dataset.category === category;
        card.style.display = match ? 'flex' : 'none';
      });

      searchInput.value = '';
      removeHighlights();
      showNoResults(false);
    });
  });
});




