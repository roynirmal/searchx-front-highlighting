import TextHighlighter from 'texthighlighter';
import React from "react";
import AccountStore from "../stores/AccountStore"
import api from 'etherpad-lite-client'

let highlighterOptions = {
    color: '#fcf8e3',
    onBeforeHighlight: function (range) {
        // console.log(window.confirm('Selected text: ' + range + '\nReally highlight?'));
        return window.confirm('Selected text: ' + range + '\nReally highlight?');
    },
    onAfterHighlight: function (range, highlights) {
        updateHighlights(highlights);
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
    }).join(', ');
    let updatedHLs = [];
    if (currentHls){
        for (let hl of currentHls){
            updatedHLs.push(hl)
        }
    }
    updatedHLs.push(newHls);
    localStorage.setItem(hlId, JSON.stringify(updatedHLs));

    // copyHlsToNotepad(newHls);

    window.alert('Created ' + highlights.length + ' highlight(s): ' + highlights.map(function (h) {
        return '"' + h.innerText + '"';
    }).join(', '));
}


function copyHlsToNotepad(newHls){

    // let etherpad = api.connect({
    //     apikey: '3748d4909293037fd6058b35c1b46cc08a285efbfaf303bbed5c5bcd0bd333f8',
    //     host: 'localhost',
    //     port: 9001
    // });

    // let args = {
    //     padID: 'SearchXtesting',
    //     text: newHls
    // };
    // etherpad.getText(args, function(error, data) {
    //     if(error) {
    //         console.log('test-error');
    //         console.log(error);
    //     } else {
    //         console.log('ether-test');
    //         console.log(data)
    //     }
    // });

    const Http = new XMLHttpRequest();
    let url='http://localhost:9001/api/1.2.13/appendText?apikey=3748d4909293037fd6058b35c1b46cc08a285efbfaf303bbed5c5bcd0bd333f8&padID=SearchXtesting&text=';
    url += newHls;
    Http.open("GET", url);
    Http.setRequestHeader("Content-Type", "text/plain");
    Http.send();

    Http.onreadystatechange = (e) => {
        console.log(Http.responseText)
    };

}

// highlightStored();
// document.getElementById("clearHls").addEventListener("click", function(){
//     localStorage.clear();
//     finder.removeHighlights();
// });
