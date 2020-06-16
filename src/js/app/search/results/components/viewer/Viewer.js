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
        this.highlightRemoveHandler = this.highlightRemoveHandler.bind(this);
    }

    highlightRemoveHandler() {
        let metaInfo = {
            url: this.props.url,
            query: this.props.searchState.query,
            page: this.props.searchState.page,
            vertical: this.props.searchState.vertical
        };
        if(!localStorage.getItem('highlighting')){
            localStorage.setItem('highlighting', true)
        }
        let userId = AccountStore.getUserId();
        let currentDoc = localStorage.getItem("opened-doc");
        localStorage.setItem("highlight-removing", true)
        if (window.confirm('Delete last highlight?')){
            // Text highlights & SERP
            let removedhl
            let currentHls = JSON.parse(localStorage.getItem(userId));
            if (currentHls){
                if (currentHls[btoa(currentDoc)]){
                    removedhl = currentHls[btoa(currentDoc)].pop();
                    if (currentHls[btoa(currentDoc)].length === 0){
                        delete currentHls[btoa(currentDoc)]
                        SessionActions.removeBookmark(this.props.url)
                        window.alert('All highlights have been deleted from this page')
                    } 
                } else if (!Object.keys(currentHls).includes(btoa(currentDoc))) {
                    // console.log("here")
                    window.alert('All highlights have been deleted from this page')
                }
            }
            localStorage.setItem(userId, JSON.stringify(currentHls));
            SessionActions.removeHighlight(currentDoc);
            SearchStore.modifyMetadata(currentDoc, {
                highlight: {
                    userId: AccountStore.getUserId(),
                    date: new Date(),
                    highlights: currentHls
                },
                exclude: null
            });

            // Span highlights
            let highlightId = userId + '_' + currentDoc;
            let serializedList = [];
            let existingSerialized = JSON.parse(localStorage.getItem(highlightId));
            if (existingSerialized){
                serializedList = existingSerialized;
            }
            serializedList.pop();
            localStorage.setItem(highlightId, JSON.stringify(serializedList));
            log(LoggerEventTypes.HIGHLIGHT_ACTION, {
                url: this.props.url,
                query: this.props.searchState.query,
                action: "remove",
                page: this.props.searchState.page,
                vertical: this.props.searchState.vertical,
                text: removedhl,
                currentHl: currentHls
            });

        }
        

    }

    highlightClickHandler() {
        if(!localStorage.getItem('highlighting')){
            localStorage.setItem('highlighting', true)
        } else {
            localStorage.removeItem('highlighting');
            cleanupHighlighter();
            let opened_doc = localStorage.getItem("opened-doc");
            SearchStore.modifyMetadata(opened_doc, {
                highlight: {
                    userId: AccountStore.getUserId(),
                    date: new Date()
                },
                exclude: null
            });
        }

        let highlighterOptions;
        let opened_doc = localStorage.getItem("opened-doc");

        highlighterOptions = {
            color: '#1afc28',
            onBeforeHighlight: function (range) {
                if (localStorage.getItem('highlighting')){
                    return window.confirm('Selected text: ' + range + '\nSave this highlight?');
                }
            },
            onAfterHighlight: function (range, highlights) {
                if (localStorage.getItem('highlighting')){
                    updateHighlights(highlights);
                }
            }
        };

        let highlighter = new TextHighlighter(document.getElementById("documentText"), highlighterOptions);

        function cleanupHighlighter(){
            let old_element = document.getElementById("documentText");
            let new_element = old_element.cloneNode(true);
            old_element.parentNode.replaceChild(new_element, old_element);
        }
        
        
        let updateHighlights = (highlights) => {
            let userId = AccountStore.getUserId();
            let highlightId = userId + '_' + opened_doc;

            // Text Highlights
            let currentHls = JSON.parse(localStorage.getItem(userId));
            let newHls = highlights.map(function (h) {
                return h.innerText;
            }).join(' ');
            if (currentHls){
                if (currentHls[btoa(opened_doc)]){
                    currentHls[btoa(opened_doc)].push(newHls);
                } else {
                    currentHls[btoa(opened_doc)] = [];
                    currentHls[btoa(opened_doc)].push(newHls);
                }
            } else {
                currentHls = { };
                currentHls[btoa(opened_doc)] = [];
                currentHls[btoa(opened_doc)].push(newHls);
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

            // Serialized Span Highlights for display
            function updateSerialized(highlightId){
                let serializedList = [];
                let existingSerialized = JSON.parse(localStorage.getItem(highlightId)) || [];
                if (existingSerialized){
                    serializedList = existingSerialized;
                }
                let toSerialize = highlighter.serializeHighlights();
                existingSerialized.push(toSerialize);
                localStorage.setItem(highlightId, JSON.stringify(serializedList));
            }

            updateSerialized(highlightId);

            // Prepare highlights for SERP
            SessionActions.addHighlight(opened_doc);
            let name = this.props.doctext.match(/<h1>(.*)<\/h1>/);
            SessionActions.addBookmark(this.props.url, name[1], this.props.doctext);

            let savedtexts = JSON.parse(localStorage.getItem("doctexts")) || {};
            savedtexts[this.props.url] = this.props.doctext;
            localStorage.setItem("doctexts", JSON.stringify(savedtexts));
            SearchStore.modifyMetadata(opened_doc, {
                highlight: {
                    userId: AccountStore.getUserId(),
                    date: new Date(),
                    highlights: currentHls
                },
                exclude: null
            });

            // Confirmation for Participant
            window.alert('Created ' + highlights.length + ' highlight(s): ' + highlights.map(function (h) {
                return '"' + h.innerText + '"';
            }).join(''));
        };
        
        
    }

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
            localStorage.removeItem("highlighting")
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
                                <span  onClick={this.highlightRemoveHandler}><i className="fa fa-trash"/></span>
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
