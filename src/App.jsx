import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import Footer from './components/Footer';
import Navigation from './components/Navbar';

const App = () => {
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [ctx, setCtx] = useState(null);
  const [predictedNumber, setPredictedNumber] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await tf.loadLayersModel('models/model.json');
      setModel(loadedModel);
    };

    loadModel();

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = 'rgb(50, 50, 50)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    setCtx(context);
  }, []);

  const getTouchPos = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = event.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    return { x, y };
  };

  const draw = (event) => {
    if (!ctx) return;
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'white';

    const rect = canvasRef.current.getBoundingClientRect();
    let x, y;

    if (event.type === 'mousemove') {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    } else if (event.type === 'touchmove') {
      const touchPos = getTouchPos(event);
      x = touchPos.x;
      y = touchPos.y;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const startDrawing = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    let x, y;

    if (event.type === 'mousedown') {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    } else if (event.type === 'touchstart') {
      const touchPos = getTouchPos(event);
      x = touchPos.x;
      y = touchPos.y;
    }

    ctx.moveTo(x, y);
    ctx.beginPath();

    if (event.type === 'mousedown') {
      canvasRef.current.addEventListener('mousemove', draw);
    } else if (event.type === 'touchstart') {
      canvasRef.current.addEventListener('touchmove', draw);
    }
  };

  const stopDrawing = () => {
    canvasRef.current.removeEventListener('mousemove', draw);
    canvasRef.current.removeEventListener('touchmove', draw);
    ctx.closePath();
  };

  const clearCanvas = () => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = 'rgb(50, 50, 50)';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setPredictedNumber(null);
  };

  const predict = async () => {
    if (!model) {
      return(
        <div class="flex items-center justify-center h-screen">
    <div class="relative">
        <div class="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
        <div class="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
        </div>
    </div>
</div>
      )
    }

    const tensor = preProcessCanvas(canvasRef.current);
    const predictions = await model.predict(tensor).data();
    const maxIndex = predictions.indexOf(Math.max(...predictions));

    setPredictedNumber(maxIndex);
  };

  const preProcessCanvas = (canvas) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const tensor = tf.browser
      .fromPixels(imageData)
      .resizeNearestNeighbor([28, 28])
      .mean(2)
      .expandDims(2)
      .expandDims()
      .toFloat();

    return tensor;
  };

  return (
    <div className="flex flex-col items-center">
      <Navigation />
      <h3 className="text-md lg:text-xl font-mono font-bold my-10">
        Prediksi Angka 0 - 9 Machine Learning
      </h3>
      <canvas
        ref={canvasRef}
        height={240}
        width={300}
        className="border rounded-lg bg-gray-700"
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchEnd={stopDrawing}
      />
      <div className="flex justify-between mt-4">
        <button
          onClick={predict}
          className="flex bg-burlywood disabled:opacity-50 disabled:hover:opacity-50 hover:opacity-95 justify-center ring-none rounded-lg shadow-lg font-semibold py-2 px-4 font-dm focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-violet-500 border-b-violet-700 disabled:border-0 disabled:bg-violet-500 disabled:text-white ring-white text-white border-b-4 hover:border-0 active:border-0 hover:text-gray-100 active:bg-violet-800 active:text-gray-300 focus-visible:outline-violet-500 text-sm sm:text-base dark:bg-gray-700 dark:border-gray-700 dark:border-b-gray-900 mx-2"
        >
          Predict
        </button>
        <button
          onClick={clearCanvas}
          className="flex bg-cornflowerblue disabled:opacity-50 disabled:hover:opacity-50 hover:opacity-95 justify-center ring-none rounded-lg shadow-lg font-semibold py-2 px-4 font-dm focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-red-500 border-b-red-700 disabled:border-0 disabled:bg-red-500 disabled:text-white ring-white text-white border-b-4 hover:border-0 active:border-0 hover:text-gray-100 active:bg-red-800 active:text-gray-300 focus-visible:outline-red-500 text-sm sm:text-base dark:bg-gray-700 dark:border-gray-700 dark:border-b-gray-900 mx-2"
        >
          Clear
        </button>
      </div>
      <div className="mt-4 w-72 h-64 flex items-center justify-center border rounded-lg bg-blue-300 mb-20">
        <h2 className="text-6xl font-bold text-white">
          {predictedNumber !== null ? predictedNumber : "N/A"}
        </h2>
      </div>
      <Footer />
    </div>
  );
};

export default App;
