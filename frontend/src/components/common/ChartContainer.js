// ChartContainer.jsx
import React from 'react';
import PropTypes from 'prop-types';

const ChartContainer = ({ title, children }) => (
  <div className="chart-container">
    <h2>{title}</h2>
    {children}
  </div>
);

ChartContainer.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ChartContainer;