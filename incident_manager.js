/**
 * Smart Traffic Management System - Incident & Congestion Alert Manager
 * Handles citizen & operator incident reporting, live broadcasts, and alert feeds.
 */

class IncidentManager {
  constructor() {
    this.alerts = [];
    this.initSampleAlerts();
  }

  initSampleAlerts() {
    this.alerts = [
      {
        id: 'ALT_101',
        cityId: 'hyderabad',
        cityName: 'Hyderabad',
        type: 'accident',
        title: 'Collision on Cyber Towers Flyover Ramp',
        location: 'Hitec City, Mindspace road',
        coords: [17.4490, 78.3780],
        severity: 'critical',
        timeAgo: '8 mins ago',
        delay: '+25 mins delay',
        status: 'Patrol Active'
      },
      {
        id: 'ALT_102',
        cityId: 'bengaluru',
        cityName: 'Bengaluru',
        type: 'breakdown',
        title: 'BMTC Bus Breakdown near Silk Board Inflow',
        location: 'Central Silk Board Junction',
        coords: [12.9190, 77.6250],
        severity: 'critical',
        timeAgo: '14 mins ago',
        delay: '+35 mins delay',
        status: 'Towing Dispatched'
      },
      {
        id: 'ALT_103',
        cityId: 'chennai',
        cityName: 'Chennai',
        type: 'waterlogging',
        title: 'Waterlogging under Vyasarpadi GKM Underpass',
        location: 'Vyasarpadi Underpass',
        coords: [13.1120, 80.2610],
        severity: 'moderate',
        timeAgo: '26 mins ago',
        delay: '+15 mins delay',
        status: 'Pumping En Route'
      },
      {
        id: 'ALT_104',
        cityId: 'kochi',
        cityName: 'Kochi',
        type: 'waterlogging',
        title: 'Monsoon Runoff on Edappally Bypass Ramp',
        location: 'Edappally Toll, Lulu Mall Bypass',
        coords: [10.0220, 76.3090],
        severity: 'moderate',
        timeAgo: '32 mins ago',
        delay: '+18 mins delay',
        status: 'Drainage Squad Active'
      },
      {
        id: 'ALT_105',
        cityId: 'vijayawada',
        cityName: 'Vijayawada',
        type: 'roadwork',
        title: 'Culvert Repair near Auto Nagar 100ft Road',
        location: 'Auto Nagar Gate',
        coords: [16.4930, 80.6750],
        severity: 'low',
        timeAgo: '45 mins ago',
        delay: '+10 mins delay',
        status: 'Traffic Diverted'
      }
    ];
  }

  getAlerts(cityId = null, severity = 'all') {
    return this.alerts.filter(a => {
      const matchCity = !cityId || cityId === 'all' || a.cityId === cityId;
      const matchSeverity = severity === 'all' || a.severity === severity;
      return matchCity && matchSeverity;
    });
  }

  reportIncident(data) {
    const {
      cityId = 'hyderabad',
      type = 'accident',
      title,
      locationName,
      coords,
      severity = 'moderate',
      delayMinutes = 15,
      description = ''
    } = data;

    const city = SOUTH_INDIA_DATA.cities[cityId] || SOUTH_INDIA_DATA.cities.hyderabad;

    const newAlert = {
      id: 'ALT_' + Date.now().toString().slice(-4),
      cityId,
      cityName: city.name,
      type,
      title: title || `Reported ${type} near ${locationName || 'corridor'}`,
      location: locationName || `${city.name} Central Zone`,
      coords: coords || city.center,
      severity,
      timeAgo: 'Just now',
      delay: `+${delayMinutes} mins delay`,
      status: 'Broadcasted to Command Center',
      description
    };

    this.alerts.unshift(newAlert);
    return newAlert;
  }

  resolveAlert(alertId) {
    const idx = this.alerts.findIndex(a => a.id === alertId);
    if (idx !== -1) {
      this.alerts[idx].status = 'Resolved';
      return this.alerts[idx];
    }
    return null;
  }
}

window.IncidentManager = IncidentManager;
