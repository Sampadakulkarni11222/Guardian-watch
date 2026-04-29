import os
import numpy as np
import pandas as pd
from PIL import Image
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import time

def extract_features(image_path):
    """
    Extracts basic features from an image: 
    - Resized pixel values (100x100)
    - Mean and standard deviation of color channels
    """
    try:
        img = Image.open(image_path).convert('RGB')
        img = img.resize((64, 64)) # Smaller size for speed and efficiency
        
        # Convert to numpy array
        img_array = np.array(img)
        
        # Global statistics
        means = np.mean(img_array, axis=(0, 1))
        stds = np.std(img_array, axis=(0, 1))
        
        # Flattened pixel data
        pixels = img_array.flatten() / 255.0 # Normalize
        
        return np.concatenate([means, stds, pixels])
    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        return None

def train_vision_model():
    print("Initializing Guardian-Vision Model Training...")
    
    # Path to images
    image_dir = os.path.join("crime-analytics", "public", "crime_images")
    if not os.path.exists(image_dir):
        print(f"Error: Image directory not found at {image_dir}")
        return

    # Labels for our sample data
    # 001: High Alert, 002: High Alert, 003: Stable
    labels_map = {
        "crime_001.png": 1, # Critical
        "crime_002.png": 1, # Critical
        "crime_003.png": 0  # Stable
    }

    X = []
    y = []

    print("Loading and vectorizing imagery...")
    for filename, label in labels_map.items():
        path = os.path.join(image_dir, filename)
        features = extract_features(path)
        if features is not None:
            # We add some slight noise to create a "larger" training set for the demo
            for i in range(10): # Create 10 variations of each image
                noise = np.random.normal(0, 0.01, features.shape)
                X.append(features + noise)
                y.append(label)
    
    X = np.array(X)
    y = np.array(y)

    print(f"Training dataset size: {len(X)} vectors")
    
    # Train the model
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest Classifier (Optimized for Visual Patterns)...")
    clf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    
    start_time = time.time()
    clf.fit(X_train, y_train)
    end_time = time.time()
    
    accuracy = clf.score(X_test, y_test)
    print(f"Training Complete in {end_time - start_time:.2f}s")
    print(f"Model Accuracy: {accuracy * 100:.2f}%")

    # Save the model
    model_path = "guardian_vision_model.pkl"
    joblib.dump(clf, model_path)
    print(f"Model exported to {model_path}")

if __name__ == "__main__":
    train_vision_model()
