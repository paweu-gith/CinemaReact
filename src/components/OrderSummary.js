import React, { useState } from "react";
import dateFormat from "dateformat";
import { useHistory } from "react-router";
import moment from "moment";
import AuthService from "../AuthService";
const axios = require('axios');
const apiPath = "http://localhost:8080/api";

const SeatsButtons = (props) => {
    const history = useHistory();

    if(AuthService.getCurrentUser() === null){
      alert("Brak uprawnień");
      history.push({pathname: "/"});
      return ("");
    }

    const selectedScreening = props.location.state.selectedScreening;
    const selectedSeats = props.location.state.selectedSeats;


    const printSeatsNumbers = () => {
        return selectedSeats.map((seat, index) => {
          console.log(selectedSeats)
            if(index === selectedSeats.length-1)
                return (seat.seatNumber)
            else
                return (seat.seatNumber + ", ")
        })
    };

    const cancelSubmit = () => {
        alert("Anulowano proces zamawiania biletów");
            history.push({pathname: "/"})
    };

    const submitSelect = async () => {
      const current= moment().format("YYYY-MM-DD HH:mm:ss");

      var user, order;

      await axios.get(apiPath+'/users/'+AuthService.getCurrentUser().id )
        .then(response => user= response.data)
        .catch(error => {
            alert("Nie udało się wykonać operacji");
            history.push("/");
        });


      await axios.post(apiPath+'/orders/', {
        date: current,
        user: user
      })
        .then(response => order= response.data)
        .catch(error => {
            alert("Nie udało się wykonać operacji");
            history.push("/");
        });
        
      selectedSeats.map(async (seat, index) => {
        await axios.post(apiPath+'/ordered_seats/', {
          screening: selectedScreening,
          order: order,
          seat: seat
        })
          .then(response => {
            if(index === selectedSeats.length-1){
              sendEmail(order);
            }
          })
          .catch(error => {
              alert("Nie udało się wykonać operacji");
              history.push("/");
          })
      })
    };

    const sendEmail = async (order) =>{
      await axios.get(apiPath+'/sendemail/'+ order.id )
        .then(response => {
          alert("Poprawnie dokonano zakupu biletu. Potwierdzenie wysłano na twój e-mail");

          history.push("/");
        })
        .catch(error => {
            alert("Nie udało się wykonać operacji");
            history.push("/");
        });
    }

    return (
        <div>
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
                <strong> {selectedScreening.movie.title} </strong>
              </td>
            </tr>
            <tr>
              <td>
                Data i godzina seansu: 
                <strong> {dateFormat(selectedScreening.date, "yyyy-mm-dd hh:MM")} </strong>
              </td>
            </tr>
            <tr>
              <td>
                Wybrane miejsca: 
                <strong> {printSeatsNumbers()} </strong>
              </td>
            </tr>
            <tr>
              <td>  
                Cena jednego biletu biletów: 
                <strong> {selectedScreening.movie.ticketPrice} </strong>
              </td>
            </tr>
            <tr>
              <td>
                Cena za wszystkie bilety: 
                <strong> {selectedScreening.movie.ticketPrice * selectedSeats.length} </strong>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <p>Przed zamówieniem biletu sprawdź czy wszystkie dane są poprawne.</p>
        <div className="Table">
            <div className="Row">
                <div className="Cell">
                    <input type="submit" onClick={() => cancelSubmit()} value="< Anuluj" />
                </div>
                <div className="Cell">
                    <input type="submit" onClick={() => submitSelect()} value="Zamów bilet >" />
                </div>   
            </div>
        </div>
        </div>
    );
}

export default SeatsButtons;