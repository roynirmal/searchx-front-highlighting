import React from 'react';
import Bookmark from "./components/Bookmark";

import SessionActions from "../../../../actions/SessionActions";
import SearchStore from "../../SearchStore";
import SessionStore from "../../../../stores/SessionStore";
import BookmarkStore from "./BookmarkStore";
import SearchActions from "../../../../actions/SearchActions";
import AccountStore from "../../../../stores/AccountStore";

function removeHandler(url) {
    SessionActions.removeBookmark(url);
    SearchStore.modifyMetadata(url, {
        bookmark: null
    });
}

function starHandler(url) {
    SessionActions.starBookmark(url);
}

function clickHandler(url, doctext) {
    SearchActions.openUrl(url, doctext);
}

export default class BookmarkContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookmarks: [],
            popup: false
        };

        SessionActions.getBookmarksAndExcludes();
        this.changeHandler = this.changeHandler.bind(this);
        this.popupHandler = this.popupHandler.bind(this);
    }

    componentWillMount() {BookmarkStore.addChangeListener(this.changeHandler);}
    componentWillUnmount() {BookmarkStore.removeChangeListener(this.changeHandler);}

    render() {
        // console.log("GET BC1", this.state.bookmarks)
        return <Bookmark
            bookmarks={this.state.bookmarks}
            popup={this.state.popup}
            removeHandler={removeHandler}
            starHandler={starHandler}
            clickHandler={clickHandler}
            popupHandler={this.popupHandler}
        />
    }

    ////

    changeHandler() {
        let bookmarks = BookmarkStore.getBookmarks();
        console.log("GET QC1", bookmarks)
        if (!this.props.collaborative) {
            bookmarks = bookmarks.filter((data) => {
                return data.userId === AccountStore.getUserId();
            })
        }
        bookmarks = bookmarks.map((data) => {
            data.userColor = SessionStore.getMemberColor(data.userId);
            return data;
        });
        this.setState({
            bookmarks: bookmarks
        });
        // console.log("GET BC", this.state.bookmarks)
    }

    popupHandler() {
        this.setState({
            popup: !this.state.popup
        });
    }
}