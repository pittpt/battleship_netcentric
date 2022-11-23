import React, { useState } from "react";
import { Image } from "react-bootstrap";
import { MdClose } from 'react-icons/md';
import playerPanelImg1 from '../../assets/img/1.png';
import playerPanelImg2 from '../../assets/img/2.png';
import shipImg1 from '../../assets/img/ship1.png';
import shipImg2 from '../../assets/img/ship2.png';
import shipImg3 from '../../assets/img/ship3.png';
import shipImg4 from '../../assets/img/ship4.png';
import shipImg5 from '../../assets/img/ship5.png';
import discoveredShipImg1 from '../../assets/img/discovered_ship1.png';
import discoveredShipImg2 from '../../assets/img/discovered_ship2.png';
import discoveredShipImg3 from '../../assets/img/discovered_ship3.png';
import discoveredShipImg4 from '../../assets/img/discovered_ship4.png';
import discoveredShipImg5 from '../../assets/img/discovered_ship5.png';
import useAdmin from "../../hooks/useAdmin";
import './style.css';
import Coordinate from "../Display/Board/Coordinate";

const AdminPageComponent = () => {
    const { adminSyncState, reset } = useAdmin();
    return (
        <div className="admin-page-container">
            <p className="user-online">{Object.keys(adminSyncState.clients ?? {})?.length} Users online now</p>
            <button onClick={reset} className='main-button danger'>Reset Game</button>
        </div>
    )
}

export default AdminPageComponent;