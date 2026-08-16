/**
 * Smart Traffic Management System - Adaptive Signal Controller
 * Simulates real-time 4-arm junction density, queue length calculations,
 * and AI green-time allocation vs static fixed timers.
 */

class SignalController {
  constructor() {
    this.selectedJunction = null;
    this.mode = 'ai_adaptive'; // ai_adaptive, fixed_timer, manual_override
    this.cycleLength = 120; // total cycle seconds
  }

  loadJunction(junctionId, cityId = 'hyderabad') {
    const city = SOUTH_INDIA_DATA.cities[cityId] || SOUTH_INDIA_DATA.cities.hyderabad;
    this.selectedJunction = city.junctions.find(j => j.id === junctionId) || city.junctions[0];
    return this.calculateTimingSplit();
  }

  /**
   * Calculate AI Green Split based on arm densities (North, South, East, West)
   */
  calculateTimingSplit(customArms = null) {
    if (!this.selectedJunction) return null;

    const arms = customArms || this.selectedJunction.arms || { north: 35, south: 40, east: 30, west: 35 };
    const totalVehicles = arms.north + arms.south + arms.east + arms.west;

    // Minimum green constraint per approach: 15 seconds, Yellow: 4 seconds
    const yellowTime = 4 * 4; // 16s total for 4 arms
    const allocatableGreen = Math.max(40, this.cycleLength - yellowTime);

    let greenSplits = {};
    if (this.mode === 'fixed_timer') {
      // Equal fixed split
      const equalTime = Math.round(allocatableGreen / 4);
      greenSplits = {
        north: equalTime,
        south: equalTime,
        east: equalTime,
        west: equalTime
      };
    } else {
      // AI Adaptive Split: proportional to vehicle queue density
      greenSplits = {
        north: Math.max(15, Math.round((arms.north / totalVehicles) * allocatableGreen)),
        south: Math.max(15, Math.round((arms.south / totalVehicles) * allocatableGreen)),
        east: Math.max(15, Math.round((arms.east / totalVehicles) * allocatableGreen)),
        west: Math.max(15, Math.round((arms.west / totalVehicles) * allocatableGreen))
      };
    }

    // Performance metrics
    const avgWaitTimeFixedSec = 78;
    const avgWaitTimeAISec = Math.round(avgWaitTimeFixedSec * 0.64); // 36% wait time reduction
    const queueClearanceBoostPercent = 32;
    const idleFuelSavedPerHourLiters = parseFloat((totalVehicles * 0.018).toFixed(2));

    return {
      junction: this.selectedJunction,
      mode: this.mode,
      totalVehicles,
      arms,
      greenSplits,
      metrics: {
        avgWaitTimeFixedSec,
        avgWaitTimeAISec,
        reductionPercent: Math.round(((avgWaitTimeFixedSec - avgWaitTimeAISec) / avgWaitTimeFixedSec) * 100),
        queueClearanceBoostPercent,
        idleFuelSavedPerHourLiters,
        co2ReductionPerHourKg: (idleFuelSavedPerHourLiters * 2.39).toFixed(2)
      }
    };
  }

  setMode(mode) {
    this.mode = mode;
    return this.calculateTimingSplit();
  }

  applyManualGreen(armKey, durationSec) {
    if (!this.selectedJunction) return;
    this.mode = 'manual_override';
    this.selectedJunction.currentSignal = 'green';
    this.selectedJunction.timerRemaining = durationSec;
    return this.calculateTimingSplit();
  }
}

window.SignalController = SignalController;
