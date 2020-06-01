import React from 'react';
import { Table, message,Form,Button} from 'antd';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie'
import '../config.js';
import './index.css'
class VideoList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          userName:Cookies.get('userName'),
          data: [],
          tableData: [],
          pagination: {
            current: 1,
            pageSize: 10,
          },
          loading: false,
          columns: [
            {
              title: '申请编号',
              dataIndex: 'bASQBH',
              key: 'bASQBH',
            },{
              title: '视频发起人',
              dataIndex: 'sPFQRY',
              key: 'sPFQRY',
            },{
              title: '视频审核人员',
              dataIndex: 'sPSHRY',
              key: 'sPSHRY',
            },{
              title: '视频发起时间',
              dataIndex: 'sPFQSJ',
              key: 'sPFQSJ',
            },{
              title: '操作',
              key: 'action',
              render: (text, row, index) => {
                var path = "/Video?userid="+ this.compileStr(this.state.data[index].uSERID)+"&usersig="+this.compileStr(this.state.data[index].uSERSIN)+"&roomid="+this.compileStr(this.state.data[index].sPFJID);
                return (<Link className="theme-color" to={path} >视频接入</Link>);
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
      const { pagination } = this.state;
      this.getList({ pagination });
    }
    componentWillReceiveProps(nextProps){
      if(nextProps.isRefresh){
        this.refresh();
      }
    }
    compileStr (code) {
      var c = String.fromCharCode(code.charCodeAt(0) + code.length)
      for (var i =1; i < code.length; i++) {
          c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i -1))
      }
      return escape(c)
    };
    // 分页
    handleTableChange = (pagination, filters, sorter) => {
      this.getSinglePageData(pagination);
    };
    // 获取全部数据
    getList = (params) => {
      console.log(params);
      let that = this;
      this.setState({ loading: true });
      fetch(`${global.constants.apiUrl}app/video/getList`, {
        method: 'post',
        body:JSON.stringify({
          "type":"1",
          "userName":that.state.userName
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
    // 刷新
    refresh(){
      const { pagination } = this.state;
      this.getList({ pagination });
    }
    // 获取分页单页数据
    getSinglePageData = (params) =>{
      console.log(params);
      let startIndex = (params.current-1)*params.pageSize;
      let endIndex = startIndex + params.pageSize;
      console.log(startIndex, endIndex);
      console.log(this.state.data.slice(startIndex, endIndex));
      this.setState({
        tableData:this.state.data.slice(startIndex, endIndex)
      });
    };
    render(){
      const { data, pagination, loading, columns, tableData} = this.state;
      return(
        <div className="video-table animated fadeInRight">
          <div className="refresh-wrap">
           <Button type="primary" onClick={(e)=>this.refresh()}>刷新</Button>
          </div>
          <Table
        	bordered
        	columns={columns}
        	dataSource={tableData}
        	pagination={pagination}
        	loading={loading}
          rowKey={record => record.bASQBH}
          scroll={{ y: 360 }}
        	onChange={this.handleTableChange}
          />
        </div>
      )
    }
}
export default VideoList;