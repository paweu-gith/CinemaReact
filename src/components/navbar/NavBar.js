import React, { useState } from "react";
import "./NavBar.css";

const Navbar = (props) => {
    const [style, setStyle] = useState("item");

    const changeStyle = () => {
        if (style === "item"){
            setStyle("item2");
        }else{
            setStyle("item");
        } 
    };
    const adminBoard = () =>{

        if(props.currentUser.roles.some(role => role === "ROLE_ADMIN")){
            return (
                [
                <li className={style}>
                    <a href="/movies">Admin-Filmy</a>
                </li>,
                <li className={style}>
                    <a href="/screenings">Admin-Seanse</a>
                </li>
                ]
            )
        }
    }
    return (
        <div className="NavBar">
            <nav>
                <ul className="menu">
                    <li className={style}>
                        <a href="/">Strona Główna</a>
                    </li>
                    <li className={style}>
                        <a href="/about" >Informacje</a>
                    </li>
                    <li className={style}>
                        <a href="/ordered-tickets">Kupione bilety</a>
                    </li>
                    {
                        props.currentUser ? (
                            [
                             adminBoard() ,
                            <li className={style}>
                                <a href="/" onClick={() => props.handleLogout(true)}>Wyloguj</a>
                            </li>
                            ]
                        ) : (
                            <li className={style}>
                                <a href="/sign-in">Zaloguj</a>
                            </li>
                        )
                    }
                    <li className="toggle" onClick={changeStyle}><span className="bars"></span></li>
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;