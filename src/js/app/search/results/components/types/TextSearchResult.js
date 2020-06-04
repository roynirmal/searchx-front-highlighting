import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import {highlightStored} from "../../../../../utils/Highlighter"
import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';
import AccountStore from "../../../../../stores/AccountStore"
////

const TextSearchResult = function ({
                                       searchState, serpId, index, result, metadata, bookmarkButton, excludeButton,
                                       urlClickHandler, hideCollapsedResultsHandler, isCollapsible, visited
                                   }) {
    let metaInfo = {
        url: result.url,
        index: index,
        query: searchState.query,
        page: searchState.page,
        serpId: serpId,
        session: localStorage.getItem("session-num") || 0,
    };

    let clickUrl = () => {
        console.log("result", result)
        var doctext = '<h1>'+result.name+'</h1>'+ result.text
        var m
        // result.text.split('\n').forEach(element => {
            
            // res = result.text.match(/<p>(.*?)<\/p>/g);
        // const rp = /<p>(.*?)<\/p>|<h2>(.*?)<\/h2>|<h3>(.*?)<\/h3>/g
 
        // const regex0 = /\n/g;
        // let cleaned_item0 = result.text.replace(regex0, '');
        // const regex1 = /<a.*?>/g;
        // let cleaned_item = cleaned_item0.replace(regex1, '');
        // const regex2 = /<\/a>/g;
        // let cleaned_item2 = cleaned_item.replace(regex2, '');
        // const regex3 = /<img.*?>/g;
        // let cleaned_item3 = cleaned_item2.replace(regex3, '');
        // const regex4 = /<\/img>/g;
        // let cleaned_item4 = cleaned_item3.replace(regex4, '');
        // const regex5 = /<sup.*?<\/sup>/g;
        // let cleaned_item5 = cleaned_item4.replace(regex5, '');
        // // const regex6 = /<\/sup>/g;
        // // let cleaned_item6 = cleaned_item5.replace(regex6, '');
        
        // while (m = rp.exec(cleaned_item5)) {
        //     if (m[0].startsWith('<p>')){
        //     doctext.push(<p dangerouslySetInnerHTML={{__html: m[1]}}/>);
        //     } else if (m[0].startsWith('<h2>')){
                
        //         doctext.push(<h2 dangerouslySetInnerHTML={{__html: m[2]}}/>);
        //     } else if (m[0].startsWith('<h3>')){
                
        //         doctext.push(<h3 dangerouslySetInnerHTML={{__html: '<b>'+ m[3] + '</b>'}}/>);
        //     }
        // }
        // console.log(doctext)
        // highlightStored()

        // highlightStored()
        console.log("Click")
   
        // doctext.unshift(<h4> {result.source} <br/></h4>);
        // doctext.unshift(<h1 dangerouslySetInnerHTML={{__html: result.name}} />);

        urlClickHandler(result.url, doctext);
        log(LoggerEventTypes.SEARCHRESULT_CLICK_URL, metaInfo);
    };

    let viewUrl = (isVisible) => {
        metaInfo.isVisible = isVisible;
        log(LoggerEventTypes.SEARCHRESULT_VIEW_URL, metaInfo);
    };

    let contextUrl = () => {
        log(LoggerEventTypes.SEARCHRESULT_CONTEXT_URL, metaInfo);
    };

    let hoverEnterSummary = () => {
        log(LoggerEventTypes.SEARCHRESULT_HOVERENTER, metaInfo);
    };

    let hoverLeaveSummary = () => {
        log(LoggerEventTypes.SEARCHRESULT_HOVERLEAVE, metaInfo);
    };

    function createSnippet() {
        return {__html: result.snippet};
    }

    const hideCollapsedResults = function () {
        const collapseMetaInfo = {
            urls: [result.url],
            query: searchState.query,
            page: searchState.page,
            serpId: serpId,
        };
        log(LoggerEventTypes.SEARCHRESULT_HIDE_COLLAPSED, collapseMetaInfo);
        const id =  result.url;
        hideCollapsedResultsHandler([id]);
    };

    const toTitleCase = function(str) {
        return str.replace(
            /\w\S*/g,
            function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    if (result.name === result.name.toUpperCase()) {
        result.name = toTitleCase(result.name);
    }

    ////
    return (
        <div className="result-text">
            <VisibilitySensor
                onChange={viewUrl}
                scrollCheck
                delayedCall={true}
                scrollThrottle={50}
                intervalDelay={2000}
            />

            {bookmarkButton}
            {excludeButton}

            <div onMouseEnter={hoverEnterSummary} onMouseLeave={hoverLeaveSummary}>
                <h2>
                    <a className={visited ? "visited" : ""} href="#/"  title={result.name} onClick={clickUrl}
                       onContextMenu={contextUrl}>
                        {result.name}
                    </a>
                </h2>

                {isCollapsible ? (
                    <div className="textArea" draggable="true" role="button" onClick={hideCollapsedResults}>
                        <p dangerouslySetInnerHTML={createSnippet()} >
                        </p>

                        {metadata}
                    </div>
                ) : (
                    <div className="textArea">
                        <div className="fakeSpace"></div>
                        <p dangerouslySetInnerHTML={createSnippet()}>
                        </p>

                        {metadata}
                    </div>
                )}

            </div>
        </div>
    )
};

export default TextSearchResult;
