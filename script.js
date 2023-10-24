const wrapperInput = document.querySelector('.wrapper__input');
const searchList = document.querySelector('.wrapper__search-list');
const repoList = document.querySelector('.wrapper__repo-list');

// Создаем задержку вызовов
function debounce(fn, delay) {
    let timer;

    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    }
}

// Получаем данные с git.api по введенному в инпут названию репозитория
async function getRepo(repoName) {
    if (!repoName) {
        return [];
    }

    try {
        const response = await fetch(`https://api.github.com/search/repositories?q=${repoName}&per_page=5`);
        const data = await response.json();
        
        return data.items;
    }
    catch(err) {
        console.log(err);
    }
}

// Добавляем результаты поиска
async function addDropdown(e) {
    try {
    const data = await getRepo(e.target.value);
    const fragment = document.createDocumentFragment();

    searchList.innerHTML = '';

    data.forEach(repo => {
        const searchItem = document.createElement('li');
        searchItem.classList.add('search-list__item');
        searchItem.textContent = `${repo.name}`;
        fragment.append(searchItem)

        searchItem.addEventListener('click', () => {
            createRepoCard(repo.name, repo.owner.login, repo.forks_count);
            wrapperInput.value = '';
            searchList.innerHTML = '';
        })
    });
    
    searchList.append(fragment);
    }
    catch(err) {
        console.log(err);
    }
}

// Создаем и добавляем выбранный пользователем репозиторий
function createRepoCard(name, owner, stars) {
    const repoCard = document.createElement('li');
    repoCard.classList.add('repo-list__repo-card', 'repo-card');

    repoCard.innerHTML = `<div class="repo-card__content">
                            <span class="repo-card__text">Name: ${name}</span>
                            <span class="repo-card__text">Owner: ${owner}</span>
                            <span class="repo-card__text">Stars: ${stars}</span>
                        </div>
                            <div class="repo-card__delete-btn"></div>`;
                                
    repoList.append(repoCard);                   
}

// Обертка
addDropdown = debounce(addDropdown, 500);

wrapperInput.addEventListener('input', (e) => addDropdown(e));

repoList.addEventListener('click', (e) => {
    let target = e.target;

    if (target.classList.contains('repo-card__delete-btn')) {
        const repoCard = target.closest('.repo-list__repo-card');
        
        if (repoCard) {
            repoCard.remove();
        }
    }
});
