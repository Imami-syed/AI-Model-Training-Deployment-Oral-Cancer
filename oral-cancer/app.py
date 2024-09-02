from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from fastapi.responses import JSONResponse
import shutil
import cv2
import numpy as np
from pathlib import Path
from tensorflow.keras.models import load_model  # Import load_model from TensorFlow

app = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:3000",  # Add the exact origin of your React app
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Specify the path to your trained model
model_path = '../t3_5_epoch.h5'

# Load the model
model = load_model(model_path)

train_ds = ['all_benign', 'all_early', 'all_pre', 'all_pro', 'brain_glioma', 'brain_menin', 'brain_tumor',
            'breast_benign', 'breast_malignant', 'cervix_dyk', 'cervix_koc', 'cervix_mep', 'cervix_pab', 'cervix_sfi',
            'colon_aca', 'colon_bnt', 'kidney_normal', 'kidney_tumor', 'lung_aca', 'lung_bnt', 'lung_scc', 'lymph_cll',
            'lymph_fl', 'lymph_mcl', 'oral_normal', 'oral_scc']
def find_max(arr):
    maxi = max(arr)
    for i in range(len(arr)):
        if arr[i] == maxi:
            return i
def predict_image_class(img_path):
    try:
        img = cv2.imread(img_path)
        if img is None:
            raise ValueError(f"Unable to read image: {img_path}")

        img = cv2.resize(img, (224, 224))
        img = np.reshape(img, [1, 224, 224, 3])
        classes = model.predict(img)
        max_ind = find_max(classes[0])
        return train_ds[max_ind]

    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        raise
@app.post("/predict/")

async def create_upload_file(file: UploadFile = File(...)):
    try:
        # Save the uploaded file
        with open(file.filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Make a prediction
        print(f"Predicting image: {file.filename}")
        predicted_class = predict_image_class(file.filename)
        print(f"Prediction result: {predicted_class}")

        # Return the prediction result
        return JSONResponse(content={"prediction": predicted_class})

    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found.")
    # except Exception as e:
    #     print(f"Error during prediction: {str(e)}")
    #     raise HTTPException(status_code=500, detail="An unexpected error occurred.")
    finally:
        # Remove the uploaded file after prediction
        Path(file.filename).unlink()
