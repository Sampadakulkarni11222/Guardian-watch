import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter, ZAxis, Legend
} from 'recharts';
import { 
  LayoutDashboard, Map as MapIcon, TrendingUp, AlertTriangle, Image as ImageIcon, 
  Users, Calendar, ShieldAlert, BarChart3, Info, CheckCircle2, MapPin, Search,
  Clock, Activity, Box, Filter, RotateCcw, ChevronDown, Cpu, Zap, Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import data from './data.json';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedImage, setSelectedImage] = useState('/crime_images/crime_001.png');

  const CRIME_IMAGES = [
    '/crime_images/crime_001.png',
    '/crime_images/crime_002.png',
    '/crime_images/crime_003.png'
  ];

  const COLORS = ['#8b5cf6', '#d946ef', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  const CITY_COORDS = {
    'Ahmedabad': [23.0225, 72.5714], 'Chennai': [13.0827, 80.2707], 'Ludhiana': [30.9010, 75.8573],
    'Pune': [18.5204, 73.8567], 'Delhi': [28.6139, 77.2090], 'Mumbai': [19.0760, 72.8777],
    'Surat': [21.1702, 72.8311], 'Visakhapatnam': [17.6868, 83.2185], 'Bangalore': [12.9716, 77.5946],
    'Kolkata': [22.5726, 88.3639], 'Ghaziabad': [28.6692, 77.4538], 'Hyderabad': [17.3850, 78.4867],
    'Jaipur': [26.9124, 75.7873], 'Lucknow': [26.8467, 80.9462], 'Bhopal': [23.2599, 77.4126],
    'Patna': [25.5941, 85.1376], 'Kanpur': [26.4499, 80.3319], 'Varanasi': [25.3176, 82.9739],
    'Nagpur': [21.1458, 79.0882], 'Meerut': [28.9845, 77.7064], 'Thane': [19.2183, 72.9781],
    'Indore': [22.7196, 75.8577], 'Rajkot': [22.3039, 70.8022], 'Vasai': [19.3919, 72.8397],
    'Agra': [27.1767, 78.0081], 'Kalyan': [19.2437, 73.1352], 'Nashik': [19.9975, 73.7898],
    'Srinagar': [34.0837, 74.7973], 'Faridabad': [28.4089, 77.3178],
  };

  // Improved India SVG path (High fidelity)
  const INDIA_PATH = "M308,83 L312,74 L323,65 L334,55 L354,48 L374,54 L382,65 L387,79 L389,101 L395,110 L409,114 L415,124 L422,139 L420,154 L413,165 L415,178 L428,187 L444,192 L460,202 L466,220 L478,235 L500,245 L525,248 L555,246 L580,250 L600,265 L605,285 L590,300 L560,305 L530,302 L510,310 L495,330 L490,355 L498,375 L515,390 L545,395 L570,410 L585,435 L580,460 L560,480 L530,485 L500,480 L470,465 L450,450 L425,445 L400,450 L380,465 L365,485 L355,510 L345,540 L335,570 L315,595 L300,580 L290,550 L285,520 L275,490 L260,460 L240,435 L220,415 L195,400 L175,385 L160,365 L155,340 L165,315 L180,295 L200,280 L225,270 L250,265 L270,255 L285,240 L295,220 L300,200 L302,175 L300,150 L295,125 L300,105 Z";

  // --- FILTER ENGINE ---
  const filteredData = useMemo(() => {
    return data.incidents.filter(item => {
      const cityMatch = selectedCity === 'All' || item.city === selectedCity;
      const domainMatch = selectedDomain === 'All' || item.domain === selectedDomain;
      return cityMatch && domainMatch;
    });
  }, [selectedCity, selectedDomain]);

  // --- ANALYTICS ---
  const stats = useMemo(() => {
    if (filteredData.length === 0) return { total: 0, meanAge: 0, mode: 'N/A' };
    const total = filteredData.length;
    const sumAge = filteredData.reduce((acc, curr) => acc + curr.age, 0);
    const counts = {};
    filteredData.forEach(item => counts[item.desc] = (counts[item.desc] || 0) + 1);
    const mode = Object.keys(counts).length ? Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b) : 'N/A';
    return { total, meanAge: sumAge / total, mode };
  }, [filteredData]);

  const domainStats = useMemo(() => {
    const counts = {};
    filteredData.forEach(item => counts[item.domain] = (counts[item.domain] || 0) + 1);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const cityStats = useMemo(() => {
    const counts = {};
    filteredData.forEach(item => counts[item.city] = (counts[item.city] || 0) + 1);
    return Object.entries(counts)
      .map(([index, crimes]) => ({ index, crimes }))
      .sort((a, b) => b.crimes - a.crimes)
      .slice(0, 10);
  }, [filteredData]);

  const yearlyTrends = useMemo(() => {
    const counts = {};
    filteredData.forEach(item => counts[item.year] = (counts[item.year] || 0) + 1);
    return Object.entries(counts).map(([Year, count]) => ({ Year, count })).sort((a, b) => a.Year - b.Year);
  }, [filteredData]);

  const caseClosedStats = useMemo(() => {
    const counts = {};
    filteredData.forEach(item => counts[item.closed] = (counts[item.closed] || 0) + 1);
    return Object.entries(counts).map(([index, value]) => ({ index, value }));
  }, [filteredData]);

  const mapMarkers = useMemo(() => {
    const counts = {};
    data.incidents.forEach(item => counts[item.city] = (counts[item.city] || 0) + 1);
    
    const countArray = Object.values(counts);
    const q1 = countArray.sort((a, b) => a - b)[Math.floor(countArray.length * 0.25)];
    const q3 = countArray.sort((a, b) => a - b)[Math.floor(countArray.length * 0.75)];

    return Object.entries(CITY_COORDS).map(([name, [lat, lon]]) => {
      const baseCount = counts[name] || 0;
      const count = baseCount;
      
      let color = '#10b981'; // Safe (Green)
      if (count > q3) color = '#ef4444'; // High (Red)
      else if (count > q1) color = '#f59e0b'; // Moderate (Orange)
      
      const x = (lon - 68) * (800 / (97 - 68));
      const y = 600 - (lat - 8) * (600 / (37 - 8));
      
      return { name, x, y, count, color };
    });
  }, []);

  const hourlyTrendData = useMemo(() => {
    const hours = Array(24).fill(0).map((_, i) => ({ hour: `${i}:00`, count: 0 }));
    filteredData.forEach(item => {
      if (item.hour >= 0 && item.hour < 24) hours[item.hour].count++;
    });
    return hours;
  }, [filteredData]);

  // City-wise hourly breakdown (top 5 cities by incident count)
  const topCities = useMemo(() => {
    const counts = {};
    filteredData.forEach(item => counts[item.city] = (counts[item.city] || 0) + 1);
    return Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0,5).map(([name]) => name);
  }, [filteredData]);

  const cityHourlyData = useMemo(() => {
    const matrix = Array(24).fill(null).map((_, h) => ({ hour: `${h}:00` }));
    topCities.forEach(city => {
      const counts = Array(24).fill(0);
      filteredData.filter(d => d.city === city).forEach(d => { if (d.hour >= 0 && d.hour < 24) counts[d.hour]++; });
      counts.forEach((c, h) => { matrix[h][city] = c; });
    });
    return matrix;
  }, [filteredData, topCities]);

  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisResult({
        risk: Math.random() > 0.5 ? 'CRITICAL' : 'STABLE',
        weapon: Math.random() > 0.7 ? 'DETECTED' : 'NONE',
        confidence: (Math.random() * 20 + 75).toFixed(2)
      });
    }, 2000);
  };

  return (
    <div className="app-container">
      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <aside className="sidebar">
        <div className="logo"><ShieldAlert size={32} color="#8b5cf6" /><span>NEURAL HUD</span></div>
        <nav className="nav-links">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Filter />} label="Control Center" active={activeTab === 'filters'} onClick={() => setActiveTab('filters')} />
          <NavItem icon={<MapIcon />} label="India Map Layout" active={activeTab === 'map'} onClick={() => setActiveTab('map')} />
          <NavItem icon={<Cpu />} label="Image Intelligence" active={activeTab === 'image'} onClick={() => setActiveTab('image')} />
          <NavItem icon={<Activity />} label="Factor Intelligence" active={activeTab === 'factors'} onClick={() => setActiveTab('factors')} />
        </nav>
        <div className="sidebar-slicers">
           <div className="slicer-title">QUICK FILTERS</div>
           <select className="premium-select" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
             <option value="All">All Cities</option>
             {data.cities.map(c => <option key={c} value={c}>{c}</option>)}
           </select>
           <select className="premium-select" value={selectedDomain} onChange={(e) => setSelectedDomain(e.target.value)}>
             <option value="All">All Domains</option>
             {data.domains.map(d => <option key={d} value={d}>{d}</option>)}
           </select>
           <button className="reset-btn" onClick={() => { setSelectedCity('All'); setSelectedDomain('All'); }}><RotateCcw size={16} /> Reset HUD</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:'0.65rem', fontFamily:'JetBrains Mono, monospace', color:'#7c3aed', letterSpacing:'3px', marginBottom:'0.5rem' }}>NEURAL_HUD / {activeTab.toUpperCase()}</div>
                <h1 style={{ fontFamily:'Inter, sans-serif', fontSize:'2.5rem', fontWeight:900, letterSpacing:'-1px', background:'linear-gradient(135deg, #fff 30%, #a78bfa 65%, #f472b6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', lineHeight:1 }}>
                  {activeTab === 'dashboard' ? 'Analytics Overview' : activeTab === 'map' ? 'Strategic Heatmap' : activeTab === 'image' ? 'Image Intelligence' : activeTab === 'filters' ? 'Control Matrix' : 'Factor Analysis'}
                </h1>
                <div className="breadcrumb" style={{ marginTop:'0.5rem' }}>SECTOR: {selectedCity} &nbsp;•&nbsp; DOMAIN: {selectedDomain} &nbsp;•&nbsp; RECORDS: {filteredData.length}</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'0.75rem' }}>
              </div>
            </div>
          </motion.div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }} transition={{ duration:0.4 }}>
              <div className="stats-grid">
                <StatCard label="Total Incidents" value={stats.total.toLocaleString()} icon={<Search size={18}/>} color="#a78bfa" />
                <StatCard label="Avg Victim Age" value={`${stats.meanAge.toFixed(1)} yrs`} icon={<Users size={18}/>} color="#f472b6" />
                <StatCard label="Primary Vector" value={stats.mode?.slice(0,12)} icon={<Box size={18}/>} color="#60a5fa" />
                <StatCard label="Active Domains" value={domainStats.length} icon={<Activity size={18}/>} color="#34d399" />
              </div>
              <div className="charts-grid">
                <div className="chart-card">
                  <div className="chart-title" style={{ borderBottom:'1px solid rgba(124,58,237,0.15)', paddingBottom:'1rem', marginBottom:'1.5rem' }}>
                    <span style={{ background:'linear-gradient(135deg,#a78bfa,#7c3aed)', padding:'6px 8px', borderRadius:'8px', marginRight:'0.25rem', display:'flex', alignItems:'center' }}><Clock size={14} color="white"/></span>
                    Incident Volume Trends
                  </div>
                  <ResponsiveContainer width="100%" height="90%">
                    <AreaChart data={yearlyTrends}>
                      <defs><linearGradient id="glowArea" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient></defs>
                      <XAxis dataKey="Year" stroke="var(--text-dim)" /><YAxis stroke="var(--text-dim)" /><Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="count" stroke="#8b5cf6" fill="url(#glowArea)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-card">
                  <div className="chart-title" style={{ borderBottom:'1px solid rgba(236,72,153,0.15)', paddingBottom:'1rem', marginBottom:'1.5rem' }}>
                    <span style={{ background:'linear-gradient(135deg,#f472b6,#ec4899)', padding:'6px 8px', borderRadius:'8px', marginRight:'0.25rem', display:'flex', alignItems:'center' }}><Filter size={14} color="white"/></span>
                    Domain Distribution
                  </div>
                  <ResponsiveContainer width="100%" height="90%">
                    <PieChart>
                      <Pie data={domainStats} innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" onClick={(e) => setSelectedDomain(e.name)} style={{ cursor: 'pointer' }}>
                        {domainStats.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ── City-Wise Hourly Trend Analysis ── */}
              <div className="chart-card" style={{ height: '500px', marginBottom: '2.5rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid rgba(6,182,212,0.15)', paddingBottom:'1rem', marginBottom:'1.5rem' }}>
                  <div className="chart-title" style={{ margin:0 }}>
                    <span style={{ background:'linear-gradient(135deg,#06b6d4,#3b82f6)', padding:'6px 8px', borderRadius:'8px', display:'flex', alignItems:'center' }}>
                      <Clock size={14} color="white"/>
                    </span>
                    City-Wise Hourly Crime Distribution
                  </div>
                  <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', justifyContent:'flex-end' }}>
                    {topCities.map((city, i) => (
                      <div key={city} style={{ padding:'3px 10px', borderRadius:'99px', fontSize:'0.62rem', fontWeight:700, fontFamily:'JetBrains Mono, monospace', border:`1px solid ${COLORS[i]}55`, background:`${COLORS[i]}18`, color: COLORS[i] }}>
                        {city}
                      </div>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height="88%">
                  <AreaChart data={cityHourlyData} margin={{ top:5, right:20, bottom:5, left:0 }}>
                    <defs>
                      {topCities.map((city, i) => (
                        <linearGradient key={city} id={`grad-city-${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS[i]} stopOpacity={0.35}/>
                          <stop offset="95%" stopColor={COLORS[i]} stopOpacity={0}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <XAxis dataKey="hour" stroke="var(--dim)" tick={{ fontSize:10, fontFamily:'JetBrains Mono, monospace', fill:'#64748b' }} />
                    <YAxis stroke="var(--dim)" tick={{ fontSize:10, fill:'#64748b' }} width={30} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize:'0.7rem', paddingTop:'0.5rem', fontFamily:'JetBrains Mono, monospace' }} />
                    {topCities.map((city, i) => (
                      <Area
                        key={city}
                        type="monotone"
                        dataKey={city}
                        stroke={COLORS[i]}
                        strokeWidth={2.5}
                        fill={`url(#grad-city-${i})`}
                        dot={false}
                        activeDot={{ r: 6, strokeWidth: 0, fill: COLORS[i] }}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>

            </motion.div>
          )}

          {activeTab === 'map' && (
            <motion.div 
              key="map" 
              initial={{ opacity: 0, rotateX: 20 }} 
              animate={{ opacity: 1, rotateX: 0 }}
              whileHover={{ rotateX: 2, rotateY: -2 }}
              className="map-3d-wrapper"
            >
              <div className="map-container-premium">
                <div className="glass-reflection"></div>
                <div className="map-header">
                  <div className="chart-title" style={{ padding: '20px', zIndex: 5 }}>
                    <MapPin size={24} className="glow-icon" /> 
                    <span className="hud-text">INDIA_REAL_TIME_STRATEGIC_VIEW</span>
                  </div>
                  <div className="map-ticker">
                    <span className="ticker-label">LATEST_SIGINT:</span>
                    <span className="ticker-text">Activity detected in {mapMarkers[0].name} | THREAT_LVL: {mapMarkers[0].count > 100 ? 'HIGH' : 'STABLE'}</span>
                  </div>
                </div>
                <div className="map-legend">
                   <div className="legend-item"><span className="dot critical"></span> CRITICAL_SECTOR</div>
                   <div className="legend-item"><span className="dot warning"></span> ELEVATED_RISK</div>
                   <div className="legend-item"><span className="dot success"></span> SECURE_PARAMETER</div>
                </div>
                <div className="map-svg-wrapper">
                  <svg width="100%" height="100%" viewBox="0 0 800 600" style={{ filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.2))' }}>
                    <path 
                      d={INDIA_PATH} 
                      fill="rgba(139, 92, 246, 0.03)" 
                      stroke="rgba(139, 92, 246, 0.4)" 
                      strokeWidth="1.5" 
                      strokeDasharray="4,4"
                    />
                    {mapMarkers.map((m, i) => (
                      <motion.g key={`${m.name}`} initial={{ opacity: 0.8 }} animate={{ opacity: 1 }}>
                        <circle cx={m.x} cy={m.y} r={Math.sqrt(m.count) * 2} fill={m.color} fillOpacity="0.15">
                          <animate attributeName="r" values={`${Math.sqrt(m.count) * 1.5};${Math.sqrt(m.count) * 2.5};${Math.sqrt(m.count) * 1.5}`} dur="4s" repeatCount="indefinite" />
                        </circle>
                        <circle cx={m.x} cy={m.y} r="4" fill={m.color} className="pulse-dot" style={{ filter: `drop-shadow(0 0 8px ${m.color})` }} />
                        <text x={m.x + 12} y={m.y + 4} fill="rgba(255,255,255,0.5)" fontSize="9" className="map-label">{m.name.toUpperCase()}</text>
                      </motion.g>
                    ))}
                  </svg>
                </div>
                <div className="map-data-overlay">
                   <div className="data-line">STREAM_STABILITY: 99.8%</div>
                   <div className="data-line">NODES_CONNECTED: {mapMarkers.length}</div>
                   <div className="data-line">SCAN_INTERVAL: 3000ms</div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'image' && (
            <motion.div 
              key="image" 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="image-intelligence-wrapper"
            >
               <div className="image-gallery-sidebar">
                  <div className="hud-text small">SOURCE_GALLERY</div>
                  <div className="gallery-grid">
                     {CRIME_IMAGES.map((img, i) => (
                       <motion.div 
                         key={i}
                         whileHover={{ scale: 1.1 }}
                         onClick={() => setSelectedImage(img)}
                         className={`gallery-thumb ${selectedImage === img ? 'active' : ''}`}
                       >
                          <img src={img} alt={`Crime ${i}`} />
                          {selectedImage === img && <div className="thumb-check"><CheckCircle2 size={12} /></div>}
                       </motion.div>
                     ))}
                  </div>
               </div>

               <div className="image-intelligence-grid">
                  <motion.div className="glass-card-3d" whileHover={{ rotateY: -5 }}>
                    <div className="scanner-line"></div>
                    <div className="card-header">
                        <Camera size={24} color="#8b5cf6" />
                        <span className="hud-text">OPTICAL_INPUT_NODE</span>
                    </div>
                    <div className="preview-area-premium">
                        <div className="corner tl"></div><div className="corner tr"></div>
                        <div className="corner bl"></div><div className="corner br"></div>
                        <img src={selectedImage} alt="Selected Crime" className="main-preview-img" />
                        <div className="scan-overlay"></div>
                    </div>
                    <button className="hud-button" onClick={runAnalysis} disabled={analyzing}>
                      {analyzing ? <Zap className="spinning" /> : <Cpu />}
                      <span>{analyzing ? 'VECTORIZING_DATA...' : 'INITIALIZE_SCAN'}</span>
                    </button>
                  </motion.div>

                  <motion.div className="glass-card-3d results-card" whileHover={{ rotateY: 5 }}>
                    <div className="card-header">
                        <Zap size={24} color="#d946ef" />
                        <span className="hud-text">SCAN_DIAGNOSTICS</span>
                    </div>
                    {analysisResult ? (
                      <div className="analysis-results">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`risk-badge ${analysisResult.risk === 'CRITICAL' ? 'danger' : 'stable'}`}>
                            <AlertTriangle size={32} />
                            <div><div className="label">THREAT_LEVEL</div><div className="value">{analysisResult.risk}_RISK</div></div>
                        </motion.div>
                        <div className="metrics-grid">
                            <div className="metric-box"><div className="m-label">WEAPON_STATUS</div><div className="m-value" style={{ color: analysisResult.weapon === 'DETECTED' ? '#ef4444' : '#10b981' }}>{analysisResult.weapon}</div></div>
                            <div className="metric-box"><div className="m-label">AI_CONFIDENCE</div><div className="m-value">{analysisResult.confidence}%</div><div className="m-progress"><motion.div initial={{ width: 0 }} animate={{ width: `${analysisResult.confidence}%` }} className="m-fill" /></div></div>
                        </div>
                        <div className="system-logs">
                            <div className="log-line">&gt; Pattern Recognition: COMPLETE</div>
                            <div className={`log-line ${analysisResult.risk === 'CRITICAL' ? 'text-danger' : 'text-success'}`}>&gt; Action Protocol: {analysisResult.risk === 'CRITICAL' ? 'DEPLOY_UNITS' : 'STANDBY'}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="idle-state"><Cpu size={48} className="faint-icon" /><p>CONNECT_SENSOR_TO_BEGIN</p></div>
                    )}
                  </motion.div>
               </div>
            </motion.div>
          )}

          {activeTab === 'filters' && (
            <motion.div key="filters" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="charts-grid">
                <div className="chart-card">
                  <div className="chart-title"><Filter size={20} /> Advanced Control Matrix</div>
                  <div className="sidebar-slicers" style={{ background: 'transparent', border: 'none', padding: 0 }}>
                    <div className="slicer-label">GEOGRAPHIC SECTOR</div>
                    <select className="premium-select" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}><option value="All">All Sectors</option>{data.cities.map(c => <option key={c} value={c}>{c}</option>)}</select>
                    <div className="slicer-label" style={{ marginTop: '1rem' }}>CRIME DOMAIN</div>
                    <select className="premium-select" value={selectedDomain} onChange={(e) => setSelectedDomain(e.target.value)}><option value="All">All Domains</option>{data.domains.map(d => <option key={d} value={d}>{d}</option>)}</select>
                    <button className="reset-btn" style={{ marginTop: '2rem', width: '100%' }} onClick={() => { setSelectedCity('All'); setSelectedDomain('All'); }}><RotateCcw size={18} /> INITIALIZE HUD RESET</button>
                  </div>
                </div>
                <div className="chart-card">
                  <div className="chart-title"><Activity size={20} /> Filter Intelligence Summary</div>
                  <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="tag">ACTIVE RECORDS: {filteredData.length}</div>
                    <div className="tag">AVG AGE: {stats.meanAge.toFixed(1)}</div>
                    <div className="tag">CITY: {selectedCity}</div>
                    <div className="tag">DOMAIN: {selectedDomain}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'factors' && (
            <motion.div key="factors" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="charts-grid">
                <div className="chart-card"><div className="chart-title"><Users size={20} /> Age vs Incident Density</div><ResponsiveContainer width="100%" height="90%"><ScatterChart><XAxis type="number" dataKey="age" stroke="var(--text-dim)" /><YAxis type="number" dataKey="hour" stroke="var(--text-dim)" /><Tooltip content={<CustomTooltip />} /><Scatter data={filteredData.slice(0, 500)} fill="#8b5cf6" fillOpacity={0.6} /></ScatterChart></ResponsiveContainer></div>
                <div className="chart-card"><div className="chart-title"><Clock size={20} /> Hourly Trend Pattern</div><ResponsiveContainer width="100%" height="90%"><AreaChart data={hourlyTrendData}><XAxis dataKey="hour" stroke="var(--text-dim)" /><YAxis stroke="var(--text-dim)" /><Tooltip content={<CustomTooltip />} /><Area type="monotone" dataKey="count" stroke="#d946ef" fill="#d946ef" fillOpacity={0.2} /></AreaChart></ResponsiveContainer></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <motion.div
    className={`nav-item ${active ? 'active' : ''}`}
    onClick={onClick}
    whileTap={{ scale: 0.97 }}
  >
    <span style={{ display:'flex', alignItems:'center', gap:'0.875rem', width:'100%' }}>
      <span style={{ opacity: active ? 1 : 0.7 }}>{icon}</span>
      <span style={{ fontSize:'0.875rem', fontWeight: active ? 700 : 500 }}>{label}</span>
    </span>
    {active && (
      <motion.span
        layoutId="nav-indicator"
        style={{ width:6, height:6, borderRadius:'50%', background:'#a78bfa', boxShadow:'0 0 10px #a78bfa', flexShrink:0 }}
      />
    )}
  </motion.div>
);

const StatCard = ({ label, value, icon, color }) => (
  <motion.div
    className="stat-card"
    whileHover={{ y: -6, scale: 1.02 }}
    transition={{ type:'spring', stiffness:300, damping:20 }}
  >
    <div style={{ position:'relative', zIndex:1 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div className="stat-label">{label}</div>
        <div className="stat-icon" style={{ color, background: `${color}18`, padding:'8px', borderRadius:'10px', border:`1px solid ${color}33` }}>{icon}</div>
      </div>
      <div className="stat-value" style={{ marginTop:'1rem' }}>{value}</div>
      <div className="stat-progress" style={{ marginTop:'1.25rem' }}>
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: '68%' }}
          transition={{ duration: 1.2, delay: 0.3, ease:'easeOut' }}
          style={{ background: `linear-gradient(90deg, ${color}, ${color}99)`, boxShadow:`0 0 12px ${color}66` }}
        />
      </div>
    </div>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="premium-tooltip">
        <p className="tooltip-label">{label || payload[0].name || payload[0].payload?.name}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontSize:'0.8rem', marginTop:'4px' }}>
            <span style={{ opacity:0.7 }}>{p.name}: </span>
            <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default App;
