//--------------------Import Libraries---------------------//
import React from "react";
import {Route} from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles'
import GlobalTheme from './themes/GlobalTheme'
import CssBaseline from "@material-ui/core/CssBaseline";
import "fontsource-roboto";

//--------------------Import Components---------------------//
import Login from './components/login/LogIn'
import Register from './components/login/Register'
import Home from './components/home/Index'
import Loader from './components/home/loader'
import NewTransaction from './components/newTransaction/index'
import History from "./components/history/index"
import Logout from './components/login/logout'


function App() {
  return (
<ThemeProvider theme={GlobalTheme}>
  <div className="App" minWidth="320" >
      <CssBaseline />
      <Route exact path ='/' component={Login} />
      <Route exact path ='/register' component={Register} />
      <Route exact path ='/home' component={Home} />
      <Route exact path ='/loading' component={Loader} />
      <Route exact path ='/newTransaction' component={NewTransaction} />
      <Route exact path ='/history' component={History} />
      <Route exact path ='/logout' component={Logout} />

  </div>
</ThemeProvider>
  );
}

export default App;
