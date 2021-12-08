import React, { Component } from "react";
import "./sign-in.css";
import AuthService from "../../AuthService.js";

export default class SignUp extends Component {
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

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    AuthService.register(this.state.email, this.state.name, this.state.surname, this.state.password ).then(
      response => {
        alert("Poprawnie utworzono konto użytkownika");
        this.setState({email: "", password:"", name: "", surname: ""});
        this.setState({message: response.data.message, redirect: true, loginErrors:false})

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
        alert(this.state.message);
        this.setState({email: "", password:"", name: "", surname: ""});
      }
    );

    event.preventDefault();
  }

    render() {
        return (

        <div>
            <table>
                <thead>
                    <tr>
                        <th>Zarejestruj</th>
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
                            type="text"
                            name="name"
                            placeholder="Imię"
                            value={this.state.name}
                            onChange={this.handleChange}
                            required
                        />
                        <br/><br/>
                        <input
                            type="text"
                            name="surname"
                            placeholder="Nazwisko"
                            value={this.state.surname}
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
                        <button type="submit">Zarejestruj</button>
                        </form>
                    </td>
                </tr>
                </tbody>
            </table>
            

        </div>
    );
  }
}