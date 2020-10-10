// import TextHighlighter from 'texthighlighter';
// import React from "react";
// import AccountStore from "../stores/AccountStore"
// import api from 'etherpad-lite-client'
// import fetch from 'node-fetch'
//
// let highlighterOptions = {
//     color: '#fcf8e3',
//     onBeforeHighlight: function (range) {
//         return window.confirm('Selected text: ' + range + '\nReally highlight?');
//     },
//     onAfterHighlight: function (range, highlights) {
//         updateHighlights(highlights);
//     }
// };
//
// export let highlighter = new TextHighlighter(document.body, highlighterOptions);
// // export let highlighter = new TextHighlighter(document.getElementById("viewerContents"), highlighterOptions);
//
// let finder = new TextHighlighter(document.body, {color: '#ffffff'});
//
// export function highlightStored() {
//     console.log("highlightStored");
//     let hlId = AccountStore.getUserId();
//     let currentHls = JSON.parse(localStorage.getItem(hlId));
//     if (currentHls){
//         for (let hl of currentHls){
//             finder.find(hl);
//             console.log(hl)
//         }
//     }
// }
// let updatedHLs = {};
//
// function updateHighlights(highlights){
//     let hlId = AccountStore.getUserId();
//     let opened_doc = localStorage.getItem("opened-doc")
//     let currentHls = JSON.parse(localStorage.getItem(hlId));
//     let newHls = highlights.map(function (h) {
//         return h.innerText;
//     }).join('');
//
//     // if (currentHls){
//     //     for (let hl of currentHls[opened_doc]){
//     //         updatedHLs[opened_doc].push(hl)
//     //     }
//     // }
//     if (updatedHLs[opened_doc]){
//         updatedHLs[opened_doc].push(newHls);
//     } else {
//         updatedHLs[opened_doc] = []
//         updatedHLs[opened_doc].push(newHls);
//     }
//
//     localStorage.setItem(hlId, JSON.stringify(updatedHLs));
//
//     copyHlsToNotepad(newHls);
//
//     window.alert('Created ' + highlights.length + ' highlight(s): ' + highlights.map(function (h) {
//         return '"' + h.innerText + '"';
//     }).join(''));
// }

//
// function copyHlsToNotepad(hlText){
//
//     // let etherpad = api.connect({
//     //     apikey: '3748d4909293037fd6058b35c1b46cc08a285efbfaf303bbed5c5bcd0bd333f8',
//     //     host: 'localhost',
//     //     port: 9001,
//     //     rejectUnauthorized: true
//     // });
//     //
//     // let args = {
//     //     padID: 'SearchXtesting',
//     //     text: newHls
//     // };
//     // etherpad.setText(args, function(error, data) {
//     //     if(error) {
//     //         console.log('test-error');
//     //         console.log(error);
//     //     } else {
//     //         console.log('ether-test');
//     //         console.log(data)
//     //     }
//     // });
//
//     let apiKey = '94b4d1a3492e5482d0c939de54bbde34f46725011c9e7066f673825624ddd1cb';
//     // let url='http://localhost:9001/api/1.2.13/appendText?apikey='+apiKey+'&padID=SearchXtesting&text=';
//     let url='http://localhost:9001/api/1.2.13/appendText?apikey='+apiKey+'&padID=SearchXtesting';
//     let hlToNote = '\n' + hlText + '\n';
//     // url += hlToNote;
//     console.log(hlToNote);
//     let headers = {
//         "Content-Type": "text/plain"
//     };
//     let data = {
//         "text": hlToNote
//     };
//     fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(data), mode: 'no-cors'})
//         .then((res) => {
//             console.log(res)
//         })
//         .then((json) => {
//             console.log(json);
//             // Do something with the returned data.
//         });
//
//     // const Http = new XMLHttpRequest();
//     // let url='http://localhost:9001/api/1.2.13/appendText?apikey=3748d4909293037fd6058b35c1b46cc08a285efbfaf303bbed5c5bcd0bd333f8&padID=SearchXtesting&text=';
//     // url += newHls;
//     // Http.open("GET", url);
//     // Http.setRequestHeader("Content-Type", "text/plain");
//     // Http.send();
//     //
//     // Http.onreadystatechange = (e) => {
//     //     console.log(Http.responseText)
//     // };
//
// }
//
// // highlightStored();
// // document.getElementById("clearHls").addEventListener("click", function(){
// //     localStorage.clear();
// //     finder.removeHighlights();
// // });