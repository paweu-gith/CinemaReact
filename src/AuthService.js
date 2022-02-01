import axios from "axios";

const apiPath = "https://springboot-cinema.herokuapp.com/api/auth/";

class AuthService {
  login(email, password) {
    return axios
      .post(apiPath + "signin", {
        email: email,
        password: password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }
  logout() {
    localStorage.removeItem("user");
  }
  register(email, name, surname, password) {
    return axios.post(apiPath + "signup", {
      name: name,
      surname: surname,
      email: email,
      password: password,
      roles: "ROLE_USER"
    });
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();