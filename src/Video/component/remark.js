import React from 'react';
import { Form, Input, Row, Col } from 'antd';
class RemarkForm extends React.Component {
    constructor(props) {
        super(props);
    }
    sendRemark(){
        var that = this;
        console.log(that.props.form.getFieldsValue().remark)
        this.props.getRemark("123")
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <Row>
                    <Col span={24}>
                        <Form.Item name="remark" label="备注: ">
                        {getFieldDecorator('remark')(
                            <Input.TextArea onChange={this.props.getRemark}/>
                        )}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}
export default Form.create()(RemarkForm);