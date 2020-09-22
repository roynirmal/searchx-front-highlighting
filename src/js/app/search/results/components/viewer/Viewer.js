import './Viewer.pcss';
import React from 'react';

import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';
import SessionActions from '../../../../../actions/SessionActions';
import SearchStore from "../../../SearchStore";

import ViewerPage from "./ViewerPage";
import AnnotationContainer from "../../../features/annotation/AnnotationContainer";
import RatingContainer from "../../../features/rating/RatingContainer";
import Modal from "../../../../common/Modal";
import config from '../../../../../config';
import TextHighlighter from 'texthighlighter';
import AccountStore from "../../../../../stores/AccountStore";
import Rating from 'react-rating';

export default class Viewer extends React.Component  {
    constructor(props) {
        super(props);
        this.highlightClickHandler = this.highlightClickHandler.bind(this);
    }

    highlightClickHandler() {
        let openedDoc = localStorage.getItem("opened-doc");

        if(!localStorage.getItem('highlighting')){
            localStorage.setItem('highlighting', true);
            SearchStore.modifyMetadata(openedDoc, {
                highlight: {
                    userId: AccountStore.getUserId(),
                    date: new Date()
                },
                exclude: null
            });
        } else {
            localStorage.removeItem('highlighting');
            let doctext = document.getElementById("documentText");
            const buttons = [...doctext.getElementsByClassName("btn-xs")];
            for (let btn of buttons){
                let tempParent = btn.parentNode;
                tempParent.removeChild(btn)
            }
            cleanupHighlighter();
            SearchStore.modifyMetadata(openedDoc, {
                highlight: {
                    userId: AccountStore.getUserId(),
                    date: new Date()
                },
                exclude: null
            });
        }

        let highlighterOptions;
        highlighterOptions = {
            color: 'rgb(252,214,26)',
            onBeforeHighlight: function (range) {
                if (localStorage.getItem('highlighting')){
                    if (['TH', 'TR', 'TD', 'TBODY'].includes(range.commonAncestorContainer.nodeName) ||
                        ['TH', 'TR', 'TD', 'TBODY'].includes(range.commonAncestorContainer.parentElement.nodeName) ||
                        ['TH', 'TR', 'TD', 'TBODY'].includes(range.commonAncestorContainer.parentElement.parentElement.nodeName) ||
                        ['TH', 'TR', 'TD', 'TBODY'].includes(range.commonAncestorContainer.parentElement.parentElement.parentElement.nodeName)){
                        return false;
                    }
                    return true;
                }
            },
            onAfterHighlight: function (range, highlights) {
                if (localStorage.getItem('highlighting')){
                    emitHighlights(highlights);
                }
            }
        };

        let highlighter = new TextHighlighter(document.getElementById("documentText"), highlighterOptions);
        function cleanupHighlighter(){
            let oldElement = document.getElementById("documentText");
            let newElement = oldElement.cloneNode(true);
            oldElement.parentNode.replaceChild(newElement, oldElement);
        }

        let emitHighlights = (highlights) => {
            let name = this.props.doctext.match(/<h1>(.*)<\/h1>/);
            SessionActions.addHighlight(this.props.url, name[1], this.props.doctext.replace(/<h1>(.*)<\/h1>/, ''));
            console.log("hl", highlights)
            let currentHighlightText = [];
            let temp = []
            highlights.forEach(span => {
                // console.log(span.parentElement.nextSibling.nodeName)
                temp.push(span.innerText)

                if (span.nextSibling && span.nextSibling.nodeName === "#text"){
                    currentHighlightText.push(span.innerText);
                } else if (span.nextElementSibling){
                    if (span.nextElementSibling.children.length > 0){
                        for (let child of span.nextElementSibling.children){
                            if (child.className !== 'highlighted'){
                                currentHighlightText.push(span.innerText);
                                break;
                            }
                        }
                    } else if (span.nextElementSibling.className !== 'highlighted'){
                        // console.log("I am here 3",span.nextElementSibling.className )
                        currentHighlightText.push(span.innerText);
                    }
                } else {
                    if (span.parentElement.nextSibling && span.parentElement.nextSibling.nodeName === "#text"){
                        currentHighlightText.push(span.innerText);
                    } else if (['LI', 'P', 'H1','H2','H3'].includes(span.parentElement.tagName)){
                            currentHighlightText.push(span.innerText);
                    } else if (span.parentElement.nextElementSibling){
                        if (span.parentElement.nextElementSibling.children.length > 0){
                            for (let child of span.parentElement.nextElementSibling.children){
                                if (child.className !== 'highlighted'){
                                    currentHighlightText.push(span.innerText);
                                    break;
                                }
                            }
                        } else if (span.parentElement.nextElementSibling.className !== 'highlighted'){
                            currentHighlightText.push(span.innerText);
                        }
                    } else {
                        currentHighlightText.push(span.innerText);
                    }
                } 
            });
            let idxarray = []
            let newHls
            currentHighlightText.forEach( (e, idx) => {
                const i = temp.indexOf(e)
                idxarray.push(i)
                newHls = temp.slice(idxarray[idx-1]+1, idxarray[idx]+1).join(' ')
                log(LoggerEventTypes.HIGHLIGHT_ACTION, {
                    url: this.props.url,
                    query: this.props.searchState.query,
                    action: "add",
                    page: this.props.searchState.page,
                    vertical: this.props.searchState.vertical,
                    text: newHls
                // currentHls: currentHls
                });
            })
            //                 // Highlights to Notepad
            // function getPadUrl() {
            //     let url = 'SearchXtesting';
            //     if (AccountStore.getGroupId() === AccountStore.getSessionId()) {
            //         url = AccountStore.getGroupId();
            //     }
            //     return url;
            // }

            // const Http = new XMLHttpRequest();
            // let apiKey = 'a7ffd005ad9357ee7b8b0fb1650a38a32a0638476a009d49cc0437e44ad01a85';
            // let padID = getPadUrl();
            // let url = 'http://lambda4.ewi.tudelft.nl/api/1.2.13/appendText?apikey=' + apiKey + '&padID=' + padID + '&text= --';
            // url += name[1] + ' '  + this.props.url.toString().replace("https\:\/\/", "") + '%0A' + newHls + '%0A%0A' ;
            // Http.open("GET", url);
            // Http.setRequestHeader("Content-Type", "text/plain");
            // Http.send();
            // Http.onreadystatechange = (e) => {
            //     console.log(Http.responseText)
            // };
        }
    };


    render() {

        if (this.props.url === "") {
            return <div/>
        }

        const metaInfo = {
            url: this.props.url,
            query: this.props.searchState.query,
            page: this.props.searchState.page,
            vertical: this.props.searchState.vertical
        };

        let hoverEnterDocument = () => {
            log(LoggerEventTypes.DOCUMENT_HOVERENTER, metaInfo)
        };
        let hoverLeaveDocument = () => {
            log(LoggerEventTypes.DOCUMENT_HOVERLEAVE, metaInfo)
        };

        let closeDocument = () => {
            this.props.documentCloseHandler();
            log(LoggerEventTypes.DOCUMENT_CLOSE, metaInfo);
            localStorage.removeItem("highlighting");
            let doctext = document.getElementById("documentText");
            const buttons = [...doctext.getElementsByClassName("btn-xs")];
            for (let btn of buttons){
                let tempParent = btn.parentNode;
                tempParent.removeChild(btn)
            }

            let openedDoc = localStorage.getItem("opened-doc");
            let userId = AccountStore.getUserId();
            let highlightId = userId + '_' + openedDoc;

            let highlighterOptions = { color: '#fcfa40'};
            let highlighter = new TextHighlighter(document.getElementById("documentText"), highlighterOptions);
            let toSerialize = highlighter.serializeHighlights();

            if(toSerialize.length === 2){

                if(localStorage.getItem(highlightId)){
                    localStorage.removeItem(highlightId)
                    SessionActions.removeHighlight(this.props.url)
                }
            }
            let updateHighlights = (serializedHighlights) => {
                let openTime = localStorage.getItem("open-time")
                let highlights = JSON.parse(serializedHighlights);

                // Text Highlights
                let currentHls = JSON.parse(localStorage.getItem(userId)) || {} ;
                let newHls =''
                currentHls[btoa(openedDoc)] = [];
                let se_dict = {}
                let old_t = 0
                let max_t
                let pre_max = localStorage.getItem("pre-max"+'-'+openedDoc) || parseInt(0)
                highlights.forEach((e, i) => {
                  let ts = e[0].match(/data-timestamp=\"(.*?)\"/)[1]
                //   console.log("TIMES", ts)
                  let curr_t = parseInt(ts)
                  if (curr_t > old_t) {

                       max_t = curr_t
                    //    console.log("TIMES", curr_t, old_t, max_t)
                  }
                  old_t = curr_t
                //   console.log("TIMES 2", curr_t, old_t, max_t)
                  if(se_dict[ts]){
                    se_dict[ts].push([e[1], e[2].split(":")])
                  } else {
                    se_dict[ts] = []
                    se_dict[ts].push([e[1], e[2].split(":")])
                  }
                })
                localStorage.setItem("pre-max"+'-'+openedDoc, max_t)
                for (const [key1, value] of Object.entries(se_dict)) {
                  let w = {}
                  value.forEach(item => {
                    let l = item[1].splice(0,5).join(':')
                    let k = item[1][0]
                    var t = {}
                    t[k] = item[0]
                    if(w[l]){
                      w[l][k] = item[0]
                    } else {
                      w[l]= {}
                      w[l][k] = item[0]
                    }
                  })
                  for (const [key2, value] of Object.entries(w)) {

                    let curHls = Object.values(value).join(' ')
                    currentHls[btoa(openedDoc)].push(curHls)

                    if (parseInt(key1)>pre_max){
                        console.log("c", curHls)
                        newHls += '-- ' + curHls + '%0A%0A'
                    }
                  }
                }
                localStorage.setItem(userId, JSON.stringify(currentHls));

                // Highlights to Notepad
                function getPadUrl() {
                    let url = 'SearchXtesting';
                    if (AccountStore.getGroupId() === AccountStore.getSessionId()) {
                        url = AccountStore.getGroupId();
                    }
                    return url;
                }

                let name = this.props.doctext.match(/<h1>(.*)<\/h1>/);
                if (newHls){
                    const Http = new XMLHttpRequest();
                    let apiKey = 'a7ffd005ad9357ee7b8b0fb1650a38a32a0638476a009d49cc0437e44ad01a85';
                    // manuel let apiKey = '3a27994624a454bacdc02ba368ed25268f5b60079fa1429c0c9ac5d3b69c0abb';
                    let padID = getPadUrl();
                    // manuel let url = 'http://localhost:9001/api/1.2.13/appendText?apikey=' + apiKey + '&padID=' + padID + '&text= --';
                    let url = 'http://lambda4.ewi.tudelft.nl/api/1.2.13/appendText?apikey=' + apiKey + '&padID=' + padID + '&text=';
                    url += name[1] + '%0A' + newHls  ;
                    Http.open("GET", url);
                    Http.setRequestHeader("Content-Type", "text/plain");
                    Http.send();
                    Http.onreadystatechange = (e) => {
                        console.log(Http.responseText)
                    };
                }
     
            };
            if (toSerialize.length > 3){
                updateHighlights(toSerialize);
                localStorage.setItem(highlightId, JSON.stringify(toSerialize));
            }
        };
        let loadDocument = () => {
            log(LoggerEventTypes.DOCUMENT_LOAD, metaInfo);

            if (!this.props.doctext) {
                document.getElementById("viewer-content-loader").style.display = "none";
            }
        };
        let openInBrowser = () => {
            log(LoggerEventTypes.DOCUMENT_OPEN_BROWSER, metaInfo);
            window.open(this.props.url);
        };
        let scrollDocument = () => {
            log(LoggerEventTypes.DOCUMENT_SCROLL, metaInfo);
        };
        let initialHighlight = localStorage.getItem('highlighting') ? 1 : 0;
        initialHighlight = localStorage.getItem("highlight-removing") ? 0 : initialHighlight;

        let highlighterToggle = localStorage.getItem('highlighting') ? 'Deactivate - ' : 'Activate - ';

        return (
            <Modal width="95%" height="90%">
                <div id={"viewer"} className="viewer" onMouseEnter={hoverEnterDocument} onMouseLeave={hoverLeaveDocument}
                     onScroll={scrollDocument} >
                    <div className="header">
                        {!this.props.doctext  ?
                            [
                                <span className="forward" > </span>,
                                <span className="divider"/>
                            ] :
                            <div className="pull-right" >
                                <span>{highlighterToggle}</span>
                                <Rating className="Rating"
                                        emptySymbol={<img src='/img/highlighter_off.png' height="30"
                                                          className='highlighter icon' alt='highlighter off' />}
                                        fullSymbol={<img src='/img/highlighter_on.png' height="30"
                                                         className='highlighter icon' alt='highlighter on' />}
                                        onClick={this.highlightClickHandler} title="Highlight" stop={1}
                                        initialRating={initialHighlight}
                                > </Rating>
                            </div>
                         }
                        {config.interface.ratings && [
                            <RatingContainer url={this.props.url}/>,
                            <span className="divider"/>
                        ]}
                        <span id="closeDoc" className="close" onClick={closeDocument}><i className="fa fa-times"/>
                            Close Page
                        </span>
                    </div>
    
                    <div className="body">
                        {config.interface.annotations && (
                            <div className="sidebar">
                                <AnnotationContainer url={this.props.url}/>
                            </div>
                        )}
                        <ViewerPage url={this.props.url} loadHandler={loadDocument} doctext={this.props.doctext}
                                    searchState={this.props.searchState} highlightClickHandler={this.highlightClickHandler} />
                    </div>
                </div>
            </Modal>
        );
    }
}
