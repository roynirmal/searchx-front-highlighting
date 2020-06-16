import React from 'react';
import TextHighlighter from "texthighlighter";
import SearchStore from "../../../SearchStore";
import AccountStore from "../../../../../stores/AccountStore";

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

            let old_element = document.getElementById("documentText");
            let new_element = old_element.cloneNode(true);
            old_element.parentNode.replaceChild(new_element, old_element);
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
            let cleaned_item = doc.replace(regex1, '');
            const regex2 = /<\/a>/g;
            let cleaned_item2 = cleaned_item.replace(regex2, '');
            let cleanHTML = [];
            cleanHTML.push(
                <span dangerouslySetInnerHTML ={{__html: cleaned_item2}} />
            );
            return cleanHTML
        };

        let highlighterOptions = {
            color: '#1afc28'
        };
        let old_element = document.getElementById("documentText");
        if (old_element && localStorage.getItem('highlighting')) {
            let highlighter = new TextHighlighter(old_element, highlighterOptions);
            highlighter.removeHighlights()
            let userId = localStorage.getItem("user-id");
            let currentDoc = localStorage.getItem("opened-doc");
            let hlId = userId + '_' + currentDoc;
            let currentHls = JSON.parse(localStorage.getItem(hlId));
            // console.log("currentHls", currentHls)
            if (currentHls){
                highlighter.deserializeHighlights(currentHls[currentHls.length - 1]);
            }
            if(localStorage.getItem("highlight-removing")){
                localStorage.removeItem("highlight-removing")
                localStorage.removeItem("highlighting")
                let new_element = old_element.cloneNode(true);
            old_element.parentNode.replaceChild(new_element, old_element);
            }
            
            // if(localStorage.getItem('first-remove')){
            //     console.log("here")
            //     localStorage.removeItem('highlighting')
            //     localStorage.removeItem('first-remove')
            // }

            
            // let new_element = old_element.cloneNode(true);
            // old_element.parentNode.replaceChild(new_element, old_element);
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