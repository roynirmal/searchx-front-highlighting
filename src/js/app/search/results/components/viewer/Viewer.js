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
        let hlId = AccountStore.getUserId();
        let opened_doc = localStorage.getItem("opened-doc");
        let currentHls = JSON.parse(localStorage.getItem(hlId));

        if (currentHls){
            if (currentHls[opened_doc]){
                currentHls[opened_doc].pop();
            }
        }

        localStorage.setItem(hlId, JSON.stringify(currentHls));
        SessionActions.removeHighlight(opened_doc);
        SearchStore.modifyMetadata(opened_doc, {
            highlight: {
                userId: AccountStore.getUserId(),
                date: new Date(),
                highlights: currentHls
            },
            exclude: null
        });
    }

    highlightClickHandler() {
        if(!localStorage.getItem('highlighting')){
            localStorage.setItem('highlighting', true)
        } else {
            localStorage.removeItem('highlighting');
            let opened_doc = localStorage.getItem("opened-doc");
            SearchStore.modifyMetadata(opened_doc, {
                highlight: {
                    userId: AccountStore.getUserId(),
                    date: new Date()
                },
                exclude: null
            });
        }
        let highlighterOptions ;
        let updateHighlights = (highlights) => {
            let hlId = AccountStore.getUserId();
            let opened_doc = localStorage.getItem("opened-doc");
            let currentHls = JSON.parse(localStorage.getItem(hlId));
            let newHls = highlights.map(function (h) {
                return h.innerText;
            }).join('');

            if (currentHls){
                if (currentHls[opened_doc]){
                    currentHls[opened_doc].push(newHls);
                } else {
                    currentHls[opened_doc] = [];
                    currentHls[opened_doc].push(newHls);
                }
            } else {
                currentHls = { }
            }

            localStorage.setItem(hlId, JSON.stringify(currentHls));

            window.alert('Created ' + highlights.length + ' highlight(s): ' + highlights.map(function (h) {
                return '"' + h.innerText + '"';
            }).join(''));

            SessionActions.addHighlight(opened_doc);
            let name = this.props.doctext.match(/<h1>(.*)<\/h1>/)
           
            SessionActions.addBookmark(this.props.url, name[1], this.props.doctext);
            let savedtexts = JSON.parse(localStorage.getItem("doctexts")) || {}
            savedtexts[this.props.url] = this.props.doctext
            SearchStore.modifyMetadata(opened_doc, {
                highlight: {
                    userId: AccountStore.getUserId(),
                    date: new Date(),
                    highlights: currentHls
                },
                exclude: null
            });
        };

        highlighterOptions = {
            color: '#fcfa40',
            onBeforeHighlight: function (range) {
                if (localStorage.getItem('highlighting')){
                    return window.confirm('Selected text: ' + range + '\nReally highlight?');
                }
            },
            onAfterHighlight: function (range, highlights) {
                console.log('range', range);
                console.log('highlights', highlights);
                if (localStorage.getItem('highlighting')){
                    updateHighlights(highlights);
                }
            }
        };

        let highlighter = new TextHighlighter(document.getElementById("viewer"), highlighterOptions);
    }

    render() {
        
        if (this.props.url === "") {
            return <div/>
        }
    
        ////
    
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
        console.log("IH,", initialHighlight)
    
        return (
            <Modal width="95%" height="90%">
                <div id={"viewer"} className="viewer" onMouseEnter={hoverEnterDocument} onMouseLeave={hoverLeaveDocument}
                     onScroll={scrollDocument}>
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
