import ScriptBase from "./ScriptBase.js";
class CheckAPI extends ScriptBase {
    constructor(div) {
        super(div);
        this.title.innerText = "Native File System API not found";
        this.body.innerHTML = `DJHCP-PWA requires the experimental API "Native Fs" to be enabled on your browser.
		This API is only available currently for Chrome/Chromium Browsers. To enable it, goto ` +
            "<code>chrome://flags/#native-file-system-api</code>" +
            ` and enable it by clicking on the dropdown on the right`;
        if (window.chooseFileSystemEntries == undefined) {
            this.show();
            console.log("API NOT found");
        }
        else {
            console.log("API found");
        }
    }
}
export default CheckAPI;
