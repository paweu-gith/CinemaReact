import React, { Component } from "react";
import dateFormat from "dateformat";
import SeatsButtons from "./SeatsButtons";
import "./BuyTicket.css";
import AuthService from "../AuthService";
const apiPath = "http://localhost:8080/api";

export default class BuyTicket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedScreening: this.props.location.state,
      seats: [],
      reservedSeats: undefined,
      seatButtonClass: undefined,
      isLoading: false,
      isError: false,
    };

    this.cancelSubmit = this.cancelSubmit.bind(this);
    this.submitSelect = this.submitSelect.bind(this);
  }

  async componentDidMount() {
    if(AuthService.getCurrentUser() === null){
      alert("Kupić bilet może jedyni zalogowany użytkownik");
      this.props.history.push({pathname: "/"})
    }

    this.setState({ isLoading: true })

    const response = await fetch(apiPath+'/seats/hall/'+this.state.selectedScreening.hall.id)
    const response2 = await fetch(apiPath+'/ordered_seats/screening/'+this.state.selectedScreening.id)

    if (response.ok && response2.ok) {
      const seats = await response.json()
      const reservedSeats = await response2.json();

      this.setState({ seats: seats, reservedSeats: reservedSeats, isLoading: false });

    } else {
      this.setState({ isError: true, isLoading: false })
    }
    
  }

  chceckReserved(){
    this.state.seatButtonClass = Array.from(this.state.seats.length+1);
    console.log(this.state.seatButtonClass.length);
    this.state.seats.map((seat, index) => {
      
      this.state.seatButtonClass[seat.seatNumber] = "seat";
    });

    this.state.seats.map(seat => {
      if(this.state.reservedSeats.length == 0)
        this.state.seatButtonClass[seat.seatNumber] = "seat";
      else{
        this.state.reservedSeats.map(reservedSeat => {

          if(reservedSeat.seat.id === seat.id){
            this.state.seatButtonClass[seat.seatNumber] = "reserved";
          }
        });
      }
    });

  }

  cancelSubmit (){
    alert("Anulowano proces zamawiania biletów");
    this.props.history.push({pathname: "/"})
  }

  submitSelect (buttonClass) {
    var selectedSeats = [];

    console.log(buttonClass)
    buttonClass.map((button, index)=> {
        if(button === "selected")
            selectedSeats.push(this.state.seats[index-1]);
    })
    console.log(this.state.seats)
    if(selectedSeats.length<1)
        alert("Prodsze wybrać miejsce");
    else {

      this.props.history.push({pathname: "/oreder-summary", state: {
        selectedScreening: this.state.selectedScreening,
        selectedSeats: selectedSeats
      }});
    }
        
};

  render() {
    if (this.state.isLoading) {
      return <div>Loading...</div>
    }

    if (this.state.isError) {
      return <div>Error</div>
    }
    return this.state.seats.length > 0
    ? (
      
      <div>
        {this.chceckReserved()}
        <p><b>Wybierz miejsca jakie cię interesują na sali kinowej:</b></p>
        <SeatsButtons seats={this.state.seats} buttonClass={this.state.seatButtonClass} cancelSubmit = {this.cancelSubmit} submitSelect={this.submitSelect}/>
        <table>
          <thead>
            <tr>
              <th>Wybrany seans:</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Tytuł filmu: 
                <strong> {this.state.selectedScreening.movie.title} </strong>
              </td>
            </tr>
            <tr>
              <td>
                Data seansu: 
                <strong> {dateFormat(this.state.selectedScreening.date, "yyyy-mm-dd")} </strong>
              </td>
            </tr>
            <tr>
              <td>
                Godzina seansu: 
                <strong> {dateFormat(this.state.selectedScreening.date, "hh:MM")} </strong>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
          ) : (
            <div>
              No users.
          </div>
          )
  }
}

