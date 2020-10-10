import './SearchHeader.pcss';
import React from 'react';

import Logo from './Logo';
import SearchBox from './SearchBox';
import SearchVerticals from './SearchVerticals';
import AccountInfo from "./AccountInfo";
import SuggestionsContainer from "../../features/querysuggestions/SuggestionsContainer";


const Header = function ({query, vertical, provider, searchHandler, queryChangeHandler, verticalChangeHandler, timer, statusbar, userId, groupId, showAccountInfo, hideSuggestionsHandler, showSuggestionsHandler, clickSuggestionHandler, showSuggestions, load}) {
    // console.log("LOAD", load)
    return (
        <div className="SearchHeader">
            <Logo/>
            { load ? 
            <form action="/" method="GET" className="form" onSubmit={e => {
                e.preventDefault();
                searchHandler();
            }}>
                <SearchBox query={query} changeHandler={queryChangeHandler} showSuggestionsHandler={showSuggestionsHandler}/>
                <SuggestionsContainer clickSuggestionHandler={clickSuggestionHandler} hideSuggestionsHandler={hideSuggestionsHandler} showSuggestions={showSuggestions}/>    
                <SearchVerticals query={query} activeVertical={vertical} changeHandler={verticalChangeHandler}
                                 provider={provider}/>
            </form> : 
           <form action="/" method="GET" className="form" onSubmit={e => {
            e.preventDefault();
            searchHandler();
        }}> </form>
            
            }
            {showAccountInfo && <AccountInfo userId={userId} groupId={groupId}/>}
            <div className="StatusBarDiv">
                {statusbar}
            </div>
            <div className="TimerDiv">
                {timer}
            </div>

        </div>
    )
};

export default Header;