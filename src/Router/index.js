import React from 'react';
import { HashRouter, Route } from 'react-router-dom'
import Login from '../Login/index'
import Video from '../Video/index'
import Home from '../Home/index'
import { createHashHistory } from "history";
const history = createHashHistory(); //eslint-disable-line
class RouterConfig extends React.Component{
    render(){
        return(
            <HashRouter>
                <Route exact path='/' component={Login}/>
                <Route exact path='/Login' component={Login}/>
                <Route exact path='/Home' component={Home}/>
                <Route exact path='/Video' component={Video}/>
            </HashRouter>
        )
    }
}
export default RouterConfig;