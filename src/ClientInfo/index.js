import React from 'react'
import './index.css'

import Skeleton from 'antd/es/skeleton'; // 加载 JS
import 'antd/es/skeleton/style/css'; // 加载 CSS

import Typography from 'antd/es/typography'; // 加载 JS
import 'antd/es/typography/style/css'; // 加载 CSS

import Divider from 'antd/es/divider'; // 加载 JS
import 'antd/es/divider/style/css'; // 加载 CSS

const { Title, Paragraph, Text } = Typography;

class ClientInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }
    // 生命周期挂载
    componentDidMount() {

    }
    render() {
        // return (
        //     <div className="ClientInfo">
        //         <div className="ClientInfo-list">
        //             <span>基本信息</span>
        //             <div className="ClientInfo-list-title">
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //             </div>
        //             <div className="ClientInfo-list-title">
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //             </div>
        //             <div className="ClientInfo-list-title">
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //             </div>
        //             <div className="ClientInfo-list-title">
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //             </div>
        //             <div className="ClientInfo-list-title">
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //             </div>
        //             <div className="ClientInfo-list-title">
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三</span></div>
        //                 <div><b>客户姓名:</b> <span>张三</span></div>
        //             </div>
        //         </div>
        //         <div className="ClientInfo-list">
        //             <span>基本信息</span>
        //             <div className="ClientInfo-list-title">
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //             </div>
        //             <div className="ClientInfo-list-title">
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //             </div>
        //             <div className="ClientInfo-list-title">
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //             </div>
        //             <div className="ClientInfo-list-title">
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //             </div>
        //             <div className="ClientInfo-list-title">
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //             </div>
        //             <div className="ClientInfo-list-title">
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三</span></div>
        //                 <div><b>客户姓名:</b> <span>张三</span></div>
        //             </div>
        //         </div>
        //         <div className="ClientInfo-list">
        //             <span>基本信息</span>
        //             <div className="ClientInfo-list-title">
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //             </div>
        //             <div className="ClientInfo-list-title">
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //             </div>
        //             <div className="ClientInfo-list-title">
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //             </div>
        //             <div className="ClientInfo-list-title">
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //             </div>
        //             <div className="ClientInfo-list-title">
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //             </div>
        //             <div className="ClientInfo-list-title">
        //                 <div><b>客户姓名：</b> <span>张三</span></div>
        //                 <div><b>客户姓名：</b> <span>张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三</span></div>
        //                 <div><b>客户姓名:</b> <span>张三</span></div>
        //             </div>
        //         </div>
        //     </div>
        // )
        const text = <Typography>
    
    
        <Title level={4}>基本信息</Title>
        <Paragraph>
          姓名: <Text mark>{this.props.data.basqxm}</Text>
        </Paragraph>
        <Paragraph>
          手机号: <Text mark>{this.props.data.basjhm}</Text>
        </Paragraph>
        <Paragraph>
          证件号码: <Text mark>{this.props.data.bazjhm}</Text>
        </Paragraph>
        <Divider />
        
      </Typography>;
            return(
                <div className="ClientInfo">
                    {this.props.data.basqxm ? text:(<div><Skeleton active /></div>)}
                </div>
            )

    }
}
export default ClientInfo