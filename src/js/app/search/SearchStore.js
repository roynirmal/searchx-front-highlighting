import request from 'superagent';
import EventEmitter from 'events';
import config from "../../config"

import {register} from '../../utils/Dispatcher';
import ActionTypes from '../../actions/ActionTypes';
import SessionActions from '../../actions/SessionActions';

import {log} from '../../utils/Logger';
import {LoggerEventTypes} from '../../utils/LoggerEventTypes';
import Helpers from '../../utils/Helpers';

import SyncStore from '../../stores/SyncStore';
import AccountStore from '../../stores/AccountStore';
import history from "../History";

const env = require('env');
const CHANGE_EVENT = 'change_search';

////

const provider = Helpers.getURLParameter('provider') || config.defaultProvider;
const variant = Helpers.getURLParameter('variant') || 'SS1';

let state = {
    query: Helpers.getURLParameter('q') || '',
    variant: variant,
    vertical: Helpers.getURLParameter('v') || config.providerVerticals[provider].keys().next().value,
    relevanceFeedback: variant === 'SS2' ? 'individual' : variant === 'SS3' ? 'shared' : false,
    distributionOfLabour: variant === 'SS0' ? false : variant === 'SS1-Hard' ? 'unbookmarkedOnly' : 'unbookmarkedSoft',
    page: parseInt(Helpers.getURLParameter('p')) || 1,
    provider: provider,

    submittedQuery: false,
    finished: false,
    resultsNotFound: false,

    results: [],
    matches: 0,
    elapsedTime: 0,
    serpId: '',

    tutorial: false,
    activeUrl: "",
    activeDoctext: "",
};

////

const SearchStore = Object.assign(EventEmitter.prototype, {
    emitChange() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    setSearchTutorialData() {
        state.tutorial = true;
        this.emitChange();
    },
    removeSearchTutorialData() {
        state.tutorial = false;
        this.emitChange();
    },

    ////

    getActiveUrl() {
        return state.activeUrl
    },
    getMatches(){
        return state.matches || 0;
    },
    getElapsedTime(){
        return state.elapsedTime;
    },
    getSerpId() {
        return state.serpId;
    },
    getProvider() {
        return state.provider;
    },
    getVariant() {
        return state.variant;
    },
    getDistributionOfLabour() {
        return state.distributionOfLabour;
    },
    getRelevanceFeedback() {
        return state.relevanceFeedback;
    },
    getActiveDoctext() {
        return state.activeDoctext;
    },
    getTutorial() {
        return state.tutorial;
    },

    getSearchResults() {
        if (state.tutorial) {
            return [
                {name: "You can view the first result here", id: "1" , snippet: "This is the first result...", metadata: {}},
                {name: "You can view the second result here", id: "2" , snippet: "This is the second result...", metadata: {bookmark: {userId: AccountStore.getUserId(), date: new Date()}, views: 10, rating: -5, annotations: 10}},
                {name: "You can view the third result here", id: "3" , snippet: "This is the third result...", metadata: {bookmark: {userId: 'test', date: new Date() - 2000}}},
                {name: "You can view the fourth result here", id: "4" , snippet: "This is the fourth result...", metadata: {}},
                {name: "You can view the fifth result here", id: "5" , snippet: "This is the fifth result...", metadata: {}}
            ];
        }

        return state.results;
    },
    getSearchState() {
        return {
            query: state.query,
            vertical: state.vertical,
            page: state.page || 1,
            provider: state.provider
        };
    },
    getSearchProgress() {
        return {
            submittedQuery: state.submittedQuery,
            finished: state.finished,
            resultsNotFound: state.resultsNotFound
        }
    },

    ////

    modifyMetadata(id, newData) {
        state.results.forEach((result) => {
            if (result.id) {
                if (result.id === id) {
                    result.metadata = Object.assign(result.metadata, newData);
                }
            } else if (result.url === id ) {
                result.metadata = Object.assign(result.metadata, newData);
            }
        });

        SearchStore.emitChange();
    },

    ////

    dispatcherIndex: register(action => {
        switch(action.type) {
            case ActionTypes.SEARCH:
                _search(action.payload.query, action.payload.vertical, action.payload.page);
                break;
            case ActionTypes.CHANGE_VERTICAL:
                _search(state.query, action.payload.vertical, 1);
                break;
            case ActionTypes.CHANGE_PAGE:
                _search(state.query, state.vertical, action.payload.page);
                break;
            case ActionTypes.UPDATE_METADATA:
                _search(state.query, state.vertical, state.page);
                break;
            case ActionTypes.OPEN_URL:
                state.activeUrl = action.payload.url;
                state.activeDoctext = action.payload.doctext;
                SyncStore.emitViewState(action.payload.url);
                break;
            case ActionTypes.CLOSE_URL:
                state.activeUrl = "";
                state.activeDoctext = "";
                SyncStore.emitViewState(null);
                break;
            case ActionTypes.GET_DOCUMENT_BY_ID:
                _getById(action.payload.id);
                break;
        }

        SearchStore.emitChange();
    })
});

////

const _search = (query, vertical, page) => {
    const startTime = new Date().getTime();

    if (!(query === state.query && vertical === state.vertical && page === state.page)) {
        state.results = [];
    }

    state.query = query || state.query;
    state.vertical = vertical || state.vertical;
    state.page = page || state.page || 1;
    state.submittedQuery = true;
    state.finished = false;
    state.resultsNotFound = false;

    _updateUrl(state.query, state.vertical, state.page, state.provider, state.variant);
    SyncStore.emitSearchState(SearchStore.getSearchState());
    SearchStore.emitChange();

    ////

    if (query === '') {
        return;
    }

    request
        .get(env.serverUrl + '/v1/search/'+state.vertical
            + '/?query='+ state.query
            + '&page='+ state.page
            + '&userId='+ AccountStore.getUserId()
            + '&sessionId='+ AccountStore.getSessionId()
            + '&providerName=' + state.provider
            + '&relevanceFeedback=' + state.relevanceFeedback
            + '&distributionOfLabour=' + state.distributionOfLabour
        )
        .end((err, res) => {
            if (!res.body.error) {
                const results = res.body.results;
                for (let i = 0; i < results.length; i++) {
                    results[i].position = i;
                }

                state.results = results;
                state.matches = res.body.matches;
                state.serpId = res.body.id;
            } else {
                state.results = [];
            }

            if (state.results.length === 0) {
                state.resultsNotFound = true;
            }

            state.elapsedTime = (new Date().getTime()) - startTime;
            state.finished = true;

            log(LoggerEventTypes.SEARCHRESULT_ELAPSEDTIME, {
                query: state.query,
                page: state.page,
                provider: state.provider,
                vertical: state.vertical,
                serpId: state.serpId,
                elapsedTime: state.elapsedTime
            });

            SearchStore.emitChange();
            SessionActions.getQueryHistory();
        });
};

const _getById = function (id) {
    request
        .get(env.serverUrl + '/v1/search/' + state.vertical
            + '/getById/' + id
            + '?providerName=' + state.provider
        )
        .end((err, res) => {
            if (!res.body.error) {
                const result = res.body.result;
                console.log('getById');
                console.log(result);

                state.activeUrl = result.id;

                var doctext = result.text.split('\n').map((item, key) => {
                    return <span key={key}>{item}<br/></span>
                })
             
                doctext.unshift(<h4> {result.source} <br/></h4>);
                doctext.unshift(<h3> {result.name} <br/></h3>);

                state.activeDoctext = doctext;
            }

            SyncStore.emitViewState(id);
            SearchStore.emitChange();
        });
};

const _updateUrl = function(query, vertical, page, provider, variant) {
    const url = window.location.href;
    const route = url.split("/").pop().split("?")[0];
    const params = 'q='+ query +'&v='+ vertical.toLowerCase() +'&p='+ page + '&provider=' + provider + '&variant=' + variant;

    history.push({
        pathname: route,
        search: params
    });
};

////

if (Helpers.getURLParameter('q')) {
    _search();
}

export default SearchStore;
