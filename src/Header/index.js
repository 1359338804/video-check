import React from 'react';
import './index.css'
import {message} from 'antd';
import Cookies from 'js-cookie'
class Header extends React.Component{
    constructor(props){
        super(props)
		this.state = {
			userName:Cookies.get('userName'),
			roleName:Cookies.get('roleName'),
			theme:1,
		}
    }
    componentDidMount(){
		document.title = "众睿资服";
		this.changeThemeState();
    }
	quitLogin(){
		var that = this;
		// ?token=${Cookies.get("token")}
		fetch(`${global.constants.apiUrl}app/video/logout?token=${Cookies.get("token")}`, {
			method: 'get',
			// headers:{
			// 	"token":Cookies.get("token")
			// }
		})
		.then(res => res.json())
		.then(res => {
			if(res.code === "000000"){
				Cookies.remove("userName");
				Cookies.remove("roleName");
				Cookies.remove("token");
				that.props.history.push("/Login");
			}else if(res.code === "E00001"){
				that.props.history.push('/Login');
			}else{
				message.error(res.response_msg);
			}
		})
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
        return(
            <div className="header">
				<div className="header-content">
					<div className="header-title">
						{/* <div className="header-logo"></div> */}
						<div className="header-logo-text">
						郑州银行-众睿资服合作项目
						</div>
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
							<a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
								欢迎进入，{this.state.roleName}
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