import ScriptBase from "./ScriptBase.js";
class ShowAdded extends ScriptBase {
    constructor(div, added) {
        super(div);
        this.title.innerText = "You're almost Done!";
        this.body.innerHTML = `Tracklisting and string data were updated successfully.
		Now you have to copy <code>CUSTOM/DJH2/CUS_###</code> for every custom that you added.<br>
		Here's the list of ids that you added:<br>`;
        let stuff = "";
        added.forEach(str => {
            stuff += str + "<br>";
        });
        this.body.innerHTML += `<code>${stuff}</code>`;
        this.show();
    }
}
export default ShowAdded;
