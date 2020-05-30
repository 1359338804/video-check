import React from 'react';
import './index.css'
import { Menu, Dropdown } from 'antd';
import Cookies from 'js-cookie'
class Header extends React.Component{
    constructor(props){
        super(props)
		this.state = {
			userName:Cookies.get('userName'),
		}
    }
    componentDidMount(){
        document.title = "众睿资服";
    }
	quitLogin(){
		Cookies.remove("userName");
		this.props.history.push("/Login");
	}
    render(){
        const form = this.props.form;
		const menu = (
		  <Menu>
		    <Menu.Item>
		      <a target="_blank" onClick={e => this.quitLogin()}>
		        退出登录
		      </a>
		    </Menu.Item>
		  </Menu>
		);
        return(
            <div className="header">
				<div className="header-content">
					<div className="header-title">
						<div className="header-logo"></div>
						<div className="header-text">{this.props.title}</div>
					</div>
					{
						this.props.userFlag && <div className="person">
							欢迎进入，{this.state.userName}
						</div>
					}
					
				</div>
            </div>
        );
    }
}
export default Header;