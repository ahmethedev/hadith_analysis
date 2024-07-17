import React from 'react';
import HadithByTribeChart from '../components/charts/HadithByTribeChart';
import ChartContainer from '../components/common/ChartContainer';
import HadithByBookChart from '../components/charts/HadithByBookChart';
import HadithByMusannifChart from '../components/charts/HadithByMusannifChart';
import HadithByRaviReliabilityChart from '../components/charts/HadithByRaviReliabilityChart';
import HadithByRaviNisbesiChart from '../components/charts/HadithByRaviNisbesiChart';
import HadithByPlacesMap from '../components/charts/HadithByPlacesMap';
import HadithByTime from '../components/charts/HadithByTime';




const Dashboard = () => (
  <div className="dashboard">
    <div className="chart-row">
      <ChartContainer title="Hadiths by Tribe">
        <HadithByTribeChart />
      </ChartContainer>
      <ChartContainer title="Hadiths by Book">
        <HadithByBookChart />
      </ChartContainer>
    </div>
    <div className="chart-row">
      <ChartContainer title="Hadiths by Musannif">
        <HadithByMusannifChart />
      </ChartContainer>
      <ChartContainer title="Hadiths by Reliability">
        <HadithByRaviReliabilityChart />
      </ChartContainer>
    </div>
    <div className="chart-row">
      <ChartContainer title="Hadiths by Places">
        <HadithByPlacesMap />
      </ChartContainer>

    </div>
    <div className="chart-row">
      <ChartContainer title="Hadiths by Time">
        <HadithByTime />
      </ChartContainer>

    </div>
  </div>
);

export default Dashboard;