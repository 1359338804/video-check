/* eslint-disable no-undef */
import React from 'react';
import './index.css';
import '../config.js';
import { Button, Tabs} from 'antd';
import Cookies from 'js-cookie'
import Header from '../Header/index.js';
import Footer from '../Footer/index';
import RemarkForm from './component/remark'
import Modal from 'antd/es/modal'; // 加载 JS
import 'antd/es/modal/style/css'; // 加载 CSS

import message from 'antd/es/message'; // 加载 JS
import 'antd/es/message/style/css'; // 加载 CSS

const { TabPane } = Tabs;
const { confirm } = Modal;

const opts = {
    USERID: '',
    sdkAppId: 1400376311, //1400223297,
    userSig: '',
    roomid: '',
}

// 创建视频窗口
function createVideoElement(id, isLocal) {
    var videoDiv = document.createElement("div");
    if(id == "local"){
        videoDiv.innerHTML = '<video id="' + id + '" autoplay ' + (isLocal ? 'muted' : '') + ' playsinline ></video><div calss="SoundMeter" style="height:3px;background-color: #0f0;margin-top: -4px;width:0%"></div>';
        document.querySelector(".customer-service").appendChild(videoDiv);
    }else{
        videoDiv.innerHTML = '<video class="far-video" id="' + id + '" autoplay ' + (isLocal ? 'muted' : '') + ' playsinline ></video><div calss="SoundMeter" style="height:3px;background-color: #0f0;margin-top: -4px;width:0%"></div>';
        document.querySelector(".coustom-video").appendChild(videoDiv);
    }
    return document.getElementById(id);
}
//字符串进行解密 
function uncompileStr(code){
    if(!code){
        return code
    }      
    code = unescape(code);      
    var c=String.fromCharCode(code.charCodeAt(0)-code.length);      
    for(var i=1;i<code.length;i++)
    {      
     c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));      
    }      
    return c;  
}

class Video extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            RTC: null,
            videoStreaming: true,
            data:{},
            changeT:null,
            remark:"",

            userName:"",
            BASQBH:"",
        };
    }
    // 生命周期挂载
    componentDidMount() {
        let that = this;
        if(!Cookies.get('userName')){
            this.props.history.push('/Login');
        }
        opts.USERID = uncompileStr(that.getQueryString('USERID'));
        opts.userSig = uncompileStr(that.getQueryString('usersig'));
        opts.roomid = uncompileStr(that.getQueryString('roomid'));
        console.log(opts.USERID,opts.userSig,opts.roomid);
        that.setState({
            changeT:setInterval(this.changTitl,1000),
            userName:Cookies.get('userName'),
            BASQBH:opts.roomid,
        });
        this.WebRTC()
        // 获取用户信息
        fetch(`${global.constants.apiUrl}VideoFacebookServlet?basqbh=${opts.roomid}&cxlx=personInfo`, {
            method: 'POST',
        })
        .then(res => res.json())
        .then(res => {
            this.setState({
                data:res.date
            })
        })
    }
    getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = this.props.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    };
    // 生命周期卸载
    componentWillUnmount() {
        var that = this;
        var data = JSON.stringify({
            "basqbh":this.state.BASQBH,
            "userName":Cookies.get('userName')
        });
        fetch(`${global.constants.apiUrl}app/VideoFacebookEnd`, {
            method: 'POST',
            body:data
        })
        .then(res => res.json())
        .then(res => {
            if(res.response_code === "000000"){}else{
                message.error(res.response_msg);
            }
        })
        clearInterval(this.state.changeT);
    }
    // 腾讯云视频初始化
    WebRTC() {
        // 检查当前浏览器是否支持RTC
        WebRTCAPI.fn.detectRTC((res) => {
            if (!res.support) {
                alert('你的浏览器不支持视频通话，请下载最新的谷歌浏览器')
            } else {
                 console.log(opts.USERID,opts.userSig,opts.roomid);

                // 初始化RTC
                const RTC = new WebRTCAPI({
                    "userId": opts.USERID,
                    "sdkAppId": opts.sdkAppId,
                    "userSig": opts.userSig,
                    // "debug":{
                    //     "log": true, //是否在控制台打印调试日志 ,默认为false
                    //     "vconsole": true, //是否展示 vconsole （方便在移动端查看日志）
                    //     "uploadLog": true //是否上报日志
                    // }
                });
                this.setState({
                    RTC: RTC
                })
                // 创建或加入房间
                RTC.enterRoom({ //文档地址 https://cloud.tencent.com/document/product/647/17251#webrtcapi.enterroom
                    roomid: opts.roomid,
                    //recordId : 自动录制时业务自定义 ID，int32，将在录制完成后通过直播录制回调接口通知业务方（控制台 - 直播录制回调），相关文档：直播录制文件获取，事件消息通知
                    //           注意：如果小程序与小程序或者小程序与 Web 端互通，且传了 recordId，必须保证 Web 端和小程序传递的值一致
                }, (succ) => {
                    console.log("进入房间成功", succ)
                    // 获取本地音频/视频流
                    RTC.getLocalStream({
                        video: true,
                        audio: true,
                    }, function (info) {
                        var stream = info.stream;
                        console.log('获取本地音频/视频流: ', stream);
                        //主动发起推流/拉流。
                        RTC.startRTC({
                            stream: stream,
                            role: 'user'
                        });
                    }, function (error) {
                        console.error(error)
                    });
                }, (error) => {
                    console.log("进入房间失败", error)
                });
                // 远端流新增/更新
                RTC.on("onRemoteStreamUpdate", this._onRemoteStreamUpdate)
                // 本地流新增
                RTC.on("onLocalStreamAdd", this._onLocalStreamAdd)
                // 远端流断开
                RTC.on("onRemoteStreamRemove", this._onRemoteStreamRemove)
                // 重复登录被T
                RTC.on("onKickout", this._onKickout)
                // 服务器超时
                RTC.on("onRelayTimeout", this._onRelayTimeout)

                RTC.on("onErrorNotify", function (info) {
                    console.error(info)
                    if (info.errorCode === RTC.getErrorCode().GET_LOCAL_CANDIDATE_FAILED) {
                        // alert( info.errorMsg )
                    }
                });
                
            }
        })
    }
    // 远端流新增/更新
    _onRemoteStreamUpdate = (info) => {
        console.log('远端流新增/更新: ', info);
        // console.debug(info)
        if (info.stream && info.stream.active === true) {
            var id = info.videoId;
            this.sendStreamId(id);
            var video = document.getElementById(id);
            if (!video) {
                video = createVideoElement(id);
            }
            // 声音音量检测
            const RemoteSoundMeter = WebRTCAPI.SoundMeter({
                stream: info.stream,
                onprocess: function (data) {
                    const div = document.getElementById(id);
                    if (div) {
                        div.parentNode.children[1].style.width = data.volume * 100 + "%"
                    } else {
                        // RemoteSoundMeter.stop();
                    }
                }
            })
            video.srcObject = info.stream;
        } else {
            // console.log('欢迎用户' + info.USERID + '加入房间');
        }
    }
    sendStreamId(streamId){
        var that = this;
        var data = JSON.stringify({
            "streamId":streamId,
            "userName":this.state.userName,
            "basqbh":this.state.BASQBH
        });
        console.log(data);
        fetch(`${global.constants.apiUrl}app/video/joinRoom`, {
            method: 'POST',
            body:data
        })
        .then(res => res.json())
        .then(res => {
            if(res.response_code === "000000"){}else{
                message.error(res.response_msg);
            }
        })
    }
    // 挂断
    hangUp(){
        var that = this;
        var data = JSON.stringify({
            "basqbh":this.state.BASQBH,
            "userName":Cookies.get('userName')
        });
        fetch(`${global.constants.apiUrl}app/VideoFacebookEnd`, {
            method: 'POST',
            body:data
        })
        .then(res => res.json())
        .then(res => {
            if(res.response_code === "000000"){
                that.props.history.goBack();
            }else{
                message.error(res.response_msg);
            }
        })
    }
    // 本地流新增
    _onLocalStreamAdd = (info) => {
        if (info.stream && info.stream.active === true) {

            var id = "local";
            var video = document.getElementById(id);
            if (!video) {
                createVideoElement(id, true);
            }
            // 声音音量检测
            const LocalSoundMeter = WebRTCAPI.SoundMeter({
                stream: info.stream,
                onprocess: function (data) {
                    const div = document.getElementById(id);
                    if (div) {
                        div.parentNode.children[1].style.width = data.volume * 100 + "%"
                    } else {
                        // LocalSoundMeter.stop();
                    }
                }
            })

            // eslint-disable-next-line no-redeclare
            var video = document.getElementById(id)
            video.srcObject = info.stream;
            video.muted = true
            video.autoplay = true
            video.playsinline = true
        }
    }
    // 远端流断开
    _onRemoteStreamRemove = (info) => {
        console.log('远端流断开: ', info);
        var videoNode = document.getElementById(info.videoId);
        if (videoNode) {
            videoNode.srcObject = null;
            document.getElementById(info.videoId).parentElement.removeChild(videoNode);
        }
    }
    // 重复登录被T
    _onKickout = () => {
        alert("请勿重复连接！");
    }
    // 服务器超时
    _onRelayTimeout = (msg) => {
        // alert("onRelayTimeout!" + (msg ? JSON.stringify(msg) : ""));

    }
    //不采集视频&打开视频采集
    videoStreaming() {
        if (this.state.videoStreaming) {
            this.state.RTC.closeVideo();
        } else {
            this.state.RTC.openVideo();
        }
        this.setState({
            videoStreaming: !this.state.videoStreaming
        })
    }

    
 
    //发送审核结果
    VideoFacebookServlet(mqshzt){
        var that = this;
        confirm({
            title: `你确定已审核完成,并选择"${mqshzt === '1'?'同意':'拒绝'}"?`,
            content: `点击${mqshzt === '1'?'同意':'拒绝'}后,会关闭当前页面,结束本次通话`,
            okText:`${mqshzt === '1'?'同意':'拒绝'}`,
            cancelText:'取消',
            onOk() {
                return new Promise((resolve, reject) => {
                    fetch(`${global.constants.apiUrl}VideoFacebookServlet?basqbh=${opts.roomid}&mqshzt=${mqshzt}&cxlx=facebookResult&spmqbz=${that.state.remark}`, {
                        method: 'POST',
                    })
                    .then(res => res.json())
                    .then(res => {
                        resolve(res)
                    })
                }).catch(() => console.log('Oops errors!'))
                .then((res)=>{
                    console.log('res: ', res);
                    if(res.code === "000000"){
                        // that.hangUp();
                        that.props.history.goBack();
                    }else{
                        message.error(res.message);
                    }
                })
            },
            onCancel() { },
        });
    }
    
    //设置title
    changTitl(){
        this.focus();
        if(document.title === `【　视频面签中　】${opts.USERID} 正在为申请编号【${opts.roomid}】的客户进行视频面签。如意外关闭当前页面，可再【视频面签表】中找到对应申请编号，进行重连`){
             document.title = `【　　　　　　　】${opts.USERID} 正在为申请编号【${opts.roomid}】的客户进行视频面签。如意外关闭当前页面，可再【视频面签表】中找到对应申请编号，进行重连`;
        }else{
             document.title = `【　视频面签中　】${opts.USERID} 正在为申请编号【${opts.roomid}】的客户进行视频面签。如意外关闭当前页面，可再【视频面签表】中找到对应申请编号，进行重连`;
        }
    }
    // 强制退出
    ForcedQuit(){
        var that = this;
        confirm({
            title: '强制退出',
            content: `点击确定后,会关闭当前页面,结束本次通话`,
            okText:'确定',
            cancelText:'取消',
            onOk() {
                that.props.history.goBack();
                // return that.hangUp();
            },
            onCancel() { },
        });
    }
    setRemark(event){
        this.setState({
            remark:event.target.value
        });
    }
    render() {
        const form = this.props.form;
        return (
            <div className="Video">
                <Header title="视频面签" history={this.props.history} userFlag={true}/>
                <div className="Video-wrap">
                    <div className="video-left-wrap">
                        <div className="coustom-video"></div>
                    </div>
                    <div className="video-right-wrap">
                        <div className="video-right-video-wrap">
                            <div className="customer-service"></div>
                        </div>
                        <div className="client-info">
                            <Tabs defaultActiveKey="1">
                                <TabPane tab="客户信息" key="1">
                                    <div className="tab-wap">
                                        <p>姓名: {this.state.data.basqxm}</p>
                                        <p>身份证号: {this.state.data.bazjhm}</p>
                                        <p>手机号: {this.state.data.basjhm}</p>
                                        <p>现住址: {this.state.data.basjhm}</p>
                                        <p>工作单位: {this.state.data.basjhm}</p>
                                    </div>
                                </TabPane>
                                <TabPane tab="贷款信息" key="2">
                                    <div className="tab-wap">
                                        <p>贷款金额: {this.state.data.basqxm}</p>
                                        <p>首付金额: {this.state.data.bazjhm}</p>
                                        <p>年限: {this.state.data.basjhm}</p>
                                        <p>还款方式: {this.state.data.basjhm}</p>
                                    </div>
                                </TabPane>
                                <TabPane tab="车辆信息" key="3">
                                    <div className="tab-wap">
                                        <p>品牌: {this.state.data.basjhm}</p>
                                        <p>颜色: {this.state.data.bazjhm}</p>
                                        <p>车价: {this.state.data.basqxm}</p>
                                    </div>
                                </TabPane>
                            </Tabs>
                            {/* <h2>基本信息</h2>
                            <p>姓名: {this.state.data.basqxm}</p>
                            <p>手机号: {this.state.data.basjhm}</p>
                            <p>身份证号: {this.state.data.bazjhm}</p> */}
                            <RemarkForm getRemark={this.setRemark.bind(this)}></RemarkForm>
                        </div>
                    </div>
                </div>
                <div className="btn-wrap">
                    <Button type="primary" onClick={(e) => { this.VideoFacebookServlet('1') }}>同意</Button>
                    <div></div>
                    <Button type="danger" onClick={(e) => { this.VideoFacebookServlet('2') }}>拒绝</Button>
                    <div></div>
                    <Button type="danger" onClick={(e) => { this.ForcedQuit() }}>强制退出</Button>
                </div>
                <Footer />
            </div>
        );
    }
}

export default Video;




