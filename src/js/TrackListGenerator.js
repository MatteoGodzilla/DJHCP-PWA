import ScriptBase from "./ScriptBase.js";
class TrackListGenerator extends ScriptBase {
    constructor(div) {
        super(div);
        this.inputs = [];
        this.init();
        this.show();
    }
    init() {
        this.title.innerText = "TrackList xml generator";
        this.setButtons("Submit-Close");
        const fields = ["ID", "BPM", "Artist 1", "Name 1", "Artist 2", "Name 2", "Mixed by (MixHeadlineDJName)", "Mixer presents (MixHeadline)",
            "DeckSpeed", "General Dificulty", "Tap Difficulty", "Crossfade difficulty", "Scratch difficulty"];
        const whitelist = ["BPM", "DeckSpeed", "General Dificulty", "Tap Difficulty", "Crossfade difficulty", "Scratch difficulty"];
        fields.forEach(str => {
            let input = document.createElement("input");
            input.placeholder = str;
            input.classList.add("w-100", "m-1");
            if (whitelist.includes(str)) {
                input.type = "number";
            }
            this.inputs.push(input);
            this.body.appendChild(input);
            this.body.appendChild(document.createElement("br"));
        });
        let warning = document.createElement("label");
        warning.innerText = "Note: The DeckSpeed Field refers to the final speed of the chart, NOT the DeckSpeed multiplier";
        this.body.appendChild(warning);
    }
    onSubmit() {
        let { trackData, stringData } = this.convertData();
        for (let i = this.body.children.length - 1; i >= 0; i--) {
            this.body.removeChild(this.body.children[i]);
        }
        let textAreaTrack = document.createElement("textarea");
        textAreaTrack.value = trackData;
        textAreaTrack.classList.add("w-100");
        textAreaTrack.rows = 10;
        let textAreaStrings = document.createElement("textarea");
        textAreaStrings.value = stringData;
        textAreaTrack.classList.add("w-100");
        textAreaStrings.rows = 6;
        this.body.appendChild(textAreaTrack);
        this.body.appendChild(textAreaStrings);
        this.setButtons("Close");
    }
    convertData() {
        let doc = document.implementation.createDocument(null, "TrackList", null);
        let track = doc.createElement("Track");
        const artistPrefix = "DJHCP_ARTIST_";
        const namePrefix = "DJHCP_TRACK_";
        const mixerPrefix = "DJHCP_MIXER_";
        let artist1ID = artistPrefix + this.inputs[2].value.replace(" ", "_").toUpperCase();
        let name1ID = namePrefix + this.inputs[3].value.replace(" ", "_").toUpperCase();
        let artist2ID = artistPrefix + this.inputs[4].value.replace(" ", "_").toUpperCase();
        let name2ID = namePrefix + this.inputs[5].value.replace(" ", "_").toUpperCase();
        let mixerDJID = mixerPrefix + this.inputs[6].value.replace(" ", "_").toUpperCase();
        let mixerHeadlineID = mixerPrefix + this.inputs[7].value.replace(" ", "_").toUpperCase();
        let multiplier = 1.0;
        if (Number(this.inputs[1].value) > 0 && Number(this.inputs[8].value) > 0) {
            multiplier = Number(this.inputs[8].value) / Number(this.inputs[1].value);
        }
        //creating elements
        let IDnode = doc.createElement("IDTag");
        let leaderboardNode = doc.createElement("LeaderboardID");
        let tutorialNode = doc.createElement("IsTutorialTrack");
        let vocalNode = doc.createElement("HasVocalMarkup");
        let folderNode = doc.createElement("FolderLocation");
        let BPMNode = doc.createElement("BPM");
        let artist1Node = doc.createElement("MixArtist");
        let name1Node = doc.createElement("MixName");
        let artist2Node = doc.createElement("MixArtist");
        let name2Node = doc.createElement("MixName");
        let mixDJNameNode = doc.createElement("MixHeadlineDJName");
        let mixHeadlineNode = doc.createElement("MixHeadline");
        let trackDiffNode = doc.createElement("TrackComplexity");
        let tapDiffNode = doc.createElement("TapComplexity");
        let crossDiffNode = doc.createElement("CrossfadeComplexity");
        let scratchDiffNode = doc.createElement("ScratchComplexity");
        //setting up elements data
        IDnode.innerHTML = this.inputs[0].value;
        tutorialNode.innerHTML = "0";
        vocalNode.innerHTML = "0";
        BPMNode.innerHTML = this.inputs[1].value;
        folderNode.innerHTML = "AUDIO/Audiotracks/";
        artist1Node.innerHTML = artist1ID !== artistPrefix ? artist1ID : "";
        name1Node.innerHTML = name1ID !== namePrefix ? name1ID : "";
        artist2Node.innerHTML = artist2ID !== artistPrefix ? artist2ID : "";
        name2Node.innerHTML = name2ID !== namePrefix ? name2ID : "";
        mixDJNameNode.innerHTML = mixerDJID !== mixerPrefix ? mixerDJID : "";
        mixHeadlineNode.innerHTML = mixerHeadlineID !== mixerPrefix ? mixerHeadlineID : "";
        trackDiffNode.innerHTML = this.inputs[9].value;
        tapDiffNode.innerHTML = this.inputs[10].value;
        crossDiffNode.innerHTML = this.inputs[11].value;
        scratchDiffNode.innerHTML = this.inputs[12].value;
        //creating actual structure
        track.appendChild(IDnode);
        track.appendChild(leaderboardNode);
        track.appendChild(tutorialNode);
        track.appendChild(vocalNode);
        track.appendChild(BPMNode);
        track.appendChild(folderNode);
        for (let i = 0; i < 5; i++) {
            let deckSpeedNode = doc.createElement("DeckSpeedMultiplier");
            deckSpeedNode.setAttribute("Difficulty", i.toString());
            deckSpeedNode.innerHTML = multiplier.toString();
            track.appendChild(deckSpeedNode);
        }
        track.appendChild(trackDiffNode);
        track.appendChild(tapDiffNode);
        track.appendChild(crossDiffNode);
        track.appendChild(scratchDiffNode);
        track.appendChild(mixHeadlineNode);
        track.appendChild(mixDJNameNode);
        track.appendChild(artist1Node);
        if (this.inputs[4].value !== "")
            track.appendChild(artist2Node);
        track.appendChild(name1Node);
        if (this.inputs[5].value !== "")
            track.appendChild(name2Node);
        doc.children[0].appendChild(track);
        //output data
        let trackData = new XMLSerializer().serializeToString(doc);
        let stringData = "";
        if (artist1ID !== artistPrefix && name1ID !== namePrefix) {
            stringData += artist1ID + "," + this.inputs[2].value + "\n" + name1ID + "," + this.inputs[3].value + "\n";
        }
        if (artist2ID !== artistPrefix && name2ID !== namePrefix) {
            stringData += artist2ID + "," + this.inputs[4].value + "\n" + name2ID + "," + this.inputs[5].value + "\n";
        }
        if (mixerDJID !== mixerPrefix) {
            stringData += mixerDJID + "," + this.inputs[6].value + "\n";
        }
        if (mixerHeadlineID !== mixerPrefix && mixerHeadlineID !== mixerDJID) {
            stringData += mixerHeadlineID + "," + this.inputs[7].value + "\n";
        }
        return { trackData: trackData, stringData: stringData };
    }
}
export default TrackListGenerator;
