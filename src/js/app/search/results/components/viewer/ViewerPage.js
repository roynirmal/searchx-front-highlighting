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
            let hlId = localStorage.getItem("user-id")
            let currentHls = JSON.parse(localStorage.getItem(hlId));
            currentHls = currentHls?currentHls:['']
            console.log(currentHls)
            let highlighted = []
            let text =''
            doc.forEach((item, i) => {
                // console.log("DOC", doc)
                text = text + item.props.dangerouslySetInnerHTML.__html
                
            });
            highlighted.push(
                <span> {highlightMatches(text, currentHls)}</span> 
            )
            return highlighted
            
        }
    let highlightMatches = (text, currentHls) => {
        return (
            <Highlighter
              searchWords={currentHls}
              textToHighlight={text}
            //   highlightTag={Match}
              highlightClassName="documentText"
            />
          );
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