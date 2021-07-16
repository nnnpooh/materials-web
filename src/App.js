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
import ClassAttend from './components/ClassAttend';

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
      <nav className='bg-gray-800'>
        <div className='text-gray-300 mx-6'>
          <Nav user={user} />
        </div>
      </nav>

      <div className='container mx-auto px-6'>
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

          <ProtectedRoute
            path='/codeselect'
            user={user}
            component={CodeSelect}
          />
          <ProtectedRoute
            path='/classattend'
            user={user}
            component={ClassAttend}
          />
          <Route path='/'>
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
