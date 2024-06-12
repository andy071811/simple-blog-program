document.addEventListener('DOMContentLoaded', () => {
    const allBtns = document.querySelectorAll('.searchBtn');
    const searchBar = document.querySelector('.searchBar');
    const searchInput = document.querySelector('#searchInput');
    const searchClose = document.querySelector('#searchClose');

    for (let i = 0; i < allBtns.length; i++) {
        allBtns[i].addEventListener('click', () => {
            searchBar.style.visibility = 'visible';
            searchBar.classList.add('open');
            this.setAttribute('aria-expanded', 'true');
            searchInput.focus();
        });
    };

    searchClose.addEventListener('click', () => {
        searchBar.style.visibility = 'hidden';
        searchBar.classList.remove('open');
        this.setAttribute('aria-expanded', 'false');
    });
});