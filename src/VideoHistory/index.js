import React from 'react';
import { Table, message, Modal} from 'antd';
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
          videourl:"",
          // 申请编号，客户姓名，证件号码，视频发起人员，视频审核人员，状态（等待接入，审核完成），视频发起时间，备注。
          columns: [
            {
              title: '申请编号',
              dataIndex: 'bASQBH',
              key: 'bASQBH',
            },{
              title: '客户姓名',
              dataIndex: 'sPFQRY',
              key: 'khxm',
            },{
              title: '身份证号',
              dataIndex: '',
              key: 'zjhm',
            },{
              title: '视频发起人',
              dataIndex: 'sPFQRY',
              key: 'sPFQRY',
            },{
              title: '视频审核人',
              dataIndex: 'sPSHRY',
              key: 'sPSHRY',
            },{
              title: '状态',
              dataIndex: 'sPMQZT',
              key: 'sPMQZT',
              render:(text, row, index) => {
                return this.videoListStatus(text);
              }
            },{
              title: '视频发起时间',
              dataIndex: 'sPFQSJ',
              key: 'sPFQSJ',
              width:180,
            },{
              title: '查看视频',
              key: 'vIDEOURL',
              width:100,
              render: (text, row, index) => {
                return (<a className="theme-color" onClick={(e) => this.showVideoPlay(text)}>查看</a>);
              }
            },
          ]
        };
    }
    componentDidMount(){
      if(!Cookies.get('userName')){
        this.props.history.push('/Login');
      }
      document.title = "众睿资服";
      this.getList();
    }
    showVideoPlay(params){
      console.log(params)
      if(params.vIDEOURL){
        this.setState({
          videourl: params.vIDEOURL,//"https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
          visible:true,
        })
      }else{
        message.error("视频正在生成，请稍后...");
      }
    }
    videoListStatus(code){
      switch(parseInt(code)){
        case 1:
          return "等待接入";
          break;
        case 2:
          return "审核中";
          break;
        case 3:
          return "审核完成";
          break;
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
      console.log(pagination)
      this.setState({
        pagination:pagination
      });
      this.getSinglePageData(pagination);
    };
    // 获取全部数据
    getList = () => {
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
        })
      })
      .then(res => res.json())
      .then(res => {
        this.setState({ loading: false });
        if(res.response_code === "000000"){

          let data = Object.assign({}, this.state.pagination, { total: res.result.length })
          that.setState({
            data:res.result?res.result:[],
            pagination:data
          });  
          this.getSinglePageData(that.state.pagination);
        }else{
          message.error(res.response_msg);
        }
      }).catch(err => {
        this.setState({ loading: false });
      })
    };
    // 获取分页单页数据
    getSinglePageData = (params) =>{
      console.log(params)
      let startIndex = (params.current-1)*params.pageSize;
      let endIndex = startIndex + params.pageSize;
      this.setState({
        tableData:this.state.data.slice(startIndex, endIndex)
      });
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
  　　},()=> this.getList());
    }
    handleCancel(){
      this.setState({
        videourl: "",
        visible:false,
      })
    }
    render(){
      const { pagination, loading, columns, tableData} = this.state;
      return(
        <div className="video-table animated fadeInRight">
          <SearchForm parent={ this }></SearchForm>
          <Table
        	bordered
        	columns={columns}
        	dataSource={tableData}
        	pagination={pagination}
        	loading={loading}
          rowKey={record => record.bASQBH+Math.random()}
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
          <Player
            width="100%"
            height="100%"
            preload="none"
            // poster="./../assets/logo.png"
            src={this.state.videourl}
            autoPlay={true}
          />
        </Modal>
        </div>
      )
    }
}
export default VideoHistory;