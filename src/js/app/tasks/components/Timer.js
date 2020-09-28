import React from 'react';
import PropTypes from 'prop-types';

function padZero(num) {
    if (num < 10 && num >= 0) {
        return '0' + num;
    }
    return num;
}

class Timer extends React.PureComponent {
    constructor(props) {
        super(props);
        
        this.state = {
            elapsed: 0,
            finished: false
        };

        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        this.timer = setInterval(this.tick, 1000);
    }

    componentWillUnmount () {
        clearInterval(this.timer);
    }

    render () {
        // let sess = localStorage.getItem('session-num') || 0;
        const durationMillis = this.props.duration * 60 * 1000;
        // console.log("elapsed", this.state.elapsed)
        // let time_sess;
        const time = this.props.showRemaining ? durationMillis - this.state.elapsed : this.state.elapsed;

        // time_sess = sess<4?time + sess*this.props.duration * 60 * 1000: time + 3*this.props.duration * 60 * 1000 ;

        
        const roundedTime = Math.round(time / 1000);
        let minutes = Math.floor(roundedTime/60);
        let seconds = roundedTime-(minutes*60);

        const started = this.props.start !== 0;
        // console.log("start", this.props.start)
        if (!started) {
            minutes = 0;
            seconds = 0;
        }

        return (
            <div className="Timer" style={this.props.style}>
                {this.props.start > 0 || this.props.showRemaining ?
                    minutes + ':' + padZero(seconds)
                    :
                    '0:0'
                }
            </div>
        )
    }

    ////

    tick(){

        if (this.props.start > 0) {
                if (!this.state.finished && (this.state.elapsed) > this.props.duration * 60 * 1000) {
                    this.props.onFinish();
                    this.setState({
                        finished: true
                    });
                }
            
            this.setState({
                elapsed: new Date() - this.props.start
            });
        }
    }
}

Timer.propTypes = {
    start: PropTypes.number,
    duration: PropTypes.number.isRequired,
    onFinish: PropTypes.func
};

Timer.defaultProps = {
    start: Date.now(),
    onFinish: () => {},
    style: {}
};

export default Timer;