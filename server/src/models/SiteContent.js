import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    video: { type: String, default: '' },
    icon: { type: String, default: '' },
    order: { type: Number, default: 0 },
    side: { type: String, enum: ['left', 'right'] },
    isActive: { type: Boolean, default: true },
    eyebrow: { type: String, default: '' },
    badge: { type: String, default: '' },
    chips: { type: [String], default: [] },
    adTag: { type: String, default: '' },
    stat: { type: String, default: '' },
    statLabel: { type: String, default: '' },
    primaryButtonText: { type: String, default: '' },
    primaryButtonLink: { type: String, default: '' },
    secondaryButtonText: { type: String, default: '' },
    secondaryButtonLink: { type: String, default: '' },
  },
  { _id: true }
);

const brochureSlideSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    image: { type: String, default: '' },
    video: { type: String, default: '' },
    eyebrow: { type: String, default: '' },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    badge: { type: String, default: 'Export Catalogue' },
    caption: { type: String, default: '' },
    primaryButtonText: { type: String, default: '' },
    primaryButtonLink: { type: String, default: '' },
    secondaryButtonText: { type: String, default: '' },
    secondaryButtonLink: { type: String, default: '' },
    chips: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const testimonialSchema = new mongoose.Schema(
  {
    logo: { type: String, default: '' },
    quote: { type: String, default: '' },
    name: { type: String, default: '' },
    role: { type: String, default: '' },
    avatar: { type: String, default: '' },
    order: { type: Number, default: 0 },
    side: { type: String, enum: ['left', 'right'] },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const mapRegionSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    fullName: { type: String, default: '' },
    code: { type: String, default: '' },
    badge: { type: String, default: 'SCHEDULED EXPORT CORRIDOR' },
    description: { type: String, default: '' },
    x: { type: Number, default: 500 },
    y: { type: Number, default: 250 },
    ports: { type: [String], default: [] },
    transitTime: { type: String, default: '' },
    deliveryRate: { type: String, default: '99.4%' },
    volumeGrowth: { type: String, default: '+28%' },
    containersServed: { type: String, default: '250+ TEU' },
    serviceType: { type: String, default: 'FCL & LCL Containerized Service' },
    originsText: { type: String, default: 'Origins: Mundra / JNPT Ports' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const mapPillarSchema = new mongoose.Schema(
  {
    number: { type: String, default: '01' },
    title: { type: String, default: '' },
    text: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const certificateSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    issuer: { type: String, default: '' },
    code: { type: String, default: 'fssai' },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    highlights: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const tradePillarSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    metric: { type: String, default: '' },
    description: { type: String, default: '' },
    icon: { type: String, default: '🚢' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const newArrivalItemSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    slug: { type: String, default: '' },
    categoryName: { type: String, default: 'Spices & Seasonings' },
    origin: { type: String, default: 'Gujarat, India' },
    image: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    hsCode: { type: String, default: '' },
    packageType: { type: String, default: '25kg Multi-wall Paper' },
    moq: { type: String, default: '1 x 20ft FCL' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const navLinkSchema = new mongoose.Schema(
  {
    label: { type: String, default: '' },
    to: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const footerLinkSchema = new mongoose.Schema(
  {
    label: { type: String, default: '' },
    to: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, index: true, default: 'main' },
    header: {
      brandName: { type: String, default: 'NMC' },
      brandFullName: { type: String, default: 'Nirmala Multitrading Co.' },
      brandTagline: { type: String, default: "India’s Taste. The World’s Table" },
      logo: { type: String, default: '/NMC logo.png' },
      favicon: { type: String, default: '/favicon.svg' },
      faviconText: { type: String, default: 'NMC' },
      faviconSubtext: { type: String, default: 'EXPORTS' },
      faviconFit: { type: String, default: 'contain' },
      faviconBg: { type: String, default: 'transparent' },
      faviconShape: { type: String, default: 'rounded' },
      faviconPadding: { type: Number, default: 10 },
      faviconScale: { type: Number, default: 100 },
      faviconOffsetX: { type: Number, default: 0 },
      faviconOffsetY: { type: Number, default: 0 },
      faviconAlignedDataUrl: { type: String, default: '' },
      siteTitle: {
        type: String,
        default:
          'Nirmala Multi Trading Co. (NMC) | Leading Indian Merchant Food Exporter | Spices, Grains & Agro Commodities',
      },
      metaDescription: {
        type: String,
        default:
          'Nirmala Multi Trading Co. (NMC) is a premier Indian merchant food exporter delivering Sortex-cleaned spices, grains, pulses, oil seeds, dehydrated foods and savories worldwide.',
      },
      ctaText: { type: String, default: 'Get a Quote' },
      ctaLink: { type: String, default: '/inquiry' },
      navLinks: {
        type: [navLinkSchema],
        default: [
          { label: 'Home', to: '/', isActive: true, order: 1 },
          { label: 'About', to: '/about', isActive: true, order: 2 },
          { label: 'Products', to: '/products', isActive: true, order: 3 },
          { label: 'Partners', to: '/partners', isActive: true, order: 4 },
          { label: 'Brochures', to: '/brochures', isActive: true, order: 5 },
          { label: 'Blog', to: '/blog', isActive: true, order: 6 },
        ],
      },
    },
    footer: {
      brandFullName: { type: String, default: 'Nirmala Multitrading Co.' },
      logo: { type: String, default: '/NMC logo.png' },
      blurb: {
        type: String,
        default:
          'India’s Taste. The World’s Table — connecting trusted Indian food products with international buyers.',
      },
      email: { type: String, default: 'nirmalamultitradingco@gmail.com' },
      phone: { type: String, default: '+91 7069826082' },
      address: { type: String, default: 'Surat, Gujarat, India' },
      inquiryCtaText: { type: String, default: 'Request FOB / CIF Quote' },
      inquiryCtaLink: { type: String, default: '/inquiry' },
      newsletterBadge: { type: String, default: 'Exporter Market Intelligence' },
      newsletterTitle: { type: String, default: 'Get Instant Agro Market & Harvest Updates' },
      newsletterDesc: {
        type: String,
        default:
          'Subscribe to receive immediate alerts when new agro commodities, spices, or market trade reports are published.',
      },
      badges: {
        type: [String],
        default: ['APEDA REG.', 'SPICE BOARD INDIA', 'FSSAI CERTIFIED', 'MUNDRA PORT (INMUN1)'],
      },
      quickLinks: {
        type: [footerLinkSchema],
        default: [
          { label: 'Products', to: '/products', isActive: true, order: 1 },
          { label: 'Partners', to: '/partners', isActive: true, order: 2 },
          { label: 'Brochures', to: '/brochures', isActive: true, order: 3 },
          { label: 'Blog', to: '/blog', isActive: true, order: 4 },
        ],
      },
      copyrightText: {
        type: String,
        default: 'Nirmala Multitrading Co. All rights reserved.',
      },
      bottomTagline: {
        type: String,
        default: 'Certified Indian Agro-Food Exporter',
      },
    },
    loader: {
      isActive: { type: Boolean, default: true },
      logo: { type: String, default: '/NMC logo.png' },
      eyebrow: { type: String, default: 'Certified Indian Agro-Food Exporter' },
      title: { type: String, default: 'Nirmala Multitrading Co.' },
      tagline: { type: String, default: "India’s Taste. The World’s Table" },
      subtitle: { type: String, default: 'Connecting Trusted Indian Agro-Food Products Globally' },
      statusText: { type: String, default: 'Preparing Premium Consignments…' },
      badgeText: { type: String, default: 'APEDA • SPICE BOARD INDIA • FSSAI' },
      durationSeconds: { type: Number, default: 2.5 },
      imageFit: { type: String, default: 'cover' },
      showProgress: { type: Boolean, default: true },
    },
    homeHero: {
      eyebrow: { type: String, default: 'NMC' },
      title: { type: String, default: 'India’s Taste. The World’s Table' },
      description: { type: String, default: 'Connecting trusted Indian food products with buyers around the world.' },
      livePortLabel: { type: String, default: 'LIVE EXPORT PORT' },
      apedaRegText: { type: String, default: 'APEDA REG: 218903' },
      spicesBoardText: { type: String, default: 'SPICES BOARD OF INDIA' },
      primaryButtonText: { type: String, default: 'Browse products' },
      primaryButtonLink: { type: String, default: '/products' },
      secondaryButtonText: { type: String, default: 'Get a quote' },
      secondaryButtonLink: { type: String, default: '/inquiry' },
      items: {
        type: [itemSchema],
        default: [
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
    },
    aboutHero: {
      eyebrow: { type: String, default: 'About NMC' },
      title: { type: String, default: 'India’s Taste. The World’s Table' },
      description: { type: String, default: 'We connect trusted Indian food products with international buyers through a clear, organised export process.' },
      badges: {
        type: [String],
        default: [
          '✓ APEDA & Spice Board Registered',
          '✓ Port Direct Mundra & JNPT',
          '✓ 40+ Destination Ports',
        ],
      },
    },
    inquiryHero: {
      eyebrow: { type: String, default: 'Get in touch' },
      title: { type: String, default: "We're ready to talk." },
      description: {
        type: String,
        default: 'Tell us what you are looking for and our export team will get back to you with product details, samples and pricing.',
      },
    },
    aboutApproach: {
      eyebrow: { type: String, default: 'Our approach' },
      title: { type: String, default: 'What sets us apart' },
      description: {
        type: String,
        default: 'A structured approach to sourcing, documentation and export coordination — designed to make international buying clearer and more dependable.',
      },
      items: {
        type: [itemSchema],
        default: [
          { title: 'The beginning', description: 'We started with a simple idea: make quality Indian food products easier for international buyers to source with confidence.', icon: '01', order: 1, side: 'left', image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80' },
          { title: 'Built around quality', description: 'Every product opportunity is supported with clear specifications, packaging details, certifications and practical export documentation.', icon: '02', order: 2, side: 'right', image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80' },
          { title: 'Ready for global buyers', description: 'From product selection and samples to pricing and shipment coordination, we keep the process organised around the buyer and destination market.', icon: '03', order: 3, side: 'left', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80' },
        ],
      },
    },
    homeOfferings: {
      eyebrow: { type: String, default: 'What we offer' },
      title: { type: String, default: 'Export support built around your market' },
      description: {
        type: String,
        default: 'From product sourcing to documentation and shipment coordination, we help international buyers move with confidence.',
      },
      items: {
        type: [itemSchema],
        default: [
          { title: 'Product sourcing', description: 'Curated Indian food products from trusted growers, manufacturers and processors.', icon: '01', order: 1 },
          { title: 'Private label support', description: 'Packaging, labelling, specifications and market-specific requirements coordinated with suppliers.', icon: '02', order: 2 },
          { title: 'Export coordination', description: 'Documentation, shipment planning and one point of contact from enquiry through dispatch.', icon: '03', order: 3 },
        ],
      },
    },
    homeHowWeWork: {
      eyebrow: { type: String, default: 'How we work' },
      title: { type: String, default: 'A single bridge to global buyers' },
      description: { type: String, default: "Three steps that turn a grower's harvest into a compliant, on-time export shipment." },
      items: {
        type: [itemSchema],
        default: [
          { title: 'We source & vet', description: 'We partner directly with growers and processors, verify certifications, and inspect quality before anything is listed.', icon: '01', order: 1 },
          { title: 'We ready for export', description: 'Grading, packing, documentation and HS classification handled so shipments clear customs without friction.', icon: '02', order: 2 },
          { title: 'We deliver to buyers', description: 'One point of contact for pricing, samples and logistics across multiple product segments and origins.', icon: '03', order: 3 },
        ],
      },
    },
    aboutWhyChooseUs: {
      eyebrow: { type: String, default: 'Why choose us' },
      title: { type: String, default: 'A practical partner for international food sourcing' },
      description: {
        type: String,
        default: 'We combine product knowledge, supplier coordination and export documentation to make buying from India clearer and easier.',
      },
      items: {
        type: [itemSchema],
        default: [
          { title: 'Reliable sourcing', description: 'We coordinate with established growers and food companies and match products to buyer requirements.', icon: '01', order: 1 },
          { title: 'Export-ready information', description: 'Clear specifications, packaging, certifications and documentation support before shipment.', icon: '02', order: 2 },
          { title: 'Buyer-focused coordination', description: 'One organised point of contact for samples, pricing, production updates and logistics.', icon: '03', order: 3 },
        ],
      },
    },
    testimonials: {
      eyebrow: { type: String, default: 'Client feedback' },
      title: { type: String, default: 'What our clients say about us' },
      description: {
        type: String,
        default: 'Feedback from buyers and partners who value clear communication, reliable information and a well-coordinated export process.',
      },
      items: {
        type: [testimonialSchema],
        default: [
          {
            logo: 'NMC',
            quote: 'Clear communication, practical product information and a smooth process from inquiry to shipment.',
            name: 'Amanda Smith',
            role: 'Import Buyer',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=180&q=80',
            order: 1,
          },
          {
            logo: 'GLOBAL FOODS',
            quote: 'The team understood our market requirements and helped us coordinate samples, specifications and pricing efficiently.',
            name: 'Mark Wilson',
            role: 'Procurement Manager',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=180&q=80',
            order: 2,
          },
          {
            logo: 'TRADE PARTNERS',
            quote: 'A dependable point of contact for Indian food products, export documentation and shipment coordination.',
            name: 'Jessica Smith',
            role: 'Category Manager',
            avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=180&q=80',
            order: 3,
          },
        ],
      },
    },
    globalMap: {
      eyebrow: { type: String, default: 'Global Footprint' },
      title: { type: String, default: 'Export Corridors We Actively Serve' },
      description: {
        type: String,
        default: 'Reliable maritime & air freight routes delivering export-grade Indian agri commodities, spices, and processed foods worldwide.',
      },
      regions: {
        type: [mapRegionSchema],
        default: [
          { name: 'United States', code: 'USA', x: 230, y: 195, ports: ['New York / New Jersey', 'Long Beach (Los Angeles)', 'Houston / Savannah'], transitTime: '24 – 28 Days', deliveryRate: '99.4%', volumeGrowth: '+34%', order: 1, isActive: true },
          { name: 'United Kingdom', code: 'UK', x: 472, y: 145, ports: ['Felixstowe', 'Southampton', 'London Gateway'], transitTime: '18 – 22 Days', deliveryRate: '99.8%', volumeGrowth: '+28%', order: 2, isActive: true },
          { name: 'European Union', code: 'Europe', x: 510, y: 170, ports: ['Rotterdam (Netherlands)', 'Hamburg (Germany)', 'Antwerp (Belgium)'], transitTime: '20 – 24 Days', deliveryRate: '99.2%', volumeGrowth: '+41%', order: 3, isActive: true },
          { name: 'Norway & Scandinavia', code: 'Norway', x: 520, y: 110, ports: ['Oslo Port', 'Gothenburg', 'Bergen'], transitTime: '22 – 26 Days', deliveryRate: '99.5%', volumeGrowth: '+19%', order: 4, isActive: true },
          { name: 'GCC & Middle East', code: 'GCC', x: 615, y: 235, ports: ['Jebel Ali (Dubai)', 'Hamad Port (Qatar)', 'Jeddah Islamic Port (KSA)'], transitTime: '4 – 7 Days', deliveryRate: '99.9%', volumeGrowth: '+52%', order: 5, isActive: true },
          { name: 'Asian Markets', code: 'Asian', x: 790, y: 280, ports: ['Port of Singapore', 'Port Klang (Malaysia)', 'Tokyo / Yokohama (Japan)'], transitTime: '8 – 14 Days', deliveryRate: '99.6%', volumeGrowth: '+37%', order: 6, isActive: true },
        ],
      },
      pillars: {
        type: [mapPillarSchema],
        default: [
          { number: '01', title: '6 Global Corridors', text: 'Established logistics networks reaching USA, Europe, UK, Norway, Asia, and GCC ports.', order: 1, isActive: true },
          { number: '02', title: '100% HS & Lab Clearance', text: 'Pre-shipment phytosanitary, pesticide MRL, and fumigation certificates for zero-delay customs clearance.', order: 2, isActive: true },
          { number: '03', title: 'Direct Sea & Air Options', text: 'Full Container Load (FCL), Less than Container Load (LCL), and urgent temperature-controlled air freight.', order: 3, isActive: true },
          { number: '04', title: 'Flexible Incoterms', text: 'FOB, CIF, CFR, and DDP terms customized to buyer preference with transparent tracking.', order: 4, isActive: true },
        ],
      },
    },
    certificates: {
      eyebrow: { type: String, default: 'Accreditations & Compliance' },
      title: { type: String, default: 'Certified for Global Trade' },
      description: {
        type: String,
        default: 'Our export consignments strictly conform to international food safety, phytosanitary standards, and destination-country import regulations.',
      },
      items: {
        type: [certificateSchema],
        default: [
          { name: 'Food Safety and Standards Authority of India', issuer: 'Govt. of India Statutory Food License', code: 'fssai', description: 'Mandatory central certification verifying supreme hygiene, raw material testing, pesticide residue adherence, and ethical food packaging standards.', highlights: ['Zero adulteration mandate', 'Periodic batch laboratory assays', 'Full farm-to-dispatch traceability'], order: 1, isActive: true },
          { name: 'Agricultural & Processed Food Products Export Development Authority', issuer: 'Ministry of Commerce & Industry, India', code: 'apeda', description: 'Official export certification facilitating trade oversight, scheduled food grading, port-level phytosanitary documentation, and residue monitoring.', highlights: ['Global organic trace compliance', 'Govt accredited export verification', 'Scheduled agricultural standards'], order: 2, isActive: true },
          { name: 'Good Manufacturing Practice', issuer: 'Quality & Integrity Assured Manufacturing', code: 'gmp', description: 'Ensures products are consistently manufactured and controlled to quality standards appropriate to their intended use and international market requirements.', highlights: ['State-of-the-art grading & packing', 'Standard operating procedures (SOP)', 'Batch consistency guarantees'], order: 3, isActive: true },
          { name: 'Good Hygiene Practices', issuer: 'Sanitation & Clean Handling Protocol', code: 'ghp', description: 'Strict hygiene controls across raw material procurement, warehouse cleanliness, employee sanitation, and temperature-controlled storage.', highlights: ['Sanitized packing environments', 'Pest-free hermetic storage', 'Safe contact packaging'], order: 4, isActive: true },
          { name: 'Hazard Analysis Critical Control Point', issuer: 'Preventive Food Safety Protocol', code: 'haccp', description: 'Systematic preventive approach targeting biological, chemical, and physical food hazards in production processes rather than finished product inspection alone.', highlights: ['Critical control point monitoring', 'Contamination prevention', 'Continuous process validation'], order: 5, isActive: true },
          { name: 'ISO 22000:2018 Food Safety Management', issuer: 'International Organization for Standardization', code: 'iso22000', description: 'The premier global food safety management benchmark harmonizing interactive communication, system management, and prerequisite programs.', highlights: ['Comprehensive hazard screening', 'International supply-chain alignment', 'Rigorous third-party audits'], order: 6, isActive: true },
          { name: 'American Spice Trade Association', issuer: 'Premier International Spice Trade Body', code: 'asta', description: 'Adherence to ASTA cleanliness specifications, steam sterilization standards, volatile oil content guarantees, and moisture thresholds for North American and world markets.', highlights: ['Cleanliness & purity testing', 'ETO / Steam treated options', 'Strict volatile oil benchmarks'], order: 7, isActive: true },
        ],
      },
    },
    engineerTrade: {
      eyebrow: { type: String, default: 'Industrial & Large-Scale Operations' },
      title: { type: String, default: 'Engineering High-Volume Global Trade' },
      description: {
        type: String,
        default:
          'Scalable processing, precision container consolidation, and institutional supply chain reliability from farm gate to global port.',
      },
      badge: { type: String, default: 'FCL & Multi-Container Consignments' },
      ctaTitle: {
        type: String,
        default: 'Planning full container load (FCL) or multi-product shipments?',
      },
      ctaSubtitle: {
        type: String,
        default:
          'Direct liaison with Mundra and JNPT port customs brokers for swift container dispatch.',
      },
      ctaButtonText: { type: String, default: 'Get a quote' },
      ctaButtonLink: { type: String, default: '/inquiry' },
      items: {
        type: [tradePillarSchema],
        default: [
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
    },
    flashCard: {
      isActive: { type: Boolean, default: true },
      title: { type: String, default: 'India’s Taste. The World’s Table' },
      subtitle: { type: String, default: 'Direct sourcing of export-grade Indian spices, premium grains, and agro-commodities with certified global shipping.' },
      image: { type: String, default: '' },
      buttonText: { type: String, default: 'Explore Our Products' },
      buttonLink: { type: String, default: '/products' },
    },
    chatbot: {
      botName: { type: String, default: 'TradeMitra' },
      botSubtitle: { type: String, default: 'AI Export & Sourcing Assistant' },
      welcomeMessage: {
        type: String,
        default:
          'Hello! I am **TradeMitra**, your export & sourcing assistant at **Nirmala Multi Trading Co.** (NMC).\n\nHow can I assist your food import or procurement inquiry today?',
      },
      defaultSuggestions: {
        type: [String],
        default: [
          'What spices do you export?',
          'Shipping to USA, Europe & GCC',
          'Can I request sample kits?',
          'Certificates & Quality',
        ],
      },
      disclaimer: {
        type: String,
        default:
          'Responses are generated based on NMC product catalogues and export shipping specifications.',
      },
      isActive: { type: Boolean, default: true },
      knowledgeBase: {
        type: [
          new mongoose.Schema(
            {
              triggers: { type: [String], default: [] },
              reply: { type: String, default: '' },
              link: { type: String, default: '' },
              linkText: { type: String, default: '' },
              suggestions: { type: [String], default: [] },
              order: { type: Number, default: 0 },
              isActive: { type: Boolean, default: true },
            },
            { _id: true }
          ),
        ],
        default: [
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
    },
    newArrivals: {
      isActive: { type: Boolean, default: true },
      badge: { type: String, default: 'Live Market Arrivals' },
      eyebrow: { type: String, default: 'Fresh Crop Season 2026' },
      title: { type: String, default: 'New Arrival Export Consignments' },
      description: {
        type: String,
        default: 'Directly sourced from verified Indian farm clusters and modern Sortex milling hubs.',
      },
      autoRotateSeconds: { type: Number, default: 4.5 },
      items: {
        type: [newArrivalItemSchema],
        default: [
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
    },
    productsPage: {
      isActive: { type: Boolean, default: true },
      hero: {
        badge: { type: String, default: 'Global Agro-Food Catalogue' },
        eyebrow: { type: String, default: 'CERTIFIED INDIAN EXPORTS' },
        title: { type: String, default: 'All Export Food Products' },
        subtitle: {
          type: String,
          default:
            '100% Sortex-cleaned Indian spices, premium grains, pulses, and value-added food products ready for containerized ocean shipping.',
        },
      },
      showcase: {
        isActive: { type: Boolean, default: true },
        defaultMode: { type: String, enum: ['wheel', 'arc'], default: 'wheel' },
        title: { type: String, default: 'Featured Export Products' },
        subtitle: {
          type: String,
          default:
            'Discover our certified Sortex-cleaned harvest lots and premium packaged Indian food products ready for global ocean freight.',
        },
        watermark: { type: String, default: 'FOOD PRODUCTS' },
        autoRotateSeconds: { type: Number, default: 3.5 },
        showcaseBadge: { type: String, default: 'FEATURED FOOD SHOWCASE' },
        keepCustomTitle: { type: Boolean, default: false },
      },
      bento: {
        badge: { type: String, default: 'DIRECT SOURCING GUARANTEE' },
        headline: { type: String, default: 'Global Food Products, Perfected' },
        subtitle: {
          type: String,
          default:
            'Direct sourcing of export-grade Indian spices, premium grains, and food products with certified global shipping.',
        },
        bullets: {
          type: [String],
          default: [
            'Direct Mundra Port (INMUN1) & JNPT Container Stuffing',
            'APEDA, Spice Board of India & FSSAI Registered Consignments',
            'European MRL & ASTA Purity Compliance with Full Batch Traceability',
            'Customized Retail Standup Pouches & Institutional Bulk Bags',
          ],
        },
        buttonText: { type: String, default: 'Request Container Quotation' },
        buttonLink: { type: String, default: '/inquiry' },
        secondaryButtonText: { type: String, default: 'Download Line Card' },
        secondaryButtonLink: { type: String, default: '/brochures' },
      },
      trustBar: {
        isActive: { type: Boolean, default: true },
        title: { type: String, default: 'Why Global Buyers Trust NMC' },
        items: {
          type: [
            new mongoose.Schema(
              {
                icon: { type: String, default: '✨' },
                title: { type: String, default: '' },
                text: { type: String, default: '' },
              },
              { _id: true }
            ),
          ],
          default: [
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
      },
      ctaBanner: {
        isActive: { type: Boolean, default: true },
        eyebrow: { type: String, default: 'READY FOR EXPORT ORDERS' },
        title: { type: String, default: 'Need Container Freight Quotations or Custom Samples?' },
        description: {
          type: String,
          default:
            'Our international trade desk prepares formal FOB (Mundra/JNPT) or CIF proforma invoices within 12–24 business hours. Courier sample kits dispatched worldwide.',
        },
        buttonPrimaryText: { type: String, default: 'Request Official Quotation →' },
        buttonPrimaryLink: { type: String, default: '/inquiry' },
        buttonSecondaryText: { type: String, default: 'Download Product Brochures' },
        buttonSecondaryLink: { type: String, default: '/brochures' },
      },
    },
    featuredSection: {
      isActive: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'The next shipment' },
      title: { type: String, default: 'Featured product details' },
      linkText: { type: String, default: 'All product details →' },
      linkTo: { type: String, default: '/product-details' },
    },
    exploreProductsSection: {
      isActive: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'Products' },
      title: { type: String, default: 'Explore our products' },
      description: {
        type: String,
        default:
          'Source Sortex-cleaned export spices, premium grains, pulses, and value-added agro-commodities directly from trusted producers.',
      },
      linkText: { type: String, default: 'All products →' },
      linkTo: { type: String, default: '/products' },
    },
    partnersSection: {
      isActive: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'Collaborations' },
      title: { type: String, default: 'Companies we work with' },
      description: {
        type: String,
        default:
          'We list and represent products from trusted growers, millers, and certified food processing clusters across India.',
      },
    },
    homeCta: {
      isActive: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'Ready to talk?' },
      title: {
        type: String,
        default: "Tell us what you're buying — we'll send samples and pricing.",
      },
      description: {
        type: String,
        default:
          'Direct liaison with Mundra and JNPT port customs brokers for swift container dispatch.',
      },
      buttonText: { type: String, default: 'Send an inquiry' },
      buttonLink: { type: String, default: '/inquiry' },
    },
    aboutCommitment: {
      isActive: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'Our Commitment' },
      title: { type: String, default: 'Transparent, Direct & Zero-Friction Exporting' },
      description: {
        type: String,
        default:
          'We understand that every export requirement is different. We combine product knowledge, supplier coordination and documentation support to help buyers move from enquiry to shipment with fewer surprises.',
      },
      buttonPrimaryText: { type: String, default: 'Start a conversation' },
      buttonPrimaryLink: { type: String, default: '/inquiry?source=aboutConversation' },
      buttonSecondaryText: { type: String, default: 'Browse Products' },
      buttonSecondaryLink: { type: String, default: '/products' },
    },
    aboutCta: {
      isActive: { type: Boolean, default: true },
      title: { type: String, default: 'Looking for a specific food product?' },
      description: {
        type: String,
        default:
          'Tell us what you need and our export team will verify product availability, packaging formats and indicative pricing.',
      },
      buttonPrimaryText: { type: String, default: 'Get in touch' },
      buttonPrimaryLink: { type: String, default: '/inquiry' },
      buttonSecondaryText: { type: String, default: 'Download Line Cards' },
      buttonSecondaryLink: { type: String, default: '/brochures' },
    },
    brochuresHero: {
      eyebrow: { type: String, default: 'Official Catalogues & Line Cards' },
      title: { type: String, default: 'Export Product Catalogues & Line Cards' },
      description: {
        type: String,
        default:
          'Download detailed export specifications, packing formats, HS codes, and container payload capacities in verified PDF format.',
      },
      image: { type: String, default: '' },
      video: { type: String, default: '' },
      autoPlay: { type: Boolean, default: true },
      autoPlayInterval: { type: Number, default: 5 },
      slides: {
        type: [brochureSlideSchema],
        default: [],
      },
      showBadges: { type: Boolean, default: true },
      badges: {
        type: [
          {
            text: { type: String, default: '' },
            color: { type: String, default: 'gold' },
            link: { type: String, default: '' },
          },
        ],
        default: [
          { text: 'Verified Export Specs', color: 'gold', link: '' },
          { text: 'Direct PDF Downloads', color: 'emerald', link: '' },
          { text: 'Container Payload Data', color: 'blue', link: '' },
        ],
      },
      buyerAssurance: {
        show: { type: Boolean, default: true },
        title: { type: String, default: 'Buyer Assurance' },
        badge: { type: String, default: 'APEDA • ISO 22000' },
        mediaType: { type: String, enum: ['none', 'image', 'video'], default: 'none' },
        image: { type: String, default: '' },
        video: { type: String, default: '' },
        mediaDisplay: { type: String, enum: ['cardScreen', 'background'], default: 'cardScreen' },
        mediaCaption: { type: String, default: 'Live Export Cargo & Facility' },
        footerLeft: { type: String, default: 'Direct Seaport Loading' },
        footerRight: { type: String, default: 'Mundra & JNPT' },
        items: {
          type: [
            {
              icon: { type: String, default: '📦' },
              title: { type: String, default: 'Container Payload Data' },
              subtitle: { type: String, default: '20ft (18-22 MT) • 40ft HC (28 MT)' },
            },
          ],
          default: [
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
      },
      isActive: { type: Boolean, default: true },
    },
    blogHero: {
      eyebrow: { type: String, default: 'Media & Market Insights' },
      title: { type: String, default: 'Global Agro Export Blog & Market Insights' },
      description: {
        type: String,
        default:
          'In-depth global market intelligence, harvest cycles, FOB/CIF commodity price trends, and export quality standards from Nirmala Multitrading Co.',
      },
      image: { type: String, default: '' },
      video: { type: String, default: '' },
      showBadges: { type: Boolean, default: true },
      badges: {
        type: [
          {
            text: { type: String, default: '' },
            color: { type: String, default: 'gold' },
            link: { type: String, default: '' },
          },
        ],
        default: [
          { text: 'Market Trade Intelligence', color: 'gold', link: '' },
          { text: 'Verified Agro Harvest Trends', color: 'emerald', link: '' },
          { text: 'Global Export Logistics', color: 'blue', link: '' },
        ],
      },
      isActive: { type: Boolean, default: true },
    },
    partnersPage: {
      eyebrow: { type: String, default: 'Collaborations' },
      title: { type: String, default: 'Companies we work with' },
      description: {
        type: String,
        default:
          'Trusted Indian agricultural growers, mills, and food manufacturing enterprises whose products we export globally.',
      },
      bannerEyebrow: { type: String, default: 'Supplier & Producer Onboarding' },
      bannerTitle: { type: String, default: 'Expand Your Food Products Worldwide with NMC' },
      bannerDescription: {
        type: String,
        default:
          'Are you an Indian food manufacturer, miller, farmer producer organization (FPO), or spice processor? Partner with Nirmala Multitrading Co. for scheduled container consignments from Mundra and JNPT to 40+ destination countries.',
      },
      bannerButtonText: { type: String, default: 'Become a Partner Form →' },
      bannerButtonLink: { type: String, default: '/become-a-partner' },
      bannerSecondaryText: { type: String, default: 'Contact Procurement Desk' },
      bannerSecondaryLink: { type: String, default: '/inquiry' },
      isActive: { type: Boolean, default: true },
    },
    favicon: { type: String, default: '/favicon.svg' },
    faviconText: { type: String, default: 'NMC' },
    faviconSubtext: { type: String, default: 'EXPORTS' },
    faviconFit: { type: String, default: 'contain' },
    faviconBg: { type: String, default: 'transparent' },
    faviconShape: { type: String, default: 'rounded' },
    faviconPadding: { type: Number, default: 10 },
    faviconScale: { type: Number, default: 100 },
    faviconOffsetX: { type: Number, default: 0 },
    faviconOffsetY: { type: Number, default: 0 },
    faviconAlignedDataUrl: { type: String, default: '' },
    siteTitle: {
      type: String,
      default:
        'Nirmala Multi Trading Co. (NMC) | Leading Indian Merchant Food Exporter | Spices, Grains & Agro Commodities',
    },
    metaDescription: {
      type: String,
      default:
        'Nirmala Multi Trading Co. (NMC) is a premier Indian merchant food exporter delivering Sortex-cleaned spices, grains, pulses, oil seeds, dehydrated foods and savories worldwide.',
    },
  },
  { timestamps: true }
);

export default mongoose.model('SiteContent', siteContentSchema);
