import uniqid from "uniqid";

export default class List {
    constructor() {
        this.items = [];
    };
    delItem(id) {
        // id индекс хайж олно
        const index = this.items.findIndex(el => el.id === id)
        // дээрхийг массиваас устгана
        this.items.splice(index, 1);
    }
    addItems(item) {
        let newItem = {
            id: uniqid(),
            item
        };
        this.items.push(newItem);
        return newItem;
    };
};