"""
Smart Traffic Management System for Urban Congestion (South India)
Flask Backend Server & RESTful Simulation Engine
Scope: Telangana, Andhra Pradesh, Karnataka, Tamil Nadu, Kerala
Cities: Hyderabad, Vijayawada, Visakhapatnam, Bengaluru, Chennai, Kochi, Thiruvananthapuram
"""

import os
import json
import math
from flask import Flask, render_template, jsonify, request, send_from_directory

app = Flask(__name__, static_folder='static', template_folder='templates')

# Comprehensive South India Smart City Dataset
SOUTH_INDIA_DATA = {
    "states": [
        {"id": "telangana", "name": "Telangana", "code": "TS", "cities": ["hyderabad"]},
        {"id": "andhra_pradesh", "name": "Andhra Pradesh", "code": "AP", "cities": ["vijayawada", "visakhapatnam"]},
        {"id": "karnataka", "name": "Karnataka", "code": "KA", "cities": ["bengaluru"]},
        {"id": "tamil_nadu", "name": "Tamil Nadu", "code": "TN", "cities": ["chennai"]},
        {"id": "kerala", "name": "Kerala", "code": "KL", "cities": ["kochi", "thiruvananthapuram"]}
    ],
    "cities": {
        "hyderabad": {
            "id": "hyderabad",
            "name": "Hyderabad",
            "state": "Telangana",
            "stateCode": "TS",
            "center": [17.3850, 78.4867],
            "zoom": 12,
            "tagline": "Cyberabad & Greater Hyderabad Smart Corridor",
            "kpis": {
                "monitoredCorridors": 42,
                "activeSignals": 318,
                "avgSpeed": 24.5,
                "congestionIndex": 68,
                "activeIncidents": 3,
                "airQualityIndex": 142
            }
        },
        "bengaluru": {
            "id": "bengaluru",
            "name": "Bengaluru",
            "state": "Karnataka",
            "stateCode": "KA",
            "center": [12.9716, 77.5946],
            "zoom": 12,
            "tagline": "Silicon Valley Adaptive Corridor & ORR Green Wave",
            "kpis": {
                "monitoredCorridors": 56,
                "activeSignals": 442,
                "avgSpeed": 18.2,
                "congestionIndex": 82,
                "activeIncidents": 4,
                "airQualityIndex": 168
            }
        },
        "chennai": {
            "id": "chennai",
            "name": "Chennai",
            "state": "Tamil Nadu",
            "stateCode": "TN",
            "center": [13.0827, 80.2707],
            "zoom": 12,
            "tagline": "Singara Chennai Intelligent Transit Grid",
            "kpis": {
                "monitoredCorridors": 48,
                "activeSignals": 380,
                "avgSpeed": 22.8,
                "congestionIndex": 71,
                "activeIncidents": 3,
                "airQualityIndex": 128
            }
        },
        "vijayawada": {
            "id": "vijayawada",
            "name": "Vijayawada",
            "state": "Andhra Pradesh",
            "stateCode": "AP",
            "center": [16.5062, 80.6480],
            "zoom": 13,
            "tagline": "Amaravati Capital Corridor Smart Transit",
            "kpis": {
                "monitoredCorridors": 28,
                "activeSignals": 142,
                "avgSpeed": 28.4,
                "congestionIndex": 54,
                "activeIncidents": 2,
                "airQualityIndex": 105
            }
        },
        "visakhapatnam": {
            "id": "visakhapatnam",
            "name": "Visakhapatnam",
            "state": "Andhra Pradesh",
            "stateCode": "AP",
            "center": [17.6868, 83.2185],
            "zoom": 13,
            "tagline": "Vizag Coastal City Smart Mobility Network",
            "kpis": {
                "monitoredCorridors": 32,
                "activeSignals": 188,
                "avgSpeed": 29.5,
                "congestionIndex": 51,
                "activeIncidents": 2,
                "airQualityIndex": 94
            }
        },
        "kochi": {
            "id": "kochi",
            "name": "Kochi",
            "state": "Kerala",
            "stateCode": "KL",
            "center": [9.9312, 76.2673],
            "zoom": 13,
            "tagline": "Greater Cochin Integrated Water-Road Transit Hub",
            "kpis": {
                "monitoredCorridors": 30,
                "activeSignals": 196,
                "avgSpeed": 23.2,
                "congestionIndex": 65,
                "activeIncidents": 3,
                "airQualityIndex": 88
            }
        },
        "thiruvananthapuram": {
            "id": "thiruvananthapuram",
            "name": "Thiruvananthapuram",
            "state": "Kerala",
            "stateCode": "KL",
            "center": [8.5241, 76.9366],
            "zoom": 13,
            "tagline": "Capital Smart Mobility & Technopark Corridor",
            "kpis": {
                "monitoredCorridors": 26,
                "activeSignals": 154,
                "avgSpeed": 26.8,
                "congestionIndex": 56,
                "activeIncidents": 1,
                "airQualityIndex": 78
            }
        }
    }
}

# In-memory incident list
ACTIVE_INCIDENTS = [
    {
        "id": "ALT_101",
        "cityId": "hyderabad",
        "type": "accident",
        "title": "Collision on Cyber Towers Flyover Ramp",
        "location": "Hitec City, Mindspace road",
        "coords": [17.4490, 78.3780],
        "severity": "critical",
        "delayMinutes": 25,
        "status": "Patrol Active"
    },
    {
        "id": "ALT_102",
        "cityId": "bengaluru",
        "type": "breakdown",
        "title": "BMTC Bus Breakdown near Silk Board Inflow",
        "location": "Central Silk Board Junction",
        "coords": [12.9190, 77.6250],
        "severity": "critical",
        "delayMinutes": 35,
        "status": "Towing Dispatched"
    }
]


# =========================================================================
# ROUTES & REST APIS
# =========================================================================

@app.route('/')
def index():
    """Main Web Application Entrypoint"""
    return render_template('index.html')


@app.route('/api/states-cities', methods=['GET'])
def get_states_cities():
    """Return all supported South Indian states and cities"""
    return jsonify({
        "status": "success",
        "states": SOUTH_INDIA_DATA["states"],
        "cities": SOUTH_INDIA_DATA["cities"]
    })


@app.route('/api/city-data/<city_id>', methods=['GET'])
def get_city_data(city_id):
    """Fetch details for a specific South Indian city"""
    city = SOUTH_INDIA_DATA["cities"].get(city_id)
    if not city:
        return jsonify({"status": "error", "message": "City not found"}), 404
    return jsonify({
        "status": "success",
        "city": city
    })


@app.route('/api/predict-congestion', methods=['POST'])
def predict_congestion():
    """AI/ML Traffic Congestion Prediction API"""
    data = request.get_json() or {}
    city_id = data.get('cityId', 'hyderabad')
    hour = int(data.get('hour', 17))
    weather = data.get('weather', 'clear')
    event = data.get('event', 'none')
    day = data.get('day', 'weekday')

    city = SOUTH_INDIA_DATA["cities"].get(city_id, SOUTH_INDIA_DATA["cities"]["hyderabad"])

    # Hourly curve profile
    curve = [15, 10, 8, 7, 12, 22, 45, 78, 92, 88, 70, 62, 64, 60, 58, 66, 82, 94, 96, 85, 72, 54, 38, 25]
    base_congestion = curve[hour] if 0 <= hour < 24 else 50

    # Weather factor
    weather_weights = {
        'clear': 1.0, 'cloudy': 1.1, 'moderate_rain': 1.35, 'monsoon_rain': 1.7, 'dense_fog': 1.3
    }
    weather_factor = weather_weights.get(weather, 1.0)

    # Event factor
    event_weights = {
        'none': 1.0, 'tech_park_peak': 1.45, 'festival_rush': 1.6, 'ipl_match': 1.5, 'vip_movement': 1.35
    }
    event_factor = event_weights.get(event, 1.0)
    day_factor = 1.15 if day == 'weekday' else 0.85

    city_multiplier = city["kpis"]["congestionIndex"] / 65.0
    raw_index = base_congestion * day_factor * weather_factor * event_factor * city_multiplier
    congestion_index = min(99, max(12, round(raw_index)))

    nominal_speed = city["kpis"]["avgSpeed"] + 8
    speed_loss = min(78, round((congestion_index / 100.0) * 60))
    predicted_speed = max(7, round((nominal_speed * (100 - speed_loss)) / 100.0))
    delay_minutes = max(2, round(((10.0 / predicted_speed) - (10.0 / nominal_speed)) * 60))

    trendline = []
    for h in range(24):
        val = curve[h] * day_factor * weather_factor * event_factor * city_multiplier
        trendline.append(min(99, max(10, round(val))))

    return jsonify({
        "status": "success",
        "prediction": {
            "cityId": city_id,
            "cityName": city["name"],
            "hour": hour,
            "congestionIndex": congestion_index,
            "predictedSpeed": predicted_speed,
            "speedLossPercentage": speed_loss,
            "addedDelayMinutes": delay_minutes,
            "confidence": 95.8,
            "trendline": trendline
        }
    })


@app.route('/api/report-incident', methods=['POST'])
def report_incident():
    """Citizen / Operator Incident Reporting Endpoint"""
    data = request.get_json() or {}
    new_incident = {
        "id": "ALT_" + str(len(ACTIVE_INCIDENTS) + 101),
        "cityId": data.get("cityId", "hyderabad"),
        "type": data.get("type", "accident"),
        "title": data.get("title", "Road Incident"),
        "location": data.get("locationName", "Central Corridor"),
        "coords": data.get("coords", [17.385, 78.486]),
        "severity": data.get("severity", "moderate"),
        "delayMinutes": int(data.get("delayMinutes", 15)),
        "status": "Dispatched to Control Center"
    }
    ACTIVE_INCIDENTS.insert(0, new_incident)
    return jsonify({
        "status": "success",
        "incident": new_incident
    })


@app.route('/api/incidents', methods=['GET'])
def get_incidents():
    """Get active incidents feed"""
    city_id = request.args.get('cityId')
    if city_id and city_id != 'all':
        filtered = [i for i in ACTIVE_INCIDENTS if i.get('cityId') == city_id]
        return jsonify({"status": "success", "incidents": filtered})
    return jsonify({"status": "success", "incidents": ACTIVE_INCIDENTS})


@app.route('/api/optimize-signals', methods=['POST'])
def optimize_signals():
    """AI Dynamic Green Split calculation"""
    data = request.get_json() or {}
    arms = data.get('arms', {"north": 40, "south": 45, "east": 30, "west": 35})
    total = sum(arms.values()) or 1
    allocatable_green = 104  # 120s cycle - 16s yellow

    splits = {
        k: max(15, round((v / total) * allocatable_green)) for k, v in arms.items()
    }
    return jsonify({
        "status": "success",
        "greenSplits": splits,
        "waitingTimeReductionPercent": 36,
        "flowThroughputBoostPercent": 32
    })


if __name__ == '__main__':
    print("[SERVER] Smart Traffic Management System for Urban Congestion (South India)")
    print("[SERVER] Running on http://127.0.0.1:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
