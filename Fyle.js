let page = 1;
let perPage = 10;
let isLoading = false;

function getRepositories() {
    if (isLoading) return;

    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();

    if (!username) {
        alert('Please enter a GitHub username.');
        return;
    }

    const repositoriesContainer = document.getElementById('repositories');
    const loader = document.getElementById('loader');
    
    repositoriesContainer.innerHTML = '';
    loader.style.display = 'block';

    const perPageSelect = document.getElementById('perPage');
    perPage = perPageSelect.value;

    const searchInput = document.getElementById('search');
    const searchTerm = searchInput.value.trim();

    const apiUrl = `https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}&sort=updated`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(repositories => {
            repositories.forEach(repo => {
                if (searchTerm && !repo.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return;
                }

                const repoLink = document.createElement('a');
                repoLink.href = repo.html_url;
                repoLink.target = '_blank';
                repoLink.textContent = repo.name;

                const topics = repo.topics || [];
                const topicsText = topics.length > 0 ? `Topics: ${topics.join(', ')}` : '';

                const repoItem = document.createElement('div');
                repoItem.classList.add('repo-item');
                repoItem.innerHTML = `
                    <div>
                        <strong>${repoLink.outerHTML}</strong>
                        <p class="topics">${topicsText}</p>
                    </div>
                `;

                repositoriesContainer.appendChild(repoItem);
            });

            loader.style.display = 'none';
            isLoading = false;
        })
        .catch(error => {
            console.error('Error fetching repositories:', error);
            repositoriesContainer.innerHTML = '<p>Error fetching repositories. Please try again later.</p>';
            loader.style.display = 'none';
            isLoading = false;
        });
}

document.addEventListener('scroll', function() {
    const repositoriesContainer = document.getElementById('repositories');
    const loader = document.getElementById('loader');

    if (repositoriesContainer && loader) {
        const containerHeight = repositoriesContainer.clientHeight;
        const scrollHeight = window.scrollY + window.innerHeight;

        if (scrollHeight >= containerHeight && !isLoading) {
            isLoading = true;
            page++;
            getRepositories();
        }
    }
});
