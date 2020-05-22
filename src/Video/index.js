/* eslint-disable no-undef */
import React from 'react';
import './index.css';
import Submit from '../Submit/index';
import ClientInfo from '../ClientInfo/index';

import Modal from 'antd/es/modal'; // 加载 JS
import 'antd/es/modal/style/css'; // 加载 CSS

import message from 'antd/es/message'; // 加载 JS
import 'antd/es/message/style/css'; // 加载 CSS


const { confirm } = Modal;

const opts = {
    userId: '',
    sdkAppId: 1400223297,
    userSig: '',
    roomid: '',
}

const url = 'http://10.1.1.226:8081/ZRRZZL/';

// 创建视频窗口
function createVideoElement(id, isLocal) {
    var videoDiv = document.createElement("div");
    videoDiv.innerHTML = '<video id="' + id + '" autoplay ' + (isLocal ? 'muted' : '') + ' playsinline ></video><div calss="SoundMeter" style="height:3px;background-color: #0f0;margin-top: -4px;width:0%"></div>';
    document.querySelector(".Video-div").appendChild(videoDiv);
    return document.getElementById(id);
}
 //是用来获取url中的参数的值的 根据参数名获取参数值
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
};
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
        };
    }
    // 生命周期挂载
    componentDidMount() {
        opts.userId = uncompileStr(getQueryString('userid'));
        opts.userSig = uncompileStr(getQueryString('usersig'));
        opts.roomid = uncompileStr(getQueryString('roomid'));
        console.log(opts.userId,opts.userSig,opts.roomid);
        setInterval(this.changTitl,1000)
        this.WebRTC()
        fetch(`${url}VideoFacebookServlet?basqbh=${opts.roomid}&cxlx=personInfo`, {
            method: 'POST',
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    data:res.date
                })
                
            })
    }
    // 生命周期卸载
    componentWillUnmount() {

    }
    // 腾讯云视频初始化
    WebRTC() {
        // 检查当前浏览器是否支持RTC
        WebRTCAPI.fn.detectRTC((res) => {
            if (!res.support) {
                alert('你的浏览器不支持视频通话，请下载最新的谷歌浏览器')
            } else {
                 console.log(opts.userId,opts.userSig,opts.roomid);

                // 初始化RTC
                const RTC = new WebRTCAPI({
                    "userId": opts.userId,
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
                        RemoteSoundMeter.stop();
                    }
                }
            })
            video.srcObject = info.stream;
        } else {
            // console.log('欢迎用户' + info.userId + '加入房间');
        }
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
                        LocalSoundMeter.stop();
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
        alert("on kick out!");
    }
    // 服务器超时
    _onRelayTimeout = (msg) => {
        alert("onRelayTimeout!" + (msg ? JSON.stringify(msg) : ""));

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
        confirm({
            title: `你确定已审核完成,并选择"${mqshzt === '1'?'同意':'拒绝'}"?`,
            content: `点击${mqshzt === '1'?'同意':'拒绝'}后,会关闭当前页面,结束本次通话`,
            okText:`${mqshzt === '1'?'同意':'拒绝'}`,
            cancelText:'取消',
            onOk() {
                return new Promise((resolve, reject) => {
                    fetch(`${url}VideoFacebookServlet?basqbh=${opts.roomid}&mqshzt=${mqshzt}&cxlx=facebookResult`, {
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
                        window.opener=null;window.open('','_self');window.close();
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
        if(document.title === `【　视频面签中　】 ${opts.userId} 正在为申请编号【${opts.roomid}】的客户进行视频面签。如意外关闭当前页面，可再【视频面签表】中找到对应申请编号，进行重连`){
             document.title = `【　　　　　　　】 ${opts.userId} 正在为申请编号【${opts.roomid}】的客户进行视频面签。如意外关闭当前页面，可再【视频面签表】中找到对应申请编号，进行重连`;
        }else{
             document.title = `【　视频面签中　】 ${opts.userId} 正在为申请编号【${opts.roomid}】的客户进行视频面签。如意外关闭当前页面，可再【视频面签表】中找到对应申请编号，进行重连`;
        }
    }
    render() {
        return (
            <div className="Video">
                <div className="Video-div"></div>
                <div className="Video-client">
                    <ClientInfo data={this.state.data}></ClientInfo>
                </div>
                <Submit videoStreamingTitle={this.state.videoStreaming ? '仅录制音频' : '恢复录制视频'} videoStreaming={(e) => { this.videoStreaming(e) }} consent={(e) => { this.VideoFacebookServlet('1') }} refuse={(e) => { this.VideoFacebookServlet('2') }}></Submit>
            </div>
        );
    }
}

export default Video;




