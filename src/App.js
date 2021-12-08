import React from 'react';
import Navbar from './navbar/NavBar';
import AuthService from "./AuthService.js";

//import Navbar from './navbar';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import "./App.css";
import Home from './components';
import About from './components/about';
import OrderedTickets from './components/ordered-tickets';
import SignIn from './components/sign-in/SignInMain';
import BuyTicket from "./components/BuyTicket";
import OrderSummary from "./components/OrderSummary";
import Movies from './components/admin-board/Movies';
import Screenings from './components/admin-board/Screenings';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loggedInStatus: false,
      currentUser: undefined
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      });
    }
  }

  handleLogout(logOut) {
    if(logOut === true){
      AuthService.logout();
  
      this.setState({
        currentUser: undefined,
      });
    }
  }

  handleLogin() {
    window.location.reload(false);
  }

  render() {
    return (
      <Router >
      <Navbar currentUser={this.state.currentUser} handleLogout={this.handleLogout} />
      <div class="main">
        { 
          (this.state.currentUser) &&
          <span>Zalogowany użytkonik: <strong>{this.state.currentUser.email}</strong></span>
        
        }
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/about' component={About} />
          <Route path='/ordered-tickets' component={OrderedTickets} />
          <Route path='/sign-in'>
            <SignIn handleLogin={this.handleLogin} />
          </Route>
          <Route path="/buy-ticket" component={BuyTicket} />
          <Route path="/oreder-summary" component={OrderSummary} />
          <Route path="/movies" component={Movies} />
          <Route path="/screenings" component={Screenings} />
        </Switch>
      </div>



    </Router>
    
    );
  }
}

export default App;
