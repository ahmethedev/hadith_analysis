import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const HadithByTime = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5031/api/Ravis/hadiths-timeline');
        const data = response.data;

        setChartData({
          labels: data.map(item => item.year),
          datasets: [{
            label: 'Number of Hadiths',
            data: data.map(item => item.hadithCount),
            fill: false,
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.1
          }]
        });
      } catch (error) {
        console.error('Error fetching timeline data:', error);
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
        text: 'Hadiths Timeline by First Ravi Death Year'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Number of Hadiths'
        },
        beginAtZero: true
      }
    }
  };

  return <Line data={chartData} options={options} />;
};

export default HadithByTime;
