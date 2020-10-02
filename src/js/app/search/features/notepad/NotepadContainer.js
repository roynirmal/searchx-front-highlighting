import React from 'react';
import Notepad from './components/Notepad'
import Header from "./components/Header";
import './components/Notepad.pcss'

import AccountStore from "../../../../stores/AccountStore";
import {Button} from "react-bootstrap";

function getPadUrl(){
    let url = 'SearchXtesting';
    if (AccountStore.getGroupId() === AccountStore.getSessionId()){
        url = AccountStore.getGroupId();
    }
    return url;
}

export default class NotepadContainer extends React.Component {
    constructor(props) {
        super(props);
        this.handleViewSidebar = this.handleViewSidebar.bind(this);
        this.padUrl = getPadUrl();
        this.state = {sidebarOpen: false};
    }

    handleViewSidebar(){
        this.setState({sidebarOpen: !this.state.sidebarOpen});
        let margin = window.innerWidth/3 * !this.state.sidebarOpen;
        let change = margin + 15 + "px"
        document.getElementById("notepadButton").style.right = change;
    }

    render() {
        return (
            <div className="Parent">
                <Notepad isOpen={this.state.sidebarOpen} toggleSidebar={this.handleViewSidebar} padUrl={this.padUrl}/>
                <Header onClick={this.handleViewSidebar} isOpen={this.state.sidebarOpen}/>
            </div>
        );
    }
};


