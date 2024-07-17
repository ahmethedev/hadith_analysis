import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HadithByBookChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5031/api/Hadiths/hadith-by-book');
        const data = response.data;

        setChartData({
          labels: data.map(item => item.book),
          datasets: [{
            label: 'Number of Hadiths',
            data: data.map(item => item.hadithCount),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }],
        });
      } catch (error) {
        console.error('Error fetching hadith by book data:', error);
      }
    };

    fetchData();
  }, []);

  const options = {
    indexAxis: 'y', // This makes the bars horizontal
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Hadiths by Book',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Number of Hadiths'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Book'
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default HadithByBookChart;