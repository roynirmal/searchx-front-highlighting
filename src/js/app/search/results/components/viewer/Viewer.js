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
            localStorage.setItem('highlighting', true)
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
            color: '#1afc28',
            onBeforeHighlight: function (range) {
                if (localStorage.getItem('highlighting')){
                    return true
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

            let updateHighlights = (serializedHighlights) => {

                let highlights = JSON.parse(serializedHighlights);

                // Text Highlights
                let currentHls = JSON.parse(localStorage.getItem(userId)) || {} ;
                let newHls = highlights.map(function (h) {
                    return h.innerText;
                }).join(' ');

                currentHls[btoa(openedDoc)] = [];
                for (let hl of highlights){
                    currentHls[btoa(openedDoc)].push(hl[1]);
                }

                localStorage.setItem(userId, JSON.stringify(currentHls));
                log(LoggerEventTypes.HIGHLIGHT_ACTION, {
                    url: this.props.url,
                    query: this.props.searchState.query,
                    action: "add",
                    page: this.props.searchState.page,
                    vertical: this.props.searchState.vertical,
                    text: newHls,
                    currentHls: currentHls
                });

                // Highlights to Notepad
                function getPadUrl() {
                    let url = 'SearchXtesting';
                    if (AccountStore.getGroupId() === AccountStore.getSessionId()) {
                        url = AccountStore.getGroupId();
                    }
                    return url;
                }

                const Http = new XMLHttpRequest();
                let apiKey = '7a0e5240ea947240181d2628191eb04cd8d670c1b5e5f17c60b037f9c0fcb3a9';
                let padID = getPadUrl();
                let url = 'http://localhost:9001/api/1.2.13/appendText?apikey=' + apiKey + '&padID=' + padID + '&text= --';
                url += newHls + '%0A%0A';
                Http.open("GET", url);
                Http.setRequestHeader("Content-Type", "text/plain");
                Http.send();
                Http.onreadystatechange = (e) => {
                    console.log(Http.responseText)
                };
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
        
        return (
            <Modal width="95%" height="90%">
                <div id={"viewer"} className="viewer" onMouseEnter={hoverEnterDocument} onMouseLeave={hoverLeaveDocument}
                     onScroll={scrollDocument} >
                    <div className="header">
                        {!this.props.doctext  ?
                            [
                                <span className="forward" onClick={openInBrowser}>open in browser</span>,
                                <span className="divider"/>
                            ] :
                            <div className="pull-right">
                                <Rating className="rating" emptySymbol="fa fa-pencil-square-o" fullSymbol="fa fa-pencil-square" onClick={this.highlightClickHandler}
                                title="Highlight" stop={1} initialRating={initialHighlight} style={{ marginRight : '20px'}} > </Rating>
                                {/*<span  onClick={this.highlightRemoveHandler}><i className="fa fa-trash"/></span>*/}
                            </div>
                         }
                        {config.interface.ratings && [
                            <RatingContainer url={this.props.url}/>,
                            <span className="divider"/>
                        ]}
                        <span className="close" onClick={closeDocument}><i className="fa fa-times"/></span>
                    </div>
    
                    <div className="body">
                        {config.interface.annotations && (
                            <div className="sidebar">
                                <AnnotationContainer url={this.props.url}/>
                            </div>
                        )}
                        <ViewerPage url={this.props.url} loadHandler={loadDocument} doctext={this.props.doctext} />
                    </div>
                </div>
            </Modal>
        );
    }
}
