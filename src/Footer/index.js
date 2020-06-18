import React from 'react';
import './index.css'
class Login extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            flag:true, 
        }
        this.changeDivStatus.bind(this)
    }
    componentDidMount(){
		this.changeDivStatus();
        window.addEventListener("resize", this.changeDivStatus);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.changeDivStatus);
    }
    // 改变底部显示
	changeDivStatus(){
        var winHeight = document.body.clientHeight || document.documentElement.clientHeight;
        console.log(winHeight);
		if(winHeight<900){
            document.querySelector(".footer").style.display = "none";
		}else{
            document.querySelector(".footer").style.display = "block";
        }
	}
    render(){
        var flag = this.state.flag;
        return(
            <div className="footer">
                壹车宜家信息科技有限公司  版权所有
            </div>
        );
    }
}
export default Login;