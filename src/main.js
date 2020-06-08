"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var divTracklisting = $("#divTracklisting").get(0);
var tbodyTracklisting = $("#tableTracklisting").get(0);
var tracks = [];
var visible = [];
var trackObjs = [];
var selectedIndex = 0;
var baseFolderHandle;
var modified = false;
var modalVisible = false;
function init() {
    if (window.chooseFileSystemEntries == undefined) {
        $("#modalAPINotFound").modal("show");
        console.log("API NOT found");
    }
    else {
        console.log("API found");
    }
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register("./sw.js")
                .then(function (registration) {
                console.log("Service Worker Registered", registration);
            }).catch(function (error) {
                console.error("Service Worker Error", error);
            });
        });
    }
    else {
        console.log("NO SERVICE WORKER SUPPORT");
    }
}
init();
function showLoading() {
    $("#divLoading").get(0).style.display = "none";
    $("#divLoading").get(0).style.display = "block";
}
function hideLoading() {
    $("#divLoading").get(0).style.display = "block";
    $("#divLoading").get(0).style.display = "none";
}
function onSelection(ev) {
    for (var i = 0; i < tbodyTracklisting.children.length; i++) {
        if (tbodyTracklisting.children[i] == ev.currentTarget)
            selectedIndex = i;
    }
    highlightActive();
}
function openTrack(ev) {
    var serializer = new XMLSerializer();
    $("#modalTextArea").val(serializer.serializeToString(visible[ev.currentTarget.rowIndex]));
    $("#modalTextEdit").one("hide.bs.modal", function () {
        var parser = new DOMParser();
        var doc = parser.parseFromString($("#modalTextArea").val(), "text/xml");
        var error = doc.children[0].getElementsByTagName("parsererror");
        if (error.length === 0) {
            var edit = visible[ev.currentTarget.rowIndex];
            tracks[tracks.indexOf(edit)] = doc.children[0];
            visible[ev.currentTarget.rowIndex] = doc.children[0];
        }
        else {
            console.error("XML Edit Error: found a parsing error when tryig to modify track data");
        }
        modalVisible = false;
    });
    $("#modalTextEdit").modal("show");
    modalVisible = true;
}
function highlightActive() {
    if (tbodyTracklisting.childElementCount > 0) {
        var items = tbodyTracklisting.children;
        var tag = "table-primary";
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            if (item.classList.contains(tag)) {
                item.classList.remove(tag);
            }
        }
        items[selectedIndex].classList.add(tag);
    }
}
function updateList() {
    return new Promise(function (resolve) {
        for (var i = tbodyTracklisting.childElementCount - 1; i >= 0; i--) {
            tbodyTracklisting.removeChild(tbodyTracklisting.children[i]);
        }
        var _loop_1 = function (track) {
            var tr = document.createElement("tr");
            var artist1 = document.createElement("td");
            var artist2 = document.createElement("td");
            var name1 = document.createElement("td");
            var name2 = document.createElement("td");
            var artistIDs = track.getElementsByTagName("MixArtist");
            var nameIDs = track.getElementsByTagName("MixName");
            artist1.innerText = artistIDs[0].innerHTML;
            name1.innerText = nameIDs[0].innerHTML;
            if (artistIDs.length > 1)
                artist2.innerText = artistIDs[1].innerHTML;
            if (nameIDs.length > 1)
                name2.innerText = nameIDs[1].innerHTML;
            trackObjs.forEach(function (str) {
                artist1.innerText = (str.id == artist1.innerText ? str.value : artist1.innerText);
                name1.innerText = (str.id == name1.innerText ? str.value : name1.innerText);
                artist2.innerText = (str.id == artist2.innerText ? str.value : artist2.innerText);
                name2.innerText = (str.id == name2.innerText ? str.value : name2.innerText);
            });
            tr.addEventListener("click", function (ev) {
                onSelection(ev);
            });
            $(tr).bind("dblclick", function (ev) {
                openTrack(ev);
            });
            tr.appendChild(artist1);
            tr.appendChild(name1);
            tr.appendChild(artist2);
            tr.appendChild(name2);
            tbodyTracklisting.appendChild(tr);
            highlightActive();
            resolve();
        };
        for (var _i = 0, visible_1 = visible; _i < visible_1.length; _i++) {
            var track = visible_1[_i];
            _loop_1(track);
        }
    });
}
function filterTracks(query) {
    return new Promise(function (response) {
        visible = [];
        var includedStrings = [];
        for (var _i = 0, trackObjs_1 = trackObjs; _i < trackObjs_1.length; _i++) {
            var s = trackObjs_1[_i];
            if (s.value.toUpperCase().includes(query.toUpperCase())) {
                includedStrings.push(s);
            }
        }
        for (var _a = 0, tracks_1 = tracks; _a < tracks_1.length; _a++) {
            var track = tracks_1[_a];
            var artistIDs = Array.from(track.getElementsByTagName("MixArtist"));
            var nameIDs = Array.from(track.getElementsByTagName("MixName"));
            var included = false;
            for (var i = 0; i < includedStrings.length && !included; i++) {
                for (var _b = 0, artistIDs_1 = artistIDs; _b < artistIDs_1.length; _b++) {
                    var id = artistIDs_1[_b];
                    if (id.innerHTML === includedStrings[i].id) {
                        included = true;
                        visible.push(track);
                        break;
                    }
                }
                if (!included) {
                    for (var _c = 0, nameIDs_1 = nameIDs; _c < nameIDs_1.length; _c++) {
                        var id = nameIDs_1[_c];
                        if (id.innerHTML === includedStrings[i].id) {
                            included = true;
                            visible.push(track);
                            break;
                        }
                    }
                }
            }
        }
        response(visible);
    });
}
$(".btnLoadExtracted").bind("click", function () { return __awaiter(void 0, void 0, void 0, function () {
    var opts, dirAudiotracks, dirTrac, idFile, textFile, ids, textData, idArray, i, textArray, i, xmlFile, xml, xmlroot, elm;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                opts = { type: 'open-directory' };
                return [4 /*yield*/, window.chooseFileSystemEntries(opts)];
            case 1:
                baseFolderHandle = _a.sent();
                return [4 /*yield*/, baseFolderHandle.getDirectory("AUDIO")];
            case 2: return [4 /*yield*/, (_a.sent()).getDirectory("Audiotracks")];
            case 3:
                dirAudiotracks = _a.sent();
                return [4 /*yield*/, baseFolderHandle.getDirectory("Text")];
            case 4: return [4 /*yield*/, (_a.sent()).getDirectory("TRAC")];
            case 5:
                dirTrac = _a.sent();
                showLoading();
                return [4 /*yield*/, dirTrac.getFile("TRACID.txt")];
            case 6: return [4 /*yield*/, (_a.sent()).getFile()];
            case 7:
                idFile = _a.sent();
                return [4 /*yield*/, dirTrac.getFile("TRACE.txt")];
            case 8: return [4 /*yield*/, (_a.sent()).getFile()];
            case 9:
                textFile = _a.sent();
                return [4 /*yield*/, idFile.text()];
            case 10:
                ids = _a.sent();
                return [4 /*yield*/, textFile.text()];
            case 11:
                textData = _a.sent();
                idArray = ids.split("\n");
                for (i = 0; i < idArray.length; i++) {
                    idArray[i] = idArray[i].replace("\r", "");
                }
                textArray = textData.split("\0");
                trackObjs = [];
                for (i = 0; i < idArray.length; i++) {
                    trackObjs.push({
                        "id": idArray[i],
                        "value": textArray[i]
                    });
                }
                return [4 /*yield*/, dirAudiotracks.getFile("tracklisting.xml")];
            case 12: return [4 /*yield*/, (_a.sent()).getFile()];
            case 13:
                xmlFile = _a.sent();
                return [4 /*yield*/, xmlFile.text()];
            case 14:
                xml = _a.sent();
                xmlroot = new DOMParser();
                elm = xmlroot.parseFromString(xml, "text/xml");
                tracks = Array.from(elm.children[0].children);
                visible = tracks;
                //enable buttons
                $(".btnAdd").removeAttr("disabled");
                $(".btnUpdate").removeAttr("disabled");
                $(".btnLoadExtracted").removeClass("btn-primary");
                $(".btnLoadExtracted").addClass("btn-secondary");
                modified = true;
                updateList();
                hideLoading();
                return [2 /*return*/];
        }
    });
}); });
$(".btnAdd").bind("click", function (ev) { return __awaiter(void 0, void 0, void 0, function () {
    var opts, handle, xmlInfo, tracInfo, lines, i, xmlParser, newTracks, _i, newTracks_1, newTrack, present, id, _a, tracks_2, track;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                opts = { type: "open-directory" };
                return [4 /*yield*/, window.chooseFileSystemEntries(opts)];
            case 1:
                handle = _b.sent();
                return [4 /*yield*/, handle.getFile("Info For Tracklisting.xml")];
            case 2: return [4 /*yield*/, (_b.sent()).getFile()];
            case 3: return [4 /*yield*/, (_b.sent()).text()];
            case 4:
                xmlInfo = _b.sent();
                return [4 /*yield*/, handle.getFile("Info For TRAC.csv")];
            case 5: return [4 /*yield*/, (_b.sent()).getFile()];
            case 6: return [4 /*yield*/, (_b.sent()).text()
                //trac strings
            ];
            case 7:
                tracInfo = _b.sent();
                lines = tracInfo.split("\n");
                //remove \r because windows
                for (i = 0; i < lines.length; i++) {
                    lines[i] = lines[i].replace("\r", "");
                }
                //filters out comments and empty lines
                lines = lines.filter(function (line) {
                    return !line.includes("//") && line.length > 0;
                });
                lines.forEach(function (line) {
                    var tokens = line.split(",");
                    if (tokens.length > 1) {
                        //split between id and value
                        var id = tokens[0];
                        var value = tokens[1];
                        //check if string id already exists
                        var present = false;
                        for (var _i = 0, trackObjs_2 = trackObjs; _i < trackObjs_2.length; _i++) {
                            var obj = trackObjs_2[_i];
                            if (obj.id === id) {
                                present = true;
                                break;
                            }
                        }
                        if (!present) {
                            trackObjs.push({ id: id, value: value });
                        }
                        else {
                            console.error("STRING ERROR: a string with id", id, "is already present. Skipping");
                        }
                    }
                });
                xmlParser = new DOMParser();
                newTracks = xmlParser.parseFromString(xmlInfo, "text/xml").children[0].children;
                for (_i = 0, newTracks_1 = newTracks; _i < newTracks_1.length; _i++) {
                    newTrack = newTracks_1[_i];
                    present = false;
                    id = newTrack.getElementsByTagName("IDTag")[0].innerHTML;
                    //checks if newTrack is already added before
                    for (_a = 0, tracks_2 = tracks; _a < tracks_2.length; _a++) {
                        track = tracks_2[_a];
                        if (id === track.getElementsByTagName("IDTag")[0].innerHTML) {
                            present = true;
                            break;
                        }
                    }
                    if (!present) {
                        tracks.push(newTrack);
                    }
                    else {
                        console.error("TRACKLISTING ERROR: a track with id", id, "is already present. Skipping");
                    }
                }
                modified = true;
                updateList();
                return [2 /*return*/];
        }
    });
}); });
$(".btnUpdate").bind("click", function (ev) { return __awaiter(void 0, void 0, void 0, function () {
    var dirAudiotracks, dirTrac, trackStream, idStream, valueStream, serializer, xmlDoc_1, combinedIds_1, combinedValues_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(tracks.length > 0 && trackObjs.length > 0)) return [3 /*break*/, 17];
                showLoading();
                return [4 /*yield*/, baseFolderHandle.getDirectory("AUDIO")];
            case 1: return [4 /*yield*/, (_a.sent()).getDirectory("Audiotracks")];
            case 2:
                dirAudiotracks = _a.sent();
                return [4 /*yield*/, baseFolderHandle.getDirectory("Text")];
            case 3: return [4 /*yield*/, (_a.sent()).getDirectory("TRAC")
                //open file streams
            ];
            case 4:
                dirTrac = _a.sent();
                return [4 /*yield*/, dirAudiotracks.getFile("tracklisting.xml", { "create": true })];
            case 5: return [4 /*yield*/, (_a.sent()).createWritable()];
            case 6:
                trackStream = _a.sent();
                return [4 /*yield*/, dirTrac.getFile("TRACID.txt", { "create": true })];
            case 7: return [4 /*yield*/, (_a.sent()).createWritable()];
            case 8:
                idStream = _a.sent();
                return [4 /*yield*/, dirTrac.getFile("TRACE.txt", { "create": true })];
            case 9: return [4 /*yield*/, (_a.sent()).createWritable()
                //create xml document to be serialized later
            ];
            case 10:
                valueStream = _a.sent();
                serializer = new XMLSerializer();
                xmlDoc_1 = document.implementation.createDocument(null, "TrackList", null);
                tracks.forEach(function (trac) {
                    xmlDoc_1.documentElement.appendChild(trac);
                });
                combinedIds_1 = "";
                combinedValues_1 = "";
                trackObjs.forEach(function (obj) {
                    if (obj.id !== "" && obj.value !== "") {
                        combinedIds_1 += obj.id + "\n";
                        combinedValues_1 += obj.value + "\0";
                    }
                });
                return [4 /*yield*/, idStream.write(combinedIds_1)];
            case 11:
                _a.sent();
                return [4 /*yield*/, valueStream.write(combinedValues_1)];
            case 12:
                _a.sent();
                return [4 /*yield*/, trackStream.write(serializer.serializeToString(xmlDoc_1))];
            case 13:
                _a.sent();
                return [4 /*yield*/, idStream.close()];
            case 14:
                _a.sent();
                return [4 /*yield*/, valueStream.close()];
            case 15:
                _a.sent();
                return [4 /*yield*/, trackStream.close()];
            case 16:
                _a.sent();
                modified = false;
                hideLoading();
                _a.label = 17;
            case 17: return [2 /*return*/];
        }
    });
}); });
$("#inputSearch").bind("keyup", function (ev) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (ev.originalEvent.code === "Enter") {
            selectedIndex = 0;
            showLoading();
            setTimeout(function () {
                filterTracks(ev.target.value).then(function (list) { return visible = list; });
                updateList();
                hideLoading();
            }, 1);
        }
        else if (ev.target.value == "") {
            selectedIndex = 0;
            showLoading();
            setTimeout(function () {
                visible = tracks;
                updateList();
                hideLoading();
            }, 1);
        }
        return [2 /*return*/];
    });
}); });
$(document).bind("keyup", function (ev) {
    if (ev.code === "Delete" && tbodyTracklisting.childElementCount > 0 && !modalVisible) {
        tbodyTracklisting.removeChild(tbodyTracklisting.children.item(selectedIndex));
        if (selectedIndex >= tbodyTracklisting.children.length)
            selectedIndex = tbodyTracklisting.children.length - 1;
        highlightActive();
    }
    highlightActive();
});
$(window).bind("resize", function () {
    var bottom = parseFloat(getComputedStyle($("#divToolbar").get(0)).height);
    var top = parseFloat(getComputedStyle($("#navbar").get(0)).height);
    divTracklisting.style.height = (window.innerHeight - bottom - top).toString() + "px";
});
window.onbeforeunload = function () {
    return modified ? "yes" : null;
};
window.dispatchEvent(new Event("resize"));
