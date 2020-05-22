import React from 'react';
import './index.css';
import Button from '../Button/index'

class Submit extends React.Component{   
    
    render(){
        return (
            <div className="Submit">
                <Button title={this.props.videoStreamingTitle} onClick={this.props.videoStreaming}></Button>
                <Button title="同意" onClick={this.props.consent}></Button>
                <Button title="拒绝" onClick={this.props.refuse}></Button>
            </div>
        )
    }
}


export default Submit