import React, { Component } from "react";
import "./sign-in.css";
import { Redirect } from 'react-router'
import AuthService from "../../AuthService.js";
import 'reactjs-popup/dist/index.css';

export default class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      loginErrors: false,
      redirect: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    AuthService.login(this.state.email, this.state.password).then(
      () => {
        this.setState({redirect: true, loginErrors:false})
        this.props.handleLogin();
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data) ||
          error.message ||
          error.toString();
        this.setState({
          loading: false,
          message: resMessage
          
        });
        alert("Błędne dane logowania");
        this.setState({email: "", password:""})
      }
    );

    event.preventDefault();
  }

    render() {
        if (this.state.redirect) {
          return <Redirect to='/'/>;
        }
        return (
        <div>
        <table>
          <thead>
            <tr>
              <th>Zaloguj</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <form onSubmit={this.handleSubmit}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    required
                  />
                  <br/><br/>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    required
                  />
                  <br/><br/>
                  <button type="submit">Login</button>
                </form>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
    );
  }
}