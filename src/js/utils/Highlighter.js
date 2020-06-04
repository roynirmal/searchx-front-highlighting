import TextHighlighter from 'texthighlighter';
import React from "react";
import AccountStore from "../stores/AccountStore"

// function getId() {
//     let userNode = document.getElementById('user');
//     let userId = userNode.textContent.split('-')[1].trim();
//     let documentNode = document.getElementById('document');
//     let documentId = documentNode.textContent.split('-')[1].trim();
//     return userId + '_' + documentId
// }

let highlighterOptions = {
    color: '#fcf8e3',
    onBeforeHighlight: function (range) {
        // console.log(window.confirm('Selected text: ' + range + '\nReally highlight?'));
        return window.confirm('Selected text: ' + range + '\nReally highlight?');
    },
    onAfterHighlight: function (range, highlights) {
        updateHighlights(highlights);
        window.alert('Created ' + highlights.length + ' highlight(s): ' + highlights.map(function (h) {
            return '"' + h.innerText + '"';
        }).join(''));
    }
};

export let highlighter = new TextHighlighter(document.body, highlighterOptions);

let finder = new TextHighlighter(document.body, {color: '#ffffff'});

export function highlightStored() {
    console.log("highlightStored")
    let hlId = AccountStore.getUserId();
    let currentHls = JSON.parse(localStorage.getItem(hlId));
    if (currentHls){
        for (let hl of currentHls){
            finder.find(hl);
            console.log(hl)
        }
    }
}

function updateHighlights(highlights){
    let hlId = AccountStore.getUserId();
    let currentHls = JSON.parse(localStorage.getItem(hlId));
    let newHls = highlights.map(function (h) {
        return h.innerText;
    }).join('');
    let updatedHLs = [];
    if (currentHls){
        for (let hl of currentHls){
            updatedHLs.push(hl)
        }
    }
    updatedHLs.push(newHls);
    localStorage.setItem(hlId, JSON.stringify(updatedHLs));
}

// highlightStored();
// document.getElementById("clearHls").addEventListener("click", function(){
//     localStorage.clear();
//     finder.removeHighlights();
// });
