import React, { Component } from "react";
import "./sign-in.css";
import SignUp from "./sign-up";
import SignInForm from "./SignInForm";

export default class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      name:"",
      surname: "",
      password: "",

      message: "",
      loginErrors: false,
      redirect: false
    };
  }

  render() {
    return (
      <div>
        <SignInForm handleLogin={this.props.handleLogin}/>
        <SignUp />
      </div>
    );
  }
}