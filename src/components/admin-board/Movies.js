import React, { Component } from "react";
import dateFormat from "dateformat";
import AuthService from "../../AuthService";
const axios = require('axios');
const apiPath = "http://localhost:8080/api";

export default class Movies extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movieTitle: "",
      ticketPrice: "",
      movieDescription: "",
      moviePoster: undefined,

      movies: [],

      isLoading: false,
      isError: false,
    };

    this.addMovie = this.addMovie.bind(this);
    this.handleChange = this.handleChange.bind(this);
    //this.handleUploadClick = this.handleUploadClick(this);
  }

  handleChange(event) {
    //let file = event.target.files[0];
    //console.log(file);
    if(event.target.name === "moviePoster"){
      this.setState({
        [event.target.name]: event.target.files[0]
      });
    }
    else{
      this.setState({
        [event.target.name]: event.target.value
      });
    }

  }
  async getMovies(){
    this.setState({ isLoading: true, isError: false })

    await axios.get(apiPath+'/image/get/')
    .then(response => {
        this.setState({ movies: response.data, isLoading: false, isError: false })
        console.log(this.state.movies);
      })
    .catch(error => {
        this.setState({ isLoading: false, isError: true })
        console.log(error)
    });
  }
  
  async componentDidMount() {  
    if(AuthService.getCurrentUser() === null){
      alert("Tylko zalogowany użytkonik ma dostęp do tych danych");
      this.props.history.push({pathname: "/"})
    }
    else if(AuthService.getCurrentUser().roles.some(role => role === "ROLE_ADMIN")){
      this.getMovies();

    }
    else{
      alert("Brak uprawnień");
      this.props.history.push({pathname: "/"})
    }

  }

  async addMovie(event){
    axios.post(apiPath+'/movies/', {
      title: this.state.movieTitle,
      ticketPrice: this.state.ticketPrice,
      description: this.state.movieDescription
    })
      .then(response => {
        alert("Dodano nowy film");
        console.log(response.data)
        let imageFile = new FormData();
        imageFile.append('file', this.state.moviePoster);

        imageFile.append('movieString', JSON.stringify(response.data));

        axios.post(apiPath+"/image/upload", imageFile, {
          onUploadProgress:progressEvent => {
              console.log("Uploading : " + ((progressEvent.loaded / progressEvent.total) * 100).toString() + "%")
          }
        })
        .then(response => {
          this.getMovies();

        });
      })
      .catch(error => {
          alert("Nie udało się wykonać operacji");
         
          console.log(error)
      });

      event.preventDefault();
  }

  async deleteMovie(image){
    let result = window.confirm("Aby usunąć film OK");
    if(result){
      const response = await axios.delete(apiPath+'/image/'+image.id);
      if (response.status == 200){
        const response2 = await axios.delete(apiPath+'/movies/'+image.movie.id);
        if (response2.status == 200)
          this.getMovies();
      }
    }
  }


  renderTableRows = () => {
    return this.state.movies.map(movie => {

      return (
        <tr key={movie.movie.id}>
          <td>{<img width="110" height="145" src={`data:image/png;base64,${movie.picByte}`}/>}</td>
          <td>{movie.movie.title}</td>
          <td>{movie.movie.ticketPrice}</td>
          <td>            	
            <form>
              <input type='button' onClick={() => this.deleteMovie(movie) } value='Usuń' />
            </form>
          </td>
        </tr>
      )
    })
}

  render() {
    if (this.state.isLoading) {
      return <div>Loading...</div>
    }
    if (this.state.isError) {
      return <div>Error</div>
    }
    return (
      <div>
        <h1>Admin - Filmy</h1>
        {
          this.state.movies.length > 0 
          ? (
            <table>
              <thead>
                <tr>
                  <th>Plakat</th>
                  <th>Tytuł filmu</th>
                  <th>Cena biletu</th>
                  <th>Opcje</th>
                </tr>
              </thead>
              <tbody className="normalTable">
                {this.renderTableRows()}
              </tbody>
            </table>
          ): (
            <div>
              No users.
          </div>
          )
        }
        <table>
          <thead>
            <tr>
              <th>Dodaj film</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <form onSubmit={this.addMovie}>
                  Plakat:<br />
                  <input
                    accept="image/*"
                    name="moviePoster"
                    type="file"
                    onChange={this.handleChange}
                    required
                  /><br /><br/>
                  Tytuł filmu:<br />
                  <input
                    type="text"
                    name="movieTitle"
                    placeholder="Tytuł filmu"
                    value={this.state.movieTitle}
                    onChange={this.handleChange}
                    required
                  />
                  <br/><br/>
                  Cena biletu:<br />
                  <input
                    type="number"
                    name="ticketPrice"
                    placeholder="Cena biletu"
                    value={this.state.ticketPrice}
                    onChange={this.handleChange}
                    required
                  />
                  <br/><br/>
                  Opis filmu:<br />
                  <input
                    type="text"
                    name="movieDescription"
                    placeholder="Opis filmu"
                    value={this.state.movieDescription}
                    onChange={this.handleChange}
                    required
                  />
                  <br/><br/>
                  <button type="submit">Dodaj</button>
                </form>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ) 
  }
}