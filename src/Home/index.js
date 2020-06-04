import React from 'react';
import { Button } from 'antd';
import Cookies from 'js-cookie'
import '../config.js';
import Modal from 'antd/es/modal'; // 加载 JS
import 'antd/es/modal/style/css'; // 加载 CSS
import '../assets/reset.css';
import './index.css'
import VideoList from '../VideoList/index'
import VideoHistory from '../VideoHistory/index'
import Header from '../Header/index.js';
import Footer from '../Footer/index';
let timer;
class Home extends React.Component{
    constructor(props){
        super(props)
		this.state = {
			templateIndex:0,
			visible: false,
			userName:Cookies.get('userName'),
			isRefresh:false,
		}
    }
    componentDidMount(){
		if(!Cookies.get('userName')){
			this.props.history.push('/Login');
		}
		document.title = "众睿资服";
		timer = setInterval(()=>{
			this.intervalGetList();
		}, 5000);
	}
	componentWillUnmount(){
		clearInterval(timer);
	}
	changeIndex(index){
		this.setState({
			templateIndex:index	
		});
	}
	renderTemp(){
		const templateIndex = this.state.templateIndex;
		const form = this.props.form; //eslint-disable-line
		if(templateIndex === 0){
			return <VideoList isRefresh={this.state.isRefresh}/>;
		}else if(templateIndex === 1){
			return <VideoHistory />
		}
	}
	// 定时获取待面签列表
	intervalGetList(){
		let that = this;
		fetch(`${global.constants.apiUrl}app/video/getList`, {
			method: 'post',
			body:JSON.stringify({
				"type":"1",
				"userName":that.state.userName,
				"current": 1,
				"pageSize": 10,
			})
		})
		.then(res => res.json())
		.then(res => {
			if(res.response_code === "000000"){ //eslint-disable-line
				if(res.result.list != ""){ //eslint-disable-line
					clearInterval(timer);
					that.setState({
						isRefresh:true,
					})
					that.showTip(res.result.list[0]);
				}else{
					that.setState({
						isRefresh:false,
					})
				}
			}else if(res.response_code === "666666"){
				that.props.history.push('/Login');
			}
		})
	}
	// 消息提示框
	showTip(info){
		var that = this;
		var search = "?USERID="+ that.compileStr(info.USERID)+"&usersig="+that.compileStr(info.USERSIN)+"&roomid="+that.compileStr(info.SPFJID);
		Modal.confirm({
			title: '视频待面签',
			content: (
			  <div>
				<p>有新的视频待面签消息，视频发起人：{info.SPFQRY}</p>
				<p>点击确定将会进行视频面签</p>
			  </div>
			),
			cancelText:"确定",
			okText:"呼入",
			onOk() {
				that.props.history.push({pathname:'/Video',search: search});
			},
			onCancel() {
				clearInterval(timer);
			},
		});
	}
	compileStr (code) {
	    var c = String.fromCharCode(code.charCodeAt(0) + code.length)
	    for (var i =1; i < code.length; i++) {
	        c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i -1))
	    }
	    return escape(c)
	};
    render(){
        const form = this.props.form; //eslint-disable-line
		let title = this.state.templateIndex === 0?"视频待面签":"视频审核历史";
        return(
            <div className="home">
				<Header title={title} history={this.props.history} userFlag={true}/>
				<div className="home-content">
					<div className="home-center">
						<div className="menu-list">
							<Button type={this.state.templateIndex===0?"primary":"link"} onClick={(e)=>this.changeIndex(0)}>
							  视频待面签
							</Button>
							<Button type={this.state.templateIndex===1?"primary":"link"} onClick={(e)=>this.changeIndex(1)}>
							  视频审核历史
							</Button>
						</div>
						<div className="table-wrap">
							{this.renderTemp()}
						</div>
					</div>
				</div>
				<Footer />
            </div>
        );
    }
}
export default Home;