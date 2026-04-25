import pandas as pd
import numpy as np
import json
import os
def process_data():
    df = pd.read_csv("crime_dataset_india.csv") 
    severity_map = {
        'HOMICIDE': 10, 'SEXUAL ASSAULT': 9, 'KIDNAPPING': 9, 'FIREARM OFFENSE': 8,
        'ARSON': 8, 'ROBBERY': 7, 'DOMESTIC VIOLENCE': 7, 'ASSAULT': 6,
        'DRUG OFFENSE': 6, 'BURGLARY': 5, 'CYBERCRIME': 5, 'EXTORTION': 5,
        'FRAUD': 4, 'IDENTITY THEFT': 4, 'ILLEGAL POSSESSION': 4, 'VANDALISM': 3,
        'COUNTERFEITING': 3, 'VEHICLE - STOLEN': 3, 'PUBLIC INTOXICATION': 2,
        'TRAFFIC VIOLATION': 2, 'SHOPLIFTING': 1, 'TRAFFIC FATALITY': 5
    }
    df['Severity'] = df['Crime Description'].map(severity_map).fillna(5)

    df['Date of Occurrence'] = pd.to_datetime(df['Date of Occurrence'], errors='coerce')
    df['Year'] = df['Date of Occurrence'].dt.year
    df['Month'] = df['Date of Occurrence'].dt.month
    df['Hour'] = pd.to_datetime(df['Time of Occurrence'], errors='coerce').dt.hour.fillna(12)

    # Clean data
    df = df.dropna(subset=['City', 'Crime Domain', 'Victim Age'])
    df['Case Closed'] = df['Case Closed'].fillna('Unknown')

    # Export a larger sample for frontend filtering (Slicers)

    # We take 5000 rows to keep it snappy but representative
    sample_df = df.sample(min(5000, len(df)), random_state=42)
    incidents = []
    for _, row in sample_df.iterrows():
        incidents.append({
            'city': row['City'],
            'domain': row['Crime Domain'],
            'severity': int(row['Severity']),
            'age': int(row['Victim Age']),
            'hour': int(row['Hour']),
            'year': int(row['Year']) if not pd.isna(row['Year']) else 2023,
            'closed': row['Case Closed'],
            'desc': row['Crime Description']
        })

    # Global unique values for filters
    cities = sorted(df['City'].unique().tolist())
    domains = sorted(df['Crime Domain'].unique().tolist())

    output_data = {
        "incidents": incidents,
        "cities": cities,
        "domains": domains,
        "total_count": len(df)
    }

    output_path = os.path.join("crime-analytics", "src", "data.json")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, "w") as f:
        json.dump(output_data, f, indent=4)

    print(f"Data for Slicers processed and saved to {output_path}")

if __name__ == "__main__":
    process_data()
