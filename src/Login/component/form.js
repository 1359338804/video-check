import React from 'react';
import { Form, Icon, Input, Button} from 'antd';
import "antd/dist/antd.css"
import styles from './index.less'
class LoginForm extends React.Component{
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var data = {
                    clientId: "",
                    ...values
                };
                console.log(data);
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Username"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="Password"
                        />,
                    )}
                </Form.Item>
                
                 <Form.Item>
                    <Button size="large" type="primary" htmlType="submit">
                        登录
                    </Button>
                </Form.Item>
            </Form >
        );
    }
}

export default Form.create()(LoginForm);