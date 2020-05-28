import React from 'react';
import LoginForm from './component/form';
import Header from '../Header/index.js';
import Footer from '../Footer/index';
import './index.css'
class Login extends React.Component{
    constructor(props){
        super(props)
    }
    componentDidMount(){
        document.title = "众睿资服";
    }
    render(){
        const form = this.props.form;
        return(
            <div className="main">
                <Header title="众睿资服" history={this.props.history} />
                <div className="content">
                    <div className="login-img"></div>
                    <LoginForm history={this.props.history}></LoginForm>
                </div>
                <Footer />
            </div>
        );
    }
}
export default Login;