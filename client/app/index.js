import React from 'react';
import { render } from 'react-dom';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'
import {Provider} from'react-redux'

import { store, persistor } from './redux/configStore'
import App from './components/App/App';
import NotFound from './components/App/NotFound';

import Home from './components/Home/Home';
import { PersistGate } from 'redux-persist/integration/react'

import Admin from './components/Admin/admin';
import Login from './components/loginScreen/login';
import SignUp from './components/signupScreen/signup'

import './styles/style.css';

render((
  <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>

          {/*// hello*/}


    <Router>
      <App>
        <Switch >
          <Route exact path="/" component={Home} />
          <Route path="/admin" component={Admin} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <Route component={NotFound}/>
        </Switch>
      </App>
    </Router>
    </PersistGate>
  </Provider>
), document.getElementById('app'));
