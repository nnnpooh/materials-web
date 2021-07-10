import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CodeForm from './components/CodeForm';
import Nav from './components/Nav';
import Home from './components/Home';
import Attendance from './components/Attendance';
import Records from './components/Records';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import supabase from './database';
import ProtectedRoute from './components/ProtectedRoute';
import CodeSelect from './components/CodeSelect';

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const checkSession = supabase.auth.session();
    const checkUser = supabase.auth.user();
    console.log({ checkSession, checkUser });
    if (checkUser) {
      setUser(checkUser);
    }

    const listen = supabase.auth.onAuthStateChange((event, session) => {
      console.log('State Changed.');
      console.log({ event, session });
      if (event === 'SIGNED_IN') {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    //    console.log({ listen });
    return () => {
      console.log('Unsubscribed');
      listen.data.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <Nav user={user} />

      <Switch>
        <ProtectedRoute path='/form' user={user} component={CodeForm} />
        <ProtectedRoute
          path='/attend/:code'
          user={user}
          component={Attendance}
        />
        <ProtectedRoute path='/records' user={user} component={Records} />
        <Route path='/signup'>
          <SignUp />
        </Route>

        <Route
          path='/signin'
          render={(props) => <SignIn user={user} {...props} />}
        />

        <ProtectedRoute path='/codeselect' user={user} component={CodeSelect} />
        <Route path='/'>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
