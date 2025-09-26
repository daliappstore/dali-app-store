document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchBar');
    const appsGrid = document.getElementById('appsGrid');
    const categoryButtons = document.querySelectorAll('.category-btn');

    function getAppCards() {
        return appsGrid.querySelectorAll('.app-card');
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // ===== Helper to remove highlights and restore original text =====
    function removeHighlights() {
        const appCards = getAppCards();
        appCards.forEach(card => {
            const nameElement = card.querySelector('.app-name');
            const descElement = card.querySelector('.app-description');
            if (nameElement && nameElement.getAttribute('data-original')) {
                nameElement.textContent = nameElement.getAttribute('data-original');
                nameElement.removeAttribute('data-original');
            }
            if (descElement && descElement.getAttribute('data-original')) {
                descElement.textContent = descElement.getAttribute('data-original');
                descElement.removeAttribute('data-original');
            }
        });
    }

    // ===== No results helper =====
    function showNoResults(show) {
        let noResults = appsGrid.querySelector('.no-results');
        if (show) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.className = 'no-results';
                noResults.innerHTML = `
                    <i class="fas fa-search"></i>
                    <h3>No apps found</h3>
                    <p>Try different search terms or browse categories</p>
                `;
                appsGrid.appendChild(noResults);
            }
        } else if (noResults) {
            noResults.remove();
        }
    }

    // ===== Search Functionality =====
    searchInput.addEventListener('input', function() {
        const rawTerm = this.value.trim();
        const searchTerm = rawTerm.toLowerCase();
        let hasVisibleResults = false;

        // always restore original text before applying new highlights
        removeHighlights();

        const appCards = getAppCards();
        const regex = searchTerm ? new RegExp(escapeRegExp(searchTerm), 'gi') : null;

        appCards.forEach(card => {
            const dataName = (card.getAttribute('data-name') || '').toLowerCase();
            const nameEl = card.querySelector('.app-name');
            const descEl = card.querySelector('.app-description');
            const appDescText = descEl ? descEl.textContent.toLowerCase() : '';

            if (dataName.includes(searchTerm) || appDescText.includes(searchTerm)) {
                card.style.display = 'flex';
                hasVisibleResults = true;

                // Highlight matching text only when there's a non-empty search term
                if (searchTerm && regex) {
                    const originalName = nameEl ? (nameEl.getAttribute('data-original') || nameEl.textContent) : '';
                    const originalDesc = descEl ? (descEl.getAttribute('data-original') || descEl.textContent) : '';

                    if (nameEl) {
                        nameEl.setAttribute('data-original', originalName);
                        nameEl.innerHTML = originalName.replace(regex, match => `<span class="highlight">${match}</span>`);
                    }
                    if (descEl) {
                        descEl.setAttribute('data-original', originalDesc);
                        descEl.innerHTML = originalDesc.replace(regex, match => `<span class="highlight">${match}</span>`);
                    }
                }
            } else {
                card.style.display = 'none';
            }
        });

        showNoResults(!hasVisibleResults);

        // if search is cleared, ensure originals are restored (and remove no-results)
        if (!searchTerm) {
            removeHighlights();
            showNoResults(false);
        }
    });

    // ===== Category Filter =====
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const appCards = getAppCards();
            appCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });

            // Clear search input, restore originals, and remove no-results
            searchInput.value = '';
            removeHighlights();
            showNoResults(false);
        });
    });
});


