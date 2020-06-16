import React from 'react';
import TextHighlighter from "texthighlighter";


export default class ViewerPage extends React.Component {
    componentDidMount() {
        if (this.props.doctext) {
            this.props.loadHandler();

            let highlighterOptions = {
                color: '#1afc28'
            };
            let highlighter = new TextHighlighter(document.getElementById("documentText"), highlighterOptions);

            let userId = localStorage.getItem("user-id");
            let currentDoc = localStorage.getItem("opened-doc");
            let hlId = userId + '_' + currentDoc;
            let currentHls = JSON.parse(localStorage.getItem(hlId));
            if (currentHls){
                highlighter.deserializeHighlights(currentHls[currentHls.length - 1]);
            }

            let oldElement = document.getElementById("documentText");
            let newElement = oldElement.cloneNode(true);
            oldElement.parentNode.replaceChild(newElement, oldElement);
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
            let cleanHTML = [];
            cleanHTML.push(
                <span dangerouslySetInnerHTML ={{__html: cleanedItem2}} />
            );
            return cleanHTML
        };

        let highlighterOptions = {
            color: '#1afc28'
        };
        let oldElement = document.getElementById("documentText");
        if (oldElement && localStorage.getItem('highlighting')) {
            let highlighter = new TextHighlighter(oldElement, highlighterOptions);
            highlighter.removeHighlights();
            let userId = localStorage.getItem("user-id");
            let currentDoc = localStorage.getItem("opened-doc");
            let hlId = userId + '_' + currentDoc;
            let currentHls = JSON.parse(localStorage.getItem(hlId));
            if (currentHls){
                highlighter.deserializeHighlights(currentHls[currentHls.length - 1]);
            }
            if(localStorage.getItem("highlight-removing")){
                localStorage.removeItem("highlight-removing");
                localStorage.removeItem("highlighting");
                let newElement = oldElement.cloneNode(true);
                oldElement.parentNode.replaceChild(newElement, oldElement);
            }
        }

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