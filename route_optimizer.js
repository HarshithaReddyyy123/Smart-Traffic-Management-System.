/**
 * Smart Traffic Management System - Route Recommendation Engine
 * Calculates multi-route alternatives (Fastest AI, Eco-Friendly, Low-Congestion Arterial)
 * with turn-by-turn directions, ETA, fuel saving comparison, and coordinates.
 */

class RouteOptimizer {
  constructor() {
    this.simulating = false;
  }

  calculateRoutes(cityId, originId, destId) {
    const city = SOUTH_INDIA_DATA.cities[cityId] || SOUTH_INDIA_DATA.cities.hyderabad;
    const origin = city.landmarks.find(l => l.id === originId) || city.landmarks[0];
    const dest = city.landmarks.find(l => l.id === destId) || city.landmarks[1];

    if (!origin || !dest) return null;

    // Generate realistic waypoints between origin and destination
    const baseCoords = this.generateWaypoints(origin.coords, dest.coords, city.junctions);
    const distanceKm = parseFloat(this.calculateDirectDistance(origin.coords, dest.coords).toFixed(1));

    // 1. AI Fastest Route (Prioritizes signal-cleared corridors)
    const fastestSpeed = Math.round(city.kpis.avgSpeed * 1.25);
    const fastestMinutes = Math.max(8, Math.round((distanceKm / fastestSpeed) * 60));
    const fastestCoords = this.generateAlternativePolyline(baseCoords, 0);

    // 2. Eco-Friendly Route (Smooth flow, minimum start-stop idling, low emissions)
    const ecoDistanceKm = parseFloat((distanceKm * 1.08).toFixed(1));
    const ecoMinutes = Math.round(fastestMinutes * 1.12);
    const ecoFuelSavedLiters = parseFloat((distanceKm * 0.045).toFixed(2));
    const ecoCo2SavedGrams = Math.round(ecoFuelSavedLiters * 2392); // ~2.392 kg CO2 per liter of fuel
    const ecoCoords = this.generateAlternativePolyline(baseCoords, 0.003);

    // 3. Low-Congestion Arterial Route (Bypasses active bottlenecks & incidents)
    const arterialDistanceKm = parseFloat((distanceKm * 1.18).toFixed(1));
    const arterialMinutes = Math.round(fastestMinutes * 1.2);
    const arterialCoords = this.generateAlternativePolyline(baseCoords, -0.004);

    return {
      originName: origin.name,
      destName: dest.name,
      originCoords: origin.coords,
      destCoords: dest.coords,
      routes: {
        fastest: {
          id: 'fastest',
          name: 'AI Smart Fastest Corridor',
          badge: '⚡ Fastest (AI Green-Wave)',
          distanceKm: distanceKm,
          durationMins: fastestMinutes,
          avgSpeedKmH: fastestSpeed,
          signalStops: 2,
          congestionScore: 'Moderate (28%)',
          fuelCostEst: '₹' + Math.round(distanceKm * 8.5),
          co2EmissionsKg: (distanceKm * 0.18).toFixed(2),
          coordinates: fastestCoords,
          steps: this.generateNavigationSteps(origin.name, dest.name, 'fastest')
        },
        eco: {
          id: 'eco',
          name: 'Eco-Optimized Low Idle Route',
          badge: '🌱 Eco Friendly (-24% Idle)',
          distanceKm: ecoDistanceKm,
          durationMins: ecoMinutes,
          avgSpeedKmH: Math.round(fastestSpeed * 0.9),
          signalStops: 1,
          congestionScore: 'Low (16%)',
          fuelSavedLiters: ecoFuelSavedLiters,
          co2SavedGrams: ecoCo2SavedGrams,
          co2EmissionsKg: (ecoDistanceKm * 0.13).toFixed(2),
          coordinates: ecoCoords,
          steps: this.generateNavigationSteps(origin.name, dest.name, 'eco')
        },
        arterial: {
          id: 'arterial',
          name: 'Arterial Bypass (Incident Free)',
          badge: '🛡️ Bypass Congestion',
          distanceKm: arterialDistanceKm,
          durationMins: arterialMinutes,
          avgSpeedKmH: Math.round(fastestSpeed * 0.85),
          signalStops: 3,
          congestionScore: 'Low (20%)',
          fuelCostEst: '₹' + Math.round(arterialDistanceKm * 8.2),
          co2EmissionsKg: (arterialDistanceKm * 0.17).toFixed(2),
          coordinates: arterialCoords,
          steps: this.generateNavigationSteps(origin.name, dest.name, 'arterial')
        }
      }
    };
  }

  generateNavigationSteps(originName, destName, type) {
    if (type === 'fastest') {
      return [
        { instruction: `Depart from ${originName} heading toward the central smart corridor.`, distance: '800m' },
        { instruction: 'Merge onto the Smart Synchronized Expressway (Green Wave active).', distance: '3.4km' },
        { instruction: 'Keep right at the flyover underpass to bypass local queue.', distance: '2.1km' },
        { instruction: `Take the exit ramp towards ${destName} and arrive at destination.`, distance: '600m' }
      ];
    } else if (type === 'eco') {
      return [
        { instruction: `Head out from ${originName} via arterial avenue (uniform 40 km/h cruising).`, distance: '1.2km' },
        { instruction: 'Continue on the ring feeder road with zero stop-and-go bottleneck.', distance: '4.5km' },
        { instruction: 'Smooth glide past solar-adaptive signals.', distance: '1.8km' },
        { instruction: `Turn smoothly onto the access road to ${destName}.`, distance: '400m' }
      ];
    } else {
      return [
        { instruction: `Start from ${originName} towards the outer connector bypass.`, distance: '1.5km' },
        { instruction: 'Bypass primary bottleneck junction via North Link Flyover.', distance: '5.2km' },
        { instruction: 'Merge onto destination link road with clear visibility.', distance: '1.9km' },
        { instruction: `Arrive safely at ${destName}.`, distance: '500m' }
      ];
    }
  }

  calculateDirectDistance(c1, c2) {
    const R = 6371; // Earth radius in km
    const dLat = (c2[0] - c1[0]) * Math.PI / 180;
    const dLon = (c2[1] - c1[1]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(c1[0] * Math.PI / 180) * Math.cos(c2[0] * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.max(3.5, R * c * 1.35); // 1.35 road winding factor
  }

  generateWaypoints(start, end, junctions) {
    const waypoints = [start];
    // Find up to 2 intermediate junctions geographically between start and end
    const midLat = (start[0] + end[0]) / 2;
    const midLng = (start[1] + end[1]) / 2;

    const sortedJunctions = [...junctions].sort((a, b) => {
      const distA = Math.hypot(a.coords[0] - midLat, a.coords[1] - midLng);
      const distB = Math.hypot(b.coords[0] - midLat, b.coords[1] - midLng);
      return distA - distB;
    });

    if (sortedJunctions.length > 0) {
      waypoints.push(sortedJunctions[0].coords);
    }
    if (sortedJunctions.length > 1) {
      waypoints.push(sortedJunctions[1].coords);
    }

    waypoints.push(end);
    return waypoints;
  }

  generateAlternativePolyline(baseCoords, offset) {
    return baseCoords.map((coord, idx) => {
      if (idx === 0 || idx === baseCoords.length - 1) return coord;
      return [coord[0] + offset, coord[1] + (offset * 1.2)];
    });
  }
}

window.RouteOptimizer = RouteOptimizer;
