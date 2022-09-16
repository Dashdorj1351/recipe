require("@babel/polyfill");
import * as searchVeiw from "./view/searchView";
import * as listView from "./view/listView";
import * as likesView from "./view/likesView";
import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import Recipe from "./model/Recipe";
import { renderRecipe, clearRecipe, highLihttSeletrdRecipe } from "./view/recipeView";
import List from "./model/List";
import Like from "./model/Like";



/**
 * web app төлөв
 * - хайлтын query, үр дүн
 * - тухайн үзүүлж байгаа жор
 * - лайкласан жорууд 
 * - захиалж байгаа жорын найрлагууд
 */
const state = {};
const controlSearch = async () => {
    // Вэбийн хайлтийн түлхүүр үгийг гаргаж авна.
    const query = searchVeiw.getInput();
    
    if(query){
        // Шинээр хайлтын обьктыг үүсгэж өгнө
        state.search = new Search(query);
        // Хайлт хийхэд зоруулж UI бэлтгэнэ
        searchVeiw.clearSearchKey();
        searchVeiw.clearSearchResult();
        renderLoader(elements.searchResultDiv);
        // Хайлтыг гүйцэтгэнэ
        await state.search.doSearch();
        // Хайлтын үр дүнг дэлгэцэнд үзүүлнэ
        clearLoader();
        if(state.search.result === undefined) alert('Хайлт илэрцгүй')
        searchVeiw.renderRecipes(state.search.result);
    }
};
elements.searchform.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});
elements.pageButtons.addEventListener('click', e => {
    const btn = e.target.closest ('.btn-inline');
    if(btn) {
        const gotoPageNumber= parseInt(btn.dataset.goto, 10);
        searchVeiw.clearSearchResult();
        searchVeiw.renderRecipes(state.search.result, gotoPageNumber);
    }
});

/**
 * Жорын контролер
 */
const controlRecipe = async() => {
    // URl-аас ID салгах
    const id = window.location.hash.replace('#', '');
    if(id){
        // Жорын моделийг үүсгэж өгнө.
        state.recipe = new Recipe(id);
        // UI дэлгэц бэлдэнэ
        clearRecipe();
        renderLoader(elements.recipeDiv);
        highLihttSeletrdRecipe(id)
        // Жороо татаж авчирна
        await state.recipe.getRecipe();
        // Жорын тооцоолно
        clearLoader();
        state.recipe.calcTime();
        state.recipe.calcHuniiToo();
        // Жороо үзүүлнэ.
        renderRecipe(state.recipe, state.likes.isLiked(id));
    };
};
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
window.addEventListener('load', e => {
    if(!state.likes) state.likes = new Like();
    likesView.toggleLikeMenu(state.likes.getNumberLikes());
    state.likes.likes.forEach(Like => likesView.renderLike(Like));
});
/**
 * Найрлагны контролер
 */
const controlList = () => {
    // найрлагны тодел үүсгэнэ
    state.list = new List();
    listView.clearList();
    state.recipe.ingredients.forEach(n => {
        const item = state.list.addItems(n);
        listView.renderItem(item);
    });
};
/**
 * Like контролер
 */
const controlLike = () => {
    // Модел үүсгэнэ.
    if(!state.likes) state.likes = new Like();
    // Одоо харагдаж байгаа жорын id олж авах
    const cuurrentRecipe = state.recipe.id;
    // энэ жорыг шалгах LIKe болиулна эсвэл эсэргээрээ
    if(state.likes.isLiked(cuurrentRecipe)){
        state.likes.delLike(cuurrentRecipe);
        likesView.dislike(cuurrentRecipe);
        likesView.toggleLiked(false);
    }else {
        const newLike = state.likes.addLike(cuurrentRecipe, state.recipe.title, state.recipe.publisher, state.recipe.image_url);
        likesView.toggleLiked(true);
        likesView.renderLike(newLike);
    };
    likesView.toggleLikeMenu(state.likes.getNumberLikes());
};
elements.recipeDiv.addEventListener('click', e => {
    if(e.target.matches('.recipe__btn, .recipe__btn *')) {
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    };
});
elements.shoppingList.addEventListener('click', e => {
    // id шүүлээ
    const id = e.target.closest('.shopping__item').dataset.itemid;
    // орцыг устгана
    state.list.delItem(id);
    //  дэлгэцээр устгана
    listView.delItem(id);
});