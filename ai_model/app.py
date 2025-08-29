# ai_service/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
CORS(app) # Enable CORS for communication with your Node.js backend

# --- Model Loading ---
MODEL_PATH = os.path.join(BASE_DIR, 'model.pkl') # Path to your saved model file
model = None
symptoms_list = []
diseases_map = {}
label_encoder = None
mlb = None # Add MultiLabelBinarizer instance

try:
    # Load the pre-trained model and mappings
    model_data = joblib.load(MODEL_PATH)
    model = model_data['model']
    symptoms_list = model_data['symptoms_list']
    diseases_map = model_data['diseases_map']
    label_encoder = model_data['label_encoder'] # Load the label encoder
    mlb = model_data['mlb'] # Load the MultiLabelBinarizer
    print(f"AI Model loaded successfully from {MODEL_PATH}")
    print(f"Understands {len(symptoms_list)} symptoms: {symptoms_list[:5]}... (first 5)")
    print(f"Can predict {len(diseases_map)} diseases: {diseases_map}")
except FileNotFoundError:
    print(f"Error: Model file not found at {MODEL_PATH}.")
    print("Please run 'python generate_model.py' in the 'ai_service' directory to create the model.")
    model = None # Ensure model is None if loading fails
except Exception as e:
    print(f"Error loading model: {e}")
    model = None # Ensure model is None if loading fails

def preprocess_symptoms_for_prediction(raw_symptoms_array):
    """
    Converts a list of raw symptom strings (from frontend) into a numerical feature vector
    using the loaded MultiLabelBinarizer.
    This function now handles spaces in symptom names by replacing them with underscores.
    """
    if mlb is None:
        raise ValueError("MultiLabelBinarizer not loaded. Cannot preprocess symptoms.")

    # Clean and normalize incoming symptoms
    processed_input_symptoms = []
    for symptom_input in raw_symptoms_array:
        # Convert to lowercase, strip whitespace, and REPLACE SPACES WITH UNDERSCORES
        # This is the key change to handle "skin rash" -> "skin_rash"
        cleaned_symptom = symptom_input.strip().lower().replace(' ', '_')
        if cleaned_symptom: # Only add if not empty after cleaning
            processed_input_symptoms.append(cleaned_symptom)

    # MultiLabelBinarizer expects a list of lists, where each inner list is a set of labels for one sample.
    # Since we're processing one user input (one sample), it's [[symptom1, symptom2, ...]]
    feature_vector = mlb.transform([processed_input_symptoms])
    
    return feature_vector[0] # Return the 1D array of features for the single sample

@app.route('/predict', methods=['POST'])
def predict():
    """
    Handles disease prediction requests.
    Expects a JSON payload with a 'symptoms' key, which is an array of strings.
    """
    if model is None:
        return jsonify({"success": False, "error": "AI model is not loaded. Cannot make predictions."}), 500

    try:
        data = request.get_json(force=True)
        raw_symptoms_from_frontend = data.get('symptoms') # This is expected to be an array of strings

        if not raw_symptoms_from_frontend or not isinstance(raw_symptoms_from_frontend, list) or len(raw_symptoms_from_frontend) == 0:
            return jsonify({"success": False, "error": "Invalid input: 'symptoms' must be a non-empty array of strings."}), 400

        # Preprocess the input symptoms into the feature vector using the loaded MLB
        input_features_vector = preprocess_symptoms_for_prediction(raw_symptoms_from_frontend)

        # The model expects a 2D array, even for a single sample
        input_for_model = np.array(input_features_vector).reshape(1, -1)

        # Make prediction using the loaded model
        prediction_index = model.predict(input_for_model)[0]

        # Map the numerical prediction back to a human-readable disease name
        predicted_disease = diseases_map.get(prediction_index, "Unknown Disease (Model could not classify)")

        return jsonify({
            "success": True,
            "message": "Disease prediction successful",
            "prediction": predicted_disease
        })

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({"success": False, "error": f"An internal error occurred during prediction: {str(e)}"}), 500

@app.route('/symptoms', methods=['GET'])
def get_symptoms():
    """
    Returns the list of symptoms the AI model is trained on.
    """
    if not symptoms_list:
        return jsonify({"success": False, "error": "Symptoms list is not available."}), 500
    
    # Replace underscores with spaces for better readability in the frontend
    readable_symptoms = [symptom.replace('_', ' ').title() for symptom in symptoms_list]

    return jsonify({
        "success": True,
        "symptoms": readable_symptoms
    })

@app.route('/', methods=["GET"])
def index():
    return "API is running"

if __name__ == '__main__':
    # Ensure the port here matches the AI_MODEL_SERVICE_URL in your Node.js backend's .env
    app.run(debug=True, port=5001)
