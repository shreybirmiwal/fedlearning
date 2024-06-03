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
  const [client1Points, setClient1Points] = useState([]);
  const [client2Points, setClient2Points] = useState([]);
  const [client3Points, setClient3Points] = useState([]);


  const [client1M, setClient1M] = useState(0);
  const [client1B, setClient1B] = useState(0);
  const [client2M, setClient2M] = useState(0);
  const [client2B, setClient2B] = useState(0);
  const [client3M, setClient3M] = useState(0);
  const [client3B, setClient3B] = useState(0);


  const handleRandomize = () => {
    const newM = Math.random() * 2 - 1; // Random slope between -1 and 1
    const newB = Math.random() * 10 - 5; // Random intercept between -5 and 5
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

  const handleUpdateModelLocally = (index) => {
    var dataPoints = [];

    if (index == 1) {
      dataPoints = client1Points;
    } else if (index == 2) {
      dataPoints = client2Points;
    }
    else if (index == 3) {
      dataPoints = client3Points;
    }


    var globalSlope = line.m;
    var globalIntercept = line.b;


    //run some backprop
    function getLoss(slope, intercept) {
      let loss = 0;
      for (let i = 0; i < dataPoints.length; i++) {
        const x = dataPoints[i].x;
        const y = dataPoints[i].y;
        const predictedY = slope * x + intercept;
        loss += Math.pow(predictedY - y, 2);
      }
      return loss / dataPoints.length;
    }

    learning_rate = 0.01
    dm_respect_to_loss = (getLoss(globalSlope + 0.01, globalIntercept) - getLoss(globalSlope, globalIntercept)) / 0.01;
    db_respect_to_loss = (getLoss(globalSlope, globalIntercept + 0.01) - getLoss(globalSlope, globalIntercept)) / 0.01;

    var new_m = new_m - dm_respect_to_loss * learning_rate;
    var new_b = new_b - db_respect_to_loss * learning_rate;

    if (index == 1) {
      setClient1M(new_m);
      setClient1B(new_b);
    }
    else if (index == 2) {
      setClient2M(new_m);
      setClient2B(new_b);
    }
    else if (index == 3) {
      setClient3M(new_m);
      setClient3B(new_b);
    }


  };

  const handlePushModelToServer = (index) => {
    // Function to push the client model to the server
  };

  const handleAddPoint = (clientIndex) => {
    const xInput = document.getElementById(`xInput${clientIndex}`).value;
    const yInput = document.getElementById(`yInput${clientIndex}`).value;

    if (isNaN(xInput) || isNaN(yInput)) {
      toast.error('Please enter valid numerical values for x and y.');
      return;
    }

    const newPoint = { x: parseFloat(xInput), y: parseFloat(yInput) };

    setData([...data, newPoint]);

    if (clientIndex === 1) {
      setClient1Points([...client1Points, newPoint]);
    } else if (clientIndex === 2) {
      setClient2Points([...client2Points, newPoint]);
    } else if (clientIndex === 3) {
      setClient3Points([...client3Points, newPoint]);
    }
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
        <h2 className="text-xl font-bold mb-4">Central Server Model</h2>

        <div className="flex justify-between mb-2">
          <span>Current Global Model: y = {line.m.toFixed(2)}x + {line.b.toFixed(2)}</span>
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

      <div className="grid grid-cols-3 mt-4 gap-4">
        <div className='border-2 p-4'>
          <h2 className="text-xl font-bold mb-4">Client 1</h2>
          <span>Current Global Model: y = {line.m.toFixed(2)}x + {line.b.toFixed(2)}</span>

          <Plot
            data={[
              {
                x: client1Points.map((point) => point.x),
                y: client1Points.map((point) => point.y),
                mode: 'markers',
                type: 'scatter',
              },
            ]}
            layout={{
              width: 400,
              height: 400,
              title: 'Client 1 Local Data',
              xaxis: { range: [-10, 10] },
              yaxis: { range: [-10, 10] },
              dragmode: false,
              showlegend: false,
              hovermode: false,
            }}
            config={{ staticPlot: true }}
          />
          <div className="mt-4">
            <input type="text" id="xInput1" placeholder="x value" className="mr-2" />
            <input type="text" id="yInput1" placeholder="y value" className="mr-2" />
            <button onClick={() => handleAddPoint(1)} className="bg-green-500 text-white px-4 py-2 rounded">Add Point</button>
          </div>
          <button onClick={() => handleUpdateModelLocally(1)} className="bg-yellow-500 text-white px-4 py-2 rounded mt-4">Update Model Locally</button>
          <button onClick={() => handlePushModelToServer(1)} className="bg-red-500 text-white px-4 py-2 rounded mt-2">Send local model to Server</button>
        </div>

        <div className='border-2 p-4'>
          <h2 className="text-xl font-bold mb-4">Client 2</h2>
          <span>Current Global Model: y = {line.m.toFixed(2)}x + {line.b.toFixed(2)}</span>

          <Plot
            data={[
              {
                x: client2Points.map((point) => point.x),
                y: client2Points.map((point) => point.y),
                mode: 'markers',
                type: 'scatter',
              },
            ]}
            layout={{
              width: 400,
              height: 400,
              title: 'Client 2 Local Data',
              xaxis: { range: [-10, 10] },
              yaxis: { range: [-10, 10] },
              dragmode: false,
              showlegend: false,
              hovermode: false,
            }}
            config={{ staticPlot: true }}
          />
          <div className="mt-4">
            <input type="text" id="xInput2" placeholder="x value" className="mr-2" />
            <input type="text" id="yInput2" placeholder="y value" className="mr-2" />
            <button onClick={() => handleAddPoint(2)} className="bg-green-500 text-white px-4 py-2 rounded">Add Point</button>
          </div>
          <button onClick={() => handleUpdateModelLocally(2)} className="bg-yellow-500 text-white px-4 py-2 rounded mt-4">Update Model Locally</button>
          <button onClick={() => handlePushModelToServer(2)} className="bg-red-500 text-white px-4 py-2 rounded mt-2">Push Model to Server</button>
        </div>

        <div className='border-2 p-4'>
          <h2 className="text-xl font-bold mb-4">Client 3</h2>
          <span>Current Global Model: y = {line.m.toFixed(2)}x + {line.b.toFixed(2)}</span>

          <Plot
            data={[
              {
                x: client3Points.map((point) => point.x),
                y: client3Points.map((point) => point.y),
                mode: 'markers',
                type: 'scatter',
              },
            ]}
            layout={{
              width: 400,
              height: 400,
              title: 'Client 3 Local Data',
              xaxis: { range: [-10, 10] },
              yaxis: { range: [-10, 10] },
              dragmode: false,
              showlegend: false,
              hovermode: false,
            }}
            config={{ staticPlot: true }}
          />
          <div className="mt-4">
            <input type="text" id="xInput3" placeholder="x value" className="mr-2" />
            <input type="text" id="yInput3" placeholder="y value" className="mr-2" />
            <button onClick={() => handleAddPoint(3)} className="bg-green-500 text-white px-4 py-2 rounded">Add Point</button>
          </div>
          <button onClick={() => handleUpdateModelLocally(3)} className="bg-yellow-500 text-white px-4 py-2 rounded mt-4">Update Model Locally</button>
          <button onClick={() => handlePushModelToServer(3)} className="bg-red-500 text-white px-4 py-2 rounded mt-2">Push Model to Server</button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default App;
