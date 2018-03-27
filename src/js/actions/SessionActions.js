import ActionTypes from "./ActionTypes";
import {dispatch} from "../utils/Dispatcher";

export default {
    //// Query History

    getQueryHistory() {
        dispatch({
            type: ActionTypes.GET_QUERY_HISTORY,
            payload: {}
        })
    },

    //// Bookmark

    getBookmarks() {
        dispatch({
            type: ActionTypes.GET_BOOKMARKS,
            payload: {}
        })
    },

    addBookmark(url, title) {
        dispatch({
            type: ActionTypes.ADD_BOOKMARK,
            payload: {
                url: url,
                title: title
            }
        })
    },

    removeBookmark(url) {
        dispatch({
            type: ActionTypes.REMOVE_BOOKMARK,
            payload: {
                url: url
            }
        })
    },

    starBookmark(url) {
        dispatch({
            type: ActionTypes.STAR_BOOKMARK,
            payload: {
                url: url
            }
        })
    },

    //// Annotation

    getAnnotations(url) {
        dispatch({
            type: ActionTypes.GET_ANNOTATIONS,
            payload: {
                url: url
            }
        })
    },

    addAnnotation(url, annotation) {
        dispatch({
            type: ActionTypes.ADD_ANNOTATION,
            payload: {
                url: url,
                annotation: annotation
            }
        })
    },

    removeAnnotation(url, position) {
        dispatch({
            type: ActionTypes.REMOVE_ANNOTATION,
            payload: {
                url: url,
                position: position
            }
        })
    },

    //// Rating

    getRating(url) {
        dispatch({
            type: ActionTypes.GET_RATING,
            payload: {
                url: url
            }
        })
    },

    submitRating(url, rating) {
        dispatch({
            type: ActionTypes.SUBMIT_RATING,
            payload: {
                url: url,
                rating: rating
            }
        })
    },
}