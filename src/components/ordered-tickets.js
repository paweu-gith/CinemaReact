import React, { Component } from "react";
import dateFormat from "dateformat";
import AuthService from "../AuthService";
const axios = require('axios');
const apiPath = "http://localhost:8080/api";

export default class BuyTicket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      orderedSeats:[],

      isLoading: false,
      isError: false,
    };

  }

  async componentDidMount() {
    if(AuthService.getCurrentUser() === null){
      alert("Tylko zalogowany użytkonik ma dostęp do tych danych");
      this.props.history.push({pathname: "/"})
    }

    this.setState({ isLoading: true })
    var userId = AuthService.getCurrentUser().id;
    const response = await fetch(apiPath+'/orders/user/'+userId)
    const response2 = await fetch(apiPath+'/ordered_seats/order/user/'+userId)

    if (response.ok && response2.ok) {
      const orders = await response.json()
      const orderedSeats = await response2.json();
      this.setState({ orders: orders, orderedSeats: orderedSeats, isLoading: false });

    } else {
      this.setState({ isError: true, isLoading: false })
    }
  }

  async cancelOrder(order){
    let result = window.confirm("Aby zrezygnować z zakupu wciśnij OK");
    if(result){
      const response = await axios.delete(apiPath+'/ordered_seats/order/'+order.id);
      if (response.status == 200){
        const response2 = await axios.delete(apiPath+'/orders/'+order.id);
        if (response2.status == 200)
          window.location.reload(false);
      }
    }
  }

  renderTableRows (){

    return this.state.orders.map(order => {
      var orderedSeatsLength = 0;
      var orderedSeat = undefined;
       this.state.orderedSeats.map(seat => {
        if(seat.order.id === order.id){
          orderedSeatsLength++;
          orderedSeat=seat;
        }
          
      })

      return (
        <tr key={order.id}>
          <td>{orderedSeat.screening.movie.title}</td>
          <td>{dateFormat(orderedSeat.screening.date, "yyyy-mm-dd hh:MM")}</td>
          <td>{dateFormat(order.date, "yyyy-mm-dd hh:MM")}</td>
          <td>{orderedSeat.screening.movie.ticketPrice * orderedSeatsLength}</td>
          <td>            	
            <form>
              <input type='button' onClick={() => this.cancelOrder(order)} value='Zrezygnuj' />
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
    return this.state.orders.length > 0
    ? (
      <div>
        <h1>Kupione bilety</h1>
      
      <table>
        <thead>
          <tr>
            <th>Tytuł filmu</th>
            <th>Data seansu</th>
            <th>Data zakupu</th>
            <th>Cena</th>
            <th>Anuluj zamówienie</th>
          </tr>
        </thead>
        <tbody>
          {this.renderTableRows()}
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