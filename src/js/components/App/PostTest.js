

import React from 'react';

import * as Survey from 'survey-react';
import taskStore from '../../stores/TaskStore';

import AccountStore from '../../stores/AccountStore';

export default class PostTest extends React.Component {

   componentWillMount() {    
    Survey.Survey.cssType = "bootstrap";
    Survey.defaultBootstrapCss.navigationButton = "btn btn-green";
  }

  render() {  

    var data = taskStore.getPostTest(AccountStore.getTaskId());

    var survey = new Survey.Model(data);

    survey.onComplete.add( function(result){
        //TODO send result.data to server
    });


    return (
      <div> 
          <Survey.Survey model={survey}/>
        </div>
      
    );
  }
}