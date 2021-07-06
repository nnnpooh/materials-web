import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CodeForm from './components/CodeForm';
import Nav from './components/Nav';
import Home from './components/Home';
import Attendance from './components/Attendance';
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

        <Route path='/'>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
