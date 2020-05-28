import React from 'react';
import './index.css'
import { Menu, Dropdown } from 'antd';
import Cookies from 'js-cookie'
class Header extends React.Component{
    constructor(props){
        super(props)
		
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
					{/* <div className="person">
						<i></i>
						<Dropdown overlay={menu}>
							<a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
							admin
							</a>
						</Dropdown>
					</div> */}
				</div>
            </div>
        );
    }
}
export default Header;