import React from 'react';
import "./table.css";
import dateFormat from "dateformat";
import { withRouter } from "react-router-dom";
const axios = require('axios');
const apiPath = "https://springboot-cinema.herokuapp.com/api";

class Table1 extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        screenings: [],
        isLoading: false,
        isError: false,
        rowStyle:"test",
        image: undefined,

        selectedScreening: undefined
      }

    }
buyTicket(screening){

  this.props.history.push({pathname: "/buy-ticket", state: screening});
}
    async componentDidMount() {
      this.setState({redirect: false, selectedScreening: undefined});
        this.setState({ isLoading: true })
        let screenings = null;

        let image = null;
        const requestOne = axios.get(apiPath+'/screenings');
        const requestTwo = axios.get(apiPath+'/image/get');

        await axios.all([requestOne, requestTwo]).then(axios.spread(function(res1, res2) {
          screenings = res1.data
          image = res2.data
        }))
        .catch(error => {
          this.setState({ isLoading: false, isError: true })
          console.log(error)
      });
      this.setState({ screenings, image, isLoading: false })

        this.setState({redirect: false, selectedScreening: undefined});
    }


    renderTableRows = () => {
        return this.state.screenings.map(screening => {
          let moviePoster;
          this.state.image.map(image =>{
            if(image.movie.id == screening.movie.id)
              moviePoster = image.picByte;
          })

          if(this.state.rowStyle === "test")
            this.state.rowStyle = "test2";
          else
            this.state.rowStyle = "test";

          return (
            <React.Fragment>
            <tr className={this.state.rowStyle} key={screening.id}>
              <td rowSpan="2">{moviePoster ? <img img width="120" height="179"  src={`data:image/png;base64,${moviePoster}`}/>: ''}</td>
              <td>{screening.movie.title}</td>
              <td>{dateFormat(screening.date, "yyyy-mm-dd")}</td>
              <td>{dateFormat(screening.date, "hh:MM")}</td>
              <td>{screening.movie.ticketPrice}</td>
              
              <td rowSpan="2">            	
                <form>
			            <input type='button' onClick={() => this.buyTicket(screening)} value='Kup bilet' />
					        <input type='hidden' name='id' value={screening} />
				        </form>
              </td>
            </tr>
            <tr className={this.state.rowStyle} >
              <td colSpan="4" style={{textAlign: 'justify'}}>{screening.movie.description} </td>
            </tr>
            </React.Fragment>

          )
        }
        
        )
    }

    render() {

        const { screenings: users, isLoading, isError } = this.state
    
        if (isLoading) {
          return <div>??adowanie...</div>
        }
    
        if (isError) {
          return <div>Przepraszamy wyst??p?? b????d</div>
        }
    
        return users.length > 0
          ? (
            <table>
              <thead>
                <tr>
                  <th>Plakat</th>
                  <th>Tytu?? filmu</th>
                  <th>Data</th>
                  <th>Godzina</th>
                  <th>Cena biletu</th>
                  <th>Kup bilet</th>
                </tr>
              </thead>
              <tbody>
                {this.renderTableRows()}             
              </tbody>

            </table>
          ) : (
            <div>
              No users.
          </div>
          )
      }
}
const Table = withRouter(Table1);
export default Table;