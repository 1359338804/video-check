import React from 'react';
import {Router,Route,Switch} from 'react-router-dom';
import { createHashHistory } from "history";
import Login from '../Login/index'


const history = createHashHistory();
class RouterConfig extends React.Component{
    render(){
        return(
            <Router history={history}>
                <Switch>
                    <Route path='/' component={Login}/>
                    <Route path='/Login' component={Login}/>
                </Switch>
            </Router>
        )
    }
}
export default RouterConfig;