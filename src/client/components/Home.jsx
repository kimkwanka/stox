import React from 'react';
import Helmet from 'react-helmet';

import Stocks from './Stocks';

const Home = () => (
  <div className="container margin-top-small">
    <Helmet title="Stox" />
    <Stocks />
  </div>
);

export default Home;
