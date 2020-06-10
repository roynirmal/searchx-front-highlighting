import './Savedhighlight.pcss';
import React from 'react';
import SavedhighlightItem from './SavedhighlightItem';
import SavedhighlightWindow from "./SavedhighlightWindow";
import AccountStore from "../../../../../stores/AccountStore";

const Savedhighlights = function({savedhighlights, popup, removeHandler, starHandler, clickHandler, popupHandler}) {
    // console.log("Item", savedhighlights)
    const list = savedhighlights.map((data, index) => {

        let hlObj = JSON.parse(localStorage.getItem(AccountStore.getUserId()))
        let highlights = hlObj[data.url]
        return <SavedhighlightItem
            key={index}
            data={data}
            removeHandler={removeHandler}
            starHandler={starHandler}
            clickHandler={clickHandler}
            highlights = {highlights}
        />
    });

    return (
        <div className="Savedhighlights">
            <h3 className="banner" onClick={popupHandler}>
                <i className="fa fa-bookmark medium"/> Your Highlights
            </h3>

            <div className="list">
                {list}
            </div>

            <SavedhighlightWindow
                active={popup}
                list={list}
                closeHandler={popupHandler}
            />
        </div>
    )
};

export default Savedhighlights;