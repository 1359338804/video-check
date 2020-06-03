import React from 'react';
import { Table, message,Button} from 'antd';
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
              dataIndex: 'BASQBH',
              key: 'BASQBH',
            },{
              title: '视频发起人',
              dataIndex: 'SPFQRY',
              key: 'SPFQRY',
            },{
              title: '视频审核人员',
              dataIndex: 'SPSHRY',
              key: 'SPSHRY',
            },{
              title: '视频发起时间',
              dataIndex: 'SPFQSJ',
              key: 'SPFQSJ',
            },{
              title: '操作',
              key: 'action',
              render: (text, row, index) => {
                var path = "/Video?USERID="+ this.compileStr(this.state.data[index].USERID)+"&usersig="+this.compileStr(this.state.data[index].USERSIN)+"&roomid="+this.compileStr(this.state.data[index].SPFJID);
                return (<Link className="theme-color" to={path} >视频接入</Link>);
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
          "type":"1",
          "userName":that.state.userName,
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
    // 刷新
    refresh(){
      let data = Object.assign({}, this.state.pagination, { current: 1 });
      this.setState({
        pagination:data
      }, ()=>{
        const { pagination } = this.state;
        this.getList(pagination);
      });  
    }
    render(){
      const { data, pagination, loading, columns} = this.state;
      return(
        <div className="video-table animated fadeInRight">
          <div className="refresh-wrap">
           <Button type="primary" onClick={(e)=>this.refresh()}>刷新</Button>
          </div>
          <Table
        	bordered
        	columns={columns}
        	dataSource={data}
        	pagination={pagination}
        	loading={loading}
          rowKey={record => record.BASQBH}
          scroll={{ y: 360 }}
        	onChange={this.handleTableChange}
          />
        </div>
      )
    }
}
export default VideoList;