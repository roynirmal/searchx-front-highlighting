import React from 'react';
import TextHighlighter from "texthighlighter";
export default class ViewerPage extends React.Component {
    createButton() {
        let doctext = document.getElementById("documentText");
        let buttons;
        if (doctext) {
            buttons = [...doctext.getElementsByClassName("btn-xs")];
            for (let btn of buttons){
                let tempParent = btn.parentNode;
                tempParent.removeChild(btn)
            }
        }

        let spans = [...document.getElementsByClassName('highlighted')];
        for (let span of spans) {
            let button = document.createElement("BUTTON");
            button.innerHTML = "x";
            button.setAttribute("class", "btn-xs");
            button.onclick = function () {
                let buttonParentElement = button.parentElement;
                let elem = button.previousSibling;
                buttonParentElement.removeChild(button);
                let flag = true;
                while (flag){
                    flag = false;
                    console.log(elem.innerText);
                    let directPrevious = elem.previousElementSibling;
                    let directParent = elem.parentElement;

                    if (elem.previousSibling && elem.previousSibling.nodeName === "#text") {
                        elem.outerHTML = elem.innerHTML;
                        elem = directPrevious;
                    } else if (directParent.previousSibling && directParent.previousSibling.nodeName === '#text') {
                        elem.outerHTML = elem.innerHTML;
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
                            elem.outerHTML = elem.innerHTML;
                            elem = directPrevious;
                        }
                    } else if (directParent.previousElementSibling && ["I", "B"].includes(directParent.nodeName)){
                        if (directParent.previousElementSibling.className === "highlighted"){
                            flag = true;
                        } else if (directParent.previousElementSibling.children.length > 0){
                            let children = [...directParent.previousElementSibling.children];
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
                            elem.outerHTML = elem.innerHTML;
                            elem = directParent.previousElementSibling;
                        }
                    } else if (!elem.previousSibling && (!directParent.previousSibling ||
                        ['P', 'UL', 'LI', 'H1', 'H2', 'H3', 'TH', 'TD'].includes(directParent.nodeName))) {
                        elem.outerHTML = elem.innerHTML;
                    }
                }
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
                } else if (span.innerText === span.parentElement.innerText &&
                    ['LI', 'P', 'H1','H2','H3'].includes(span.parentElement.tagName)){
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
    // componentDidMount() {
    //     if (this.props.doctext ) {
    //         this.props.loadHandler();
    //         let highlighterOptions = {
    //             color: '#1afc28'
    //         };
    //         let highlighter = new TextHighlighter(document.getElementById("documentText"), highlighterOptions);
    //         console.log('Mounting');
    //         let userId = localStorage.getItem("user-id");
    //         let currentDoc = localStorage.getItem("opened-doc");
    //         let hlId = userId + '_' + currentDoc;
    //         let currentHls = JSON.parse(localStorage.getItem(hlId));
    //         if (currentHls){
    //             highlighter.deserializeHighlights(currentHls);
    //         }
    //         // Remove highlighter listener
    //         // let oldElement = document.getElementById("documentText");
    //         // let newElement = oldElement.cloneNode(true);
    //         // oldElement.parentNode.replaceChild(newElement, oldElement);
    //         // this.createButton()
    //     }
    // }
    componentDidUpdate() {
        if (this.props.doctext  ) {
            this.props.loadHandler();
 
            console.log('Updating');
  
            // Remove highlighter listener
            if (localStorage.getItem("first-click") === "yes"){ 
                let highlighterOptions = {
                    color: '#fcfa40'
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
            const regex1 = /<a.*?>/g;
            let cleanedItem = doc.replace(regex1, '');
            const regex2 = /<\/a>/g;
            let cleanedItem2 = cleanedItem.replace(regex2, '');
            let regex3 = /<sup.*?\/sup>/g
            let cleanedItem3 = cleanedItem2.replace(regex3, '');
            let cleanHTML = [];
            cleanHTML.push(
                <span dangerouslySetInnerHTML ={{__html: cleanedItem3}} />
            );
            return cleanHTML
        };
        console.log("VP Render");
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
                    // todo cleanup
                    // [
                    //     <div id="viewer-content-loader">
                    //         <Loader/>
                    //     </div>,
                    //     isImage(this.props.url) ?
                    //         <img src={this.props.url} onLoad={this.props.loadHandler} alt={this.props.url}/>
                    //         :
                    //         <iframe title={this.props.url} scrolling="yes"
                    //                 frameBorder="0"
                    //                 src={`${process.env.REACT_APP_RENDERER_URL}/${this.props.url}`}
                    //                 onLoad={this.props.loadHandler}>
                    //         </iframe>
                    // ]
                }
            </div>
        )
    }
};