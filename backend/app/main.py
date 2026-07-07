from fastapi import FastAPI



from app.schemas import MatchRequest
from app.model_loader import model, team_encoder, target_encoder
from app.feature_engineering import create_feature_vector

app = FastAPI()


@app.get("/")
def home():
    return {
        "message": "World Cup AI Backend is Running!"
    }


@app.get("/health")
def health():
    return {
        "model_loaded": model is not None,
        "teams": len(team_encoder.classes_),
        "classes": list(target_encoder.classes_)
    }


@app.post("/predict")
def predict(match: MatchRequest):

    features = create_feature_vector(
        home=match.home_team,
        away=match.away_team,
        neutral=match.neutral,
        tournament=match.tournament
    )

    # Encode team names
    features["home_team"] = team_encoder.transform(features["home_team"])
    features["away_team"] = team_encoder.transform(features["away_team"])

    # Predict
    prediction = model.predict(features)[0]

    probabilities = model.predict_proba(features)[0]

    result = target_encoder.inverse_transform([prediction])[0]

    class_names = target_encoder.classes_

    prob_dict = {}

    for cls, prob in zip(class_names, probabilities):
        prob_dict[cls] = round(float(prob), 3)

    return {
        "prediction": result,
        "confidence": round(float(max(probabilities)), 3),
        "probabilities": prob_dict
    }