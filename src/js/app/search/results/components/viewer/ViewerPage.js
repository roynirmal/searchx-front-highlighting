import React from 'react';
import Loader from 'react-loader';
import isImage from 'is-image';
// import highlighter from "./Highlighter"
import Rating from 'react-rating';
// import highlightStored from "../../../../../utils/Highlighter"
import $ from 'jquery'

import TextHighlighter from 'texthighlighter';
import AccountStore from "../../../../../stores/AccountStore";

var highlighter;

export default class ViewerPage extends React.Component {
    componentDidMount() {
        if (this.props.doctext) {
            this.props.loadHandler();
            
        }
        // this.props.highlightClickHandler();
        // function updateHighlights(highlights){
        //     let hlId = AccountStore.getUserId();
        //     let currentHls = JSON.parse(localStorage.getItem(hlId));
        //     let newHls = highlights.map(function (h) {
        //         return h.innerText;
        //     }).join('');
        //     let updatedHLs = [];
        //     if (currentHls){
        //         for (let hl of currentHls){
        //             updatedHLs.push(hl)
        //         }
        //     }
        //     updatedHLs.push(newHls);
        //     localStorage.setItem(hlId, JSON.stringify(updatedHLs));
        //
        //     // copyHlsToNotepad(newHls);
        //
        //     window.alert('Created ' + highlights.length + ' highlight(s): ' + highlights.map(function (h) {
        //         return '"' + h.innerText + '"';
        //     }).join(''));
        // }

        
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
        let highlightText = (doc) => {
            const regex1 = /<a.*?>/g;
            let cleaned_item = doc.replace(regex1, '');
            const regex2 = /<\/a>/g;
            let cleaned_item2 = cleaned_item.replace(regex2, '');
            let hlId = localStorage.getItem("user-id")
            let currentHls = JSON.parse(localStorage.getItem(hlId));
            
            // currentHls = currentHls?currentHls:['']
            // console.log(currentHls)
            let highlighted = []
            highlighted.push(
                <span dangerouslySetInnerHTML ={{__html: highlightMatches(cleaned_item2, currentHls)}} /> 
            )
            return highlighted
            
        }
        let highlightMatches = (doc, currentHls) => {
            let currentDoc = localStorage.getItem("opened-doc");
            if (currentHls){
                if (currentHls[currentDoc]){
                    // loop through the multiple highlighted spans in a document
                    currentHls[currentDoc].forEach(text => {
                        // before sending the doc to the highlighter function split it, this is for early breaking. Check highlightInElement function.
                        doc = highlightInElement(doc.split('\n'), text)  
                })
            }
            }
            // console.log(doc)
            return doc
            }
        let  escapeRegExp = (string) => {
            return string.replace(/[*+^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        }

        function highlightInElement  (p, text) {

            let z = 0
            // loop through each splitted portion of the text
            for (let elementHtml of p) {
                //index of splitted portion
                z = z + 1
                var tags = [];
                var tagLocations= [];
                var htmlTagRegEx = /<{1}\/{0,1}\w+>{1}/;
                //Strip the tags from the elementHtml and keep track of them
                var htmlTag;
              //	text = escapeRegExp(text)
                while(htmlTag = elementHtml.match(htmlTagRegEx)){
                    tagLocations[tagLocations.length] = elementHtml.search(htmlTagRegEx);
                    tags[tags.length] = htmlTag;
                    elementHtml = elementHtml.replace(htmlTag, '');
                }
                //Search for the text in the stripped html
                let r = new RegExp(escapeRegExp(text), "g");
                var textLocation = elementHtml.search(r);

                if(textLocation>=0){
                    //found the match
                    //Add the highlight
                    var highlightHTMLStart = '<mark>';
                    var highlightHTMLEnd = '</mark>';
                 
                    elementHtml = elementHtml.replace(r, highlightHTMLStart + text + highlightHTMLEnd);
                  
                    //plug back in the HTML tags
                    var textEndLocation = textLocation + text.length;
                    for(let i=tagLocations.length-1; i>=0; i--){
                        var location = tagLocations[i];
                        if(location > textEndLocation){ 
                            location += highlightHTMLStart.length + highlightHTMLEnd.length;
                        } else if(location > textLocation){
                            location += highlightHTMLStart.length;
                        }
                        if (elementHtml.substring(location).startsWith('<mark>')){
                        
                            if (tags[i][0] === '<p>'){
                            // console.log("here")
                            elementHtml = elementHtml.substring(0,location) + tags[i] + elementHtml.substring(location);
                            } else {
                            elementHtml = elementHtml.substring(0,location+6) + tags[i] + elementHtml.substring(location+6);
                            }
                        }
                        else  {
                            elementHtml = elementHtml.substring(0,location) + tags[i] + elementHtml.substring(location);
                        } 
                    
                    }
                    // replace the matched element of the original array with the highlighted html code
                    p[z-1] = elementHtml
                    // break out of the loop so that we dont have to go through all the splitted HTML elements.
                    break
                }
           } 
  			
            return p.join('\n')
        }

    
        return (
            <div className="page">
                {this.props.doctext ? (
                    
                        <div className={"textBackground"}>
                             
 
                    
                            <div className={"documentText"} >
                                {highlightText(this.props.doctext)}
                           
                            </div>
                        </div>
                    ) :
                    [
                        <div id="viewer-content-loader">
                            <Loader/>
                        </div>,
                        isImage(this.props.url) ?
                            <img src={this.props.url} onLoad={this.props.loadHandler} alt={this.props.url}/>
                            :
                            <iframe title={this.props.url} scrolling="yes"
                                    frameBorder="0"
                                    src={`${process.env.REACT_APP_RENDERER_URL}/${this.props.url}`}
                                    onLoad={this.props.loadHandler}>
                            </iframe>
                    ]
                }
            </div>
        )
    }
};