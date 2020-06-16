import React from 'react';
import Savedhighlight from "./components/Savedhighlight";

import SessionActions from "../../../../actions/SessionActions";
import SearchStore from "../../SearchStore";
import SessionStore from "../../../../stores/SessionStore";
// import SavedhighlightStore from "./SavedhighlightStore";
import SearchActions from "../../../../actions/SearchActions";
import BookmarkStore from "../bookmark/BookmarkStore";
import AccountStore from "../../../../stores/AccountStore";
import {log} from '../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../utils/LoggerEventTypes';

function removeHandler(url) {
    SessionActions.removeBookmark(url);
    SearchStore.modifyMetadata(url, {
        bookmark: null
    });
    let hl = JSON.parse(localStorage.getItem(AccountStore.getUserId()))
    console.log("Delete", hl)
    delete hl[btoa(url)]
    console.log("Delete", hl)
    localStorage.setItem(AccountStore.getUserId(), JSON.stringify(hl))
    localStorage.removeItem(AccountStore.getUserId()+'_'+url)
    log(LoggerEventTypes.HIGHLIGHT_ACTION, {
        url: url,
        action: "delete",
        currentHl: hl
    });
}

function starHandler(url) {
    SessionActions.starBookmark(url);
}

function clickHandler(url, doctext) {
    SearchActions.openUrl(url, doctext);
}

export default class SavedhighlightContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            savedhighlights: [],
            popup: false
        };

        SessionActions.getBookmarksAndExcludes();
        this.changeHandler = this.changeHandler.bind(this);
        this.popupHandler = this.popupHandler.bind(this);
    }

    componentWillMount() {BookmarkStore.addChangeListener(this.changeHandler);}
    componentWillUnmount() {BookmarkStore.removeChangeListener(this.changeHandler);}

    render() {
  
        return <Savedhighlight
            savedhighlights={this.state.savedhighlights}
            popup={this.state.popup}
            removeHandler={removeHandler}
            starHandler={starHandler}
            clickHandler={clickHandler}
            popupHandler={this.popupHandler}
            
        />
    }

    ////

    changeHandler() {
        
        let savedhighlights = BookmarkStore.getBookmarks();
        if (!this.props.collaborative) {
            savedhighlights = savedhighlights.filter((data) => {
                return data.userId === AccountStore.getUserId();
            })
        }
        savedhighlights = savedhighlights.map((data) => {
            data.userColor = SessionStore.getMemberColor(data.userId);
            return data;
        });
        this.setState({
            savedhighlights: savedhighlights
        });
        
    }

    popupHandler() {
        this.setState({
            popup: !this.state.popup
        });
    }
}