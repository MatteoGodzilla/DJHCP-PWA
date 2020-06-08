export class ScriptBase {
    constructor(div) {
        this.title = document.createElement("h5");
        this.body = document.createElement("div");
        this.mainDiv = document.createElement("div");
        this.mainDiv = div;
        let title = div.getElementsByClassName("modalScriptTitle").item(0);
        let body = div.getElementsByClassName("modalScriptBody").item(0);
        if (title) {
            this.title = title;
        }
        if (body) {
            this.body = body;
        }
        $(this.mainDiv).one("hide.bs.modal", this.onClose);
    }
    show() {
        $(this.mainDiv).modal("show");
    }
    onClose() {
        //to be overridden
    }
}
