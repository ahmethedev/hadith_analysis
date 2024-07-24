import React, { useState } from 'react';
import HadithByTribeChart from '../components/charts/HadithByTribeChart';
import ChartContainer from '../components/common/ChartContainer';
import HadithByBookChart from '../components/charts/HadithByBookChart';
import HadithByMusannifChart from '../components/charts/HadithByMusannifChart';
import HadithByRaviReliabilityChart from '../components/charts/HadithByRaviReliabilityChart';
import HadithByRaviNisbesiChart from '../components/charts/HadithByRaviNisbesiChart';
import HadithByPlacesMap from '../components/charts/HadithByPlacesMap';
import HadithByTime from '../components/charts/HadithByTime';

const Dashboard = () => {
  const [selectedChart, setSelectedChart] = useState(null);

  const renderChart = () => {
    switch (selectedChart) {
      case 'tribe':
        return (
          <ChartContainer title="Hadiths Grouped By With Its Chain's First Ravi's Tribe ">
            <HadithByTribeChart />
          </ChartContainer>
        );
      case 'book':
        return (
          <ChartContainer title="Hadiths Grouped By Book Which It is written">
            <HadithByBookChart />
          </ChartContainer>
        );
      case 'musannif':
        return (
          <ChartContainer title="Hadiths Grouped By Musannif">
            <HadithByMusannifChart />
          </ChartContainer>
        );
        case 'reliability':
          return (
            <ChartContainer 
              id="reliability-chart"
              title="Hadiths Grouped By Its Chain's First Ravi's Reliability">
              <HadithByRaviReliabilityChart />
            </ChartContainer>
          );
          case 'places':
          return (
            <ChartContainer 
              id="places-chart"
              title="Places marked by Hadiths First Chain's Ravi's Death Places">
              <HadithByPlacesMap />
            </ChartContainer>
          );
      case 'time':
        return (
          <ChartContainer title="Hadiths Grouped by Its Chain's First Ravi's Death Year">
            <HadithByTime />
          </ChartContainer>
        );
      default:
        return <div>Please select a chart to display.</div>;
    }
  };

  return (
    <div className="dashboard">
      <div className="button-row">
        <button className='hover:underline px-4 py-2 text-sm bg-primary-orange rounded-full text-white' onClick={() => setSelectedChart('tribe')}>Hadiths by Tribe</button>
        <button className='hover:underline px-4 py-2 text-sm bg-primary-orange rounded-full text-white' onClick={() => setSelectedChart('book')}>Hadiths by Book</button>
        <button className='hover:underline px-4 py-2 text-sm bg-primary-orange rounded-full text-white' onClick={() => setSelectedChart('musannif')}>Hadiths by Musannif</button>
        <button className='hover:underline px-4 py-2 text-sm bg-primary-orange rounded-full text-white' onClick={() => setSelectedChart('reliability')}>Hadiths by Reliability</button>
        <button className='hover:underline px-4 py-2 text-sm bg-primary-orange rounded-full text-white' onClick={() => setSelectedChart('places')}>Hadiths by Places</button>
        <button className='hover:underline px-4 py-2 text-sm bg-primary-orange rounded-full text-white' onClick={() => setSelectedChart('time')}>Hadiths by Time</button>
      </div>
      <div className="chart-row">
        {renderChart()}
      </div>
    </div>
  );
};

export default Dashboard;
