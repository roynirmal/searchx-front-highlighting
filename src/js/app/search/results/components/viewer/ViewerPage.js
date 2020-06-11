import React from 'react';
import Loader from 'react-loader';
import isImage from 'is-image';


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

        // todo Cleanup STORE HTML
        // let documentTextElement = document.getElementById("documentText");
        // let openDocumentName = localStorage.getItem("opened-doc");
        // let highlighting = localStorage.getItem("highlighting");
        // // console.log(old_element.childNodes[0])
        //
        // // html_obj[opened_doc].push(old_element.childNodes[0])
        //
        // if (documentTextElement && highlighting){
        //     localStorage.setItem(openDocumentName, documentTextElement.innerHTML)
        // }

        return (
            <div className="page">
                {/*{localStorage.getItem(openDocumentName) ?  */}
                {this.props.doctext ?
                <div className={"textBackground"}>
                    <div className={"documentText"} id={"documentText"}>
                        {/*{renderText(localStorage.getItem(openDocumentName))}*/}
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