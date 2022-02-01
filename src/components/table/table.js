import React from 'react';
import "./table.css";
import dateFormat from "dateformat";
import { withRouter } from "react-router-dom";

const apiPath = "http://localhost:8080/api";

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
        const response = await fetch(apiPath+'/screenings')
        const response2 = await fetch(apiPath+'/image/get')
        if (response.ok && response2.ok) {
          const screenings = await response.json()
          const image = await response2.json()

          this.setState({ screenings, image, isLoading: false })
        } else {
          this.setState({ isError: true, isLoading: false })
        }

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
          return <div>Loading...</div>
        }
    
        if (isError) {
          return <div>Error</div>
        }
    
        return users.length > 0
          ? (
            <table>
              <thead>
                <tr>
                  <th>Plakat</th>
                  <th>Tytuł filmu</th>
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