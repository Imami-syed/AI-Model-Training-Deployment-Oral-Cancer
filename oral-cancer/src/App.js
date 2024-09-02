import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    setPrediction(null); // Reset prediction when a new image is selected
  };
  const handlePrediction = async () => {
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
  
      const response = await axios.post('http://127.0.0.1:8000/predict/', formData);
  
      // console.log('Server Response:', response.data);
      console.log('Server Response:', response.data);
  
      if (response.data && response.data.prediction) {
        setPrediction(response.data.prediction);
      } else {
        setPrediction('Error: Unexpected response from the server.');
      }
    } catch (error) {
      console.error('Error:', error);
  
      if (error.response && error.response.data && error.response.data.detail) {
        setPrediction(`Error: ${error.response.data.detail}`);
      } else {
        setPrediction('Error: An unexpected error occurred.');
      }
    }
  };
    
  

  return (
    <div className="wrapper">
      <h1>Image Classification App</h1>
      <p className='para'>Upload an image, and we'll predict its class.<br /></p>
      <p className='small_para'>Choose an image...</p>
      <input type="file" accept="image/*" className="predict" onChange={handleImageUpload} /><br /><br />
      {selectedImage && (
        <img
          src={URL.createObjectURL(selectedImage)}
          alt="Selected"
          style={{ maxWidth: '750px', maxHeight: '750px', width: '100%', height: 'auto' }}
        />
      )}
      {selectedImage && <button className="predict" onClick={handlePrediction}>Predict</button>}
      {prediction !== null && (
  <p className='translucent-paragraph'>Prediction: {prediction}</p>
)} 
      <p className='para'>Instructions:</p>
      <p className='small_para'>
        <span className="instructions-list">1.</span> Upload an image (in JPG, PNG, or JPEG format) using the 'Choose an image...' button.<br />
        <span className="instructions-list">2.</span> Click the 'Predict' button to classify the image into one of the predefined classes.<br />
        <span className="instructions-list">3.</span> The predicted class will be displayed on the screen.
      </p>
      <p className='para'>About This Model:</p>
      <p className='small_para'>This model was trained to classify images into specific categories.</p>
      <p className="small_para">For more details about the model and the categories, please visit our [model documentation].</p>
      <p className="small_para">Contact us at yash.agarwal@research.iiit.ac.in or syed.i@research.iiit.ac.in</p>
      <p className="small_para">© 2023 Data Foundation system..</p>
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    </div>
  );
}

export default App;
