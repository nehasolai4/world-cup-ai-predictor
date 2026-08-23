# ⚽ WorldCup AI — FIFA Match Predictor

A machine learning system that predicts the outcome of a football match — **Home Win**, **Draw**, or **Away Win** — based on historical team performance, venue, and tournament context.

Predictions come from a trained **Random Forest Classifier** served through a **FastAPI** backend and consumed by a **React** frontend. The frontend does not calculate anything on its own; every prediction is the output of the actual model.

```

React (Vite)  ──POST /predict──▶  FastAPI  ──▶  Feature Engineering  ──▶  Random Forest  ──▶  Prediction + Probabilities
                                                    ↑
                                          Team Encoding / clean_matches.csv

```

---

## Features

**Machine Learning**
- Historical match data → engineered features (win rate, avg. goals for/against, goal difference, recent form)
- Neutral-venue flag and tournament-importance weighting
- Team name encoding
- Multi-class outcome classification

**Backend (FastAPI)**
- `/health`, `/teams`, `/predict` endpoints
- Pydantic request validation
- CORS configured for the frontend origin
- Model loaded from serialized `.pkl` files

**Frontend (React)**
- Team selection dropdowns populated live from `/teams`
- Tournament and neutral-venue inputs
- Prediction, confidence, and full probability breakdown
- Football-themed, animated, responsive UI

---

## Model

**Type:** Random Forest Classifier
**Task:** Multi-class classification — `Home Win` / `Draw` / `Away Win`

| Artifact | Path |
|---|---|
| Trained model | `models/world_cup_predictor.pkl` |
| Team encoder | `models/team_encoder.pkl` |
| Target encoder | `models/target_encoder.pkl` |

### Features used

| Feature | Description |
|---|---|
| `home_team` / `away_team` | Encoded team identity |
| `neutral` | Whether the match is at a neutral venue |
| `tournament_importance` | Numerical weight assigned to the tournament |
| `home_matches` / `away_matches` | Historical matches played |
| `home_win_rate` / `away_win_rate` | Historical win rate |
| `home_avg_goals` / `away_avg_goals` | Average goals scored |
| `home_avg_goals_conceded` / `away_avg_goals_conceded` | Average goals conceded |
| `home_recent_form` / `away_recent_form` | Form over the last 5 matches |
| `home_goal_diff` / `away_goal_diff` | Historical goal difference |

---

## Performance

**Accuracy: 54.74%**

This is an honest, modest number — not a claim of professional-grade forecasting. Football outcomes, and draws in particular, are hard to predict from historical stats alone.

```

precision    recall  f1-score   support

Away Win       0.54      0.47      0.50      2872
Draw       0.27      0.10      0.14      2305
Home Win       0.59      0.81      0.68      4714

accuracy                           0.55      9891

```

**Confusion matrix**

```

Predicted →      Away  Draw  Home
Actual Away      1357   293  1222
Actual Draw       584   226  1495
Actual Home       570   313  3831

```

**Top features by importance**

| Feature | Importance |
|---|---:|
| `home_goal_diff` | 0.0833 |
| `away_win_rate` | 0.0827 |
| `away_goal_diff` | 0.0818 |
| `home_win_rate` | 0.0807 |
| `home_avg_goals_conceded` | 0.0780 |
| `away_avg_goals_conceded` | 0.0780 |
| `away_matches` | 0.0762 |
| `home_matches` | 0.0719 |

The model leans heavily on historical goal difference, win rate, and defensive record. It's strong at spotting Home Wins (81% recall) and weak at spotting Draws (10% recall) — draws are consistently the hardest class in football prediction.

---

## Project structure

```

WORLDCUP-AI/
├── backend/
│   └── app/
│       ├── main.py
│       ├── schemas.py
│       ├── model_loader.py
│       └── feature_engineering.py
├── data/
│   ├── processed/clean_matches.csv
│   └── raw/
│       ├── former_names.csv
│       ├── goalscorers.csv
│       ├── results.csv
│       └── shootouts.csv
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
├── models/
│   ├── target_encoder.pkl
│   ├── team_encoder.pkl
│   └── world_cup_predictor.pkl
├── notebooks/
│   ├── 01_data_understanding.ipynb
│   └── test.ipynb
├── requirements.txt
└── README.md

```

---

## API

Interactive docs available at `http://127.0.0.1:8000/docs` once the backend is running.

### `GET /health`
```json
{ "model_loaded": true, "teams": 200, "classes": ["Away Win", "Draw", "Home Win"] }
```

### `GET /teams`

```json
["Argentina", "Australia", "Belgium", "Brazil", "France"]
```

### `POST /predict`

Request:

```json
{
  "home_team": "Brazil",
  "away_team": "Argentina",
  "neutral": true,
  "tournament": "FIFA World Cup"
}
```

Response:

```json
{
  "prediction": "Away Win",
  "confidence": 0.583,
  "probabilities": {
    "Away Win": 0.583,
    "Draw": 0.142,
    "Home Win": 0.275
  }
}
```

The frontend maps `confidence` to a simple label for display only — it never alters the model's actual output:

| Confidence | Label |
|---:|---|
| ≥ 55% | High Confidence |
| 40–54% | Lean |
| < 40% | Coin Flip |

---

## Setup

### 1. Clone

```bash
git clone https://github.com/nehasolai4/world-cup-ai-predictor.git
cd world-cup-ai-predictor
```

### 2. Backend

```bash
python -m venv venv
.\venv\Scripts\Activate.ps1      # Windows
pip install -r requirements.txt

uvicorn backend.app.main:app --reload
```

Backend runs at `http://127.0.0.1:8000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

### CORS

The frontend and backend run on different ports in development, so FastAPI needs to explicitly allow the frontend's origin:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Limitations

- **Draws are hard to call** — 10% recall on the Draw class
- **Historical stats only** — no injuries, lineups, suspensions, tactics, weather, or travel fatigue
- **No live data** — the model doesn't pull current form or ratings automatically
- **Probability ≠ certainty** — a 58% Home Win estimate is a learned pattern, not a guarantee

---

## Roadmap

- **Modeling:** try XGBoost / LightGBM / Gradient Boosting, hyperparameter tuning, cross-validation, class balancing for draws, probability calibration
- **Features:** FIFA/Elo ratings, head-to-head history, recent 5–10 match form, tournament stage, xG, injuries
- **Backend:** deployment, request logging, error handling, model versioning, automated tests, Docker
- **Frontend:** prediction history, team stat charts, head-to-head comparison, deployed API integration

---

## Tech stack

| Layer | Tools |
|---|---|
| ML | Python, Pandas, NumPy, Scikit-learn, Joblib |
| Backend | FastAPI, Uvicorn, Pydantic |
| Frontend | React, Vite, Axios, React Select, Tailwind CSS |

---

## Status

- [x] Data preprocessing & feature engineering
- [x] Model training, evaluation, serialization
- [x] FastAPI backend (`/health`, `/teams`, `/predict`)
- [x] React frontend wired to live predictions
- [ ] Public deployment
- [ ] Live football data
- [ ] Automated testing

---

## Author

**Neha S** — [github.com/nehasolai4](https://github.com/nehasolai4)
