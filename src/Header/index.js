import React from 'react';
import './index.css'
import { Menu, Dropdown } from 'antd';
import Cookies from 'js-cookie'
class Header extends React.Component{
    constructor(props){
        super(props)
		this.state = {
			userName:Cookies.get('userName'),
			theme:1,
		}
    }
    componentDidMount(){
		document.title = "众睿资服";
		this.changeThemeState();
    }
	quitLogin(){
		Cookies.remove("userName");
		this.props.history.push("/Login");
	}
	changeTheme(n){
		Cookies.set("theme", n);
		this.changeThemeState();
	}
	changeThemeState(){
		this.setState({
			theme:Cookies.get("theme")?Cookies.get("theme"):1
		},function(){
			document.querySelector("#root").className='theme'+this.state.theme;
		})
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
					<div className="header-right">
						{/* 主题控制 */}
						<div className="theme-control">
							<span onClick={(e)=>this.changeTheme(1)}></span>
							<span onClick={(e)=>this.changeTheme(2)}></span>
						</div>
						{
							this.props.userFlag && <div className="person">
							<i></i>
							<a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
								欢迎进入，{this.state.userName}
							</a>
							<div className="quit" onClick={(e) => this.quitLogin()}></div>
						</div>
						}
					</div>
				</div>
            </div>
        );
    }
}
export default Header;