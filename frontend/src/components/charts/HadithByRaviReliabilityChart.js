import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const HadithByRaviReliabilityChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5031/api/Ravis/hadith-by-ravi-reliability');
        const data = response.data;

        const backgroundColors = data.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`);
        const borderColors = data.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`);

        setChartData({
          labels: data.map(item => item.reliability),
          datasets: [{
            label: 'Number of Hadiths',
            data: data.map(item => item.hadithCount),
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          }],
        });
      } catch (error) {
        console.error('Error fetching hadith by ravi reliability data:', error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Hadiths by Ravi Reliability',
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return <Pie data={chartData} options={options} />;
};

export default HadithByRaviReliabilityChart;
