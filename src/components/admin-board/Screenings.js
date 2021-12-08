import React, { Component } from "react";
import dateFormat from "dateformat";
import AuthService from "../../AuthService";
import Select from 'react-select'
const axios = require('axios');
const apiPath = "http://localhost:8080/api";

export default class Screenings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectMovieOptions : [],
      idMovie: "",
      nameMovie: '',

      selectHallOptions : [],
      idHall: "",
      nameHall: '',

      date: undefined,
      time: undefined,

      screenings: [],

      isLoading: false,
      isError: false,
    };

    this.addScreening = this.addScreening.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleHallChange = this.handleHallChange.bind(this);

  }

  handleChange(event) {
    if(event.target === undefined){
      console.log(event)
      this.setState({idMovie: event.value, nameMovie: event.label})

    }else{
      this.setState({
        [event.target.name]: event.target.value
      });
    }

  }
  handleHallChange(event) {
    this.setState({idHall: event.value, nameHall: event.label})

  }

  async getOptions(){
    const res = await axios.get(apiPath+'/movies')
    .catch(error => {
      this.setState({ isLoading: false, isError: true })
      console.log(error)
    });

    const res2 = await axios.get(apiPath+'/halls')
    .catch(error => {
      this.setState({ isLoading: false, isError: true })
      console.log(error)
    });

    const data = res.data
    const data2 = res2.data


    const options = data.map(d => ({
      "value" : d.id,
      "label" : d.title
    }))
    const options2 = data2.map(d => ({
      "value" : d.id,
      "label" : d.hallName
    }))

    this.setState({selectMovieOptions: options, selectHallOptions: options2})

  }

  async getScreenings(){
    this.setState({ isLoading: true, isError: false })

    await axios.get(apiPath+'/screenings/')
    .then(response => {
        this.setState({ screenings: response.data, isLoading: false, isError: false })
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
      this.getScreenings();
      this.getOptions();
      
    }
    else{
      alert("Brak uprawnień");
      this.props.history.push({pathname: "/"})
    }

  }



  async addScreening(event){
    event.preventDefault();
    const date = this.state.date +" "+ this.state.time + ":00"
    const response = await axios(apiPath+'/movies/'+this.state.idMovie)
    const movie = response.data; 

    axios.post(apiPath+'/screenings/', {
      date: date,
      movie: movie,
      hall: {
        id: this.state.idHall,
        hallName: this.state.nameHall
      }
    })
      .then(response => {
        alert("Dodano nowy seans");
        this.getScreenings()
      })
      .catch(error => {
          alert("Nie udało się wykonać operacji");
         
          console.log(error)
      });


  }

  async deleteMovie(screening){
    let result = window.confirm("Aby usunąć film wybierz OK");
    if(result){
      const response = await axios.delete(apiPath+'/screenings/'+screening.id);
      if (response.status == 200){
        alert("Usunięto seans");
        this.getScreenings();
      }

    }
  }


  renderTableRows = () => {
    return this.state.screenings.map(screening => {

      return (
        <tr key={screening.id}>
          <td>{screening.movie.title}</td>
          <td>{dateFormat(screening.date, "yyyy-mm-dd hh:MM")}</td>
          <td>{screening.hall.hallName}</td>
          <td>            	
            <form>
              <input type='button' onClick={() => this.deleteMovie(screening) } value='Usuń' />
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
        <h1>Admin - Seanse</h1>
        {
          this.state.screenings.length > 0 
          ? (
            <table>
              <thead>
                <tr>
                  <th>Tytuł filmu</th>
                  <th>Data seansu</th>
                  <th>Nazwa sali</th>
                  <th>Opcje</th>
                </tr>
              </thead>
              <tbody>
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
              <th>Dodaj seans</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <form onSubmit={this.addScreening}>
                  Film:
                  <Select 
                    name="movieSelect"
                    options={this.state.selectMovieOptions} 
                    onChange={this.handleChange} 
                  /><br/><br/>
                  Sala:
                  <Select 
                    name="halleSelect"
                    options={this.state.selectHallOptions} 
                    onChange={this.handleHallChange} 
                  /><br/><br/>
                  Data:<br />
                  <input
                    type="date"
                    name="date"
                    value={this.state.date}
                    onChange={this.handleChange}
                    required
                  />
                  <br/><br/>
                  Godzina:<br />
                  <input
                    type="time"
                    name="time"
                    value={this.state.time}
                    onChange={this.handleChange}
                    required
                  />
                  <br/><br/>

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