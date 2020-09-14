import React from 'react';
import TextHighlighter from "texthighlighter";
import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';
export default class ViewerPage extends React.Component {
    constructor(props) {
        super(props);
        // this.highlightClickHandler = this.highlightClickHandler.bind(this);
    }

    createButton() {
        let url = this.props.url
        let query =  this.props.searchState.query
        let page =  this.props.searchState.page
        let vertical =  this.props.searchState.vertical

        let doctext = document.getElementById("documentText");
        let buttons;
        if (doctext) {
            buttons = [...doctext.getElementsByClassName("btn-xs")];
            for (let btn of buttons){
                let tempParent = btn.parentNode;
                tempParent.removeChild(btn)
            }
        }

        function clearSpan(element){
            if (["I", "B"].includes(element.nodeName)){
                return element.outerHTML
            } else {
                return element.innerHTML
            }
        }

        function compare(a, b) {
            let comparison = 0;
            if (a.dataset.timestamp > b.dataset.timestamp) {
                comparison = 1;
            } else if (a.dataset.timestamp < b.dataset.timestamp) {
                comparison = -1;
            }
            return comparison * -1;
        }

        function getLastSpans(spans){
            let sortedSpans = spans.sort(compare);
            let lastSpans = [];
            let lastSpanTime = sortedSpans[0].dataset.timestamp;
            for (let span of sortedSpans){
                if (span.dataset.timestamp === lastSpanTime){
                    lastSpans.push(span)
                } else {
                    break
                }
            }
            return lastSpans;
        }

        let spans = [...document.getElementsByClassName('highlighted')];

        if (spans.length > 0) {
            let lastSpans = getLastSpans(spans);
            for (let lastSpan of lastSpans) {
                let suffix = '';
                if (lastSpan.nextSibling && lastSpan.nextSibling !== lastSpan.nextElementSibling && !lastSpan.textContent.endsWith(" ")) {
                    for (let x of lastSpan.nextSibling.textContent) {
                        if ([null, ' ', ''].includes(x)) {
                            break;
                        } else {
                            suffix += x
                        }
                    }
                    lastSpan.nextSibling.textContent = lastSpan.nextSibling.textContent.slice(suffix.length,)
                    lastSpan.innerText += suffix
                }
            }
        }

        for (let span of spans) {
            let button = document.createElement("BUTTON");
            button.innerText = "delete";
            button.setAttribute("class", "btn-xs");
            button.onclick = function () {
                let buttonParentElement = button.parentElement;
                let elem = button.previousSibling;
                buttonParentElement.removeChild(button);
                let flag = true;
                let remove = []
                while (flag){
                    flag = false;
                    console.log(elem.innerText)
                    remove.push(elem.innerText);
                    let directPrevious = elem.previousElementSibling;
                    let directParent = elem.parentElement;

                    if (elem.previousSibling && elem.previousSibling.nodeName === "#text") {
                        elem.outerHTML = clearSpan(elem);
                        elem = directPrevious;
                    } else if (directParent.previousSibling && ["I", "B", "EM"].includes(directParent.nodeName) &&
                        directParent.previousSibling.nodeName === '#text') {
                        elem.outerHTML = clearSpan(elem);
                        elem = directParent.previousElementSibling;
                    } else if (directPrevious){
                        if (directPrevious.className === "highlighted"){
                            flag = true;
                        } else if (directPrevious.children.length > 0){
                            let children = [...directPrevious.children];
                            for (let child of children){
                                if (child.className === "highlighted"){
                                    child.outerHTML = child.innerHTML;
                                    flag = true;
                                } else if (child.children.length > 0){
                                    let sub_children = [...child.children];
                                    for (let child of sub_children){
                                        if (child.className === "highlighted"){
                                            child.outerHTML = child.innerHTML;
                                            flag = true;
                                        }
                                    }
                                }
                            }
                        }
                        if (flag === true){
                            elem.outerHTML = clearSpan(elem);
                            elem = directPrevious;
                        }
                    } else if (directParent.previousElementSibling && ["I", "B", "EM"].includes(directParent.nodeName)){
                        if (directParent.previousElementSibling.className === "highlighted"){
                            flag = true;
                        } else if (directParent.previousElementSibling.children.length > 0){
                            let children = [...directParent.previousElementSibling.children];
                            for (let child of children){
                                if (child.className === "highlighted"){
                                    // child.outerHTML = child.innerHTML;
                                    flag = true;
                                } else if (child.children.length > 0){
                                    let sub_children = [...child.children];
                                    for (let child of sub_children){
                                        if (child.className === "highlighted"){
                                            // child.outerHTML = child.innerHTML;
                                            flag = true;
                                        }
                                    }
                                }
                            }
                        }
                        if (flag === true){
                            elem.outerHTML = clearSpan(elem);
                            elem = directParent.previousElementSibling;
                        }
                    } else if (!elem.previousSibling && (!directParent.previousSibling ||
                        ['P', 'UL', 'LI', 'H1', 'H2', 'H3', 'TH', 'TD'].includes(directParent.nodeName))) {
                        elem.outerHTML = clearSpan(elem);
                    }
                }
                let delHls  = remove.reverse().join(' ')
                log(LoggerEventTypes.HIGHLIGHT_ACTION, {
                    url: url,
                    query: query,
                    action: "delete",
                    page: page,
                    vertical: vertical,
                    text: delHls
                });
            };

            if (span.nextSibling && span.nextSibling.nodeName === "#text"){
                span.insertAdjacentElement('afterend', button);
            } else if (span.nextElementSibling){
                if (span.nextElementSibling.children.length > 0){
                    for (let child of span.nextElementSibling.children){
                        if (child.className !== 'highlighted'){
                            span.insertAdjacentElement('afterend', button);
                            break;
                        }
                    }
                } else if (span.nextElementSibling.className !== 'highlighted'){
                    span.insertAdjacentElement('afterend', button)
                }
            } else {
                if (span.parentElement.nextSibling && span.parentElement.nextSibling.nodeName === "#text"){
                    span.insertAdjacentElement('afterend', button);
                } else if (['LI', 'P', 'H1','H2','H3'].includes(span.parentElement.tagName)){
                    span.insertAdjacentElement('afterend', button);
                } else if (span.parentElement.nextElementSibling){
                    if (span.parentElement.nextElementSibling.children.length > 0){
                        for (let child of span.parentElement.nextElementSibling.children){
                            if (child.className !== 'highlighted'){
                                span.insertAdjacentElement('afterend', button);
                                break;
                            }
                        }
                    } else if (span.parentElement.nextElementSibling.className !== 'highlighted'){
                        span.insertAdjacentElement('afterend', button)
                    }
                } else {
                    span.insertAdjacentElement('afterend', button)
                }
            }
        }
    }

    componentDidUpdate() {
        if (this.props.doctext  ) {
            this.props.loadHandler();

            // Remove highlighter listener
            if (localStorage.getItem("first-click") === "yes"){
                let highlighterOptions = {
                    color: 'rgb(252,214,26)',
                };
                let highlighter = new TextHighlighter(document.getElementById("documentText"), highlighterOptions);
                console.log("Updated first click")
                let userId = localStorage.getItem("user-id");
                let currentDoc = localStorage.getItem("opened-doc");
                let hlId = userId + '_' + currentDoc;
                let currentHls = JSON.parse(localStorage.getItem(hlId));
                if (currentHls){
                    highlighter.deserializeHighlights(currentHls);
                }
                let oldElement = document.getElementById("documentText");
                let newElement = oldElement.cloneNode(true);
                oldElement.parentNode.replaceChild(newElement, oldElement);
                localStorage.setItem("first-click", "no")
            }
            this.createButton()
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.doctext && nextProps.url !== this.props.url) {
            nextProps.loadHandler();
        }
    }
    createHTML(text) {
        return {__html: text};
    }
    render() {
        let renderText = (doc) => {
            const regexOpenAnchor = /<a.*?>/g;
            let cleanedOpenAnchors = doc.replace(regexOpenAnchor, '');
            const regexCloseAnchor = /<\/a>/g;
            let cleanedCloseAnchors = cleanedOpenAnchors.replace(regexCloseAnchor, '');
            const regexSuperscript = /<sup.*?\/sup>/g;
            let cleanedSuperscripts = cleanedCloseAnchors.replace(regexSuperscript, '');
            let wikiEditTags = /<span><span>\[<\/span>edit<span>]<\/span><\/span>/g;
            let cleanedWikiEdit = cleanedSuperscripts.replace(wikiEditTags, '');
            const regexOpenCite = /<cite.*?>/g;
            let cleanedOpenCite = cleanedWikiEdit.replace(regexOpenCite, '');
            const regexCloseCite = /<\/cite>/g;
            let cleanedCloseCite = cleanedOpenCite.replace(regexCloseCite, '');
            const regexOpenSpan = /<span.*?>/g;
            let cleanedOpenSpan = cleanedCloseCite.replace(regexOpenSpan, '');
            const regexCloseSpan = /<\/span>/g;
            let cleanedCloseSpan = cleanedOpenSpan.replace(regexCloseSpan, '');
            const regexOpenBQ = /<blockquote.*?>/g;
            let cleanedOpenBQ = cleanedCloseSpan.replace(regexOpenBQ, '');
            const regexCloseBQ = /<\/blockquote>/g;
            let cleanedCloseBQ = cleanedOpenBQ.replace(regexCloseBQ, '');
            let cleanHTML = [];
            cleanHTML.push(
                <span dangerouslySetInnerHTML ={{__html: cleanedCloseBQ}} />
            );
            return cleanHTML
        };

        this.createButton();
        
        
        return (
            <div className="page">
                {this.props.doctext ?
                    <div className={"textBackground"}>
                        <div className={"documentText"} id={"documentText"}>
                            {renderText(this.props.doctext)}
                        </div>
                    </div>
                    :(
                        <div className={"textBackground"}>
                            <div className={"documentText"} id={"documentText"}>
                                {renderText(this.props.doctext)}
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
};