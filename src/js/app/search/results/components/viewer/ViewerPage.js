import React from 'react';
import Loader from 'react-loader';
import isImage from 'is-image';
import Highlighter from "react-highlight-words";

export default class ViewerPage extends React.Component {
    componentDidMount() {
        if (this.props.doctext) {
            this.props.loadHandler();
            
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
            let highlightText = (doc) => {
                
                const regex1 = /<a.*?>/g;
                let cleaned_item = doc.replace(regex1, '');
                const regex2 = /<\/a>/g;
                let cleaned_item2 = cleaned_item.replace(regex2, '');
                let hlId = localStorage.getItem("user-id")
                let currentHls = JSON.parse(localStorage.getItem(hlId));
                // currentHls = currentHls?currentHls:['']
                console.log(currentHls)
                let highlighted = []
                highlighted.push(
                    <span dangerouslySetInnerHTML ={{__html: highlightMatches(cleaned_item2, currentHls)}} /> 
                )
                return highlighted
            
        }
    let highlightMatches = (doc, currentHls) => {
        
        if (currentHls){
            currentHls.forEach(text => {
                doc = highlightInElement(doc, text)
            })
        }
        console.log(doc)
        return doc
            // <Highlighter
            //   searchWords={currentHls}
            //   textToHighlight={text}
            // //   highlightTag={Match}
            //   highlightClassName="documentText"
            // />
        }
    let  escapeRegExp = (string) => {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
          }

        let  highlightInElement = (elementHtml, text) => {
            // var elementHtml = document.getElementById(elementId).innerHTML;
            var tags = [];
            var tagLocations= [];
            var htmlTagRegEx = /<{1}\/{0,1}\w+>{1}/;
            // text = escapeRegExp(text)
            //Strip the tags from the elementHtml and keep track of them
            var htmlTag;
            while(htmlTag = elementHtml.match(htmlTagRegEx)){
                tagLocations[tagLocations.length] = elementHtml.search(htmlTagRegEx);
                tags[tags.length] = htmlTag;
                elementHtml = elementHtml.replace(htmlTag, '');
            }
        
            //Search for the text in the stripped html
            var textLocation = elementHtml.search(text);
            if(textLocation){
                //Add the highlight
                console.log(text)
                var highlightHTMLStart = '<mark>';
                var highlightHTMLEnd = '</mark>';
                elementHtml = elementHtml.replace(text, highlightHTMLStart + text + highlightHTMLEnd);
        
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
                  else {
                    elementHtml = elementHtml.substring(0,location) + tags[i] + elementHtml.substring(location);
                  }
                    // elementHtml = elementHtml.substring(0,location) + tags[i] + elementHtml.substring(location);
                }
            }
        
            //Update the innerHTML of the element
            // document.getElementById(elementId).innerHTML = elementHtml;
            return elementHtml
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