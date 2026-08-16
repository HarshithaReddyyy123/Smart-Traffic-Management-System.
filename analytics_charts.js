/**
 * Smart Traffic Management System - Analytics & Charts Engine (Chart.js)
 */

class AnalyticsCharts {
  constructor() {
    this.charts = {};
  }

  destroyChart(id) {
    if (this.charts[id]) {
      this.charts[id].destroy();
      delete this.charts[id];
    }
  }

  // 1. 24-Hour Traffic Volume & Average Speed Curve
  renderVolumeSpeedChart(canvasId, cityId = 'hyderabad') {
    this.destroyChart(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const city = SOUTH_INDIA_DATA.cities[cityId] || SOUTH_INDIA_DATA.cities.hyderabad;
    const labels = ['12 AM', '2 AM', '4 AM', '6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM'];
    
    // Realistic curve scaling to city baseline
    const baseMult = city.kpis.congestionIndex / 60;
    const volumeData = [1200, 600, 450, 2100, 6800, 7400, 5200, 4800, 6500, 8900, 7100, 3200].map(v => Math.round(v * baseMult));
    const speedData = [45, 48, 50, 42, 21, 19, 28, 30, 22, 16, 20, 36].map(s => Math.max(12, Math.round(s / (baseMult * 0.9))));

    const ctx = canvas.getContext('2d');
    this.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Vehicles / Hour',
            data: volumeData,
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.15)',
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            yAxisID: 'y'
          },
          {
            label: 'Avg Speed (km/h)',
            data: speedData,
            borderColor: '#f59e0b',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.35,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b', font: { family: 'Inter', size: 10 } }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#06b6d4', font: { family: 'Inter', size: 10 } },
            title: { display: true, text: 'Vehicles / Hr', color: '#06b6d4' }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { color: '#f59e0b', font: { family: 'Inter', size: 10 } },
            title: { display: true, text: 'Speed (km/h)', color: '#f59e0b' }
          }
        }
      }
    });
  }

  // 2. Vehicle Class Split (Doughnut)
  renderVehicleSplitChart(canvasId) {
    this.destroyChart(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    this.charts[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Two-Wheelers (48%)', 'Auto-Rickshaws (16%)', 'Cars & Cabs (26%)', 'Buses (6%)', 'Trucks & Freight (4%)'],
        datasets: [{
          data: [48, 16, 26, 6, 4],
          backgroundColor: ['#06b6d4', '#10b981', '#6366f1', '#f59e0b', '#ef4444'],
          borderWidth: 2,
          borderColor: '#111827'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#94a3b8', boxWidth: 12, font: { family: 'Inter', size: 11 } }
          }
        },
        cutout: '70%'
      }
    });
  }

  // 3. Peak Hours Breakdown (Bar)
  renderPeakHoursChart(canvasId, cityId = 'hyderabad') {
    this.destroyChart(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    this.charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Morning Peak (8-11 AM)', 'Mid-Day (12-4 PM)', 'Evening Peak (5-9 PM)', 'Night Shift (10 PM-2 AM)'],
        datasets: [{
          label: 'Congestion Index (%)',
          data: [86, 52, 94, 38],
          backgroundColor: ['#f59e0b', '#10b981', '#ef4444', '#06b6d4'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8', font: { family: 'Inter', size: 10 } }
          },
          y: {
            max: 100,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b', font: { family: 'Inter', size: 10 } }
          }
        }
      }
    });
  }

  // 4. Hotspot Junction Incident Frequency
  renderIncidentHotspotChart(canvasId, cityId = 'hyderabad') {
    this.destroyChart(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const city = SOUTH_INDIA_DATA.cities[cityId] || SOUTH_INDIA_DATA.cities.hyderabad;
    const topJunctions = city.junctions.slice(0, 4);
    const labels = topJunctions.map(j => j.name.split(' ')[0] + ' ' + (j.name.split(' ')[1] || ''));
    const data = topJunctions.map(j => Math.round(j.density * 0.18 + 4));

    const ctx = canvas.getContext('2d');
    this.charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Incidents Reported (30 Days)',
          data: data,
          backgroundColor: '#8b5cf6',
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b', font: { family: 'Inter', size: 10 } }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#94a3b8', font: { family: 'Inter', size: 10 } }
          }
        }
      }
    });
  }

  // 5. Predictive Timeline Curve
  renderPredictiveChart(canvasId, trendline) {
    this.destroyChart(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

    const ctx = canvas.getContext('2d');
    this.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: hours,
        datasets: [{
          label: 'AI Projected Congestion (%)',
          data: trendline,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.35,
          pointRadius: 2,
          pointHoverRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b', font: { family: 'Inter', size: 9 }, maxTicksLimit: 12 }
          },
          y: {
            min: 0,
            max: 100,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b', font: { family: 'Inter', size: 9 } }
          }
        }
      }
    });
  }
}

window.AnalyticsCharts = AnalyticsCharts;
