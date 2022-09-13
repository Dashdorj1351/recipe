import { elements } from "./base"

const renderRecipe = recipe => {
    const markup = 
    `<li>
    <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="Test">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${recipe.title}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
    </li>`
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

export const clearSearchKey = () => elements.searchImput.value = '';
export const clearSearchResult = () => {
    elements.searchResultList.innerHTML = '';
    elements.pageButtons.innerHTML = '';
};
export const getInput = () => elements.searchImput.value;
export const renderRecipes = (recipes, currentPage = 1, resPerPage = 10) => {
    // Хайлтын үр дүнг хуудаслаж үзүүлэх
    const start = (currentPage-1) * resPerPage;
    const end = currentPage * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);
    // Хуудаслалтын товчуудыг гаргаж ирэх
    const totalPage = Math.ceil(recipes.length / resPerPage);
    renderButtons(currentPage, totalPage);
};
// type ===> 'prev', 'next'
const creatButton = (page, type, arrow) =>
`<button class="btn-inline results__btn--${type}" data-goto = ${page}>
<svg class="search__icon">
    <use href="img/icons.svg#icon-triangle-${arrow}"></use>
</svg>
<span>Хуудас ${page}</span>
</button>`;
 const renderButtons = (currentPage, totalPage) => {
    let buttonHTML;
    if(currentPage === 1 && totalPage > 1){
        buttonHTML = creatButton(2, 'next', 'right');
    } else if(currentPage < totalPage){
        buttonHTML = creatButton(currentPage - 1, 'prev', 'left');
        buttonHTML += creatButton(currentPage + 1, 'next', 'right');
    } else if(currentPage === totalPage){
        buttonHTML = creatButton(currentPage - 1, 'prev', 'left');
    };

    elements.pageButtons.insertAdjacentHTML('afterbegin', buttonHTML);
};