require("@babel/polyfill");
import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchVeiw from "./view/searchView";


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