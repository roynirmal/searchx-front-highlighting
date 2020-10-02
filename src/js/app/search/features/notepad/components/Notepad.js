import './Notepad.pcss';
import React from 'react';
import Iframe from "react-iframe";


const Notepad = function(props) {
    const sidebarClass = props.isOpen ? 'sidebar open' : 'sidebar';
    const padUrl = "http://lambda4.ewi.tudelft.nl/p/" + props.padUrl + "?showControls=false&showChat=false&showLineNumbers=true&useMonospaceFont=false&withCredentials=true";
    // const padUrl = "http://localhost:9001/p/" + props.padUrl + "?showControls=true&showChat=false&showLineNumbers=true&useMonospaceFont=false&withCredentials=true";
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


