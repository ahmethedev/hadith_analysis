import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bubble } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const HadithByRaviNisbesiChart = () => {
  const [chartData, setChartData] = useState({
    datasets: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5031/api/Ravis/hadith-by-ravi-nisbesi');
        const data = response.data;

        const totalHadiths = data.reduce((sum, item) => sum + item.hadithCount, 0);

        const datasets = data.map((item, index) => ({
          label: item.nisbesi,
          data: [{
            x: index,
            y: item.hadithCount,
            r: (item.hadithCount / totalHadiths) * 50 // Bubble size based on percentage
          }],
          backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`,
        }));

        setChartData({ datasets });
      } catch (error) {
        console.error('Error fetching hadith by ravi nisbesi data:', error);
      } finally {
        setIsLoading(false);
      }
      
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Hadiths by Ravi Nisbesi',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const count = context.parsed.y;
            const percentage = (context.raw.r / 50 * 100).toFixed(2);
            return `${label}: ${count} hadiths (${percentage}% of total)`;
          }
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Nisbesi Index'
        },
        ticks: {
          display: false // Hide x-axis labels
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Hadiths'
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return <Bubble data={chartData} options={options} />;
};

export default HadithByRaviNisbesiChart;