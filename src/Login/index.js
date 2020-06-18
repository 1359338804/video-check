import React from 'react';
import { Spin } from 'antd';
import LoginForm from './component/form';
import Header from '../Header/index.js';
import Footer from '../Footer/index';
import './index.css'
class Login extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loading: false,
        }
    }
    componentDidMount(){
        document.title = "众睿资服";
    }
    setLoading(bool){
        this.setState({
            loading:bool
        })
    }
    render(){
        const form = this.props.form;
        return(
            <div className="main">
                <Spin spinning={this.state.loading} size="large">
                    <Header title="众睿资服" history={this.props.history} userFlag={false}/>
                    <div className="content">
                        <div className="login-img"></div>
                        <LoginForm history={this.props.history} news={this}></LoginForm>
                    </div>
                    <Footer />
                </Spin>
            </div>
        );
    }
}
export default Login;