export default class Like {
    constructor() {
        this.readData();
        if(!this.likes) this.likes = [];
    };
    addLike( id, title, publisher, img) {
        const like = {id, title, publisher, img};
        this.likes.push(like);
        this.saveData();
        return like;
    };
    delLike(id) {
        // id индекс хайж олно
        const index = this.likes.findIndex(el => el.id === id);
        // дээрхийг массиваас устгана
        this.likes.splice(index, 1);
        this.saveData();
    };
    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    };
    getNumberLikes() {
        return this.likes.length;
    };
    saveData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    };
    readData() {
        this.likes = JSON.parse(localStorage.getItem('likes'));
    };
};