import React from 'react';
import { Form, Input, Button, Row, Col, DatePicker, ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment'; //eslint-disable-line
import 'moment/locale/zh-cn';
const { RangePicker } = DatePicker;
class SearchForm extends React.Component {
    constructor(props) { //eslint-disable-line
        super(props);
    }
    handleSubmit = e => {
        e.preventDefault();
        var that = this;
        that.props.form.validateFields((err, values) => {
            let params = {
                customer:values.customer?values.customer:"",
            }
            if(values.time !="" && values.time){ //eslint-disable-line
                params.startTime = values.time[0].format('YYYY-MM-DD');
                params.endTime = values.time[1].format('YYYY-MM-DD');
            }
            that.props.parent.query(params);
        })
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={(e) => { this.handleSubmit(e) }}>
                <Row>
                <Col span={4}>
                    <Form.Item name="username">
                    {getFieldDecorator('customer')(
                        <Input autoComplete='off' placeholder="请输入客户姓名" />
                    )}
                    </Form.Item>
                </Col>
                <Col span={6}>
                <Form.Item name="startEndTime">
                    <ConfigProvider locale={zh_CN}>
                        {
                            getFieldDecorator('time')(
                                <RangePicker format="YYYY-MM-DD" autoComplete='off' placeholder="['开始', '结束']"/>
                            )
                        }
                    </ConfigProvider>
                    </Form.Item>
                </Col>
                <Col span={3}>
                    <Form.Item>
                    <Button type="primary" htmlType="submit">
                        查询
                    </Button>
                    </Form.Item>
                </Col>
                </Row>
            </Form>
        );
    }
}
export default Form.create()(SearchForm);