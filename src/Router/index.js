import React from 'react';
import { HashRouter, Route } from 'react-router-dom'
import { createHashHistory } from "history";
import Login from '../Login/index'
import VideoList from '../VideoList/index'
import Video from '../Video/index'
import Home from '../Home/index'
const history = createHashHistory();
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