import React from "react";
import {Link} from "react-router-dom";
import SyncStore from "../../../stores/SyncStore";
import TaskedSession from "../components/session/TaskedSession";
import Collapsible from "react-collapsible";
import Timer from "../components/Timer";
import constants from "./constants";
import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../utils/LoggerEventTypes';
import AccountStore from "../../../stores/AccountStore";
import IntroStore from "../../../stores/IntroStore";
import Alert from "react-s-alert";

import './Session.pcss';


class Session extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            start: false,
            finished: false,
            slideIndex: 1,
            nextbutton: "Next"
        };

        this.onFinish = this.onFinish.bind(this);
        this.onSwitchPage = this.onSwitchPage.bind(this);

        this.openModal = this.openModal.bind(this);
        this.plusSlides = this.plusSlides.bind(this);
        this.minusSlides = this.minusSlides.bind(this);

        // this.nextbutton = this.nextbutton.bind(this);
    }

    componentDidMount() {
        const taskdata = JSON.parse(localStorage.getItem("task-data") === undefined ? "{}" : localStorage.getItem("task-data")) || '';
        let td = '<h3> Your task </h3><p> The professor requires all students to demonstrate what they learn about a particular topic by conducting searches online and presenting their views on the topic. </p>';

        const introSteps = [
            {
                element: '.Task',
                intro: 'Please take a minute to read your task description.',
                position: 'left'
            },
            {
                element: '.TaskDescription',
                intro: td
            },
            {
                element: '.SearchHeader',
                intro: 'We want you to use our custom web search system SearchX to learn about the topic mentioned in the task description for at least 20 minutes. Note that the "To Final Test" button will only be accessible after 20 minutes. You can search for longer if you want to know more about the given topic.',
                position: 'bottom-middle-aligned'
            },
            {
                element: '.SearchHeader .form',
                intro: 'Use SearchX to search for webpages, publications, and other online document sources to learn about the topic. '
            },
            {
                element: '.QueryHistory',
                intro: 'The query history shows your past search queries.',
                position: 'top'
            },
            {
                element: '.Savedhighlights',
                intro: 'The saved highlights along with the documents will appear here. You can revisit them before completing the session and while writing the summary on what you have learned about the topic.',
                position: 'top'
            }

        ];     
        IntroStore.startIntro(introSteps, () => {
            const start = localStorage.getItem("timer-start") || Date.now();
            localStorage.setItem("timer-start", start);
            this.setState({
                start: start
                });
        });
    }
    // Viewer Tutorial Functions ///////////////
    openModal(){
        if (document.getElementById("myModal")){
        document.getElementById("myModal").style.display = "block";
        console.log("This is the openModal function")
        this.showSlides()
        }
    }

    closeModal(){
        document.getElementById("myModal").style.display = "none";
        localStorage.removeItem('start-hl-intro')
    }

    showSlides() {
        let i;
        let slides = document.getElementsByClassName("mySlides");
        let tutorialType = localStorage.getItem('taskType')
        if (tutorialType === 'highlightOnly') {slides.slice(0,7)}
        if (tutorialType === 'notesOnly') {slides.slice(9,)}
        if (tutorialType === 'highlightPlusNotes') {slides.slice(0,10)}
        let currentSlide = this.state.slideIndex;
        console.log('before display', currentSlide);
        if (currentSlide > slides.length) {this.closeModal()}
        else {
            if (currentSlide < 2) {document.getElementById("tutorialPrev").style.display = "none";}
            else {document.getElementById("tutorialPrev").style.display = "block";}
            if (currentSlide === slides.length){this.state.nextbutton = "Done"} else {
                this.state.nextbutton = "Next"
            }               
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }
            slides[currentSlide - 1].style.display = "block";
            console.log('after display', currentSlide);
        }
    }

    plusSlides() {
        let currentIndex = {...this.state.slideIndex}
        let refIndex = this.state.slideIndex
        console.log('ref', refIndex)
        console.log('copy', currentIndex)
        console.log('value', this.state.slideIndex)
        let newIndex = this.state.slideIndex + 1;
        this.setState({slideIndex: newIndex})

        console.log('ref', refIndex)
        console.log('copy', currentIndex)
        console.log('value', this.state.slideIndex)
        this.showSlides();
    }
    minusSlides() {
        let newIndex = this.state.slideIndex - 1;
        this.setState({slideIndex: newIndex})
        this.showSlides();
    }
    // Viewer Tutorial Functions ///////////////

    render() {
        const task = AccountStore.getTask();
        const timer = (
            <div style={{marginTop: '10px', textAlign: 'center'}}>
                <Timer start={this.state.start} duration={constants.taskDuration} onFinish={this.onFinish} style={{fontSize: '2em'}} showRemaining={false}/>
                
                
                <Link className={"btn btn-primary" + (this.state.finished ? '' : ' disabled')} to="/sync/posttest" role="button">
                        To Final Test
                </Link>
            </div>
        );
        const metaInfo = {
            session: localStorage.getItem("session-num") || 0,

        };
        let handleTaskOpen = () => {
            log(LoggerEventTypes.TASK_OPEN, metaInfo);
        };

        let handleTaskClose = () => {
            log(LoggerEventTypes.TASK_CLOSE, metaInfo);
        };

        const taskDescription = (
            <Collapsible trigger="Your Task" open transitionTime={3} onOpen={handleTaskOpen} onClose={handleTaskClose} >
                <p>
                    The professor requires all students to demonstrate what they learn about a particular topic by
                    conducting searches on the Web and presenting what they learned about it.
                    You need to use SearchX to learn about the topic. You must open and read documents that you think are
                    important about the given topic.
                </p>
                <p dangerouslySetInnerHTML={{__html: task.data.topic.description}}/>
                <hr/>
                <p> Remember: After searching for at least 20 minutes you can move on to the final test by clicking on the "To Final Test" button.
                    The documents you saved will be available to you when writing (in your own words) a short summary about the topic.
                </p>
            </Collapsible>
        );

        let captions = [
            'This is what a document looks like when you click a search result!',
            'The top right corner shows that the highlighter is active.',
            'You can click on it to deactivate the highlighting tool.',
            'When you highlight text, it will remain highlighted.',
            'You can delete each highlight with the corresponding button.',
            'Click here to close the document. You can see the list of your highlights in Your Highlights box.',
            'You can open the Notepad by clicking on the tab on the right. Your highlights will be automatically copied to the notepad.',
            'This is the Notepad interface where you can write your notes.',
            'The Notepad can be closed by clicking the tab again.',
            'You can open the Notepad by clicking on the tab on the right.',
            'This is the Notepad interface where you can write your notes.',
            'The Notepad can be closed by clicking the tab again.'
        ]
        let tutorialType = localStorage.getItem('taskType')
        if (tutorialType === 'highlightOnly') {captions.slice(0,7)}
        if (tutorialType === 'notesOnly') {captions.slice(9,)}
        if (tutorialType === 'highlightPlusNotes') {captions.slice(0,10)}
        let caption = captions[this.state.slideIndex - 1];
        let hlintro = localStorage.getItem('start-hl-intro')
        if (hlintro ){
            console.log(hlintro, "HLINTO")
            this.openModal()
        }
        
        return (
            <div>
                <TaskedSession 
                timer={timer}
                taskDescription={taskDescription} 
                onSwitchPage={this.onSwitchPage}
                lastSession={false} 
                firstSession={false}/>
                {/*// Viewer Tutorial Content ///////////////*/}
                {/* {hlintro === true? this.openModal() : [] } */}
                {/* <div>
                    <h2 onClick={this.openModal}> OpenTutorial </h2>
                </div> */}
                <div id="myModal" className="tutorialModal">
                    <span className="tutorialClose" onClick={this.closeModal}>&times;</span>
                    <div className="modal-content">
                        <div className="mySlides">
                            <img src='/img/viewerTutorial/Slide1.PNG' className='tutorialSlide' />
                        </div>

                        <div className="mySlides">
                            <img src='/img/viewerTutorial/Slide2.PNG' className='tutorialSlide' />
                        </div>

                        <div className="mySlides">
                            <img src='/img/viewerTutorial/Slide3.PNG' className='tutorialSlide' />
                        </div>

                        <div className="mySlides">
                            <img src='/img/viewerTutorial/Slide4.PNG' className='tutorialSlide' />
                        </div>

                        <div className="mySlides">
                            <img src='/img/viewerTutorial/Slide5.PNG' className='tutorialSlide' />
                        </div>

                        <div className="mySlides">
                            <img src='/img/viewerTutorial/Slide6.PNG' className='tutorialSlide' />
                        </div>

                        <div className="mySlides">
                            <img src='/img/viewerTutorial/Slide7.PNG' className='tutorialSlide' />
                        </div>

                        <div className="mySlides">
                            <img src='/img/viewerTutorial/Slide8.PNG' className='tutorialSlide' />
                        </div>

                        <div className="mySlides">
                            <img src='/img/viewerTutorial/Slide9.PNG' className='tutorialSlide' />
                        </div>

                        <div className="mySlides">
                            <img src='/img/viewerTutorial/Slide10.PNG' className='tutorialSlide'  />
                        </div>

                        <div className="mySlides">
                            <img src='/img/viewerTutorial/Slide11.PNG' className='tutorialSlide' />
                        </div>

                        <div className="mySlides">
                            <img src='/img/viewerTutorial/Slide12.PNG' className='tutorialSlide' />
                        </div>

                        
                        <div className="caption-container">
                            <p id="caption">{caption}</p>
                            <a id='tutorialPrev' className="tutorialPrev" onClick={this.minusSlides}>Back</a>
                        <a id='tutorialNext' className="tutorialNext" onClick={this.plusSlides}>{this.state.nextbutton}</a>

                        </div>
                    </div>
                </div>
            </div>
        )
    }


    

    onFinish() {
        // if (localStorage.session ==1):
        this.setState({
            finished: true
        });
    
    }
    onLeave() {
        log(LoggerEventTypes.SEARCH_EXIT, {
            step : "session",
            state : this.state
        });

        SyncStore.emitSyncLeave();
        AccountStore.clearUserData();
    }
    onSwitchPage() {
        let switchTabs = localStorage.getItem("switch-tabs-session") || 0;
        switchTabs++;
        localStorage.setItem("switch-tabs-session", switchTabs);
        log(LoggerEventTypes.TAB_CHANGE, {
            step: "sessions",
            switch: switchTabs
        });
        if (switchTabs >= constants.switchPageLimit) {
            this.onLeave();
            localStorage.setItem("invalid-user",1);
            this.props.history.push('/disq');
            localStorage.removeItem("switch-tabs-session");

            Alert.error('You have been disqualified from the study.', {
                position: 'top-right',
                effect: 'scale',
                beep: true,
                timeout: "none"
            });
        } else {
            Alert.error('We have noticed that you have tried to change to a different window/tab. Please, use SearchX only for your learning about the given topic!', {
                position: 'top-right',
                effect: 'scale',
                beep: true,
                timeout: "none"
            });

            Alert.warning(`Remember that more than ${constants.switchPageLimit} tab changes result in a disqualification. So far you have changed tabs ${switchTabs} time(s)`, {
                position: 'top-right',
                effect: 'scale',
                beep: true,
                timeout: "none"
            });
        }
    }
}



export default Session;