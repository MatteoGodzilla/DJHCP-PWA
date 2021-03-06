type buttonOptions = "Close" | "Submit-Close"
class ScriptBase {
	title = document.createElement("h5")
	body = document.createElement("div")
	buttons = document.createElement("div")
	mainDiv = document.createElement("div")

	static isOpened:boolean

	constructor(div: HTMLDivElement) {
		this.mainDiv = div
		let title = div.getElementsByClassName("modalScriptTitle").item(0)
		let body = div.getElementsByClassName("modalScriptBody").item(0)
		let buttons = div.getElementsByClassName("modalScriptButtons").item(0)
		if (title) {
			this.title = <HTMLHeadingElement>title
			this.title.innerText = ""
		}
		if (body) {
			this.body = <HTMLDivElement>body
			for(let i = this.body.children.length -1; i >= 0; i--){
				this.body.removeChild(this.body.children[i])
			}
			this.body.innerHTML = ""
		}
		if(buttons){
			this.buttons = <HTMLDivElement>buttons
			this.setButtons("Close")
		}
		$(this.mainDiv).one("hide.bs.modal", ()=>{
			ScriptBase.isOpened = false
			this.onClose()
		})
	}

	show() {
		if(!ScriptBase.isOpened){
			$(this.mainDiv).modal("show")
			ScriptBase.isOpened = true
		}else{
			//open the dialog as soon as possible, but wait for the previous one to close down
			$(this.mainDiv).one("hidden.bs.modal", ()=>{
				this.show()
			})
		}
	}

	setButtons(num:buttonOptions){
		for(let i = $(this.buttons.children).length -1; i >= 0; i--){
			this.buttons.removeChild(this.buttons.children[i])
		}

		let btnSubmit = document.createElement("button")
		btnSubmit.classList.add("btn","btn-primary")
		btnSubmit.innerText = "Submit"
		btnSubmit.addEventListener("click", ev => this.onSubmit())

		let btnClose = document.createElement("button")
		btnClose.classList.add("btn","btn-secondary")
		btnClose.setAttribute("data-dismiss","modal")
		btnClose.innerText = "Close"

		if(num === "Submit-Close"){
			this.buttons.appendChild(btnSubmit)
			this.buttons.appendChild(btnClose)
		}else{
			this.buttons.appendChild(btnClose)
		}
	}

	onClose() {
		//to be overridden
	}

	onSubmit(){
		//to be overridden
	}
}

export default ScriptBase