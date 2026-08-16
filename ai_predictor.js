/**
 * Smart Traffic Management System - AI Congestion Prediction Engine
 * Simulates machine learning traffic forecasting based on multi-factor inputs:
 * Time of day, day of week, weather conditions, special South Indian events.
 */

class AIPredictor {
  constructor() {
    this.weatherWeights = {
      clear: { factor: 1.0, label: 'Clear Sky / Dry', speedPenalty: 0 },
      cloudy: { factor: 1.1, label: 'Partly Cloudy', speedPenalty: 3 },
      moderate_rain: { factor: 1.35, label: 'Moderate Showers', speedPenalty: 18 },
      monsoon_rain: { factor: 1.7, label: 'Monsoonal Downpour / Waterlogging', speedPenalty: 38 },
      dense_fog: { factor: 1.3, label: 'Dense Fog / Low Visibility', speedPenalty: 15 }
    };

    this.eventWeights = {
      none: { factor: 1.0, label: 'Regular Day', desc: 'Normal urban flow' },
      tech_park_peak: { factor: 1.45, label: 'Tech Park Shift (IT Corridor Rush)', desc: 'High density around Cyberabad, ORR, OMR, Infopark, Technopark' },
      festival_rush: { factor: 1.6, label: 'Festival Shopping / Holiday Exodus', desc: 'High market density around Panagal Park, Charminar, East Fort' },
      ipl_match: { factor: 1.5, label: 'IPL / Mega Stadium Match', desc: 'Chinnaswamy / Uppal / Chepauk stadium corridor congestion' },
      vip_movement: { factor: 1.35, label: 'VIP Convoy Transit', desc: 'Temporary arterial holds & corridor diversions' }
    };
  }

  /**
   * Base hourly congestion profile for South Indian urban hubs
   */
  getBaseHourlyCongestion(hour) {
    // 24 hour distribution curve (0 to 23)
    const curve = [
      15, 10, 8, 7, 12, 22, 45, 78, 92, 88, 70, 62,
      64, 60, 58, 66, 82, 94, 96, 85, 72, 54, 38, 25
    ];
    return curve[hour] || 50;
  }

  /**
   * Predict Congestion Index & Telemetry
   */
  predict(params) {
    const {
      cityId = 'hyderabad',
      hour = 17,
      day = 'weekday', // weekday, weekend
      weather = 'clear',
      event = 'none',
      junctionId = null
    } = params;

    const city = SOUTH_INDIA_DATA.cities[cityId] || SOUTH_INDIA_DATA.cities.hyderabad;
    const baseHourCongestion = this.getBaseHourlyCongestion(hour);

    // Modifiers
    const dayFactor = day === 'weekday' ? 1.15 : 0.85;
    const weatherInfo = this.weatherWeights[weather] || this.weatherWeights.clear;
    const eventInfo = this.eventWeights[event] || this.eventWeights.none;

    // City baseline congestion index multiplier
    const cityBaseMultiplier = city.kpis.congestionIndex / 65;

    // ML calculation with non-linear sigmoid bounding
    let rawIndex = baseHourCongestion * dayFactor * weatherInfo.factor * eventInfo.factor * cityBaseMultiplier;
    const congestionIndex = Math.min(99, Math.max(12, Math.round(rawIndex)));

    // Calculate Speed Drop
    const nominalSpeed = city.kpis.avgSpeed + 8; // e.g. 32 km/h
    const speedLossPercentage = Math.min(78, Math.round((congestionIndex / 100) * 60 + weatherInfo.speedPenalty * 0.4));
    const predictedSpeed = Math.max(7, Math.round((nominalSpeed * (100 - speedLossPercentage)) / 100));

    // Calculate Expected Delay for 10km trip
    const normalTripMinutes = Math.round((10 / nominalSpeed) * 60);
    const delayedTripMinutes = Math.round((10 / predictedSpeed) * 60);
    const addedDelayMinutes = Math.max(0, delayedTripMinutes - normalTripMinutes);

    // AI Confidence Score (Historical data density)
    let confidence = 94.8;
    if (event !== 'none') confidence -= 3.2;
    if (weather === 'monsoon_rain') confidence -= 2.4;
    confidence = parseFloat(confidence.toFixed(1));

    // Generate 24-hour predictive trendline
    const trendline = [];
    for (let h = 0; h < 24; h++) {
      let hVal = this.getBaseHourlyCongestion(h) * dayFactor * weatherInfo.factor * eventInfo.factor * cityBaseMultiplier;
      trendline.push(Math.min(99, Math.max(10, Math.round(hVal))));
    }

    // Recommendation strategy
    let recommendation = 'Flow stable. Standard dynamic signal coordination active.';
    let statusClass = 'low';

    if (congestionIndex > 80) {
      recommendation = '🚨 Severe Gridlock Projected: Trigger automated green-wave cycle extension on primary arterials & broadcast citizen diversions.';
      statusClass = 'critical';
    } else if (congestionIndex > 65) {
      recommendation = '⚠️ High Congestion Imminent: Optimize signal split timings by +15s on peak approaches and throttle secondary entries.';
      statusClass = 'moderate';
    } else if (congestionIndex > 40) {
      recommendation = 'Moderate Traffic: Synchronize corridor green waves to prevent bottleneck formation.';
      statusClass = 'medium';
    }

    return {
      cityId,
      cityName: city.name,
      hour,
      weather: weatherInfo.label,
      event: eventInfo.label,
      congestionIndex,
      statusClass,
      predictedSpeed,
      speedLossPercentage,
      nominalSpeed,
      normalTripMinutes,
      delayedTripMinutes,
      addedDelayMinutes,
      confidence,
      trendline,
      recommendation,
      aqiImpact: Math.round(city.kpis.airQualityIndex * (1 + (congestionIndex - 50) / 100 * 0.4))
    };
  }
}

window.AIPredictor = AIPredictor;
