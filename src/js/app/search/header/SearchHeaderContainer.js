import React from 'react';

import SearchActions from '../../../actions/SearchActions';
import SessionActions from '../../../actions/SessionActions';

import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../utils/LoggerEventTypes';
import SearchHeader from "./components/SearchHeader";
import SearchStore from "../SearchStore";
import AccountStore from "../../../stores/AccountStore"

export default class SearchHeaderContainer extends React.Component {
    constructor() {
        super();
        const searchState = SearchStore.getSearchState();
        this.state = {
            searchState: searchState,
            query: searchState.query
        };

        this.changeHandler = this.changeHandler.bind(this);
        this.searchHandler = this.searchHandler.bind(this);
        this.queryChangeHandler = this.queryChangeHandler.bind(this);
        this.verticalChangeHandler = this.verticalChangeHandler.bind(this);
    }

    componentWillMount() {SearchStore.addChangeListener(this.changeHandler);}
    componentWillUnmount() {SearchStore.removeChangeListener(this.changeHandler);}

    render() {
        return <SearchHeader
            query={this.state.query}
            vertical={this.state.searchState.vertical}
            provider={this.state.searchState.provider}
            searchHandler={this.searchHandler}
            queryChangeHandler={this.queryChangeHandler}
            verticalChangeHandler={this.verticalChangeHandler}
            timer={this.props.timer}
            // these props do not update to changes
            userId={AccountStore.getUserId()}
            groupId={AccountStore.getGroupId()}
            showAccountInfo={this.props.showAccountInfo}
        />
    }

    ////

    changeHandler() {
        const nextSearchState = SearchStore.getSearchState();
        if (nextSearchState.vertical !== this.state.searchState.vertical || nextSearchState.query !== this.state.searchState.query) {
            this.setState({
                searchState: nextSearchState,
                query: nextSearchState.query
            });
        }
    }

    searchHandler() {
        log(LoggerEventTypes.SEARCH_QUERY, {
            query: this.state.query,
            vertical: this.state.searchState.vertical,
            session: localStorage.getItem("session-num")
        });

        SearchActions.search(this.state.query, this.state.searchState.vertical, 1);
        SessionActions.getBookmarksAndExcludes();
    }

    queryChangeHandler(query) {
        this.setState({
            query: query
        });
    }

    verticalChangeHandler(vertical) {
        vertical = vertical.toLowerCase();

        log(LoggerEventTypes.SEARCH_CHANGE_VERTICAL, {
            query: this.state.searchState.query,
            vertical: vertical,
            previous: this.state.searchState.vertical,
            session: localStorage.getItem("session-num")
        });

        SearchActions.changeVertical(vertical);
    }
}