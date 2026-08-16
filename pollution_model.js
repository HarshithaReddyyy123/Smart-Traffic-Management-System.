/**
 * Smart Traffic Management System - Pollution & Vehicular AQI Model
 * Calculates emissions (PM2.5, PM10, CO, NOx, CO2) based on traffic density and idle time.
 */

class PollutionModel {
  constructor() {
    // Base emission rates in grams per vehicle-hour idling / stop-and-go
    this.emissionRates = {
      twoWheeler: { co2: 85, co: 4.2, nox: 0.35, pm25: 0.04 },
      autoRickshaw: { co2: 130, co: 6.8, nox: 0.65, pm25: 0.09 },
      car: { co2: 240, co: 3.5, nox: 0.55, pm25: 0.05 },
      bus: { co2: 980, co: 12.0, nox: 4.8, pm25: 0.38 },
      truck: { co2: 1250, co: 15.2, nox: 6.2, pm25: 0.52 }
    };
  }

  calculateCityPollution(cityId) {
    const city = SOUTH_INDIA_DATA.cities[cityId] || SOUTH_INDIA_DATA.cities.hyderabad;
    const congestion = city.kpis.congestionIndex; // e.g. 68%
    const totalVehiclesActive = city.junctions.reduce((sum, j) => sum + (j.vehiclesPerMin * 60), 0);

    // Estimate vehicular breakdown
    const twoWheelers = Math.round(totalVehiclesActive * 0.48);
    const autos = Math.round(totalVehiclesActive * 0.16);
    const cars = Math.round(totalVehiclesActive * 0.26);
    const buses = Math.round(totalVehiclesActive * 0.06);
    const trucks = Math.round(totalVehiclesActive * 0.04);

    // Congestion severity multiplier for stop-and-go idling
    const idleFactor = 1 + (congestion / 100) * 1.5;

    // Total Hourly Emissions (kg)
    const co2KgPerHour = Math.round(
      ((twoWheelers * this.emissionRates.twoWheeler.co2 +
        autos * this.emissionRates.autoRickshaw.co2 +
        cars * this.emissionRates.car.co2 +
        buses * this.emissionRates.bus.co2 +
        trucks * this.emissionRates.truck.co2) / 1000) * idleFactor
    );

    const coKgPerHour = parseFloat(
      (((twoWheelers * this.emissionRates.twoWheeler.co +
        autos * this.emissionRates.autoRickshaw.co +
        cars * this.emissionRates.car.co +
        buses * this.emissionRates.bus.co +
        trucks * this.emissionRates.truck.co) / 1000) * idleFactor).toFixed(2)
    );

    const noxKgPerHour = parseFloat(
      (((twoWheelers * this.emissionRates.twoWheeler.nox +
        autos * this.emissionRates.autoRickshaw.nox +
        cars * this.emissionRates.car.nox +
        buses * this.emissionRates.bus.nox +
        trucks * this.emissionRates.truck.nox) / 1000) * idleFactor).toFixed(2)
    );

    const pm25KgPerHour = parseFloat(
      (((twoWheelers * this.emissionRates.twoWheeler.pm25 +
        autos * this.emissionRates.autoRickshaw.pm25 +
        cars * this.emissionRates.car.pm25 +
        buses * this.emissionRates.bus.pm25 +
        trucks * this.emissionRates.truck.pm25) / 1000) * idleFactor).toFixed(3)
    );

    // Current AQI computation with traffic contribution
    const baseAqi = city.kpis.airQualityIndex;
    const currentAqi = Math.round(baseAqi * (0.8 + (congestion / 100) * 0.4));

    let aqiCategory = 'Moderate';
    let aqiBadgeClass = 'badge-moderate';
    let healthAdvisory = 'Acceptable air quality. Sensitive individuals should consider limiting heavy exertion.';

    if (currentAqi <= 50) {
      aqiCategory = 'Good';
      aqiBadgeClass = 'badge-low';
      healthAdvisory = 'Air quality is satisfactory with minimal air pollution risk.';
    } else if (currentAqi <= 100) {
      aqiCategory = 'Satisfactory';
      aqiBadgeClass = 'badge-low';
      healthAdvisory = 'Minor breathing discomfort to sensitive people.';
    } else if (currentAqi <= 200) {
      aqiCategory = 'Moderate';
      aqiBadgeClass = 'badge-moderate';
      healthAdvisory = 'Breathing discomfort to people with lungs, asthma and heart diseases.';
    } else if (currentAqi <= 300) {
      aqiCategory = 'Poor';
      aqiBadgeClass = 'badge-heavy';
      healthAdvisory = 'Breathing discomfort to most people on prolonged exposure.';
    } else {
      aqiCategory = 'Severe';
      aqiBadgeClass = 'badge-critical';
      healthAdvisory = 'Respiratory effects even on healthy people. High alert.';
    }

    // AI Traffic Optimization Savings
    const dailyFuelWastedLiters = Math.round(totalVehiclesActive * (congestion / 100) * 0.35);
    const dailyFuelSavedByAILiters = Math.round(dailyFuelWastedLiters * 0.28); // 28% AI signal optimization savings
    const annualTreesEquivalent = Math.round((dailyFuelSavedByAILiters * 365 * 2.39) / 22); // 1 mature tree absorbs ~22kg CO2/year

    return {
      cityId,
      cityName: city.name,
      currentAqi,
      aqiCategory,
      aqiBadgeClass,
      healthAdvisory,
      pollutants: {
        pm25: { value: Math.round(currentAqi * 0.48), unit: 'µg/m³', status: currentAqi > 150 ? 'High' : 'Moderate' },
        pm10: { value: Math.round(currentAqi * 0.82), unit: 'µg/m³', status: currentAqi > 180 ? 'High' : 'Moderate' },
        co: { value: (currentAqi * 0.014).toFixed(1), unit: 'mg/m³', status: 'Normal' },
        no2: { value: Math.round(currentAqi * 0.32), unit: 'µg/m³', status: 'Moderate' },
        so2: { value: Math.round(currentAqi * 0.12), unit: 'µg/m³', status: 'Good' }
      },
      hourlyEmissions: {
        co2KgPerHour,
        coKgPerHour,
        noxKgPerHour,
        pm25KgPerHour
      },
      ecoSavings: {
        dailyFuelWastedLiters,
        dailyFuelSavedByAILiters,
        dailyCo2PreventedKg: Math.round(dailyFuelSavedByAILiters * 2.39),
        annualTreesEquivalent
      }
    };
  }
}

window.PollutionModel = PollutionModel;
