import React from 'react';
import { Button } from 'antd';
import '../assets/reset.css';
import './index.css'
import VideoList from '../VideoList/index'
import VideoHistory from '../VideoHistory/index'
import Header from '../Header/index.js';
import Footer from '../Footer/index';

class Home extends React.Component{
    constructor(props){
        super(props)
		this.state = {
			templateIndex:0,
		}
    }
    componentDidMount(){
        document.title = "众睿资服";
    }
	changeIndex(index){
		this.setState({
			templateIndex:index	
		});
	}
	renderTemp(){
		const templateIndex = this.state.templateIndex;
		const form = this.props.form;
		if(templateIndex === 0){
			return <VideoList />;
		}else if(templateIndex === 1){
			return <VideoHistory />
		}
	}
    render(){
        const form = this.props.form;
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