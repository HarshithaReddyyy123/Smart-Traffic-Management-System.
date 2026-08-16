/**
 * Smart Traffic Management System - Map Engine (Leaflet.js + Heatmap + Live Overlays)
 */

class MapEngine {
  constructor(containerId = 'trafficMap') {
    this.containerId = containerId;
    this.map = null;
    this.heatLayer = null;
    this.signalMarkers = [];
    this.incidentMarkers = [];
    this.landmarkMarkers = [];
    this.activeRoutePolylines = [];
    this.emergencyPolylines = [];
    this.simulatedVehicles = [];
    this.currentCityId = 'hyderabad';
    this.showHeatmap = true;
    this.showSignals = true;
    this.showIncidents = true;
    this.showVehicles = true;
    this.animationInterval = null;
  }

  init(cityId = 'hyderabad') {
    this.currentCityId = cityId;
    const city = SOUTH_INDIA_DATA.cities[cityId] || SOUTH_INDIA_DATA.cities.hyderabad;

    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    // Initialize Leaflet Map
    this.map = L.map(this.containerId, {
      center: city.center,
      zoom: city.zoom,
      zoomControl: false,
      attributionControl: false
    });

    // Add high-contrast dark theme CartoDB basemap with OSM fallback
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(this.map);

    // Add custom zoom control in top right
    L.control.zoom({ position: 'topright' }).addTo(this.map);

    // Render city layers
    this.renderCity(cityId);
    this.startVehicleSimulation();

    // Map click handler for incident reporting pin picker
    this.map.on('click', (e) => {
      window.dispatchEvent(new CustomEvent('map-coordinate-selected', {
        detail: { lat: e.latlng.lat, lng: e.latlng.lng }
      }));
    });
  }

  setCity(cityId) {
    if (!SOUTH_INDIA_DATA.cities[cityId]) return;
    this.currentCityId = cityId;
    const city = SOUTH_INDIA_DATA.cities[cityId];
    this.map.flyTo(city.center, city.zoom, { duration: 1.2 });
    this.clearAllLayers();
    this.renderCity(cityId);
  }

  clearAllLayers() {
    if (this.heatLayer) {
      this.map.removeLayer(this.heatLayer);
      this.heatLayer = null;
    }
    this.signalMarkers.forEach(m => this.map.removeLayer(m));
    this.signalMarkers = [];

    this.incidentMarkers.forEach(m => this.map.removeLayer(m));
    this.incidentMarkers = [];

    this.landmarkMarkers.forEach(m => this.map.removeLayer(m));
    this.landmarkMarkers = [];

    this.activeRoutePolylines.forEach(p => this.map.removeLayer(p));
    this.activeRoutePolylines = [];

    this.emergencyPolylines.forEach(p => this.map.removeLayer(p));
    this.emergencyPolylines = [];

    this.simulatedVehicles.forEach(v => {
      if (v.marker) this.map.removeLayer(v.marker);
    });
    this.simulatedVehicles = [];
  }

  renderCity(cityId) {
    const city = SOUTH_INDIA_DATA.cities[cityId];
    if (!city) return;

    this.renderHeatmap(city);
    this.renderSignals(city);
    this.renderIncidents(city);
    this.renderLandmarks(city);
  }

  // 1. Traffic Heatmap: Green (Low), Yellow (Medium), Red (Heavy)
  renderHeatmap(city) {
    if (!this.showHeatmap) return;
    if (typeof L.heatLayer !== 'function') return;

    // Generate heat points based on junctions and corridor segments
    const heatPoints = [];
    city.junctions.forEach(j => {
      const intensity = j.density / 100; // 0.0 to 1.0
      heatPoints.push([j.coords[0], j.coords[1], intensity]);
      // Add surrounding bleed points for realistic corridor thermal intensity
      const jitter = 0.0035;
      heatPoints.push([j.coords[0] + jitter, j.coords[1] + jitter, intensity * 0.7]);
      heatPoints.push([j.coords[0] - jitter, j.coords[1] - jitter, intensity * 0.7]);
      heatPoints.push([j.coords[0] + jitter, j.coords[1] - jitter, intensity * 0.6]);
      heatPoints.push([j.coords[0] - jitter, j.coords[1] + jitter, intensity * 0.6]);
    });

    if (this.heatLayer) {
      this.map.removeLayer(this.heatLayer);
    }

    // Heatmap Gradient: Green = Low (0.0-0.35), Yellow = Medium (0.35-0.7), Red = Heavy (0.7-1.0)
    this.heatLayer = L.heatLayer(heatPoints, {
      radius: 35,
      blur: 24,
      maxZoom: 16,
      max: 1.0,
      gradient: {
        0.2: '#10b981', // Green - Low Congestion
        0.55: '#f59e0b', // Yellow - Moderate Congestion
        0.85: '#ef4444', // Red - Heavy Congestion
        1.0: '#991b1b'  // Deep Crimson - Severe Gridlock
      }
    }).addTo(this.map);
  }

  // 2. Traffic Signals with Dynamic Red/Green badge and countdown
  renderSignals(city) {
    if (!this.showSignals) return;

    city.junctions.forEach(j => {
      const isGreen = j.currentSignal === 'green';
      const colorClass = isGreen ? 'signal-green' : 'signal-red';
      const badgeColor = isGreen ? '#10b981' : '#ef4444';
      const densityColor = j.density > 75 ? '#ef4444' : j.density > 50 ? '#f59e0b' : '#10b981';

      const customIcon = L.divIcon({
        className: 'custom-signal-icon',
        html: `
          <div class="signal-pin-wrapper">
            <div class="signal-beacon ${colorClass}">
              <span class="signal-dot"></span>
              <span class="signal-timer">${j.timerRemaining}s</span>
            </div>
            <div class="signal-label">${j.name.split(' ')[0]}</div>
          </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 21]
      });

      const marker = L.marker(j.coords, { icon: customIcon }).addTo(this.map);

      // Interactive Popup
      const popupContent = `
        <div class="map-popup-card">
          <div class="popup-header">
            <h4>${j.name}</h4>
            <span class="badge badge-${j.status}">${j.status.toUpperCase()}</span>
          </div>
          <div class="popup-body">
            <div class="popup-row">
              <span>Traffic Density:</span>
              <strong style="color:${densityColor}">${j.density}% (${j.vehiclesPerMin} veh/min)</strong>
            </div>
            <div class="popup-row">
              <span>Current Signal:</span>
              <strong style="color:${badgeColor}">${j.currentSignal.toUpperCase()} (${j.timerRemaining}s remaining)</strong>
            </div>
            <div class="popup-row">
              <span>CCTV AI Vision:</span>
              <span class="text-emerald">${j.cctvStatus}</span>
            </div>
            <div class="popup-row">
              <span>Local AQI:</span>
              <strong>${j.aqi} AQI</strong>
            </div>
            <div class="popup-actions">
              <button class="btn btn-xs btn-primary" onclick="window.TrafficApp.openSignalOptimization('${j.id}')">
                ⚡ Optimize Signal
              </button>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 300, className: 'stms-leaflet-popup' });
      this.signalMarkers.push(marker);
    });
  }

  // 3. Incident & Blockage Markers with Pulse effect
  renderIncidents(city) {
    if (!this.showIncidents || !city.incidents) return;

    city.incidents.forEach(inc => {
      const iconSymbol = inc.type === 'accident' ? '💥' : inc.type === 'waterlogging' ? '🌊' : inc.type === 'roadwork' ? '🚧' : '⚠️';
      const severityColor = inc.severity === 'critical' ? '#ef4444' : inc.severity === 'moderate' ? '#f59e0b' : '#3b82f6';

      const customIcon = L.divIcon({
        className: 'custom-incident-icon',
        html: `
          <div class="incident-pin-wrapper pulse-${inc.severity}">
            <div class="incident-icon-box" style="border-color:${severityColor}">
              <span>${iconSymbol}</span>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker(inc.coords, { icon: customIcon }).addTo(this.map);

      // Add warning radius circle
      const circle = L.circle(inc.coords, {
        radius: inc.impactRadiusMeters || 250,
        color: severityColor,
        fillColor: severityColor,
        fillOpacity: 0.15,
        weight: 1.5,
        dashArray: '4, 4'
      }).addTo(this.map);

      const popupContent = `
        <div class="map-popup-card">
          <div class="popup-header incident-header">
            <h4>${iconSymbol} ${inc.title}</h4>
            <span class="badge badge-${inc.severity}">${inc.severity.toUpperCase()}</span>
          </div>
          <div class="popup-body">
            <p class="popup-desc">${inc.description}</p>
            <div class="popup-row">
              <span>Reported:</span>
              <strong>${inc.timestamp}</strong>
            </div>
            <div class="popup-row">
              <span>Estimated Delay:</span>
              <strong class="text-rose">+${inc.delayMinutes} mins</strong>
            </div>
            <div class="popup-row">
              <span>Response Status:</span>
              <strong class="text-amber">${inc.status}</strong>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 300, className: 'stms-leaflet-popup' });
      this.incidentMarkers.push(marker);
      this.incidentMarkers.push(circle);
    });
  }

  // 4. Landmarks / Hubs
  renderLandmarks(city) {
    if (!city.landmarks) return;
    city.landmarks.forEach(lm => {
      const landmarkIcon = L.divIcon({
        className: 'landmark-icon',
        html: `<div class="landmark-dot" title="${lm.name}"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });
      const marker = L.marker(lm.coords, { icon: landmarkIcon }).addTo(this.map);
      marker.bindTooltip(lm.name, { direction: 'top', className: 'landmark-tooltip' });
      this.landmarkMarkers.push(marker);
    });
  }

  // 5. Draw Smart Routes with gradient and turn points
  drawRoute(routeType, coordinates, details) {
    // Clear existing polylines
    this.activeRoutePolylines.forEach(p => this.map.removeLayer(p));
    this.activeRoutePolylines = [];

    const colorMap = {
      fastest: '#06b6d4', // Cyan
      eco: '#10b981',     // Emerald
      arterial: '#8b5cf6' // Violet
    };
    const color = colorMap[routeType] || '#06b6d4';

    // Route Outer Glow Line
    const glowLine = L.polyline(coordinates, {
      color: color,
      weight: 8,
      opacity: 0.35,
      lineCap: 'round'
    }).addTo(this.map);

    // Route Main Line
    const mainLine = L.polyline(coordinates, {
      color: color,
      weight: 4,
      opacity: 0.95,
      dashArray: routeType === 'eco' ? '6, 6' : null,
      lineCap: 'round'
    }).addTo(this.map);

    this.activeRoutePolylines.push(glowLine, mainLine);

    // Fit bounds smoothly
    this.map.fitBounds(mainLine.getBounds(), { padding: [40, 40] });

    // Add Start and End Pins
    const startPoint = coordinates[0];
    const endPoint = coordinates[coordinates.length - 1];

    const startMarker = L.circleMarker(startPoint, {
      radius: 7,
      fillColor: '#10b981',
      color: '#ffffff',
      weight: 2,
      fillOpacity: 1
    }).addTo(this.map).bindTooltip('Start: ' + (details.originName || 'Origin'), { permanent: true, direction: 'top' });

    const endMarker = L.circleMarker(endPoint, {
      radius: 7,
      fillColor: '#ef4444',
      color: '#ffffff',
      weight: 2,
      fillOpacity: 1
    }).addTo(this.map).bindTooltip('Destination: ' + (details.destName || 'Dest'), { permanent: true, direction: 'top' });

    this.activeRoutePolylines.push(startMarker, endMarker);
  }

  // 6. Draw Emergency Green Wave Corridor
  drawEmergencyCorridor(coordinates, missionDetails) {
    this.emergencyPolylines.forEach(p => this.map.removeLayer(p));
    this.emergencyPolylines = [];

    // Pulsing green glow line representing priority corridor
    const emergencyGlow = L.polyline(coordinates, {
      color: '#10b981',
      weight: 12,
      opacity: 0.5,
      className: 'emergency-green-wave-glow'
    }).addTo(this.map);

    const emergencyLine = L.polyline(coordinates, {
      color: '#ffffff',
      weight: 4,
      opacity: 1,
      dashArray: '8, 8',
      className: 'emergency-line-pulse'
    }).addTo(this.map);

    this.emergencyPolylines.push(emergencyGlow, emergencyLine);
    this.map.fitBounds(emergencyLine.getBounds(), { padding: [50, 50] });
  }

  clearEmergencyCorridor() {
    this.emergencyPolylines.forEach(p => this.map.removeLayer(p));
    this.emergencyPolylines = [];
  }

  // 7. Live Vehicle Simulation Animation
  startVehicleSimulation() {
    if (this.animationInterval) clearInterval(this.animationInterval);

    // Periodically update signal timers and mock vehicle tokens
    this.animationInterval = setInterval(() => {
      const city = SOUTH_INDIA_DATA.cities[this.currentCityId];
      if (!city) return;

      city.junctions.forEach(j => {
        j.timerRemaining--;
        if (j.timerRemaining <= 0) {
          j.currentSignal = j.currentSignal === 'green' ? 'red' : 'green';
          j.timerRemaining = j.currentSignal === 'green' ? j.greenDuration : j.redDuration;
        }
      });

      // Update signal markers HTML
      this.signalMarkers.forEach((m, idx) => {
        const j = city.junctions[idx];
        if (j && m.getElement()) {
          const isGreen = j.currentSignal === 'green';
          const beacon = m.getElement().querySelector('.signal-beacon');
          const timer = m.getElement().querySelector('.signal-timer');
          if (beacon) {
            beacon.className = `signal-beacon ${isGreen ? 'signal-green' : 'signal-red'}`;
          }
          if (timer) {
            timer.innerText = `${j.timerRemaining}s`;
          }
        }
      });
    }, 1000);
  }

  toggleLayer(layerName, isVisible) {
    if (layerName === 'heatmap') {
      this.showHeatmap = isVisible;
      if (this.heatLayer) {
        if (isVisible) this.map.addLayer(this.heatLayer);
        else this.map.removeLayer(this.heatLayer);
      } else if (isVisible) {
        this.renderHeatmap(SOUTH_INDIA_DATA.cities[this.currentCityId]);
      }
    } else if (layerName === 'signals') {
      this.showSignals = isVisible;
      this.signalMarkers.forEach(m => isVisible ? this.map.addLayer(m) : this.map.removeLayer(m));
    } else if (layerName === 'incidents') {
      this.showIncidents = isVisible;
      this.incidentMarkers.forEach(m => isVisible ? this.map.addLayer(m) : this.map.removeLayer(m));
    }
  }

  addNewIncident(incident) {
    const city = SOUTH_INDIA_DATA.cities[this.currentCityId];
    if (!city) return;
    if (!city.incidents) city.incidents = [];
    city.incidents.unshift(incident);
    this.renderIncidents(city);
    this.map.panTo(incident.coords);
  }
}

window.MapEngine = MapEngine;
