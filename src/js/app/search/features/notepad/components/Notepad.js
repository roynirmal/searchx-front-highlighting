import './Notepad.pcss';
import React from 'react';
import Iframe from "react-iframe";


const Notepad = function(props) {

    function getReadOnlyPad(padId){
        const Http = new XMLHttpRequest();
        let apiKey = '3a27994624a454bacdc02ba368ed25268f5b60079fa1429c0c9ac5d3b69c0abb'; // localManuel
        apiKey = 'a7ffd005ad9357ee7b8b0fb1650a38a32a0638476a009d49cc0437e44ad01a85';

        let url = 'http://localhost:9001/api/1.2.13/getReadOnlyID?apikey=' + apiKey + '&padID=' + padId + '?withCredentials=false'; // localManuel
        url = 'http://lambda4.ewi.tudelft.nl/api/1.2.13/getReadOnlyID?apikey=' + apiKey + '&padID=' + padId ;

        Http.open("GET", url, false);
        Http.setRequestHeader("Content-Type", "text/plain");
        Http.send();
        let responseText = Http.responseText;
        responseText = JSON.parse(responseText)
        let readOnlyID = responseText['data']['readOnlyID']

        return 'http://lambda4.ewi.tudelft.nl/ro/' + readOnlyID
    }

    function getPadUrl(padId){
        let padUrl = "http://localhost:9001/p/" + padId + "?showControls=true&showChat=false&showLineNumbers=true&useMonospaceFont=false&withCredentials=true"; // localManuel
        padUrl = "http://lambda4.ewi.tudelft.nl/p/" + padId + "?showControls=false&showChat=false&showLineNumbers=true&useMonospaceFont=false&withCredentials=false";

        if (localStorage.getItem('post-test') === '1'){
            padUrl = getReadOnlyPad(padId)
        }
        return padUrl
    }

    const sidebarClass = props.isOpen ? 'sidebar open' : 'sidebar';
    const padUrl = getPadUrl(props.padUrl)
    return (
        <div className={sidebarClass}>
            <div>
                <Iframe url={padUrl}
                        width={window.innerWidth/3}
                        height={window.innerHeight - 50}
                        id="embed_readwrite"
                        className="etherpadDoc"
                        display="initial"
                        position="relative"
                        overflow="auto"/>
            </div>
        </div>
    );
};

export default Notepad;


