export class ScriptBase {
    title = document.createElement("h5")
    body = document.createElement("div")
    mainDiv = document.createElement("div")

    constructor(div: HTMLDivElement) {
        this.mainDiv = div
        let title = div.getElementsByClassName("modalScriptTitle").item(0)
        let body = div.getElementsByClassName("modalScriptBody").item(0)
        if (title) {
            this.title = <HTMLHeadingElement>title
        }
        if (body) {
            this.body = <HTMLDivElement>body
        }
        $(this.mainDiv).one("hide.bs.modal", this.onClose)
    }

    show() {
        $(this.mainDiv).modal("show")
    }

    onClose() {
        //to be overridden
    }
}