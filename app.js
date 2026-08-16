/**
 * Smart Traffic Management System for Urban Congestion - Main Controller
 */

class SmartTrafficApp {
  constructor() {
    this.currentCityId = 'hyderabad';
    this.currentStateId = 'telangana';
    this.activeTab = 'landing'; // landing, live-map, ai-predict, routing, emergency, signal, pollution, admin

    this.mapEngine = null;
    this.aiPredictor = null;
    this.routeOptimizer = null;
    this.emergencySystem = null;
    this.signalController = null;
    this.incidentManager = null;
    this.pollutionModel = null;
    this.analyticsCharts = null;

    this.simulationTimer = null;
    this.isDemoScenarioRunning = false;
  }

  init() {
    // Instantiate all modules
    this.aiPredictor = new AIPredictor();
    this.routeOptimizer = new RouteOptimizer();
    this.emergencySystem = new EmergencySystem();
    this.signalController = new SignalController();
    this.incidentManager = new IncidentManager();
    this.pollutionModel = new PollutionModel();
    this.analyticsCharts = new AnalyticsCharts();

    // Setup Event Listeners
    this.setupNavigation();
    this.setupStateCitySelectors();
    this.setupPredictionControls();
    this.setupRoutingControls();
    this.setupEmergencyControls();
    this.setupSignalControls();
    this.setupIncidentForm();
    this.setupDemoScenarios();
    this.setupTicker();
    this.setupReportExport();

    // Map picker listener
    window.addEventListener('map-coordinate-selected', (e) => {
      const latInput = document.getElementById('incidentLat');
      const lngInput = document.getElementById('incidentLng');
      if (latInput && lngInput) {
        latInput.value = e.detail.lat.toFixed(5);
        lngInput.value = e.detail.lng.toFixed(5);
        this.showToast('📍 Coordinate captured from map click!');
      }
    });

    // Update City views
    this.updateCityData(this.currentCityId);

    // Initial AI prediction calculation
    this.runAIPrediction();
    this.runPollutionModel();
  }

  // Navigation Tabs Switcher
  setupNavigation() {
    const navButtons = document.querySelectorAll('[data-nav-target]');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetTab = btn.getAttribute('data-nav-target');
        this.switchTab(targetTab);
      });
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('mainNavMenu');
    if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('nav-open');
      });
    }
  }

  switchTab(tabId) {
    this.activeTab = tabId;

    // Update nav button active states
    document.querySelectorAll('[data-nav-target]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-nav-target') === tabId);
    });

    // Hide/Show tab panels
    document.querySelectorAll('.app-tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `tab-${tabId}`);
    });

    // If map tab is selected, initialize/invalidate map size
    if (tabId === 'live-map') {
      if (!this.mapEngine) {
        this.mapEngine = new MapEngine('trafficMap');
        this.mapEngine.init(this.currentCityId);
      } else {
        setTimeout(() => {
          this.mapEngine.map.invalidateSize();
        }, 200);
      }
    }

    // Refresh charts if analytics or admin tab
    if (tabId === 'admin') {
      setTimeout(() => {
        this.renderAdminAnalytics();
      }, 100);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // State and City Dynamic Switcher
  setupStateCitySelectors() {
    const stateSelect = document.getElementById('stateSelector');
    const citySelect = document.getElementById('citySelector');

    if (stateSelect && citySelect) {
      stateSelect.addEventListener('change', (e) => {
        const stateId = e.target.value;
        this.currentStateId = stateId;
        this.populateCityDropdown(stateId);
        const firstCityId = citySelect.options[0]?.value;
        if (firstCityId) {
          citySelect.value = firstCityId;
          this.setCity(firstCityId);
        }
      });

      citySelect.addEventListener('change', (e) => {
        this.setCity(e.target.value);
      });

      // Initial populate
      this.populateCityDropdown(this.currentStateId);
    }
  }

  populateCityDropdown(stateId) {
    const citySelect = document.getElementById('citySelector');
    if (!citySelect) return;
    citySelect.innerHTML = '';

    const stateObj = SOUTH_INDIA_DATA.states.find(s => s.id === stateId);
    if (!stateObj) return;

    stateObj.cities.forEach(cId => {
      const city = SOUTH_INDIA_DATA.cities[cId];
      if (city) {
        const opt = document.createElement('option');
        opt.value = city.id;
        opt.textContent = `${city.name} (${city.stateCode})`;
        citySelect.appendChild(opt);
      }
    });
  }

  setCity(cityId) {
    this.currentCityId = cityId;
    const city = SOUTH_INDIA_DATA.cities[cityId];
    if (!city) return;

    // Update state selector to match
    const stateObj = SOUTH_INDIA_DATA.states.find(s => s.cities.includes(cityId));
    if (stateObj) {
      const stateSelect = document.getElementById('stateSelector');
      if (stateSelect && stateSelect.value !== stateObj.id) {
        stateSelect.value = stateObj.id;
        this.populateCityDropdown(stateObj.id);
        const citySelect = document.getElementById('citySelector');
        if (citySelect) citySelect.value = cityId;
      }
    }

    // Update UI elements
    this.updateCityData(cityId);

    // Update map
    if (this.mapEngine) {
      this.mapEngine.setCity(cityId);
    }

    // Refresh submodules
    this.populateRouteWaypoints(cityId);
    this.populateHospitalDropdown(cityId);
    this.signalController.loadJunction(city.junctions[0].id, cityId);
    this.updateSignalView();
    this.runAIPrediction();
    this.runPollutionModel();
    this.renderAlertsList();
    this.renderAdminAnalytics();

    this.showToast(`Switched view to ${city.name}, ${city.state}`);
  }

  updateCityData(cityId) {
    const city = SOUTH_INDIA_DATA.cities[cityId];
    if (!city) return;

    // Update City Badge / Taglines
    document.querySelectorAll('.current-city-name').forEach(el => el.textContent = city.name);
    document.querySelectorAll('.current-state-name').forEach(el => el.textContent = city.state);
    document.querySelectorAll('.current-city-tagline').forEach(el => el.textContent = city.tagline);

    // Update Top KPIs
    document.querySelectorAll('.kpi-corridors').forEach(el => el.textContent = city.kpis.monitoredCorridors);
    document.querySelectorAll('.kpi-signals').forEach(el => el.textContent = city.kpis.activeSignals);
    document.querySelectorAll('.kpi-speed').forEach(el => el.textContent = `${city.kpis.avgSpeed} km/h`);
    document.querySelectorAll('.kpi-congestion').forEach(el => el.textContent = `${city.kpis.congestionIndex}%`);
    document.querySelectorAll('.kpi-incidents').forEach(el => el.textContent = city.kpis.activeIncidents);
    document.querySelectorAll('.kpi-aqi').forEach(el => el.textContent = city.kpis.airQualityIndex);
  }

  // 1. AI Congestion Prediction Setup
  setupPredictionControls() {
    const hourSlider = document.getElementById('predictHour');
    const hourDisplay = document.getElementById('predictHourDisplay');
    const weatherSelect = document.getElementById('predictWeather');
    const eventSelect = document.getElementById('predictEvent');
    const daySelect = document.getElementById('predictDay');
    const runBtn = document.getElementById('runPredictBtn');

    if (hourSlider && hourDisplay) {
      hourSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        const period = val >= 12 ? (val === 12 ? '12 PM' : `${val - 12} PM`) : (val === 0 ? '12 AM' : `${val} AM`);
        hourDisplay.textContent = `${period} (${val}:00 hrs)`;
        this.runAIPrediction();
      });
    }

    [weatherSelect, eventSelect, daySelect].forEach(ctrl => {
      if (ctrl) ctrl.addEventListener('change', () => this.runAIPrediction());
    });

    if (runBtn) {
      runBtn.addEventListener('click', () => this.runAIPrediction());
    }
  }

  runAIPrediction() {
    const hour = parseInt(document.getElementById('predictHour')?.value || '17', 10);
    const weather = document.getElementById('predictWeather')?.value || 'clear';
    const event = document.getElementById('predictEvent')?.value || 'none';
    const day = document.getElementById('predictDay')?.value || 'weekday';

    const result = this.aiPredictor.predict({
      cityId: this.currentCityId,
      hour,
      weather,
      event,
      day
    });

    // Update Result UI Cards
    const indexEl = document.getElementById('predCongestionIndex');
    const speedEl = document.getElementById('predSpeed');
    const delayEl = document.getElementById('predDelay');
    const confEl = document.getElementById('predConfidence');
    const recEl = document.getElementById('predRecommendation');

    if (indexEl) {
      indexEl.textContent = `${result.congestionIndex}%`;
      indexEl.className = `pred-metric-value text-${result.statusClass === 'critical' ? 'rose' : result.statusClass === 'moderate' ? 'amber' : 'emerald'}`;
    }
    if (speedEl) speedEl.textContent = `${result.predictedSpeed} km/h (-${result.speedLossPercentage}%)`;
    if (delayEl) delayEl.textContent = `+${result.addedDelayMinutes} mins / 10km`;
    if (confEl) confEl.textContent = `${result.confidence}%`;
    if (recEl) recEl.textContent = result.recommendation;

    // Render 24-Hour Predictive Timeline Chart
    this.analyticsCharts.renderPredictiveChart('predTimelineChart', result.trendline);
  }

  // 2. Smart Routing Setup
  setupRoutingControls() {
    this.populateRouteWaypoints(this.currentCityId);

    const calcBtn = document.getElementById('calcRouteBtn');
    if (calcBtn) {
      calcBtn.addEventListener('click', () => this.calculateSmartRoutes());
    }

    // Tab buttons inside routing view (Fastest vs Eco vs Arterial)
    document.querySelectorAll('.route-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = btn.getAttribute('data-route-type');
        document.querySelectorAll('.route-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectRouteOption(type);
      });
    });
  }

  populateRouteWaypoints(cityId) {
    const city = SOUTH_INDIA_DATA.cities[cityId];
    if (!city || !city.landmarks) return;

    const originSelect = document.getElementById('routeOrigin');
    const destSelect = document.getElementById('routeDest');

    if (originSelect && destSelect) {
      originSelect.innerHTML = '';
      destSelect.innerHTML = '';

      city.landmarks.forEach((lm, idx) => {
        const opt1 = document.createElement('option');
        opt1.value = lm.id;
        opt1.textContent = lm.name;
        originSelect.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = lm.id;
        opt2.textContent = lm.name;
        destSelect.appendChild(opt2);
      });

      // Default select different origin & dest
      if (originSelect.options.length > 0) originSelect.selectedIndex = 0;
      if (destSelect.options.length > 1) destSelect.selectedIndex = 1;
    }
  }

  calculateSmartRoutes() {
    const originId = document.getElementById('routeOrigin')?.value;
    const destId = document.getElementById('routeDest')?.value;

    if (originId === destId) {
      this.showToast('⚠️ Please select different Origin and Destination locations.', 'warning');
      return;
    }

    const calculation = this.routeOptimizer.calculateRoutes(this.currentCityId, originId, destId);
    if (!calculation) return;

    this.currentRouteData = calculation;

    // Update Route Summary Cards
    const f = calculation.routes.fastest;
    const e = calculation.routes.eco;
    const a = calculation.routes.arterial;

    const fCard = document.getElementById('card-route-fastest');
    const eCard = document.getElementById('card-route-eco');
    const aCard = document.getElementById('card-route-arterial');

    if (fCard) fCard.innerHTML = `
      <div class="route-type-badge text-cyan">${f.badge}</div>
      <div class="route-eta">${f.durationMins} <small>mins</small></div>
      <div class="route-meta"><span>${f.distanceKm} km</span> • <span>${f.avgSpeedKmH} km/h avg</span></div>
      <div class="route-savings">Signals: ${f.signalStops} • CO₂: ${f.co2EmissionsKg}kg</div>
    `;

    if (eCard) eCard.innerHTML = `
      <div class="route-type-badge text-emerald">${e.badge}</div>
      <div class="route-eta">${e.durationMins} <small>mins</small></div>
      <div class="route-meta"><span>${e.distanceKm} km</span> • <span>${e.avgSpeedKmH} km/h avg</span></div>
      <div class="route-savings">Saved: <strong>${e.fuelSavedLiters}L fuel</strong> (${e.co2SavedGrams}g CO₂)</div>
    `;

    if (aCard) aCard.innerHTML = `
      <div class="route-type-badge text-indigo">${a.badge}</div>
      <div class="route-eta">${a.durationMins} <small>mins</small></div>
      <div class="route-meta"><span>${a.distanceKm} km</span> • <span>${a.avgSpeedKmH} km/h avg</span></div>
      <div class="route-savings">Zero Active Incident Bottlenecks</div>
    `;

    // Render Steps for selected route
    this.selectRouteOption('fastest');
    this.showToast('✅ 3 Optimal Routes calculated successfully!');
  }

  selectRouteOption(routeType) {
    if (!this.currentRouteData || !this.currentRouteData.routes[routeType]) return;
    const route = this.currentRouteData.routes[routeType];

    // Render Turn-by-Turn Steps
    const stepsContainer = document.getElementById('routeStepsList');
    if (stepsContainer) {
      stepsContainer.innerHTML = '';
      route.steps.forEach((step, idx) => {
        const item = document.createElement('div');
        item.className = 'route-step-item';
        item.innerHTML = `
          <div class="step-num">${idx + 1}</div>
          <div class="step-content">
            <p>${step.instruction}</p>
            <span class="step-dist">${step.distance}</span>
          </div>
        `;
        stepsContainer.appendChild(item);
      });
    }

    // If map is active, draw polyline on map
    if (this.mapEngine) {
      this.mapEngine.drawRoute(routeType, route.coordinates, {
        originName: this.currentRouteData.originName,
        destName: this.currentRouteData.destName
      });
    }
  }

  // 3. Emergency Green Wave Corridor Setup
  setupEmergencyControls() {
    this.populateHospitalDropdown(this.currentCityId);

    const triggerBtn = document.getElementById('startEmergencyBtn');
    const stopBtn = document.getElementById('stopEmergencyBtn');
    const muteBtn = document.getElementById('muteSirenBtn');

    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => this.startEmergencyCorridor());
    }
    if (stopBtn) {
      stopBtn.addEventListener('click', () => this.stopEmergencyCorridor());
    }
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        const isMuted = this.emergencySystem.toggleMute();
        muteBtn.textContent = isMuted ? '🔇 Unmute Siren' : '🔊 Mute Siren';
        muteBtn.classList.toggle('btn-secondary', isMuted);
      });
    }
  }

  populateHospitalDropdown(cityId) {
    const city = SOUTH_INDIA_DATA.cities[cityId];
    if (!city || !city.hospitals) return;

    const hospitalSelect = document.getElementById('emergencyHospital');
    if (hospitalSelect) {
      hospitalSelect.innerHTML = '';
      city.hospitals.forEach(h => {
        const opt = document.createElement('option');
        opt.value = h.id;
        opt.textContent = `${h.name} (${h.type.toUpperCase()})`;
        hospitalSelect.appendChild(opt);
      });
    }
  }

  startEmergencyCorridor() {
    const vehicleType = document.getElementById('emergencyVehicleType')?.value || 'ambulance';
    const hospitalId = document.getElementById('emergencyHospital')?.value;

    const mission = this.emergencySystem.launchCorridor({
      cityId: this.currentCityId,
      vehicleType,
      hospitalId
    });

    // Update Status Banner
    const banner = document.getElementById('emergencyStatusBanner');
    const liveTelemetry = document.getElementById('emergencyTelemetry');
    if (banner) {
      banner.style.display = 'block';
      banner.className = 'emergency-banner active-emergency';
      banner.innerHTML = `
        <div class="banner-content">
          <div class="banner-title">🚨 GREEN WAVE ACTIVE: ${vehicleType.toUpperCase()} PRIORITY PRE-EMPTION</div>
          <p>Upcoming 4 Traffic Signals Forced Solid GREEN. Conflicting Arterial Traffic Halted.</p>
        </div>
      `;
    }

    if (liveTelemetry) liveTelemetry.style.display = 'grid';

    // Draw on Map Engine if initialized
    if (this.mapEngine) {
      this.mapEngine.drawEmergencyCorridor(mission.corridorCoords, mission);
    }

    // Start Telemetry Countdown
    if (this.emergencyInterval) clearInterval(this.emergencyInterval);
    this.emergencyInterval = setInterval(() => {
      if (!this.emergencySystem.activeMission) {
        clearInterval(this.emergencyInterval);
        return;
      }
      mission.remainingSec -= 2;
      mission.clearedSignals = Math.min(4, Math.floor((mission.totalSec - mission.remainingSec) / (mission.totalSec / 4)));
      mission.progressPercent = Math.min(100, Math.round(((mission.totalSec - mission.remainingSec) / mission.totalSec) * 100));

      const timeEl = document.getElementById('emEtaCountdown');
      const distEl = document.getElementById('emDistCleared');
      const signalsEl = document.getElementById('emSignalsPreempted');
      const yieldEl = document.getElementById('emYieldRate');

      if (timeEl) timeEl.textContent = `${Math.max(0, Math.floor(mission.remainingSec / 60))}:${(mission.remainingSec % 60).toString().padStart(2, '0')}`;
      if (distEl) distEl.textContent = `${((mission.totalDistanceKm * mission.progressPercent) / 100).toFixed(1)} / ${mission.totalDistanceKm} km`;
      if (signalsEl) signalsEl.textContent = `${mission.clearedSignals} / 4 All Green`;
      if (yieldEl) yieldEl.textContent = `${mission.yieldComplianceRate}%`;

      if (mission.remainingSec <= 0) {
        this.stopEmergencyCorridor();
        this.showToast('✅ Emergency vehicle successfully arrived at Trauma Center!', 'success');
      }
    }, 1000);

    this.showToast(`🚨 Priority Green Wave Corridor Activated for ${vehicleType.toUpperCase()}`, 'critical');
  }

  stopEmergencyCorridor() {
    if (this.emergencyInterval) {
      clearInterval(this.emergencyInterval);
      this.emergencyInterval = null;
    }
    this.emergencySystem.clearMission();

    const banner = document.getElementById('emergencyStatusBanner');
    const liveTelemetry = document.getElementById('emergencyTelemetry');
    if (banner) banner.style.display = 'none';
    if (liveTelemetry) liveTelemetry.style.display = 'none';

    if (this.mapEngine) {
      this.mapEngine.clearEmergencyCorridor();
    }

    this.showToast('Corridor released. Signals restored to normal adaptive cycle.');
  }

  // 4. Adaptive Signal Controller Setup
  setupSignalControls() {
    const city = SOUTH_INDIA_DATA.cities[this.currentCityId];
    if (city && city.junctions.length > 0) {
      this.signalController.loadJunction(city.junctions[0].id, this.currentCityId);
      this.updateSignalView();
    }

    // Mode Toggle
    document.querySelectorAll('.signal-mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = btn.getAttribute('data-signal-mode');
        document.querySelectorAll('.signal-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.signalController.setMode(mode);
        this.updateSignalView();
      });
    });

    // Arm Sliders (North, South, East, West queue adjustments)
    ['north', 'south', 'east', 'west'].forEach(arm => {
      const slider = document.getElementById(`armSlider_${arm}`);
      const valDisplay = document.getElementById(`armVal_${arm}`);
      if (slider && valDisplay) {
        slider.addEventListener('input', (e) => {
          valDisplay.textContent = `${e.target.value} veh`;
          const customArms = {
            north: parseInt(document.getElementById('armSlider_north').value, 10),
            south: parseInt(document.getElementById('armSlider_south').value, 10),
            east: parseInt(document.getElementById('armSlider_east').value, 10),
            west: parseInt(document.getElementById('armSlider_west').value, 10)
          };
          this.signalController.calculateTimingSplit(customArms);
          this.updateSignalView();
        });
      }
    });

    // Manual Police Override buttons
    document.querySelectorAll('.btn-override-arm').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const arm = btn.getAttribute('data-arm');
        this.signalController.applyManualGreen(arm, 60);
        this.updateSignalView();
        this.showToast(`👮 Manual Override: Forced 60s Green on ${arm.toUpperCase()} approach`);
      });
    });
  }

  openSignalOptimization(junctionId) {
    this.switchTab('signal');
    this.signalController.loadJunction(junctionId, this.currentCityId);
    this.updateSignalView();
  }

  updateSignalView() {
    const data = this.signalController.calculateTimingSplit();
    if (!data) return;

    const jNameEl = document.getElementById('signalJunctionName');
    if (jNameEl) jNameEl.textContent = data.junction.name;

    // Update Split Times & Arms visual
    ['north', 'south', 'east', 'west'].forEach(arm => {
      const timeEl = document.getElementById(`greenTime_${arm}`);
      if (timeEl) timeEl.textContent = `${data.greenSplits[arm]}s Green`;

      const bar = document.getElementById(`splitBar_${arm}`);
      if (bar) bar.style.width = `${(data.greenSplits[arm] / 120) * 100 * 2}%`;
    });

    // Update Savings
    const waitRedEl = document.getElementById('sigWaitReduction');
    const queueBoostEl = document.getElementById('sigQueueBoost');
    const fuelSavedEl = document.getElementById('sigFuelSaved');
    const co2SavedEl = document.getElementById('sigCo2Saved');

    if (waitRedEl) waitRedEl.textContent = `-${data.metrics.reductionPercent}% Wait Time`;
    if (queueBoostEl) queueBoostEl.textContent = `+${data.metrics.queueClearanceBoostPercent}% Flow`;
    if (fuelSavedEl) fuelSavedEl.textContent = `${data.metrics.idleFuelSavedPerHourLiters} L/hr`;
    if (co2SavedEl) co2SavedEl.textContent = `${data.metrics.co2ReductionPerHourKg} kg/hr`;
  }

  // 5. Incident Reporting & Live Feed Setup
  setupIncidentForm() {
    const form = document.getElementById('reportIncidentForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const type = document.getElementById('incidentType').value;
        const title = document.getElementById('incidentTitle').value;
        const loc = document.getElementById('incidentLocation').value;
        const lat = parseFloat(document.getElementById('incidentLat').value || '17.385');
        const lng = parseFloat(document.getElementById('incidentLng').value || '78.486');
        const severity = document.getElementById('incidentSeverity').value;
        const delay = parseInt(document.getElementById('incidentDelay').value || '15', 10);
        const desc = document.getElementById('incidentDesc').value;

        const newAlert = this.incidentManager.reportIncident({
          cityId: this.currentCityId,
          type,
          title,
          locationName: loc,
          coords: [lat, lng],
          severity,
          delayMinutes: delay,
          description: desc
        });

        // Add to live map
        if (this.mapEngine) {
          this.mapEngine.addNewIncident({
            id: newAlert.id,
            type: newAlert.type,
            title: newAlert.title,
            coords: newAlert.coords,
            severity: newAlert.severity,
            timestamp: 'Just now',
            status: 'Broadcasted',
            impactRadiusMeters: 300,
            delayMinutes: delay,
            description: desc
          });
        }

        this.renderAlertsList();
        form.reset();
        this.showToast('🚨 Incident successfully broadcasted to Live Command Center & Alert Ticker!', 'critical');
      });
    }

    // Filter alerts
    const severityFilter = document.getElementById('alertSeverityFilter');
    if (severityFilter) {
      severityFilter.addEventListener('change', () => this.renderAlertsList());
    }
  }

  renderAlertsList() {
    const filter = document.getElementById('alertSeverityFilter')?.value || 'all';
    const alerts = this.incidentManager.getAlerts(this.currentCityId, filter);
    const container = document.getElementById('alertsListFeed');
    if (!container) return;

    container.innerHTML = '';
    if (alerts.length === 0) {
      container.innerHTML = '<div class="no-alerts-msg">No active traffic incidents in this filter category.</div>';
      return;
    }

    alerts.forEach(alt => {
      const card = document.createElement('div');
      card.className = `alert-feed-card alert-severity-${alt.severity}`;
      const icon = alt.type === 'accident' ? '💥' : alt.type === 'waterlogging' ? '🌊' : alt.type === 'roadwork' ? '🚧' : '⚠️';

      card.innerHTML = `
        <div class="alert-feed-header">
          <div class="alert-feed-title">${icon} ${alt.title}</div>
          <span class="badge badge-${alt.severity}">${alt.severity.toUpperCase()}</span>
        </div>
        <div class="alert-feed-body">
          <div class="alert-loc">📍 ${alt.location} (${alt.cityName})</div>
          <div class="alert-subinfo">
            <span>⏱️ ${alt.timeAgo}</span> • 
            <span class="text-rose font-bold">${alt.delay}</span> • 
            <span class="text-emerald">${alt.status}</span>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // 6. Pollution Model
  runPollutionModel() {
    const metrics = this.pollutionModel.calculateCityPollution(this.currentCityId);
    if (!metrics) return;

    const aqiNumEl = document.getElementById('pollutionAqiVal');
    const aqiCatEl = document.getElementById('pollutionAqiCat');
    const aqiAdvEl = document.getElementById('pollutionHealthAdvisory');

    if (aqiNumEl) aqiNumEl.textContent = metrics.currentAqi;
    if (aqiCatEl) {
      aqiCatEl.textContent = metrics.aqiCategory;
      aqiCatEl.className = `badge ${metrics.aqiBadgeClass}`;
    }
    if (aqiAdvEl) aqiAdvEl.textContent = metrics.healthAdvisory;

    // Pollutants
    const p = metrics.pollutants;
    const pm25El = document.getElementById('polPM25');
    const pm10El = document.getElementById('polPM10');
    const coEl = document.getElementById('polCO');
    const no2El = document.getElementById('polNO2');

    if (pm25El) pm25El.textContent = `${p.pm25.value} ${p.pm25.unit}`;
    if (pm10El) pm10El.textContent = `${p.pm10.value} ${p.pm10.unit}`;
    if (coEl) coEl.textContent = `${p.co.value} ${p.co.unit}`;
    if (no2El) no2El.textContent = `${p.no2.value} ${p.no2.unit}`;

    // Hourly Emissions
    const em = metrics.hourlyEmissions;
    const co2El = document.getElementById('polHourlyCO2');
    const noxEl = document.getElementById('polHourlyNOx');
    const treeEl = document.getElementById('polAnnualTrees');
    const fuelSavedEl = document.getElementById('polDailyFuelSaved');

    if (co2El) co2El.textContent = `${em.co2KgPerHour} kg/hr`;
    if (noxEl) noxEl.textContent = `${em.noxKgPerHour} kg/hr`;
    if (treeEl) treeEl.textContent = `${metrics.ecoSavings.annualTreesEquivalent.toLocaleString()} Trees`;
    if (fuelSavedEl) fuelSavedEl.textContent = `${metrics.ecoSavings.dailyFuelSavedByAILiters} L/day`;
  }

  // 7. Admin Analytics Dashboard
  renderAdminAnalytics() {
    this.analyticsCharts.renderVolumeSpeedChart('adminVolumeSpeedChart', this.currentCityId);
    this.analyticsCharts.renderVehicleSplitChart('adminVehicleSplitChart');
    this.analyticsCharts.renderPeakHoursChart('adminPeakHoursChart', this.currentCityId);
    this.analyticsCharts.renderIncidentHotspotChart('adminIncidentHotspotChart', this.currentCityId);

    // Populate Admin Incident Action Table
    const tableBody = document.getElementById('adminIncidentTableBody');
    if (tableBody) {
      tableBody.innerHTML = '';
      const city = SOUTH_INDIA_DATA.cities[this.currentCityId];
      if (city && city.incidents) {
        city.incidents.forEach(inc => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td><strong>${inc.title}</strong></td>
            <td><span class="badge badge-${inc.severity}">${inc.severity.toUpperCase()}</span></td>
            <td>+${inc.delayMinutes} mins</td>
            <td><span class="text-amber">${inc.status}</span></td>
            <td>
              <button class="btn btn-xs btn-outline" onclick="window.TrafficApp.showToast('Patrol Squad Dispatched!')">🚓 Patrol</button>
              <button class="btn btn-xs btn-primary" onclick="window.TrafficApp.showToast('Incident marked Resolved!')">✓ Resolve</button>
            </td>
          `;
          tableBody.appendChild(row);
        });
      }
    }
  }

  // 8. Demo Scenarios for B.Tech Mini Project Showcase
  setupDemoScenarios() {
    const container = document.getElementById('demoScenariosContainer');
    if (!container) return;
    container.innerHTML = '';

    SOUTH_INDIA_DATA.demoScenarios.forEach(sc => {
      const card = document.createElement('div');
      card.className = 'demo-scenario-card';
      card.innerHTML = `
        <div class="demo-card-header">
          <span class="demo-badge">🎬 DEMO PRESET</span>
          <h4>${sc.name}</h4>
        </div>
        <p class="demo-desc">${sc.description}</p>
        <button class="btn btn-sm btn-primary" onclick="window.TrafficApp.launchDemoScenario('${sc.id}')">
          ▶ Run Showcase Simulation
        </button>
      `;
      container.appendChild(card);
    });
  }

  launchDemoScenario(scenarioId) {
    const sc = SOUTH_INDIA_DATA.demoScenarios.find(s => s.id === scenarioId);
    if (!sc) return;

    this.setCity(sc.cityId);

    // Set AI Prediction controls to match scenario
    const hourSlider = document.getElementById('predictHour');
    const weatherSelect = document.getElementById('predictWeather');
    const eventSelect = document.getElementById('predictEvent');

    if (hourSlider) hourSlider.value = sc.hour;
    if (weatherSelect) weatherSelect.value = sc.weather;
    if (eventSelect) eventSelect.value = sc.event;

    // Switch to Live Map
    this.switchTab('live-map');
    this.showToast(`🎬 Activated Showcase Scenario: ${sc.name}`, 'success');

    // If Chennai ambulance demo, trigger green wave automatically
    if (sc.id === 'chn_kathipara_ambulance') {
      setTimeout(() => {
        this.switchTab('emergency');
        this.startEmergencyCorridor();
      }, 800);
    }
  }

  // 9. Live Ticker
  setupTicker() {
    const tickerEl = document.getElementById('topAlertTicker');
    if (!tickerEl) return;

    const updateTicker = () => {
      const alerts = this.incidentManager.alerts;
      if (alerts.length > 0) {
        const textItems = alerts.map(a => `🔴 [${a.cityName.toUpperCase()}] ${a.title} (${a.delay})`).join('  •  ');
        tickerEl.textContent = textItems;
      }
    };
    updateTicker();
    setInterval(updateTicker, 15000);
  }

  // 10. Report Export
  setupReportExport() {
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const exportCsvBtn = document.getElementById('exportCsvBtn');

    if (exportPdfBtn) {
      exportPdfBtn.addEventListener('click', () => {
        window.print();
      });
    }

    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
        const city = SOUTH_INDIA_DATA.cities[this.currentCityId];
        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += 'City,Junction Name,Density (%),Vehicles Per Min,Current Signal,AQI\n';
        city.junctions.forEach(j => {
          csvContent += `"${city.name}","${j.name}",${j.density},${j.vehiclesPerMin},"${j.currentSignal}",${j.aqi}\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${city.id}_traffic_report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.showToast('📥 Smart City Traffic Report CSV Downloaded!');
      });
    }
  }

  // Toast Notification
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `stms-toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-fadeout');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.TrafficApp = new SmartTrafficApp();
  window.TrafficApp.init();
});
