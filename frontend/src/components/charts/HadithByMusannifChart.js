import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HadithByMusannifChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5031/api/Hadiths/hadith-by-musannif');
        const data = response.data;

        setChartData({
          labels: data.map(item => item.musannif),
          datasets: [{
            label: 'Number of Hadiths',
            data: data.map(item => item.hadithCount),
            height: '100%',
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          }],
        });
      } catch (error) {
        console.error('Error fetching hadith by musannif data:', error);
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
        text: 'Hadiths by Musannif',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default HadithByMusannifChart;