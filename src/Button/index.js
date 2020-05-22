import React from 'react'
import './index.css'
class Button extends React.Component {
 
    render (){
        return(
            <div className="Button" onClick={this.props.onClick}>
                {this.props.title}
            </div>
        )
    }
}
export default Button   