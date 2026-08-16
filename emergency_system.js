/**
 * Smart Traffic Management System - Emergency Vehicle Priority & Green Wave Engine
 * Manages Green Corridors for Ambulance, Fire Rescue, and Police.
 * Includes Web Audio API real-time siren synthesizer and signal pre-emption controller.
 */

class EmergencySystem {
  constructor() {
    this.activeMission = null;
    this.audioCtx = null;
    this.oscillator = null;
    this.gainNode = null;
    this.sirenInterval = null;
    this.isAudioMuted = false;
    this.progressInterval = null;
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playSiren(vehicleType = 'ambulance') {
    if (this.isAudioMuted) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      this.stopSiren(); // ensure no overlapping oscillators

      this.oscillator = this.audioCtx.createOscillator();
      this.gainNode = this.audioCtx.createGain();

      this.oscillator.type = 'sawtooth';
      this.gainNode.gain.setValueAtTime(0.08, this.audioCtx.currentTime); // gentle volume

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);
      this.oscillator.start();

      let high = false;
      const baseFreq = vehicleType === 'ambulance' ? 650 : vehicleType === 'fire' ? 480 : 800;
      const peakFreq = vehicleType === 'ambulance' ? 950 : vehicleType === 'fire' ? 750 : 1100;

      this.sirenInterval = setInterval(() => {
        if (!this.oscillator || !this.audioCtx) return;
        const targetFreq = high ? baseFreq : peakFreq;
        this.oscillator.frequency.exponentialRampToValueAtTime(targetFreq, this.audioCtx.currentTime + 0.35);
        high = !high;
      }, 400);
    } catch (e) {
      console.warn('Audio siren synthesis error:', e);
    }
  }

  stopSiren() {
    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
    if (this.oscillator) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
      } catch (e) {}
      this.oscillator = null;
    }
    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch (e) {}
      this.gainNode = null;
    }
  }

  toggleMute() {
    this.isAudioMuted = !this.isAudioMuted;
    if (this.isAudioMuted) {
      this.stopSiren();
    } else if (this.activeMission) {
      this.playSiren(this.activeMission.vehicleType);
    }
    return this.isAudioMuted;
  }

  /**
   * Launch Emergency Green Corridor
   */
  launchCorridor(params) {
    const {
      cityId = 'hyderabad',
      vehicleType = 'ambulance', // ambulance, fire, police
      hospitalId,
      destinationName,
      destinationCoords
    } = params;

    const city = SOUTH_INDIA_DATA.cities[cityId] || SOUTH_INDIA_DATA.cities.hyderabad;
    const hospital = (city.hospitals && city.hospitals.find(h => h.id === hospitalId)) || (city.hospitals && city.hospitals[0]) || {
      name: 'Emergency Dispatch Base',
      coords: city.center
    };

    const destCoords = destinationCoords || (city.landmarks[2] ? city.landmarks[2].coords : city.center);
    const destName = destinationName || (city.landmarks[2] ? city.landmarks[2].name : 'Incident Location');

    // Create corridor route coordinates passing through junctions
    const corridorCoords = [
      hospital.coords,
      ...city.junctions.slice(0, 3).map(j => j.coords),
      destCoords
    ];

    const totalDistanceKm = 8.4;
    const estimatedTimeSec = 240; // 4 minutes under green wave (normally 12 mins)

    this.activeMission = {
      id: 'MISSION_' + Date.now().toString().slice(-4),
      cityId,
      vehicleType,
      hospitalName: hospital.name,
      destinationName: destName,
      corridorCoords,
      totalDistanceKm,
      remainingSec: estimatedTimeSec,
      totalSec: estimatedTimeSec,
      progressPercent: 0,
      clearedSignals: 0,
      totalSignals: city.junctions.length > 4 ? 4 : city.junctions.length,
      yieldComplianceRate: 98.4,
      status: 'ACTIVE_GREEN_WAVE'
    };

    // Pre-empt signals in city: force relevant junctions to GREEN
    city.junctions.forEach((j, i) => {
      if (i < 4) {
        j.currentSignal = 'green';
        j.timerRemaining = 120; // extended green wave
      }
    });

    // Play siren sound
    this.playSiren(vehicleType);

    return this.activeMission;
  }

  /**
   * Clear and Terminate Mission
   */
  clearMission() {
    this.stopSiren();
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    const endedMission = this.activeMission;
    this.activeMission = null;
    return endedMission;
  }
}

window.EmergencySystem = EmergencySystem;
