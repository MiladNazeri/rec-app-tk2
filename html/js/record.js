"use strict";

//
//  record.js
//
//  Created by David Rowe on 5 Apr 2017.
//  Copyright 2017 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

var isUsingToolbar = false,
    isDisplayingInstructions = false,
    isRecording = false,
    numberOfPlayers = 0,
    // recordingsBeingPlayed = [],
    recordingsLoaded = [],
    playersThatAreLoaded,
    elRecordings,
    elRecordingsTable,
    elRecordingsList,
    elInstructions,
    elPlayersUnused,
    elHideInfoButton,
    elShowInfoButton,

    elLoadButton,
    elRecordButton,
    elPlayButton,
    elPauseButton,
    elStartButton,
    elEndButton,

    elSpinner,
    elCountdownNumber,
    elFinishOnOpen,
    elFinishOnOpenLabel,
    elLoopRecordings,
    elLoopRecordingsLabel,
    playFromCurrentLocation,
    playFromCurrentLocationLabel,
    EVENT_BRIDGE_TYPE = "record",
    BODY_LOADED_ACTION = "bodyLoaded",
    USING_TOOLBAR_ACTION = "usingToolbar",
    // RECORDINGS_BEING_PLAYED_ACTION = "recordingsBeingPlayed",
    RECORDINGS_LOADED_ACTION = "recordingsLoaded",
    // PLAYERS_THAT_ARE_LOADED_ACTION = "playersThatAreLoaded",
    NUMBER_OF_PLAYERS_ACTION = "numberOfPlayers",
    REMOVE_RECORDING_ACTION = "removeRecordingAction",
    // STOP_PLAYING_RECORDING_ACTION = "stopPlayingRecording",
    LOAD_RECORDING_ACTION = "loadRecording",
    START_RECORDING_ACTION = "startRecording",
    STOP_RECORDING_ACTION = "stopRecording",
    STOP_RECORDINGS_ACTION = "stopRecordings",
    PLAY_RECORDINGS_ACTION = "playRecordings",
    PAUSE_RECORDINGS_ACTION = "pauseRecordings",
    START_OF_RECORDINGS_ACTION = "startOfRecordings",
    END_OF_RECORDINGS_ACTION = "endOfRecordings",

    SET_COUNTDOWN_NUMBER_ACTION = "setCountdownNumber",

    LOOP_RECORDINGS_ACTION = "loopRecordings",
    PLAY_FROM_CURRENT_LOCATION_ACTION = "playFromCurrentLocation",
    FINISH_ON_OPEN_ACTION = "finishOnOpen";


function removeRecording(event) {
    var playerID = event.target.getAttribute("playerID");
    EventBridge.emitWebEvent(JSON.stringify({
        type: EVENT_BRIDGE_TYPE,
        action: REMOVE_RECORDING_ACTION,
        value: playerID
    }));
}

function changeFileName(event) {}
function changeOffsetTime(event) {}
function changeInTime(event) {}


function updatePlayersUnused() {
    elPlayersUnused.innerHTML = numberOfPlayers - recordingsLoaded.length;
}

function updateRecordings() {
    var tbody,
        tr,
        td,
        input,
        fileNameInput,
        offsetInput,
        inTimeInput,
        ths,
        trs,
        tds,
        length,
        i,
        HIFI_GLYPH_CLOSE = "w",
        recordingsLoadedTest = [
            {
                fileName: "abcabcabcabcabcabc",
                playerId: "a",
                clipTime: "00.00",
                offSetTime: "00.00",
                inTime: "00.00"
            },
            {
                fileName: "b",
                playerId: "a",
                clipTime: "00.00",
                offSetTime: "00.00",
                inTime: "00.00"
            },
            // {
            //     fileName: "fileName2",
            //     playerId: "playerId",
            //     clipTime: "00.00",
            //     offSetTime: "00.0013123123",
            //     inTime: "00.00"
            // }
        ];
    tbody = document.createElement("tbody");
    tbody.id = "recordings-list";


    // <tr><td>Filename</td><td><input type="button" class="glyph red" value="w" playerID=id /></td></tr>
    // <tr><td>Filename</td><td><input type="button" class="glyph red" value="w" playerID=id /></td></tr>

    for (i = 0, length = recordingsLoaded.length; i < length; i += 1) {
        // alert(JSON.stringify(recordingsLoadedTest[i]) + " ::: " + i)
        tr = document.createElement("tr");

        td = document.createElement("td");
        fileNameInput = document.createElement("input");
        fileNameInput.setAttribute("type", "text");
        fileNameInput.setAttribute("size", 10);
        fileNameInput.setAttribute("class", "record-edit-input");
        fileNameInput.setAttribute("value", recordingsLoaded[i].fileName);
        // fileNameInput.setAttribute("placeholder", recordingsLoaded[i].fileName);
        fileNameInput.addEventListener("change", changeFileName);
        td.appendChild(fileNameInput);
        // td.innerHTML = recordingsLoadedTest[i].filename.slice(4);
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = recordingsLoaded[i].clipTime;
        tr.appendChild(td);

        td = document.createElement("td");
        offsetInput = document.createElement("input");
        offsetInput.setAttribute("type", "text");
        offsetInput.setAttribute("size", 5);
        offsetInput.setAttribute("class", "record-edit-input");
        offsetInput.setAttribute("value", recordingsLoaded[i].offSetTime);
        offsetInput.addEventListener("change", changeOffsetTime);
        td.appendChild(offsetInput);
        tr.appendChild(td);

        td = document.createElement("td");
        inTimeInput = document.createElement("input");
        inTimeInput.setAttribute("type", "text");
        inTimeInput.setAttribute("size", 5);
        inTimeInput.setAttribute("class", "record-edit-input");
        inTimeInput.setAttribute("value", recordingsLoaded[i].inTime);
        inTimeInput.addEventListener("change", changeInTime);
        td.appendChild(inTimeInput);
        tr.appendChild(td);

        td = document.createElement("td");
        input = document.createElement("input");
        input.setAttribute("type", "button");
        input.setAttribute("class", "glyph red");
        input.setAttribute("value", HIFI_GLYPH_CLOSE);
        input.setAttribute("playerID", recordingsLoaded[i].playerID);
        input.addEventListener("click", removeRecording);
        td.appendChild(input);
        tr.appendChild(td);

        tbody.appendChild(tr);
    }

    // Empty rows representing available players.
    for (i = recordingsLoaded.length, length = numberOfPlayers; i < length; i += 1) {
        // alert(numberOfPlayers);
        tr = document.createElement("tr");
        td = document.createElement("td");
        td.colSpan = 5;
        tr.appendChild(td);
        tbody.appendChild(tr);
    }

    // Filler row for extra table space.
    tr = document.createElement("tr");
    tr.classList.add("filler");
    td = document.createElement("td");
    td.colSpan = 5;
    tr.appendChild(td);
    tbody.appendChild(tr);

    // Update table content.
    elRecordingsTable.replaceChild(tbody, elRecordingsList);
    elRecordingsList = document.getElementById("recordings-list");

    // Update header cell widths to match content widths.
    // ths = document.querySelectorAll("#recordings-table thead th");
    // trs = document.querySelectorAll("#recordings-table tbody tr");
    //
    // var largestWidthsArray = [];
    // for (i = 0; i < trs.length; i += 1) {
    //     // tds = Array.prototype.slice.call(trs[i].children);
    //     tds = trs[i].children;
    //     // alert(JSON.stringify(tds))
    //     // alert(JSON.stringify(tds[0]));
    //     for (var j = 0; j < tds.length; j += 1){
    //         // alert(tds[j].offSetWidth);
    //         largestWidthsArray[j] = largestWidthsArray[j] > tds[j].offSetWidth
    //         ? largestWidthsArray[j]
    //         : tds[j].offSetWidth;
    //     }
    // }
    // for (i = 0; i < ths.legnth; i += 1 ){
    //     ths[i].width = largestWidthsArray[i];
    //
    // }

}

function updateInstructions() {
    // Display show/hide instructions buttons if players are available.
    if (numberOfPlayers === 0) {
        elHideInfoButton.classList.add("hidden");
        elShowInfoButton.classList.add("hidden");
    } else {
        elHideInfoButton.classList.remove("hidden");
        elShowInfoButton.classList.remove("hidden");
    }

    // Display instructions if user requested or no players available.
    if (isDisplayingInstructions || numberOfPlayers === 0) {
        elRecordingsList.classList.add("hidden");
        elInstructions.classList.remove("hidden");
    } else {
        elInstructions.classList.add("hidden");
        elRecordingsList.classList.remove("hidden");
    }
}

function showInstructions() {
    isDisplayingInstructions = true;
    updateInstructions();
}

function hideInstructions() {
    isDisplayingInstructions = false;
    updateInstructions();
}
// done
function updateLoadButton() {
    if (isRecording || numberOfPlayers <= recordingsLoaded.length) {
        elLoadButton.setAttribute("disabled", "disabled");
    } else {
        elLoadButton.removeAttribute("disabled");
    }
}

function updateSpinner() {
    if (isRecording) {
        elRecordings.classList.add("hidden");
        elSpinner.classList.remove("hidden");
    } else {
        elSpinner.classList.add("hidden");
        elRecordings.classList.remove("hidden");
    }
}

function updateFinishOnOpenLabel() {
    var WINDOW_FINISH_ON_OPEN_LABEL = "Stop recording automatically when reopen this window",
        TABLET_FINISH_ON_OPEN_LABEL = "Stop recording automatically when reopen tablet or window";

    elFinishOnOpenLabel.innerHTML = isUsingToolbar ? WINDOW_FINISH_ON_OPEN_LABEL : TABLET_FINISH_ON_OPEN_LABEL;
}

function onScriptEventReceived(data) {
    var message = JSON.parse(data);
    if (message.type === EVENT_BRIDGE_TYPE) {
        switch (message.action) {
        case USING_TOOLBAR_ACTION:
            isUsingToolbar = message.value;
            updateFinishOnOpenLabel();
            break;
        case FINISH_ON_OPEN_ACTION:
            elFinishOnOpen.checked = message.value;
            break;
        case START_RECORDING_ACTION:
            isRecording = true;
            elRecordButton.value = "Stop";
            updateSpinner();
            updateLoadButton();
            break;
        case SET_COUNTDOWN_NUMBER_ACTION:
            elCountdownNumber.innerHTML = message.value;
            break;
        // case REMOVE_RECORDING_ACTION:
        //     isRecording = false;
        //     elRecordButton.value = "Record";
        //     updateSpinner();
        //     updateLoadButton();
        //     break;
        case STOP_RECORDING_ACTION:
            isRecording = false;
            elRecordButton.value = "Record";
            updateSpinner();
            updateLoadButton();
            break;
        case RECORDINGS_LOADED_ACTION:
            recordingsLoaded = JSON.parse(message.value);
            updateRecordings();
            updatePlayersUnused();
            updateInstructions();
            updateLoadButton();
            break;
        // case RECORDINGS_BEING_PLAYED_ACTION:recordingsLoaded
        //     recordingsBeingPlayed = JSON.parse(message.value);
        //     updateRecordings();
        //     updatePlayersUnused();
        //     updateInstructions();
        //     updateLoadButton();
        //     break;
        case PLAYERS_THAT_ARE_LOADED_ACTION:
            playersThatAreLoaded = JSON.parse(message.value);
            updateRecordings();
            updatePlayersUnused();
            updateInstructions();
            updateLoadButton();
            break;
        case NUMBER_OF_PLAYERS_ACTION:
            numberOfPlayers = message.value;
            updateRecordings();
            updatePlayersUnused();
            updateInstructions();
            updateLoadButton();
            break;
        }
    }
}

function onLoadButtonClicked() {
    EventBridge.emitWebEvent(JSON.stringify({
        type: EVENT_BRIDGE_TYPE,
        action: LOAD_RECORDING_ACTION
    }));
}

function onRecordButtonClicked() {
    if (!isRecording) {
        elRecordButton.value = "Stop";
        EventBridge.emitWebEvent(JSON.stringify({
            type: EVENT_BRIDGE_TYPE,
            action: START_RECORDING_ACTION
        }));
        isRecording = true;
        updateSpinner();
        updateLoadButton();
    } else {
        elRecordButton.value = "Record";
        EventBridge.emitWebEvent(JSON.stringify({
            type: EVENT_BRIDGE_TYPE,
            action: STOP_RECORDING_ACTION
        }));
        isRecording = false;
        updateSpinner();
        updateLoadButton();
    }
}

function onPlayButtonClicked() {
    EventBridge.emitWebEvent(JSON.stringify({
        type: EVENT_BRIDGE_TYPE,
        action: PLAY_RECORDING_ACTION
    }));
}

function onPauseButtonClicked() {
    EventBridge.emitWebEvent(JSON.stringify({
        type: EVENT_BRIDGE_TYPE,
        action: PAUSE_RECORDING_ACTION
    }));
}

function onStartButtonClicked() {
    EventBridge.emitWebEvent(JSON.stringify({
        type: EVENT_BRIDGE_TYPE,
        action: START_OF_RECORDING_ACTION
    }));
}

function onEndButtonClicked() {
    EventBridge.emitWebEvent(JSON.stringify({
        type: EVENT_BRIDGE_TYPE,
        action: END_OF_RECORDING_ACTION
    }));
}

function onFinishOnOpenClicked() {
    EventBridge.emitWebEvent(JSON.stringify({
        type: EVENT_BRIDGE_TYPE,
        action: FINISH_ON_OPEN_ACTION,
        value: elFinishOnOpen.checked
    }));
}

function onLoopRecordingsClicked() {
    EventBridge.emitWebEvent(JSON.stringify({
        type: EVENT_BRIDGE_TYPE,
        action: LOOP_RECORDINGS_ACTION,
        value: elLoopRecordings.checked
    }));
}

function onPlayFromCurrentLocationClicked() {
    EventBridge.emitWebEvent(JSON.stringify({
        type: EVENT_BRIDGE_TYPE,
        action: PLAY_FROM_CURRENT_LOCATION_ACTION,
        value: playFromCurrentLocation.checked
    }));
}


function signalBodyLoaded() {
    EventBridge.emitWebEvent(JSON.stringify({
        type: EVENT_BRIDGE_TYPE,
        action: BODY_LOADED_ACTION
    }));
}

function onBodyLoaded() {

    EventBridge.scriptEventReceived.connect(onScriptEventReceived);

    elRecordings = document.getElementById("recordings");

    elRecordingsTable = document.getElementById("recordings-table");
    elRecordingsList = document.getElementById("recordings-list");
    elInstructions = document.getElementById("instructions");
    elPlayersUnused = document.getElementById("players-unused");

    elHideInfoButton = document.getElementById("hide-info-button");
    elHideInfoButton.onclick = hideInstructions;
    elShowInfoButton = document.getElementById("show-info-button");
    elShowInfoButton.onclick = showInstructions;

    elLoadButton = document.getElementById("load-button");
    elLoadButton.onclick = onLoadButtonClicked;
    elRecordButton = document.getElementById("record-button");
    elRecordButton.onclick = onRecordButtonClicked;
    elPlayButton = document.getElementById("play-button");
    elPlayButton.onclick = onPlayButtonClicked;

    elPauseButton = document.getElementById("pause-button");
    elPauseButton.onclick = onPauseButtonClicked;
    elStartButton = document.getElementById("start-button");
    elStartButton.onclick = onStartButtonClicked;
    elEndButton = document.getElementById("end-button");
    elEndButton.onclick = onEndButtonClicked;

    elSpinner = document.getElementById("spinner");
    elCountdownNumber = document.getElementById("countdown-number");

    elFinishOnOpen = document.getElementById("finish-on-open");
    elFinishOnOpen.onclick = onFinishOnOpenClicked;

    elFinishOnOpenLabel = document.getElementById("finish-on-open-label");

    elLoopRecordings = document.getElementById("loop-recordings");
    elLoopRecordings.onclick = onLoopRecordingsClicked;

    elLoopRecordingsLabel = document.getElementById("loop-recordings-label");

    playFromCurrentLocation = document.getElementById("play-from-current-location");
    playFromCurrentLocation.onclick = onPlayFromCurrentLocationClicked;

    playFromCurrentLocationLabel = document.getElementById("play-from-current-location-label");


    signalBodyLoaded();
}
