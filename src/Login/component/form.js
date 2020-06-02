import React from 'react';
import { Form, Icon, Input, Button,message } from 'antd';
import '../../config.js';
import Cookies from 'js-cookie'
import "antd/dist/antd.css"
import './index.css'
class LoginForm extends React.Component {
    constructor(props) { //eslint-disable-line
        super(props);
    }
    handleSubmit = e => {
        e.preventDefault();
        var that = this;
        that.props.showLoading(true);
        that.props.form.validateFields((err, values) => {
            if (!err) {
                var data = {
                    ...values
                };
                fetch(`${global.constants.apiUrl}app/login`, {
                    method: 'POST',
                    body:JSON.stringify(data)
                })
                .then(res => res.json())
                .then(res => {
                    that.props.showLoading(false);
                    if(res.response_code === "000000"){
                        console.log(res)
                        Cookies.set('userName',values.userName);
                        that.props.history.push({ pathname : '/Home'});
                    }else{
                        message.error(res.response_msg);
                    }
                })
            }
        });
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="form-tpl">
                <div className="title">
                    众睿资服
                </div>
                <Form onSubmit={(e) => { this.handleSubmit(e) }}>
                    <Form.Item>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: '请输入用户名!' }],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="用户名"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('pwd', {
                            rules: [{ required: true, message: '请输入密码!' }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="密码"
                            />,
                        )}
                    </Form.Item>

                    <Form.Item>
                        <Button size="large" type="primary" htmlType="submit" className="submit">
                            登录
                        </Button>
                    </Form.Item>
                </Form >
            </div>
        );
    }
}

export default Form.create()(LoginForm);