import React, { useState } from "react";
import { useHistory } from "react-router";

const SeatsButtons = (props) => {
    const seats = props.seats;
    const [buttonClass, setButtonClass] = useState(props.buttonClass);
    const history = useHistory();
    const forceUpdate = React.useReducer(bool => !bool)[1];

    const changeStyle = (id) => {
        let tempButtonClass = buttonClass;
        if(buttonClass[id] === "seat"){
            tempButtonClass[id] = "selected";
            setButtonClass(buttonClass);
        }
        else if(buttonClass[id] === "selected"){
            tempButtonClass[id] = "seat";
            setButtonClass(tempButtonClass);
        }

        forceUpdate();
    };

    const renderTableRows = () => {
        let rows = [];
        let columns = [];
        seats.map(e => {
          rows.push(e.row);
          columns.push(e.column);
        });
        let rowSize = Math.max.apply(Math,rows);
        let columnSize = Math.max.apply(Math,columns);
      
        var seatTable = Array.from(Array(rowSize), () => new Array(columnSize));
        seats.map(seat => {
          seatTable[seat.row-1][seat.column-1] = seat;
          
        });

        return seatTable.map(x=>{
          return (<div class="Row">{
            x.map(y =>{
              return(<div class="Cell"><button className={buttonClass[y.seatNumber]} onClick={() => changeStyle(y.seatNumber)}>{y.seatNumber}</button></div>)
            })
          }</div>)
        })
    };

    return (
        <div>
            
        <div className="Table">
            {renderTableRows()}
        </div>
        <div className="Table">
            <div className="Row">
                <div className="Cell">
                    <input type="submit" onClick={() =>props.cancelSubmit()} value="< Anuluj" />
                </div>
                <div className="Cell">
                    <input type="submit" onClick={() =>props.submitSelect(buttonClass)} value="Dalej >" />
                </div>   
            </div>
        </div>
        <table>
            <thead>
                <tr><th colspan="2">Legenda</th></tr>
            </thead>
            <tbody>    
                <tr>
                <td>Miejsca zarezerwowane:</td> <td><button className="reserved">0</button></td>
                </tr>
                <tr>
                <td>Miejsca wybrane:</td> <td><button className="selected">0</button></td>
                </tr>
                <tr>
                <td>Miejsca wolne:</td> <td><button className="seat">0</button></td>
                </tr>
            </tbody>                  
        </table>

        </div>

    );
}

export default SeatsButtons;