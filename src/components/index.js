import Table from '../table/table';
import React, {useState} from 'react';

const axios = require('axios');

const Home = () => {

  return (
    <div>
      <h1>Strona Główna</h1>
      <br /><br />
      <Table />

    </div>
  );
};

export default Home;