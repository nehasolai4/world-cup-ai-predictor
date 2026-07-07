from pathlib import Path
import pandas as pd

BASE_DIR = Path(__file__).resolve().parents[2]

df = pd.read_csv(BASE_DIR / "data" / "processed" / "clean_matches.csv")

tournament_importance = {

    "Friendly": 1,

    "FIFA World Cup qualification": 3,
    "UEFA Euro qualification": 3,
    "African Cup of Nations qualification": 3,

    "FIFA World Cup": 5,

    "UEFA Euro": 4,
    "Copa América": 4,
    "AFC Asian Cup": 4,
    "African Cup of Nations": 4,
    "CONCACAF Gold Cup": 4
}

def create_empty_stats():
    return{
        "matches": 0,
        "wins": 0,
        "draws": 0,
        "losses": 0,
        "goals_scored": 0,
        "goals_conceded": 0,
        "recent_results": []
    }

def get_team_stats(team):

    if team not in TEAM_STATS:
        TEAM_STATS[team] = create_empty_stats()
    
    return TEAM_STATS[team]


def update_team_stats(stats,goals_for,goals_against):
    stats["matches"] += 1

    stats["goals_scored"] += goals_for
    stats["goals_conceded"] += goals_against

    if goals_for > goals_against:
        stats["wins"] += 1
        stats["recent_results"].append(3)

    elif goals_for == goals_against:
        stats["draws"] += 1
        stats["recent_results"].append(1)

    else:
        stats["losses"] += 1
        stats["recent_results"].append(0)

    stats["recent_results"] = stats["recent_results"][-5:]

def calculate_recent_form(stats):
    if len(stats["recent_results"]) == 0:
        return 0
    return sum(stats["recent_results"]) / len(stats["recent_results"])


def goal_difference(stats):
    if stats["matches"] == 0:
        return 0
    
    return(stats["goals_scored"] - stats["goals_conceded"]) / stats["matches"]  


TEAM_STATS = {}

for _, row in df.iterrows():

    home = row["home_team"]
    away = row["away_team"]

    home_stats = get_team_stats(home)
    away_stats = get_team_stats(away)

    update_team_stats(home_stats, row["home_score"], row["away_score"])
    update_team_stats(away_stats, row["away_score"], row["home_score"])




def create_feature_vector(home, away, neutral, tournament):
    home_stats = get_team_stats(home)
    away_stats = get_team_stats(away)

    features ={
        "home_team":home,
        "away_team":away,

        "neutral":neutral,
        "tournament_importance": tournament_importance.get(tournament, 2),

        "home_matches": home_stats["matches"],
        "away_matches": away_stats["matches"],

        "home_win_rate": home_stats["wins"] / home_stats["matches"] 
        if home_stats["matches"] > 0 else 0,

        "away_win_rate": away_stats["wins"] / away_stats["matches"]
        if away_stats["matches"] > 0 else 0,

        "home_avg_goals": home_stats["goals_scored"] / home_stats["matches"]
        if home_stats["matches"] > 0 else 0,

        "away_avg_goals": away_stats["goals_scored"] / away_stats["matches"]
        if away_stats["matches"] > 0 else 0,    

        "home_avg_goals_conceded": home_stats["goals_conceded"] / home_stats["matches"]
        if home_stats["matches"] > 0 else 0,

        "away_avg_goals_conceded": away_stats["goals_conceded"] / away_stats["matches"]
        if away_stats["matches"] > 0 else 0,    

        "home_recent_form": calculate_recent_form(home_stats),
        "away_recent_form": calculate_recent_form(away_stats),

        "home_goal_diff": goal_difference(home_stats),
        "away_goal_diff": goal_difference(away_stats)
    }

    return pd.DataFrame([features])