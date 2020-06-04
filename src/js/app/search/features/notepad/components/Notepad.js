import './Notepad.pcss';
import React from 'react';
import Iframe from "react-iframe";
import {Button} from "react-bootstrap";


const Notepad = function(props) {
    const sidebarClass = props.isOpen ? 'sidebar open' : 'sidebar';
    const padUrl = "http://localhost:9001/p/" + props.padUrl + "?showControls=true&showChat=true&showLineNumbers=true&useMonospaceFont=false";
    return (
        <div className={sidebarClass}>
            {/*<Button variant="light" onClick={props.toggleSidebar} className="sidebar-toggle">Hide Document</Button>*/}
            <div>
                <Iframe url={padUrl}
                        width="600px"
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


