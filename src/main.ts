let divTracklisting = $("#divTracklisting").get(0)
let tbodyTracklisting = $("#tableTracklisting").get(0)
let tracks: Element[] = []
let visible: Element[] = []
let trackObjs: strObj[] = []
let selectedIndex = 0
let baseFolderHandle
let modified = false

interface strObj {
	id: string,
	value: string
}

function init(){
	if(window.chooseFileSystemEntries == undefined){
		$("#modalAPINotFound").modal("show")
		console.log("API NOT found")
	}
	else{
		console.log("API found")
	}

	if ('serviceWorker' in navigator) {
		window.addEventListener('load',() => {
			navigator.serviceWorker.register("./sw.js")
			.then(registration =>{
				console.log("Service Worker Registered",registration)
			}).catch(error =>{
				console.error("Service Worker Error",error)
			})
		})
	}
	else{
		console.log("NO SERVICE WORKER SUPPORT")
	}
}
init()

function showLoading() {
	$("#divLoading").get(0).style.display = "none"
	$("#divLoading").get(0).style.display = "block"
}

function hideLoading() {
	$("#divLoading").get(0).style.display = "block"
	$("#divLoading").get(0).style.display = "none"
}

function onSelection(ev: Event) {
	for (let i = 0; i < tbodyTracklisting.children.length; i++) {
		if (tbodyTracklisting.children[i] == ev.currentTarget) selectedIndex = i
	}
	highlightActive()
}

function openTrack(ev:Event){
	let serializer = new XMLSerializer
	$("#modalTextArea").attr("value",serializer.serializeToString(tracks[ev.currentTarget.rowIndex]))
	$("#modalTextEdit").one("hide.bs.modal",()=>{
		let parser = new DOMParser()
		console.log($("#modalTextArea").get(0))
	})
	$("#modalTextEdit").modal("show")

}

function highlightActive() {
	if (tbodyTracklisting.childElementCount > 0) {
		let items = tbodyTracklisting.children
		const tag = "table-primary"
		for (let item of items) {
			if (item.classList.contains(tag)) {
				item.classList.remove(tag)
			}
		}
		items[selectedIndex].classList.add(tag)
	}
}

function updateList() {
	return new Promise(resolve => {
		for (let i = tbodyTracklisting.childElementCount - 1; i >= 0; i--) {
			tbodyTracklisting.removeChild(tbodyTracklisting.children[i])
		}

		for (let track of visible) {
			let tr = document.createElement("tr")
			let artist1 = document.createElement("td")
			let artist2 = document.createElement("td")
			let name1 = document.createElement("td")
			let name2 = document.createElement("td")

			const artistIDs = track.getElementsByTagName("MixArtist")
			const nameIDs = track.getElementsByTagName("MixName")

			artist1.innerText = artistIDs[0].innerHTML
			name1.innerText = nameIDs[0].innerHTML
			if (artistIDs.length > 1)
				artist2.innerText = artistIDs[1].innerHTML
			if (nameIDs.length > 1)
				name2.innerText = nameIDs[1].innerHTML

			trackObjs.forEach(str => {
				artist1.innerText = (str.id == artist1.innerText ? str.value : artist1.innerText)
				name1.innerText = (str.id == name1.innerText ? str.value : name1.innerText)
				artist2.innerText = (str.id == artist2.innerText ? str.value : artist2.innerText)
				name2.innerText = (str.id == name2.innerText ? str.value : name2.innerText)
			})

			tr.addEventListener("click", ev => {
				onSelection(ev)
			})

			$(tr).bind("dblclick",ev =>{
				openTrack(ev)
			})

			tr.appendChild(artist1)
			tr.appendChild(name1)
			tr.appendChild(artist2)
			tr.appendChild(name2)
			tbodyTracklisting.appendChild(tr)
			highlightActive()
			resolve()
		}
	})
}

function filterTracks(query: string):Promise<Element[]> {
	return new Promise(response => {
		visible = []
		let includedStrings: strObj[] = []

		for (let s of trackObjs) {
			if (s.value.toUpperCase().includes(query.toUpperCase())) {
				includedStrings.push(s)
			}
		}

		for (let track of tracks) {
			const artistIDs = Array.from(track.getElementsByTagName("MixArtist"))
			const nameIDs = Array.from(track.getElementsByTagName("MixName"))

			let included = false
			for (let i = 0; i < includedStrings.length && !included; i++) {
				for (let id of artistIDs) {
					if (id.innerHTML === includedStrings[i].id) {
						included = true;
						visible.push(track)
						break
					}
				}
				if (!included) {
					for (let id of nameIDs) {
						if (id.innerHTML === includedStrings[i].id) {
							included = true;
							visible.push(track)
							break
						}
					}
				}
			}
		}
		response(visible)
	})
}

$(".btnLoadExtracted").bind("click", async () => {
	const opts = { type: 'open-directory' };
	baseFolderHandle = await window.chooseFileSystemEntries(opts);
	const dirAudiotracks = await (await baseFolderHandle.getDirectory("AUDIO")).getDirectory("Audiotracks")
	const dirTrac = await (await baseFolderHandle.getDirectory("Text")).getDirectory("TRAC")

	showLoading()

	//trac strings
	const idFile: File = await (await dirTrac.getFile("TRACID.txt")).getFile()
	const textFile: File = await (await dirTrac.getFile("TRACE.txt")).getFile()
	const ids = await idFile.text()
	const textData = await textFile.text()

	let idArray = ids.split("\n")
	for (let i = 0; i < idArray.length; i++) {
		idArray[i] = idArray[i].replace("\r", "")
	}

	let textArray = textData.split("\0")

	trackObjs = []
	for (let i = 0; i < idArray.length; i++) {
		trackObjs.push({
			"id": idArray[i],
			"value": textArray[i]
		})
	}

	//tracklisting xml
	const xmlFile: File = await (await dirAudiotracks.getFile("tracklisting.xml")).getFile()
	const xml = await xmlFile.text()
	let xmlroot = new DOMParser()
	let elm = xmlroot.parseFromString(xml, "text/xml")
	tracks = Array.from(elm.children[0].children)
	visible = tracks

	//enable buttons
	$(".btnAdd").removeAttr("disabled")
	$(".btnUpdate").removeAttr("disabled")
	$(".btnLoadExtracted").removeClass("btn-primary")
	$(".btnLoadExtracted").addClass("btn-secondary")

	modified = true
	updateList()
	hideLoading()
})

$(".btnAdd").bind("click", async ev =>{
	//const opts = {accepts:[{description:"XML File",extensions:["xml"]}]}
	const opts = {type:"open-directory"}
	const handle = await window.chooseFileSystemEntries(opts);

	const xmlInfo:string = await (await (await handle.getFile("Info For Tracklisting.xml")).getFile()).text()
	const tracInfo:string = await (await (await handle.getFile("Info For TRAC.csv")).getFile()).text()

	//trac strings
	let lines = tracInfo.split("\n")

	//remove \r because windows
	for (let i = 0; i < lines.length; i++) {
		lines[i] = lines[i].replace("\r", "")
	}

	//filters out comments and empty lines
	lines = lines.filter(line =>{
		return !line.includes("//") && line.length > 0
	})

	lines.forEach(line =>{
		const tokens = line.split(",")
		if(tokens.length > 1){
			//split between id and value
			const id = tokens[0]
			const value = tokens[1]

			//check if string id already exists
			let present = false
			for(let obj of trackObjs){
				if(obj.id === id){
					present = true
					break
				}
			}
			if(!present){
				trackObjs.push({id:id,value:value})
			}else{
				console.error("STRING ERROR: a string with id", id, "is already present. Skipping")
			}
		}
	})


	//xml
	let xmlParser = new DOMParser()
	let newTracks = xmlParser.parseFromString(xmlInfo,"text/xml").children[0].children

	for(let newTrack of newTracks){
		let present = false
		let id = newTrack.getElementsByTagName("IDTag")[0].innerHTML

		//checks if newTrack is already added before
		for(let track of tracks){
			if(id === track.getElementsByTagName("IDTag")[0].innerHTML){
				present = true
				break
			}
		}
		if(!present){
			tracks.push(newTrack)
		}else{
			console.error("TRACKLISTING ERROR: a track with id", id, "is already present. Skipping")
		}
	}
	modified = true
	updateList()
})

$(".btnUpdate").bind("click", async ev => {
	if (tracks.length > 0 && trackObjs.length > 0) {
		const dirAudiotracks = await (await baseFolderHandle.getDirectory("AUDIO")).getDirectory("Audiotracks")
		const dirTrac = await (await baseFolderHandle.getDirectory("Text")).getDirectory("TRAC")

		//open file streams
		const trackStream = await (await dirAudiotracks.getFile("tracklisting.xml", { "create": true })).createWritable()
		const idStream = await (await dirTrac.getFile("TRACID.txt", { "create": true })).createWritable()
		const valueStream = await (await dirTrac.getFile("TRACE.txt", { "create": true })).createWritable()

		//create xml document to be serialized later
		let serializer = new XMLSerializer()
		let xmlDoc = document.implementation.createDocument(null, "TrackList", null)
		tracks.forEach(trac => {
			xmlDoc.documentElement.appendChild(trac)
		})

		//convert track objects to combined strings
		let combinedIds = ""
		let combinedValues = ""
		trackObjs.forEach(obj =>{
			if(obj.id !== "" && obj.value !== ""){
				combinedIds += obj.id + "\n"
				combinedValues += obj.value + "\0"
			}
		})
		await idStream.write(combinedIds)
		await valueStream.write(combinedValues)
		await trackStream.write(serializer.serializeToString(xmlDoc))

		await idStream.close()
		await valueStream.close()
		await trackStream.close()
		modified = false
	}
})

$("#inputSearch").bind("keyup", async ev => {
	if (ev.originalEvent.code === "Enter") {
		showLoading()
		setTimeout(() => {
			filterTracks(ev.target.value).then(list => visible = list)
			updateList()
			hideLoading()
		}, 1);
	} else if (ev.target.value == "") {
		showLoading()
		setTimeout(() => {
			visible = tracks
			updateList()
			hideLoading()
		}, 1);
	}
})

$(document).bind("keyup", ev => {
	if (ev.code === "Delete" && tbodyTracklisting.childElementCount > 0) {
		tbodyTracklisting.removeChild(tbodyTracklisting.children.item(selectedIndex))
		if (selectedIndex >= tbodyTracklisting.children.length) selectedIndex = tbodyTracklisting.children.length - 1
		highlightActive()
	}
	highlightActive()
})

$(window).bind("resize", () => {
	let bottom = parseFloat(getComputedStyle($("#divToolbar").get(0)).height)
	let top = parseFloat(getComputedStyle($("#navbar").get(0)).height)

	divTracklisting.style.height = (window.innerHeight - bottom - top).toString() + "px"
})

window.onbeforeunload = () => {
	return modified ? "yes" : null;
};

window.dispatchEvent(new Event("resize"))

