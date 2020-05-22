import React from 'react';
import { Form, Icon, Input, Button} from 'antd';
import LoginForm from './component/form';
import styles from './index.less'
import classnames  from 'classnames';
class Login extends React.Component{
    render(){
        const form = this.props.form;
        return(
            <div className={classnames(styles.main)}>
                <LoginForm></LoginForm>
            </div>
        );
    }
}
export default Login;