# ai_service/generate_model.py

import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import MultiLabelBinarizer, LabelEncoder
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# --- Configuration ---
DATASET_PATH = os.path.join(BASE_DIR, 'dataset.csv')          # Ensure your dataset is in the same directory
MODEL_OUTPUT_PATH = os.path.join(BASE_DIR, 'model.pkl')
DISEASE_COLUMN_NAME = 'Disease'       # Column that holds disease labels

def generate_model_from_csv():
    """
    Loads the dataset, preprocesses it (one-hot encodes symptoms),
    trains a model, and saves the model and encoders.
    """
    if not os.path.exists(DATASET_PATH):
        print(f"Error: Dataset not found at {DATASET_PATH}")
        return

    print(f"Loading dataset from {DATASET_PATH}...")
    df = pd.read_csv(DATASET_PATH)

    if DISEASE_COLUMN_NAME not in df.columns:
        print(f"Error: '{DISEASE_COLUMN_NAME}' column not found in the dataset.")
        return

    # Identify symptom columns
    symptom_columns = [col for col in df.columns if col != DISEASE_COLUMN_NAME]

    # Step 1: Extract all unique symptoms
    all_symptoms_raw = df[symptom_columns].fillna('').values.tolist()

    unique_symptoms = set()
    for row_symptoms in all_symptoms_raw:
        for symptom_cell in row_symptoms:
            cleaned_symptom = symptom_cell.strip().lower().replace(' ', '_')
            if cleaned_symptom:
                unique_symptoms.add(cleaned_symptom)

    symptoms_list = sorted(list(unique_symptoms))

    if not symptoms_list:
        print("Error: No valid symptoms found in the dataset.")
        return

    # Step 2: Prepare symptom list per patient row
    processed_symptoms_per_row = []
    for _, row in df.iterrows():
        current_row_symptoms = []
        for col in symptom_columns:
            symptom_cell_value = str(row[col]).strip().lower().replace(' ', '_')
            if symptom_cell_value:
                current_row_symptoms.append(symptom_cell_value)
        processed_symptoms_per_row.append(current_row_symptoms)

    # Step 3: One-hot encode symptoms
    mlb = MultiLabelBinarizer(classes=symptoms_list)
    X_encoded = mlb.fit_transform(processed_symptoms_per_row)
    X = pd.DataFrame(X_encoded, columns=mlb.classes_)

    # Step 4: Encode disease labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(df[DISEASE_COLUMN_NAME])
    diseases_map = {i: disease for i, disease in enumerate(label_encoder.classes_)}

    # Step 5: Train the model
    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)
    model = DecisionTreeClassifier(random_state=42)
    model.fit(X_train, y_train)

    accuracy = model.score(X_test, y_test)
    print(f"✅ Model trained successfully. Test set accuracy: {accuracy:.2f}")

    # Step 6: Save everything
    joblib.dump({
        'model': model,
        'symptoms_list': symptoms_list,
        'diseases_map': diseases_map,
        'label_encoder': label_encoder,
        'mlb': mlb
    }, MODEL_OUTPUT_PATH)

    print(f"\n📦 Model and encoders saved to: {MODEL_OUTPUT_PATH}")
    print(f"🩺 Recognized symptoms (example): {symptoms_list[:10]}... ({len(symptoms_list)} total)")
    print(f"🧾 Disease map: {diseases_map}")

if __name__ == "__main__":
    generate_model_from_csv()
