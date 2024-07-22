// ChartContainer.jsx
import React from 'react';
import PropTypes from 'prop-types';

const ChartContainer = ({ id, title, children }) => (
  <div id={id} className="chart-container">
    <h2>{title}</h2>
    {children}
  </div>
);

ChartContainer.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ChartContainer;