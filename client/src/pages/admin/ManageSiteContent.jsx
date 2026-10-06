import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { asset } from '../../api/axios.js';
import ImageUpload from '../../components/admin/ImageUpload.jsx';
import VideoUpload from '../../components/admin/VideoUpload.jsx';
import { generateSvgFavicon, createAlignedFavicon } from '../../context/SiteContentContext.jsx';

const defaults = {
  header: {
    brandName: 'NMC',
    brandFullName: 'Nirmala Multitrading Co.',
    brandTagline: "India’s Taste. The World’s Table",
    logo: '/NMC logo.png',
    favicon: '/favicon.svg',
    faviconText: 'NMC',
    faviconSubtext: 'EXPORTS',
    faviconFit: 'contain',
    faviconBg: 'transparent',
    faviconShape: 'rounded',
    faviconPadding: 10,
    faviconScale: 100,
    faviconOffsetX: 0,
    faviconOffsetY: 0,
    faviconAlignedDataUrl: '',
    siteTitle:
      'Nirmala Multi Trading Co. (NMC) | Leading Indian Merchant Food Exporter | Spices, Grains & Agro Commodities',
    metaDescription:
      'Nirmala Multi Trading Co. (NMC) is a premier Indian merchant food exporter delivering Sortex-cleaned spices, grains, pulses, oil seeds, dehydrated foods and savories worldwide.',
    ctaText: 'Get a Quote',
    ctaLink: '/inquiry',
    navLinks: [
      { label: 'Home', to: '/', isActive: true, order: 1 },
      { label: 'About', to: '/about', isActive: true, order: 2 },
      { label: 'Products', to: '/products', isActive: true, order: 3 },
      { label: 'Partners', to: '/partners', isActive: true, order: 4 },
      { label: 'Brochures', to: '/brochures', isActive: true, order: 5 },
      { label: 'Blog', to: '/blog', isActive: true, order: 6 },
    ],
  },
  footer: {
    brandFullName: 'Nirmala Multitrading Co.',
    logo: '/NMC logo.png',
    blurb:
      'India’s Taste. The World’s Table — connecting trusted Indian food products with international buyers.',
    email: 'nirmalamultitradingco@gmail.com',
    phone: '+91 7069826082',
    address: 'Surat, Gujarat, India',
    inquiryCtaText: 'Request FOB / CIF Quote',
    inquiryCtaLink: '/inquiry',
    newsletterBadge: 'Exporter Market Intelligence',
    newsletterTitle: 'Get Instant Agro Market & Harvest Updates',
    newsletterDesc:
      'Subscribe to receive immediate alerts when new agro commodities, spices, or market trade reports are published.',
    badges: ['APEDA REG.', 'SPICE BOARD INDIA', 'FSSAI CERTIFIED', 'MUNDRA PORT (INMUN1)'],
    quickLinks: [
      { label: 'Products', to: '/products', isActive: true, order: 1 },
      { label: 'Partners', to: '/partners', isActive: true, order: 2 },
      { label: 'Brochures', to: '/brochures', isActive: true, order: 3 },
      { label: 'Blog', to: '/blog', isActive: true, order: 4 },
    ],
    copyrightText: 'Nirmala Multitrading Co. All rights reserved.',
    bottomTagline: 'Certified Indian Agro-Food Exporter',
  },
  loader: {
    isActive: true,
    logo: '/NMC logo.png',
    eyebrow: 'Certified Indian Agro-Food Exporter',
    title: 'Nirmala Multitrading Co.',
    tagline: "India’s Taste. The World’s Table",
    subtitle: 'Connecting Trusted Indian Agro-Food Products Globally',
    statusText: 'Preparing Premium Consignments…',
    badgeText: 'APEDA • SPICE BOARD INDIA • FSSAI',
    durationSeconds: 2.5,
    imageFit: 'cover',
    showProgress: true,
  },
  homeHero: {
    primaryButtonText: 'Browse products',
    primaryButtonLink: '/products',
    secondaryButtonText: 'Get a quote',
    secondaryButtonLink: '/inquiry',
    livePortLabel: 'LIVE EXPORT PORT',
    apedaRegText: 'APEDA REG: 218903',
    spicesBoardText: 'SPICES BOARD OF INDIA',
    items: [
      {
        eyebrow: '⚓ MUNDRA & JNPT PORTS • 40+ COUNTRIES',
        title: 'India’s Finest Agro Harvests. Delivered to the World.',
        description: 'Premier Indian merchant food exporter delivering Sortex-cleaned spices, grains, oil seeds, and snacks directly from certified farm clusters to international shelves.',
        chips: ['🚢 FCL & LCL Container Consolidation', '🔬 Lab MRL < 0.01 Tested', '🏷️ Custom Private Label (OEM)'],
        video: 'https://www.w3schools.com/html/mov_bbb.mp4',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
        badge: 'SPICES & AGRO COMMODITIES AD',
        stat: '28+ MT',
        statLabel: 'Max 40ft HC Capacity',
        adTag: 'Ad 01: Spices',
        primaryButtonText: '',
        primaryButtonLink: '',
        secondaryButtonText: '',
        secondaryButtonLink: '',
        order: 1,
        isActive: true,
      },
      {
        eyebrow: '🏷️ PRIVATE LABELING & PACKAGING',
        title: 'Authentic Roasted Namkeen & Savory Snack Foods.',
        description: 'Crispy Farali Chiwda, Roasted Makhana, Banana Wafers, and traditional Indian snacks packaged in multi-barrier nitrogen standup pouches.',
        chips: ['✨ Nitrogen Flush Freshness', '📦 Standup Barrier Pouches', '🌱 100% Non-GMO Purity'],
        video: 'https://www.w3schools.com/tags/movie.mp4',
        image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281084?auto=format&fit=crop&w=1200&q=80',
        badge: 'FARALI & SNACK FOODS AD',
        stat: '100%',
        statLabel: 'Retail Pouch Customization',
        adTag: 'Ad 02: Savories',
        primaryButtonText: '',
        primaryButtonLink: '',
        secondaryButtonText: '',
        secondaryButtonLink: '',
        order: 2,
        isActive: true,
      },
      {
        eyebrow: '🍃 ESTATE SOURCING & HARVESTS',
        title: 'Premium Estate Teas & Aromatic Coffee Beans.',
        description: 'Direct sourcing of single-origin Assam & Darjeeling teas, Arabica & Robusta coffee beans, and natural botanical infusions for global distributors.',
        chips: ['☕ Single-Origin Arabica', '🍃 Estate Grown CTC Tea', '📦 Vacuum Foil Barrier Packs'],
        video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
        badge: 'TEA & BEVERAGES HARVEST AD',
        stat: '48h',
        statLabel: 'Direct Mill Packaging',
        adTag: 'Ad 03: Beverages',
        primaryButtonText: '',
        primaryButtonLink: '',
        secondaryButtonText: '',
        secondaryButtonLink: '',
        order: 3,
        isActive: true,
      },
      {
        eyebrow: '🌐 GLOBAL CIF / FOB LOGISTICS',
        title: 'Precision Port Logistics with Zero Documentation Hassle.',
        description: 'Direct ocean container bookings with complete customs phytosanitary clearance, fumigation certifications, and audit-ready Certificate of Origin.',
        chips: ['⚓ Mundra Port (INMUN1) Direct', '📜 APEDA & Spice Board Reg.', '⚖️ Flexible FOB / CIF / CFR Terms'],
        video: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
        badge: 'PORT LOGISTICS & SHIPPING AD',
        stat: '48h',
        statLabel: 'Port Turnaround Time',
        adTag: 'Ad 04: Port Logistics',
        primaryButtonText: '',
        primaryButtonLink: '',
        secondaryButtonText: '',
        secondaryButtonLink: '',
        order: 4,
        isActive: true,
      },
    ],
  },
  aboutHero: {
    eyebrow: 'About NMC',
    title: 'India’s Taste. The World’s Table',
    description: 'We connect trusted Indian food products with international buyers through a clear, organised export process.',
    badges: ['✓ APEDA & Spice Board Registered', '✓ Port Direct Mundra & JNPT', '✓ 40+ Destination Ports'],
  },
  inquiryHero: { eyebrow: 'Get in touch', title: "We're ready to talk.", description: 'Tell us what you are looking for and our export team will get back to you with product details, samples and pricing.' },
  homeOfferings: { eyebrow: 'What we offer', title: 'Export support built around your market', description: '', items: [] },
  homeHowWeWork: { eyebrow: 'How we work', title: 'A single bridge to global buyers', description: '', items: [] },
  aboutApproach: { eyebrow: 'Our approach', title: 'What sets us apart', description: '', items: [] },
  aboutWhyChooseUs: { eyebrow: 'Why choose us', title: 'A practical partner for international food sourcing', description: '', items: [] },
  testimonials: { eyebrow: 'Client feedback', title: 'What our clients say about us', description: '', items: [] },
  globalMap: {
    eyebrow: 'Global Footprint',
    title: 'Export Corridors We Actively Serve',
    description: 'Reliable maritime & air freight routes delivering export-grade Indian agri commodities, spices, and processed foods worldwide.',
    regions: [
      { name: 'United States', fullName: 'United States', code: 'USA', badge: 'SCHEDULED EXPORT CORRIDOR', description: 'Active trade bridge serving United States with certified export consignments and scheduled container sailings.', x: 230, y: 195, ports: ['New York / New Jersey', 'Long Beach (Los Angeles)', 'Houston / Savannah'], transitTime: '28 – 40 Days', deliveryRate: '99.4%', volumeGrowth: '+34%', containersServed: '250+ TEU', serviceType: 'FCL & LCL Containerized Service', originsText: 'Origins: Mundra / JNPT Ports', order: 1, isActive: true },
      { name: 'United Kingdom', fullName: 'United Kingdom', code: 'UK', badge: 'SCHEDULED EXPORT CORRIDOR', description: 'Dedicated trade bridge supplying cash & carry wholesalers and mainstream supermarkets across the UK.', x: 472, y: 145, ports: ['Felixstowe', 'Southampton', 'London Gateway'], transitTime: '18 – 22 Days', deliveryRate: '99.8%', volumeGrowth: '+28%', containersServed: '210+ TEU', serviceType: 'FCL & LCL Containerized Service', originsText: 'Origins: Mundra / JNPT Ports', order: 2, isActive: true },
      { name: 'European Union', fullName: 'European Union Markets', code: 'Europe', badge: 'SCHEDULED EXPORT CORRIDOR', description: 'Comprehensive compliance with EFSA regulations, heavy-metal testing, and certified temperature logistics.', x: 510, y: 170, ports: ['Rotterdam (Netherlands)', 'Hamburg (Germany)', 'Antwerp (Belgium)'], transitTime: '20 – 24 Days', deliveryRate: '99.2%', volumeGrowth: '+41%', containersServed: '280+ TEU', serviceType: 'FCL & LCL Containerized Service', originsText: 'Origins: Mundra / JNPT Ports', order: 3, isActive: true },
      { name: 'Norway & Scandinavia', fullName: 'Norway & Scandinavia', code: 'Norway', badge: 'SCHEDULED EXPORT CORRIDOR', description: 'Exporting premium grade, clean-label agricultural goods meeting Norway’s stringent purity standards.', x: 520, y: 110, ports: ['Oslo Port', 'Gothenburg', 'Bergen'], transitTime: '22 – 26 Days', deliveryRate: '99.5%', volumeGrowth: '+19%', containersServed: '85+ TEU', serviceType: 'FCL & LCL Containerized Service', originsText: 'Origins: Mundra / JNPT Ports', order: 4, isActive: true },
      { name: 'GCC & Middle East', fullName: 'Gulf Cooperation Council (GCC)', code: 'GCC', badge: 'SCHEDULED EXPORT CORRIDOR', description: 'Swift maritime container feeder rotations connecting Mundra directly with Jebel Ali, Dammam, and Jeddah.', x: 615, y: 235, ports: ['Jebel Ali (Dubai)', 'Hamad Port (Qatar)', 'Jeddah Islamic Port (KSA)'], transitTime: '4 – 7 Days', deliveryRate: '99.9%', volumeGrowth: '+52%', containersServed: '420+ TEU', serviceType: 'FCL & LCL Containerized Service', originsText: 'Origins: Mundra / JNPT Ports', order: 5, isActive: true },
      { name: 'Asian Markets', fullName: 'Southeast Asia & Far East', code: 'Asian', badge: 'SCHEDULED EXPORT CORRIDOR', description: 'Supplying oil mills, spice grinders, and regional food packaging brands across East Asia.', x: 790, y: 280, ports: ['Port of Singapore', 'Port Klang (Malaysia)', 'Tokyo / Yokohama (Japan)'], transitTime: '8 – 14 Days', deliveryRate: '99.6%', volumeGrowth: '+37%', containersServed: '190+ TEU', serviceType: 'FCL & LCL Containerized Service', originsText: 'Origins: Mundra / JNPT Ports', order: 6, isActive: true },
    ],
    pillars: [
      { number: '01', title: '6 Global Corridors', text: 'Established logistics networks reaching USA, Europe, UK, Norway, Asia, and GCC ports.', order: 1, isActive: true },
      { number: '02', title: '100% HS & Lab Clearance', text: 'Pre-shipment phytosanitary, pesticide MRL, and fumigation certificates for zero-delay customs clearance.', order: 2, isActive: true },
      { number: '03', title: 'Direct Sea & Air Options', text: 'Full Container Load (FCL), Less than Container Load (LCL), and urgent temperature-controlled air freight.', order: 3, isActive: true },
      { number: '04', title: 'Flexible Incoterms', text: 'FOB, CIF, CFR, and DDP terms customized to buyer preference with transparent tracking.', order: 4, isActive: true },
    ],
  },
  certificates: {
    eyebrow: 'Accreditations & Compliance',
    title: 'Certified for Global Trade',
    description: 'Our export consignments strictly conform to international food safety, phytosanitary standards, and destination-country import regulations.',
    items: [
      { name: 'Food Safety and Standards Authority of India', issuer: 'Govt. of India Statutory Food License', code: 'fssai', description: 'Mandatory central certification verifying supreme hygiene, raw material testing, pesticide residue adherence, and ethical food packaging standards.', highlights: ['Zero adulteration mandate', 'Periodic batch laboratory assays', 'Full farm-to-dispatch traceability'], order: 1, isActive: true },
      { name: 'Agricultural & Processed Food Products Export Development Authority', issuer: 'Ministry of Commerce & Industry, India', code: 'apeda', description: 'Official export certification facilitating trade oversight, scheduled food grading, port-level phytosanitary documentation, and residue monitoring.', highlights: ['Global organic trace compliance', 'Govt accredited export verification', 'Scheduled agricultural standards'], order: 2, isActive: true },
      { name: 'Good Manufacturing Practice', issuer: 'Quality & Integrity Assured Manufacturing', code: 'gmp', description: 'Ensures products are consistently manufactured and controlled to quality standards appropriate to their intended use and international market requirements.', highlights: ['State-of-the-art grading & packing', 'Standard operating procedures (SOP)', 'Batch consistency guarantees'], order: 3, isActive: true },
      { name: 'Good Hygiene Practices', issuer: 'Sanitation & Clean Handling Protocol', code: 'ghp', description: 'Strict hygiene controls across raw material procurement, warehouse cleanliness, employee sanitation, and temperature-controlled storage.', highlights: ['Sanitized packing environments', 'Pest-free hermetic storage', 'Safe contact packaging'], order: 4, isActive: true },
      { name: 'Hazard Analysis Critical Control Point', issuer: 'Preventive Food Safety Protocol', code: 'haccp', description: 'Systematic preventive approach targeting biological, chemical, and physical food hazards in production processes rather than finished product inspection alone.', highlights: ['Critical control point monitoring', 'Contamination prevention', 'Continuous process validation'], order: 5, isActive: true },
      { name: 'ISO 22000:2018 Food Safety Management', issuer: 'International Organization for Standardization', code: 'iso22000', description: 'The premier global food safety management benchmark harmonizing interactive communication, system management, and prerequisite programs.', highlights: ['Comprehensive hazard screening', 'International supply-chain alignment', 'Rigorous third-party audits'], order: 6, isActive: true },
      { name: 'American Spice Trade Association', issuer: 'Premier International Spice Trade Body', code: 'asta', description: 'Adherence to ASTA cleanliness specifications, steam sterilization standards, volatile oil content guarantees, and moisture thresholds for North American and world markets.', highlights: ['Cleanliness & purity testing', 'ETO / Steam treated options', 'Strict volatile oil benchmarks'], order: 7, isActive: true },
    ],
  },
  engineerTrade: {
    eyebrow: 'Industrial & Large-Scale Operations',
    title: 'Engineering High-Volume Global Trade',
    description:
      'Scalable processing, precision container consolidation, and institutional supply chain reliability from farm gate to global port.',
    badge: 'FCL & Multi-Container Consignments',
    ctaTitle: 'Planning full container load (FCL) or multi-product shipments?',
    ctaSubtitle:
      'Direct liaison with Mundra and JNPT port customs brokers for swift container dispatch.',
    ctaButtonText: 'Get a quote',
    ctaButtonLink: '/inquiry',
    items: [
      {
        title: 'Sortex Cleaning & Optical Grading',
        metric: '99.9% Purity',
        subtitle: 'Zero foreign matter tolerance',
        description:
          'Advanced optical Buhler color sorters and gravity separators ensuring clean, uniform export-grade spices and oil seeds.',
        icon: '🔍',
        order: 1,
        isActive: true,
      },
      {
        title: 'Multi-Commodity FCL Consolidation',
        metric: '500+ TEU / yr',
        subtitle: 'Mundra & JNPT Port hubs',
        description:
          'Stuffing multiple distinct agricultural products into single 20ft/40ft ocean containers to optimize buyer inventory turnover.',
        icon: '🚢',
        order: 2,
        isActive: true,
      },
      {
        title: 'MRL & Phytosanitary Lab Clearance',
        metric: 'Zero-Rejection',
        subtitle: 'Certified export compliance',
        description:
          'Comprehensive pre-shipment tests for pesticide residue, aflatoxin, heavy metals, and moisture clearance before sailing.',
        icon: '📋',
        order: 3,
        isActive: true,
      },
      {
        title: 'Institutional Bulk & Private Label',
        metric: 'Custom Pack',
        subtitle: 'Tailored for retail & food service',
        description:
          'From 25kg / 50kg multi-wall paper and PP bags to high-barrier nitrogen-flushed retail standup pouches with buyer branding.',
        icon: '📦',
        order: 4,
        isActive: true,
      },
    ],
  },
  newArrivals: {
    isActive: true,
    badge: 'Live Market Arrivals',
    eyebrow: 'Fresh Crop Season 2026',
    title: 'New product arrivals',
    description: 'Directly sourced from verified Indian farm clusters and modern Sortex milling hubs.',
    autoRotateSeconds: 4,
    items: [
      {
        name: 'Sortex-Cleaned Cumin Seeds (Jeera)',
        slug: 'sortex-cumin-seeds-jeera',
        categoryName: 'Spices & Seasonings',
        origin: 'Unjha, Gujarat',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=75',
        shortDescription: '99.5% European purity, Sortex machine graded with volatile oil content > 3.0% and low moisture.',
        hsCode: '090931',
        packageType: '25kg Multi-wall Paper',
        moq: '1 x 20ft FCL',
        order: 1,
        isActive: true,
      },
      {
        name: '1121 Steam Basmati Rice (8.35mm+)',
        slug: '1121-steam-basmati-rice',
        categoryName: 'Grains & Pulses',
        origin: 'Punjab & Haryana',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=75',
        shortDescription: 'Extra-long slender grain, rich aroma, and 2.5x elongation upon cooking. Aflatoxin tested.',
        hsCode: '100630',
        packageType: '10kg / 25kg Non-Woven',
        moq: '1 x 20ft FCL',
        order: 2,
        isActive: true,
      },
      {
        name: 'High Curcumin Turmeric Fingers',
        slug: 'high-curcumin-turmeric-fingers',
        categoryName: 'Spices & Seasonings',
        origin: 'Salem / Nizamabad',
        image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=75',
        shortDescription: 'Deep golden yellow fingers with 3.8%–5.2% natural curcumin. Free of Sudan dyes and lead chromate.',
        hsCode: '091030',
        packageType: '25kg / 50kg Jute & PP',
        moq: '1 x 20ft FCL',
        order: 3,
        isActive: true,
      },
      {
        name: 'Dehydrated White Onion Flakes / Kibbled',
        slug: 'dehydrated-white-onion-flakes',
        categoryName: 'Dehydrated Foods',
        origin: 'Mahuva, Gujarat',
        image: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?auto=format&fit=crop&w=800&q=75',
        shortDescription: 'Crisp, pungent dehydrated onion kibbled with moisture < 5.5%. Microbial assay for zero Salmonella.',
        hsCode: '071220',
        packageType: '14kg Carton with Poly Liner',
        moq: '1 x 20ft FCL',
        order: 4,
        isActive: true,
      },
      {
        name: 'Hulled White Sesame Seeds (99.98% Purity)',
        slug: 'hulled-white-sesame-seeds',
        categoryName: 'Oil Seeds & Commodities',
        origin: 'Saurashtra, Gujarat',
        image: 'https://images.unsplash.com/photo-1563412885-139e4045ec52?auto=format&fit=crop&w=800&q=75',
        shortDescription: 'Mechanically hulled white sesame seeds with min 51% oil content, Sortex laser sorted.',
        hsCode: '120740',
        packageType: '25kg 3-Ply Paper Bags',
        moq: '1 x 20ft FCL',
        order: 5,
        isActive: true,
      },
    ],
  },
  flashCard: {
    isActive: true,
    title: 'India’s Taste. The World’s Table',
    subtitle: 'Direct sourcing of export-grade Indian spices, premium grains, and agro-commodities with certified global shipping.',
    image: '',
    buttonText: 'Explore Our Products',
    buttonLink: '/products',
  },
  chatbot: {
    botName: 'TradeMitra',
    botSubtitle: 'AI Export & Sourcing Assistant',
    welcomeMessage:
      'Hello! I am **TradeMitra**, your export & sourcing assistant at **Nirmala Multi Trading Co.** (NMC).\n\nHow can I assist your food import or procurement inquiry today?',
    defaultSuggestions: [
      'What spices do you export?',
      'Shipping to USA, Europe & GCC',
      'Can I request sample kits?',
      'Certificates & Quality',
    ],
    disclaimer:
      'Responses are generated based on NMC product catalogues and export shipping specifications.',
    isActive: true,
    knowledgeBase: [
      {
        triggers: ['spice', 'spices', 'cumin', 'turmeric', 'chilli', 'coriander', 'fenugreek', 'fennel', 'mustard', 'pepper'],
        reply: 'We export 100% Sortex-cleaned, premium Indian spices directly from farm clusters in Gujarat and Rajasthan: Cumin Seeds (Singapore 99%, Europe 99.5% Sortex), Turmeric (High Curcumin 3-5%), Red Chilli (Teja, Sanman, Byadgi), and Coriander seeds. Steam-sterilized and pesticide compliant.',
        link: '/products',
        linkText: 'Browse All Products →',
        suggestions: ['What is your MOQ?', 'Request sample kit', 'Lab certifications'],
        order: 1,
        isActive: true,
      },
      {
        triggers: ['grain', 'grains', 'rice', 'basmati', 'wheat', 'pulse', 'pulses', 'dal', 'chickpea', 'lentil'],
        reply: 'We supply high-grade Indian agricultural grains and pulses in bulk and retail packs: Basmati Rice (1121 Steam, Sella & Golden Sella 8.35mm+), Non-Basmati (Sona Masoori, PR-11, IR-64), and Pulses (Kabuli Chickpeas 75/80, 58/60, Toor Dal, Moong).',
        link: '/products',
        linkText: 'Explore Grain & Rice Catalogue →',
        suggestions: ['What is your MOQ?', 'Shipping transit time', 'Request pricing'],
        order: 2,
        isActive: true,
      },
      {
        triggers: ['dehydrate', 'dehydrated', 'onion', 'garlic', 'flake', 'powder'],
        reply: 'NMC sources premium dehydrated vegetables from Mahuva, Gujarat: Dehydrated White & Red Onion (Flakes, Minced, Chopped, Powder) and Dehydrated Garlic (Cloves, Flakes, Minced, Pure Powder). Moisture < 6% with zero Salmonella/E. Coli.',
        link: '/products',
        linkText: 'View Dehydrated Products →',
        suggestions: ['Ask for quotation', 'Request sample kit'],
        order: 3,
        isActive: true,
      },
      {
        triggers: ['port', 'ports', 'shipping', 'transit', 'logistics', 'container', 'fcl', 'lcl', 'freight', 'mundra', 'jnpt'],
        reply: 'We handle smooth containerized logistics from Mundra Port (Gujarat) & Nhava Sheva (JNPT, Mumbai). Transit times: GCC 3-7 days, Asia 6-14 days, UK 20-25 days, Europe 18-24 days, USA 22-28 days. Available in FCL and LCL under FOB, CIF, CFR, or DDP terms.',
        link: '/inquiry',
        linkText: 'Get Container Freight Quote →',
        suggestions: ['How to request samples?', 'Pesticide & Lab compliance'],
        order: 4,
        isActive: true,
      },
      {
        triggers: ['certificate', 'certificates', 'certification', 'fssai', 'apeda', 'iso', 'haccp', 'gmp', 'asta', 'lab'],
        reply: 'Our export consignments strictly conform to international food safety regulations: FSSAI, APEDA, ISO 22000:2018, HACCP, GMP, and ASTA benchmarks. We supply Phytosanitary Certificate, Fumigation Certificate, Certificate of Origin, and SGS/Eurofins pesticide MRL lab reports.',
        link: '/brochures',
        linkText: 'Download Specification Sheets →',
        suggestions: ['Request sample kit', 'What spices do you export?'],
        order: 5,
        isActive: true,
      },
      {
        triggers: ['sample', 'samples', 'moq', 'minimum order', 'order quantity'],
        reply: 'Physical Sample Kits: We dispatch representative laboratory samples via international courier (DHL / FedEx) for your testing and sensory evaluation. Commercial MOQ: Typically 1 FCL (20ft container ≈ 18-25 MT). We also offer LCL consolidation for trial orders.',
        link: '/inquiry',
        linkText: 'Request Physical Sample Kit →',
        suggestions: ['Send an inquiry', 'Talk to sales team'],
        order: 6,
        isActive: true,
      },
      {
        triggers: ['partner', 'partners', 'supplier', 'become partner', 'registration', 'producer'],
        reply: 'Are you a food manufacturer, miller, or farmer group in India? NMC collaborates with verified Indian food processors and agricultural mills to export worldwide. You can register directly on our Partners page!',
        link: '/become-a-partner',
        linkText: 'Submit Partner Registration →',
        suggestions: ['Browse all products', 'Contact details'],
        order: 7,
        isActive: true,
      },
      {
        triggers: ['price', 'pricing', 'quote', 'quotation', 'rate', 'cost', 'cif', 'fob'],
        reply: 'Agricultural commodity prices fluctuate based on seasonal harvest arrivals and ocean freight rates. To receive an official FOB (Mundra/JNPT) or CIF quotation, please submit an inquiry with your desired quantity and destination port.',
        link: '/inquiry',
        linkText: 'Request CIF / FOB Quotation →',
        suggestions: ['Request sample kit', 'Port transit times'],
        order: 8,
        isActive: true,
      },
    ],
  },
  productsPage: {
    isActive: true,
    hero: {
      badge: 'Global Agro-Food Catalogue',
      eyebrow: 'CERTIFIED INDIAN EXPORTS',
      title: 'All Export Food Products',
      subtitle:
        '100% Sortex-cleaned Indian spices, premium grains, pulses, and value-added food products ready for containerized ocean shipping.',
    },
    showcase: {
      isActive: true,
      defaultMode: 'wheel',
      title: 'Featured Export Products',
      subtitle:
        'Discover our certified Sortex-cleaned harvest lots and premium packaged Indian food products ready for global ocean freight.',
      watermark: 'FOOD PRODUCTS',
      autoRotateSeconds: 3.5,
      showcaseBadge: 'FEATURED FOOD SHOWCASE',
      keepCustomTitle: false,
    },
    bento: {
      badge: 'DIRECT SOURCING GUARANTEE',
      headline: 'Global Food Products, Perfected',
      subtitle:
        'Direct sourcing of export-grade Indian spices, premium grains, and food products with certified global shipping.',
      bullets: [
        'Direct Mundra Port (INMUN1) & JNPT Container Stuffing',
        'APEDA, Spice Board of India & FSSAI Registered Consignments',
        'European MRL & ASTA Purity Compliance with Full Batch Traceability',
        'Customized Retail Standup Pouches & Institutional Bulk Bags',
      ],
      buttonText: 'Request Container Quotation',
      buttonLink: '/inquiry',
      secondaryButtonText: 'Download Line Card',
      secondaryButtonLink: '/brochures',
    },
    trustBar: {
      isActive: true,
      title: 'Why Global Buyers Trust NMC',
      items: [
        {
          icon: '🔍',
          title: '100% Sortex Optical Cleaning',
          text: 'Laser graded to 99.5% European purity with zero foreign contaminants.',
        },
        {
          icon: '🚢',
          title: 'Port-Direct Logistics',
          text: 'Express sailings from Mundra Port and JNPT Nhava Sheva to worldwide ports.',
        },
        {
          icon: '📜',
          title: 'Phyto & MRL Compliance',
          text: 'Pre-shipment phytosanitary and aflatoxin lab assays with every container.',
        },
        {
          icon: '📦',
          title: 'Custom Packaging & Branding',
          text: 'From 25kg multi-wall paper bags to buyer-branded retail standup pouches.',
        },
      ],
    },
    ctaBanner: {
      isActive: true,
      eyebrow: 'READY FOR EXPORT ORDERS',
      title: 'Need Container Freight Quotations or Custom Samples?',
      description:
        'Our international trade desk prepares formal FOB (Mundra/JNPT) or CIF proforma invoices within 12–24 business hours. Courier sample kits dispatched worldwide.',
      buttonPrimaryText: 'Request Official Quotation →',
      buttonPrimaryLink: '/inquiry',
      buttonSecondaryText: 'Download Product Brochures',
      buttonSecondaryLink: '/brochures',
    },
  },
  featuredSection: {
    isActive: true,
    eyebrow: 'The next shipment',
    title: 'Featured product details',
    linkText: 'All product details →',
    linkTo: '/product-details',
  },
  exploreProductsSection: {
    isActive: true,
    eyebrow: 'Products',
    title: 'Explore our products',
    description:
      'Source Sortex-cleaned export spices, premium grains, pulses, and value-added agro-commodities directly from trusted producers.',
    linkText: 'All products →',
    linkTo: '/products',
  },
  partnersSection: {
    isActive: true,
    eyebrow: 'Collaborations',
    title: 'Companies we work with',
    description:
      'We list and represent products from trusted growers, millers, and certified food processing clusters across India.',
  },
  homeCta: {
    isActive: true,
    eyebrow: 'Ready to talk?',
    title: "Tell us what you're buying — we'll send samples and pricing.",
    description:
      'Direct liaison with Mundra and JNPT port customs brokers for swift container dispatch.',
    buttonText: 'Send an inquiry',
    buttonLink: '/inquiry',
  },
  aboutCommitment: {
    isActive: true,
    eyebrow: 'Our Commitment',
    title: 'Transparent, Direct & Zero-Friction Exporting',
    description:
      'We understand that every export requirement is different. We combine product knowledge, supplier coordination and documentation support to help buyers move from enquiry to shipment with fewer surprises.',
    buttonPrimaryText: 'Start a conversation',
    buttonPrimaryLink: '/inquiry?source=aboutConversation',
    buttonSecondaryText: 'Browse Products',
    buttonSecondaryLink: '/products',
  },
  aboutCta: {
    isActive: true,
    title: 'Looking for a specific food product?',
    description:
      'Tell us what you need and our export team will verify product availability, packaging formats and indicative pricing.',
    buttonPrimaryText: 'Get in touch',
    buttonPrimaryLink: '/inquiry',
    buttonSecondaryText: 'Download Line Cards',
    buttonSecondaryLink: '/brochures',
  },
  brochuresHero: {
    eyebrow: 'Official Catalogues & Line Cards',
    title: 'Export Product Catalogues & Line Cards',
    description:
      'Download detailed export specifications, packing formats, HS codes, and container payload capacities in verified PDF format.',
    image: '',
    video: '',
    autoPlay: true,
    autoPlayInterval: 5,
    slides: [],
    showBadges: true,
    badges: [
      { text: 'Verified Export Specs', color: 'gold', link: '' },
      { text: 'Direct PDF Downloads', color: 'emerald', link: '' },
      { text: 'Container Payload Data', color: 'blue', link: '' },
    ],
    buyerAssurance: {
      show: true,
      title: 'Buyer Assurance',
      badge: 'APEDA • ISO 22000',
      mediaType: 'none',
      image: '',
      video: '',
      mediaDisplay: 'cardScreen',
      mediaCaption: 'Live Export Cargo & Facility',
      footerLeft: 'Direct Seaport Loading',
      footerRight: 'Mundra & JNPT',
      items: [
        {
          icon: '📦',
          title: 'Container Payload Data',
          subtitle: '20ft (18-22 MT) • 40ft HC (28 MT)',
        },
        {
          icon: '🔬',
          title: '100% Sortex Optical Cleaning',
          subtitle: 'MRL < 0.01 Lab Assay Certified',
        },
        {
          icon: '⚡',
          title: 'Verified PDF Line Cards',
          subtitle: 'Instant Technical Specifications',
        },
      ],
    },
    isActive: true,
  },
  partnersPage: {
    eyebrow: 'Collaborations',
    title: 'Companies we work with',
    description:
      'Trusted Indian agricultural growers, mills, and food manufacturing enterprises whose products we export globally.',
    bannerEyebrow: 'Supplier & Producer Onboarding',
    bannerTitle: 'Expand Your Food Products Worldwide with NMC',
    bannerDescription:
      'Are you an Indian food manufacturer, miller, farmer producer organization (FPO), or spice processor? Partner with Nirmala Multitrading Co. for scheduled container consignments from Mundra and JNPT to 40+ destination countries.',
    bannerButtonText: 'Become a Partner Form →',
    bannerButtonLink: '/become-a-partner',
    bannerSecondaryText: 'Contact Procurement Desk',
    bannerSecondaryLink: '/inquiry',
    isActive: true,
  },
  blogHero: {
    eyebrow: 'Media & Articles',
    title: 'Blog',
    description:
      'Latest insights, global commodity market updates, company announcements, and trade stories.',
    isActive: true,
  },
  favicon: '/favicon.svg',
  faviconText: 'NMC',
  faviconSubtext: 'EXPORTS',
  faviconFit: 'contain',
  faviconBg: 'transparent',
  faviconShape: 'rounded',
  faviconPadding: 10,
  faviconScale: 100,
  faviconOffsetX: 0,
  faviconOffsetY: 0,
  faviconAlignedDataUrl: '',
  siteTitle: 'Nirmala Multi Trading Co. (NMC) | Indian Merchant Food Exporter',
  metaDescription: 'Merchant exporter of premium agro commodities, spices, grains, oil seeds, and food products from India to global ports.',
};

const clone = (v) => JSON.parse(JSON.stringify(v));

function ItemEditor({ section, setSection, image = false, side = false, video = false }) {
  const updateItem = (i, key, value) => {
    const items = [...(section?.items || [])];
    items[i] = { ...items[i], [key]: value };
    setSection({ ...section, items });
  };
  const add = () =>
    setSection({
      ...section,
      items: [
        ...(section?.items || []),
        {
          title: '',
          description: '',
          icon: String((section?.items?.length || 0) + 1).padStart(2, '0'),
          order: (section?.items?.length || 0) + 1,
          isActive: true,
          image: '',
          video: '',
          side: 'left',
        },
      ],
    });
  const remove = (i) =>
    setSection({
      ...section,
      items: (section?.items || []).filter((_, index) => index !== i),
    });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Eyebrow / small label</label>
          <input
            className="field"
            value={section?.eyebrow || ''}
            onChange={(e) => setSection({ ...section, eyebrow: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Main heading</label>
          <input
            className="field"
            value={section?.title || ''}
            onChange={(e) => setSection({ ...section, title: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="label">Description</label>
        <textarea
          className="field"
          rows="3"
          value={section?.description || ''}
          onChange={(e) => setSection({ ...section, description: e.target.value })}
        />
      </div>
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold">Items</h3>
        <button type="button" className="btn-outline" onClick={add}>
          + Add item
        </button>
      </div>
      {(section?.items || []).map((item, i) => (
        <div key={item._id || i} className="rounded-xl border border-line bg-paper p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-moss">Item {i + 1}</span>
            <button
              type="button"
              className="text-sm text-clay hover:underline"
              onClick={() => remove(i)}
            >
              Remove
            </button>
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Title</label>
              <input
                className="field"
                value={item.title || ''}
                onChange={(e) => updateItem(i, 'title', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Number / icon</label>
              <input
                className="field"
                value={item.icon || ''}
                onChange={(e) => updateItem(i, 'icon', e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <textarea
                className="field"
                rows="3"
                value={item.description || ''}
                onChange={(e) => updateItem(i, 'description', e.target.value)}
              />
            </div>
            {image && (
              <div className="sm:col-span-2">
                <ImageUpload
                  label="Poster / Fallback Image"
                  value={item.image || ''}
                  onChange={(url) => updateItem(i, 'image', url)}
                />
              </div>
            )}
            {video && (
              <div className="sm:col-span-2">
                <VideoUpload
                  label="Product Commercial Video (MP4 / WebM / Direct URL)"
                  value={item.video || ''}
                  onChange={(url) => updateItem(i, 'video', url)}
                />
              </div>
            )}
            {side && (
              <div>
                <label className="label">Timeline side</label>
                <select
                  className="field"
                  value={item.side || 'left'}
                  onChange={(e) => updateItem(i, 'side', e.target.value)}
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>
            )}
            <div className="w-28">
              <label className="label">Order</label>
              <input
                type="number"
                className="field"
                value={item.order ?? i + 1}
                onChange={(e) => updateItem(i, 'order', Number(e.target.value))}
              />
            </div>
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={item.isActive !== false}
              onChange={(e) => updateItem(i, 'isActive', e.target.checked)}
            />{' '}
            Visible on site
          </label>
        </div>
      ))}
    </div>
  );
}

function HomeHeroEditor({ section, setSection }) {
  const current = section || defaults.homeHero;

  const updateField = (field, val) => setSection({ ...current, [field]: val });

  const updateItem = (i, key, val) => {
    const items = [...(current.items || [])];
    items[i] = { ...items[i], [key]: val };
    setSection({ ...current, items });
  };

  const addItem = () => {
    const newIdx = (current.items?.length || 0) + 1;
    setSection({
      ...current,
      items: [
        ...(current.items || []),
        {
          eyebrow: '⚓ MUNDRA & JNPT PORTS • 40+ COUNTRIES',
          adTag: `Ad 0${newIdx}: New Category`,
          badge: 'SPICES & AGRO COMMODITIES AD',
          title: 'Premium Indian Agro Commodities',
          description: 'Sortex cleaned agro commodities packaged and delivered globally.',
          chips: ['✨ Nitrogen Flush Freshness', '📦 Standup Barrier Pouches', '🌱 100% Non-GMO Purity'],
          video: '',
          image: '',
          stat: '100%',
          statLabel: 'Export Quality Guarantee',
          primaryButtonText: '',
          primaryButtonLink: '',
          secondaryButtonText: '',
          secondaryButtonLink: '',
          order: newIdx,
          isActive: true,
        },
      ],
    });
  };

  const removeItem = (i) => {
    setSection({
      ...current,
      items: (current.items || []).filter((_, idx) => idx !== i),
    });
  };

  const updateChip = (slideIdx, chipIdx, text) => {
    const items = [...(current.items || [])];
    const currentChips = Array.isArray(items[slideIdx]?.chips) ? [...items[slideIdx].chips] : [];
    currentChips[chipIdx] = text;
    items[slideIdx] = { ...items[slideIdx], chips: currentChips };
    setSection({ ...current, items });
  };

  const addChip = (slideIdx) => {
    const items = [...(current.items || [])];
    const currentChips = Array.isArray(items[slideIdx]?.chips) ? [...items[slideIdx].chips] : [];
    currentChips.push('✨ New Feature Highlight');
    items[slideIdx] = { ...items[slideIdx], chips: currentChips };
    setSection({ ...current, items });
  };

  const removeChip = (slideIdx, chipIdx) => {
    const items = [...(current.items || [])];
    const currentChips = (items[slideIdx]?.chips || []).filter((_, idx) => idx !== chipIdx);
    items[slideIdx] = { ...items[slideIdx], chips: currentChips };
    setSection({ ...current, items });
  };

  return (
    <div className="space-y-6">
      {/* TOP BEACON BAR (Image 2) */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">📡</span>
          <h3 className="font-display font-bold text-lg text-ink">Top Live Port Beacon Bar (Image 2)</h3>
        </div>
        <p className="text-xs text-ink/60 mb-4">
          Configure the live export status indicator and APEDA / Spices Board registration texts shown at the very top of the hero section.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label text-xs">Live Port Status Label</label>
            <input
              className="field text-sm"
              placeholder="LIVE EXPORT PORT"
              value={current.livePortLabel ?? 'LIVE EXPORT PORT'}
              onChange={(e) => updateField('livePortLabel', e.target.value)}
            />
          </div>
          <div>
            <label className="label text-xs">APEDA Reg. Text</label>
            <input
              className="field text-sm"
              placeholder="APEDA REG: 218903"
              value={current.apedaRegText ?? 'APEDA REG: 218903'}
              onChange={(e) => updateField('apedaRegText', e.target.value)}
            />
          </div>
          <div>
            <label className="label text-xs">Spices Board Text</label>
            <input
              className="field text-sm"
              placeholder="SPICES BOARD OF INDIA"
              value={current.spicesBoardText ?? 'SPICES BOARD OF INDIA'}
              onChange={(e) => updateField('spicesBoardText', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 1. GLOBAL ACTION BUTTONS (Image 1) */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🔘</span>
          <h3 className="font-display font-bold text-lg text-ink">Hero Action Buttons (Global Defaults)</h3>
        </div>
        <p className="text-xs text-ink/60 mb-4">
          Configure the primary gold button and secondary glass button shown on the hero section across all ad slides.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Primary Button */}
          <div className="rounded-xl border border-gold/40 bg-[#fbf9f4] p-4">
            <span className="font-mono text-xs font-bold uppercase text-moss block mb-2">
              Primary Gold Button (Image 1)
            </span>
            <div className="space-y-3">
              <div>
                <label className="label text-xs">Button Label / Text</label>
                <input
                  className="field text-sm"
                  placeholder="Browse products"
                  value={current.primaryButtonText ?? 'Browse products'}
                  onChange={(e) => updateField('primaryButtonText', e.target.value)}
                />
              </div>
              <div>
                <label className="label text-xs">Target Link URL</label>
                <input
                  className="field text-sm"
                  placeholder="/products"
                  value={current.primaryButtonLink ?? '/products'}
                  onChange={(e) => updateField('primaryButtonLink', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Secondary Button */}
          <div className="rounded-xl border border-line bg-[#fbf9f4] p-4">
            <span className="font-mono text-xs font-bold uppercase text-moss block mb-2">
              Secondary Glass Button (Image 1)
            </span>
            <div className="space-y-3">
              <div>
                <label className="label text-xs">Button Label / Text</label>
                <input
                  className="field text-sm"
                  placeholder="Get a quote"
                  value={current.secondaryButtonText ?? 'Get a quote'}
                  onChange={(e) => updateField('secondaryButtonText', e.target.value)}
                />
              </div>
              <div>
                <label className="label text-xs">Target Link URL</label>
                <input
                  className="field text-sm"
                  placeholder="/inquiry"
                  value={current.secondaryButtonLink ?? '/inquiry'}
                  onChange={(e) => updateField('secondaryButtonLink', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. AD COMMERCIAL SLIDES (Images 2, 3, 4) */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-line pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎬</span>
              <h3 className="font-display font-bold text-lg text-ink">Product Video Ad Slides</h3>
            </div>
            <p className="text-xs text-ink/60">
              Manage commercial ad slides, video trailers, headlines, feature chips, badges, and bottom dock tabs.
            </p>
          </div>
          <button type="button" className="btn-primary text-xs shrink-0" onClick={addItem}>
            + Add New Ad Slide
          </button>
        </div>

        <div className="space-y-6">
          {(current.items || []).map((item, i) => (
            <div key={item._id || i} className="rounded-2xl border border-line bg-[#fbf9f4] p-5 shadow-sm space-y-4">
              {/* Slide Card Header */}
              <div className="flex items-center justify-between border-b border-line/70 pb-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-forest text-gold px-2.5 py-1 font-mono text-xs font-bold">
                    Slide #{i + 1}
                  </span>
                  <span className="font-display font-semibold text-sm text-ink truncate max-w-xs">
                    {item.adTag || item.title || `Ad 0${i + 1}`}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.isActive !== false}
                      onChange={(e) => updateItem(i, 'isActive', e.target.checked)}
                    />
                    Active
                  </label>
                  <button
                    type="button"
                    className="text-xs font-semibold text-clay hover:underline"
                    onClick={() => removeItem(i)}
                  >
                    Delete Slide
                  </button>
                </div>
              </div>

              {/* Row 1: Ad Tag (Image 3) & Badge (Image 4) & Eyebrow */}
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="label text-xs font-bold flex items-center gap-1">
                    <span>🏷️</span> Ad Tab Label (Bottom Dock)
                  </label>
                  <input
                    className="field text-sm font-mono"
                    placeholder="e.g. Ad 01: Spices"
                    value={item.adTag || ''}
                    onChange={(e) => updateItem(i, 'adTag', e.target.value)}
                  />
                  <p className="text-[11px] text-ink/50 mt-1">Shown in the bottom tab selector (Image 3)</p>
                </div>
                <div>
                  <label className="label text-xs font-bold flex items-center gap-1">
                    <span>🎬</span> Commercial Badge Pill
                  </label>
                  <input
                    className="field text-sm font-mono"
                    placeholder="e.g. SPICES & AGRO COMMODITIES AD"
                    value={item.badge || ''}
                    onChange={(e) => updateItem(i, 'badge', e.target.value)}
                  />
                  <p className="text-[11px] text-ink/50 mt-1">Top pill badge above headline (Image 4)</p>
                </div>
                <div>
                  <label className="label text-xs font-bold flex items-center gap-1">
                    <span>⚓</span> Live Port Eyebrow / Tagline
                  </label>
                  <input
                    className="field text-sm"
                    placeholder="e.g. ⚓ MUNDRA & JNPT PORTS • 40+ COUNTRIES"
                    value={item.eyebrow || ''}
                    onChange={(e) => updateItem(i, 'eyebrow', e.target.value)}
                  />
                  <p className="text-[11px] text-ink/50 mt-1">Top port bar announcement</p>
                </div>
              </div>

              {/* Row 2: Headline & Description */}
              <div className="grid gap-3 sm:grid-cols-1">
                <div>
                  <label className="label text-xs font-bold">Main Headline</label>
                  <input
                    className="field text-sm font-semibold"
                    placeholder="e.g. India’s Finest Agro Harvests. Delivered to the World."
                    value={item.title || ''}
                    onChange={(e) => updateItem(i, 'title', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label text-xs font-bold">Description Paragraph</label>
                  <textarea
                    className="field text-sm"
                    rows="2"
                    placeholder="Commercial value proposition..."
                    value={item.description || ''}
                    onChange={(e) => updateItem(i, 'description', e.target.value)}
                  />
                </div>
              </div>

              {/* Row 3: Feature Chips (Image 2) */}
              <div className="rounded-xl border border-line/60 bg-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="label text-xs font-bold flex items-center gap-1.5 text-moss">
                      <span>✨</span> Feature Chips / Value Badges (Image 2)
                    </label>
                    <p className="text-[11px] text-ink/60">
                      Highlight chips displayed under the description (e.g. &quot;✨ Nitrogen Flush Freshness&quot;, &quot;📦 Standup Barrier Pouches&quot;, &quot;🌱 100% Non-GMO Purity&quot;).
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-outline text-xs py-1 px-2.5 shrink-0"
                    onClick={() => addChip(i)}
                  >
                    + Add Chip
                  </button>
                </div>

                <div className="grid gap-2 sm:grid-cols-3 mt-3">
                  {(Array.isArray(item.chips) ? item.chips : []).map((chip, chipIdx) => (
                    <div key={chipIdx} className="flex items-center gap-1.5">
                      <input
                        className="field text-xs py-1.5"
                        placeholder="e.g. ✨ Nitrogen Flush Freshness"
                        value={chip}
                        onChange={(e) => updateChip(i, chipIdx, e.target.value)}
                      />
                      <button
                        type="button"
                        className="text-xs text-clay hover:text-red-700 px-1 font-bold"
                        title="Remove chip"
                        onClick={() => removeChip(i, chipIdx)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Preview pills */}
                {Array.isArray(item.chips) && item.chips.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-3 mt-3 border-t border-line/40">
                    <span className="text-[11px] font-mono text-ink/40 self-center">Preview:</span>
                    {item.chips.filter(Boolean).map((chip, cIdx) => (
                      <span
                        key={cIdx}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#0e241b] border border-white/20 px-2.5 py-1 text-[11px] text-paper/90 shadow-sm"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Row 4: Video Commercial & Fallback Poster Image */}
              <div className="grid gap-4 sm:grid-cols-2">
                <VideoUpload
                  label="Product Commercial Video (MP4 / WebM / Cloud URL)"
                  value={item.video || ''}
                  onChange={(url) => updateItem(i, 'video', url)}
                />
                <ImageUpload
                  label="Poster / Fallback Image"
                  value={item.image || ''}
                  onChange={(url) => updateItem(i, 'image', url)}
                />
              </div>

              {/* Row 5: Video Card Floating Metrics */}
              <div className="grid gap-3 sm:grid-cols-3 bg-white p-4 rounded-xl border border-line/60">
                <div>
                  <label className="label text-xs">Video Floating Stat</label>
                  <input
                    className="field text-sm font-mono"
                    placeholder="e.g. 28+ MT or 100%"
                    value={item.stat || ''}
                    onChange={(e) => updateItem(i, 'stat', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label text-xs">Video Stat Label</label>
                  <input
                    className="field text-sm"
                    placeholder="e.g. Max 40ft HC Capacity"
                    value={item.statLabel || ''}
                    onChange={(e) => updateItem(i, 'statLabel', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label text-xs">Display Order</label>
                  <input
                    type="number"
                    className="field text-sm text-center"
                    value={item.order ?? i + 1}
                    onChange={(e) => updateItem(i, 'order', Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Row 6: Slide-Specific Button Overrides (Optional) */}
              <div className="rounded-xl border border-line/40 bg-white p-3.5">
                <span className="text-xs font-bold text-ink/70 block mb-2">
                  Optional Slide Button Overrides (Leave blank to use Global Defaults)
                </span>
                <div className="grid gap-3 sm:grid-cols-4">
                  <div>
                    <label className="label text-[11px]">Primary Button Text</label>
                    <input
                      className="field text-xs py-1.5"
                      placeholder="Use Global Default"
                      value={item.primaryButtonText || ''}
                      onChange={(e) => updateItem(i, 'primaryButtonText', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label text-[11px]">Primary Button Link</label>
                    <input
                      className="field text-xs py-1.5"
                      placeholder="/products"
                      value={item.primaryButtonLink || ''}
                      onChange={(e) => updateItem(i, 'primaryButtonLink', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label text-[11px]">Secondary Button Text</label>
                    <input
                      className="field text-xs py-1.5"
                      placeholder="Use Global Default"
                      value={item.secondaryButtonText || ''}
                      onChange={(e) => updateItem(i, 'secondaryButtonText', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label text-[11px]">Secondary Button Link</label>
                    <input
                      className="field text-xs py-1.5"
                      placeholder="/inquiry"
                      value={item.secondaryButtonLink || ''}
                      onChange={(e) => updateItem(i, 'secondaryButtonLink', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Smart comma-separated input handler.
 * - Allows typing commas freely without React instantly stripping them or jumping cursor.
 * - Intelligently respects parentheses like "(Dubai, UAE)" so internal commas aren't accidentally split.
 * - Shows an instant chip preview so the user knows exactly how items are parsed.
 */
function parseCommaList(str, isLowerCase = false) {
  if (!str) return [];
  const items = [];
  let current = '';
  let inParen = 0;
  let inQuote = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '"' || char === "'") {
      inQuote = !inQuote;
      current += char;
    } else if (char === '(' && !inQuote) {
      inParen++;
      current += char;
    } else if (char === ')' && !inQuote) {
      if (inParen > 0) inParen--;
      current += char;
    } else if (char === ',' && inParen === 0 && !inQuote) {
      const trimmed = isLowerCase ? current.trim().toLowerCase() : current.trim();
      if (trimmed) items.push(trimmed);
      current = '';
    } else {
      current += char;
    }
  }
  const lastTrimmed = isLowerCase ? current.trim().toLowerCase() : current.trim();
  if (lastTrimmed) items.push(lastTrimmed);
  return items;
}

function CommaSeparatedInput({
  value,
  onChange,
  placeholder,
  className = 'field',
  isLowerCase = false,
  showChipsPreview = true,
}) {
  const formatArray = (val) => {
    if (Array.isArray(val)) return val.join(', ');
    return typeof val === 'string' ? val : '';
  };

  const [text, setText] = useState(() => formatArray(value));
  const isFocused = useRef(false);

  useEffect(() => {
    if (!isFocused.current) {
      setText(formatArray(value));
    }
  }, [value]);

  const handleChange = (e) => {
    const raw = e.target.value;
    setText(raw);
    const parsed = parseCommaList(raw, isLowerCase);
    onChange(parsed);
  };

  const handleBlur = () => {
    isFocused.current = false;
    const parsed = parseCommaList(text, isLowerCase);
    const formatted = parsed.join(', ');
    setText(formatted);
    onChange(parsed);
  };

  const previewChips = parseCommaList(text, isLowerCase);

  return (
    <div className="space-y-1.5 w-full">
      <input
        type="text"
        className={className}
        value={text}
        onFocus={() => {
          isFocused.current = true;
        }}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
      {showChipsPreview && previewChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[10px] font-mono text-ink/45 font-bold uppercase tracking-wider">
            Items ({previewChips.length}):
          </span>
          {previewChips.map((chip, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 rounded-md bg-[#f6f4ee] border border-line px-2 py-0.5 text-[11px] font-mono text-ink/80 shadow-2xs"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              <span>{chip}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function MapEditor({ section, setSection }) {
  const current = section || defaults.globalMap;
  const updateRegion = (i, key, value) => {
    const regions = [...(current.regions || [])];
    regions[i] = { ...regions[i], [key]: value };
    setSection({ ...current, regions });
  };

  const addRegion = () => {
    const count = (current.regions?.length || 0) + 1;
    setSection({
      ...current,
      regions: [
        ...(current.regions || []),
        {
          name: `New Destination ${count}`,
          fullName: `New Destination ${count}`,
          code: `NEW${count}`,
          badge: 'SCHEDULED EXPORT CORRIDOR',
          description: 'Active trade bridge serving certified export consignments and scheduled container sailings.',
          x: 500,
          y: 250,
          transitTime: '20 – 25 Days',
          ports: ['Primary Port 1', 'Primary Port 2'],
          deliveryRate: '99.5%',
          volumeGrowth: '+30%',
          containersServed: '250+ TEU',
          serviceType: 'FCL & LCL Containerized Service',
          originsText: 'Origins: Mundra / JNPT Ports',
          order: count,
          isActive: true,
        },
      ],
    });
  };

  const removeRegion = (i) => {
    setSection({
      ...current,
      regions: (current.regions || []).filter((_, index) => index !== i),
    });
  };

  const updatePillar = (i, key, value) => {
    const pillars = [...(current.pillars || defaults.globalMap.pillars)];
    pillars[i] = { ...pillars[i], [key]: value };
    setSection({ ...current, pillars });
  };

  const addPillar = () => {
    const currentPillars = current.pillars || defaults.globalMap.pillars;
    setSection({
      ...current,
      pillars: [
        ...currentPillars,
        {
          number: String(currentPillars.length + 1).padStart(2, '0'),
          title: 'New Capability',
          text: 'Description of the global export capability or trade service.',
          order: currentPillars.length + 1,
          isActive: true,
        },
      ],
    });
  };

  const removePillar = (i) => {
    const currentPillars = current.pillars || defaults.globalMap.pillars;
    setSection({
      ...current,
      pillars: currentPillars.filter((_, index) => index !== i),
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Eyebrow</label>
          <input
            className="field"
            value={current.eyebrow || ''}
            onChange={(e) => setSection({ ...current, eyebrow: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Title</label>
          <input
            className="field"
            value={current.title || ''}
            onChange={(e) => setSection({ ...current, title: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="label">Description</label>
        <textarea
          className="field"
          rows="2"
          value={current.description || ''}
          onChange={(e) => setSection({ ...current, description: e.target.value })}
        />
      </div>

      <div className="flex items-center justify-between border-t border-line pt-4">
        <div>
          <h3 className="font-display font-bold text-ink">Served Regions & Trade Corridors</h3>
          <p className="text-xs text-ink/60">Manage countries, coordinates, transit days, and entry ports shown on the map.</p>
        </div>
        <button type="button" className="btn-primary text-xs" onClick={addRegion}>
          + Add Region
        </button>
      </div>

      <div className="space-y-4">
        {(current.regions || []).map((region, i) => (
          <div key={region._id || i} className="rounded-xl border border-line bg-paper p-5">
            <div className="flex items-center justify-between border-b border-line/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded bg-forest/10 px-2 py-0.5 font-mono text-xs font-bold text-forest">
                  {region.code || `REG-${i + 1}`}
                </span>
                <span className="font-display font-bold text-ink">{region.name || 'Untitled Region'}</span>
              </div>
              <button
                type="button"
                className="text-sm text-clay hover:underline"
                onClick={() => removeRegion(i)}
              >
                Delete Region
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label className="label">Region Display Name</label>
                <input
                  className="field"
                  placeholder="e.g. United States"
                  value={region.name || ''}
                  onChange={(e) => updateRegion(i, 'name', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Full Title / Heading (Image 1)</label>
                <input
                  className="field"
                  placeholder="e.g. United States"
                  value={region.fullName || ''}
                  onChange={(e) => updateRegion(i, 'fullName', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Short Code / Badge</label>
                <input
                  className="field"
                  placeholder="e.g. US or USA"
                  value={region.code || ''}
                  onChange={(e) => updateRegion(i, 'code', e.target.value)}
                />
              </div>

              <div>
                <label className="label">Corridor Status Badge (Image 1)</label>
                <input
                  className="field"
                  placeholder="SCHEDULED EXPORT CORRIDOR"
                  value={region.badge || ''}
                  onChange={(e) => updateRegion(i, 'badge', e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Corridor Description (Image 1)</label>
                <input
                  className="field"
                  placeholder="Active trade bridge serving United States with certified export consignments..."
                  value={region.description || ''}
                  onChange={(e) => updateRegion(i, 'description', e.target.value)}
                />
              </div>

              <div>
                <label className="label">On-time Transit Rate (Image 1)</label>
                <input
                  className="field"
                  placeholder="99.4%"
                  value={region.deliveryRate || ''}
                  onChange={(e) => updateRegion(i, 'deliveryRate', e.target.value)}
                />
              </div>
              <div>
                <label className="label">YoY Growth Rate (Image 1)</label>
                <input
                  className="field"
                  placeholder="+34%"
                  value={region.volumeGrowth || ''}
                  onChange={(e) => updateRegion(i, 'volumeGrowth', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Volume Capacity (Image 1)</label>
                <input
                  className="field"
                  placeholder="250+ TEU"
                  value={region.containersServed || ''}
                  onChange={(e) => updateRegion(i, 'containersServed', e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="label">Primary Entry Ports (separated by comma) (Image 1)</label>
                <CommaSeparatedInput
                  className="field"
                  value={region.ports}
                  placeholder="e.g. New York / New Jersey, Long Beach (Los Angeles), Houston / Savannah"
                  onChange={(arr) => updateRegion(i, 'ports', arr)}
                />
              </div>
              <div>
                <label className="label">Transit Duration (Image 1)</label>
                <input
                  className="field"
                  value={region.transitTime || ''}
                  placeholder="e.g. 28 – 40 Days"
                  onChange={(e) => updateRegion(i, 'transitTime', e.target.value)}
                />
              </div>

              <div>
                <label className="label">Service Subtext (Image 1)</label>
                <input
                  className="field"
                  placeholder="FCL & LCL Containerized Service"
                  value={region.serviceType || ''}
                  onChange={(e) => updateRegion(i, 'serviceType', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Origins Subtext (Image 1)</label>
                <input
                  className="field"
                  placeholder="Origins: Mundra / JNPT Ports"
                  value={region.originsText || ''}
                  onChange={(e) => updateRegion(i, 'originsText', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="label">Pin X (0-1000)</label>
                  <input
                    type="number"
                    className="field"
                    value={region.x ?? 500}
                    onChange={(e) => updateRegion(i, 'x', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="label">Pin Y (0-500)</label>
                  <input
                    type="number"
                    className="field"
                    value={region.y ?? 250}
                    onChange={(e) => updateRegion(i, 'y', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={region.isActive !== false}
                  onChange={(e) => updateRegion(i, 'isActive', e.target.checked)}
                />{' '}
                Active corridor
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink/50">Order:</span>
                <input
                  type="number"
                  className="field w-20 py-1 text-xs"
                  value={region.order ?? i + 1}
                  onChange={(e) => updateRegion(i, 'order', Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Global Capabilities 4-Pillar Bar Editor */}
      <div className="flex items-center justify-between border-t border-line pt-8">
        <div>
          <h3 className="font-display font-bold text-ink">Global Capabilities Cards (Beneath Map)</h3>
          <p className="text-xs text-ink/60">Edit the capability pillars displayed directly under the world trade map.</p>
        </div>
        <button type="button" className="btn-primary text-xs" onClick={addPillar}>
          + Add Capability Card
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {(current.pillars || defaults.globalMap.pillars).map((pillar, i) => (
          <div key={pillar._id || i} className="rounded-xl border border-line bg-paper p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-line/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-gold/15 px-2 py-0.5 font-mono text-xs font-bold text-gold">
                    {pillar.number || String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display font-bold text-ink">{pillar.title || 'Untitled Capability'}</span>
                </div>
                <button
                  type="button"
                  className="text-sm text-clay hover:underline"
                  onClick={() => removePillar(i)}
                >
                  Delete
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-[80px_1fr] gap-3">
                  <div>
                    <label className="label">Index #</label>
                    <input
                      className="field font-mono"
                      value={pillar.number || ''}
                      placeholder="01"
                      onChange={(e) => updatePillar(i, 'number', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Card Title</label>
                    <input
                      className="field"
                      value={pillar.title || ''}
                      placeholder="e.g. 6 Global Corridors"
                      onChange={(e) => updatePillar(i, 'title', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Description Text</label>
                  <textarea
                    className="field"
                    rows="3"
                    value={pillar.text || ''}
                    placeholder="Established logistics networks reaching USA, Europe..."
                    onChange={(e) => updatePillar(i, 'text', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-line/50 pt-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={pillar.isActive !== false}
                  onChange={(e) => updatePillar(i, 'isActive', e.target.checked)}
                />{' '}
                Visible on site
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink/50">Order:</span>
                <input
                  type="number"
                  className="field w-16 py-1 text-xs"
                  value={pillar.order ?? i + 1}
                  onChange={(e) => updatePillar(i, 'order', Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CertificatesEditor({ section, setSection }) {
  const current = section || defaults.certificates;
  const updateCert = (i, key, value) => {
    const items = [...(current.items || [])];
    items[i] = { ...items[i], [key]: value };
    setSection({ ...current, items });
  };

  const addCert = () => {
    setSection({
      ...current,
      items: [
        ...(current.items || []),
        {
          name: 'New Certification',
          issuer: 'Authorized Regulatory Body',
          code: 'fssai',
          image: '',
          description: 'Official verified compliance license and benchmark.',
          highlights: ['Mandatory compliance', 'Quality assured'],
          order: (current.items?.length || 0) + 1,
          isActive: true,
        },
      ],
    });
  };

  const removeCert = (i) => {
    setSection({
      ...current,
      items: (current.items || []).filter((_, index) => index !== i),
    });
  };

  const presets = [
    { code: 'fssai', label: 'FSSAI (Food Safety and Standards Authority)' },
    { code: 'apeda', label: 'APEDA (Agricultural & Processed Food)' },
    { code: 'gmp', label: 'GMP (Good Manufacturing Practice)' },
    { code: 'ghp', label: 'GHP (Good Hygiene Practices)' },
    { code: 'haccp', label: 'HACCP (Hazard Analysis Critical Control Point)' },
    { code: 'iso22000', label: 'ISO 22000 (Food Safety Management)' },
    { code: 'asta', label: 'ASTA (American Spice Trade Association)' },
    { code: 'custom', label: 'Custom Uploaded Logo' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Eyebrow</label>
          <input
            className="field"
            value={current.eyebrow || ''}
            onChange={(e) => setSection({ ...current, eyebrow: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Title</label>
          <input
            className="field"
            value={current.title || ''}
            onChange={(e) => setSection({ ...current, title: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="label">Description</label>
        <textarea
          className="field"
          rows="2"
          value={current.description || ''}
          onChange={(e) => setSection({ ...current, description: e.target.value })}
        />
      </div>

      <div className="flex items-center justify-between border-t border-line pt-4">
        <div>
          <h3 className="font-display font-bold text-ink">Certificates & Compliance Badges</h3>
          <p className="text-xs text-ink/60">Display official certification logos and accreditation standards.</p>
        </div>
        <button type="button" className="btn-primary text-xs" onClick={addCert}>
          + Add Certificate
        </button>
      </div>

      <div className="space-y-5">
        {(current.items || []).map((cert, i) => (
          <div key={cert._id || i} className="rounded-xl border border-line bg-paper p-5">
            <div className="flex items-center justify-between border-b border-line/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-16 place-items-center rounded-lg border border-line bg-white p-1">
                  {cert.image ? (
                    <img src={asset(cert.image)} alt="" className="h-full w-full object-contain" />
                  ) : (
                    <img
                      src={`/certificates/${cert.code || 'fssai'}.png`}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  )}
                </div>
                <div>
                  <span className="font-display font-bold text-ink">{cert.name || 'Untitled Certification'}</span>
                  <p className="text-xs text-ink/50">{cert.issuer || 'Regulatory authority'}</p>
                </div>
              </div>
              <button
                type="button"
                className="text-sm text-clay hover:underline"
                onClick={() => removeCert(i)}
              >
                Delete Certificate
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Certificate Name</label>
                <input
                  className="field"
                  value={cert.name || ''}
                  onChange={(e) => updateCert(i, 'name', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Issuing Authority / Subtitle</label>
                <input
                  className="field"
                  value={cert.issuer || ''}
                  onChange={(e) => updateCert(i, 'issuer', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Official Logo Preset</label>
                <select
                  className="field"
                  value={cert.code || 'fssai'}
                  onChange={(e) => updateCert(i, 'code', e.target.value)}
                >
                  {presets.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <ImageUpload
                  label="Or Upload Custom Logo Image (optional)"
                  value={cert.image || ''}
                  onChange={(url) => updateCert(i, 'image', url)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Description / Scope of Accreditation</label>
                <textarea
                  className="field"
                  rows="2"
                  value={cert.description || ''}
                  onChange={(e) => updateCert(i, 'description', e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Highlights (comma separated)</label>
                <CommaSeparatedInput
                  className="field"
                  value={cert.highlights}
                  placeholder="e.g. Zero adulteration mandate, Periodic lab assays, Full farm traceability"
                  onChange={(arr) => updateCert(i, 'highlights', arr)}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-line/50 pt-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={cert.isActive !== false}
                  onChange={(e) => updateCert(i, 'isActive', e.target.checked)}
                />{' '}
                Active & displayed in slider
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink/50">Order:</span>
                <input
                  type="number"
                  className="field w-20 py-1 text-xs"
                  value={cert.order ?? i + 1}
                  onChange={(e) => updateCert(i, 'order', Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlashCardEditor({ section, setSection }) {
  const current = section || defaults.flashCard;
  const update = (key, value) => {
    setSection({ ...current, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-line/60 pb-4">
          <div>
            <h3 className="font-display text-base font-bold text-ink">Flash Card Popup Settings</h3>
            <p className="text-xs text-ink/60">
              When enabled, visitors see this advertisement / announcement card right after the brand loader finishes on their initial visit.
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer font-medium text-sm text-ink">
            <input
              type="checkbox"
              checked={current.isActive !== false}
              onChange={(e) => update('isActive', e.target.checked)}
              className="h-4 w-4 rounded border-line text-forest focus:ring-forest"
            />
            <span>Active on Website</span>
          </label>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="label">Flash Card Title</label>
              <input
                className="field"
                value={current.title || ''}
                placeholder="e.g. India’s Taste. The World’s Table"
                onChange={(e) => update('title', e.target.value)}
              />
            </div>

            <div>
              <label className="label">Subtitle / Advertisement Message</label>
              <textarea
                className="field"
                rows="3"
                value={current.subtitle || ''}
                placeholder="e.g. Direct sourcing of export-grade Indian spices, premium grains, and agro-commodities..."
                onChange={(e) => update('subtitle', e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Button Text</label>
                <input
                  className="field"
                  value={current.buttonText || ''}
                  placeholder="e.g. Explore Products"
                  onChange={(e) => update('buttonText', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Button Destination URL</label>
                <input
                  className="field"
                  value={current.buttonLink || ''}
                  placeholder="e.g. /products or /inquiry"
                  onChange={(e) => update('buttonLink', e.target.value)}
                />
              </div>
            </div>

            <ImageUpload
              label="Flash Card Photo / Poster Image"
              value={current.image || ''}
              onChange={(url) => update('image', url)}
            />
          </div>

          {/* Live Preview Box */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-paper/60 p-5">
            <p className="text-xs font-mono uppercase tracking-wider text-ink/40 mb-3">Live Visual Preview</p>
            <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-gold/40 bg-ink text-paper shadow-2xl">
              {current.image ? (
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-forest/20">
                  <img src={asset(current.image)} alt="Preview" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80" />
                </div>
              ) : (
                <div className="flex aspect-[16/9] w-full items-center justify-center bg-forest/30 text-xs text-paper/40">
                  (No photo uploaded yet)
                </div>
              )}
              <div className="p-5 text-center">
                <span className="inline-block rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 font-mono text-[10px] text-gold uppercase tracking-widest mb-2">
                  Special Announcement
                </span>
                <h4 className="font-display text-lg font-bold text-white leading-snug">
                  {current.title || 'Your Flash Card Title'}
                </h4>
                {current.subtitle && (
                  <p className="mt-2 text-xs leading-relaxed text-paper/70">
                    {current.subtitle}
                  </p>
                )}
                <div className="mt-4">
                  <span className="inline-block rounded-lg bg-forest px-4 py-2 text-xs font-semibold text-paper shadow border border-gold/30">
                    {current.buttonText || 'Explore Products'} →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EngineerTradeEditor({ section, setSection }) {
  const current = section || defaults.engineerTrade;
  const updateField = (field, val) => setSection({ ...current, [field]: val });
  const updateItem = (i, key, val) => {
    const items = [...(current.items || [])];
    items[i] = { ...items[i], [key]: val };
    setSection({ ...current, items });
  };
  const addItem = () => {
    setSection({
      ...current,
      items: [
        ...(current.items || []),
        {
          title: 'New High-Volume Capability',
          metric: '100% Quality',
          subtitle: 'Port & Consignment Detail',
          description: 'Institutional logistics and processing capability.',
          icon: '🚢',
          order: (current.items?.length || 0) + 1,
          isActive: true,
        },
      ],
    });
  };
  const removeItem = (i) => {
    setSection({
      ...current,
      items: (current.items || []).filter((_, idx) => idx !== i),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Inputs */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <h3 className="font-display font-bold text-lg text-ink mb-1">Header & Overview</h3>
        <p className="text-xs text-ink/60 mb-4">Controls the main headline, category eyebrow, and background badge.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Eyebrow / Small Category Tag</label>
            <input
              className="field"
              value={current.eyebrow || ''}
              onChange={(e) => updateField('eyebrow', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Badge Pill Label</label>
            <input
              className="field"
              value={current.badge || ''}
              onChange={(e) => updateField('badge', e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="label">Main Section Heading</label>
          <input
            className="field"
            value={current.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="label">Description / Value Proposition</label>
          <textarea
            className="field"
            rows="3"
            value={current.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
          />
        </div>
      </div>

      {/* Trade Pillars / Capabilities Editor */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-line pb-4">
          <div>
            <h3 className="font-display font-bold text-lg text-ink">Industrial Capabilities & Pillars</h3>
            <p className="text-xs text-ink/60">Features displayed in the high-impact 4-column capabilities grid.</p>
          </div>
          <button type="button" className="btn-primary text-xs shrink-0" onClick={addItem}>
            + Add Capability
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {(current.items || []).map((item, i) => (
            <div key={item._id || i} className="rounded-xl border border-line bg-[#fbf9f4] p-5 relative shadow-sm">
              <div className="flex items-center justify-between border-b border-line pb-2 mb-3">
                <span className="font-mono text-xs font-bold uppercase text-moss">Capability #{i + 1}</span>
                <button
                  type="button"
                  className="text-xs font-semibold text-clay hover:underline"
                  onClick={() => removeItem(i)}
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="label text-xs">Title</label>
                  <input
                    className="field text-sm"
                    value={item.title || ''}
                    onChange={(e) => updateItem(i, 'title', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label text-xs">Icon Emoji</label>
                  <input
                    className="field text-sm text-center"
                    value={item.icon || '🚢'}
                    onChange={(e) => updateItem(i, 'icon', e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="label text-xs">Highlight Metric / Stat</label>
                  <input
                    className="field text-sm font-mono"
                    placeholder="e.g. 99.9% Purity or 500+ TEU"
                    value={item.metric || ''}
                    onChange={(e) => updateItem(i, 'metric', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label text-xs">Subtitle</label>
                  <input
                    className="field text-sm"
                    placeholder="e.g. Mundra & JNPT Port hubs"
                    value={item.subtitle || ''}
                    onChange={(e) => updateItem(i, 'subtitle', e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="label text-xs">Detailed Description</label>
                <textarea
                  className="field text-xs"
                  rows="2"
                  value={item.description || ''}
                  onChange={(e) => updateItem(i, 'description', e.target.value)}
                />
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-line/60">
                <label className="flex items-center gap-2 text-xs font-medium text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.isActive !== false}
                    onChange={(e) => updateItem(i, 'isActive', e.target.checked)}
                  />
                  Active on website
                </label>
                <div className="flex items-center gap-1.5 text-xs text-ink/60">
                  <span>Order:</span>
                  <input
                    type="number"
                    className="field w-14 py-1 text-xs text-center"
                    value={item.order ?? i + 1}
                    onChange={(e) => updateItem(i, 'order', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Bar (Inquiry Banner) (Image 5) */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <h3 className="font-display font-bold text-lg text-ink mb-1">Bottom Call-to-Action Bar (Inquiry Banner)</h3>
        <p className="text-xs text-ink/60 mb-4">
          Configure the headline, subtitle, and quote button for the banner box at the bottom of the Engineer High-Volume Trade section.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">CTA Headline</label>
            <input
              className="field"
              placeholder="e.g. Planning full container load (FCL) or multi-product shipments?"
              value={current.ctaTitle ?? 'Planning full container load (FCL) or multi-product shipments?'}
              onChange={(e) => updateField('ctaTitle', e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">CTA Subtitle / Description</label>
            <textarea
              className="field"
              rows="2"
              placeholder="e.g. Direct liaison with Mundra and JNPT port customs brokers for swift container dispatch."
              value={current.ctaSubtitle ?? 'Direct liaison with Mundra and JNPT port customs brokers for swift container dispatch.'}
              onChange={(e) => updateField('ctaSubtitle', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Button Text</label>
            <input
              className="field"
              placeholder="e.g. Get a quote"
              value={current.ctaButtonText ?? 'Get a quote'}
              onChange={(e) => updateField('ctaButtonText', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Button Link URL</label>
            <input
              className="field"
              placeholder="e.g. /inquiry"
              value={current.ctaButtonLink ?? '/inquiry'}
              onChange={(e) => updateField('ctaButtonLink', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatbotEditor({ section, setSection }) {
  const current = section || defaults.chatbot;

  const updateField = (field, value) => {
    setSection({ ...current, [field]: value });
  };

  const updateSuggestion = (idx, val) => {
    const next = [...(current.defaultSuggestions || [])];
    next[idx] = val;
    updateField('defaultSuggestions', next);
  };

  const addSuggestion = () => {
    updateField('defaultSuggestions', [
      ...(current.defaultSuggestions || []),
      'New sample question?',
    ]);
  };

  const removeSuggestion = (idx) => {
    updateField(
      'defaultSuggestions',
      (current.defaultSuggestions || []).filter((_, i) => i !== idx)
    );
  };

  const addKnowledge = () => {
    const newItem = {
      triggers: ['new-keyword', 'sample-query'],
      reply: 'Enter informative response for this query…',
      link: '/products',
      linkText: 'Explore Products →',
      suggestions: ['Inquire Now', 'Contact Sales'],
      order: (current.knowledgeBase?.length || 0) + 1,
      isActive: true,
    };
    updateField('knowledgeBase', [...(current.knowledgeBase || []), newItem]);
  };

  const updateKnowledge = (idx, key, val) => {
    const list = [...(current.knowledgeBase || [])];
    list[idx] = { ...list[idx], [key]: val };
    updateField('knowledgeBase', list);
  };

  const removeKnowledge = (idx) => {
    if (!confirm('Are you sure you want to delete this chatbot knowledge topic?')) return;
    updateField(
      'knowledgeBase',
      (current.knowledgeBase || []).filter((_, i) => i !== idx)
    );
  };

  return (
    <div className="space-y-6">
      {/* Bot Profile & Settings Card */}
      <div className="rounded-xl border border-line bg-paper/60 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
          <div>
            <h3 className="font-display font-bold text-base text-ink">Bot Identity & Presence</h3>
            <p className="text-xs text-ink/60">Configure public bot appearance, greeting message, and availability.</p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-line bg-white px-3 py-1.5 shadow-xs">
            <input
              type="checkbox"
              checked={current.isActive !== false}
              onChange={(e) => updateField('isActive', e.target.checked)}
              className="rounded text-forest focus:ring-forest"
            />
            <span className="text-xs font-semibold text-ink">
              {current.isActive !== false ? '✅ Chatbot Enabled' : '⏸️ Chatbot Disabled'}
            </span>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Bot Display Name</label>
            <input
              className="field text-sm font-semibold"
              value={current.botName || 'TradeMitra'}
              onChange={(e) => updateField('botName', e.target.value)}
              placeholder="e.g. TradeMitra"
            />
          </div>
          <div>
            <label className="label">Bot Role Subtitle / Tagline</label>
            <input
              className="field text-sm"
              value={current.botSubtitle || 'AI Export & Sourcing Assistant'}
              onChange={(e) => updateField('botSubtitle', e.target.value)}
              placeholder="e.g. AI Export & Sourcing Assistant"
            />
          </div>
        </div>

        <div>
          <label className="label">Welcome Greeting Message</label>
          <textarea
            className="field text-xs font-mono"
            rows="3"
            value={current.welcomeMessage || ''}
            onChange={(e) => updateField('welcomeMessage', e.target.value)}
            placeholder="Initial greeting displayed when visitor opens chatbot..."
          />
          <p className="mt-1 text-[11px] text-ink/50">Markdown supported (e.g. **bold**, bullet points).</p>
        </div>

        <div>
          <label className="label">Disclaimer / Footnote</label>
          <input
            className="field text-xs"
            value={current.disclaimer || ''}
            onChange={(e) => updateField('disclaimer', e.target.value)}
            placeholder="e.g. Responses based on NMC catalogue and export shipping data."
          />
        </div>
      </div>

      {/* Default Prompt Suggestions */}
      <div className="rounded-xl border border-line bg-white p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-ink">Initial Quick Prompt Chips</h3>
            <p className="text-xs text-ink/60">Suggested questions displayed to the user right under the welcome greeting.</p>
          </div>
          <button type="button" onClick={addSuggestion} className="btn-outline text-xs py-1.5 px-3">
            + Add Suggestion
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {(current.defaultSuggestions || []).map((sug, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 rounded-full border border-line bg-[#fbf9f4] pl-3 pr-1.5 py-1 text-xs"
            >
              <input
                type="text"
                value={sug}
                onChange={(e) => updateSuggestion(idx, e.target.value)}
                className="bg-transparent text-xs text-ink font-medium focus:outline-none w-48 sm:w-60"
              />
              <button
                type="button"
                onClick={() => removeSuggestion(idx)}
                className="h-5 w-5 rounded-full text-ink/40 hover:bg-clay/10 hover:text-clay text-xs flex items-center justify-center"
                title="Remove suggestion"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Confidentiality & Security Shield Banner */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 flex items-start gap-3 text-xs text-amber-900">
        <span className="text-xl">🛡️</span>
        <div>
          <p className="font-bold">Automated Privacy & Anti-Leak Shield Active</p>
          <p className="mt-0.5 text-amber-800/90 leading-relaxed">
            The chatbot strictly ignores and refuses inquiries containing sensitive keywords (passwords, tokens, database connection strings, inquiry transcripts, or internal credentials). Only information explicitly configured below or in public catalogues will be communicated to visitors.
          </p>
        </div>
      </div>

      {/* Knowledge Base Q&A Manager */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
          <div>
            <h3 className="font-display font-bold text-lg text-ink">
              Chatbot Knowledge Base Topics ({(current.knowledgeBase || []).length})
            </h3>
            <p className="text-xs text-ink/60">
              When visitor mentions any of the triggers, the chatbot answers with the specified response and quick action link.
            </p>
          </div>
          <button type="button" className="btn-primary text-xs shrink-0" onClick={addKnowledge}>
            + Add Q&A Topic
          </button>
        </div>

        <div className="grid gap-4">
          {(current.knowledgeBase || []).map((item, idx) => (
            <div
              key={item._id || idx}
              className="rounded-xl border border-line bg-[#fbf9f4] p-5 relative shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase text-moss">
                    Topic #{idx + 1}
                  </span>
                  <span className="rounded bg-paper px-2 py-0.5 font-mono text-[10px] text-ink/60 border border-line">
                    {(item.triggers || []).length} keywords
                  </span>
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold text-clay hover:underline"
                  onClick={() => removeKnowledge(idx)}
                >
                  Remove Topic
                </button>
              </div>

              {/* Triggers Input */}
              <div>
                <label className="label text-xs">
                  Keyword Triggers (comma-separated, words matching user question)
                </label>
                <CommaSeparatedInput
                  className="field text-xs font-mono"
                  value={item.triggers}
                  onChange={(arr) => updateKnowledge(idx, 'triggers', arr)}
                  placeholder="e.g. spice, spices, cumin, turmeric, chilli, coriander"
                  isLowerCase
                />
              </div>

              {/* Response Text */}
              <div>
                <label className="label text-xs">Bot Reply / Answer</label>
                <textarea
                  className="field text-xs leading-relaxed"
                  rows="4"
                  value={item.reply || ''}
                  onChange={(e) => updateKnowledge(idx, 'reply', e.target.value)}
                  placeholder="Comprehensive, accurate export information provided by the bot…"
                />
              </div>

              {/* Optional Link & Link Text */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="label text-xs">Action Link (Optional URL)</label>
                  <input
                    className="field text-xs font-mono"
                    value={item.link || ''}
                    onChange={(e) => updateKnowledge(idx, 'link', e.target.value)}
                    placeholder="e.g. /products, /inquiry, /brochures"
                  />
                </div>
                <div>
                  <label className="label text-xs">Link Button Text</label>
                  <input
                    className="field text-xs"
                    value={item.linkText || ''}
                    onChange={(e) => updateKnowledge(idx, 'linkText', e.target.value)}
                    placeholder="e.g. Browse Spices Catalogue →"
                  />
                </div>
              </div>

              {/* Follow-up suggestions */}
              <div>
                <label className="label text-xs">
                  Follow-up Suggestion Chips (comma-separated chips shown after this response)
                </label>
                <CommaSeparatedInput
                  className="field text-xs"
                  value={item.suggestions}
                  onChange={(arr) => updateKnowledge(idx, 'suggestions', arr)}
                  placeholder="e.g. What is MOQ?, Request sample kit, Lab compliance"
                />
              </div>

              {/* Status and Order */}
              <div className="flex items-center justify-between pt-3 border-t border-line/60">
                <label className="flex items-center gap-2 text-xs font-medium text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.isActive !== false}
                    onChange={(e) => updateKnowledge(idx, 'isActive', e.target.checked)}
                  />
                  Active Topic
                </label>
                <div className="flex items-center gap-1.5 text-xs text-ink/60">
                  <span>Order:</span>
                  <input
                    type="number"
                    className="field w-14 py-1 text-xs text-center"
                    value={item.order ?? idx + 1}
                    onChange={(e) => updateKnowledge(idx, 'order', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewArrivalsEditor({ section, setSection }) {
  const current = section || defaults.newArrivals;

  // Broadcast modal state for arrivals
  const [broadcastTarget, setBroadcastTarget] = useState(null); // null | 'all' | item object
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastHeading, setBroadcastHeading] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastLink, setBroadcastLink] = useState('/products');
  const [testEmailTarget, setTestEmailTarget] = useState('');
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState(null);
  const [testResult, setTestResult] = useState(null);

  const updateField = (field, value) => {
    setSection({ ...current, [field]: value });
  };

  const updateItem = (i, field, value) => {
    const items = [...(current.items || [])];
    items[i] = { ...items[i], [field]: value };
    setSection({ ...current, items });
  };

  const addItem = () => {
    setSection({
      ...current,
      items: [
        ...(current.items || []),
        {
          name: 'New Export Arrival Item',
          slug: 'new-export-arrival-item',
          categoryName: 'Spices & Seasonings',
          origin: 'Gujarat, India',
          image: '',
          shortDescription: 'Sortex cleaned export grade commodity with certified laboratory test reports.',
          hsCode: '',
          packageType: '25kg Bags',
          moq: '1 x 20ft FCL',
          order: (current.items?.length || 0) + 1,
          isActive: true,
        },
      ],
    });
  };

  const removeItem = (i) => {
    setSection({
      ...current,
      items: (current.items || []).filter((_, idx) => idx !== i),
    });
  };

  const openBroadcastAll = () => {
    const itemsList = (current.items || []).map((it) => `• ${it.name} (${it.categoryName || 'Agro Commodity'}) — Origin: ${it.origin || 'Gujarat'}`).join('\n');
    setBroadcastTarget('all');
    setBroadcastSubject(`🌟 Fresh Seasonal Crop Arrivals 2026: New Indian Export Commodities`);
    setBroadcastHeading('Fresh Seasonal Harvest Lots Now Ready for Ocean Container Loading');
    setBroadcastMessage(
      `We are pleased to introduce our latest agricultural export arrivals sourced directly from verified farm mandis across Gujarat and North India:\n\n${itemsList}\n\n100% Sortex laser graded with complete laboratory assay, phytosanitary clearance, and prompt container stuffing at Mundra Port (INMUN1) and Nhava Sheva (JNPT).`
    );
    setBroadcastLink('/products');
    setBroadcastResult(null);
    setTestResult(null);
  };

  const openBroadcastItem = (item) => {
    setBroadcastTarget(item);
    setBroadcastSubject(`🌟 Fresh Arrival Alert: ${item.name} (${item.categoryName || 'Export Commodity'})`);
    setBroadcastHeading(`${item.name} — Fresh Export Harvest Ready for Booking`);
    setBroadcastMessage(
      `We are pleased to announce direct container allocation for "${item.name}".\n\n${item.shortDescription || 'Sortex cleaned export grade commodity with certified laboratory test reports.'}\n\n• Origin Hub: ${item.origin || 'Gujarat, India'}\n• Export Packaging: ${item.packageType || '25kg Paper / PP Bags'}\n• Minimum Order (MOQ): ${item.moq || '1 x 20ft FCL'}\n• Quality Guarantee: 100% Optical Sortex Graded & Laboratory Assay Verified\n\nDirect ocean freight booking and stuffing available for Mundra Port and JNPT Nhava Sheva.`
    );
    setBroadcastLink('/products');
    setBroadcastResult(null);
    setTestResult(null);
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastSubject.trim()) return;

    try {
      setSendingBroadcast(true);
      setBroadcastResult(null);

      const isSingleItem = broadcastTarget && typeof broadcastTarget === 'object';
      const payload = {
        subject: broadcastSubject.trim(),
        message: broadcastMessage,
        product: isSingleItem ? broadcastTarget : undefined,
        products: !isSingleItem ? (current.items || []) : undefined,
      };

      const res = await api.post('/subscribers/broadcast-arrival', payload);
      setBroadcastResult(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to dispatch broadcast: ' + err.message);
    } finally {
      setSendingBroadcast(false);
    }
  };

  const handleSendTestEmail = async (e) => {
    e.preventDefault();
    if (!testEmailTarget.trim()) return;

    try {
      setSendingTest(true);
      setTestResult(null);

      const isSingleItem = broadcastTarget && typeof broadcastTarget === 'object';
      const payload = {
        subject: broadcastSubject.trim(),
        message: broadcastMessage,
        product: isSingleItem ? broadcastTarget : undefined,
        products: !isSingleItem ? (current.items || []) : undefined,
        testEmail: testEmailTarget.trim(),
      };

      const res = await api.post('/subscribers/broadcast-arrival', payload);
      setTestResult(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send test email.');
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Section Metadata */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
          <div>
            <h3 className="font-display font-bold text-lg text-ink">Section Headline & Rotation</h3>
            <p className="text-xs text-ink/60">Controls the title, small category tag, badge, and carousel timer on the homepage.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openBroadcastAll}
              className="inline-flex items-center gap-1.5 rounded-xl border border-forest/30 bg-forest/5 px-3 py-1.5 text-xs font-bold text-forest transition hover:bg-forest hover:text-white shadow-xs"
              title="Send an email announcement to all newsletter subscribers about all arrivals"
            >
              <span>📢</span> Broadcast All Arrivals to Subscribers
            </button>
            <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer bg-forest/5 px-3 py-1.5 rounded-full border border-forest/20">
              <input
                type="checkbox"
                checked={current.isActive !== false}
                onChange={(e) => updateField('isActive', e.target.checked)}
              />
              <span>Active on Homepage</span>
            </label>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label text-xs">Eyebrow (Small Tagline)</label>
            <input
              className="field"
              value={current.eyebrow || ''}
              onChange={(e) => updateField('eyebrow', e.target.value)}
              placeholder="e.g. Fresh Season Harvest"
            />
          </div>
          <div>
            <label className="label text-xs">Badge Pill Text</label>
            <input
              className="field"
              value={current.badge || ''}
              onChange={(e) => updateField('badge', e.target.value)}
              placeholder="e.g. Live Market Arrivals"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mt-4">
          <div className="sm:col-span-2">
            <label className="label text-xs">Main Section Heading</label>
            <input
              className="field"
              value={current.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g. New product arrivals"
            />
          </div>
          <div>
            <label className="label text-xs">Auto-Rotation Timer (Seconds)</label>
            <input
              type="number"
              step="0.5"
              min="2"
              max="15"
              className="field"
              value={current.autoRotateSeconds || 4}
              onChange={(e) => updateField('autoRotateSeconds', Number(e.target.value))}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="label text-xs">Subtitle Description</label>
          <textarea
            className="field text-xs"
            rows="2"
            value={current.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Directly sourced from verified Indian farm clusters..."
          />
        </div>
      </div>

      {/* Arrival Products List */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-line pb-4">
          <div>
            <h3 className="font-display font-bold text-lg text-ink">
              Featured Arrival Items ({(current.items || []).length})
            </h3>
            <p className="text-xs text-ink/60">Configure products, images, packaging, and origins featured in the rotating carousel.</p>
          </div>
          <button type="button" className="btn-primary text-xs shrink-0" onClick={addItem}>
            + Add Arrival Product
          </button>
        </div>

        <div className="space-y-4">
          {(current.items || []).map((item, i) => (
            <div key={item._id || i} className="rounded-xl border border-line bg-[#fbf9f4] p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-line pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase text-moss">Arrival Item #{i + 1}</span>
                  <span className="font-display font-bold text-sm text-ink">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openBroadcastItem(item)}
                    className="inline-flex items-center gap-1 rounded-lg border border-forest/30 bg-forest/10 px-2.5 py-1 text-xs font-bold text-forest transition hover:bg-forest hover:text-white"
                    title="Send email broadcast to subscribers about this specific product"
                  >
                    <span>✉️</span> Mail Subscribers
                  </button>
                  <button
                    type="button"
                    className="text-xs font-semibold text-clay hover:underline ml-1"
                    onClick={() => removeItem(i)}
                  >
                    Delete Item
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="label text-xs">Product Name</label>
                  <input
                    className="field text-sm font-semibold"
                    value={item.name || ''}
                    onChange={(e) => updateItem(i, 'name', e.target.value)}
                    placeholder="e.g. Sortex-Cleaned Cumin Seeds"
                  />
                </div>
                <div>
                  <label className="label text-xs">Category Name</label>
                  <input
                    className="field text-sm"
                    value={item.categoryName || ''}
                    onChange={(e) => updateItem(i, 'categoryName', e.target.value)}
                    placeholder="e.g. Spices & Seasonings"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 mt-3">
                <div>
                  <label className="label text-xs">Origin Location</label>
                  <input
                    className="field text-xs"
                    value={item.origin || ''}
                    onChange={(e) => updateItem(i, 'origin', e.target.value)}
                    placeholder="e.g. Unjha, Gujarat"
                  />
                </div>
                <div>
                  <label className="label text-xs">Package Spec</label>
                  <input
                    className="field text-xs"
                    value={item.packageType || ''}
                    onChange={(e) => updateItem(i, 'packageType', e.target.value)}
                    placeholder="e.g. 25kg Multi-wall Paper"
                  />
                </div>
                <div>
                  <label className="label text-xs">Minimum Order (MOQ)</label>
                  <input
                    className="field text-xs"
                    value={item.moq || ''}
                    onChange={(e) => updateItem(i, 'moq', e.target.value)}
                    placeholder="e.g. 1 x 20ft FCL"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 mt-3">
                <div className="sm:col-span-2">
                  <ImageUpload
                    label="Arrival Product Image"
                    value={item.image || ''}
                    onChange={(url) => updateItem(i, 'image', url)}
                  />
                </div>
                <div>
                  <label className="label text-xs">HS Code</label>
                  <input
                    className="field text-xs font-mono"
                    value={item.hsCode || ''}
                    onChange={(e) => updateItem(i, 'hsCode', e.target.value)}
                    placeholder="e.g. 090931"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="label text-xs">Specifications / Short Description</label>
                <textarea
                  className="field text-xs"
                  rows="2"
                  value={item.shortDescription || ''}
                  onChange={(e) => updateItem(i, 'shortDescription', e.target.value)}
                  placeholder="99.5% European purity, Sortex machine graded..."
                />
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-line/60">
                <label className="flex items-center gap-2 text-xs font-medium text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.isActive !== false}
                    onChange={(e) => updateItem(i, 'isActive', e.target.checked)}
                  />
                  Active in Slider
                </label>
                <div className="flex items-center gap-1.5 text-xs text-ink/60">
                  <span>Order:</span>
                  <input
                    type="number"
                    className="field w-14 py-1 text-xs text-center"
                    value={item.order ?? i + 1}
                    onChange={(e) => updateItem(i, 'order', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast Modal for New Product Arrivals */}
      {broadcastTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl my-6 space-y-4">
            {/* Product Photo & Specifications Preview Card */}
            {typeof broadcastTarget === 'object' ? (
              <div className="rounded-2xl border border-line bg-[#fbf9f4] p-4 space-y-3">
                <div className="flex items-start gap-4">
                  <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-white border border-line shadow-xs">
                    {broadcastTarget.image ? (
                      <img
                        src={asset(broadcastTarget.image)}
                        alt=""
                        className="h-full w-full object-contain p-1"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-[10px] text-ink/40">No photo</div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold-dark bg-gold/15 px-2 py-0.5 rounded">
                      {broadcastTarget.categoryName || 'FOOD COMMODITY'}
                    </span>
                    <h4 className="mt-1 font-display text-base font-bold text-ink">
                      {broadcastTarget.name}
                    </h4>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-ink/70">
                      <span><strong>Origin:</strong> {broadcastTarget.origin || 'India'}</span>
                      {broadcastTarget.packageType && <span><strong>Pack:</strong> {broadcastTarget.packageType}</span>}
                      {broadcastTarget.moq && <span><strong>MOQ:</strong> {broadcastTarget.moq}</span>}
                      {broadcastTarget.hsCode && <span><strong>HS:</strong> {broadcastTarget.hsCode}</span>}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5 text-xs text-emerald-900 flex items-center gap-2">
                  <span className="text-base">✨</span>
                  <span>
                    <strong>Complete Product Delivery:</strong> Subscribers will receive this exact product with its photo, specifications, and full description.
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-line bg-[#fbf9f4] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase text-moss">
                    All Seasonal Consignments ({(current.items || []).length} Products)
                  </span>
                  <span className="text-[11px] text-ink/50">Each item includes photo & specifications</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {(current.items || []).slice(0, 4).map((it, idx) => (
                    <div key={idx} className="rounded-lg border border-line/60 bg-white p-2 text-center text-[11px]">
                      <div className="h-10 w-full mb-1 flex items-center justify-center">
                        {it.image ? (
                          <img src={asset(it.image)} alt="" className="h-full object-contain" />
                        ) : (
                          <span className="text-[9px] text-ink/40">No photo</span>
                        )}
                      </div>
                      <p className="font-bold text-ink truncate">{it.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="label text-xs">Email Subject Line *</label>
                <input
                  required
                  className="field text-sm"
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="label text-xs">Main Email Headline</label>
                <input
                  className="field text-xs"
                  value={broadcastHeading}
                  onChange={(e) => setBroadcastHeading(e.target.value)}
                  placeholder="Defaults to Subject Line if blank"
                />
              </div>

              <div>
                <label className="label text-xs">Announcement Message / Description</label>
                <textarea
                  className="field text-xs"
                  rows="4"
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                />
              </div>

              <div>
                <label className="label text-xs">Website Action Link</label>
                <input
                  className="field text-xs font-mono"
                  value={broadcastLink}
                  onChange={(e) => setBroadcastLink(e.target.value)}
                  placeholder="/products or /inquiry"
                />
              </div>

              {/* Test Email */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs space-y-2">
                <span className="font-bold text-amber-900 block">
                  🧪 Send Test Email First (Verify Delivery):
                </span>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email to test (e.g. yourname@gmail.com)…"
                    value={testEmailTarget}
                    onChange={(e) => setTestEmailTarget(e.target.value)}
                    className="flex-1 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs text-ink outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSendTestEmail}
                    disabled={sendingTest || !testEmailTarget}
                    className="rounded-lg bg-amber-700 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-amber-800 disabled:opacity-50 whitespace-nowrap shadow-sm transition"
                  >
                    {sendingTest ? 'Sending…' : 'Send Test Mail'}
                  </button>
                </div>

                {testResult && (
                  <div className="rounded-lg bg-white p-2 border border-amber-200 text-xs space-y-1">
                    <p className="font-semibold text-emerald-800">✓ {testResult.message}</p>
                    {testResult.previewUrl && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-ink/60">Test preview link ready:</span>
                        <a
                          href={testResult.previewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded bg-amber-700 px-2 py-0.5 text-[11px] font-bold text-white hover:bg-amber-800 transition"
                        >
                          Open Preview ↗
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {broadcastResult && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 space-y-1">
                  <p className="font-bold">✓ {broadcastResult.message}</p>
                  {broadcastResult.previewUrl && (
                    <a
                      href={broadcastResult.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-1 text-emerald-700 underline font-bold"
                    >
                      View Dispatched Email in Test Mailbox ↗
                    </a>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-line/60">
                <button
                  type="button"
                  className="btn-outline text-xs"
                  onClick={() => setBroadcastTarget(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingBroadcast || !broadcastSubject.trim()}
                  className="rounded-xl bg-forest px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-forest/90 disabled:opacity-50"
                >
                  {sendingBroadcast ? 'Dispatching Broadcast…' : '🚀 Send to All Subscribers'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductsPageEditor({ section, setSection, onSave, isSaving }) {
  // Deep merge to ensure every sub-document has all default properties
  const current = {
    ...defaults.productsPage,
    ...(section || {}),
    hero: { ...defaults.productsPage.hero, ...(section?.hero || {}) },
    showcase: { ...defaults.productsPage.showcase, ...(section?.showcase || {}) },
    bento: {
      ...defaults.productsPage.bento,
      ...(section?.bento || {}),
      bullets:
        section?.bento?.bullets && section.bento.bullets.length > 0
          ? section.bento.bullets
          : defaults.productsPage.bento.bullets,
    },
    trustBar: {
      ...defaults.productsPage.trustBar,
      ...(section?.trustBar || {}),
      items:
        section?.trustBar?.items && section.trustBar.items.length > 0
          ? section.trustBar.items
          : defaults.productsPage.trustBar.items,
    },
    ctaBanner: { ...defaults.productsPage.ctaBanner, ...(section?.ctaBanner || {}) },
  };

  const updateHero = (field, value) => {
    setSection({
      ...current,
      hero: { ...current.hero, [field]: value },
    });
  };

  const updateShowcase = (field, value) => {
    setSection({
      ...current,
      showcase: { ...current.showcase, [field]: value },
    });
  };

  const updateBento = (field, value) => {
    setSection({
      ...current,
      bento: { ...current.bento, [field]: value },
    });
  };

  const updateBentoBullet = (index, value) => {
    const nextBullets = [...(current.bento?.bullets || [])];
    nextBullets[index] = value;
    updateBento('bullets', nextBullets);
  };

  const addBentoBullet = () => {
    updateBento('bullets', [...(current.bento?.bullets || []), 'New export feature highlight']);
  };

  const removeBentoBullet = (index) => {
    updateBento('bullets', (current.bento?.bullets || []).filter((_, i) => i !== index));
  };

  const updateTrustPillar = (index, field, value) => {
    const nextItems = [...(current.trustBar?.items || [])];
    nextItems[index] = { ...nextItems[index], [field]: value };
    setSection({
      ...current,
      trustBar: { ...current.trustBar, items: nextItems },
    });
  };

  const updateCta = (field, value) => {
    setSection({
      ...current,
      ctaBanner: { ...current.ctaBanner, [field]: value },
    });
  };

  const handleResetDefaults = () => {
    if (confirm('Reset Products Page CMS back to factory recommended defaults?')) {
      setSection(JSON.parse(JSON.stringify(defaults.productsPage)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Live Website Linking Header */}
      <div className="rounded-2xl border border-line dark:border-line bg-gradient-to-r from-white via-[#fbf9f4] to-[#f7f3e8] dark:from-[#132019] dark:via-[#182820] dark:to-[#132019] p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line/70 dark:border-line pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-forest dark:text-gold bg-forest/10 dark:bg-gold/15 px-2.5 py-0.5 rounded border border-forest/20 dark:border-gold/30">
                🛍️ LIVE PRODUCTS PAGE CMS
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold bg-gold/15 px-2 py-0.5 rounded">
                WEBSITE CONNECTED
              </span>
            </div>
            <h2 className="mt-1 font-display text-xl font-bold text-ink dark:text-paper">
              Products Catalogue & 3D Exhibition CMS
            </h2>
            <p className="mt-0.5 text-xs text-ink/65 dark:text-paper/65">
              Live updates directly control the headlines, 3D Spin Wheel, Bento feature cards, trust assurance pillars, and quotation banners on the website.
            </p>
          </div>

          {/* Quick Direct Save Action */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="rounded-xl bg-forest px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-forest/90 disabled:opacity-50 flex items-center gap-1.5 transition"
            >
              <span>{isSaving ? '⏳ Saving…' : '💾 Save Products Page Changes'}</span>
            </button>
          </div>
        </div>

        {/* Website Preview Links & Navigation Shortcuts */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] font-bold text-ink/50 uppercase">Preview on Website:</span>
            <a
              href="/products"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-forest/30 bg-white px-3 py-1 font-bold text-forest hover:bg-forest hover:text-white transition shadow-xs"
            >
              <span>👁️ View Live /products Page</span>
              <span>↗</span>
            </a>
            <a
              href="/product-details"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-3 py-1 font-semibold text-ink/75 hover:bg-line/20 hover:text-ink transition"
            >
              <span>👁️ View /product-details</span>
              <span>↗</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/admin/products"
              className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-2.5 py-1 text-[11px] font-semibold text-ink/70 hover:bg-[#fbf9f4] hover:text-ink transition"
            >
              <span>📦 Manage Product Items</span>
              <span>→</span>
            </a>
            <a
              href="/admin/segments"
              className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-2.5 py-1 text-[11px] font-semibold text-ink/70 hover:bg-[#fbf9f4] hover:text-ink transition"
            >
              <span>📂 Manage Categories</span>
              <span>→</span>
            </a>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-[11px] text-clay/80 hover:text-clay hover:underline px-1.5"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>

      {/* 1. FEATURED FOOD SHOWCASE HEADER (MATCHING EXACT USER SCREENSHOT) */}
      <section className="rounded-2xl border-2 border-emerald-600/30 bg-white p-6 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-forest bg-forest/10 px-2.5 py-0.5 rounded border border-forest/20">
                ⭐ HERO EXHIBITION HEADER
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold bg-gold/15 px-2 py-0.5 rounded">
                LIVE ON /products
              </span>
            </div>
            <h2 className="mt-1 font-display text-xl font-bold text-ink">
              1. "Featured Food Showcase" Section Header & 3D Exhibition
            </h2>
            <p className="text-xs text-ink/60">
              Customize the exact headline, pill badge, descriptive text, and 3D wheel/arc settings shown at the top of the products page.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer bg-forest/5 px-3 py-1.5 rounded-full border border-forest/20">
              <input
                type="checkbox"
                checked={current.showcase?.isActive !== false}
                onChange={(e) => updateShowcase('isActive', e.target.checked)}
              />
              <span>Active</span>
            </label>
          </div>
        </div>

        {/* Live Visual Preview Box (Exact Website Look) */}
        <div className="rounded-2xl border border-line/80 dark:border-line bg-gradient-to-b from-[#fcfbfa] to-[#f7f4ed] dark:from-[#132019] dark:to-[#182820] p-6 text-center shadow-xs">
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-ink/50 dark:text-paper/60 bg-white dark:bg-[#182820] px-2.5 py-0.5 rounded-full border border-line dark:border-line mb-3">
            <span>👁️ Live Screen Preview:</span>
          </div>

          <div className="mx-auto max-w-2xl py-2 space-y-2">
            {/* Top Eyebrow Badge Pill */}
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="h-1.5 w-6 rounded-full bg-gold" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#16382b] dark:text-gold">
                {current.showcase?.showcaseBadge || 'FEATURED FOOD SHOWCASE'}
              </span>
              <span className="h-1.5 w-6 rounded-full bg-gold" />
            </div>

            {/* Main Showcase Title */}
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#16382b] transition-all">
              {current.showcase?.title || 'Featured Export Products'}
            </h2>

            {/* Subtitle Description */}
            <p className="text-xs sm:text-sm text-ink/75 max-w-xl mx-auto leading-relaxed">
              {current.showcase?.subtitle ||
                'Discover our certified Sortex-cleaned harvest lots and premium packaged Indian food products ready for global ocean freight.'}
            </p>

            {/* Mode & Watermark Pills */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-ink/60">
              <span className="bg-white px-2.5 py-0.5 rounded-full border border-line">
                Mode: {current.showcase?.defaultMode === 'arc' ? '🌸 Curved Fan Arc' : '🎡 3D Spin Wheel'}
              </span>
              <span className="bg-white px-2.5 py-0.5 rounded-full border border-line">
                Speed: {current.showcase?.autoRotateSeconds || 3.5}s
              </span>
              <span className="bg-white px-2.5 py-0.5 rounded-full border border-line uppercase">
                Watermark: {current.showcase?.watermark || 'FOOD PRODUCTS'}
              </span>
            </div>
          </div>
        </div>

        {/* Form Inputs for this Section */}
        <div className="space-y-4 pt-1">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label text-xs font-bold text-ink">
                Showcase Top Badge Tag (Eyebrow Pill) *
              </label>
              <input
                className="field text-xs font-semibold"
                value={current.showcase?.showcaseBadge || ''}
                onChange={(e) => updateShowcase('showcaseBadge', e.target.value)}
                placeholder="e.g. FEATURED FOOD SHOWCASE"
              />
              <span className="text-[11px] text-ink/50 mt-1 block">
                Displays between the two gold bars above the main heading.
              </span>
            </div>

            <div>
              <label className="label text-xs font-bold text-ink">
                Showcase Main Headline / Title *
              </label>
              <input
                className="field text-sm font-bold text-ink"
                value={current.showcase?.title || ''}
                onChange={(e) => updateShowcase('title', e.target.value)}
                placeholder="e.g. Featured Export Products"
              />
              <span className="text-[11px] text-ink/50 mt-1 block">
                Primary large heading of the 3D exhibition on the products page.
              </span>
            </div>
          </div>

          <div>
            <label className="label text-xs font-bold text-ink">
              Showcase Subtitle / Introduction Description *
            </label>
            <textarea
              className="field text-xs leading-relaxed"
              rows="3"
              value={current.showcase?.subtitle || ''}
              onChange={(e) => updateShowcase('subtitle', e.target.value)}
              placeholder="Discover our certified Sortex-cleaned harvest lots and premium packaged Indian food products ready for global ocean freight."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3 pt-2">
            <div>
              <label className="label text-xs">Default Display Mode</label>
              <select
                className="field text-xs font-semibold"
                value={current.showcase?.defaultMode || 'wheel'}
                onChange={(e) => updateShowcase('defaultMode', e.target.value)}
              >
                <option value="wheel">🎡 3D Spin Wheel (3 Products / Orbital)</option>
                <option value="arc">🌸 Curved Fan Arc</option>
              </select>
            </div>

            <div>
              <label className="label text-xs">Auto-Rotation Timer (Seconds)</label>
              <input
                type="number"
                step="0.5"
                min="2"
                max="15"
                className="field text-xs"
                value={current.showcase?.autoRotateSeconds || 3.5}
                onChange={(e) => updateShowcase('autoRotateSeconds', Number(e.target.value))}
              />
            </div>

            <div>
              <label className="label text-xs">Background Watermark Text</label>
              <input
                className="field font-mono text-xs uppercase"
                value={current.showcase?.watermark || ''}
                onChange={(e) => updateShowcase('watermark', e.target.value)}
                placeholder="e.g. FOOD PRODUCTS"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-line/60">
            <label className="flex items-center gap-2 text-xs font-medium text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(current.showcase?.keepCustomTitle)}
                onChange={(e) => updateShowcase('keepCustomTitle', e.target.checked)}
              />
              <span>
                <strong>Retain Custom Heading:</strong> Keep "{current.showcase?.title || 'Featured Export Products'}" even when buyer selects a category pill
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT CATALOGUE GRID HEADER (LOWER GRID & /product-details) */}
      <section className="rounded-2xl border border-line bg-white p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">
              2. Product Catalogue Grid Header & Introduction
            </h2>
            <p className="text-xs text-ink/60">
              Controls the title, badge, and descriptive introduction displayed above the product cards grid on the website.
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer bg-forest/5 px-3 py-1.5 rounded-full border border-forest/20">
            <input
              type="checkbox"
              checked={current.isActive !== false}
              onChange={(e) => setSection({ ...current, isActive: e.target.checked })}
            />
            <span>Active</span>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label text-xs">Top Eyebrow Pill Tag</label>
            <input
              className="field"
              value={current.hero?.eyebrow || ''}
              onChange={(e) => updateHero('eyebrow', e.target.value)}
              placeholder="e.g. CERTIFIED INDIAN EXPORTS"
            />
          </div>
          <div>
            <label className="label text-xs">Category Tag Badge</label>
            <input
              className="field"
              value={current.hero?.badge || ''}
              onChange={(e) => updateHero('badge', e.target.value)}
              placeholder="e.g. Global Agro-Food Catalogue"
            />
          </div>
        </div>

        <div className="mt-2">
          <label className="label text-xs">Main Catalogue Title Heading</label>
          <input
            className="field text-base font-bold"
            value={current.hero?.title || ''}
            onChange={(e) => updateHero('title', e.target.value)}
            placeholder="e.g. All Export Food Products"
          />
        </div>

        <div className="mt-2">
          <label className="label text-xs">Catalogue Subtitle Description</label>
          <textarea
            className="field text-xs"
            rows="2"
            value={current.hero?.subtitle || ''}
            onChange={(e) => updateHero('subtitle', e.target.value)}
            placeholder="100% Sortex-cleaned Indian spices, premium grains, pulses..."
          />
        </div>
      </section>

      {/* 3. Product Specification Box on Product Page (Bento Card) */}
      <section className="rounded-2xl border border-line bg-white p-6 shadow-card space-y-4">
        <div className="border-b border-line pb-4 mb-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold-dark bg-gold/15 px-2.5 py-0.5 rounded border border-gold/30">
            PRODUCT SPECIFICATION & GUARANTEE BOX
          </span>
          <h2 className="mt-1 font-display text-lg font-bold text-ink">
            3. Product Specification Box on Product Page
          </h2>
          <p className="text-xs text-ink/60">
            Configure the prominent green specification card rendered on the product page grid, with custom headline, guarantee badge, and editable specification bullets.
          </p>
        </div>

        {/* Live Visual Preview matching User Design */}
        <div className="rounded-2xl bg-gradient-to-br from-[#0f2b20] to-[#16382b] p-6 text-paper shadow-md border border-gold/30 relative overflow-hidden">
          <span className="pointer-events-none absolute -right-4 -bottom-4 font-display text-7xl font-black text-white/5 select-none uppercase">
            NMC
          </span>
          <span className="inline-block rounded-full bg-gold/20 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-gold border border-gold/40">
            {current.bento?.badge || 'DIRECT SOURCING GUARANTEE'}
          </span>
          <h3 className="mt-2 font-display text-xl font-black text-white">
            {current.bento?.headline || 'Global Food Products, Perfected'}
          </h3>
          <p className="mt-1 text-xs text-paper/80">
            {current.bento?.subtitle || 'Direct sourcing of export-grade Indian spices, premium grains, and food products with certified global shipping.'}
          </p>
          <div className="mt-3 space-y-1">
            {(current.bento?.bullets || []).map((b, idx) => (
              <p key={idx} className="font-mono text-xs text-gold/90 font-medium flex items-center gap-1.5">
                <span className="text-gold font-bold">✓</span>
                <span>{b}</span>
              </p>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-gold px-4 py-2 font-bold text-ink shadow-sm">
              {current.bento?.buttonText || 'Request Container Quotation'} →
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-4 py-2 font-semibold text-white">
              {current.bento?.secondaryButtonText || 'Download Line Card'} 📄
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 pt-2">
          <div>
            <label className="label text-xs">Badge Tag</label>
            <input
              className="field text-xs"
              value={current.bento?.badge || ''}
              onChange={(e) => updateBento('badge', e.target.value)}
              placeholder="e.g. DIRECT SOURCING GUARANTEE"
            />
          </div>
          <div>
            <label className="label text-xs">Card Headline</label>
            <input
              className="field text-sm font-bold"
              value={current.bento?.headline || ''}
              onChange={(e) => updateBento('headline', e.target.value)}
              placeholder="e.g. Global Food Products, Perfected"
            />
          </div>
        </div>

        <div className="mt-2">
          <label className="label text-xs">Subtitle Description</label>
          <textarea
            className="field text-xs"
            rows="2"
            value={current.bento?.subtitle || ''}
            onChange={(e) => updateBento('subtitle', e.target.value)}
            placeholder="Direct sourcing of export-grade Indian spices..."
          />
        </div>

        {/* Bullets List (Specifications) */}
        <div className="mt-4 rounded-xl border border-line bg-[#fbf9f4] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-ink">
              Specification Bullet Points ({(current.bento?.bullets || []).length})
            </span>
            <button
              type="button"
              onClick={addBentoBullet}
              className="rounded-lg bg-white border border-line px-2.5 py-1 text-xs font-bold text-forest hover:bg-forest hover:text-white transition shadow-xs"
            >
              + Add Specification Bullet
            </button>
          </div>

          <div className="space-y-2">
            {(current.bento?.bullets || []).map((bullet, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-forest font-bold text-sm">✓</span>
                <input
                  className="field text-xs flex-1"
                  value={bullet}
                  onChange={(e) => updateBentoBullet(idx, e.target.value)}
                  placeholder="e.g. Direct Mundra Port Container Stuffing"
                />
                <button
                  type="button"
                  onClick={() => removeBentoBullet(idx)}
                  className="text-xs text-clay hover:underline px-2 font-semibold"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <div>
            <label className="label text-xs">Primary CTA Button Text</label>
            <input
              className="field text-xs"
              value={current.bento?.buttonText || ''}
              onChange={(e) => updateBento('buttonText', e.target.value)}
              placeholder="e.g. Request Container Quotation"
            />
          </div>
          <div>
            <label className="label text-xs">Primary CTA Button Link</label>
            <input
              className="field text-xs font-mono"
              value={current.bento?.buttonLink || ''}
              onChange={(e) => updateBento('buttonLink', e.target.value)}
              placeholder="e.g. /inquiry"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mt-2">
          <div>
            <label className="label text-xs">Secondary Button Text</label>
            <input
              className="field text-xs"
              value={current.bento?.secondaryButtonText || ''}
              onChange={(e) => updateBento('secondaryButtonText', e.target.value)}
              placeholder="e.g. Download Line Card"
            />
          </div>
          <div>
            <label className="label text-xs">Secondary Button Link</label>
            <input
              className="field text-xs font-mono"
              value={current.bento?.secondaryButtonLink || ''}
              onChange={(e) => updateBento('secondaryButtonLink', e.target.value)}
              placeholder="e.g. /brochures"
            />
          </div>
        </div>
      </section>

      {/* 4. Export Assurance & Trust Bar */}
      <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
        <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">
              4. Export Assurance & Trust Highlights Bar
            </h2>
            <p className="text-xs text-ink/60">
              4 key value pillars demonstrating Sortex optical cleaning, direct port logistics, and lab certifications.
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer bg-forest/5 px-3 py-1.5 rounded-full border border-forest/20">
            <input
              type="checkbox"
              checked={current.trustBar?.isActive !== false}
              onChange={(e) =>
                setSection({
                  ...current,
                  trustBar: { ...current.trustBar, isActive: e.target.checked },
                })
              }
            />
            <span>Active</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="label text-xs">Trust Bar Section Title</label>
          <input
            className="field"
            value={current.trustBar?.title || ''}
            onChange={(e) =>
              setSection({
                ...current,
                trustBar: { ...current.trustBar, title: e.target.value },
              })
            }
            placeholder="e.g. Why Global Buyers Trust NMC"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {(current.trustBar?.items || []).map((pillar, i) => (
            <div key={pillar._id || i} className="rounded-xl border border-line bg-[#fbf9f4] p-4 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  className="w-12 text-center text-lg rounded border border-line bg-white py-1"
                  value={pillar.icon || '✨'}
                  onChange={(e) => updateTrustPillar(i, 'icon', e.target.value)}
                  placeholder="Icon"
                />
                <input
                  className="field text-xs font-bold flex-1"
                  value={pillar.title || ''}
                  onChange={(e) => updateTrustPillar(i, 'title', e.target.value)}
                  placeholder="Pillar Title (e.g. 100% Sortex Cleaned)"
                />
              </div>
              <textarea
                className="field text-xs"
                rows="2"
                value={pillar.text || ''}
                onChange={(e) => updateTrustPillar(i, 'text', e.target.value)}
                placeholder="Brief description of this export guarantee..."
              />
            </div>
          ))}
        </div>
      </section>

      {/* 5. Bottom Quotation & Sample Banner */}
      <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
        <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">
              5. Bottom Export Quotation & Sample CTA Banner
            </h2>
            <p className="text-xs text-ink/60">
              High-converting call to action banner positioned at the bottom of the products page.
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer bg-forest/5 px-3 py-1.5 rounded-full border border-forest/20">
            <input
              type="checkbox"
              checked={current.ctaBanner?.isActive !== false}
              onChange={(e) => updateCta('isActive', e.target.checked)}
            />
            <span>Active</span>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label text-xs">Banner Eyebrow Tag</label>
            <input
              className="field text-xs"
              value={current.ctaBanner?.eyebrow || ''}
              onChange={(e) => updateCta('eyebrow', e.target.value)}
              placeholder="e.g. READY FOR EXPORT ORDERS"
            />
          </div>
          <div>
            <label className="label text-xs">Banner Main Title</label>
            <input
              className="field text-sm font-bold"
              value={current.ctaBanner?.title || ''}
              onChange={(e) => updateCta('title', e.target.value)}
              placeholder="e.g. Need Container Freight Quotations or Custom Samples?"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="label text-xs">Banner Description</label>
          <textarea
            className="field text-xs"
            rows="2"
            value={current.ctaBanner?.description || ''}
            onChange={(e) => updateCta('description', e.target.value)}
            placeholder="Our international trade desk prepares formal FOB..."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <div>
            <label className="label text-xs">Primary Button Text</label>
            <input
              className="field text-xs"
              value={current.ctaBanner?.buttonPrimaryText || ''}
              onChange={(e) => updateCta('buttonPrimaryText', e.target.value)}
              placeholder="Request Official Quotation →"
            />
          </div>
          <div>
            <label className="label text-xs">Primary Button Link</label>
            <input
              className="field text-xs font-mono"
              value={current.ctaBanner?.buttonPrimaryLink || ''}
              onChange={(e) => updateCta('buttonPrimaryLink', e.target.value)}
              placeholder="/inquiry"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <div>
            <label className="label text-xs">Secondary Button Text</label>
            <input
              className="field text-xs"
              value={current.ctaBanner?.buttonSecondaryText || ''}
              onChange={(e) => updateCta('buttonSecondaryText', e.target.value)}
              placeholder="Download Product Brochures"
            />
          </div>
          <div>
            <label className="label text-xs">Secondary Button Link</label>
            <input
              className="field text-xs font-mono"
              value={current.ctaBanner?.buttonSecondaryLink || ''}
              onChange={(e) => updateCta('buttonSecondaryLink', e.target.value)}
              placeholder="/brochures"
            />
          </div>
        </div>
      </section>

      {/* Bottom Sticky-style Save Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-line bg-white p-5 shadow-card">
        <div>
          <h4 className="font-display font-bold text-sm text-ink">Ready to Publish Changes?</h4>
          <p className="text-xs text-ink/60">
            Saving here updates MongoDB and instantly connects changes to <span className="font-mono text-moss">/products</span> and <span className="font-mono text-moss">/product-details</span>.
          </p>
        </div>

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="rounded-xl bg-forest px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-forest/90 disabled:opacity-50 flex items-center gap-2 transition"
        >
          <span>{isSaving ? 'Saving Changes…' : '💾 Save All Products Page Changes'}</span>
        </button>
      </div>
    </div>
  );
}

function HeaderEditor({ section, setSection }) {
  const current = {
    ...defaults.header,
    ...(section || {}),
    navLinks:
      Array.isArray(section?.navLinks) && section.navLinks.length > 0
        ? section.navLinks
        : defaults.header.navLinks,
  };

  const updateField = (field, value) => {
    setSection({ ...current, [field]: value });
  };

  const updateNavLink = (index, field, value) => {
    const next = [...(current.navLinks || [])];
    next[index] = { ...next[index], [field]: value };
    setSection({ ...current, navLinks: next });
  };

  const addNavLink = () => {
    setSection({
      ...current,
      navLinks: [
        ...(current.navLinks || []),
        { label: 'New Link', to: '/products', isActive: true, order: (current.navLinks?.length || 0) + 1 },
      ],
    });
  };

  const removeNavLink = (index) => {
    setSection({
      ...current,
      navLinks: (current.navLinks || []).filter((_, i) => i !== index),
    });
  };

  const isCustomUploaded = Boolean(
    current.favicon &&
    current.favicon !== '/favicon.svg' &&
    !current.favicon.startsWith('data:image/svg')
  );

  const [alignedPreview, setAlignedPreview] = useState(current.faviconAlignedDataUrl || '');

  useEffect(() => {
    if (isCustomUploaded && current.favicon) {
      let isCancelled = false;
      const fullUrl = asset(current.favicon);
      createAlignedFavicon(fullUrl, {
        fit: current.faviconFit || 'contain',
        shape: current.faviconShape || 'rounded',
        bg: current.faviconBg || 'transparent',
        padding: current.faviconPadding ?? 10,
        scale: current.faviconScale ?? 100,
        offsetX: current.faviconOffsetX ?? 0,
        offsetY: current.faviconOffsetY ?? 0,
      }).then((dataUrl) => {
        if (!isCancelled && dataUrl) {
          setAlignedPreview(dataUrl);
          if (current.faviconAlignedDataUrl !== dataUrl) {
            updateField('faviconAlignedDataUrl', dataUrl);
          }
        }
      });
      return () => {
        isCancelled = true;
      };
    } else {
      setAlignedPreview('');
    }
  }, [
    current.favicon,
    current.faviconFit,
    current.faviconBg,
    current.faviconShape,
    current.faviconPadding,
    current.faviconScale,
    current.faviconOffsetX,
    current.faviconOffsetY,
    isCustomUploaded,
  ]);

  const effectiveFaviconSrc = isCustomUploaded
    ? (alignedPreview || current.faviconAlignedDataUrl || asset(current.favicon))
    : generateSvgFavicon(current.faviconText || 'NMC', current.faviconSubtext || 'EXPORTS');

  const handleDownloadFavicon = () => {
    const a = document.createElement('a');
    if (isCustomUploaded && (alignedPreview || current.faviconAlignedDataUrl)) {
      a.href = alignedPreview || current.faviconAlignedDataUrl;
      a.download = 'favicon-aligned.png';
    } else {
      const dataUri = generateSvgFavicon(current.faviconText || 'NMC', current.faviconSubtext || 'EXPORTS');
      a.href = dataUri;
      a.download = `favicon-${(current.faviconText || 'nmc').toLowerCase().replace(/\s+/g, '-')}.svg`;
    }
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const applyPreset = (preset) => {
    if (preset === 'auto') {
      setSection({
        ...current,
        faviconFit: 'contain',
        faviconShape: 'rounded',
        faviconBg: 'transparent',
        faviconPadding: 10,
        faviconScale: 100,
        faviconOffsetX: 0,
        faviconOffsetY: 0,
      });
    } else if (preset === 'emerald') {
      setSection({
        ...current,
        faviconFit: 'contain',
        faviconShape: 'rounded',
        faviconBg: '#16382b',
        faviconPadding: 12,
        faviconScale: 100,
        faviconOffsetX: 0,
        faviconOffsetY: 0,
      });
    } else if (preset === 'white') {
      setSection({
        ...current,
        faviconFit: 'contain',
        faviconShape: 'rounded',
        faviconBg: '#ffffff',
        faviconPadding: 10,
        faviconScale: 100,
        faviconOffsetX: 0,
        faviconOffsetY: 0,
      });
    } else if (preset === 'slate') {
      setSection({
        ...current,
        faviconFit: 'contain',
        faviconShape: 'rounded',
        faviconBg: '#0f172a',
        faviconPadding: 10,
        faviconScale: 100,
        faviconOffsetX: 0,
        faviconOffsetY: 0,
      });
    } else if (preset === 'cover') {
      setSection({
        ...current,
        faviconFit: 'cover',
        faviconShape: 'square',
        faviconBg: 'transparent',
        faviconPadding: 0,
        faviconScale: 100,
        faviconOffsetX: 0,
        faviconOffsetY: 0,
      });
    }
  };

  const handleFaviconUpload = (url) => {
    setSection({
      ...current,
      favicon: url,
      faviconFit: 'contain',
      faviconShape: 'rounded',
      faviconBg: 'transparent',
      faviconPadding: 10,
      faviconScale: 100,
      faviconOffsetX: 0,
      faviconOffsetY: 0,
      faviconAlignedDataUrl: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Brand & Logo Header */}
      <section className="rounded-2xl border border-line bg-white p-6 shadow-card space-y-4">
        <div className="border-b border-line pb-4">
          <h3 className="font-display font-bold text-lg text-ink">Header Brand Identity & Logo</h3>
          <p className="text-xs text-ink/60">Configure company name, short brand tag, slogan, and website logo.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label text-xs">Full Brand Name</label>
            <input
              className="field"
              value={current.brandFullName || ''}
              onChange={(e) => updateField('brandFullName', e.target.value)}
              placeholder="e.g. Nirmala Multitrading Co."
            />
          </div>
          <div>
            <label className="label text-xs">Tagline / Slogan</label>
            <input
              className="field"
              value={current.brandTagline || ''}
              onChange={(e) => updateField('brandTagline', e.target.value)}
              placeholder="e.g. India’s Taste. The World’s Table"
            />
          </div>
        </div>

        <div className="mt-4">
          <ImageUpload
            label="Website Header Logo"
            value={current.logo || ''}
            onChange={(url) => updateField('logo', url)}
          />
        </div>
      </section>

      {/* Favicon & Browser Tab Content & Text Editor */}
      <section className="rounded-2xl border border-line bg-white p-6 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-line pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-forest bg-forest/10 px-2 py-0.5 rounded border border-forest/20 uppercase tracking-wider">
                Tab & Favicon CMS
              </span>
              <span className="text-xs font-semibold text-gold">Dynamic Vector Text + SEO</span>
            </div>
            <h3 className="font-display font-bold text-lg text-ink mt-1">
              Favicon Text, Subtext & Browser Tab Content
            </h3>
            <p className="text-xs text-ink/60 mt-0.5">
              Customize the text inside the dynamic SVG favicon emblem, browser tab title, search engine snippet, or upload a custom image icon.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownloadFavicon}
              className="px-3 py-1.5 rounded-lg border border-line bg-white hover:bg-cream text-xs font-medium text-ink shadow-sm transition-colors flex items-center gap-1.5"
              title={isCustomUploaded ? 'Download aligned 128x128 PNG favicon' : 'Download current generated SVG favicon'}
            >
              <svg className="w-3.5 h-3.5 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {isCustomUploaded ? 'Download Aligned PNG' : 'Download SVG Favicon'}
            </button>
          </div>
        </div>

        {/* Live Browser Tab & Search Snippet Mockup Preview */}
        <div className="rounded-xl border border-slate-700/60 bg-slate-900 p-4 text-slate-100 shadow-md">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
            <span>Realistic Browser Tab Preview (Live)</span>
            <span className="text-[9px] text-amber-400 font-sans">
              {isCustomUploaded ? '● Using Custom Uploaded Image' : '● Using Dynamic Text Emblem'}
            </span>
          </div>

          {/* Browser Tab Window Bar */}
          <div className="rounded-t-lg bg-slate-950 p-2 pb-0 flex items-center gap-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5 px-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block"></span>
            </div>

            {/* Active Tab */}
            <div className="flex items-center gap-2 bg-slate-900 text-slate-200 px-3 py-1.5 rounded-t-lg border-t border-x border-slate-700/70 text-xs max-w-sm sm:max-w-md shadow-inner">
              <img
                src={effectiveFaviconSrc}
                alt="Favicon preview"
                className="h-4 w-4 shrink-0 rounded object-contain"
              />
              <span className="truncate font-sans font-medium text-[11px] text-slate-100">
                {current.siteTitle || 'Nirmala Multi Trading Co. (NMC) | Indian Merchant Food Exporter'}
              </span>
              <span className="text-slate-400 hover:text-slate-200 ml-auto cursor-default pl-1 text-[11px]">×</span>
            </div>

            {/* New Tab Plus */}
            <span className="text-slate-400 hover:text-slate-200 cursor-default px-1 text-sm font-bold">+</span>
          </div>

          {/* Browser URL / Content Bar */}
          <div className="bg-slate-900 rounded-b-lg p-3 border-x border-b border-slate-800 space-y-2">
            <div className="flex items-center gap-2 bg-slate-950/70 rounded-md px-3 py-1 text-[11px] text-slate-300 font-mono border border-slate-800">
              <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-emerald-400">https://</span>
              <span className="text-slate-100">nirmalamultitrading.com</span>
            </div>

            {/* Google Search Result Preview */}
            <div className="mt-3 bg-white text-slate-900 rounded-lg p-3 text-left">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                Google Search Appearance
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full bg-slate-100 p-0.5 border border-slate-200 flex items-center justify-center">
                  <img src={effectiveFaviconSrc} alt="Search favicon" className="w-3.5 h-3.5 object-contain" />
                </div>
                <div className="text-xs text-slate-700 leading-tight truncate">
                  <span className="font-semibold">Nirmala Multi Trading Co.</span>
                  <span className="text-slate-400 text-[10px] ml-1">https://nirmalamultitrading.com</span>
                </div>
              </div>
              <h4 className="text-blue-700 hover:underline font-medium text-sm leading-snug line-clamp-1 cursor-pointer">
                {current.siteTitle || 'Nirmala Multi Trading Co. (NMC) | Leading Indian Merchant Food Exporter'}
              </h4>
              <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">
                {current.metaDescription || 'Nirmala Multi Trading Co. (NMC) is a premier Indian merchant food exporter delivering Sortex-cleaned spices, grains, pulses, oil seeds, dehydrated foods and savories worldwide.'}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Favicon Text Controls */}
        <div className="rounded-xl border border-line bg-cream/40 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
            <div>
              <h4 className="font-display font-bold text-sm text-ink flex items-center gap-2">
                Dynamic SVG Favicon Text & Badge
                <span className="text-[10px] font-mono text-forest bg-forest/10 px-2 py-0.5 rounded border border-forest/20">
                  Instant Vector Generation
                </span>
              </h4>
              <p className="text-xs text-ink/60">
                These texts render inside the SVG vector favicon when no custom image file overrides it.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  updateField('faviconText', 'NMC');
                  updateField('faviconSubtext', 'EXPORTS');
                }}
                className="text-[11px] text-forest underline hover:text-forest/80 font-medium"
              >
                Reset Favicon Text to Default (NMC / EXPORTS)
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="flex items-center justify-between">
                <label className="label text-xs">Favicon Main Text / Brand Initials</label>
                <span className="text-[10px] font-mono text-ink/50">Max 5 chars</span>
              </div>
              <input
                className="field font-display font-bold tracking-wider"
                maxLength={5}
                value={current.faviconText || ''}
                onChange={(e) => updateField('faviconText', e.target.value.toUpperCase())}
                placeholder="e.g. NMC"
              />
              <p className="text-[11px] text-ink/50 mt-1">
                Rendered boldly in emerald green & gold in the center of the tab icon.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="label text-xs">Favicon Sub-Text / Badge Label</label>
                <span className="text-[10px] font-mono text-ink/50">Max 12 chars</span>
              </div>
              <input
                className="field font-mono font-semibold tracking-wider text-xs"
                maxLength={12}
                value={current.faviconSubtext || ''}
                onChange={(e) => updateField('faviconSubtext', e.target.value.toUpperCase())}
                placeholder="e.g. EXPORTS"
              />
              <p className="text-[11px] text-ink/50 mt-1">
                Rendered inside the lower gold badge of the tab icon (e.g. EXPORTS, AGRO, INDIA).
              </p>
            </div>
          </div>

          {/* Favicon Enlarged Preview */}
          <div className="flex items-center gap-4 bg-white border border-line rounded-xl p-3">
            <div className="p-2 rounded-xl bg-forest/5 border border-forest/15 shrink-0 flex items-center justify-center">
              <img
                src={effectiveFaviconSrc}
                alt="Favicon vector enlarged"
                className="w-14 h-14 object-contain rounded-lg shadow-sm"
              />
            </div>
            <div className="text-xs text-ink/70 space-y-0.5">
              <p className="font-semibold text-ink">
                Rendered Emblem: <span className="text-forest font-mono">{current.faviconText || 'NMC'}</span> &bull; <span className="text-gold font-mono">{current.faviconSubtext || 'EXPORTS'}</span>
              </p>
              <p className="text-[11px] text-ink/50">
                Vector resolution: 64x64 SVG (Ultra crisp on 4K, Retina displays, Android/iOS home screens, and browser tabs).
              </p>
            </div>
          </div>
        </div>

        {/* Browser Tab Title & Meta Description */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="label text-xs">Browser Tab Title (&lt;title&gt;)</label>
              <span className="text-[10px] font-mono text-ink/50">Recommended: 50-65 chars</span>
            </div>
            <input
              className="field font-medium"
              value={current.siteTitle || ''}
              onChange={(e) => updateField('siteTitle', e.target.value)}
              placeholder="e.g. Nirmala Multi Trading Co. (NMC) | Leading Indian Merchant Food Exporter"
            />
            <p className="text-[11px] text-ink/50 mt-1">
              Shown on browser tab titles, bookmarks, and as the primary headline in search engine results.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="label text-xs">Website Meta Description (&lt;meta name="description"&gt;)</label>
              <span className="text-[10px] font-mono text-ink/50">Recommended: 120-160 chars</span>
            </div>
            <textarea
              className="field"
              rows={2}
              value={current.metaDescription || ''}
              onChange={(e) => updateField('metaDescription', e.target.value)}
              placeholder="e.g. Merchant exporter of premium agro commodities, spices, grains, oil seeds, and food products from India to global ports."
            />
            <p className="text-[11px] text-ink/50 mt-1">
              Summary snippet shown under the title link in Google and Bing search results.
            </p>
          </div>
        </div>

        {/* Optional Custom Favicon Image Upload */}
        <div className="pt-4 border-t border-line space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-display font-bold text-sm text-ink">
                Or Upload Custom Favicon Image File (Optional Override)
              </h4>
              <p className="text-xs text-ink/60">
                If you upload an image (PNG, ICO, or custom SVG), it will be used instead of the dynamic text emblem above.
              </p>
            </div>

            {isCustomUploaded && (
              <button
                type="button"
                onClick={() => updateField('favicon', '/favicon.svg')}
                className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-medium text-red-700 transition-colors shrink-0"
              >
                Clear Custom Image &bull; Use Dynamic Text Favicon
              </button>
            )}
          </div>

          <ImageUpload
            label="Upload Custom Favicon Image (Any PNG, JPG, WEBP, ICO or SVG — automatically aligned into a perfect square)"
            value={current.favicon || ''}
            onChange={handleFaviconUpload}
          />

          {/* Photo Auto-Alignment & Square Framing Studio */}
          {isCustomUploaded && (
            <div className="mt-4 rounded-xl border border-forest/25 bg-cream/35 p-5 space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line/80 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-forest bg-forest/10 px-2 py-0.5 rounded border border-forest/20 uppercase tracking-wider">
                      Auto-Alignment Active
                    </span>
                    <span className="text-xs font-semibold text-gold">1:1 Square Auto-Framing</span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-ink mt-1">
                    Photo Alignment & Square Framing Studio (फोटो अलाइनमेंट और स्क्वायर फ्रेमिंग)
                  </h4>
                  <p className="text-xs text-ink/60 mt-0.5">
                    Your photo is automatically centered and framed into a pixel-perfect square without stretching or cutting. Choose a preset or fine-tune alignment below.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => applyPreset('auto')}
                    className="px-2.5 py-1.5 rounded-lg border border-line bg-white hover:bg-cream text-[11px] font-semibold text-forest shadow-xs transition-colors"
                    title="Reset to perfect center"
                  >
                    Reset Center
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadFavicon}
                    className="px-3 py-1.5 rounded-lg border border-forest/30 bg-forest text-white hover:bg-forest/90 text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PNG
                  </button>
                </div>
              </div>

              {/* 1-Click Alignment Presets */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-ink/70">
                  Quick Alignment Presets (एक-क्लिक अलाइनमेंट प्रीसेट्स)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <button
                    type="button"
                    onClick={() => applyPreset('auto')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                      current.faviconFit === 'contain' && current.faviconBg === 'transparent'
                        ? 'border-forest bg-forest/5 ring-1 ring-forest'
                        : 'border-line bg-white hover:border-forest/50'
                    }`}
                  >
                    <span className="text-base">🎯</span>
                    <span className="text-[11px] font-bold text-ink mt-0.5">Auto-Center</span>
                    <span className="text-[9px] text-ink/50">Transparent</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset('emerald')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                      current.faviconBg === '#16382b'
                        ? 'border-forest bg-forest/10 ring-1 ring-forest'
                        : 'border-line bg-white hover:border-forest/50'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-[#16382b] border border-gold inline-block"></span>
                    <span className="text-[11px] font-bold text-ink mt-0.5">Emerald Badge</span>
                    <span className="text-[9px] text-ink/50">NMC Green</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset('white')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                      current.faviconBg === '#ffffff'
                        ? 'border-forest bg-forest/5 ring-1 ring-forest'
                        : 'border-line bg-white hover:border-forest/50'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white border border-slate-300 inline-block"></span>
                    <span className="text-[11px] font-bold text-ink mt-0.5">Clean White</span>
                    <span className="text-[9px] text-ink/50">Solid White</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset('slate')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                      current.faviconBg === '#0f172a'
                        ? 'border-forest bg-forest/5 ring-1 ring-forest'
                        : 'border-line bg-white hover:border-forest/50'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-[#0f172a] border border-slate-600 inline-block"></span>
                    <span className="text-[11px] font-bold text-ink mt-0.5">Dark Slate</span>
                    <span className="text-[9px] text-ink/50">High Contrast</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset('cover')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                      current.faviconFit === 'cover'
                        ? 'border-forest bg-forest/5 ring-1 ring-forest'
                        : 'border-line bg-white hover:border-forest/50'
                    }`}
                  >
                    <span className="text-base">🔲</span>
                    <span className="text-[11px] font-bold text-ink mt-0.5">Full Fill</span>
                    <span className="text-[9px] text-ink/50">Square Crop</span>
                  </button>
                </div>
              </div>

              {/* Multi-Size Live Alignment Comparison */}
              <div className="bg-white border border-line rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-center">
                    <span className="text-[9px] font-mono text-ink/40 uppercase block mb-1">16x16 Tab</span>
                    <div className="w-8 h-8 bg-slate-100 rounded border border-line flex items-center justify-center p-0.5">
                      <img src={effectiveFaviconSrc} alt="16px" className="w-4 h-4 object-contain" />
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-[9px] font-mono text-ink/40 uppercase block mb-1">32x32 Retina</span>
                    <div className="w-11 h-11 bg-slate-100 rounded-md border border-line flex items-center justify-center p-1">
                      <img src={effectiveFaviconSrc} alt="32px" className="w-8 h-8 object-contain" />
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-[9px] font-mono text-ink/40 uppercase block mb-1">64x64 Bookmark</span>
                    <div className="w-16 h-16 bg-slate-100 rounded-lg border border-line flex items-center justify-center p-1.5">
                      <img src={effectiveFaviconSrc} alt="64px" className="w-12 h-12 object-contain" />
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-[9px] font-mono text-ink/40 uppercase block mb-1">128x128 Master</span>
                    <div className="w-20 h-20 bg-slate-100 rounded-xl border border-line flex items-center justify-center p-1.5 shadow-inner">
                      <img src={effectiveFaviconSrc} alt="128px" className="w-full h-full object-contain" />
                    </div>
                  </div>
                </div>

                <div className="text-right text-xs text-ink/70 space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-semibold text-xs">
                    <span>✓</span> Aspect Ratio 100% Preserved
                  </div>
                  <p className="text-[11px] text-ink/50">
                    Auto-centered • Never squished • No weird gaps
                  </p>
                </div>
              </div>

              {/* Fine-Tuning Controls */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Fit Mode */}
                <div>
                  <label className="label text-xs">Fit Mode (फिट मोड)</label>
                  <select
                    className="field text-xs"
                    value={current.faviconFit || 'contain'}
                    onChange={(e) => updateField('faviconFit', e.target.value)}
                  >
                    <option value="contain">Contain (Auto-Fit & Centered)</option>
                    <option value="cover">Cover (Fill Full Square)</option>
                  </select>
                </div>

                {/* Shape / Mask */}
                <div>
                  <label className="label text-xs">Icon Shape (आइकन शेप)</label>
                  <select
                    className="field text-xs"
                    value={current.faviconShape || 'rounded'}
                    onChange={(e) => updateField('faviconShape', e.target.value)}
                  >
                    <option value="rounded">Modern Squircle (Rounded Square)</option>
                    <option value="circle">Circle (गोल)</option>
                    <option value="square">Sharp Square (पूरा स्क्वायर)</option>
                    <option value="none">No Frame (Direct Transparent)</option>
                  </select>
                </div>

                {/* Background Color */}
                <div>
                  <label className="label text-xs">Background Fill (बैकग्राउंड)</label>
                  <div className="flex items-center gap-2">
                    <select
                      className="field text-xs flex-1"
                      value={
                        ['transparent', '#16382b', '#ffffff', '#0f172a', '#C6912E'].includes(current.faviconBg)
                          ? current.faviconBg
                          : current.faviconBg ? 'custom' : 'transparent'
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val !== 'custom') updateField('faviconBg', val);
                      }}
                    >
                      <option value="transparent">Transparent (पारदर्शी)</option>
                      <option value="#16382b">NMC Emerald (#16382b)</option>
                      <option value="#ffffff">Pure White (#ffffff)</option>
                      <option value="#0f172a">Dark Slate (#0f172a)</option>
                      <option value="#C6912E">Luxury Gold (#C6912E)</option>
                      <option value="custom">Custom Color...</option>
                    </select>
                    <input
                      type="color"
                      value={current.faviconBg && current.faviconBg !== 'transparent' ? current.faviconBg : '#16382b'}
                      onChange={(e) => updateField('faviconBg', e.target.value)}
                      className="w-8 h-8 rounded border border-line cursor-pointer shrink-0"
                      title="Pick custom color"
                    />
                  </div>
                </div>

                {/* Safe Margin / Padding */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="label text-xs">Safe Margin (पैडिंग)</label>
                    <span className="text-[10px] font-mono text-ink/60">{current.faviconPadding ?? 10}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="35"
                    step="1"
                    className="w-full accent-forest cursor-pointer"
                    value={current.faviconPadding ?? 10}
                    onChange={(e) => updateField('faviconPadding', Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Sliders for Zoom & Nudge */}
              <div className="grid gap-4 sm:grid-cols-3 pt-3 border-t border-line/70">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="label text-xs">Zoom / Scale (ज़ूम)</label>
                    <span className="text-[10px] font-mono text-ink/60">{current.faviconScale ?? 100}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="180"
                    step="2"
                    className="w-full accent-forest cursor-pointer"
                    value={current.faviconScale ?? 100}
                    onChange={(e) => updateField('faviconScale', Number(e.target.value))}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="label text-xs">Nudge Horizontal (लेफ्ट/राइट)</label>
                    <span className="text-[10px] font-mono text-ink/60">{current.faviconOffsetX ?? 0}%</span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    step="1"
                    className="w-full accent-forest cursor-pointer"
                    value={current.faviconOffsetX ?? 0}
                    onChange={(e) => updateField('faviconOffsetX', Number(e.target.value))}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="label text-xs">Nudge Vertical (अप/डाउन)</label>
                    <span className="text-[10px] font-mono text-ink/60">{current.faviconOffsetY ?? 0}%</span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    step="1"
                    className="w-full accent-forest cursor-pointer"
                    value={current.faviconOffsetY ?? 0}
                    onChange={(e) => updateField('faviconOffsetY', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Header CTA Button */}
      <section className="rounded-2xl border border-line bg-white p-6 shadow-card space-y-4">
        <div className="border-b border-line pb-4">
          <h3 className="font-display font-bold text-lg text-ink">Call-to-Action (Quote) Button</h3>
          <p className="text-xs text-ink/60">Customize the top-right quotation button text and destination URL.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label text-xs">Button Text</label>
            <input
              className="field"
              value={current.ctaText || ''}
              onChange={(e) => updateField('ctaText', e.target.value)}
              placeholder="e.g. Get a Quote"
            />
          </div>
          <div>
            <label className="label text-xs">Button Destination Link</label>
            <input
              className="field"
              value={current.ctaLink || ''}
              onChange={(e) => updateField('ctaLink', e.target.value)}
              placeholder="e.g. /inquiry"
            />
          </div>
        </div>
      </section>

      {/* Header Navigation Menu Links */}
      <section className="rounded-2xl border border-line bg-white p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <h3 className="font-display font-bold text-lg text-ink">Navigation Menu Links</h3>
            <p className="text-xs text-ink/60">Customize links in the desktop navigation bar and mobile dropdown.</p>
          </div>
          <button
            type="button"
            onClick={addNavLink}
            className="btn-primary text-xs shrink-0"
          >
            + Add Nav Link
          </button>
        </div>

        <div className="space-y-3">
          {(current.navLinks || []).map((link, i) => (
            <div key={link._id || i} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl border border-line bg-[#fbf9f4] p-3 shadow-xs">
              <div className="w-20 shrink-0">
                <label className="block text-[10px] font-mono text-ink/50 uppercase font-semibold">Order #</label>
                <input
                  type="number"
                  className="field text-xs py-1.5 font-mono text-center"
                  placeholder="1"
                  value={link.order ?? (i + 1)}
                  onChange={(e) => updateNavLink(i, 'order', Number(e.target.value))}
                />
              </div>
              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-[10px] font-mono text-ink/50 uppercase font-semibold">Label</label>
                <input
                  className="field text-xs py-1.5"
                  placeholder="Link Label (e.g. Products)"
                  value={link.label || ''}
                  onChange={(e) => updateNavLink(i, 'label', e.target.value)}
                />
              </div>
              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-[10px] font-mono text-ink/50 uppercase font-semibold">Destination URL</label>
                <input
                  className="field text-xs py-1.5 font-mono"
                  placeholder="URL Path (e.g. /products)"
                  value={link.to || ''}
                  onChange={(e) => updateNavLink(i, 'to', e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-4">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={link.isActive !== false}
                    onChange={(e) => updateNavLink(i, 'isActive', e.target.checked)}
                  />
                  <span>Active</span>
                </label>
                <button
                  type="button"
                  onClick={() => removeNavLink(i)}
                  className="rounded-lg p-1.5 text-clay hover:bg-clay/10 transition text-xs font-bold"
                  title="Remove link"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function FooterEditor({ section, setSection }) {
  const current = {
    ...defaults.footer,
    ...(section || {}),
    badges:
      Array.isArray(section?.badges) && section.badges.length > 0
        ? section.badges
        : defaults.footer.badges,
    quickLinks:
      Array.isArray(section?.quickLinks) && section.quickLinks.length > 0
        ? section.quickLinks
        : defaults.footer.quickLinks,
  };

  const updateField = (field, value) => {
    setSection({ ...current, [field]: value });
  };

  const updateBadge = (index, value) => {
    const next = [...(current.badges || [])];
    next[index] = value;
    setSection({ ...current, badges: next });
  };

  const addBadge = () => {
    setSection({
      ...current,
      badges: [...(current.badges || []), 'NEW CERTIFICATION'],
    });
  };

  const removeBadge = (index) => {
    setSection({
      ...current,
      badges: (current.badges || []).filter((_, i) => i !== index),
    });
  };

  const updateQuickLink = (index, field, value) => {
    const next = [...(current.quickLinks || [])];
    next[index] = { ...next[index], [field]: value };
    setSection({ ...current, quickLinks: next });
  };

  const addQuickLink = () => {
    setSection({
      ...current,
      quickLinks: [
        ...(current.quickLinks || []),
        { label: 'New Link', to: '/products', isActive: true, order: (current.quickLinks?.length || 0) + 1 },
      ],
    });
  };

  const removeQuickLink = (index) => {
    setSection({
      ...current,
      quickLinks: (current.quickLinks || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Company Information & Blurb */}
      <section className="rounded-2xl border border-line bg-white p-6 shadow-card space-y-4">
        <div className="border-b border-line pb-4">
          <h3 className="font-display font-bold text-lg text-ink">Company Identity & Blurb</h3>
          <p className="text-xs text-ink/60">Configure the company name, logo, and summary blurb displayed in the footer column.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label text-xs">Company Full Name</label>
            <input
              className="field"
              value={current.brandFullName || ''}
              onChange={(e) => updateField('brandFullName', e.target.value)}
              placeholder="e.g. Nirmala Multitrading Co."
            />
          </div>
          <div>
            <ImageUpload
              label="Footer Logo"
              value={current.logo || ''}
              onChange={(url) => updateField('logo', url)}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="label text-xs">Company Summary / Blurb</label>
          <textarea
            className="field"
            rows="3"
            value={current.blurb || ''}
            onChange={(e) => updateField('blurb', e.target.value)}
            placeholder="Brief introduction of NMC export operations..."
          />
        </div>
      </section>

      {/* 2. Contact Information */}
      <section className="rounded-2xl border border-line bg-white p-6 shadow-card space-y-4">
        <div className="border-b border-line pb-4">
          <h3 className="font-display font-bold text-lg text-ink">Contact Details & Quote CTA</h3>
          <p className="text-xs text-ink/60">Set business email, phone number, physical address, and quote inquiry button.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label text-xs">Official Email</label>
            <input
              className="field"
              type="email"
              value={current.email || ''}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="nirmalamultitradingco@gmail.com"
            />
          </div>
          <div>
            <label className="label text-xs">Official Phone / WhatsApp</label>
            <input
              className="field"
              value={current.phone || ''}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="+91 7069826082"
            />
          </div>
          <div>
            <label className="label text-xs">Headquarters Address</label>
            <input
              className="field"
              value={current.address || ''}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="Surat, Gujarat, India"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <div>
            <label className="label text-xs">Inquiry Button Text</label>
            <input
              className="field"
              value={current.inquiryCtaText || ''}
              onChange={(e) => updateField('inquiryCtaText', e.target.value)}
              placeholder="Request FOB / CIF Quote"
            />
          </div>
          <div>
            <label className="label text-xs">Inquiry Button Link</label>
            <input
              className="field"
              value={current.inquiryCtaLink || ''}
              onChange={(e) => updateField('inquiryCtaLink', e.target.value)}
              placeholder="/inquiry"
            />
          </div>
        </div>
      </section>

      {/* 3. Newsletter Banner */}
      <section className="rounded-2xl border border-line bg-white p-6 shadow-card space-y-4">
        <div className="border-b border-line pb-4">
          <h3 className="font-display font-bold text-lg text-ink">Newsletter Banner</h3>
          <p className="text-xs text-ink/60">Manage the email subscriber headline, description, and badge.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label text-xs">Newsletter Badge</label>
            <input
              className="field"
              value={current.newsletterBadge || ''}
              onChange={(e) => updateField('newsletterBadge', e.target.value)}
              placeholder="Exporter Market Intelligence"
            />
          </div>
          <div>
            <label className="label text-xs">Newsletter Heading</label>
            <input
              className="field"
              value={current.newsletterTitle || ''}
              onChange={(e) => updateField('newsletterTitle', e.target.value)}
              placeholder="Get Instant Agro Market & Harvest Updates"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="label text-xs">Newsletter Description</label>
          <textarea
            className="field"
            rows="2"
            value={current.newsletterDesc || ''}
            onChange={(e) => updateField('newsletterDesc', e.target.value)}
            placeholder="Subscribe to receive immediate alerts..."
          />
        </div>
      </section>

      {/* 4. Certification Badges & Seals */}
      <section className="rounded-2xl border border-line bg-white p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <h3 className="font-display font-bold text-lg text-ink">Certification Badges / Tags</h3>
            <p className="text-xs text-ink/60">Pills displayed beneath company logo (e.g. APEDA, FSSAI, SPICE BOARD).</p>
          </div>
          <button
            type="button"
            onClick={addBadge}
            className="btn-primary text-xs shrink-0"
          >
            + Add Badge
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {(current.badges || []).map((badge, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                className="field text-xs py-1.5 font-mono"
                value={badge}
                onChange={(e) => updateBadge(idx, e.target.value)}
                placeholder="e.g. APEDA REG."
              />
              <button
                type="button"
                onClick={() => removeBadge(idx)}
                className="rounded-lg p-2 text-clay hover:bg-clay/10 transition text-sm font-bold"
                title="Remove badge"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Quick Links */}
      <section className="rounded-2xl border border-line bg-white p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <h3 className="font-display font-bold text-lg text-ink">Explore / Quick Links</h3>
            <p className="text-xs text-ink/60">Navigation links shown in the footer Explore column.</p>
          </div>
          <button
            type="button"
            onClick={addQuickLink}
            className="btn-primary text-xs shrink-0"
          >
            + Add Quick Link
          </button>
        </div>

        <div className="space-y-3">
          {(current.quickLinks || []).map((link, idx) => (
            <div key={link._id || idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl border border-line bg-[#fbf9f4] p-3 shadow-xs">
              <div className="w-20 shrink-0">
                <label className="block text-[10px] font-mono text-ink/50 uppercase font-semibold">Order #</label>
                <input
                  type="number"
                  className="field text-xs py-1.5 font-mono text-center"
                  placeholder="1"
                  value={link.order ?? (idx + 1)}
                  onChange={(e) => updateQuickLink(idx, 'order', Number(e.target.value))}
                />
              </div>
              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-[10px] font-mono text-ink/50 uppercase font-semibold">Label</label>
                <input
                  className="field text-xs py-1.5"
                  placeholder="Label (e.g. Products)"
                  value={link.label || ''}
                  onChange={(e) => updateQuickLink(idx, 'label', e.target.value)}
                />
              </div>
              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-[10px] font-mono text-ink/50 uppercase font-semibold">Destination URL</label>
                <input
                  className="field text-xs py-1.5 font-mono"
                  placeholder="Path (e.g. /products)"
                  value={link.to || ''}
                  onChange={(e) => updateQuickLink(idx, 'to', e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-4">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={link.isActive !== false}
                    onChange={(e) => updateQuickLink(idx, 'isActive', e.target.checked)}
                  />
                  <span>Active</span>
                </label>
                <button
                  type="button"
                  onClick={() => removeQuickLink(idx)}
                  className="rounded-lg p-1.5 text-clay hover:bg-clay/10 transition text-xs font-bold"
                  title="Remove link"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Copyright Text & Bottom Tagline */}
      <section className="rounded-2xl border border-line bg-white p-6 shadow-card space-y-4">
        <div className="border-b border-line pb-4">
          <h3 className="font-display font-bold text-lg text-ink">Copyright Line & Bottom Exporter Tagline</h3>
          <p className="text-xs text-ink/60">Bottom copyright text and exporter certification text displayed on the website footer.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label text-xs">Copyright Text</label>
            <input
              className="field"
              value={current.copyrightText || ''}
              onChange={(e) => updateField('copyrightText', e.target.value)}
              placeholder="Nirmala Multitrading Co. All rights reserved."
            />
          </div>
          <div>
            <label className="label text-xs">Bottom Tagline / Certification Text (Editable)</label>
            <input
              className="field"
              value={current.bottomTagline ?? 'Certified Indian Agro-Food Exporter'}
              onChange={(e) => updateField('bottomTagline', e.target.value)}
              placeholder="e.g. Certified Indian Agro-Food Exporter"
            />
            <p className="mt-1 text-[11px] text-ink/50">Displayed in bottom right corner of website footer.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function LoaderEditor({ section, setSection, onSave, busy }) {
  const [testingFullscreen, setTestingFullscreen] = useState(false);
  const current = {
    ...defaults.loader,
    ...(section || {}),
  };

  const updateField = (field, value) => {
    setSection({ ...current, [field]: value });
  };

  const previewLogoSrc = asset(current.logo || '/NMC logo.png');

  useEffect(() => {
    if (!testingFullscreen) return undefined;
    const durMs = Math.max(800, Math.min(10000, Math.round((Number(current.durationSeconds) || 2.5) * 1000)));
    const timer = setTimeout(() => {
      setTestingFullscreen(false);
    }, durMs);
    return () => clearTimeout(timer);
  }, [testingFullscreen, current.durationSeconds]);

  return (
    <div className="space-y-6">
      {/* Fullscreen interactive test overlay */}
      {testingFullscreen && (
        <div
          className="first-visit-loader cursor-pointer"
          role="dialog"
          aria-label="Fullscreen Loader Preview"
          onClick={() => setTestingFullscreen(false)}
        >
          <div className="first-visit-loader__content">
            {current.eyebrow && current.eyebrow.trim() !== '' && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-gold shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-ping" />
                <span>{current.eyebrow}</span>
              </div>
            )}
            <div className="first-visit-loader__logo-circle overflow-hidden relative">
              <img
                src={previewLogoSrc}
                alt={current.title || 'NMC'}
                className={`h-full w-full ${
                  current.imageFit === 'contain'
                    ? 'object-contain p-2.5'
                    : 'object-cover object-center'
                }`}
                onError={(e) => {
                  e.target.src = '/NMC logo.png';
                }}
              />
            </div>
            {current.title && current.title.trim() !== '' && (
              <h2 className="first-visit-loader__brand">
                {current.title}
              </h2>
            )}
            {current.tagline && current.tagline.trim() !== '' && (
              <p className="first-visit-loader__tagline">
                {current.tagline}
              </p>
            )}
            {current.subtitle && current.subtitle.trim() !== '' && (
              <p className="mt-2 text-xs sm:text-sm text-paper/80 font-sans max-w-sm leading-relaxed">
                {current.subtitle}
              </p>
            )}
            {current.showProgress !== false && (
              <div className="first-visit-loader__progress" aria-hidden="true">
                <span
                  style={{
                    animationDuration: `${Math.max(600, Math.round((Number(current.durationSeconds) || 2.5) * 1000) - 300)}ms`,
                  }}
                />
              </div>
            )}
            {current.statusText && current.statusText.trim() !== '' && (
              <p className="mt-2.5 text-[11px] font-mono tracking-wide text-paper/75">
                {current.statusText}
              </p>
            )}
            {current.badgeText && current.badgeText.trim() !== '' && (
              <div className="mt-4 font-mono text-[10px] uppercase tracking-wider text-paper/50">
                {current.badgeText}
              </div>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setTestingFullscreen(false);
              }}
              className="mt-6 text-xs text-paper/60 underline hover:text-white"
            >
              Click anywhere or press to exit test preview
            </button>
          </div>
        </div>
      )}

      <section className="rounded-2xl border border-line bg-white p-6 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
              First Visit & Page Transitions
            </span>
            <h2 className="mt-1 font-display text-xl font-bold text-ink">
              Brand Loader Screen Settings
            </h2>
            <p className="mt-1 text-xs text-ink/60">
              Customize the animated brand splash screen shown to visitors upon visiting the website.
            </p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setTestingFullscreen(true)}
              className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-gold/10 hover:border-gold transition-colors flex items-center gap-1.5 shadow-sm"
              title="Preview this loader animation in fullscreen"
            >
              <span>👁️</span> Test Fullscreen
            </button>
            <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer bg-forest/5 px-3 py-1.5 rounded-full border border-forest/20">
              <input
                type="checkbox"
                checked={current.isActive !== false}
                onChange={(e) => updateField('isActive', e.target.checked)}
              />
              <span>Active on Website</span>
            </label>
            {onSave && (
              <button
                type="button"
                onClick={onSave}
                disabled={busy}
                className="btn-primary text-xs py-2 px-4 shadow-sm"
              >
                {busy ? 'Saving…' : 'Save Loader Settings'}
              </button>
            )}
          </div>
        </div>

        {/* Live Visual Interactive Preview */}
        <div className="rounded-2xl border border-gold/30 bg-[#0d2118] p-8 text-center text-paper relative overflow-hidden shadow-xl">
          <span className="absolute top-3 left-3 text-[10px] font-mono font-bold uppercase text-gold bg-gold/15 px-2 py-0.5 rounded border border-gold/30">
            Live Preview

          </span>
          <div className="max-w-md mx-auto flex flex-col items-center">
            {current.eyebrow && (
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-gold">
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-ping" />
                <span>{current.eyebrow}</span>
              </div>
            )}
            <div className="w-24 h-24 rounded-full border-2 border-gold/60 shadow-lg overflow-hidden bg-[#f7f4ec] flex items-center justify-center p-0 mb-3">
              <img
                src={previewLogoSrc}
                alt="Logo"
                className={`w-full h-full ${current.imageFit === 'contain' ? 'object-contain p-2' : 'object-cover object-center'}`}
                onError={(e) => {
                  e.target.src = '/NMC logo.png';
                }}
              />
            </div>
            <h3 className="font-display font-black text-lg text-white leading-tight">
              {current.title || 'Nirmala Multitrading Co.'}
            </h3>
            <p className="text-xs font-semibold text-gold uppercase tracking-wider mt-1">
              {current.tagline || "India’s Taste. The World’s Table"}
            </p>
            {current.subtitle && (
              <p className="text-[11px] text-paper/75 mt-1 max-w-xs leading-relaxed">
                {current.subtitle}
              </p>
            )}
            {current.showProgress !== false && (
              <div className="w-44 h-1 bg-white/20 rounded-full mt-3 overflow-hidden">
                <div className="w-3/4 h-full bg-gradient-to-r from-gold to-yellow-200 rounded-full animate-pulse" />
              </div>
            )}
            {current.statusText && (
              <p className="mt-2 text-[10px] font-mono text-paper/70 tracking-wide">
                {current.statusText}
              </p>
            )}
            {current.badgeText && (
              <p className="mt-2 text-[9px] font-mono text-paper/50 tracking-wider">
                {current.badgeText}
              </p>
            )}
          </div>
        </div>

        {/* 1. Logo Image Upload & Background Fit Mode */}
        <div className="rounded-xl border border-line bg-[#fbf9f4] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-ink">1. Brand Logo / Splash Image</h3>
            {current.logo && current.logo !== '/NMC logo.png' && (
              <button
                type="button"
                onClick={() => updateField('logo', '/NMC logo.png')}
                className="text-xs text-clay hover:underline"
              >
                Reset to Default Logo
              </button>
            )}
          </div>

          <ImageUpload
            label="Upload Brand Logo or Emblematical Image"
            value={current.logo || ''}
            onChange={(url) => updateField('logo', url)}
          />

          <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-line/60">
            <div>
              <label className="label text-xs font-semibold">Image Display Fit</label>
              <select
                className="field text-xs font-semibold"
                value={current.imageFit || 'cover'}
                onChange={(e) => updateField('imageFit', e.target.value)}
              >
                <option value="cover">🖼️ Background Fit (Edge-to-Edge Cover)</option>
                <option value="contain">🔍 Contain (Preserve Padding)</option>
              </select>
              <p className="mt-1 text-[11px] text-ink/50">
                &quot;Background Fit&quot; fits the circular frame edge-to-edge with zero letterboxing.
              </p>
            </div>
            <div>
              <label className="label text-xs font-semibold">Loader Display Duration (Seconds)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="10"
                className="field text-xs font-mono"
                value={current.durationSeconds ?? 2.5}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                  updateField('durationSeconds', val);
                }}
              />
              <p className="mt-1 text-[11px] text-ink/50">
                Recommended: 2.0 to 3.0 seconds for optimal experience.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Editable Text Boxes */}
        <div className="rounded-xl border border-line bg-[#fbf9f4] p-5 space-y-4">
          <h3 className="font-display font-bold text-sm text-ink">2. Loader Typography & Custom Text Boxes</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label text-xs font-semibold">Top Eyebrow Pill Text</label>
              <input
                className="field text-xs"
                value={current.eyebrow || ''}
                onChange={(e) => updateField('eyebrow', e.target.value)}
                placeholder="e.g. Certified Indian Agro-Food Exporter"
              />
            </div>
            <div>
              <label className="label text-xs font-semibold">Main Brand Heading Title</label>
              <input
                className="field text-xs font-bold"
                value={current.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g. Nirmala Multitrading Co."
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label text-xs font-semibold">Tagline / Slogan (Gold Accent)</label>
              <input
                className="field text-xs font-semibold"
                value={current.tagline || ''}
                onChange={(e) => updateField('tagline', e.target.value)}
                placeholder="e.g. India’s Taste. The World’s Table"
              />
            </div>
            <div>
              <label className="label text-xs font-semibold">Loading Status / Progress Label</label>
              <input
                className="field text-xs"
                value={current.statusText || ''}
                onChange={(e) => updateField('statusText', e.target.value)}
                placeholder="e.g. Preparing Premium Consignments…"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label text-xs font-semibold">Bottom Accreditations / Badges Text</label>
              <input
                className="field text-xs font-mono"
                value={current.badgeText || ''}
                onChange={(e) => updateField('badgeText', e.target.value)}
                placeholder="e.g. APEDA • SPICE BOARD INDIA • FSSAI"
              />
            </div>
            <div>
              <label className="label text-xs font-semibold">Mission Subtitle / Description Text Box</label>
              <textarea
                className="field text-xs"
                rows="2"
                value={current.subtitle || ''}
                onChange={(e) => updateField('subtitle', e.target.value)}
                placeholder="e.g. Connecting Trusted Indian Agro-Food Products Globally"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-line/60">
            <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={current.showProgress !== false}
                onChange={(e) => updateField('showProgress', e.target.checked)}
              />
              <span>Display Synchronized Gold Progress Bar</span>
            </label>

            {onSave && (
              <button
                type="button"
                onClick={onSave}
                disabled={busy}
                className="btn-primary text-xs py-2 px-4 shadow-sm"
              >
                {busy ? 'Saving…' : 'Save Loader Settings'}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function FeaturedSectionEditor({ section, setSection }) {
  const current = section || defaults.featuredSection;
  const update = (k, v) => setSection({ ...current, [k]: v });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <label className="flex items-center gap-2 text-sm font-bold text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={current.isActive !== false}
            onChange={(e) => update('isActive', e.target.checked)}
          />
          <span>Enable / Show Featured Products Section on Home</span>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Eyebrow / Small Badge</label>
          <input
            className="field"
            value={current.eyebrow || ''}
            onChange={(e) => update('eyebrow', e.target.value)}
            placeholder="e.g. The next shipment"
          />
        </div>
        <div>
          <label className="label">Section Heading</label>
          <input
            className="field"
            value={current.title || ''}
            onChange={(e) => update('title', e.target.value)}
            placeholder="e.g. Featured product details"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Button / Link Text</label>
          <input
            className="field"
            value={current.linkText || ''}
            onChange={(e) => update('linkText', e.target.value)}
            placeholder="e.g. All product details →"
          />
        </div>
        <div>
          <label className="label">Button / Link Destination URL</label>
          <input
            className="field"
            value={current.linkTo || ''}
            onChange={(e) => update('linkTo', e.target.value)}
            placeholder="e.g. /product-details"
          />
        </div>
      </div>
    </div>
  );
}

function ExploreProductsEditor({ section, setSection }) {
  const current = section || defaults.exploreProductsSection;
  const update = (k, v) => setSection({ ...current, [k]: v });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <label className="flex items-center gap-2 text-sm font-bold text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={current.isActive !== false}
            onChange={(e) => update('isActive', e.target.checked)}
          />
          <span>Enable / Show Explore Products Section on Home</span>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Eyebrow / Badge</label>
          <input
            className="field"
            value={current.eyebrow || ''}
            onChange={(e) => update('eyebrow', e.target.value)}
            placeholder="e.g. Products"
          />
        </div>
        <div>
          <label className="label">Section Heading</label>
          <input
            className="field"
            value={current.title || ''}
            onChange={(e) => update('title', e.target.value)}
            placeholder="e.g. Explore our products"
          />
        </div>
      </div>

      <div>
        <label className="label">Section Description</label>
        <textarea
          className="field"
          rows="3"
          value={current.description || ''}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Brief intro for your products catalog..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">View All Link Text</label>
          <input
            className="field"
            value={current.linkText || ''}
            onChange={(e) => update('linkText', e.target.value)}
            placeholder="e.g. All products →"
          />
        </div>
        <div>
          <label className="label">View All Destination URL</label>
          <input
            className="field"
            value={current.linkTo || ''}
            onChange={(e) => update('linkTo', e.target.value)}
            placeholder="e.g. /products"
          />
        </div>
      </div>
    </div>
  );
}

function PartnersSectionEditor({ section, setSection }) {
  const current = section || defaults.partnersSection;
  const update = (k, v) => setSection({ ...current, [k]: v });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <label className="flex items-center gap-2 text-sm font-bold text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={current.isActive !== false}
            onChange={(e) => update('isActive', e.target.checked)}
          />
          <span>Enable / Show Partners Slider on Home</span>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Eyebrow / Small Badge</label>
          <input
            className="field"
            value={current.eyebrow || ''}
            onChange={(e) => update('eyebrow', e.target.value)}
            placeholder="e.g. Collaborations"
          />
        </div>
        <div>
          <label className="label">Section Heading</label>
          <input
            className="field"
            value={current.title || ''}
            onChange={(e) => update('title', e.target.value)}
            placeholder="e.g. Companies we work with"
          />
        </div>
      </div>

      <div>
        <label className="label">Section Description</label>
        <textarea
          className="field"
          rows="3"
          value={current.description || ''}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Brief intro for your partner network..."
        />
      </div>
    </div>
  );
}

function HomeCtaEditor({ section, setSection }) {
  const current = section || defaults.homeCta;
  const update = (k, v) => setSection({ ...current, [k]: v });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <label className="flex items-center gap-2 text-sm font-bold text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={current.isActive !== false}
            onChange={(e) => update('isActive', e.target.checked)}
          />
          <span>Enable / Show Bottom Inquiry Banner on Home</span>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Eyebrow / Small Badge</label>
          <input
            className="field"
            value={current.eyebrow ? current.eyebrow.replace(/\?+$/, '?') : ''}
            onChange={(e) => update('eyebrow', e.target.value.replace(/\?+$/, '?'))}
            placeholder="e.g. Ready to talk?"
          />
        </div>
        <div>
          <label className="label">Main Headline</label>
          <input
            className="field"
            value={current.title || ''}
            onChange={(e) => update('title', e.target.value)}
            placeholder="e.g. Tell us what you're buying — we'll send samples and pricing."
          />
        </div>
      </div>

      <div>
        <label className="label">Description / Subtitle</label>
        <textarea
          className="field"
          rows="3"
          value={current.description || ''}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Detailed call to action description..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Button Text</label>
          <input
            className="field"
            value={current.buttonText || ''}
            onChange={(e) => update('buttonText', e.target.value)}
            placeholder="e.g. Send an inquiry"
          />
        </div>
        <div>
          <label className="label">Button Destination Link</label>
          <input
            className="field"
            value={current.buttonLink || ''}
            onChange={(e) => update('buttonLink', e.target.value)}
            placeholder="e.g. /inquiry"
          />
        </div>
      </div>
    </div>
  );
}

function AboutCommitmentEditor({ section, setSection }) {
  const current = section || defaults.aboutCommitment;
  const update = (k, v) => setSection({ ...current, [k]: v });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <label className="flex items-center gap-2 text-sm font-bold text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={current.isActive !== false}
            onChange={(e) => update('isActive', e.target.checked)}
          />
          <span>Enable / Show Our Commitment Card on About Page</span>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Eyebrow / Small Badge</label>
          <input
            className="field"
            value={current.eyebrow || ''}
            onChange={(e) => update('eyebrow', e.target.value)}
            placeholder="e.g. Our Commitment"
          />
        </div>
        <div>
          <label className="label">Main Headline</label>
          <input
            className="field"
            value={current.title || ''}
            onChange={(e) => update('title', e.target.value)}
            placeholder="e.g. Transparent, Direct & Zero-Friction Exporting"
          />
        </div>
      </div>

      <div>
        <label className="label">Commitment Statement</label>
        <textarea
          className="field"
          rows="3"
          value={current.description || ''}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Detailed commitment text..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Primary Button Text</label>
          <input
            className="field"
            value={current.buttonPrimaryText || ''}
            onChange={(e) => update('buttonPrimaryText', e.target.value)}
            placeholder="e.g. Start a conversation"
          />
        </div>
        <div>
          <label className="label">Primary Button Link</label>
          <input
            className="field"
            value={current.buttonPrimaryLink || ''}
            onChange={(e) => update('buttonPrimaryLink', e.target.value)}
            placeholder="e.g. /inquiry?source=aboutConversation"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Secondary Button Text</label>
          <input
            className="field"
            value={current.buttonSecondaryText || ''}
            onChange={(e) => update('buttonSecondaryText', e.target.value)}
            placeholder="e.g. Browse Products"
          />
        </div>
        <div>
          <label className="label">Secondary Button Link</label>
          <input
            className="field"
            value={current.buttonSecondaryLink || ''}
            onChange={(e) => update('buttonSecondaryLink', e.target.value)}
            placeholder="e.g. /products"
          />
        </div>
      </div>
    </div>
  );
}

function AboutCtaEditor({ section, setSection }) {
  const current = section || defaults.aboutCta;
  const update = (k, v) => setSection({ ...current, [k]: v });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <label className="flex items-center gap-2 text-sm font-bold text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={current.isActive !== false}
            onChange={(e) => update('isActive', e.target.checked)}
          />
          <span>Enable / Show Bottom Call To Action on About Page</span>
        </label>
      </div>

      <div>
        <label className="label">Main Headline</label>
        <input
          className="field"
          value={current.title || ''}
          onChange={(e) => update('title', e.target.value)}
          placeholder="e.g. Looking for a specific food product?"
        />
      </div>

      <div>
        <label className="label">Description / Subtitle</label>
        <textarea
          className="field"
          rows="3"
          value={current.description || ''}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Detailed call to action description..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Primary Button Text</label>
          <input
            className="field"
            value={current.buttonPrimaryText || ''}
            onChange={(e) => update('buttonPrimaryText', e.target.value)}
            placeholder="e.g. Get in touch"
          />
        </div>
        <div>
          <label className="label">Primary Button Link</label>
          <input
            className="field"
            value={current.buttonPrimaryLink || ''}
            onChange={(e) => update('buttonPrimaryLink', e.target.value)}
            placeholder="e.g. /inquiry"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Secondary Button Text</label>
          <input
            className="field"
            value={current.buttonSecondaryText || ''}
            onChange={(e) => update('buttonSecondaryText', e.target.value)}
            placeholder="e.g. Download Line Cards"
          />
        </div>
        <div>
          <label className="label">Secondary Button Link</label>
          <input
            className="field"
            value={current.buttonSecondaryLink || ''}
            onChange={(e) => update('buttonSecondaryLink', e.target.value)}
            placeholder="e.g. /brochures"
          />
        </div>
      </div>
    </div>
  );
}

const BROCHURES_BADGE_COLORS = [
  { id: 'gold', label: 'Gold (Yellow)', bgClass: 'bg-gold', dotColor: '#d4af37' },
  { id: 'emerald', label: 'Emerald (Green)', bgClass: 'bg-emerald-400', dotColor: '#34d399' },
  { id: 'blue', label: 'Sky / Ocean Blue', bgClass: 'bg-blue-400', dotColor: '#60a5fa' },
  { id: 'amber', label: 'Amber / Orange', bgClass: 'bg-amber-400', dotColor: '#fbbf24' },
  { id: 'purple', label: 'Purple / Violet', bgClass: 'bg-purple-400', dotColor: '#c084fc' },
  { id: 'rose', label: 'Rose / Red', bgClass: 'bg-rose-400', dotColor: '#fb7185' },
  { id: 'teal', label: 'Teal / Cyan', bgClass: 'bg-teal-400', dotColor: '#2dd4bf' },
  { id: 'white', label: 'White / Silver', bgClass: 'bg-white', dotColor: '#ffffff' },
];

const DEFAULT_BROCHURE_BADGES = [
  { text: 'Verified Export Specs', color: 'gold', link: '' },
  { text: 'Direct PDF Downloads', color: 'emerald', link: '' },
  { text: 'Container Payload Data', color: 'blue', link: '' },
];

const DEFAULT_BUYER_ASSURANCE = {
  show: true,
  title: 'Buyer Assurance',
  badge: 'APEDA • ISO 22000',
  mediaType: 'none',
  image: '',
  video: '',
  mediaDisplay: 'cardScreen',
  mediaCaption: 'Live Export Cargo & Facility',
  footerLeft: 'Direct Seaport Loading',
  footerRight: 'Mundra & JNPT',
  items: [
    {
      icon: '📦',
      title: 'Container Payload Data',
      subtitle: '20ft (18-22 MT) • 40ft HC (28 MT)',
    },
    {
      icon: '🔬',
      title: '100% Sortex Optical Cleaning',
      subtitle: 'MRL < 0.01 Lab Assay Certified',
    },
    {
      icon: '⚡',
      title: 'Verified PDF Line Cards',
      subtitle: 'Instant Technical Specifications',
    },
  ],
};

function BrochuresHeroEditor({ section, setSection }) {
  const current = section || {};
  const update = (key, value) => {
    setSection({ ...current, [key]: value });
  };

  const rawSlides = Array.isArray(current.slides) ? current.slides : [];
  const slides = rawSlides;

  const updateSlides = (newSlides) => {
    update('slides', newSlides);
  };

  const updateSlideItem = (index, field, value) => {
    const copy = [...slides];
    copy[index] = { ...copy[index], [field]: value };
    updateSlides(copy);
  };

  const addSlide = (initialType = 'image') => {
    const newSlide = {
      type: initialType,
      image: '',
      video: '',
      eyebrow: '⚓ MUNDRA & JNPT PORTS • 40+ COUNTRIES',
      title: 'Export Product Catalogues & Line Cards',
      subtitle: 'Verified APEDA & FSSAI Standards',
      description: 'Download detailed export specifications, packing formats, HS codes, and container payload capacities in verified PDF format.',
      badge: 'Official Catalogues',
      primaryButtonText: 'Explore Product Segments ↓',
      primaryButtonLink: '#product-segments',
      secondaryButtonText: 'Request Custom Line Card ✉️',
      secondaryButtonLink: '/inquiry?subject=OfficialCatalogues',
      chips: ['🚢 FCL & LCL Consolidation', '🔬 Lab MRL < 0.01 Tested', '📦 Verified PDF Format'],
      isActive: true,
      order: slides.length + 1,
    };
    updateSlides([...slides, newSlide]);
  };

  const removeSlide = (index) => {
    const copy = slides.filter((_, idx) => idx !== index);
    updateSlides(copy);
  };

  const moveSlide = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= slides.length) return;
    const copy = [...slides];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    updateSlides(copy);
  };

  const rawBadges = Array.isArray(current.badges) && current.badges.length > 0
    ? current.badges
    : DEFAULT_BROCHURE_BADGES;

  const badges = rawBadges.map((b) =>
    typeof b === 'string'
      ? { text: b, color: 'gold', link: '' }
      : { text: b?.text || '', color: b?.color || 'gold', link: b?.link || '' }
  );

  const showBadges = current.showBadges !== false;

  const updateBadges = (newBadges) => {
    update('badges', newBadges);
  };

  const updateBadgeItem = (index, field, value) => {
    const copy = [...badges];
    copy[index] = { ...copy[index], [field]: value };
    updateBadges(copy);
  };

  const addBadge = () => {
    updateBadges([...badges, { text: 'New Trust Highlight', color: 'gold', link: '' }]);
  };

  const removeBadge = (index) => {
    const copy = badges.filter((_, idx) => idx !== index);
    updateBadges(copy);
  };

  const moveBadge = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= badges.length) return;
    const copy = [...badges];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    updateBadges(copy);
  };

  const resetToDefaults = () => {
    updateBadges([
      { text: 'Verified Export Specs', color: 'gold', link: '' },
      { text: 'Direct PDF Downloads', color: 'emerald', link: '' },
      { text: 'Container Payload Data', color: 'blue', link: '' },
    ]);
  };

  const getDotClass = (col) => {
    const found = BROCHURES_BADGE_COLORS.find((c) => c.id === col);
    return found ? found.bgClass : (col?.startsWith('bg-') ? col : 'bg-gold');
  };

  // Buyer Assurance Trust Card State & Helpers
  const buyerAssurance = current.buyerAssurance || DEFAULT_BUYER_ASSURANCE;
  const assuranceItems = Array.isArray(buyerAssurance.items) && buyerAssurance.items.length > 0
    ? buyerAssurance.items
    : DEFAULT_BUYER_ASSURANCE.items;

  const updateBuyerAssurance = (field, value) => {
    update('buyerAssurance', {
      ...buyerAssurance,
      [field]: value,
    });
  };

  const updateAssuranceItem = (index, field, value) => {
    const copy = [...assuranceItems];
    copy[index] = { ...copy[index], [field]: value };
    updateBuyerAssurance('items', copy);
  };

  const addAssuranceItem = () => {
    const newItem = {
      icon: '🛡️',
      title: 'New Buyer Specification',
      subtitle: 'Verified Export Cargo Compliance',
    };
    updateBuyerAssurance('items', [...assuranceItems, newItem]);
  };

  const removeAssuranceItem = (index) => {
    const copy = assuranceItems.filter((_, idx) => idx !== index);
    updateBuyerAssurance('items', copy);
  };

  const moveAssuranceItem = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= assuranceItems.length) return;
    const copy = [...assuranceItems];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    updateBuyerAssurance('items', copy);
  };

  const resetBuyerAssurance = () => {
    update('buyerAssurance', DEFAULT_BUYER_ASSURANCE);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Typography (Default Fallbacks) */}
      <div className="rounded-2xl border border-line bg-surface/30 p-5 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-moss">
          Global Default Eyebrow, Title & Summary (Fallback)
        </h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Eyebrow Tag</label>
            <input
              className="field"
              value={current.eyebrow || ''}
              onChange={(e) => update('eyebrow', e.target.value)}
              placeholder="Official Catalogues & Line Cards"
            />
          </div>
          <div>
            <label className="label">Hero Heading Title</label>
            <input
              className="field"
              value={current.title || ''}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Export Product Catalogues & Line Cards"
            />
          </div>
        </div>

        <div>
          <label className="label">Hero Description</label>
          <textarea
            className="field"
            rows="3"
            value={current.description || ''}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Download detailed export specifications, packing formats, HS codes..."
          />
        </div>
      </div>

      {/* 2. Brochures Hero Slider Management (Photos & Videos) */}
      <div className="rounded-2xl border border-line bg-white p-5 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">🎞️</span>
              <h4 className="font-display text-base font-bold text-ink">
                Full Hero Section Slider Management (Photos & Videos)
              </h4>
              <span className="rounded-full bg-gold/20 border border-gold/40 px-2.5 py-0.5 text-[11px] font-mono font-bold text-ink">
                {slides.length} {slides.length === 1 ? 'Slide' : 'Slides'}
              </span>
            </div>
            <p className="mt-1 text-xs text-ink/65">
              The entire hero banner operates as a luxury media slider. Each slide can have its own background photo or video, custom headline, description, CTA buttons, and spec chips.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => addSlide('image')}
              className="rounded-xl border border-line bg-[#fbf9f4] hover:bg-forest/10 hover:border-forest/30 text-ink px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>+ 🖼️ Add Photo Slide</span>
            </button>
            <button
              type="button"
              onClick={() => addSlide('video')}
              className="rounded-xl bg-forest hover:bg-[#0f241a] text-white px-3.5 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>+ 🎬 Add Video Slide</span>
            </button>
          </div>
        </div>

        {/* Slider Playback Settings */}
        <div className="rounded-xl border border-line/70 bg-[#faf8f4] p-3.5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <label className="flex items-center gap-2 font-semibold text-ink cursor-pointer">
            <input
              type="checkbox"
              checked={current.autoPlay !== false}
              onChange={(e) => update('autoPlay', e.target.checked)}
              className="rounded border-line text-forest focus:ring-forest cursor-pointer"
            />
            <span>Enable Auto-Rotate (Autoplay Slider)</span>
          </label>

          <div className="flex items-center gap-2 font-mono">
            <span className="text-ink/60">Slide Duration:</span>
            <input
              type="number"
              min="2"
              max="30"
              value={current.autoPlayInterval || 5}
              onChange={(e) => update('autoPlayInterval', Math.max(2, Number(e.target.value) || 5))}
              className="w-16 rounded-lg border border-line bg-white px-2 py-1 text-center font-bold text-ink outline-none focus:border-forest shadow-2xs"
            />
            <span className="text-ink/60">seconds</span>
          </div>
        </div>

        {/* Slides List */}
        {slides.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line p-8 text-center bg-[#fdfcf9] space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-gold text-2xl">
              🎞️
            </div>
            <h5 className="font-display text-sm font-bold text-ink">No Custom Slides Added Yet</h5>
            <p className="text-xs text-ink/60 max-w-md mx-auto">
              Add multiple slides to turn the hero showcase into an interactive photo/video slider, or use the single fallback media below.
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => addSlide('image')}
                className="btn-primary text-xs py-2 px-4 cursor-pointer shadow-sm"
              >
                + Add First Slide
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl border border-line bg-[#fdfcf9] p-4.5 transition hover:border-gold/50 hover:shadow-sm space-y-4"
              >
                {/* Slide Top Bar */}
                <div className="flex items-center justify-between border-b border-line/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-forest/10 font-mono text-xs font-bold text-forest">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-ink">
                      Slide #{idx + 1}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                        slide.type === 'video'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {slide.type === 'video' ? '🎬 Video Slide' : '🖼️ Photo Slide'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Active toggle */}
                    <label className="flex items-center gap-1.5 text-xs text-ink/70 mr-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={slide.isActive !== false}
                        onChange={(e) => updateSlideItem(idx, 'isActive', e.target.checked)}
                        className="rounded border-line text-forest"
                      />
                      <span>Active</span>
                    </label>

                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveSlide(idx, -1)}
                      className="h-7 w-7 rounded-lg border border-line bg-white hover:bg-forest/10 text-ink/70 hover:text-ink disabled:opacity-30 disabled:pointer-events-none transition flex items-center justify-center text-xs cursor-pointer"
                      title="Move Up"
                    >
                      ↑
                    </button>
                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={idx === slides.length - 1}
                      onClick={() => moveSlide(idx, 1)}
                      className="h-7 w-7 rounded-lg border border-line bg-white hover:bg-forest/10 text-ink/70 hover:text-ink disabled:opacity-30 disabled:pointer-events-none transition flex items-center justify-center text-xs cursor-pointer"
                      title="Move Down"
                    >
                      ↓
                    </button>
                    {/* Delete Slide */}
                    <button
                      type="button"
                      onClick={() => removeSlide(idx)}
                      className="h-7 px-2 rounded-lg border border-red-200 bg-red-50 text-clay hover:bg-red-100 transition text-xs font-bold flex items-center gap-1 cursor-pointer"
                      title="Delete Slide"
                    >
                      <span>🗑️</span>
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>

                {/* Media Type Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-ink/70">Slide Background Media:</span>
                  <div className="inline-flex rounded-xl border border-line p-0.5 bg-white shadow-2xs">
                    <button
                      type="button"
                      onClick={() => updateSlideItem(idx, 'type', 'image')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        slide.type !== 'video'
                          ? 'bg-forest text-white shadow-xs'
                          : 'text-ink/65 hover:text-ink'
                      }`}
                    >
                      <span>🖼️</span>
                      <span>Photo / Image</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSlideItem(idx, 'type', 'video')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        slide.type === 'video'
                          ? 'bg-forest text-white shadow-xs'
                          : 'text-ink/65 hover:text-ink'
                      }`}
                    >
                      <span>🎬</span>
                      <span>Video (MP4 / WebM)</span>
                    </button>
                  </div>
                </div>

                {/* Media Upload Area */}
                <div className="rounded-xl border border-line/70 bg-white p-3.5 space-y-3">
                  {slide.type === 'video' ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <VideoUpload
                        label={`Slide #${idx + 1} Background Video (MP4 / WebM)`}
                        value={slide.video || ''}
                        onChange={(url) => updateSlideItem(idx, 'video', url)}
                      />
                      <ImageUpload
                        label={`Slide #${idx + 1} Video Poster (Optional Thumbnail)`}
                        value={slide.image || ''}
                        onChange={(url) => updateSlideItem(idx, 'image', url)}
                      />
                    </div>
                  ) : (
                    <ImageUpload
                      label={`Slide #${idx + 1} Full Background Photo`}
                      value={slide.image || ''}
                      onChange={(url) => updateSlideItem(idx, 'image', url)}
                    />
                  )}
                </div>

                {/* Slide Text Overlays */}
                <div className="space-y-3 pt-2 border-t border-line/60">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="label">Eyebrow Pill Tag</label>
                      <input
                        className="field"
                        value={slide.eyebrow || ''}
                        onChange={(e) => updateSlideItem(idx, 'eyebrow', e.target.value)}
                        placeholder="e.g. ⚓ MUNDRA & JNPT PORTS • 40+ COUNTRIES"
                      />
                    </div>
                    <div>
                      <label className="label">Slide Heading / Title</label>
                      <input
                        className="field font-bold"
                        value={slide.title || ''}
                        onChange={(e) => updateSlideItem(idx, 'title', e.target.value)}
                        placeholder="e.g. Sortex Cleaned Spices & Agro Catalogues"
                      />
                    </div>
                    <div>
                      <label className="label">Corner Badge</label>
                      <input
                        className="field"
                        value={slide.badge || ''}
                        onChange={(e) => updateSlideItem(idx, 'badge', e.target.value)}
                        placeholder="e.g. Official Catalogues"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="label">Subtitle / Tagline</label>
                      <input
                        className="field"
                        value={slide.subtitle || ''}
                        onChange={(e) => updateSlideItem(idx, 'subtitle', e.target.value)}
                        placeholder="e.g. European & US FDA Purity Standards"
                      />
                    </div>
                    <div>
                      <label className="label">Slide Description</label>
                      <textarea
                        className="field"
                        rows="2"
                        value={slide.description || ''}
                        onChange={(e) => updateSlideItem(idx, 'description', e.target.value)}
                        placeholder="Download verified export specifications, packing formats, HS codes..."
                      />
                    </div>
                  </div>

                  {/* Buttons & Chips */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="label">Primary Button Text</label>
                        <input
                          className="field"
                          value={slide.primaryButtonText || ''}
                          onChange={(e) => updateSlideItem(idx, 'primaryButtonText', e.target.value)}
                          placeholder="Explore Product Segments ↓"
                        />
                      </div>
                      <div>
                        <label className="label">Primary Button Link</label>
                        <input
                          className="field font-mono"
                          value={slide.primaryButtonLink || ''}
                          onChange={(e) => updateSlideItem(idx, 'primaryButtonLink', e.target.value)}
                          placeholder="#product-segments"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="label">Secondary Button Text</label>
                        <input
                          className="field"
                          value={slide.secondaryButtonText || ''}
                          onChange={(e) => updateSlideItem(idx, 'secondaryButtonText', e.target.value)}
                          placeholder="Request Custom Line Card ✉️"
                        />
                      </div>
                      <div>
                        <label className="label">Secondary Button Link</label>
                        <input
                          className="field font-mono"
                          value={slide.secondaryButtonLink || ''}
                          onChange={(e) => updateSlideItem(idx, 'secondaryButtonLink', e.target.value)}
                          placeholder="/inquiry?subject=OfficialCatalogues"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="label">Spec Highlights / Badges (Comma-separated)</label>
                    <CommaSeparatedInput
                      className="field"
                      value={slide.chips}
                      placeholder="e.g. 🚢 FCL & LCL Consolidation, 🔬 Lab MRL < 0.01 Tested, 📦 Verified PDF Format"
                      onChange={(arr) => updateSlideItem(idx, 'chips', arr)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Fallback Single Media (Displayed if no slides added) */}
      <div className="rounded-2xl border border-line bg-surface/30 p-5 shadow-xs space-y-4">
        <div className="border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">📌</span>
            <h4 className="font-display text-base font-bold text-ink">
              Fallback Single Media (If No Slides Active)
            </h4>
          </div>
          <p className="mt-1 text-xs text-ink/65">
            Single feature photo or video used when slider items are not configured.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <ImageUpload
            label="Fallback Hero Image"
            value={current.image || ''}
            onChange={(url) => update('image', url)}
          />

          <VideoUpload
            label="Fallback Hero Video"
            value={current.video || ''}
            onChange={(url) => update('video', url)}
          />
        </div>
      </div>

      {/* 2. Hero Badges & Trust Highlights (Buttons) */}
      <div className="rounded-2xl border border-line bg-white p-5 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">🏷️</span>
              <h4 className="font-display text-base font-bold text-ink">
                Header Badges / Trust Highlights (Pills)
              </h4>
              <span className="rounded-full bg-forest/10 border border-forest/20 px-2 py-0.5 text-[11px] font-mono font-bold text-forest">
                {badges.length} items
              </span>
            </div>
            <p className="mt-1 text-xs text-ink/65">
              Customize the interactive pill badges shown below the description on the Brochures page.
            </p>
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-ink cursor-pointer bg-surface/50 border border-line px-3 py-1.5 rounded-xl hover:bg-surface transition">
            <input
              type="checkbox"
              checked={showBadges}
              onChange={(e) => update('showBadges', e.target.checked)}
              className="rounded border-line text-forest focus:ring-forest cursor-pointer"
            />
            <span>Show Badges on Page</span>
          </label>
        </div>

        {showBadges ? (
          <div className="space-y-4">
            {badges.map((badge, idx) => (
              <div
                key={idx}
                className="group relative rounded-xl border border-line/80 bg-[#fbf9f4] p-4 transition hover:border-gold/40 hover:bg-white shadow-xs"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-line/50">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-ink/50">#{idx + 1}</span>
                    {/* Live miniature pill */}
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#0d1e17] px-3 py-1 text-xs font-mono text-white/90 shadow-xs">
                      <span className={`h-2 w-2 rounded-full ${getDotClass(badge.color)}`} />
                      <span className="font-medium">{badge.text || 'Untitled'}</span>
                      {badge.link && <span className="text-[10px] text-white/50">↗</span>}
                    </div>
                  </div>

                  {/* Actions: Move Up, Move Down, Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveBadge(idx, -1)}
                      title="Move Up"
                      className="h-7 w-7 rounded-lg border border-line bg-white text-xs font-bold text-ink/70 hover:bg-surface hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center transition"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={idx === badges.length - 1}
                      onClick={() => moveBadge(idx, 1)}
                      title="Move Down"
                      className="h-7 w-7 rounded-lg border border-line bg-white text-xs font-bold text-ink/70 hover:bg-surface hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center transition"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeBadge(idx)}
                      title="Delete Badge"
                      className="h-7 w-7 rounded-lg border border-red-200 bg-red-50 text-xs font-bold text-red-600 hover:bg-red-100 cursor-pointer flex items-center justify-center transition ml-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-12">
                  {/* Badge Text */}
                  <div className="sm:col-span-5">
                    <label className="text-[11px] font-bold text-ink/70 mb-1 block">
                      Badge Text / Label <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="field h-9 text-xs"
                      value={badge.text}
                      onChange={(e) => updateBadgeItem(idx, 'text', e.target.value)}
                      placeholder="e.g. Verified Export Specs"
                    />
                  </div>

                  {/* Dot Indicator Color */}
                  <div className="sm:col-span-3">
                    <label className="text-[11px] font-bold text-ink/70 mb-1 block">
                      Dot Color
                    </label>
                    <div className="relative">
                      <select
                        className="field h-9 text-xs pl-8 pr-6"
                        value={badge.color}
                        onChange={(e) => updateBadgeItem(idx, 'color', e.target.value)}
                      >
                        {BROCHURES_BADGE_COLORS.map((col) => (
                          <option key={col.id} value={col.id}>
                            {col.label}
                          </option>
                        ))}
                      </select>
                      <span
                        className={`pointer-events-none absolute left-3 top-3 h-3 w-3 rounded-full ${getDotClass(badge.color)} shadow-xs`}
                      />
                    </div>
                  </div>

                  {/* Optional URL / Link */}
                  <div className="sm:col-span-4">
                    <label className="text-[11px] font-bold text-ink/70 mb-1 block">
                      Click Link <span className="font-normal text-ink/40">(Optional)</span>
                    </label>
                    <input
                      className="field h-9 text-xs"
                      value={badge.link || ''}
                      onChange={(e) => updateBadgeItem(idx, 'link', e.target.value)}
                      placeholder="e.g. #downloads, /inquiry"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Bottom control buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={addBadge}
                className="btn-primary h-9 px-4 text-xs font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span className="text-base leading-none">+</span>
                <span>Add Badge / Button</span>
              </button>

              <button
                type="button"
                onClick={resetToDefaults}
                className="text-xs font-semibold text-ink/60 hover:text-ink underline cursor-pointer transition"
              >
                ↺ Reset to 3 Default Badges
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-line bg-surface/30 p-6 text-center text-xs text-ink/50">
            Badges are currently disabled. Check the toggle above to enable and edit them.
          </div>
        )}
      </div>

      {/* 4. Buyer Assurance Trust Card (Hero Right Widget / Small Screen) */}
      <div className="rounded-2xl border border-line bg-white p-5 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">🛡️</span>
              <h4 className="font-display text-base font-bold text-ink">
                Buyer Assurance Trust Card (Hero Right Widget / Small Screen)
              </h4>
              <span className="rounded-full bg-gold/20 border border-gold/40 px-2.5 py-0.5 text-[11px] font-mono font-bold text-ink">
                {assuranceItems.length} Points
              </span>
            </div>
            <p className="mt-1 text-xs text-ink/65">
              Customize the floating trust verification card displayed on the right side of the Brochures hero section (card title, accreditation tag, specification points, and port tags).
            </p>
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-ink cursor-pointer bg-surface/50 border border-line px-3 py-1.5 rounded-xl hover:bg-surface transition">
            <input
              type="checkbox"
              checked={buyerAssurance.show !== false}
              onChange={(e) => updateBuyerAssurance('show', e.target.checked)}
              className="rounded border-line text-forest focus:ring-forest cursor-pointer"
            />
            <span>Show Card on Page</span>
          </label>
        </div>

        {buyerAssurance.show !== false ? (
          <div className="space-y-5">
            {/* Top Card Settings: Title & Badge */}
            <div className="grid gap-4 sm:grid-cols-2 rounded-xl border border-line/70 bg-[#faf8f4] p-4">
              <div>
                <label className="label">Card Header Title</label>
                <input
                  className="field"
                  value={buyerAssurance.title || ''}
                  onChange={(e) => updateBuyerAssurance('title', e.target.value)}
                  placeholder="Buyer Assurance"
                />
              </div>
              <div>
                <label className="label">Accreditation Tag / Badge</label>
                <input
                  className="field font-mono"
                  value={buyerAssurance.badge || ''}
                  onChange={(e) => updateBuyerAssurance('badge', e.target.value)}
                  placeholder="APEDA • ISO 22000"
                />
              </div>
            </div>

            {/* Small Screen Media Settings (Photo & Video) */}
            <div className="rounded-xl border border-line/70 bg-[#faf8f4] p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line/50 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">📺</span>
                    <h5 className="text-xs font-bold text-ink uppercase tracking-wider">
                      Small Screen Media (Photo / Video Display)
                    </h5>
                  </div>
                  <p className="mt-0.5 text-[11px] text-ink/65">
                    Add a facility video, cargo loading drone clip, or high-res product photo into this small screen widget.
                  </p>
                </div>

                {/* Media Type Buttons */}
                <div className="flex items-center gap-1 bg-white border border-line rounded-lg p-1 text-xs font-semibold shadow-2xs">
                  <button
                    type="button"
                    onClick={() => updateBuyerAssurance('mediaType', 'none')}
                    className={`px-2.5 py-1 rounded transition cursor-pointer ${
                      buyerAssurance.mediaType === 'none' || (!buyerAssurance.mediaType && !buyerAssurance.image && !buyerAssurance.video)
                        ? 'bg-ink text-white font-bold'
                        : 'text-ink/70 hover:bg-surface'
                    }`}
                  >
                    No Media
                  </button>
                  <button
                    type="button"
                    onClick={() => updateBuyerAssurance('mediaType', 'image')}
                    className={`px-2.5 py-1 rounded transition cursor-pointer flex items-center gap-1 ${
                      buyerAssurance.mediaType === 'image' || (!buyerAssurance.mediaType && buyerAssurance.image && !buyerAssurance.video)
                        ? 'bg-forest text-white font-bold'
                        : 'text-ink/70 hover:bg-surface'
                    }`}
                  >
                    <span>🖼️</span> Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => updateBuyerAssurance('mediaType', 'video')}
                    className={`px-2.5 py-1 rounded transition cursor-pointer flex items-center gap-1 ${
                      buyerAssurance.mediaType === 'video' || (!buyerAssurance.mediaType && buyerAssurance.video)
                        ? 'bg-forest text-white font-bold'
                        : 'text-ink/70 hover:bg-surface'
                    }`}
                  >
                    <span>🎬</span> Video
                  </button>
                </div>
              </div>

              {/* Upload controls when media is enabled */}
              {(buyerAssurance.mediaType === 'image' ||
                buyerAssurance.mediaType === 'video' ||
                (!buyerAssurance.mediaType && (buyerAssurance.image || buyerAssurance.video))) && (
                <div className="space-y-4 pt-1">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Video Upload if video mode */}
                    {(buyerAssurance.mediaType === 'video' || (!buyerAssurance.mediaType && buyerAssurance.video)) && (
                      <VideoUpload
                        label="Small Screen Video (MP4 / WebM)"
                        value={buyerAssurance.video || ''}
                        onChange={(url) => {
                          updateBuyerAssurance('video', url);
                          if (url && buyerAssurance.mediaType !== 'video') {
                            updateBuyerAssurance('mediaType', 'video');
                          }
                        }}
                      />
                    )}

                    {/* Image / Poster Upload */}
                    <ImageUpload
                      label={
                        buyerAssurance.mediaType === 'video'
                          ? 'Video Poster / Fallback Image'
                          : 'Small Screen Photo'
                      }
                      value={buyerAssurance.image || ''}
                      onChange={(url) => {
                        updateBuyerAssurance('image', url);
                        if (url && buyerAssurance.mediaType === 'none') {
                          updateBuyerAssurance('mediaType', 'image');
                        }
                      }}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Media Display Style */}
                    <div>
                      <label className="text-[11px] font-bold text-ink/70 mb-1 block">
                        Media Display Style in Card
                      </label>
                      <select
                        className="field text-xs h-9"
                        value={buyerAssurance.mediaDisplay || 'cardScreen'}
                        onChange={(e) => updateBuyerAssurance('mediaDisplay', e.target.value)}
                      >
                        <option value="cardScreen">📺 Mini Screen Window (Above Specifications)</option>
                        <option value="background">🌌 Card Backdrop (Plays Behind Text)</option>
                      </select>
                    </div>

                    {/* Media Caption / Tag */}
                    <div>
                      <label className="text-[11px] font-bold text-ink/70 mb-1 block">
                        Screen Tag / Caption Label
                      </label>
                      <input
                        className="field text-xs h-9 font-mono"
                        value={buyerAssurance.mediaCaption || ''}
                        onChange={(e) => updateBuyerAssurance('mediaCaption', e.target.value)}
                        placeholder="Live Export Cargo & Facility"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* List of Assurance Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink uppercase tracking-wider">
                  Assurance Specification Points ({assuranceItems.length})
                </span>
                <span className="text-[11px] text-ink/50">
                  Icons, titles, and technical payload details
                </span>
              </div>

              {assuranceItems.map((item, idx) => (
                <div
                  key={idx}
                  className="group rounded-xl border border-line/80 bg-[#fbf9f4] p-4 transition hover:border-gold/40 hover:bg-white shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-line/50 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-ink/50">#{idx + 1}</span>
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/15 text-gold text-sm border border-gold/20">
                        {item.icon || '✓'}
                      </span>
                      <span className="font-bold text-xs text-ink">{item.title || 'Untitled Point'}</span>
                    </div>

                    {/* Actions: Move Up, Move Down, Delete */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveAssuranceItem(idx, -1)}
                        title="Move Up"
                        className="h-7 w-7 rounded-lg border border-line bg-white text-xs font-bold text-ink/70 hover:bg-surface disabled:opacity-30 cursor-pointer flex items-center justify-center"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        disabled={idx === assuranceItems.length - 1}
                        onClick={() => moveAssuranceItem(idx, 1)}
                        title="Move Down"
                        className="h-7 w-7 rounded-lg border border-line bg-white text-xs font-bold text-ink/70 hover:bg-surface disabled:opacity-30 cursor-pointer flex items-center justify-center"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeAssuranceItem(idx)}
                        title="Delete Item"
                        className="h-7 w-7 rounded-lg border border-red-200 bg-red-50 text-xs font-bold text-red-600 hover:bg-red-100 cursor-pointer flex items-center justify-center ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-12">
                    {/* Icon selection */}
                    <div className="sm:col-span-3">
                      <label className="text-[11px] font-bold text-ink/70 mb-1 block">Icon / Emoji</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          className="field h-9 text-xs text-center font-bold w-12 shrink-0"
                          value={item.icon || ''}
                          onChange={(e) => updateAssuranceItem(idx, 'icon', e.target.value)}
                          placeholder="📦"
                        />
                        {/* Quick Icon suggestions */}
                        <div className="flex flex-wrap items-center gap-1">
                          {['📦', '🔬', '⚡', '🚢', '🛡️', '📋', '🌾', '✅'].map((ico) => (
                            <button
                              key={ico}
                              type="button"
                              onClick={() => updateAssuranceItem(idx, 'icon', ico)}
                              className="h-7 w-7 rounded border border-line/60 bg-white hover:bg-gold/15 text-xs transition cursor-pointer flex items-center justify-center"
                              title={`Set icon to ${ico}`}
                            >
                              {ico}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="sm:col-span-4">
                      <label className="text-[11px] font-bold text-ink/70 mb-1 block">
                        Title / Specification <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="field h-9 text-xs"
                        value={item.title || ''}
                        onChange={(e) => updateAssuranceItem(idx, 'title', e.target.value)}
                        placeholder="Container Payload Data"
                      />
                    </div>

                    {/* Subtitle */}
                    <div className="sm:col-span-5">
                      <label className="text-[11px] font-bold text-ink/70 mb-1 block">
                        Subtitle / Specifications Details
                      </label>
                      <input
                        className="field h-9 text-xs font-mono"
                        value={item.subtitle || ''}
                        onChange={(e) => updateAssuranceItem(idx, 'subtitle', e.target.value)}
                        placeholder="20ft (18-22 MT) • 40ft HC (28 MT)"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-1">
                <button
                  type="button"
                  onClick={addAssuranceItem}
                  className="rounded-xl border border-dashed border-forest/40 bg-forest/5 hover:bg-forest/10 text-forest px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>+ Add Specification Point</span>
                </button>
              </div>
            </div>

            {/* Footer Row Settings */}
            <div className="rounded-xl border border-line/70 bg-[#faf8f4] p-4 space-y-3">
              <h5 className="text-xs font-bold text-ink uppercase tracking-wider">
                Card Bottom Footer Tags
              </h5>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Footer Left Text</label>
                  <input
                    className="field font-mono text-xs"
                    value={buyerAssurance.footerLeft || ''}
                    onChange={(e) => updateBuyerAssurance('footerLeft', e.target.value)}
                    placeholder="Direct Seaport Loading"
                  />
                </div>
                <div>
                  <label className="label">Footer Right Text (Highlighted)</label>
                  <input
                    className="field font-mono text-xs text-gold font-bold"
                    value={buyerAssurance.footerRight || ''}
                    onChange={(e) => updateBuyerAssurance('footerRight', e.target.value)}
                    placeholder="Mundra & JNPT"
                  />
                </div>
              </div>
            </div>

            {/* Reset button */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={resetBuyerAssurance}
                className="text-xs font-semibold text-ink/60 hover:text-ink underline cursor-pointer transition"
              >
                ↺ Reset Buyer Assurance Card to Defaults
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-line bg-surface/30 p-6 text-center text-xs text-ink/50">
            Buyer Assurance widget is currently hidden on the public Brochure page. Check the toggle above to enable and edit it.
          </div>
        )}
      </div>

      {/* 5. Live Full Hero Slider & Buyer Assurance Preview */}
      <div className="rounded-2xl border border-line bg-surface/50 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-moss">
              Full Hero Slider & Trust Card Live Preview
            </span>
            <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
              Instant Sync
            </span>
          </div>
          <span className="text-[11px] font-mono text-ink/40">
            Preview of /brochures full hero
          </span>
        </div>

        {/* Full-bleed hero banner container */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-950/80 bg-[#091610] text-paper shadow-2xl min-h-[360px] sm:min-h-[420px] flex items-center">
          {/* Active slide media preview */}
          {(() => {
            const activeSlide = slides.length > 0 ? (slides[0] || {}) : {};
            const mediaType = activeSlide.type || (current.video ? 'video' : 'image');
            const videoUrl = activeSlide.video || current.video;
            const imageUrl = activeSlide.image || current.image;

            return (
              <>
                {/* Background media */}
                {mediaType === 'video' && videoUrl ? (
                  <div className="absolute inset-0 w-full h-full bg-black overflow-hidden pointer-events-none">
                    <video
                      src={asset(videoUrl)}
                      poster={imageUrl ? asset(imageUrl) : undefined}
                      className="w-full h-full object-cover opacity-60"
                      muted
                      autoPlay
                      loop
                    />
                  </div>
                ) : imageUrl ? (
                  <div className="absolute inset-0 w-full h-full bg-black overflow-hidden pointer-events-none">
                    <img
                      src={asset(imageUrl)}
                      alt="Preview"
                      className="w-full h-full object-cover opacity-60"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#12241b] via-[#0d1e17] to-[#1a382c] opacity-90" />
                )}

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#07130e]/95 via-[#07130e]/75 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07130e] via-transparent to-black/40 pointer-events-none" />

                {/* Foreground content grid */}
                <div className="relative z-10 p-6 sm:p-8 w-full grid lg:grid-cols-12 gap-6 items-center">
                  <div className={buyerAssurance.show !== false ? "lg:col-span-8" : "lg:col-span-12"}>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 border border-gold/40 px-3 py-0.5 font-mono text-[10px] font-bold text-gold">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold animate-ping" />
                        {activeSlide.eyebrow || current.eyebrow || 'Official Catalogues & Line Cards'}
                      </span>
                      {(activeSlide.badge || 'Official Specs') && (
                        <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[10px] text-white/90 border border-white/15">
                          ★ {activeSlide.badge || 'Official Specs'}
                        </span>
                      )}
                      <span className="rounded-full bg-black/60 px-2 py-0.5 font-mono text-[9px] font-bold text-paper/70 border border-white/10">
                        {mediaType === 'video' ? '🎬 VIDEO' : '🖼️ PHOTO'}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                      {activeSlide.title || current.title || 'Export Product Catalogues & Line Cards'}
                    </h3>

                    {(activeSlide.subtitle) && (
                      <p className="mt-1 text-gold font-mono text-xs font-semibold">
                        {activeSlide.subtitle}
                      </p>
                    )}

                    <p className="mt-3 text-xs sm:text-sm leading-relaxed text-paper/80 line-clamp-3">
                      {activeSlide.description ||
                        current.description ||
                        'Download detailed export specifications, packing formats, HS codes, and container payload capacities in verified PDF format.'}
                    </p>

                    {/* Buttons mockup */}
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        className="btn-primary text-[11px] py-2 px-4 shadow-md font-bold pointer-events-none"
                      >
                        {activeSlide.primaryButtonText || 'Explore Product Segments ↓'}
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-white/20 bg-white/10 px-3.5 py-2 text-[11px] font-semibold text-white pointer-events-none"
                      >
                        {activeSlide.secondaryButtonText || 'Request Custom Line Card ✉️'}
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Live Buyer Assurance Preview Card */}
                  {buyerAssurance.show !== false && (() => {
                    const hasMedia =
                      (buyerAssurance.mediaType === 'video' && buyerAssurance.video) ||
                      (buyerAssurance.mediaType === 'image' && buyerAssurance.image) ||
                      (!buyerAssurance.mediaType && (buyerAssurance.video || buyerAssurance.image));
                    const isVideo =
                      buyerAssurance.mediaType === 'video' || (!buyerAssurance.mediaType && buyerAssurance.video);

                    return (
                      <div className="lg:col-span-4">
                        <div className="rounded-2xl border border-white/20 bg-black/60 backdrop-blur-xl p-4.5 text-paper shadow-2xl relative overflow-hidden">
                          {/* Background Media if set to background */}
                          {hasMedia && buyerAssurance.mediaDisplay === 'background' && (
                            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                              {isVideo ? (
                                <video
                                  src={asset(buyerAssurance.video)}
                                  poster={buyerAssurance.image ? asset(buyerAssurance.image) : undefined}
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                  className="w-full h-full object-cover opacity-25"
                                />
                              ) : (
                                <img
                                  src={asset(buyerAssurance.image)}
                                  alt="Card preview"
                                  className="w-full h-full object-cover opacity-25"
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
                            </div>
                          )}

                          <div className="relative z-10">
                            {/* Card Header */}
                            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                              <span className="font-mono text-[10px] font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                {buyerAssurance.title || 'Buyer Assurance'}
                              </span>
                              <span className="font-mono text-[10px] text-paper/60">
                                {buyerAssurance.badge || 'APEDA • ISO 22000'}
                              </span>
                            </div>

                            {/* Mini Screen Media Player Window */}
                            {hasMedia && buyerAssurance.mediaDisplay !== 'background' && (
                              <div className="mt-2.5 relative rounded-xl overflow-hidden border border-white/20 bg-black/80 aspect-video max-h-32 flex items-center justify-center">
                                {isVideo ? (
                                  <video
                                    src={asset(buyerAssurance.video)}
                                    poster={buyerAssurance.image ? asset(buyerAssurance.image) : undefined}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <img
                                    src={asset(buyerAssurance.image)}
                                    alt="Small screen preview"
                                    className="w-full h-full object-cover"
                                  />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
                                <div className="absolute top-1.5 left-2 z-10 flex items-center gap-1.5 rounded-full bg-black/70 px-2 py-0.5 border border-white/20">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  <span className="font-mono text-[9px] font-bold text-white uppercase">
                                    {buyerAssurance.mediaCaption || (isVideo ? 'LIVE VIDEO' : 'PHOTO SPEC')}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Specification Points */}
                            <div className="mt-3 space-y-2 text-xs">
                              {assuranceItems.map((item, itIdx) => (
                                <div key={itIdx} className="flex items-center gap-2 text-paper/90">
                                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gold/15 text-gold text-xs shrink-0 border border-gold/20">
                                    {item.icon || '✓'}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-bold text-white leading-none text-xs truncate">
                                      {item.title}
                                    </p>
                                    <p className="text-[10px] text-paper/60 font-mono mt-0.5 truncate">
                                      {item.subtitle}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Card Footer */}
                            {(buyerAssurance.footerLeft || buyerAssurance.footerRight) && (
                              <div className="mt-3.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-paper/60">
                                <span>{buyerAssurance.footerLeft}</span>
                                <span className="text-gold font-bold">{buyerAssurance.footerRight}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Bottom slide counter pill */}
                <div className="absolute bottom-3 right-4 z-20 flex items-center gap-2 rounded-full bg-black/80 px-3 py-1 font-mono text-[10px] text-gold border border-white/15 backdrop-blur-md">
                  <span>{slides.length > 0 ? `${slides.length} Slides Active` : '1 Default Slide'}</span>
                  <span className="text-paper/40">•</span>
                  <span>{current.autoPlay !== false ? `Autoplay (${current.autoPlayInterval || 5}s)` : 'Manual'}</span>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

function PartnersPageEditor({ section, setSection }) {
  const current = section || {};
  const update = (key, value) => {
    setSection({ ...current, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-line bg-surface/40 p-4">
        <h4 className="font-semibold text-ink text-sm mb-3">Top Header / Eyebrow</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Eyebrow Tag</label>
            <input
              className="field"
              value={current.eyebrow || ''}
              onChange={(e) => update('eyebrow', e.target.value)}
              placeholder="Collaborations"
            />
          </div>
          <div>
            <label className="label">Page Heading Title</label>
            <input
              className="field"
              value={current.title || ''}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Companies we work with"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="label">Header Description</label>
          <textarea
            className="field"
            rows="2"
            value={current.description || ''}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Trusted Indian agricultural growers, mills, and food manufacturing enterprises..."
          />
        </div>
      </div>

      <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
        <h4 className="font-semibold text-ink text-sm mb-3">Supplier Onboarding CTA Banner (Bottom of Partners Page)</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Banner Eyebrow</label>
            <input
              className="field"
              value={current.bannerEyebrow || ''}
              onChange={(e) => update('bannerEyebrow', e.target.value)}
              placeholder="Supplier & Producer Onboarding"
            />
          </div>
          <div>
            <label className="label">Banner Title</label>
            <input
              className="field"
              value={current.bannerTitle || ''}
              onChange={(e) => update('bannerTitle', e.target.value)}
              placeholder="Expand Your Food Products Worldwide with NMC"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="label">Banner Description</label>
          <textarea
            className="field"
            rows="3"
            value={current.bannerDescription || ''}
            onChange={(e) => update('bannerDescription', e.target.value)}
            placeholder="Are you an Indian food manufacturer, miller, farmer producer organization (FPO)..."
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Primary CTA Button Text</label>
            <input
              className="field"
              value={current.bannerButtonText || ''}
              onChange={(e) => update('bannerButtonText', e.target.value)}
              placeholder="Become a Partner Form →"
            />
          </div>
          <div>
            <label className="label">Primary CTA Button Link</label>
            <input
              className="field"
              value={current.bannerButtonLink || ''}
              onChange={(e) => update('bannerButtonLink', e.target.value)}
              placeholder="/become-a-partner"
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Secondary Button Text</label>
            <input
              className="field"
              value={current.bannerSecondaryText || ''}
              onChange={(e) => update('bannerSecondaryText', e.target.value)}
              placeholder="Contact Procurement Desk"
            />
          </div>
          <div>
            <label className="label">Secondary Button Link</label>
            <input
              className="field"
              value={current.bannerSecondaryLink || ''}
              onChange={(e) => update('bannerSecondaryLink', e.target.value)}
              placeholder="/inquiry"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_BLOG_CMS_BADGES = [
  { text: 'Market Trade Intelligence', color: 'gold', link: '' },
  { text: 'Verified Agro Harvest Trends', color: 'emerald', link: '' },
  { text: 'Global Export Logistics', color: 'blue', link: '' },
];

function BlogHeroEditor({ section, setSection }) {
  const current = section || {};
  const update = (key, value) => {
    setSection({ ...current, [key]: value });
  };

  const rawBadges = Array.isArray(current.badges) && current.badges.length > 0
    ? current.badges
    : DEFAULT_BLOG_CMS_BADGES;

  const badges = rawBadges.map((b) =>
    typeof b === 'string'
      ? { text: b, color: 'gold', link: '' }
      : { text: b?.text || '', color: b?.color || 'gold', link: b?.link || '' }
  );

  const showBadges = current.showBadges !== false;

  const updateBadges = (newBadges) => {
    update('badges', newBadges);
  };

  const updateBadgeItem = (index, field, value) => {
    const copy = [...badges];
    copy[index] = { ...copy[index], [field]: value };
    updateBadges(copy);
  };

  const addBadge = () => {
    updateBadges([...badges, { text: 'New Market Highlight', color: 'gold', link: '' }]);
  };

  const removeBadge = (index) => {
    const copy = badges.filter((_, idx) => idx !== index);
    updateBadges(copy);
  };

  const moveBadge = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= badges.length) return;
    const copy = [...badges];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    updateBadges(copy);
  };

  const getDotClass = (col) => {
    const found = BROCHURES_BADGE_COLORS.find((c) => c.id === col);
    return found ? found.bgClass : (col?.startsWith('bg-') ? col : 'bg-gold');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Typography */}
      <div className="rounded-2xl border border-line bg-surface/30 p-5 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-moss">
          Top Eyebrow, Title & Summary
        </h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Eyebrow Tag</label>
            <input
              className="field"
              value={current.eyebrow || ''}
              onChange={(e) => update('eyebrow', e.target.value)}
              placeholder="Media & Market Insights"
            />
          </div>
          <div>
            <label className="label">Hero Heading Title</label>
            <input
              className="field"
              value={current.title || ''}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Global Agro Export Blog & Market Insights"
            />
          </div>
        </div>

        <div>
          <label className="label">Hero Description</label>
          <textarea
            className="field"
            rows="3"
            value={current.description || ''}
            onChange={(e) => update('description', e.target.value)}
            placeholder="In-depth global market intelligence, harvest cycles, commodity price trends..."
          />
        </div>
      </div>

      {/* 2. Blog Hero Media (Image & Video) */}
      <div className="rounded-2xl border border-line bg-white p-5 shadow-xs space-y-4">
        <div className="border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">🎬</span>
            <h4 className="font-display text-base font-bold text-ink">
              Blog Page Featured Media (Image & Video)
            </h4>
          </div>
          <p className="mt-1 text-xs text-ink/65">
            Add a feature image and/or promotional / documentary showcase video (MP4 / WebM) displayed on the Blog page header.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <ImageUpload
            label="Blog Page Feature Image"
            value={current.image || ''}
            onChange={(url) => update('image', url)}
          />

          <VideoUpload
            label="Blog Page Showcase Video (MP4 / WebM)"
            value={current.video || ''}
            onChange={(url) => update('video', url)}
          />
        </div>
      </div>

      {/* 3. Hero Badges & Trust Highlights */}
      <div className="rounded-2xl border border-line bg-white p-5 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">🏷️</span>
              <h4 className="font-display text-base font-bold text-ink">
                Header Badges / Trade Highlights (Pills)
              </h4>
              <span className="rounded-full bg-forest/10 border border-forest/20 px-2 py-0.5 text-[11px] font-mono font-bold text-forest">
                {badges.length} items
              </span>
            </div>
            <p className="mt-1 text-xs text-ink/65">
              Customize the interactive pill badges shown below the description on the Blog header.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer bg-forest/5 px-3 py-1.5 rounded-lg border border-forest/20">
              <input
                type="checkbox"
                checked={showBadges}
                onChange={(e) => update('showBadges', e.target.checked)}
              />
              Show Badges on Page
            </label>
            <button
              type="button"
              onClick={addBadge}
              className="btn-primary text-xs py-1.5 px-3 shadow-xs inline-flex items-center gap-1 cursor-pointer"
            >
              <span>+ Add Badge</span>
            </button>
          </div>
        </div>

        {showBadges && (
          <div className="space-y-3">
            {badges.map((b, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-xl border border-line bg-paper/50 p-3"
              >
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-xs text-ink/40 w-5">#{idx + 1}</span>
                  <select
                    className="text-xs rounded-lg border border-line bg-white px-2 py-1.5 font-medium"
                    value={b.color || 'gold'}
                    onChange={(e) => updateBadgeItem(idx, 'color', e.target.value)}
                  >
                    {BROCHURES_BADGE_COLORS.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 grid gap-2 sm:grid-cols-2">
                  <input
                    className="field text-xs py-1.5"
                    placeholder="Badge Text"
                    value={b.text || ''}
                    onChange={(e) => updateBadgeItem(idx, 'text', e.target.value)}
                  />
                  <input
                    className="field text-xs py-1.5 font-mono"
                    placeholder="Optional Link (e.g. /products, #)"
                    value={b.link || ''}
                    onChange={(e) => updateBadgeItem(idx, 'link', e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-end gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveBadge(idx, -1)}
                    disabled={idx === 0}
                    className="h-7 w-7 rounded border border-line bg-white text-xs text-ink/70 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBadge(idx, 1)}
                    disabled={idx === badges.length - 1}
                    className="h-7 w-7 rounded border border-line bg-white text-xs text-ink/70 disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBadge(idx)}
                    className="h-7 px-2 rounded border border-red-200 bg-red-50 text-xs text-clay hover:bg-red-100"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Live Preview with 16:9 Cinema Box */}
      <div className="rounded-2xl border border-line bg-surface/40 p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-line pb-2">
          <div className="flex items-center gap-2">
            <span className="font-display text-xs font-bold uppercase tracking-wider text-ink">
              Live Cinema Header Preview
            </span>
            <span className="rounded-full bg-emerald-100 border border-emerald-300 px-2 py-0.5 text-[10px] font-mono text-emerald-800 font-bold">
              Instant Sync
            </span>
          </div>
          <span className="text-[11px] font-mono text-ink/40">
            Preview of /blog hero
          </span>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-emerald-950/80 bg-[#0d1e17] p-6 text-paper shadow-inner">
          <div className="pointer-events-none absolute -left-16 -top-16 h-36 w-36 rounded-full bg-forest/30 blur-2xl" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-36 w-36 rounded-full bg-gold/15 blur-2xl" />

          <div className="relative grid gap-6 md:grid-cols-12 items-center">
            <div className="md:col-span-7">
              <span className="eyebrow text-gold text-xs font-bold uppercase tracking-wider block">
                {current.eyebrow || 'Media & Market Insights'}
              </span>
              <h3 className="mt-2 font-display text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                {current.title || 'Global Agro Export Blog & Market Insights'}
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-paper/75">
                {current.description ||
                  'In-depth global market intelligence, harvest cycles, commodity price trends...'}
              </p>

              {/* Live Badges */}
              {showBadges && badges.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center gap-2.5 text-xs font-mono text-paper/70">
                  {badges.map((b, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 backdrop-blur border border-white/5 text-[11px]"
                    >
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${getDotClass(b.color)}`} />
                      <span>{b.text || 'Untitled'}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-5">
              <div className="relative rounded-2xl bg-white/10 p-1.5 border border-white/20 shadow-lg">
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black/80 flex items-center justify-center border border-gold/30">
                  {current.video ? (
                    <video
                      src={asset(current.video)}
                      poster={current.image ? asset(current.image) : undefined}
                      className="h-full w-full object-cover"
                      muted
                    />
                  ) : current.image ? (
                    <img
                      src={asset(current.image)}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-3 text-paper/50 font-mono text-[11px]">
                      <span>No media set yet</span>
                    </div>
                  )}
                  {(current.video || current.image) && (
                    <span className="absolute top-2 right-2 rounded-full bg-black/70 px-2 py-0.5 font-mono text-[9px] font-bold text-gold border border-gold/30 backdrop-blur">
                      {current.video ? '🎬 16:9 Video' : '🖼️ 16:9 Image'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ManageSiteContent() {
  const [content, setContent] = useState(clone(defaults));
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'home_hero';
  const [tab, setTabState] = useState(initialTab);
  const [sectionSearch, setSectionSearch] = useState('');

  // Sync tab with URL search parameter
  const setTab = (newTab) => {
    setTabState(newTab);
    const next = new URLSearchParams(searchParams);
    next.set('tab', newTab);
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    const urlTab = searchParams.get('tab');
    if (urlTab && urlTab !== tab) {
      setTabState(urlTab);
    }
  }, [searchParams]);

  // Keyboard shortcut Ctrl+S or Cmd+S to save
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content]);

  useEffect(() => {
    api
      .get('/site-content')
      .then((r) => {
        setContent({ ...clone(defaults), ...r.data });
        try {
          window.localStorage.setItem('nmc_site_content_cache', JSON.stringify(r.data));
        } catch {}
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const payload = { ...content };
      if (payload.loader) {
        const dSec = parseFloat(payload.loader.durationSeconds);
        payload.loader = {
          ...payload.loader,
          durationSeconds: isNaN(dSec) || dSec <= 0 ? 2.5 : dSec,
        };
      }
      const r = await api.put('/site-content', payload);
      setContent(r.data);
      try {
        window.localStorage.setItem('nmc_site_content_cache', JSON.stringify(r.data));
      } catch {}
      setMessage('✓ Data is successfully updated in MongoDB!');
      window.dispatchEvent(new Event('site-content-updated'));
      setTimeout(() => setMessage(''), 6000);
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Failed to save content in MongoDB.';
      setError('✗ Error: ' + msg);
      setTimeout(() => setError(''), 8000);
    } finally {
      setBusy(false);
    }
  };

  const setSection = (key, value) => setContent({ ...content, [key]: value });

  if (loading) return <p className="text-sm text-ink/60 p-8">Loading site content…</p>;

  // Sub-section sidebar grouping
  const navSections = [
    {
      group: 'Header, Footer & Loader',
      icon: '🎨',
      items: [
        { id: 'header_cms', label: 'Header, Logo & Favicon', icon: '🔝', badge: 'Editable' },
        { id: 'footer_cms', label: 'Footer & Company Info', icon: '🔻', badge: 'Editable' },
        { id: 'loader_cms', label: 'Brand Loader Screen', icon: '⏳', badge: 'Editable' },
      ],
    },
    {
      group: 'Home Page',
      icon: '🏠',
      items: [
        { id: 'home_hero', label: 'Hero Video & Ad Slider', icon: '🎬', badge: 'Editable' },
        { id: 'featured_section', label: 'Featured Products Heading', icon: '⭐', badge: 'Editable' },
        { id: 'explore_products', label: 'Explore Products Section', icon: '🌾', badge: 'Editable' },
        { id: 'new_arrivals', label: 'New Product Arrivals', icon: '🌟', badge: 'Editable' },
        { id: 'partners_section', label: 'Partners & Collaborations', icon: '🤝', badge: 'Editable' },
        { id: 'engineer_trade', label: 'Engineer High Volume Trade', icon: '🚢', badge: 'New' },
        { id: 'home_offerings', label: 'What We Offer', icon: '📦' },
        { id: 'home_how_we_work', label: 'How We Work (3 Steps)', icon: '🔄' },
        { id: 'home_cta', label: 'Home Bottom Inquiry Banner', icon: '📞', badge: 'Editable' },
      ],
    },
    {
      group: 'Trade Corridors',
      icon: '🗺️',
      items: [
        { id: 'map', label: 'Global Export Map & Hubs', icon: '🌐' },
      ],
    },
    {
      group: 'Quality & Compliance',
      icon: '🏅',
      items: [
        { id: 'certificates', label: 'International Certifications', icon: '📜' },
      ],
    },
    {
      group: 'Marketing & Leads',
      icon: '📢',
      items: [
        { id: 'flashcard', label: 'Flash Card / Promo Popup', icon: '⚡' },
        { id: 'testimonials', label: 'Client Feedback & Reviews', icon: '💬' },
      ],
    },
    {
      group: 'Site Pages',
      icon: '📄',
      items: [
        { id: 'products_page', label: 'Products Page CMS', icon: '🛍️', badge: 'Editable' },
        { id: 'about', label: 'About Us Page Content', icon: '🏢' },
        { id: 'inquiry', label: 'Inquiry & Quote Header', icon: '✉️' },
        { id: 'brochures_cms', label: 'Brochures Page Header', icon: '📑', badge: 'Editable' },
        { id: 'partners_page_cms', label: 'Partners Page & CTA', icon: '🤝', badge: 'Editable' },
        { id: 'blog_cms', label: 'Blog / News Header', icon: '📰', badge: 'Editable' },
      ],
    },
    {
      group: 'AI Assistant',
      icon: '🤖',
      items: [
        { id: 'chatbot', label: 'TradeMitra Chatbot & Q&A', icon: '💬', badge: 'Editable' },
      ],
    },
  ];

  // Filter sections based on search query
  const q = sectionSearch.trim().toLowerCase();
  const filteredNavSections = !q
    ? navSections
    : navSections
        .map((sec) => ({
          ...sec,
          items: sec.items.filter(
            (item) =>
              item.label.toLowerCase().includes(q) ||
              sec.group.toLowerCase().includes(q)
          ),
        }))
        .filter((sec) => sec.items.length > 0);

  // Active section item
  const currentSectionItem = navSections
    .flatMap((s) => s.items)
    .find((i) => i.id === tab);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-24">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line/80 pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-extrabold text-ink">Site Content CMS</h1>
            <span className="rounded-full bg-gold/20 border border-gold/40 px-2.5 py-0.5 text-xs font-mono font-bold text-ink">
              {navSections.flatMap((s) => s.items).length} Sections
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-ink/65">
            Configure dynamic homepage sections, high-volume trade capabilities, global map, certificates, brand loader, and popups.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary h-9.5 px-4 text-xs font-bold shadow-sm inline-flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto"
          onClick={save}
          disabled={busy}
        >
          <span>{busy ? '⏳' : '💾'}</span>
          <span>{busy ? 'Saving Changes…' : 'Save all changes'}</span>
        </button>
      </div>

      {message && <p className="rounded-xl bg-forest/10 p-3.5 text-sm font-semibold text-forest border border-forest/20 animate-in fade-in">{message}</p>}
      {error && <p className="rounded-xl bg-clay/10 p-3.5 text-sm font-semibold text-clay border border-clay/20 animate-in fade-in">{error}</p>}

      {/* Mobile / Tablet Section Quick Navigator (< lg screens) */}
      <div className="lg:hidden w-full rounded-2xl border border-line bg-white p-4 shadow-card space-y-3">
        <label className="label text-xs font-bold uppercase tracking-wider text-moss flex items-center justify-between">
          <span>Navigate CMS Section</span>
          <span className="font-mono text-[10px] text-ink/40">Select to Jump</span>
        </label>
        <select
          value={tab}
          onChange={(e) => setTab(e.target.value)}
          className="field text-sm font-semibold cursor-pointer"
        >
          {navSections.map((sec) => (
            <optgroup key={sec.group} label={`${sec.icon} ${sec.group}`}>
              {sec.items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.icon} {item.label} {item.badge ? `(${item.badge})` : ''}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Two Column Layout: Sticky Sub-section Sidebar (Desktop) + Content Editor Canvas */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Left Sub-Section Sidebar (Desktop) */}
        <aside className="hidden lg:block w-76 shrink-0 lg:sticky lg:top-4 bg-white rounded-2xl border border-line p-4 sm:p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-ink/40 font-bold">
              CMS Sections
            </p>
            <span className="text-[10px] font-mono text-ink/40">
              {currentSectionItem?.label}
            </span>
          </div>

          {/* Search box for CMS sections */}
          <div className="relative">
            <input
              type="text"
              value={sectionSearch}
              onChange={(e) => setSectionSearch(e.target.value)}
              placeholder="Filter sections (e.g. loader)…"
              className="w-full h-9 rounded-xl border border-line bg-[#fbf9f4] px-3 pl-8 text-xs text-ink placeholder-ink/40 focus:border-gold focus:bg-white focus:outline-hidden"
            />
            <span className="absolute left-2.5 top-2.5 text-xs text-ink/40 pointer-events-none">🔍</span>
            {sectionSearch && (
              <button
                type="button"
                onClick={() => setSectionSearch('')}
                className="absolute right-2.5 top-2 text-xs text-ink/40 hover:text-ink cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto no-scrollbar pr-0.5">
            {filteredNavSections.map((sec) => (
              <div key={sec.group} className="space-y-1">
                <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold text-moss uppercase tracking-wider">
                  <span>{sec.icon}</span>
                  <span>{sec.group}</span>
                </div>

                <div className="space-y-0.5">
                  {sec.items.map((item) => {
                    const isActive = tab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setTab(item.id)}
                        className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-forest text-white shadow-sm font-bold border-l-4 border-gold'
                            : 'text-ink/75 hover:bg-[#fbf9f4] hover:text-ink'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-sm leading-none">{item.icon}</span>
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                            isActive ? 'bg-gold text-ink' : 'bg-gold/25 text-amber-900 border border-gold/40'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredNavSections.length === 0 && (
              <p className="px-2 py-4 text-center text-xs text-ink/40">
                No sections match &quot;{sectionSearch}&quot;
              </p>
            )}
          </div>
        </aside>


        {/* Right Main Editor Canvas */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          {/* HEADER & NAVBAR CMS (EDITABLE) */}
          {tab === 'header_cms' && (
            <HeaderEditor
              section={content.header}
              setSection={(v) => setSection('header', v)}
            />
          )}

          {/* FOOTER & COMPANY INFO CMS (EDITABLE) */}
          {tab === 'footer_cms' && (
            <FooterEditor
              section={content.footer}
              setSection={(v) => setSection('footer', v)}
            />
          )}

          {/* BRAND LOADER SCREEN CMS (EDITABLE) */}
          {tab === 'loader_cms' && (
            <LoaderEditor
              section={content.loader}
              setSection={(v) => setSection('loader', v)}
              onSave={save}
              busy={busy}
            />
          )}

          {/* 1. HOME HERO */}
          {tab === 'home_hero' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                  Home Section 1 • Video Commercials & Hero
                </span>
                <h2 className="mt-2 font-display text-xl font-bold text-ink">Home — Hero Video & Ad Slider</h2>
                <p className="mt-1 text-xs text-ink/60">
                  Manage the first screen of the website: Action buttons (&quot;Browse products&quot; &amp; &quot;Get a quote&quot;), video ad commercial slides, feature chips (&quot;Nitrogen Flush Freshness&quot;, etc.), bottom dock tabs (&quot;Ad 01: Spices&quot;, etc.), and commercial badge pills.
                </p>
              </div>
              <HomeHeroEditor section={content.homeHero} setSection={(v) => setSection('homeHero', v)} />
            </section>
          )}

          {/* FEATURED PRODUCTS HEADING CMS */}
          {tab === 'featured_section' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                  Home Section 2
                </span>
                <h2 className="mt-2 font-display text-xl font-bold text-ink">
                  Featured Products Section Heading
                </h2>
                <p className="mt-1 text-xs text-ink/60">
                  Configure the eyebrow, main headline, and link button for the featured product cards on the Home page.
                </p>
              </div>
              <FeaturedSectionEditor
                section={content.featuredSection}
                setSection={(v) => setSection('featuredSection', v)}
              />
            </section>
          )}

          {/* EXPLORE PRODUCTS CMS */}
          {tab === 'explore_products' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                  Home Section 4
                </span>
                <h2 className="mt-2 font-display text-xl font-bold text-ink">
                  Explore Our Products Section
                </h2>
                <p className="mt-1 text-xs text-ink/60">
                  Configure the eyebrow, headline, intro paragraph, and &quot;All products&quot; link for the 3-category interactive cards on the Home page.
                </p>
              </div>
              <ExploreProductsEditor
                section={content.exploreProductsSection}
                setSection={(v) => setSection('exploreProductsSection', v)}
              />
            </section>
          )}

          {/* NEW PRODUCT ARRIVALS (EDITABLE) */}
          {tab === 'new_arrivals' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                  Seasonal Trade Arrivals
                </span>
                <h2 className="mt-2 font-display text-xl font-bold text-ink">
                  New Product Arrivals Section
                </h2>
                <p className="mt-1 text-xs text-ink/60">
                  Manage the auto-rotating homepage carousel, headlines, harvest year badge, timer, and featured export consignment cards.
                </p>
              </div>
              <NewArrivalsEditor
                section={content.newArrivals}
                setSection={(v) => setSection('newArrivals', v)}
              />
            </section>
          )}

          {/* PARTNERS SECTION CMS */}
          {tab === 'partners_section' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                  Home Section 6
                </span>
                <h2 className="mt-2 font-display text-xl font-bold text-ink">
                  Companies We Work With (Partners Slider)
                </h2>
                <p className="mt-1 text-xs text-ink/60">
                  Configure the eyebrow, headline, and description for the infinite partner logo slider on the Home page.
                </p>
              </div>
              <PartnersSectionEditor
                section={content.partnersSection}
                setSection={(v) => setSection('partnersSection', v)}
              />
            </section>
          )}

          {/* 2. ENGINEER HIGH VOLUME TRADE (NEW REQUIREMENT) */}
          {tab === 'engineer_trade' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                  Wholesale & Industrial Operations
                </span>
                <h2 className="mt-2 font-display text-xl font-bold text-ink">
                  Engineer High-Volume Trade Section
                </h2>
                <p className="mt-1 text-xs text-ink/60">
                  Configure large-scale container consolidation, Sortex cleaning, optical grading, and international laboratory compliance features.
                </p>
              </div>
              <EngineerTradeEditor
                section={content.engineerTrade}
                setSection={(v) => setSection('engineerTrade', v)}
              />
            </section>
          )}

          {/* 3. WHAT WE OFFER */}
          {tab === 'home_offerings' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <h2 className="font-display text-xl font-bold text-ink">Home — What We Offer</h2>
                <p className="mt-1 text-xs text-ink/60">Manage market-specific packaging, private labeling, and export coordination points.</p>
              </div>
              <ItemEditor section={content.homeOfferings} setSection={(v) => setSection('homeOfferings', v)} />
            </section>
          )}

          {/* 4. HOW WE WORK */}
          {tab === 'home_how_we_work' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <h2 className="font-display text-xl font-bold text-ink">Home — How We Work (3-Step Export Bridge)</h2>
                <p className="mt-1 text-xs text-ink/60">Manage the three steps connecting Indian growers to global buyers.</p>
              </div>
              <ItemEditor section={content.homeHowWeWork} setSection={(v) => setSection('homeHowWeWork', v)} />
            </section>
          )}

          {/* HOME BOTTOM CTA CMS */}
          {tab === 'home_cta' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                  Home Section 9
                </span>
                <h2 className="mt-2 font-display text-xl font-bold text-ink">
                  Home — Bottom Inquiry CTA Banner
                </h2>
                <p className="mt-1 text-xs text-ink/60">
                  Configure the headline, description, button label and link for the final conversion banner on the Home page.
                </p>
              </div>
              <HomeCtaEditor
                section={content.homeCta}
                setSection={(v) => setSection('homeCta', v)}
              />
            </section>
          )}

          {/* 5. GLOBAL EXPORT MAP */}
          {tab === 'map' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <h2 className="font-display text-xl font-bold text-ink">Global Export Map & Ports</h2>
                <p className="mt-1 text-xs text-ink/60">Customize active export corridors (USA, UK, Europe, Norway, GCC, Asia), ports, and transit duration.</p>
              </div>
              <MapEditor section={content.globalMap} setSection={(v) => setSection('globalMap', v)} />
            </section>
          )}

          {/* 6. CERTIFICATES */}
          {tab === 'certificates' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <h2 className="font-display text-xl font-bold text-ink">Certificates & Accreditations</h2>
                <p className="mt-1 text-xs text-ink/60">Manage FSSAI, APEDA, ISO 22000, HACCP, GMP, GHP, ASTA, and custom regulatory seals.</p>
              </div>
              <CertificatesEditor section={content.certificates} setSection={(v) => setSection('certificates', v)} />
            </section>
          )}

          {/* 7. FLASH CARD MODAL */}
          {tab === 'flashcard' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <h2 className="font-display text-xl font-bold text-ink">First-Visit Flash Card / Promo Popup</h2>
                <p className="mt-1 text-xs text-ink/60">Customize the promotional announcement card shown to visitors right after the brand loader finishes.</p>
              </div>
              <FlashCardEditor
                section={content.flashCard}
                setSection={(v) => setSection('flashCard', v)}
              />
            </section>
          )}

          {/* 8. TESTIMONIALS */}
          {tab === 'testimonials' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <h2 className="font-display text-xl font-bold text-ink">Client Feedback & Testimonials</h2>
                <p className="mt-1 text-xs text-ink/60">Manage verified international buyer reviews and import testimonials.</p>
              </div>
              <ItemEditor section={content.testimonials} setSection={(v) => setSection('testimonials', v)} image />
            </section>
          )}

          {/* PRODUCTS PAGE CMS */}
          {tab === 'products_page' && (
            <ProductsPageEditor
              section={content.productsPage}
              setSection={(v) => setSection('productsPage', v)}
              onSave={save}
              isSaving={busy}
            />
          )}

          {/* 9. ABOUT PAGE */}
          {tab === 'about' && (
            <div className="space-y-6">
              <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
                <h2 className="font-display text-lg font-bold text-ink">About Page — Hero Header</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Eyebrow</label>
                    <input
                      className="field"
                      value={content.aboutHero?.eyebrow || ''}
                      onChange={(e) => setSection('aboutHero', { ...content.aboutHero, eyebrow: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Heading</label>
                    <input
                      className="field"
                      value={content.aboutHero?.title || ''}
                      onChange={(e) => setSection('aboutHero', { ...content.aboutHero, title: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="label">Description</label>
                  <textarea
                    className="field"
                    rows="3"
                    value={content.aboutHero?.description || ''}
                    onChange={(e) => setSection('aboutHero', { ...content.aboutHero, description: e.target.value })}
                  />
                </div>

                <div className="mt-5 border-t border-line/60 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <label className="label mb-0 font-bold text-ink">Hero Badges & Credentials (Image 3)</label>
                      <p className="text-xs text-ink/60">Badges displayed directly below description in About Us hero.</p>
                    </div>
                    <button
                      type="button"
                      className="btn-primary text-xs py-1"
                      onClick={() => {
                        const badges = Array.isArray(content.aboutHero?.badges)
                          ? [...content.aboutHero.badges]
                          : ['✓ APEDA & Spice Board Registered', '✓ Port Direct Mundra & JNPT', '✓ 40+ Destination Ports'];
                        badges.push('✓ New Highlight Badge');
                        setSection('aboutHero', { ...content.aboutHero, badges });
                      }}
                    >
                      + Add Badge
                    </button>
                  </div>
                  <div className="space-y-2 mt-3">
                    {(Array.isArray(content.aboutHero?.badges)
                      ? content.aboutHero.badges
                      : ['✓ APEDA & Spice Board Registered', '✓ Port Direct Mundra & JNPT', '✓ 40+ Destination Ports']
                    ).map((badge, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <input
                          className="field text-sm"
                          value={badge}
                          placeholder="e.g. ✓ APEDA & Spice Board Registered"
                          onChange={(e) => {
                            const currentBadges = Array.isArray(content.aboutHero?.badges)
                              ? [...content.aboutHero.badges]
                              : ['✓ APEDA & Spice Board Registered', '✓ Port Direct Mundra & JNPT', '✓ 40+ Destination Ports'];
                            currentBadges[bIdx] = e.target.value;
                            setSection('aboutHero', { ...content.aboutHero, badges: currentBadges });
                          }}
                        />
                        <button
                          type="button"
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                          onClick={() => {
                            const currentBadges = Array.isArray(content.aboutHero?.badges)
                              ? [...content.aboutHero.badges]
                              : ['✓ APEDA & Spice Board Registered', '✓ Port Direct Mundra & JNPT', '✓ 40+ Destination Ports'];
                            setSection('aboutHero', {
                              ...content.aboutHero,
                              badges: currentBadges.filter((_, idx) => idx !== bIdx),
                            });
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
                <h2 className="font-display text-lg font-bold text-ink">About — Our Approach</h2>
                <div className="mt-4">
                  <ItemEditor section={content.aboutApproach} setSection={(v) => setSection('aboutApproach', v)} image side />
                </div>
              </section>

              <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
                <h2 className="font-display text-lg font-bold text-ink">About — Why Choose Us</h2>
                <div className="mt-4">
                  <ItemEditor section={content.aboutWhyChooseUs} setSection={(v) => setSection('aboutWhyChooseUs', v)} />
                </div>
              </section>

              <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
                <div className="border-b border-line pb-4 mb-4">
                  <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                    About Section 3
                  </span>
                  <h2 className="mt-2 font-display text-lg font-bold text-ink">About — Our Commitment Card</h2>
                  <p className="text-xs text-ink/60">Manage the transparent exporting commitment statement and dual action buttons.</p>
                </div>
                <AboutCommitmentEditor
                  section={content.aboutCommitment}
                  setSection={(v) => setSection('aboutCommitment', v)}
                />
              </section>

              <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
                <div className="border-b border-line pb-4 mb-4">
                  <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                    About Section 7
                  </span>
                  <h2 className="mt-2 font-display text-lg font-bold text-ink">About — Bottom Call To Action Banner</h2>
                  <p className="text-xs text-ink/60">Configure the final conversion block and line card buttons on the About page.</p>
                </div>
                <AboutCtaEditor
                  section={content.aboutCta}
                  setSection={(v) => setSection('aboutCta', v)}
                />
              </section>
            </div>
          )}

          {/* 10. INQUIRY PAGE */}
          {tab === 'inquiry' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-4">
                <h2 className="font-display text-lg font-bold text-ink">Inquiry & Quotation Page Header</h2>
                <p className="text-xs text-ink/60">Customize the contact and quotation request header text.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Eyebrow</label>
                  <input
                    className="field"
                    value={content.inquiryHero?.eyebrow || ''}
                    onChange={(e) => setSection('inquiryHero', { ...content.inquiryHero, eyebrow: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Heading</label>
                  <input
                    className="field"
                    value={content.inquiryHero?.title || ''}
                    onChange={(e) => setSection('inquiryHero', { ...content.inquiryHero, title: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="label">Description</label>
                <textarea
                  className="field"
                  rows="3"
                  value={content.inquiryHero?.description || ''}
                  onChange={(e) => setSection('inquiryHero', { ...content.inquiryHero, description: e.target.value })}
                />
              </div>
            </section>
          )}

          {/* BROCHURES PAGE CMS */}
          {tab === 'brochures_cms' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                  Brochures Page Header
                </span>
                <h2 className="mt-2 font-display text-xl font-bold text-ink">
                  Brochures & Line Cards Page CMS
                </h2>
                <p className="mt-1 text-xs text-ink/65">
                  Customize the eyebrow tag, title, description, and trust highlight buttons/badges displayed at the top of the official export catalog & PDF download page.
                </p>
              </div>
              <BrochuresHeroEditor
                section={content.brochuresHero}
                setSection={(v) => setSection('brochuresHero', v)}
              />
            </section>
          )}

          {/* PARTNERS PAGE CMS */}
          {tab === 'partners_page_cms' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                  Partners Page CMS
                </span>
                <h2 className="mt-2 font-display text-xl font-bold text-ink">
                  Partners Page Header & Supplier Onboarding Banner
                </h2>
                <p className="mt-1 text-xs text-ink/60">
                  Control the page heading, intro text, and the high-conversion supplier onboarding CTA banner at the bottom of the Partners page.
                </p>
              </div>
              <PartnersPageEditor
                section={content.partnersPage}
                setSection={(v) => setSection('partnersPage', v)}
              />
            </section>
          )}

          {/* BLOG HERO CMS */}
          {tab === 'blog_cms' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                  Blog / News Header
                </span>
                <h2 className="mt-2 font-display text-xl font-bold text-ink">
                  Blog & Articles Page CMS
                </h2>
                <p className="mt-1 text-xs text-ink/60">
                  Customize the eyebrow, page heading, and introductory description for the trade articles and news page.
                </p>
              </div>
              <BlogHeroEditor
                section={content.blogHero}
                setSection={(v) => setSection('blogHero', v)}
              />
            </section>
          )}

          {/* 11. CHATBOT KNOWLEDGE & PROFILE */}
          {tab === 'chatbot' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                  AI Website Assistant
                </span>
                <h2 className="mt-2 font-display text-xl font-bold text-ink">
                  TradeMitra Chatbot & Knowledge Base
                </h2>
                <p className="mt-1 text-xs text-ink/60">
                  Manage bot display identity, welcome greeting, suggested chips, and export Q&A topics. Confidential internal data is strictly shielded.
                </p>
              </div>
              <ChatbotEditor
                section={content.chatbot}
                setSection={(v) => setSection('chatbot', v)}
              />
            </section>
          )}

          {/* Bottom Save Action Bar for Site Content CMS */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-line bg-gradient-to-r from-white via-[#fbf9f4] to-white p-5 shadow-card mt-8">
            <div>
              <h4 className="font-display font-bold text-sm text-ink">Publish Website Changes</h4>
              <p className="text-xs text-ink/60">
                Click to save all section modifications to MongoDB. Changes take effect immediately across all website pages.
              </p>
            </div>
            <button className="btn-primary flex items-center gap-2" onClick={save} disabled={busy}>
              <span>{busy ? '⏳' : '💾'}</span>
              <span>{busy ? 'Saving Changes…' : 'Save all changes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bottom Quick Save Toolbar (Always visible while scrolling) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-xl rounded-2xl border border-line/80 bg-white/95 backdrop-blur-md px-4 py-3 shadow-2xl flex items-center justify-between gap-4 animate-in slide-in-from-bottom">
        <div className="flex items-center gap-2 min-w-0">
          <span className="h-2 w-2 rounded-full bg-gold animate-ping shrink-0" />
          <span className="text-xs text-ink truncate font-medium">
            Active: <strong className="text-forest font-bold">{currentSectionItem?.label}</strong>
          </span>
          <span className="hidden sm:inline font-mono text-[10px] text-ink/40">(Ctrl+S)</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className="btn-primary text-xs py-1.5 px-3.5 shadow-sm flex items-center gap-1.5"
          >
            <span>{busy ? '⏳' : '💾'}</span>
            <span>{busy ? 'Saving…' : 'Save all changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}


