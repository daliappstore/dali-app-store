document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchBar');
    const appsGrid = document.getElementById('appsGrid');
    const appCards = appsGrid.querySelectorAll('.app-card');
    const categoryButtons = document.querySelectorAll('.category-btn');

    // ===== Search Functionality =====
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        let hasVisibleResults = false;

        appCards.forEach(card => {
            const appName = card.getAttribute('data-name').toLowerCase();
            const appDesc = card.querySelector('.app-description').textContent.toLowerCase();

            if(appName.includes(searchTerm) || appDesc.includes(searchTerm)){
                card.style.display = 'flex';
                hasVisibleResults = true;

                // Highlight matching text
                if(searchTerm){
                    const nameElement = card.querySelector('.app-name');
                    const descElement = card.querySelector('.app-description');

                    const originalName = nameElement.getAttribute('data-original') || nameElement.textContent;
                    const originalDesc = descElement.getAttribute('data-original') || descElement.textContent;

                    nameElement.setAttribute('data-original', originalName);
                    descElement.setAttribute('data-original', originalDesc);

                    nameElement.innerHTML = originalName.replace(
                        new RegExp(searchTerm, 'gi'),
                        match => `<span class="highlight">${match}</span>`
                    );
                    descElement.innerHTML = originalDesc.replace(
                        new RegExp(searchTerm, 'gi'),
                        match => `<span class="highlight">${match}</span>`
                    );
                }

            } else {
                card.style.display = 'none';
            }
        });

        // No results message
        let noResults = appsGrid.querySelector('.no-results');
        if(!hasVisibleResults){
            if(!noResults){
                noResults = document.createElement('div');
                noResults.className = 'no-results';
                noResults.innerHTML = `
                    <i class="fas fa-search"></i>
                    <h3>No apps found</h3>
                    <p>Try different search terms or browse categories</p>
                `;
                appsGrid.appendChild(noResults);
            }
        } else if(noResults){
            noResults.remove();
        }
    });

    // ===== Category Filter =====
    categoryButtons.forEach(button => {
        button.addEventListener('click', function(){
            const category = this.getAttribute('data-category');

            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            appCards.forEach(card => {
                if(category === 'all' || card.getAttribute('data-category') === category){
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });

            // Clear search input
            searchInput.value = '';
            // Remove highlights
            document.querySelectorAll('.highlight').forEach(el => {
                const parent = el.parentElement;
                parent.textContent = parent.getAttribute('data-original');
            });
        });
    });
});
