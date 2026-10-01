import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';

const DEFAULT_REGIONS = [
  {
    id: 'usa',
    name: 'USA',
    fullName: 'United States of America',
    flag: '🇺🇸',
    hub: { x: 179, y: 202 },
    labelBox: { x: 175, y: 170, w: 75, h: 32 },
    routePath: 'M 713 248 C 550 130, 340 130, 179 202',
    ports: ['Port of New York / New Jersey', 'Port of Los Angeles / Long Beach', 'Houston', 'Savannah', 'Chicago Hub'],
    compliance: 'US FDA Registered • Prior Notice Filing • FSMA Compliant • USDA Organic Certified',
    transitTime: '22–28 Days Maritime • Express Air Freight Available',
    categories: ['Basmati & Non-Basmati Rice', 'Spices & Seasonings', 'Ready-to-Eat Ethnic Meals', 'Snacks & Confectionery'],
    description: 'Direct high-volume containerized shipments serving retail supermarket chains, ethnic food wholesale distributors, and food service partners across East and West coasts.',
    stats: { deliveryRate: '99.4%', volumeGrowth: '+32% YoY', containersServed: '350+ TEU' }
  },
  {
    id: 'europe',
    name: 'European Union',
    fullName: 'European Union Markets',
    flag: '🇪🇺',
    hub: { x: 530, y: 176 },
    labelBox: { x: 440, y: 160, w: 95, h: 30 },
    routePath: 'M 713 248 C 655 190, 590 176, 530 176',
    ports: ['Rotterdam (Netherlands)', 'Hamburg (Germany)', 'Antwerp (Belgium)', 'Genoa (Italy)', 'Marseille (France)'],
    compliance: 'Strict EU MRL (Pesticide) Limits • Non-GMO Declarations • Euro-Pallet Stacking • EFSA Compliant',
    transitTime: '18–24 Days Maritime (Direct Red Sea / Cape Routes)',
    categories: ['Organic Pulses & Lentils', 'Sesame Seeds & Tahini Grade', 'Dehydrated Onion & Garlic', 'Processed Fruit Pulps'],
    description: 'Comprehensive compliance with European Food Safety Authority (EFSA) regulations, laboratory heavy-metal testing, and certified temperature-controlled container logistics.',
    stats: { deliveryRate: '99.8%', volumeGrowth: '+28% YoY', containersServed: '280+ TEU' }
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    fullName: 'United Kingdom',
    flag: '🇬🇧',
    hub: { x: 504, y: 139 },
    labelBox: { x: 410, y: 125, w: 90, h: 30 },
    routePath: 'M 713 248 C 650 170, 580 145, 504 139',
    ports: ['London Gateway', 'Port of Felixstowe', 'Southampton', 'Liverpool'],
    compliance: 'UK DEFRA Standards • BRCGS Sourced • Complete Traceability Documentation',
    transitTime: '20–25 Days Maritime • Express Freight',
    categories: ['Whole & Ground Spices', 'Pulses, Dals & Flours', 'Pickles & Condiments', 'Traditional Indian Groceries'],
    description: 'Dedicated trade bridge supplying cash & carry wholesalers, mainstream British supermarket brands, and specialized Asian grocers across London, Midlands, and Scotland.',
    stats: { deliveryRate: '99.6%', volumeGrowth: '+24% YoY', containersServed: '210+ TEU' }
  },
  {
    id: 'norway',
    name: 'Norway & Scandinavia',
    fullName: 'Norway & Scandinavia',
    flag: '🇳🇴',
    hub: { x: 561, y: 107 },
    labelBox: { x: 560, y: 80, w: 125, h: 30 },
    routePath: 'M 713 248 C 660 150, 615 110, 561 107',
    ports: ['Port of Oslo', 'Bergen', 'Gothenburg', 'Drammen', 'Stavanger'],
    compliance: 'Mattilsynet (Norwegian Food Safety) Guidelines • Organic & Sustainable Verification',
    transitTime: '22–27 Days Maritime via Northern European Hubs',
    categories: ['Specialty Health Flours', 'Clean-Label Grains', 'Organic Spices & Herbs', 'Dehydrated Ingredients'],
    description: 'Exporting premium grade, clean-label agricultural goods meeting Norway’s stringent purity, microbiological, and sustainability parameters.',
    stats: { deliveryRate: '100%', volumeGrowth: '+40% YoY', containersServed: '85+ TEU' }
  },
  {
    id: 'gcc',
    name: 'GCC & Middle East',
    fullName: 'Gulf Cooperation Council (GCC)',
    flag: '🇦🇪',
    hub: { x: 549, y: 242 },
    labelBox: { x: 555, y: 228, w: 110, h: 30 },
    routePath: 'M 713 248 C 665 235, 605 235, 549 242',
    ports: ['Jebel Ali (Dubai, UAE)', 'Jeddah Islamic Port (KSA)', 'King Abdulaziz Port (Dammam)', 'Hamad Port (Qatar)', 'Sohar (Oman)', 'Shuwaikh (Kuwait)'],
    compliance: '100% Halal Certified • GSO Standard Food Labeling (Arabic & English) • SASO Approved',
    transitTime: '3–7 Days Fast Maritime (Direct Arabian Sea Route)',
    categories: ['Premium Basmati Rice', 'Pure Spices & Masalas', 'Edible Oils & Ghee', 'Snacks, Biscuits & Sweets'],
    description: 'High-frequency shipping corridor with lightning-fast transit times from Western India ports. Catering to Gulf supermarket hypermarkets, food distributors, and HORECA chains.',
    stats: { deliveryRate: '99.9%', volumeGrowth: '+45% YoY', containersServed: '600+ TEU' }
  },
  {
    id: 'asia',
    name: 'Asian Markets',
    fullName: 'Southeast & East Asian Markets',
    flag: '🌏',
    hub: { x: 845, y: 280 },
    labelBox: { x: 850, y: 255, w: 105, h: 30 },
    routePath: 'M 713 248 C 765 252, 805 264, 845 280',
    ports: ['Singapore Port', 'Port Klang (Malaysia)', 'Bangkok (Thailand)', 'Manila (Philippines)', 'Tokyo / Yokohama (Japan)'],
    compliance: 'ASEAN Food Safety Harmonization • Regional Phytosanitary Clearance • JFS Standards',
    transitTime: '6–14 Days Maritime Corridor',
    categories: ['Basmati & Specialty Rice', 'Whole Red Chillies & Turmeric', 'Dehydrated Agro-Products', 'Confectionery & Bakery Items'],
    description: 'Supplying dynamic Asian food processing facilities, restaurant distributor groups, and retail supermarket chains with rapid port-to-port connections.',
    stats: { deliveryRate: '99.5%', volumeGrowth: '+36% YoY', containersServed: '420+ TEU' }
  }
];

const ORIGIN = {
  id: 'india',
  name: 'India (Origin)',
  fullName: 'Republic of India — NMC Export Headquarters',
  flag: '🇮🇳',
  hub: { x: 713, y: 248 },
  labelBox: { x: 690, y: 240, w: 100, h: 42 },
  ports: ['Mundra Port (Gujarat)', 'Nhava Sheva (JNPT, Mumbai)', 'Hazira Port', 'Chennai Port'],
  description: 'Primary NMC agricultural sourcing, state-of-the-art grading & packaging hub, and central dispatch gateway to 6 worldwide trade corridors.'
};

const DEFAULT_PILLARS = [
  { number: '01', title: '6 Global Corridors', text: 'Established logistics networks reaching USA, Europe, UK, Norway, Asia, and GCC ports.', order: 1 },
  { number: '02', title: '100% HS & Lab Clearance', text: 'Pre-shipment phytosanitary, pesticide MRL, and fumigation certificates for zero-delay customs clearance.', order: 2 },
  { number: '03', title: 'Direct Sea & Air Options', text: 'Full Container Load (FCL), Less than Container Load (LCL), and urgent temperature-controlled air freight.', order: 3 },
  { number: '04', title: 'Flexible Incoterms', text: 'FOB, CIF, CFR, and DDP terms customized to buyer preference with transparent tracking.', order: 4 },
];

export default function GlobalServedMap() {
  const [selectedId, setSelectedId] = useState('all');
  const [hoveredId, setHoveredId] = useState(null);
  const dossierRef = useRef(null);

  const [mapConfig, setMapConfig] = useState({
    eyebrow: 'Global Export Footprint',
    title: 'Markets We Already Serve',
    description: 'Exporting verified agricultural produce, spices, and packaged food products directly from India’s trusted growers to six major global trade corridors.',
    regions: DEFAULT_REGIONS,
    pillars: DEFAULT_PILLARS,
  });

  useEffect(() => {
    api.get('/site-content').then((res) => {
      const incoming = res.data?.globalMap;
      if (incoming) {
        setMapConfig((prev) => ({
          eyebrow: incoming.eyebrow || prev.eyebrow,
          title: incoming.title || prev.title,
          description: incoming.description || prev.description,
          pillars: incoming.pillars?.length
            ? incoming.pillars
                .filter((p) => p.isActive !== false)
                .sort((a, b) => (a.order || 0) - (b.order || 0))
            : prev.pillars,
          regions: incoming.regions?.length
            ? incoming.regions
                .filter((r) => r.isActive !== false)
                .map((r) => {
                  const id = (r._id || r.id || r.code || '').toLowerCase();
                  const matchedDefault = DEFAULT_REGIONS.find(
                    (d) => d.id === id || d.name.toLowerCase() === (r.name || '').toLowerCase()
                  );

                  return {
                    id: matchedDefault?.id || id,
                    name: r.name || matchedDefault?.name,
                    fullName: r.fullName || matchedDefault?.fullName || r.name,
                    flag:
                      r.flag ||
                      matchedDefault?.flag ||
                      (r.code === 'USA'
                        ? '🇺🇸'
                        : r.code === 'UK'
                        ? '🇬🇧'
                        : r.code === 'Europe'
                        ? '🇪🇺'
                        : r.code === 'Norway'
                        ? '🇳🇴'
                        : r.code === 'GCC'
                        ? '🇦🇪'
                        : '🌏'),
                    hub: matchedDefault?.hub || { x: r.x ?? 500, y: r.y ?? 250 },
                    labelBox: matchedDefault?.labelBox,
                    routePath: matchedDefault?.routePath,
                    ports: Array.isArray(r.ports) && r.ports.length ? r.ports : matchedDefault?.ports || [],
                    compliance: r.compliance || matchedDefault?.compliance || 'International Standards Compliant',
                    transitTime: r.transitTime || matchedDefault?.transitTime || 'Direct Corridors',
                    categories: matchedDefault?.categories || ['Basmati Rice', 'Spices', 'Agricultural Commodities'],
                    badge: r.badge || matchedDefault?.badge || 'SCHEDULED EXPORT CORRIDOR',
                    serviceType: r.serviceType || matchedDefault?.serviceType || 'FCL & LCL Containerized Service',
                    originsText: r.originsText || matchedDefault?.originsText || 'Origins: Mundra / JNPT Ports',
                    description:
                      r.description ||
                      matchedDefault?.description ||
                      `Active trade bridge serving ${r.name} with certified export consignments and scheduled container sailings.`,
                    stats: {
                      deliveryRate: r.deliveryRate || r.stats?.deliveryRate || matchedDefault?.stats?.deliveryRate || '99.4%',
                      volumeGrowth: r.volumeGrowth || r.stats?.volumeGrowth || matchedDefault?.stats?.volumeGrowth || '+34%',
                      containersServed: r.containersServed || r.stats?.containersServed || matchedDefault?.stats?.containersServed || '250+ TEU',
                    },
                  };
                })
            : prev.regions,
        }));
      }
    }).catch(() => {});
  }, []);

  const regions = mapConfig.regions || DEFAULT_REGIONS;

  const activeRegion = useMemo(() => {
    if (!selectedId || selectedId === 'all') return null;
    return regions.find((r) => r.id === selectedId) || null;
  }, [selectedId, regions]);

  const activeHover = useMemo(() => {
    if (!hoveredId) return null;
    if (hoveredId === 'india') return ORIGIN;
    return regions.find((r) => r.id === hoveredId) || null;
  }, [hoveredId, regions]);

  const handleSelectRegion = (id) => {
    const next = selectedId === id ? 'all' : id;
    setSelectedId(next);
    if (next !== 'all') {
      setTimeout(() => {
        dossierRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  return (
    <section className="relative overflow-hidden border-t border-line bg-[#07130D] py-20 text-paper home-reveal-section select-none" id="global-presence">
      {/* Background ambient radial glows */}
      <div className="pointer-events-none absolute -left-48 top-10 h-[500px] w-[500px] rounded-full bg-forest/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-48 bottom-10 h-[500px] w-[500px] rounded-full bg-gold/10 blur-[130px]" />

      <div className="container-x relative select-none">
        {/* Section Header */}
        <div className="text-center home-reveal select-none">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold font-semibold">{mapConfig.eyebrow}</p>
          </div>

          <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-extrabold tracking-tight text-paper sm:text-4xl lg:text-5xl">
            {mapConfig.title}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base text-paper/70 leading-relaxed">
            {mapConfig.description}
          </p>
        </div>

        {/* Region Filter Buttons Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 home-reveal select-none">
          <button
            type="button"
            onClick={() => setSelectedId('all')}
            className={`select-none cursor-pointer rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-all duration-300 ${
              selectedId === 'all'
                ? 'bg-gold text-ink shadow-[0_0_20px_rgba(198,145,46,0.4)] ring-2 ring-gold'
                : 'border border-white/10 bg-white/5 text-paper/80 hover:border-gold/40 hover:bg-white/10 hover:text-paper'
            }`}
          >
            All Corridors ({regions.length})
          </button>

          {regions.map((region) => {
            const isSelected = selectedId === region.id;
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => handleSelectRegion(region.id)}
                onMouseEnter={() => setHoveredId(region.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`select-none cursor-pointer flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium tracking-wide transition-all duration-300 ${
                  isSelected
                    ? 'bg-gold font-bold text-ink shadow-[0_0_20px_rgba(198,145,46,0.4)] ring-2 ring-gold'
                    : 'border border-white/10 bg-white/5 text-paper/80 hover:border-gold/40 hover:bg-white/10 hover:text-paper'
                }`}
              >
                <span className="text-sm">{region.flag}</span>
                <span className="select-none">{region.name}</span>
                {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-ink animate-ping" />}
              </button>
            );
          })}
        </div>

        {/* Interactive Map Visual Stage */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-gold/25 bg-[#09150E] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
          <div className="relative aspect-[1024/503] w-full min-h-[380px] sm:min-h-[460px] md:min-h-[520px]">
            {/* Base Visual Artwork (Matching User Map Design) */}
            <img
              src="/global-served-map.jpg"
              alt="NMC Global Export Footprint and Trade Corridors Map"
              className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
              loading="eager"
            />

            {/* Subtle Vignette & Frame Highlight */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/15 shadow-[inset_0_0_90px_rgba(4,14,9,0.7)]" />

            {/* SVG Interactive Overlay Layer */}
            <svg
              viewBox="0 0 1024 503"
              className="absolute inset-0 h-full w-full select-none"
              preserveAspectRatio="xMidYMid meet"
              aria-label="Interactive Global Export Corridors Map"
            >
              <defs>
                {/* Radiant Golden Glow Filter */}
                <filter id="goldenLaser" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Intense Ping Glow */}
                <filter id="beaconGlow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* Subtle Amber Glow */}
                <radialGradient id="hubHalo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F5D061" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#C6912E" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#C6912E" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* 1. Trade Route Trajectories & Laser Pulses */}
              <g className="routes-layer pointer-events-none">
                {regions.map((region) => {
                  const isSelected = selectedId === region.id;
                  const isHovered = hoveredId === region.id;
                  const isRouteActive = isSelected || isHovered;
                  const pathD =
                    region.routePath ||
                    `M ${ORIGIN.hub.x} ${ORIGIN.hub.y} Q ${(ORIGIN.hub.x + region.hub.x) / 2} ${
                      Math.min(ORIGIN.hub.y, region.hub.y) - 40
                    } ${region.hub.x} ${region.hub.y}`;

                  return (
                    <g key={`route-${region.id}`}>
                      {/* Active Route Radiant Energy Beam */}
                      {isRouteActive && (
                        <>
                          <path
                            d={pathD}
                            fill="none"
                            stroke="#FFD700"
                            strokeWidth="3.5"
                            strokeOpacity="0.85"
                            strokeLinecap="round"
                            filter="url(#goldenLaser)"
                          />
                          <path
                            d={pathD}
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                            strokeOpacity="0.95"
                            strokeLinecap="round"
                          />
                        </>
                      )}

                      {/* Traveling Particle (Simulated Comet / Express Transit) */}
                      {(isRouteActive || selectedId === 'all') && (
                        <circle
                          r={isRouteActive ? 4 : 2.5}
                          fill="#FFFFFF"
                          filter="url(#beaconGlow)"
                        >
                          <animateMotion
                            path={pathD}
                            dur={isRouteActive ? '2.6s' : `${4.5 + Math.random() * 2}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}
              </g>

              {/* 2. India (ORIGIN) Master Beacon */}
              <g
                className="cursor-pointer origin-node"
                onClick={() => setSelectedId('all')}
                onMouseEnter={() => setHoveredId('india')}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Concentric Animated Radar Waves */}
                <circle cx={ORIGIN.hub.x} cy={ORIGIN.hub.y} r="22" fill="none" stroke="#F5D061" strokeWidth="1.5" opacity="0.8">
                  <animate attributeName="r" values="8;36" dur="2.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0" dur="2.8s" repeatCount="indefinite" />
                </circle>
                <circle cx={ORIGIN.hub.x} cy={ORIGIN.hub.y} r="14" fill="none" stroke="#C6912E" strokeWidth="1" opacity="0.6">
                  <animate attributeName="r" values="6;26" dur="2.8s" begin="0.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0" dur="2.8s" begin="0.8s" repeatCount="indefinite" />
                </circle>

                {/* Radar Ambient Radial Core */}
                <circle cx={ORIGIN.hub.x} cy={ORIGIN.hub.y} r="18" fill="url(#hubHalo)" />
                <circle cx={ORIGIN.hub.x} cy={ORIGIN.hub.y} r="6.5" fill="#F5D061" filter="url(#beaconGlow)" />
                <circle cx={ORIGIN.hub.x} cy={ORIGIN.hub.y} r="3" fill="#FFFFFF" />

                {/* Hitbox covering Hub and India Badge */}
                <rect
                  x={ORIGIN.hub.x - 30}
                  y={ORIGIN.hub.y - 15}
                  width="110"
                  height="65"
                  fill="transparent"
                  className="cursor-pointer"
                />
              </g>

              {/* 3. Destination Hubs & Interactive Hotspots */}
              {regions.map((region) => {
                const isSelected = selectedId === region.id;
                const isHovered = hoveredId === region.id;
                const isFocused = isSelected || isHovered;

                return (
                  <g
                    key={`node-${region.id}`}
                    className="cursor-pointer group"
                    onClick={() => handleSelectRegion(region.id)}
                    onMouseEnter={() => setHoveredId(region.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* Active Radar Wave Pulse when selected or hovered */}
                    {isFocused && (
                      <>
                        <circle
                          cx={region.hub.x}
                          cy={region.hub.y}
                          r="26"
                          fill="none"
                          stroke="#F5D061"
                          strokeWidth="2"
                        >
                          <animate attributeName="r" values="8;38" dur="1.8s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="1;0" dur="1.8s" repeatCount="indefinite" />
                        </circle>
                        <circle
                          cx={region.hub.x}
                          cy={region.hub.y}
                          r="16"
                          fill="none"
                          stroke="#C6912E"
                          strokeWidth="1.2"
                        >
                          <animate attributeName="r" values="6;24" dur="1.8s" begin="0.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.9;0" dur="1.8s" begin="0.5s" repeatCount="indefinite" />
                        </circle>
                      </>
                    )}

                    {/* Ambient Glow Aura */}
                    <circle
                      cx={region.hub.x}
                      cy={region.hub.y}
                      r={isFocused ? 18 : 12}
                      fill="url(#hubHalo)"
                      opacity={isFocused ? 1 : 0.4}
                      className="transition-all duration-300"
                    />

                    {/* Outer Target Ring */}
                    <circle
                      cx={region.hub.x}
                      cy={region.hub.y}
                      r={isFocused ? 7.5 : 5}
                      fill={isFocused ? '#FFD56B' : '#C6912E'}
                      stroke="#FFFFFF"
                      strokeWidth={isFocused ? '1.5' : '0.8'}
                      filter={isFocused ? 'url(#goldenLaser)' : undefined}
                      className="transition-all duration-300"
                    />

                    {/* Core White Center Dot */}
                    <circle
                      cx={region.hub.x}
                      cy={region.hub.y}
                      r={isFocused ? 3.5 : 2.5}
                      fill="#FFFFFF"
                    />

                    {/* Interactive Clickable Area covering the Hub Pin & Surrounding Label Badge */}
                    <rect
                      x={(region.labelBox?.x ? Math.min(region.hub.x - 20, region.labelBox.x - 10) : region.hub.x - 25)}
                      y={(region.labelBox?.y ? Math.min(region.hub.y - 20, region.labelBox.y - 10) : region.hub.y - 25)}
                      width={(region.labelBox?.w ? region.labelBox.w + 40 : 80)}
                      height={(region.labelBox?.h ? region.labelBox.h + 35 : 60)}
                      fill="transparent"
                      className="cursor-pointer"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Quick Interactive Tooltip Popover (Follows Active Node) */}
            {activeHover && (
              <div
                className="pointer-events-none absolute z-30 transition-all duration-200 transform -translate-x-1/2 -translate-y-full"
                style={{
                  left: `${(activeHover.hub.x / 1024) * 100}%`,
                  top: `${Math.max(12, ((activeHover.hub.y - 22) / 503) * 100)}%`,
                }}
              >
                <div className="flex flex-col gap-1 rounded-2xl border border-gold/40 bg-[#0B1A13]/95 px-3.5 py-2.5 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 min-w-[210px] max-w-[260px]">
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{activeHover.flag}</span>
                      <span className="font-display text-xs font-bold text-paper">{activeHover.name}</span>
                    </div>
                    <span className="rounded-full bg-gold/20 px-2 py-0.5 font-mono text-[9px] font-bold text-gold">
                      {activeHover.id === 'india' ? 'HQ ORIGIN' : 'ACTIVE CORRIDOR'}
                    </span>
                  </div>

                  {activeHover.id !== 'india' ? (
                    <>
                      <div className="flex items-center justify-between text-[10px] text-paper/80 pt-0.5">
                        <span className="text-paper/50">Transit Duration:</span>
                        <span className="font-semibold text-emerald-300">{activeHover.transitTime?.split('•')[0] || activeHover.transitTime}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-paper/80">
                        <span className="text-paper/50">On-Time Rate:</span>
                        <span className="font-mono font-bold text-gold">{activeHover.stats?.deliveryRate || '99.4%'}</span>
                      </div>
                      <p className="text-[9px] text-paper/50 italic pt-1">
                        Click pin or button below to inspect entry ports & compliance.
                      </p>
                    </>
                  ) : (
                    <p className="text-[10px] text-paper/70 pt-0.5">
                      {activeHover.description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* In-Map Bottom Status Pill & HUD Bar */}
            <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#09150E]/85 px-4 py-2.5 backdrop-blur-xl sm:left-6 sm:right-6">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold" />
                </span>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-gold">
                  Direct Export Corridors Active
                </span>
                <span className="hidden text-xs text-paper/40 sm:inline">•</span>
                <span className="hidden text-xs text-paper/70 sm:inline">
                  Origins: Mundra Port & Nhava Sheva (JNPT), India
                </span>
              </div>

              <div className="pointer-events-auto flex items-center gap-2">
                {selectedId !== 'all' ? (
                  <button
                    type="button"
                    onClick={() => setSelectedId('all')}
                    className="flex items-center gap-1 rounded-full border border-gold/40 bg-gold/15 px-3 py-1 font-mono text-[11px] font-semibold text-gold transition hover:bg-gold hover:text-ink cursor-pointer"
                  >
                    <span>Reset View</span>
                    <span>✕</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-paper/60 hidden md:inline">
                    Click any destination node or badge to inspect corridor dossier
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Selected Corridor Dossier Drawer Card */}
          {activeRegion && (
            <div ref={dossierRef} className="border-t border-gold/20 bg-[#0B1812] p-6 transition-all duration-300 sm:p-8">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-3xl">{activeRegion.flag}</span>
                    <h3 className="font-display text-2xl font-extrabold text-paper sm:text-3xl">{activeRegion.fullName || activeRegion.name}</h3>
                    <span className="rounded-full bg-gold/15 border border-gold/30 px-3 py-0.5 font-mono text-[11px] font-bold text-gold">
                      {activeRegion.badge || 'SCHEDULED EXPORT CORRIDOR'}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-paper/80">
                    {activeRegion.description}
                  </p>
                </div>

                {/* Key Performance Indicators for Selected Corridor */}
                <div className="flex flex-shrink-0 flex-wrap items-center gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center min-w-[100px]">
                    <p className="font-mono text-[10px] uppercase text-paper/50">On-Time Transit</p>
                    <p className="font-display text-lg font-bold text-gold">{activeRegion.stats?.deliveryRate || '99.4%'}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center min-w-[100px]">
                    <p className="font-mono text-[10px] uppercase text-paper/50">YoY Growth</p>
                    <p className="font-display text-lg font-bold text-emerald-400">{activeRegion.stats?.volumeGrowth || '+34%'}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center min-w-[100px]">
                    <p className="font-mono text-[10px] uppercase text-paper/50">Volume Capacity</p>
                    <p className="font-display text-lg font-bold text-paper">{activeRegion.stats?.containersServed || '250+ TEU'}</p>
                  </div>
                </div>
              </div>

              {/* Corridor Logistics Breakdown */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {/* 1. Primary Entry Ports */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-gold">
                      <span className="text-base">⚓</span>
                      <p className="font-mono text-xs font-bold uppercase tracking-wider">Primary Entry Ports</p>
                    </div>
                    <ul className="mt-3 space-y-1.5 text-xs text-paper/85">
                      {(activeRegion.ports || []).slice(0, 5).map((port, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-gold/70" />
                          <span>{port}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="mt-4 text-[11px] text-paper/40">{activeRegion.serviceType || 'FCL & LCL Containerized Service'}</p>
                </div>

                {/* 2. Transit Duration */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-gold">
                      <span className="text-base">⏱</span>
                      <p className="font-mono text-xs font-bold uppercase tracking-wider">Transit Timelines</p>
                    </div>
                    <p className="mt-3 text-base font-semibold text-emerald-300">
                      {activeRegion.transitTime}
                    </p>
                  </div>
                  <p className="mt-4 text-[11px] text-paper/50 font-mono">{activeRegion.originsText || 'Origins: Mundra / JNPT Ports'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Capabilities 4-Pillar Bar (Dynamic from Admin) */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 home-reveal">
          {(mapConfig.pillars || DEFAULT_PILLARS).map((pillar, idx) => (
            <div
              key={pillar._id || idx}
              className="rounded-2xl border border-white/10 bg-[#0C1A13]/60 p-5 transition duration-300 hover:border-gold/40 hover:bg-[#0E2118] backdrop-blur-sm"
            >
              <span className="font-mono text-xl font-bold text-gold">{pillar.number || String(idx + 1).padStart(2, '0')}</span>
              <h4 className="mt-2 font-display text-base font-bold text-paper">{pillar.title}</h4>
              <p className="mt-1.5 text-xs text-paper/60 leading-relaxed">
                {pillar.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
