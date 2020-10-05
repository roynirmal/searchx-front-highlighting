import React from "react";
import Form from "../components/form/Form";
import constants from "./constants";

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";

import AccountStore from "../../../stores/AccountStore";
import SessionStore from "../../../stores/SessionStore";

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.onComplete = this.onComplete.bind(this);
    }

    render() {
        return <Form
            formData={formData()}
            onComplete={this.onComplete}
        />
    }

    ////

    onComplete(data) {
        log(LoggerEventTypes.SURVEY_REGISTER_RESULTS, {
            data: data
        });

        const userId = data['userId'].trim();
        AccountStore.clearUserData();
        AccountStore.setUserId(userId);

        const taskParams = {
            groupSize: constants.groupSize,
            topicsSize: constants.topicsSize
        };

        SessionStore.initializeTask(constants.taskId, taskParams, (res) => {
            if (res) {
                
                if ('topic' in res.taskData) {
                    this.props.history.push('/sync/session');
                } else {
                    this.props.history.push('/sync/pretest');
                }
            }
        });
    }
}

const formData = function() {
    let pages = [];
    let elements = [];

    elements.push({
        type: "html",
        name: "topic",
        html: "<h2>STUDY DESCRIPTION:  Search as Learning</h2>"
    });

    elements.push({
        type: "html",
        name: "start",
        html: `
       
        <hr/>
       
        
        <img src ="/img/search.png" width="50" height="50"> 
        <br>
        <h3> Spend 20 minutes to learn about a topic by searching the web</h3> 
        <h3> with our search engine!</h3>
        <hr/>
        <p>The study consists of three phases: a questionnaire, a search phase and another questionnaire.</p>
        
        <p> Each questionnaire contains questions about one or more topics&mdash;please answer the questions truthfully. 
        Your payment is <b>not</b> affected by the number of correct or incorrect answers. 
        Most questions are multiple-choice questions. In the second questionnaire we ask you to write a summary  too.
        </p>
        
        <h3> <img src ="/img/experiment.png" width="50" height="50"> The experiment  </h3>
        <hr/>
        <p>During the search phase we want you to use our custom search engine (which provides access to a large portion of the web) to learn about one topic &mdash;you will find a description of your topic on the right-hand side of the search interface. 
       <br>
        Our search interface has a number of user interface elements that help you to learn and search&mdash;we will introduce them to you on the next screen. </p>
        <p>You are required to search for web pages, read them and learn about a topic for at
        least 20 minutes&mdash;our interface has a timer, so you can see how much time you already spent searching. 
        After 20 minutes you can move on to the final questionnaire by clicking on the <span style="background-color: #00A6D3"><font color="white">To Final Test</span></font> button. 
        If you prefer, you can also keep searching for a bit longer and then move on.</p>

       

        <h3> <img src ="/img/list.png" width="50" height="50"> Your role  </h3>
        <hr/>
        <p> Imagine that you are searching the web with that particular information need in mind. You can use our SearchX system to issue queries and examine a series of documents for researching about your information need.  After providing us with some basic demographics information, we will present the search interface.</p>
        <ol type="-">
            <li>
                <p>  Use SearchX just as you would your chosen web search engine. Issue as many queries as you like, and examine whatever documents you like. 
                 </p> 
            </li>
            <li>
                <p> The information need we wish you search for will be outlined on the right of the screen.
                </p> 
            </li>
            <li>
                <p> Your queries will be automatically saved. You will also be able to highlight text in a document and take notes in our search interface as well. If you highlight in a document, that particular document will be saved. Your highlights and notes will also be available to you during the final questionnaire.
                </p> 
            </li>
        </ol>
        
        
        <h3> <img src ="/img/error.png" width="50" height="50"> Keep in mind...  </h3>
        <hr/>
        <p> We have a few important points: </p>
        <ol type="-">
            <li>
                <p>
                Only make use of the interface that we provide. Do not use another web search interface to dry run your queries. 
                Do not switch browser tabs–-after three tab switches we will cancel your participation.
                </p>
            </li>
            <li>
                <p>You can interact with the search results. 
                    A click on a document link will open the selected document in our own document viewer. 
                    We know that this document viewer is not perfect, but please stick with it. In the document viewer you will have access to the highlighting tool.

                </p>
            </li>
            <li>
                <p> Your highlights and notes taken during the search session will be avaiable to you during the final questionnaire. However, you will NOT be able to take more notes or highlight documents during then.
                </p>
            </li>
            <li> 
                <p>
                Keep the queries you issue on point, and relevant to the topic outline provided on the right of the search interface.
                For example, please do not issue queries for a prior topic once you have begun the search process for a new topic. 
                If you begin issuing queries that are totally off topic (e.g. queries on ice skating, Brexit, or anything else you can think of), we will cancel your participation.
                </p>
            </li>
            <li>
            <p> Once you have completed your exploration, click <span style="background-color: #00A6D3"><font color="white">To Final Test</span></font> button. Note that it will be only activate after 20 minutes. 
            </p> 
        </li>
        </ol>
        <hr/>
        Thank you for your valuable contribution and time! We really appreciate your help.
        `
    });

    pages.push({elements:  elements});

    ////

    elements = [];

    elements.push({
        type: "html",
        name: "topic",
        html: "<h2>Registration: Demographics Survey</h2>" +
        "<h3>First fill out this basic information about yourself.</h3>"
    });

    elements.push({
        title: "Insert your assigned Prolific ID here:",
        name : "userId",
        type :"text",
        inputType:"text",
        width: 300,
        isRequired: true
    });

    elements.push({
        title: "What is your highest academic degree so far?",
        name: "degree",
        type: "radiogroup",
        isRequired: true,
        choices: [
            {value: 0, text: "High School or lower"},
            {value: 1, text: "Associate's degree(s) (e.g., AA AE, AFA, AS, ASN)"},
            {value: 2, text: "Bachelor's degree(s) (e.g., BA, BBA, BFA, BS)"},
            {value: 3, text: "Master's degree(s) (e.g., MA, MBA, MFA, MS, MSW)"},
            {value: 4, text: "Specialist degree(s) (e.g., EdS)"},
            {value: 5, text: "Applied or professional doctorate degree(s) (e.g., MD, DDC, DDS, JD, PharmD)"},
            {value: 6, text: "Doctorate degree(s) (e.g., EdD, PhD)"},
            {value: 7, text: "Other"}
        ]
    });

    elements.push({
        title: "For which subject areas do you have a {degree}?",
        visibleIf: "{degree} != 7",
        name : "background",
        type :"text",
        inputType:"text",
        width: 500,
        isRequired: true
    });
    elements.push({
        title: "What is your academic degree and for which subject areas do you have the degree ?",
        visibleIf: "{degree} == 7",
        name : "background",
        type :"text",
        inputType:"text",
        width: 500,
        isRequired: true
    });

    elements.push({
        title: "Are you an English native speaker?",
        name: "english",
        type: "radiogroup",
        isRequired: true,
        choices: [
            {value: 0, text: "No"},
            {value: 1, text: "Yes"},
        ]
    });
    elements.push({
        html: "<p> Check <a href ='http://www.uefap.com/test/', target='_blank'>this chart </a> to determine your English level. </p>",
        name: "english-chart",
        type: "html",
        visibleIf: "{english} == 0"
    });
    elements.push({
        title: "What is your level of English? ",
        visibleIf: "{english} == 0",
        name : "english-level",
        type: "radiogroup",
        isRequired: true,
        choices: [
            {value: 0, text: "Beginner"},
            {value: 1, text: "Elementary"},
            {value: 2, text: "Intermediate"},
            {value: 3, text: "Upper-intermediate"},
            {value: 4, text: "Advanced"},
            {value: 5, text: "Proficient"}
        ]
    });
    elements.push({
        html: "<div class='container-fluid' style='height:calc(50vh - 50px);'>",
        name: "intentionally-blank",
        type: "html",
    });

    pages.push({elements:  elements});

    elements = [];
    
    elements.push({
        type: "html",
        name: "topic",
        html: 
        `<h3>Search as Learning</h3>
        <br/> People often search the web to learn about something&mdash;whether it is knowledge they require for work, their study or just for fun. For the next few questions, we want you to think about how often you use the web when learning something about a scientific topic. Some example questions relating to scientific topics could be: how does partial differentiation work? what is a qubit? how can you determine the water quality of a pond? etc.
        <br/>
        <br/>
        <div align="center">
        <img src ="/img/journey_2.jpeg" width="450" height="250">
        </div>
        
        `
    });

 

    elements.push({
        title: "How often do you learn about a scientific topic (see the examples above) by searching the web?",
        name: "web-previous",
        type: "comment",
        inputType: "text",
        width: 600,
        rows: 1,
        isRequired: true
    });



    elements.push({
        type: "html",
        html: "<hr/>"
    });

    elements.push({
        type: "html",
        html: "<b> Think about the most recent time you learned about a scientific topic by searching the web. </b>"
    });

    elements.push({
        title: "Describe what you were trying to learn.",
        name: "web-information-need",
        type: "comment",
        inputType: "text",
        width: 600,
        rows: 1,
        isRequired: true
    });

    elements.push({
        title: "What are your preferred online resources (like Wikipedia, Coursera, Youtube, etc.) to learn about a scientific topic?",
        name: "web-online",
        type: "comment",
        inputType: "text",
        width: 600,
        rows: 1,
        isRequired: true
    });

        elements.push({
        title: "How often do you highlight text while reading a document online or a printed article?",
        name: "hl-freq",
        type: "comment",
        inputType: "text",
        width: 600,
        rows: 1,
        isRequired: true
    });

    elements.push({
        title: "How often do you take notes while doing some research on your preferred online or offline resources?",
        name: "nt-freq",
        type: "comment",
        inputType: "text",
        width: 600,
        rows: 1,
        isRequired: true
    });

    elements.push({
        title: "To what extent you think highlighting helps or would help you learn a scientific topic more efficiently?",
        name: "hl-benefit",
        type: "comment",
        inputType: "text",
        width: 600,
        rows: 1,
        isRequired: true
    });

    elements.push({
        type: "html",
        html: "<hr/>"
    });

    pages.push({elements:  elements});


    ////

    return {
        pages: pages,
        requiredText: "",
        showQuestionNumbers: "off",
        completedHtml: "<h2>Registering user...</h2>"
    }
};

export default Register;