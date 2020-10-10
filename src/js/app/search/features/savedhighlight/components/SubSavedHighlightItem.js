import React from "react";

// import {LoggerEventTypes} from "../../../../../utils/LoggerEventTypes";
// import {log} from "../../../../../utils/Logger";

                   
const SubSavedHighlightItem = function({data, clickHandler, rank}) {
    // const metaInfo = {
    //     url: data
    // };

    // const contextUrlLog = () => log(LoggerEventTypes.QUERYHISTORY_CONTEXT_URL, metaInfo);

    ////

    // const individualScent = data[1];
    // const widthTotal = individualScent[0] * 100;
    // const widthTotal = 90;
    // // const widthSingleExplored = individualScent[1] * 100;
    // // let Reldoc = Math.min(20, subtopicRelCount[encodeURIComponent(data)])
    // let widthSingleExplored = score?(score[subtopic]["Units"][data]/5)*100:0;
    // widthSingleExplored = widthSingleExplored>100?100:widthSingleExplored;
    // const singleBarColor = "SubColorBarSingleExplored" 
    return  (
        
            <span style={{marginLeft: '10px'}}>
               {rank+1}. {data.substring(0, 30)}...
            </span>
        
    );
};

export default SubSavedHighlightItem;

