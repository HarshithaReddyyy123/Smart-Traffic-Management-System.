/**
 * Smart Traffic Management System - South India Geo-Spatial & Simulation Dataset
 * States: Telangana, Andhra Pradesh, Karnataka, Tamil Nadu, Kerala
 * Cities: Hyderabad, Vijayawada, Visakhapatnam, Bengaluru, Chennai, Kochi, Thiruvananthapuram
 */

const SOUTH_INDIA_DATA = {
  states: [
    { id: 'telangana', name: 'Telangana', code: 'TS', cities: ['hyderabad'] },
    { id: 'andhra_pradesh', name: 'Andhra Pradesh', code: 'AP', cities: ['vijayawada', 'visakhapatnam'] },
    { id: 'karnataka', name: 'Karnataka', code: 'KA', cities: ['bengaluru'] },
    { id: 'tamil_nadu', name: 'Tamil Nadu', code: 'TN', cities: ['chennai'] },
    { id: 'kerala', name: 'Kerala', code: 'KL', cities: ['kochi', 'thiruvananthapuram'] }
  ],

  cities: {
    hyderabad: {
      id: 'hyderabad',
      name: 'Hyderabad',
      state: 'Telangana',
      stateCode: 'TS',
      center: [17.3850, 78.4867],
      zoom: 12,
      tagline: 'Cyberabad & Greater Hyderabad Smart Corridor',
      kpis: {
        monitoredCorridors: 42,
        activeSignals: 318,
        avgSpeed: 24.5,
        congestionIndex: 68,
        activeIncidents: 3,
        airQualityIndex: 142,
        emergencyPriorityActive: 1
      },
      landmarks: [
        { id: 'hitec_city', name: 'Hitec City / Cyber Towers', coords: [17.4504, 78.3808] },
        { id: 'gachibowli', name: 'Gachibowli Stadium Circle', coords: [17.4401, 78.3489] },
        { id: 'begumpet', name: 'Begumpet Flyover', coords: [17.4448, 78.4664] },
        { id: 'punjagutta', name: 'Punjagutta Central Junction', coords: [17.4265, 78.4526] },
        { id: 'charminar', name: 'Charminar Heritage Zone', coords: [17.3616, 78.4747] },
        { id: 'jubilee_hills', name: 'Jubilee Hills Check Post', coords: [17.4319, 78.4073] },
        { id: 'secunderabad', name: 'Secunderabad Railway Station', coords: [17.4399, 78.5018] },
        { id: 'lb_nagar', name: 'LB Nagar Ring Road', coords: [17.3457, 78.5522] },
        { id: 'mehdipatnam', name: 'Mehdipatnam Bus Depot', coords: [17.3916, 78.4398] },
        { id: 'dilsukhnagar', name: 'Dilsukhnagar Main Rd', coords: [17.3688, 78.5247] }
      ],
      junctions: [
        {
          id: 'hyd_j1',
          name: 'Cyber Towers Junction (Hitec City)',
          coords: [17.4504, 78.3808],
          density: 88,
          status: 'heavy',
          vehiclesPerMin: 142,
          currentSignal: 'green',
          greenDuration: 75,
          redDuration: 45,
          timerRemaining: 34,
          arms: { north: 48, south: 52, east: 38, west: 62 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 156
        },
        {
          id: 'hyd_j2',
          name: 'Gachibowli ORR Junction',
          coords: [17.4401, 78.3489],
          density: 74,
          status: 'heavy',
          vehiclesPerMin: 120,
          currentSignal: 'red',
          greenDuration: 60,
          redDuration: 50,
          timerRemaining: 18,
          arms: { north: 36, south: 40, east: 44, west: 32 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 138
        },
        {
          id: 'hyd_j3',
          name: 'Punjagutta Circle',
          coords: [17.4265, 78.4526],
          density: 82,
          status: 'heavy',
          vehiclesPerMin: 135,
          currentSignal: 'green',
          greenDuration: 70,
          redDuration: 55,
          timerRemaining: 42,
          arms: { north: 45, south: 48, east: 41, west: 39 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 162
        },
        {
          id: 'hyd_j4',
          name: 'Begumpet Airport Road Junction',
          coords: [17.4448, 78.4664],
          density: 58,
          status: 'medium',
          vehiclesPerMin: 95,
          currentSignal: 'red',
          greenDuration: 55,
          redDuration: 55,
          timerRemaining: 22,
          arms: { north: 28, south: 30, east: 32, west: 26 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 125
        },
        {
          id: 'hyd_j5',
          name: 'Jubilee Hills Check Post',
          coords: [17.4319, 78.4073],
          density: 64,
          status: 'medium',
          vehiclesPerMin: 104,
          currentSignal: 'green',
          greenDuration: 65,
          redDuration: 45,
          timerRemaining: 15,
          arms: { north: 32, south: 34, east: 29, west: 35 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 118
        },
        {
          id: 'hyd_j6',
          name: 'Charminar Nayapul Bridge',
          coords: [17.3680, 78.4750],
          density: 46,
          status: 'medium',
          vehiclesPerMin: 72,
          currentSignal: 'red',
          greenDuration: 45,
          redDuration: 45,
          timerRemaining: 30,
          arms: { north: 22, south: 26, east: 18, west: 24 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 148
        },
        {
          id: 'hyd_j7',
          name: 'Secunderabad Paradise Circle',
          coords: [17.4410, 78.4870],
          density: 32,
          status: 'low',
          vehiclesPerMin: 55,
          currentSignal: 'green',
          greenDuration: 50,
          redDuration: 40,
          timerRemaining: 28,
          arms: { north: 14, south: 16, east: 18, west: 15 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 110
        },
        {
          id: 'hyd_j8',
          name: 'LB Nagar Chintalkunta Junction',
          coords: [17.3457, 78.5522],
          density: 78,
          status: 'heavy',
          vehiclesPerMin: 128,
          currentSignal: 'green',
          greenDuration: 70,
          redDuration: 50,
          timerRemaining: 51,
          arms: { north: 42, south: 38, east: 40, west: 44 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 152
        }
      ],
      incidents: [
        {
          id: 'hyd_inc_1',
          type: 'accident',
          title: 'Multi-Vehicle Collision near Cyber Towers Flyover',
          coords: [17.4490, 78.3780],
          severity: 'critical',
          timestamp: '10 mins ago',
          status: 'Patrol En Route',
          impactRadiusMeters: 400,
          delayMinutes: 25,
          description: 'Car-Auto collision blocking middle and right lanes towards Mindspace.'
        },
        {
          id: 'hyd_inc_2',
          type: 'waterlogging',
          title: 'Monsoon Waterlogging under Begumpet Bridge',
          coords: [17.4420, 78.4630],
          severity: 'moderate',
          timestamp: '28 mins ago',
          status: 'Pumping in Progress',
          impactRadiusMeters: 250,
          delayMinutes: 15,
          description: '1.5 ft water accumulation slow-moving traffic on service road.'
        },
        {
          id: 'hyd_inc_3',
          type: 'roadwork',
          title: 'Metro Phase II Pillar Geotechnical Drilling',
          coords: [17.4380, 78.3540],
          severity: 'low',
          timestamp: '2 hours ago',
          status: 'Diverted',
          impactRadiusMeters: 150,
          delayMinutes: 8,
          description: 'Single lane barricaded for test piling. Slow flow towards Financial Dist.'
        }
      ],
      hospitals: [
        { id: 'hyd_h1', name: 'Apollo Hospitals Jubilee Hills', coords: [17.4260, 78.4120], type: 'trauma' },
        { id: 'hyd_h2', name: 'KIMS Hospitals Secunderabad', coords: [17.4370, 78.4890], type: 'general' },
        { id: 'hyd_h3', name: 'Continental Hospital Gachibowli', coords: [17.4240, 78.3440], type: 'multi-speciality' },
        { id: 'hyd_h4', name: 'NIMS Punjagutta', coords: [17.4220, 78.4540], type: 'state-emergency' }
      ]
    },

    bengaluru: {
      id: 'bengaluru',
      name: 'Bengaluru',
      state: 'Karnataka',
      stateCode: 'KA',
      center: [12.9716, 77.5946],
      zoom: 12,
      tagline: 'Silicon Valley Adaptive Corridor & ORR Green Wave',
      kpis: {
        monitoredCorridors: 56,
        activeSignals: 442,
        avgSpeed: 18.2,
        congestionIndex: 82,
        activeIncidents: 4,
        airQualityIndex: 168,
        emergencyPriorityActive: 2
      },
      landmarks: [
        { id: 'silk_board', name: 'Central Silk Board Junction', coords: [12.9176, 77.6238] },
        { id: 'marathahalli', name: 'Marathahalli ORR Bridge', coords: [12.9569, 77.7011] },
        { id: 'whitefield', name: 'Whitefield ITPL Main Rd', coords: [12.9856, 77.7314] },
        { id: 'hebbal', name: 'Hebbal Flyover Junction', coords: [13.0358, 77.5970] },
        { id: 'electronic_city', name: 'Electronic City Toll Plaza', coords: [12.8452, 77.6602] },
        { id: 'koramangala', name: 'Koramangala Sony World Signal', coords: [12.9352, 77.6245] },
        { id: 'mg_road', name: 'MG Road Trinity Circle', coords: [12.9738, 77.6186] },
        { id: 'tin_factory', name: 'Tin Factory / KR Puram Hanging Bridge', coords: [12.9984, 77.6766] },
        { id: 'majestic', name: 'Kempegowda Majestic Terminal', coords: [12.9767, 77.5713] },
        { id: 'indiranagar', name: 'Indiranagar 100ft Rd Junction', coords: [12.9784, 77.6408] }
      ],
      junctions: [
        {
          id: 'blr_j1',
          name: 'Central Silk Board Junction',
          coords: [12.9176, 77.6238],
          density: 96,
          status: 'heavy',
          vehiclesPerMin: 188,
          currentSignal: 'red',
          greenDuration: 90,
          redDuration: 75,
          timerRemaining: 28,
          arms: { north: 62, south: 58, east: 65, west: 55 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 184
        },
        {
          id: 'blr_j2',
          name: 'Tin Factory - KR Puram Bridge',
          coords: [12.9984, 77.6766],
          density: 92,
          status: 'heavy',
          vehiclesPerMin: 172,
          currentSignal: 'green',
          greenDuration: 85,
          redDuration: 65,
          timerRemaining: 40,
          arms: { north: 55, south: 52, east: 60, west: 48 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 176
        },
        {
          id: 'blr_j3',
          name: 'Marathahalli Multiplex Signal',
          coords: [12.9569, 77.7011],
          density: 84,
          status: 'heavy',
          vehiclesPerMin: 145,
          currentSignal: 'green',
          greenDuration: 70,
          redDuration: 55,
          timerRemaining: 21,
          arms: { north: 44, south: 46, east: 40, west: 42 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 158
        },
        {
          id: 'blr_j4',
          name: 'Hebbal Flyover Inflow Junction',
          coords: [13.0358, 77.5970],
          density: 76,
          status: 'heavy',
          vehiclesPerMin: 130,
          currentSignal: 'red',
          greenDuration: 65,
          redDuration: 50,
          timerRemaining: 14,
          arms: { north: 40, south: 42, east: 38, west: 36 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 145
        },
        {
          id: 'blr_j5',
          name: 'Koramangala 80ft Road Junction',
          coords: [12.9352, 77.6245],
          density: 62,
          status: 'medium',
          vehiclesPerMin: 98,
          currentSignal: 'green',
          greenDuration: 55,
          redDuration: 45,
          timerRemaining: 33,
          arms: { north: 30, south: 28, east: 32, west: 31 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 132
        },
        {
          id: 'blr_j6',
          name: 'Whitefield Hope Farm Circle',
          coords: [12.9840, 77.7510],
          density: 68,
          status: 'medium',
          vehiclesPerMin: 110,
          currentSignal: 'red',
          greenDuration: 60,
          redDuration: 50,
          timerRemaining: 19,
          arms: { north: 35, south: 36, east: 32, west: 34 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 140
        },
        {
          id: 'blr_j7',
          name: 'MG Road Trinity Circle',
          coords: [12.9738, 77.6186],
          density: 48,
          status: 'medium',
          vehiclesPerMin: 78,
          currentSignal: 'green',
          greenDuration: 50,
          redDuration: 40,
          timerRemaining: 12,
          arms: { north: 24, south: 22, east: 26, west: 20 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 118
        },
        {
          id: 'blr_j8',
          name: 'Electronic City Phase 1 Toll Exit',
          coords: [12.8452, 77.6602],
          density: 38,
          status: 'low',
          vehiclesPerMin: 62,
          currentSignal: 'green',
          greenDuration: 60,
          redDuration: 35,
          timerRemaining: 45,
          arms: { north: 18, south: 20, east: 16, west: 19 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 104
        }
      ],
      incidents: [
        {
          id: 'blr_inc_1',
          type: 'breakdown',
          title: 'BMTC Volvo Bus Breakdown at Silk Board Ramp',
          coords: [12.9190, 77.6250],
          severity: 'critical',
          timestamp: '15 mins ago',
          status: 'Towing Unit Dispatched',
          impactRadiusMeters: 600,
          delayMinutes: 35,
          description: 'Heavy BMTC bus stalled on flyover ascending lane causing 2.5 km tailback towards BTM.'
        },
        {
          id: 'blr_inc_2',
          type: 'roadwork',
          title: 'Namma Metro Blue Line Pier Construction',
          coords: [12.9540, 77.6980],
          severity: 'moderate',
          timestamp: '1 hour ago',
          status: 'Active Zone',
          impactRadiusMeters: 300,
          delayMinutes: 18,
          description: 'Right two lanes cordoned off for crane movement near Kadubeesanahalli.'
        }
      ],
      hospitals: [
        { id: 'blr_h1', name: 'Manipal Hospital HAL Old Airport Rd', coords: [12.9592, 77.6496], type: 'trauma' },
        { id: 'blr_h2', name: 'St. Johns Medical College Koramangala', coords: [12.9312, 77.6208], type: 'emergency' },
        { id: 'blr_h3', name: 'Narayana Health City Bommasandra', coords: [12.8180, 77.6920], type: 'cardiac-trauma' },
        { id: 'blr_h4', name: 'Aster CMI Hospital Hebbal', coords: [13.0560, 77.5920], type: 'multi-speciality' }
      ]
    },

    chennai: {
      id: 'chennai',
      name: 'Chennai',
      state: 'Tamil Nadu',
      stateCode: 'TN',
      center: [13.0827, 80.2707],
      zoom: 12,
      tagline: 'Singara Chennai Intelligent Transit Grid',
      kpis: {
        monitoredCorridors: 48,
        activeSignals: 380,
        avgSpeed: 22.8,
        congestionIndex: 71,
        activeIncidents: 3,
        airQualityIndex: 128,
        emergencyPriorityActive: 1
      },
      landmarks: [
        { id: 'kathipara', name: 'Kathipara Cloverleaf Junction', coords: [13.0067, 80.2030] },
        { id: 'omr', name: 'OMR Sholinganallur Junction', coords: [12.9010, 80.2279] },
        { id: 'anna_flyover', name: 'Anna Flyover / Gemini Circle', coords: [13.0524, 80.2508] },
        { id: 'guindy', name: 'Guindy Race Course Signal', coords: [13.0067, 80.2150] },
        { id: 'koyambedu', name: 'Koyambedu CMBT Roundabout', coords: [13.0694, 80.1948] },
        { id: 'central_station', name: 'Chennai Central Railway Station', coords: [13.0827, 80.2755] },
        { id: 't_nagar', name: 'T. Nagar Panagal Park', coords: [13.0405, 80.2337] },
        { id: 'porur', name: 'Porur Toll Junction', coords: [13.0382, 80.1565] },
        { id: 'velachery', name: 'Velachery 100ft Bypass', coords: [12.9759, 80.2212] },
        { id: 'adyar', name: 'Adyar Sardar Patel Road', coords: [13.0012, 80.2565] }
      ],
      junctions: [
        {
          id: 'chn_j1',
          name: 'Kathipara Multi-Tier Flyover',
          coords: [13.0067, 80.2030],
          density: 86,
          status: 'heavy',
          vehiclesPerMin: 160,
          currentSignal: 'green',
          greenDuration: 80,
          redDuration: 60,
          timerRemaining: 38,
          arms: { north: 48, south: 54, east: 46, west: 50 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 142
        },
        {
          id: 'chn_j2',
          name: 'OMR Sholinganallur IT Signal',
          coords: [12.9010, 80.2279],
          density: 80,
          status: 'heavy',
          vehiclesPerMin: 140,
          currentSignal: 'red',
          greenDuration: 75,
          redDuration: 60,
          timerRemaining: 24,
          arms: { north: 42, south: 46, east: 38, west: 40 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 135
        },
        {
          id: 'chn_j3',
          name: 'Koyambedu CMBT Junction',
          coords: [13.0694, 80.1948],
          density: 76,
          status: 'heavy',
          vehiclesPerMin: 125,
          currentSignal: 'green',
          greenDuration: 70,
          redDuration: 55,
          timerRemaining: 48,
          arms: { north: 39, south: 41, east: 36, west: 38 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 148
        },
        {
          id: 'chn_j4',
          name: 'Anna Flyover / Mount Road',
          coords: [13.0524, 80.2508],
          density: 64,
          status: 'medium',
          vehiclesPerMin: 105,
          currentSignal: 'red',
          greenDuration: 60,
          redDuration: 50,
          timerRemaining: 15,
          arms: { north: 32, south: 30, east: 34, west: 28 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 124
        },
        {
          id: 'chn_j5',
          name: 'T. Nagar Panagal Park',
          coords: [13.0405, 80.2337],
          density: 60,
          status: 'medium',
          vehiclesPerMin: 92,
          currentSignal: 'green',
          greenDuration: 55,
          redDuration: 45,
          timerRemaining: 29,
          arms: { north: 28, south: 30, east: 26, west: 29 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 130
        },
        {
          id: 'chn_j6',
          name: 'Porur Junction',
          coords: [13.0382, 80.1565],
          density: 52,
          status: 'medium',
          vehiclesPerMin: 85,
          currentSignal: 'red',
          greenDuration: 50,
          redDuration: 45,
          timerRemaining: 31,
          arms: { north: 26, south: 24, east: 25, west: 27 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 116
        },
        {
          id: 'chn_j7',
          name: 'Central Station / Ripon Building',
          coords: [13.0827, 80.2755],
          density: 35,
          status: 'low',
          vehiclesPerMin: 58,
          currentSignal: 'green',
          greenDuration: 45,
          redDuration: 40,
          timerRemaining: 20,
          arms: { north: 16, south: 18, east: 15, west: 17 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 108
        }
      ],
      incidents: [
        {
          id: 'chn_inc_1',
          type: 'accident',
          title: 'Car Skidding on OMR near Perungudi Toll',
          coords: [12.9620, 80.2450],
          severity: 'moderate',
          timestamp: '22 mins ago',
          status: 'Traffic Police On Site',
          impactRadiusMeters: 300,
          delayMinutes: 20,
          description: 'Sedan hit highway median divider, 1 lane cleared, traffic crawling.'
        },
        {
          id: 'chn_inc_2',
          type: 'waterlogging',
          title: 'Post-Shower Puddle under Vyasarpadi GKM Underpass',
          coords: [13.1120, 80.2610],
          severity: 'low',
          timestamp: '45 mins ago',
          status: 'Monitoring',
          impactRadiusMeters: 180,
          delayMinutes: 10,
          description: 'Light water buildup, speed advisory 20 km/h.'
        }
      ],
      hospitals: [
        { id: 'chn_h1', name: 'Apollo Hospitals Greams Road', coords: [13.0600, 80.2520], type: 'multi-speciality' },
        { id: 'chn_h2', name: 'MIOT International Manapakkam', coords: [13.0230, 80.1870], type: 'trauma' },
        { id: 'chn_h3', name: 'Government General Hospital Central', coords: [13.0810, 80.2790], type: 'state-emergency' },
        { id: 'chn_h4', name: 'Fortis Malar Adyar', coords: [13.0070, 80.2580], type: 'emergency' }
      ]
    },

    vijayawada: {
      id: 'vijayawada',
      name: 'Vijayawada',
      state: 'Andhra Pradesh',
      stateCode: 'AP',
      center: [16.5062, 80.6480],
      zoom: 13,
      tagline: 'Amaravati Capital Corridor Smart Transit',
      kpis: {
        monitoredCorridors: 28,
        activeSignals: 142,
        avgSpeed: 28.4,
        congestionIndex: 54,
        activeIncidents: 2,
        airQualityIndex: 105,
        emergencyPriorityActive: 0
      },
      landmarks: [
        { id: 'benz_circle', name: 'Benz Circle Flyover Junction', coords: [16.4988, 80.6558] },
        { id: 'ramavarappadu', name: 'Ramavarappadu Ring Road', coords: [16.5278, 80.6725] },
        { id: 'control_room', name: 'Control Room / Old Bus Stand', coords: [16.5123, 80.6198] },
        { id: 'pnbs', name: 'Pandit Nehru Bus Station (PNBS)', coords: [16.5074, 80.6174] },
        { id: 'varadhi', name: 'Kanaka Durga Varadhi Bridge', coords: [16.4942, 80.6094] },
        { id: 'gannavaram', name: 'Gannavaram Airport Highway', coords: [16.5312, 80.7958] },
        { id: 'auto_nagar', name: 'Auto Nagar Gate Signal', coords: [16.4945, 80.6780] }
      ],
      junctions: [
        {
          id: 'vja_j1',
          name: 'Benz Circle Main Intersection',
          coords: [16.4988, 80.6558],
          density: 78,
          status: 'heavy',
          vehiclesPerMin: 120,
          currentSignal: 'green',
          greenDuration: 65,
          redDuration: 50,
          timerRemaining: 24,
          arms: { north: 38, south: 42, east: 36, west: 39 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 120
        },
        {
          id: 'vja_j2',
          name: 'Ramavarappadu Ring',
          coords: [16.5278, 80.6725],
          density: 68,
          status: 'medium',
          vehiclesPerMin: 98,
          currentSignal: 'red',
          greenDuration: 55,
          redDuration: 45,
          timerRemaining: 18,
          arms: { north: 32, south: 34, east: 30, west: 31 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 112
        },
        {
          id: 'vja_j3',
          name: 'Control Room MG Road Junction',
          coords: [16.5123, 80.6198],
          density: 56,
          status: 'medium',
          vehiclesPerMin: 80,
          currentSignal: 'green',
          greenDuration: 50,
          redDuration: 40,
          timerRemaining: 32,
          arms: { north: 26, south: 28, east: 25, west: 27 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 98
        },
        {
          id: 'vja_j4',
          name: 'Kanaka Durga Varadhi Inflow',
          coords: [16.4942, 80.6094],
          density: 42,
          status: 'low',
          vehiclesPerMin: 60,
          currentSignal: 'green',
          greenDuration: 45,
          redDuration: 35,
          timerRemaining: 15,
          arms: { north: 20, south: 22, east: 18, west: 21 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 90
        }
      ],
      incidents: [
        {
          id: 'vja_inc_1',
          type: 'roadwork',
          title: 'Culvert Repair near Auto Nagar 100ft Road',
          coords: [16.4930, 80.6750],
          severity: 'moderate',
          timestamp: '35 mins ago',
          status: 'Diverted via Service Lane',
          impactRadiusMeters: 200,
          delayMinutes: 12,
          description: 'Single lane closed for municipal drainage widening work.'
        }
      ],
      hospitals: [
        { id: 'vja_h1', name: 'Manipal Hospitals Tadepalli / Vijayawada', coords: [16.4860, 80.6080], type: 'multi-speciality' },
        { id: 'vja_h2', name: 'Ramesh Hospitals Ring Road', coords: [16.5140, 80.6620], type: 'cardiac-trauma' },
        { id: 'vja_h3', name: 'Andhra Hospitals Bandar Road', coords: [16.5020, 80.6480], type: 'emergency' }
      ]
    },

    visakhapatnam: {
      id: 'visakhapatnam',
      name: 'Visakhapatnam',
      state: 'Andhra Pradesh',
      stateCode: 'AP',
      center: [17.6868, 83.2185],
      zoom: 13,
      tagline: 'Vizag Coastal City Smart Mobility Network',
      kpis: {
        monitoredCorridors: 32,
        activeSignals: 188,
        avgSpeed: 29.5,
        congestionIndex: 51,
        activeIncidents: 2,
        airQualityIndex: 94,
        emergencyPriorityActive: 0
      },
      landmarks: [
        { id: 'jagadamba', name: 'Jagadamba Centre', coords: [17.7126, 83.3012] },
        { id: 'maddilapalem', name: 'Maddilapalem AU Junction', coords: [17.7342, 83.3289] },
        { id: 'siripuram', name: 'Siripuram Circle', coords: [17.7214, 83.3156] },
        { id: 'gajuwaka', name: 'Gajuwaka Industrial Junction', coords: [17.6914, 83.2132] },
        { id: 'nad_junction', name: 'NAD Multi-Level Flyover', coords: [17.7478, 83.2274] },
        { id: 'mvp_colony', name: 'MVP Colony Sector 1 Signal', coords: [17.7445, 83.3412] },
        { id: 'rushikonda', name: 'Rushikonda IT SEZ Beach Rd', coords: [17.7818, 83.3854] }
      ],
      junctions: [
        {
          id: 'viz_j1',
          name: 'NAD Multi-Level Flyover',
          coords: [17.7478, 83.2274],
          density: 75,
          status: 'heavy',
          vehiclesPerMin: 115,
          currentSignal: 'green',
          greenDuration: 65,
          redDuration: 50,
          timerRemaining: 27,
          arms: { north: 36, south: 40, east: 35, west: 38 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 102
        },
        {
          id: 'viz_j2',
          name: 'Maddilapalem Bus Station Circle',
          coords: [17.7342, 83.3289],
          density: 70,
          status: 'medium',
          vehiclesPerMin: 104,
          currentSignal: 'red',
          greenDuration: 60,
          redDuration: 45,
          timerRemaining: 16,
          arms: { north: 34, south: 36, east: 31, west: 33 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 98
        },
        {
          id: 'viz_j3',
          name: 'Gajuwaka Steel Plant Gate',
          coords: [17.6914, 83.2132],
          density: 62,
          status: 'medium',
          vehiclesPerMin: 90,
          currentSignal: 'green',
          greenDuration: 55,
          redDuration: 45,
          timerRemaining: 34,
          arms: { north: 30, south: 32, east: 28, west: 29 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 118
        },
        {
          id: 'viz_j4',
          name: 'Jagadamba Theatre Junction',
          coords: [17.7126, 83.3012],
          density: 50,
          status: 'medium',
          vehiclesPerMin: 75,
          currentSignal: 'red',
          greenDuration: 45,
          redDuration: 40,
          timerRemaining: 22,
          arms: { north: 24, south: 26, east: 22, west: 25 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 88
        }
      ],
      incidents: [
        {
          id: 'viz_inc_1',
          type: 'accident',
          title: 'Auto-Rickshaw Overturn near Maddilapalem Flyover',
          coords: [17.7320, 83.3260],
          severity: 'moderate',
          timestamp: '18 mins ago',
          status: 'Tow Truck Arrived',
          impactRadiusMeters: 200,
          delayMinutes: 14,
          description: 'Auto skidded in curb lane, slow traffic on NH16 stretch.'
        }
      ],
      hospitals: [
        { id: 'viz_h1', name: 'Apollo Hospitals Ramnagar Vizag', coords: [17.7180, 83.3110], type: 'multi-speciality' },
        { id: 'viz_h2', name: 'King George Hospital (KGH)', coords: [17.7070, 83.3030], type: 'state-emergency' },
        { id: 'viz_h3', name: 'Care Hospitals Waltair Main Rd', coords: [17.7260, 83.3190], type: 'cardiac' }
      ]
    },

    kochi: {
      id: 'kochi',
      name: 'Kochi',
      state: 'Kerala',
      stateCode: 'KL',
      center: [9.9312, 76.2673],
      zoom: 13,
      tagline: 'Greater Cochin Integrated Water-Road Transit Hub',
      kpis: {
        monitoredCorridors: 30,
        activeSignals: 196,
        avgSpeed: 23.2,
        congestionIndex: 65,
        activeIncidents: 3,
        airQualityIndex: 88,
        emergencyPriorityActive: 1
      },
      landmarks: [
        { id: 'edappally', name: 'Edappally Toll & Lulu Mall Junction', coords: [10.0248, 76.3079] },
        { id: 'vyttila', name: 'Vyttila Mobility Hub & Bypass', coords: [9.9678, 76.3204] },
        { id: 'palarivattom', name: 'Palarivattom Flyover Junction', coords: [10.0034, 76.3086] },
        { id: 'kundannoor', name: 'Kundannoor Flyover Junction', coords: [9.9372, 76.3182] },
        { id: 'infopark', name: 'Infopark Kakkanad Expressway', coords: [10.0125, 76.3638] },
        { id: 'mg_road_kochi', name: 'MG Road Maharajas Signal', coords: [9.9672, 76.2842] },
        { id: 'marine_drive', name: 'Marine Drive High Court Junction', coords: [9.9808, 76.2764] }
      ],
      junctions: [
        {
          id: 'koc_j1',
          name: 'Edappally Lulu Mall Flyover',
          coords: [10.0248, 76.3079],
          density: 89,
          status: 'heavy',
          vehiclesPerMin: 152,
          currentSignal: 'green',
          greenDuration: 75,
          redDuration: 55,
          timerRemaining: 30,
          arms: { north: 46, south: 50, east: 44, west: 48 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 95
        },
        {
          id: 'koc_j2',
          name: 'Vyttila Mobility Hub Roundabout',
          coords: [9.9678, 76.3204],
          density: 84,
          status: 'heavy',
          vehiclesPerMin: 142,
          currentSignal: 'red',
          greenDuration: 70,
          redDuration: 60,
          timerRemaining: 19,
          arms: { north: 42, south: 45, east: 40, west: 43 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 92
        },
        {
          id: 'koc_j3',
          name: 'Palarivattom Bypass Junction',
          coords: [10.0034, 76.3086],
          density: 66,
          status: 'medium',
          vehiclesPerMin: 102,
          currentSignal: 'green',
          greenDuration: 60,
          redDuration: 45,
          timerRemaining: 25,
          arms: { north: 32, south: 35, east: 30, west: 33 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 84
        },
        {
          id: 'koc_j4',
          name: 'Infopark Expressway Entry',
          coords: [10.0125, 76.3638],
          density: 72,
          status: 'heavy',
          vehiclesPerMin: 118,
          currentSignal: 'red',
          greenDuration: 65,
          redDuration: 50,
          timerRemaining: 14,
          arms: { north: 36, south: 38, east: 34, west: 37 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 80
        }
      ],
      incidents: [
        {
          id: 'koc_inc_1',
          type: 'waterlogging',
          title: 'Monsoon Waterlogging on Edappally Bypass Ramp',
          coords: [10.0220, 76.3090],
          severity: 'moderate',
          timestamp: '12 mins ago',
          status: 'Drainage Clear Squad On-Site',
          impactRadiusMeters: 250,
          delayMinutes: 18,
          description: 'Heavy rain runoff causing slow crawl towards Aluva.'
        }
      ],
      hospitals: [
        { id: 'koc_h1', name: 'Aster Medcity Cheranallur', coords: [10.0460, 76.2740], type: 'multi-speciality' },
        { id: 'koc_h2', name: 'Medical Trust Hospital MG Road', coords: [9.9630, 76.2890], type: 'trauma' },
        { id: 'koc_h3', name: 'Amrita Institute of Medical Sciences (AIMS)', coords: [10.0320, 76.2910], type: 'state-emergency' }
      ]
    },

    thiruvananthapuram: {
      id: 'thiruvananthapuram',
      name: 'Thiruvananthapuram',
      state: 'Kerala',
      stateCode: 'KL',
      center: [8.5241, 76.9366],
      zoom: 13,
      tagline: 'Capital Smart Mobility & Technopark Corridor',
      kpis: {
        monitoredCorridors: 26,
        activeSignals: 154,
        avgSpeed: 26.8,
        congestionIndex: 56,
        activeIncidents: 1,
        airQualityIndex: 78,
        emergencyPriorityActive: 0
      },
      landmarks: [
        { id: 'east_fort', name: 'East Fort (Padmanabhaswamy Zone)', coords: [8.4832, 76.9436] },
        { id: 'technopark', name: 'Technopark Kazhakkoottam Main Gate', coords: [8.5581, 76.8812] },
        { id: 'palayam', name: 'Palayam Underpass Junction', coords: [8.5034, 76.9512] },
        { id: 'statue', name: 'Statue Secretariat Circle', coords: [8.4984, 76.9498] },
        { id: 'pattom', name: 'Pattom Palace Signal', coords: [8.5241, 76.9456] },
        { id: 'thampanoor', name: 'Thampanoor Central Railway Station', coords: [8.4882, 76.9525] },
        { id: 'vellayambalam', name: 'Vellayambalam Roundabout', coords: [8.5148, 76.9620] }
      ],
      junctions: [
        {
          id: 'tvm_j1',
          name: 'Technopark Kazhakkoottam NH66 Junction',
          coords: [8.5581, 76.8812],
          density: 76,
          status: 'heavy',
          vehiclesPerMin: 122,
          currentSignal: 'green',
          greenDuration: 70,
          redDuration: 50,
          timerRemaining: 35,
          arms: { north: 38, south: 40, east: 36, west: 37 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 82
        },
        {
          id: 'tvm_j2',
          name: 'Palayam Underpass Intersection',
          coords: [8.5034, 76.9512],
          density: 64,
          status: 'medium',
          vehiclesPerMin: 95,
          currentSignal: 'red',
          greenDuration: 55,
          redDuration: 45,
          timerRemaining: 18,
          arms: { north: 30, south: 32, east: 28, west: 31 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 76
        },
        {
          id: 'tvm_j3',
          name: 'Pattom Junction',
          coords: [8.5241, 76.9456],
          density: 58,
          status: 'medium',
          vehiclesPerMin: 86,
          currentSignal: 'green',
          greenDuration: 50,
          redDuration: 40,
          timerRemaining: 24,
          arms: { north: 28, south: 29, east: 26, west: 27 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 74
        },
        {
          id: 'tvm_j4',
          name: 'East Fort Bus Terminal Signal',
          coords: [8.4832, 76.9436],
          density: 46,
          status: 'low',
          vehiclesPerMin: 68,
          currentSignal: 'red',
          greenDuration: 45,
          redDuration: 40,
          timerRemaining: 12,
          arms: { north: 22, south: 24, east: 20, west: 23 },
          cctvStatus: 'Active (AI Vision)',
          aqi: 80
        }
      ],
      incidents: [
        {
          id: 'tvm_inc_1',
          type: 'breakdown',
          title: 'KSRTC Bus Breakdown near Thampanoor Flyover',
          coords: [8.4895, 76.9535],
          severity: 'moderate',
          timestamp: '25 mins ago',
          status: 'Recovery Crane En Route',
          impactRadiusMeters: 220,
          delayMinutes: 16,
          description: 'Bus engine overheating in left lane causing slow queue towards Overbridge.'
        }
      ],
      hospitals: [
        { id: 'tvm_h1', name: 'Government Medical College Hospital', coords: [8.5230, 76.9280], type: 'state-emergency' },
        { id: 'tvm_h2', name: 'KIMSHEALTH Anayara Trivandrum', coords: [8.5080, 76.9120], type: 'multi-speciality' },
        { id: 'tvm_h3', name: 'Sree Chitra Tirunal Institute (SCTIMST)', coords: [8.5210, 76.9270], type: 'cardiac-neuro' }
      ]
    }
  },

  vehicleTypes: [
    { type: 'Two Wheelers (Bikes/Scooters)', percentage: 48, emissionFactor: 0.4 },
    { type: 'Three Wheelers (Auto Rickshaws)', percentage: 16, emissionFactor: 0.7 },
    { type: 'Four Wheelers (Cars/Cabs)', percentage: 26, emissionFactor: 1.0 },
    { type: 'Public Transit (Buses/Vans)', percentage: 6, emissionFactor: 2.8 },
    { type: 'Commercial Trucks/Freight', percentage: 4, emissionFactor: 4.2 }
  ],

  demoScenarios: [
    {
      id: 'blr_silkboard_surge',
      name: 'Bengaluru - Silk Board Morning IT Rush Gridlock',
      cityId: 'bengaluru',
      hour: 9,
      weather: 'monsoon_rain',
      event: 'tech_park_peak',
      description: 'Severe congestion at Silk Board & Marathahalli ORR with monsoonal rain and high volume.'
    },
    {
      id: 'hyd_gachibowli_rain',
      name: 'Hyderabad - Gachibowli Monsoon Surge & Waterlogging',
      cityId: 'hyderabad',
      hour: 18,
      weather: 'monsoon_rain',
      event: 'tech_park_peak',
      description: 'Evening IT corridor rush + downpour causing 35% speed drop across Cyberabad.'
    },
    {
      id: 'chn_kathipara_ambulance',
      name: 'Chennai - Kathipara to Apollo Emergency Green Corridor',
      cityId: 'chennai',
      hour: 14,
      weather: 'clear',
      event: 'none',
      description: 'Critical Cardiac Ambulance pre-emption corridor from Kathipara to Apollo Greams Road.'
    },
    {
      id: 'koc_vyttila_evening',
      name: 'Kochi - Vyttila Mobility Hub & Infopark Evening Peak',
      cityId: 'kochi',
      hour: 19,
      weather: 'cloudy',
      event: 'festival_rush',
      description: 'Inter-modal transit rush at Vyttila Hub and Infopark Expressway with adaptive signal test.'
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SOUTH_INDIA_DATA;
}
