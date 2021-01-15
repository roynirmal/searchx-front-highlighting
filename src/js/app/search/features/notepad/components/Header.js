import React from "react";
import './Notepad.pcss';
import {Button} from "react-bootstrap";

const Header = function(props) {
    const headerClass = props.isOpen ? 'header open' : 'header';
    return (
        <header id='notepadButton'>
            <div className="btnSidebar" >
                <Button onClick={props.onClick}>Notepad</Button>
            </div>
        </header>
    );
};

export default Header;