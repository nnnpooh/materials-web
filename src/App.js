import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CodeForm from './components/CodeForm';
import Nav from './components/Nav';
import Home from './components/Home';
import Attendance from './components/Attendance';
import Records from './components/Records';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
function App() {
  return (
    <Router>
      <Nav />

      <Switch>
        <Route path='/form'>
          <CodeForm />
        </Route>
        <Route path='/attend/:code'>
          <Attendance />
        </Route>
        <Route path='/records'>
          <Records />
        </Route>
        <Route path='/signup'>
          <SignUp />
        </Route>
        <Route path='/signin'>
          <SignIn />
        </Route>
        <Route path='/'>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
