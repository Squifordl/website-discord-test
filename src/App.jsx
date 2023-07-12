import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React from "react";
import "./App.css";
import Login from "./components/Login";
import Callback from "./components/Callback";
import UserList from "./components/UserList";
import UserProfile from "./components/UserProfile";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/callback" component={Callback} />
          <Route path="/users" component={UserList} />
          <Route path="/userprofile/:userId" component={UserProfile} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
