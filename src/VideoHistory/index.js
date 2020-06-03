import React from 'react';
import { Table, message, Modal } from 'antd';
import { Player } from 'video-react';
import "video-react/dist/video-react.css";
import Cookies from 'js-cookie'
import SearchForm from './component/search'
import '../config.js';
import './index.css'

class VideoHistory extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          customer:"",
          startTime:"",
          endTime:"",
          userName:Cookies.get('userName'),
          data: [],
          tableData: [],
          pagination: {
            current: 1,
            pageSize: 10,
          },
          loading: false,
          visible: false,
          VIDEOURL:"",
          // 申请编号，客户姓名，证件号码，视频发起人员，视频审核人员，状态（等待接入，审核完成），视频发起时间，备注。
          columns: [
            {
              title: '申请编号',
              dataIndex: 'BASQBH',
              key: 'BASQBH',
            },{
              title: '客户姓名',
              dataIndex: 'SPFQRY',
              key: 'khxm',
            },{
              title: '身份证号',
              dataIndex: 'CARDID',
              key: 'CARDID',
            },{
              title: '视频发起人',
              dataIndex: 'SPFQRY',
              key: 'SPFQRY',
            },{
              title: '视频审核人',
              dataIndex: 'SPSHRY',
              key: 'SPSHRY',
            },{
              title: '状态',
              dataIndex: 'SPMQZT',
              key: 'SPMQZT',
              render:(text, row, index) => {
                return this.videoListStatus(text);
              }
            },{
              title: '视频发起时间',
              dataIndex: 'SPFQSJ',
              key: 'SPFQSJ',
              width:180,
            },{
              title: '查看视频',
              key: 'VIDEOURL',
              width:100,
              render: (text, row, index) => {
                var downloadurl = text.VIDEOURL + "?download_name=mp4";
                return(<div>
                  <a className="theme-color" onClick={(e) => this.showVideoPlay(text)}>查看</a>
                  <a className="theme-color downloadvideo" href={downloadurl} download="">下载</a>
                </div>)
              }
            },
          ]
        };
    }
    componentDidMount(){
      document.title = "众睿资服";
      const { pagination } = this.state;
      this.getList(pagination);
    }
    showVideoPlay(params){
      console.log(params)
      if(params.VIDEOURL){
        this.setState({
          VIDEOURL: params.VIDEOURL
        },() => {
          this.setState({
            visible:true,
          })
        })
      }else{
        message.error("视频正在生成，请稍后...");
      }
    }
    videoListStatus(code){
      switch(parseInt(code)){
        case 1:
          return "等待接入";
          break; //eslint-disable-line
        case 2:
          return "审核中";
          break; //eslint-disable-line
        case 3:
          return "审核完成";
          break; //eslint-disable-line
        default:
          return ""
      }
    }
    compileStr (code) {
      var c = String.fromCharCode(code.charCodeAt(0) + code.length)
      for (var i =1; i < code.length; i++) {
          c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i -1))
      }
      return escape(c)
    };
    // 分页点击
    handleTableChange = (pagination, filters, sorter) => {
      let data = Object.assign({}, this.state.pagination, { current: pagination.current })
      this.setState({
        pagination:data
      });  
      this.getList(pagination);
    };
    // 获取全部数据
    getList = (params) => {
      let that = this;
      this.setState({ loading: true });
      fetch(`${global.constants.apiUrl}app/video/getList`, {
        method: 'post',
        body:JSON.stringify({
          "type":"3",
          "userName":that.state.userName,
          "customer":that.state.customer,
          "startTime":that.state.startTime,
          "endTime":that.state.endTime,
          ...params
        })
      })
      .then(res => res.json())
      .then(res => {
        this.setState({ loading: false });
        if(res.response_code === "000000"){
          let data = Object.assign({}, this.state.pagination, { total: res.result.totalRows })
          that.setState({
            data:res.result.list?res.result.list:[],
            pagination:data
          });  
        }else{
          message.error(res.response_msg);
        }
      }).catch(err => {
        this.setState({ loading: false });
      })
    };
    // 列表查询
    query(params){
      console.log(params);
      let data = Object.assign({}, this.state.pagination, { current: 1 })
  　　this.setState({
        pagination: data,
        customer:params.customer,
        startTime:params.startTime,
        endTime:params.endTime
  　　},()=> this.getList(this.state.pagination));
    }
    handleCancel(){
      this.setState({
        VIDEOURL: "",
        visible:false,
      })
    }
    render(){
      const {data, pagination, loading, columns} = this.state;
      return(
        <div className="video-table animated fadeInRight">
          <SearchForm parent={ this }></SearchForm>
          <Table
        	bordered
        	columns={columns}
        	dataSource={data}
        	pagination={pagination}
        	loading={loading}
          rowKey={record => String(record.BASQBH)+Math.random()}
          scroll={{ y: 330 }}
        	onChange={this.handleTableChange}
          />
          <Modal
          title="查看视频"
          visible={this.state.visible}
          footer={null}
          onCancel={(e) => this.handleCancel()}
          width="900px"
          height="600px"
          maskClosable={false}
        >
          {/* <video className="originvideo" controls="controls" autoPlay="autoPlay" width="852" height="605">
            <source src={this.state.VIDEOURL} type="video/mp4" />
          </video> */}
          <Player
            fluid={false}
            width={852} 
            height={605}
            preload="auto"
            // poster="./../assets/logo.png"
            src={this.state.VIDEOURL}
            autoPlay={true}
          />
        </Modal> 
        </div>
      )
    }
}
export default VideoHistory;