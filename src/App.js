import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import Plot from 'react-plotly.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

function App() {
  const [showActualData, setShowActualData] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [data, setData] = useState([{ x: 1, y: 2 }, { x: 2, y: 3 }, { x: 1, y: 4 }]);
  const [line, setLine] = useState({ m: 1, b: 0 });

  const handleRandomize = () => {
    const newM = Math.random() * 2 - 1; // Random -1  1 , SLOPE
    const newB = Math.random() * 10 - 5; // Random -5 and 5 UINTERCEPT
    setLine({ m: newM, b: newB });
    setShowActualData(false);
    setShowStats(false);
  };

  const handleCheckboxChange = (type) => {
    if (data.length === 0) {
      toast.error('You must have data to enable this!');
      return;
    }
    if (type === 'data') {
      setShowActualData(!showActualData);
    } else if (type === 'stats') {
      setShowStats(!showStats);
    }
  };

  const calculateStats = () => {
    if (data.length === 0) return { rSquared: 0, ssResidual: 0 };

    const meanY = data.reduce((sum, point) => sum + point.y, 0) / data.length;
    const ssTotal = data.reduce((sum, point) => sum + Math.pow(point.y - meanY, 2), 0);
    const ssResidual = data.reduce((sum, point) => {
      const predictedY = line.m * point.x + line.b;
      return sum + Math.pow(point.y - predictedY, 2);
    }, 0);
    const rSquared = 1 - ssResidual / ssTotal;

    return { rSquared, ssResidual };
  };

  const { rSquared, ssResidual } = showStats ? calculateStats() : {};

  const scatterData = {
    datasets: [
      {
        label: 'User Data',
        data: showActualData ? data : [],
        backgroundColor: 'rgba(75, 192, 192, 1)',
        type: 'scatter',
        pointRadius: 6,

      },
      {
        label: 'Regression Line',
        data: Array.from({ length: 10 }, (_, i) => ({
          x: i,
          y: line.m * i + line.b,
        })),
        type: 'line',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
      },
    ],
  };



  const handleUpdateModelLocally = () => {


  };

  const handlePushModelToServer = () => {

  };

  const [client1Points, setClient1Points] = useState([]);
  const handleClient1Plot = (event) => {
    const { clientX, clientY } = event;
    setClient1Points([...client1Points, { x: clientX, y: clientY }]);
  };
  const [client2Points, setClient2Points] = useState([]);
  const handleClient2Plot = (event) => {
    const { clientX, clientY } = event;
    setClient2Points([...client2Points, { x: clientX, y: clientY }]);
  };
  const [client3Points, setClient3Points] = useState([]);
  const handleClient3Plot = (event) => {
    const { clientX, clientY } = event;
    setClient3Points([...client3Points, { x: clientX, y: clientY }]);
  };


  const options = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
      },
    },
  };

  return (
    <div className='flex flex-col p-10'>
      <h1 className="text-2xl font-bold mb-4">Federated Learning Demo</h1>

      <div className="border p-4 bg-slate-300">
        <h2 className="text-xl font-bold mb-4"> Centeral Server Model </h2>

        <div className="flex justify-between mb-2">
          <span>Current Model: y = {line.m.toFixed(2)}x + {line.b.toFixed(2)}</span>
          <button onClick={handleRandomize} className="bg-blue-500 text-white px-2 py-1 rounded">Randomize Model</button>
        </div>
        <Line data={scatterData} options={options} />
        <div className="flex mt-4 p-4 bg-blue-500">
          <div className="mr-4">
            <input
              type="checkbox"
              id="showActualData"
              checked={showActualData}
              onChange={() => handleCheckboxChange('data')}
              title="In actual federated learning, this data is private and never goes to a central server, so this option is purely for demonstration purpose"
            />
            <label htmlFor="showActualData" className="ml-2">Show actual data</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="showStats"
              checked={showStats}
              onChange={() => handleCheckboxChange('stats')}
              title="In actual federated learning, this data is private and never goes to a central server, so this option is purely for demonstration purpose"
            />
            <label htmlFor="showStats" className="ml-2">Show stats</label>
          </div>
        </div>
        {showStats && (
          <div className="mt-4">
            <div>R-squared: {rSquared.toFixed(2)}</div>
            <div>Sum of squared residuals: {ssResidual.toFixed(2)}</div>
          </div>
        )}
      </div>















      <div className="grid grid-cols-3 mt-4">


        <div className='border-2 p-4'>

          <h2 className="text-xl font-bold mb-4">Client 1</h2>

          <button onClick={() => handleUpdateModelLocally()} className="bg-yellow-500 text-white px-4 py-2 rounded mt-4">Update Model Locally</button>
          <button onClick={() => handlePushModelToServer()} className="bg-red-500 text-white px-4 py-2 rounded mt-2">Push Model to Server</button>
        </div>






        <div className='border-2 p-4'>

          <h2 className="text-xl font-bold mb-4">Client 2</h2>

          <button onClick={() => handleUpdateModelLocally()} className="bg-yellow-500 text-white px-4 py-2 rounded mt-4">Update Model Locally</button>
          <button onClick={() => handlePushModelToServer()} className="bg-red-500 text-white px-4 py-2 rounded mt-2">Push Model to Server</button>
        </div>





        <div className='border-2 p-4'>

          <h2 className="text-xl font-bold mb-4">Client 3</h2>

          <button onClick={() => handleUpdateModelLocally()} className="bg-yellow-500 text-white px-4 py-2 rounded mt-4">Update Model Locally</button>
          <button onClick={() => handlePushModelToServer()} className="bg-red-500 text-white px-4 py-2 rounded mt-2">Push Model to Server</button>
        </div>

      </div>

      <ToastContainer />
    </div>
  );
}

export default App;
