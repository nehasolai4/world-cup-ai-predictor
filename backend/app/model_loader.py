import joblib
from pathlib import Path

# Go from backend/app → project root
BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = BASE_DIR / "models" / "world_cup_predictor.pkl"
TEAM_ENCODER_PATH = BASE_DIR / "models" / "team_encoder.pkl"
TARGET_ENCODER_PATH = BASE_DIR / "models" / "target_encoder.pkl"

model = joblib.load(MODEL_PATH)
team_encoder = joblib.load(TEAM_ENCODER_PATH)
target_encoder = joblib.load(TARGET_ENCODER_PATH)