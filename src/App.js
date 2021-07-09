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

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      // console.log('State Changed.');
      console.log({ event, session });
      if (event === 'SIGNED_IN') {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
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
        <Route path='/signin'>
          <SignIn />
        </Route>

        <ProtectedRoute path='/' user={user} component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
