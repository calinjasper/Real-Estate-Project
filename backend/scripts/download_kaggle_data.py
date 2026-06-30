import kagglehub
import pandas as pd
import os

# Download the dataset
print("Downloading Kaggle dataset...")
path = kagglehub.dataset_download("subhiarjaria09/real-estate-property-transactions-dataset")
print(f"Dataset downloaded to: {path}")

# List all files in the dataset directory
print("Files in dataset directory:")
for file in os.listdir(path):
    print(f"  - {file}")

# Let's see what files we have
print("\nChecking dataset structure...")
data_files = [f for f in os.listdir(path) if f.endswith('.csv')]

# Load the data
df = None
if data_files:
    for data_file in data_files:
        csv_path = os.path.join(path, data_file)
        print(f"\nLoading {data_file}...")
        df = pd.read_csv(csv_path)
        print("First 10 rows:")
        print(df.head(10))
        print("\nData columns:")
        print(df.columns.tolist())
        print("\nData info:")
        df.info()
        break

if df is not None:
    # Save to our backend data directory
    output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'properties.csv')
    df.to_csv(output_path, index=False)
    print(f"\nData saved to: {output_path}")
