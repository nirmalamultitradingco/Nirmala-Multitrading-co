import { createContext, useContext, useEffect, useMemo, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Comprehensive dictionary for 4 languages: English (en), Spanish (es), Dutch (nl), Arabic (ar)
const translations = {
  en: {
    home: 'Home',
    homeTitle: 'Export-ready food, from source to shelf.',
    browseProducts: 'Browse products',
    requestQuote: 'Get a quote',
    segments: 'Segments',
    partners: 'Partners',
    isoFssai: 'ISO · FSSAI',
    certified: 'Certified',
    shipsFrom: 'Ships from',
    viewAll: 'View all →',
    allSegments: 'All segments →',
    readyToTalk: 'Ready to talk?',
    buyingPrompt: 'Tell us what you’re buying — we’ll send samples and pricing.',
    sendInquiry: 'Send an inquiry',
    howWeWork: 'How we work',
    globalBridge: 'A single bridge to global buyers',
    nextShipment: 'The next shipment',
    featuredProducts: 'Featured products',
    productSegments: 'Product segments',
    exploreCategory: 'Explore by category',
    collaborations: 'Collaborations',
    companiesWeWorkWith: 'Companies we work with',
    downloadSheets: 'Download product catalogues and specification sheets. Need something specific? Send us an inquiry.',
    downloads: 'Downloads',
    cataloguesLineCards: 'Catalogues & line cards',
    noBrochures: 'No brochures yet',
    uploadPdfs: 'Upload PDFs from the admin panel.',
    viewRange: 'View range →',
    visitWebsite: 'Visit website →',
    loading: 'Loading…',
    previousSlide: 'Previous slide',
    nextSlide: 'Next slide',
    toggleMenu: 'Toggle menu',
    adminSignIn: 'Admin sign in',
    manageProductsPartnersInquiries: 'Manage products, partners and inquiries.',
    email: 'Email',
    password: 'Password',
    dashboard: 'Dashboard',
    dashboardDesc: 'Overview of your catalogue and inquiries.',
    quickActions: 'Quick actions',
    addProduct: 'Add a product',
    addSegment: 'Add a segment',
    addPartner: 'Add a partner',
    uploadBrochure: 'Upload a brochure',
    inquiries: 'Inquiries',
    inquiriesDesc: 'Messages submitted through the site’s inquiry form.',
    replyEmail: 'Reply by email',
    delete: 'Delete',
    edit: 'Edit',
    cancel: 'Cancel',
    noItems: 'No items yet.',
    segmentsDesc: 'Product categories shown across the site.',
    subSegments: 'Sub-Segments',
    subSegmentsDesc: 'Manage the second-level categories shown inside each segment.',
    noSubsegments: 'No sub-segments for this segment yet.',
    createSegmentFirst: 'Create a segment first.',
    partnersDesc: 'Collaborating companies whose products you list.',
    noPartners: 'No partners yet.',
    addPartners: 'Add partner companies from the admin panel.',
    productsDesc: 'The catalogue buyers browse and inquire about.',
    product: 'Product',
    segment: 'Segment',
    subSegment: 'Sub-segment',
    partner: 'Partner',
    flags: 'Flags',
    actions: 'Actions',
    featured: 'featured',
    hidden: 'hidden',
    noProducts: 'No products yet.',
    name: 'Name',
    description: 'Description',
    order: 'Order',
    visibleSite: 'Visible on site',
    parentSegment: 'Parent segment *',
    selectSegment: 'Select segment…',
    none: 'None',
    noSubsegmentsForSegment: 'No sub-segments added for this segment.',
    shortDescription: 'Short description',
    fullDescription: 'Full description',
    origin: 'Origin',
    hsCode: 'HS code',
    packaging: 'Packaging',
    moq: 'MOQ',
    certifications: 'Certifications (comma separated)',
    mainImage: 'Main image',
    country: 'Country',
    website: 'Website',
    logo: 'Logo',
    title: 'Title',
    segmentOptional: 'Segment (optional)',
    notTiedSegment: 'Not tied to a segment',
    pdfFile: 'PDF file *',
    attachPdf: 'Please attach a PDF file.',
    openPdf: 'Open PDF',
    uploadBrochureTitle: 'Upload brochure',
    search: 'Search',
    searchProducts: 'Search products…',
    allPartners: 'All partners',
    clear: 'Clear',
    prev: 'Prev',
    next: 'Next',
    noMatch: 'No products match your filters',
    tryClear: 'Try clearing filters or a different search.',
    catalogue: 'Catalogue',
    allProducts: 'All products',
    whatExport: 'What we export',
    browseRange: 'Browse our range by category. Each segment carries multiple products from partner companies.',
    aboutUs: 'About us',
    aboutTagline: 'A trading partner built around trust, quality and clean paperwork.',
    specificProduct: 'Looking for a specific product?',
    specificPrompt: 'Tell us the product, spec and destination — we’ll come back with options and pricing.',
    getInTouch: 'Get in touch',
    ourApproach: 'Our approach',
    whatSetsApart: 'What sets us apart',
    hsDocumentation: 'HS codes, documentation and packing handled so shipments clear smoothly.',
    samplesPricing: 'Samples, pricing and logistics across every segment, coordinated by one team.',
    marketFood: 'Market of food products',
    productNotFound: 'Product not found',
    suppliedBy: 'Supplied by',
    boxSize: 'Box Size',
    packageType: 'Package Type',
    flavour: 'Flavour',
    inquire: 'Inquire about this product',
    backToProducts: 'Back to products',
    productDescription: 'Product description',
    relatedProducts: 'Related products',
    segmentNotFound: 'Segment not found',
    backToSubsegments: 'Back to sub-segments',
    selectSubsegment: 'Select a sub-segment to view the products available in this category.',
    addProducts: 'Add products from the admin panel and assign this sub-segment.',
    noSegmentProducts: 'No products in this segment yet',
    checkBack: 'Check back soon.',
    viewProduct: 'View product →',
    noImage: 'No image',
    backToCatalogue: 'Back to catalogue',
    error404: 'Error 404',
    pageNotFound: 'Page not found',
    pageMoved: 'The page you’re looking for doesn’t exist or has moved.',
    backHome: 'Back home',
    inquiryIntro: 'Share the product, quantity and destination. Our team replies with samples, specs and pricing.',
    phone: 'Phone',
    office: 'Office',
    inquirySent: 'Inquiry sent',
    sendAnother: 'Send another',
    company: 'Company',
    productInterest: 'Product of interest',
    generalInquiry: 'General inquiry',
    submitInquiry: 'Submit Inquiry',
    sending: 'Sending…',
    specificProducts: 'Specific Products',
    message: 'Message *',
    explore: 'Explore',
    contact: 'Contact',
    admin: 'Admin',
    sendInquiryArrow: 'Send an inquiry →',
    viewSite: 'View site',
    signOut: 'Sign out',
    checkingSession: 'Checking session…',
    close: 'Close',
    image: 'Image',
    pasteImage: '…or paste an image URL',

    // Exporter, Hero & Logistics
    getQuote: 'Get a quote',
    language: 'Language',
    brochures: 'Brochures',
    products: 'Products',
    productCategories: 'Products',
    productDetails: 'Product Details',
    subProducts: 'Sub Products',
    blog: 'Blog',
    allRightsReserved: 'All rights reserved.',
    newsletterTitle: 'Exporter Market Intelligence',
    stayUpdated: 'Get Instant Agro Market & Harvest Updates',
    newsletterDesc: 'Subscribe to receive immediate alerts when new agro commodities, spices, or market trade reports are published.',
    enterYourEmail: 'Enter your business email…',
    subscribe: 'Subscribe',
    subscribing: 'Joining…',
    featuredShowcase: 'FEATURED SHOWCASE',
    curvedFanArc: 'Curved Fan Arc',
    spinWheel: '3D Spin Wheel',
    inspectSpec: 'Inspect Spec',
    pauseSpin: 'Pause Spin',
    autoSpin: 'Auto Spin',
    clearAllFilters: 'Clear all filters',
    exportPurity: 'Export Purity, Perfected',
    exporterCommitment: 'EXPORTER COMMITMENT',
    liveExportPort: 'LIVE EXPORT PORT',
    verifiedMerchantExporter: 'VERIFIED INDIAN MERCHANT EXPORTER',
    requestContainerQuote: 'Request Port CIF Quote',
    downloadLineCard: 'Download Line Card',
    fobCifReady: 'FOB / CIF READY',
    qualityExportAssurance: 'Quality & Export Assurance',
    technicalSpecs: 'Product Technical Specifications',
    exportGrade100: '100% Export Grade',
    certifiedAgroExporter: 'Certified Indian Agro-Food Exporter',

    // Detailed Exporter & Logistics Statements
    globalMerchantCapabilities: 'Global Merchant Food Exporter Capabilities',
    engineeredTrade: 'Engineered for High-Volume International Trade',
    bridgeImporters: 'We bridge global importers, distributors, and supermarket chains with certified Indian farm clusters, handling end-to-end container logistics, customs clearance, and private labeling.',
    containerConsolidation: 'Container Consolidation',
    containerConsolidationDesc: '20ft GP (18-20 MT) and 40ft High Cube (26-28 MT) loadings. Multi-commodity consolidation in a single container for trial consignments.',
    mundraJnptPorts: 'Mundra & JNPT Ports',
    mundraJnptPortsDesc: 'Strategic ocean corridor stuffing directly at Mundra Port (Gujarat) and JNPT Nhava Sheva (Mumbai) with fast 48h vessel customs clearance.',
    privateLabelPackaging: 'Private Label Packaging',
    privateLabelPackagingDesc: 'Custom retail standup barrier pouches (100g to 1kg) with nitrogen flush, zipper locks, and master export cartons bearing your supermarket brand.',
    auditReadyCompliance: 'Audit-Ready Compliance',
    auditReadyComplianceDesc: 'Phytosanitary certification, Certificate of Origin (COO), Sortex laser cleaning, and comprehensive MRL pesticide residue lab clearance.',
  },

  es: {
    home: 'Inicio',
    homeTitle: 'Alimentos listos para exportación, desde el origen hasta el estante.',
    browseProducts: 'Ver productos',
    requestQuote: 'Solicitar cotización',
    segments: 'Segmentos',
    partners: 'Socios',
    isoFssai: 'ISO · FSSAI',
    certified: 'Certificado',
    shipsFrom: 'Enviado desde',
    viewAll: 'Ver todo →',
    allSegments: 'Todos los segmentos →',
    readyToTalk: '¿Listo para hablar?',
    buyingPrompt: 'Díganos qué está comprando y le enviaremos muestras y precios.',
    sendInquiry: 'Enviar consulta',
    howWeWork: 'Cómo trabajamos',
    globalBridge: 'Un solo puente hacia compradores globales',
    nextShipment: 'El próximo envío',
    featuredProducts: 'Productos destacados',
    productSegments: 'Segmentos de productos',
    exploreCategory: 'Explorar por categoría',
    collaborations: 'Colaboraciones',
    companiesWeWorkWith: 'Empresas con las que trabajamos',
    downloadSheets: 'Descargue catálogos de productos y fichas técnicas. ¿Necesita algo específico? Envíenos una consulta.',
    downloads: 'Descargas',
    cataloguesLineCards: 'Catálogos y fichas de línea',
    noBrochures: 'Aún no hay folletos',
    uploadPdfs: 'Suba los PDF desde el panel de administración.',
    viewRange: 'Ver gama →',
    visitWebsite: 'Visitar sitio web →',
    loading: 'Cargando…',
    previousSlide: 'Diapositiva anterior',
    nextSlide: 'Siguiente diapositiva',
    toggleMenu: 'Alternar menú',
    adminSignIn: 'Inicio de sesión de administrador',
    manageProductsPartnersInquiries: 'Gestione productos, socios y consultas.',
    email: 'Correo electrónico',
    password: 'Contraseña',
    dashboard: 'Panel',
    dashboardDesc: 'Resumen de su catálogo y consultas.',
    quickActions: 'Acciones rápidas',
    addProduct: 'Añadir producto',
    addSegment: 'Añadir segmento',
    addPartner: 'Añadir socio',
    uploadBrochure: 'Subir folleto',
    inquiries: 'Consultas',
    inquiriesDesc: 'Mensajes enviados mediante el formulario de consulta del sitio.',
    replyEmail: 'Responder por correo',
    delete: 'Eliminar',
    edit: 'Editar',
    cancel: 'Cancelar',
    noItems: 'Aún no hay elementos.',
    segmentsDesc: 'Categorías de productos mostradas en el sitio.',
    subSegments: 'Subsegmentos',
    subSegmentsDesc: 'Gestione las categorías de segundo nivel dentro de cada segmento.',
    noSubsegments: 'Aún no hay subsegmentos para este segmento.',
    createSegmentFirst: 'Cree primero un segmento.',
    partnersDesc: 'Empresas colaboradoras cuyos productos publica.',
    noPartners: 'Aún no hay socios.',
    addPartners: 'Añada empresas socias desde el panel de administración.',
    productsDesc: 'El catálogo que los compradores consultan y sobre el que realizan consultas.',
    product: 'Producto',
    segment: 'Segmento',
    subSegment: 'Subsegmento',
    partner: 'Socio',
    flags: 'Indicadores',
    actions: 'Acciones',
    featured: 'destacado',
    hidden: 'oculto',
    noProducts: 'Aún no hay productos.',
    name: 'Nombre',
    description: 'Descripción',
    order: 'Orden',
    visibleSite: 'Visible en el sitio',
    parentSegment: 'Segmento principal *',
    selectSegment: 'Seleccionar segmento…',
    none: 'Ninguno',
    noSubsegmentsForSegment: 'No hay subsegmentos añadidos para este segmento.',
    shortDescription: 'Descripción breve',
    fullDescription: 'Descripción completa',
    origin: 'Origen',
    hsCode: 'Código HS',
    packaging: 'Embalaje',
    moq: 'Pedido mínimo',
    certifications: 'Certificaciones (separadas por comas)',
    mainImage: 'Imagen principal',
    country: 'País',
    website: 'Sitio web',
    logo: 'Logotipo',
    title: 'Título',
    segmentOptional: 'Segmento (opcional)',
    notTiedSegment: 'No vinculado a un segmento',
    pdfFile: 'Archivo PDF *',
    attachPdf: 'Adjunte un archivo PDF.',
    openPdf: 'Abrir PDF',
    uploadBrochureTitle: 'Subir folleto',
    search: 'Buscar',
    searchProducts: 'Buscar productos…',
    allPartners: 'Todos los socios',
    clear: 'Borrar',
    prev: 'Anterior',
    next: 'Siguiente',
    noMatch: 'Ningún producto coincide con sus filtros',
    tryClear: 'Intente borrar los filtros o realizar otra búsqueda.',
    catalogue: 'Catálogo',
    allProducts: 'Todos los productos',
    whatExport: 'Lo que exportamos',
    browseRange: 'Explore nuestra gama por categoría. Cada segmento incluye varios productos de empresas asociadas.',
    aboutUs: 'Sobre nosotros',
    aboutTagline: 'Un socio comercial basado en la confianza, la calidad y una documentación clara.',
    specificProduct: '¿Busca un producto específico?',
    specificPrompt: 'Díganos el producto, las especificaciones y el destino; volveremos con opciones y precios.',
    getInTouch: 'Contacte con nosotros',
    ourApproach: 'Nuestro enfoque',
    whatSetsApart: 'Lo que nos diferencia',
    hsDocumentation: 'Códigos HS, documentación y embalaje gestionados para que los envíos se despachen sin problemas.',
    samplesPricing: 'Muestras, precios y logística para cada segmento, coordinados por un solo equipo.',
    productNotFound: 'Producto no encontrado',
    suppliedBy: 'Suministrado por',
    boxSize: 'Tamaño de caja',
    packageType: 'Tipo de paquete',
    flavour: 'Sabor',
    inquire: 'Consultar sobre este producto',
    backToProducts: 'Volver a productos',
    productDescription: 'Descripción del producto',
    relatedProducts: 'Productos relacionados',
    segmentNotFound: 'Segmento no encontrado',
    backToSubsegments: 'Volver a subsegmentos',
    selectSubsegment: 'Seleccione un subsegmento para ver los productos disponibles en esta categoría.',
    addProducts: 'Añada productos desde el panel de administración y asígnelos a este subsegmento.',
    noSegmentProducts: 'Aún no hay productos en este segmento',
    checkBack: 'Vuelva a consultar pronto.',
    viewProduct: 'Ver producto →',
    noImage: 'Sin imagen',
    backToCatalogue: 'Volver al catálogo',
    error404: 'Error 404',
    pageNotFound: 'Página no encontrada',
    pageMoved: 'La página que busca no existe o se ha movido.',
    backHome: 'Volver al inicio',
    inquiryIntro: 'Comparta el producto, la cantidad y el destino. Nuestro equipo responde con muestras, especificaciones y precios.',
    phone: 'Teléfono',
    office: 'Oficina',
    inquirySent: 'Consulta enviada',
    sendAnother: 'Enviar otra',
    company: 'Empresa',
    productInterest: 'Producto de interés',
    generalInquiry: 'Consulta general',
    submitInquiry: 'Enviar consulta',
    sending: 'Enviando…',
    specificProducts: 'Productos específicos',
    message: 'Mensaje *',
    explore: 'Explorar',
    contact: 'Contacto',
    admin: 'Administración',
    sendInquiryArrow: 'Enviar consulta →',
    viewSite: 'Ver sitio',
    signOut: 'Cerrar sesión',
    checkingSession: 'Comprobando sesión…',
    close: 'Cerrar',
    image: 'Imagen',
    pasteImage: '…o pegue una URL de imagen',

    getQuote: 'Solicitar cotización',
    language: 'Idioma',
    brochures: 'Catálogos',
    products: 'Productos',
    productCategories: 'Productos',
    productDetails: 'Detalles del producto',
    subProducts: 'Subproductos',
    blog: 'Blog',
    allRightsReserved: 'Todos los derechos reservados.',
    newsletterTitle: 'Inteligencia de Mercado de Exportación',
    stayUpdated: 'Reciba Actualizaciones Inmediatas del Mercado Agrícola',
    newsletterDesc: 'Suscríbase para recibir alertas inmediatas cuando se publiquen nuevos productos agrícolas, especias o informes comerciales.',
    enterYourEmail: 'Ingrese su correo electrónico comercial…',
    subscribe: 'Suscribirse',
    subscribing: 'Suscribiendo…',
    featuredShowcase: 'MUESTRA DESTACADA',
    curvedFanArc: 'Arco en Abanico Curvo',
    spinWheel: 'Rueda Giratoria 3D',
    inspectSpec: 'Ver Especificación',
    pauseSpin: 'Pausar Giro',
    autoSpin: 'Giro Automático',
    clearAllFilters: 'Borrar todos los filtros',
    exportPurity: 'Pureza de Exportación Perfeccionada',
    exporterCommitment: 'COMPROMISO DEL EXPORTADOR',
    liveExportPort: 'PUERTO DE EXPORTACIÓN EN VIVO',
    verifiedMerchantExporter: 'EXPORTADOR INDIO COMERCIAL VERIFICADO',
    requestContainerQuote: 'Solicitar Cotización CIF de Puerto',
    downloadLineCard: 'Descargar Ficha de Línea',
    fobCifReady: 'LISTO PARA FOB / CIF',
    qualityExportAssurance: 'Garantía de Calidad y Exportación',
    technicalSpecs: 'Especificaciones Técnicas del Producto',
    exportGrade100: 'Grado 100% de Exportación',
    certifiedAgroExporter: 'Exportador Agroalimentario Indio Certificado',

    globalMerchantCapabilities: 'Capacidades Globales del Exportador Comercial',
    engineeredTrade: 'Diseñado para el Comercio Internacional de Alto Volumen',
    bridgeImporters: 'Conectamos importadores, distribuidores y cadenas de supermercados globales con productores agrícolas certificados en la India, gestionando logística integral, aduanas y marca blanca.',
    containerConsolidation: 'Consolidación de Contenedores',
    containerConsolidationDesc: 'Cargas en contenedores de 20 pies GP (18-20 TM) y 40 pies High Cube (26-28 TM). Carga mixta multicommodity en un solo contenedor para pedidos de prueba.',
    mundraJnptPorts: 'Puertos de Mundra y JNPT',
    mundraJnptPortsDesc: 'Embarque directo en los puertos de Mundra (Gujarat) y JNPT Nhava Sheva (Mumbai) con despacho marítimo ágil en 48 horas.',
    privateLabelPackaging: 'Envasado y Marca Blanca',
    privateLabelPackagingDesc: 'Bolsas standup con barrera y purga de nitrógeno (100g a 1kg), cierre zipper y cajas máster de exportación con la marca de su supermercado.',
    auditReadyCompliance: 'Cumplimiento y Certificación',
    auditReadyComplianceDesc: 'Certificado fitosanitario, certificado de origen (COO), limpieza por láser Sortex y análisis completos de residuos de plaguicidas LMR.',
  },

  nl: {
    home: 'Home',
    homeTitle: 'Exportklare voeding, van bron tot schap.',
    browseProducts: 'Producten bekijken',
    requestQuote: 'Offerte aanvragen',
    segments: 'Segmenten',
    partners: 'Partners',
    isoFssai: 'ISO · FSSAI',
    certified: 'Gecertificeerd',
    shipsFrom: 'Verzonden vanuit',
    viewAll: 'Alles bekijken →',
    allSegments: 'Alle segmenten →',
    readyToTalk: 'Klaar om te praten?',
    buyingPrompt: 'Vertel ons wat u koopt — wij sturen monsters en prijzen.',
    sendInquiry: 'Een aanvraag sturen',
    howWeWork: 'Hoe we werken',
    globalBridge: 'Eén brug naar wereldwijde kopers',
    nextShipment: 'De volgende zending',
    featuredProducts: 'Uitgelichte producten',
    productSegments: 'Productsegmenten',
    exploreCategory: 'Verken per categorie',
    collaborations: 'Samenwerkingen',
    companiesWeWorkWith: 'Bedrijven waarmee we werken',
    downloadSheets: 'Download productcatalogi en specificatiebladen. Iets specifieks nodig? Stuur ons een aanvraag.',
    downloads: 'Downloads',
    cataloguesLineCards: 'Catalogi en lijnkaarten',
    noBrochures: 'Nog geen brochures',
    uploadPdfs: 'Upload PDF’s via het beheerpaneel.',
    viewRange: 'Assortiment bekijken →',
    visitWebsite: 'Website bezoeken →',
    loading: 'Laden…',
    previousSlide: 'Vorige dia',
    nextSlide: 'Volgende dia',
    toggleMenu: 'Menu openen/sluiten',
    adminSignIn: 'Beheerderslogin',
    manageProductsPartnersInquiries: 'Beheer producten, partners en aanvragen.',
    email: 'E-mail',
    password: 'Wachtwoord',
    dashboard: 'Dashboard',
    dashboardDesc: 'Overzicht van uw catalogus en aanvragen.',
    quickActions: 'Snelle acties',
    addProduct: 'Product toevoegen',
    addSegment: 'Segment toevoegen',
    addPartner: 'Partner toevoegen',
    uploadBrochure: 'Brochure uploaden',
    inquiries: 'Aanvragen',
    inquiriesDesc: 'Berichten die via het aanvraagformulier van de site zijn verzonden.',
    replyEmail: 'Per e-mail antwoorden',
    delete: 'Verwijderen',
    edit: 'Bewerken',
    cancel: 'Annuleren',
    noItems: 'Nog geen items.',
    segmentsDesc: 'Productcategorieën die op de site worden getoond.',
    subSegments: 'Subsegmenten',
    subSegmentsDesc: 'Beheer de tweede niveaucategorieën binnen elk segment.',
    noSubsegments: 'Nog geen subsegmenten voor dit segment.',
    createSegmentFirst: 'Maak eerst een segment aan.',
    partnersDesc: 'Samenwerkende bedrijven waarvan u producten vermeldt.',
    noPartners: 'Nog geen partners.',
    addPartners: 'Voeg partnerbedrijven toe via het beheerpaneel.',
    productsDesc: 'De catalogus die kopers bekijken en waarnaar ze informeren.',
    product: 'Product',
    segment: 'Segment',
    subSegment: 'Subsegment',
    partner: 'Partner',
    flags: 'Markeringen',
    actions: 'Acties',
    featured: 'uitgelicht',
    hidden: 'verborgen',
    noProducts: 'Nog geen producten.',
    name: 'Naam',
    description: 'Beschrijving',
    order: 'Volgorde',
    visibleSite: 'Zichtbaar op de site',
    parentSegment: 'Hoofdsegment *',
    selectSegment: 'Selecteer segment…',
    none: 'Geen',
    noSubsegmentsForSegment: 'Geen subsegmenten toegevoegd voor dit segment.',
    shortDescription: 'Korte beschrijving',
    fullDescription: 'Volledige beschrijving',
    origin: 'Herkomst',
    hsCode: 'HS-code',
    packaging: 'Verpakking',
    moq: 'Minimale bestelling',
    certifications: 'Certificeringen (gescheiden door komma’s)',
    mainImage: 'Hoofdafbeelding',
    country: 'Land',
    website: 'Website',
    logo: 'Logo',
    title: 'Titel',
    segmentOptional: 'Segment (optioneel)',
    notTiedSegment: 'Niet gekoppeld aan een segment',
    pdfFile: 'PDF-bestand *',
    attachPdf: 'Voeg een PDF-bestand toe.',
    openPdf: 'PDF openen',
    uploadBrochureTitle: 'Brochure uploaden',
    search: 'Zoeken',
    searchProducts: 'Producten zoeken…',
    allPartners: 'Alle partners',
    clear: 'Wissen',
    prev: 'Vorige',
    next: 'Volgende',
    noMatch: 'Geen producten komen overeen met uw filters',
    tryClear: 'Wis de filters of probeer een andere zoekopdracht.',
    catalogue: 'Catalogus',
    allProducts: 'Alle producten',
    whatExport: 'Wat we exporteren',
    browseRange: 'Bekijk ons assortiment per categorie. Elk segment bevat meerdere producten van partnerbedrijven.',
    aboutUs: 'Over ons',
    aboutTagline: 'Een handelspartner gebouwd op vertrouwen, kwaliteit en duidelijke documentatie.',
    specificProduct: 'Op zoek naar een specifiek product?',
    specificPrompt: 'Vertel ons het product, de specificaties en bestemming — wij komen terug met opties en prijzen.',
    getInTouch: 'Neem contact op',
    ourApproach: 'Onze aanpak',
    whatSetsApart: 'Wat ons onderscheidt',
    hsDocumentation: 'HS-codes, documentatie en verpakking worden geregeld zodat zendingen soepel worden ingeklaard.',
    samplesPricing: 'Monsters, prijzen en logistiek voor elk segment, gecoördineerd door één team.',
    productNotFound: 'Product niet gevonden',
    suppliedBy: 'Geleverd door',
    boxSize: 'Doosformaat',
    packageType: 'Verpakkingstype',
    flavour: 'Smaak',
    inquire: 'Informeer naar dit product',
    backToProducts: 'Terug naar producten',
    productDescription: 'Productbeschrijving',
    relatedProducts: 'Gerelateerde producten',
    segmentNotFound: 'Segment niet gevonden',
    backToSubsegments: 'Terug naar subsegmenten',
    selectSubsegment: 'Selecteer een subsegment om de beschikbare producten in deze categorie te bekijken.',
    addProducts: 'Voeg producten toe via het beheerpaneel en wijs dit subsegment toe.',
    noSegmentProducts: 'Nog geen producten in dit segment',
    checkBack: 'Kom binnenkort terug.',
    viewProduct: 'Product bekijken →',
    noImage: 'Geen afbeelding',
    backToCatalogue: 'Terug naar catalogus',
    error404: 'Fout 404',
    pageNotFound: 'Pagina niet gevonden',
    pageMoved: 'De pagina die u zoekt bestaat niet of is verplaatst.',
    backHome: 'Terug naar home',
    inquiryIntro: 'Deel het product, de hoeveelheid en bestemming. Ons team antwoordt met monsters, specificaties en prijzen.',
    phone: 'Telefoon',
    office: 'Kantoor',
    inquirySent: 'Aanvraag verzonden',
    sendAnother: 'Nog een sturen',
    company: 'Bedrijf',
    productInterest: 'Product van interesse',
    generalInquiry: 'Algemene aanvraag',
    submitInquiry: 'Aanvraag verzenden',
    sending: 'Verzenden…',
    specificProducts: 'Specifieke producten',
    message: 'Bericht *',
    explore: 'Verkennen',
    contact: 'Contact',
    admin: 'Beheer',
    sendInquiryArrow: 'Aanvraag sturen →',
    viewSite: 'Site bekijken',
    signOut: 'Uitloggen',
    checkingSession: 'Sessie controleren…',
    close: 'Sluiten',
    image: 'Afbeelding',
    pasteImage: '…of plak een afbeeldings-URL',

    getQuote: 'Offerte aanvragen',
    language: 'Taal',
    brochures: 'Brochures',
    products: 'Producten',
    productCategories: 'Producten',
    productDetails: 'Productdetails',
    subProducts: 'Subproducten',
    blog: 'Blog',
    allRightsReserved: 'Alle rechten voorbehouden.',
    newsletterTitle: 'Export Marktinformatie',
    stayUpdated: 'Ontvang Directe Agrarische Marktupdates',
    newsletterDesc: 'Abonneer u om direct meldingen te ontvangen wanneer nieuwe landbouwproducten, specerijen of marktrapporten worden gepubliceerd.',
    enterYourEmail: 'Voer uw zakelijke e-mailadres in…',
    subscribe: 'Abonneren',
    subscribing: 'Aanmelden…',
    featuredShowcase: 'UITGELICHTE SELECTIE',
    curvedFanArc: 'Gebogen Waaierboog',
    spinWheel: '3D Draaiwiel',
    inspectSpec: 'Specificaties Bekijken',
    pauseSpin: 'Draaien Pauzeren',
    autoSpin: 'Automatisch Draaien',
    clearAllFilters: 'Alle filters wissen',
    exportPurity: 'Exportzuiverheid Geperfectioneerd',
    exporterCommitment: 'EXPORTBELOFTE',
    liveExportPort: 'LIVE EXPORTHAVEN',
    verifiedMerchantExporter: 'GECERTIFICEERDE INDIASE HANDELSEXPEDITEUR',
    requestContainerQuote: 'Haven CIF Offerte Aanvragen',
    downloadLineCard: 'Lijnkaart Downloaden',
    fobCifReady: 'KLAAR VOOR FOB / CIF',
    qualityExportAssurance: 'Kwaliteits- en Exportgarantie',
    technicalSpecs: 'Technische Productspecificaties',
    exportGrade100: '100% Exportkwaliteit',
    certifiedAgroExporter: 'Gecertificeerde Indiase Agro-Food Exporteur',

    globalMerchantCapabilities: 'Wereldwijde Mogelijkheden van de Handelsexpediteur',
    engineeredTrade: 'Ontworpen voor Internationale Handel op Groot Volume',
    bridgeImporters: 'Wij verbinden wereldwijde importeurs, distributeurs en supermarktketens met gecertificeerde Indiase boerderijen, en verzorgen containerlogistiek, inklaring en private labeling.',
    containerConsolidation: 'Containerconsolidatie',
    containerConsolidationDesc: 'Beladingen in 20ft GP (18-20 MT) en 40ft High Cube (26-28 MT). Meerdere producten in één container voor proefzendingen.',
    mundraJnptPorts: 'Havens van Mundra & JNPT',
    mundraJnptPortsDesc: 'Directe havenbelading in Mundra (Gujarat) en JNPT Nhava Sheva (Mumbai) met snelle 48-uurs inklaring.',
    privateLabelPackaging: 'Private Label Verpakking',
    privateLabelPackagingDesc: 'Stazakken (100g tot 1kg) met stikstofspoeling, ritssluiting en master exportdozen met uw supermarktmerk.',
    auditReadyCompliance: 'Audits en Naleving',
    auditReadyComplianceDesc: 'Fytosanitaire certificering, Certificaat van Oorsprong (COO), Sortex lasersortering en volledige MRL residulaboratoriumtesten.',
  },

  ar: {
    home: 'الرئيسية',
    homeTitle: 'أغذية جاهزة للتصدير، من المصدر إلى الرف.',
    browseProducts: 'تصفح المنتجات',
    requestQuote: 'طلب عرض سعر',
    segments: 'القطاعات',
    partners: 'الشركاء',
    isoFssai: 'ISO · FSSAI',
    certified: 'معتمد',
    shipsFrom: 'الشحن من',
    viewAll: 'عرض الكل ←',
    allSegments: 'جميع القطاعات ←',
    readyToTalk: 'هل أنت مستعد للتحدث؟',
    buyingPrompt: 'أخبرنا بما تريد شراءه — سنرسل العينات والأسعار.',
    sendInquiry: 'إرسال استفسار',
    howWeWork: 'كيف نعمل',
    globalBridge: 'جسر واحد إلى المشترين حول العالم',
    nextShipment: 'الشحنة القادمة',
    featuredProducts: 'المنتجات المميزة',
    productSegments: 'قطاعات المنتجات',
    exploreCategory: 'استكشف حسب الفئة',
    collaborations: 'التعاون',
    companiesWeWorkWith: 'الشركات التي نعمل معها',
    downloadSheets: 'حمّل كتالوجات المنتجات وأوراق المواصفات. هل تحتاج شيئاً محدداً؟ أرسل لنا استفساراً.',
    downloads: 'التنزيلات',
    cataloguesLineCards: 'الكتالوجات وبطاقات المنتجات',
    noBrochures: 'لا توجد كتيبات بعد',
    uploadPdfs: 'حمّل ملفات PDF من لوحة الإدارة.',
    viewRange: 'عرض المجموعة ←',
    visitWebsite: 'زيارة الموقع ←',
    loading: 'جارٍ التحميل…',
    previousSlide: 'الشريحة السابقة',
    nextSlide: 'الشريحة التالية',
    toggleMenu: 'تبديل القائمة',
    adminSignIn: 'تسجيل دخول المسؤول',
    manageProductsPartnersInquiries: 'إدارة المنتجات والشركاء والاستفسارات.',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    dashboard: 'لوحة التحكم',
    dashboardDesc: 'نظرة عامة على الكتالوج والاستفسارات.',
    quickActions: 'إجراءات سريعة',
    addProduct: 'إضافة منتج',
    addSegment: 'إضافة قطاع',
    addPartner: 'إضافة شريك',
    uploadBrochure: 'تحميل كتيب',
    inquiries: 'الاستفسارات',
    inquiriesDesc: 'الرسائل المرسلة عبر نموذج الاستفسار في الموقع.',
    replyEmail: 'الرد عبر البريد الإلكتروني',
    delete: 'حذف',
    edit: 'تعديل',
    cancel: 'إلغاء',
    noItems: 'لا توجد عناصر بعد.',
    segmentsDesc: 'فئات المنتجات المعروضة في الموقع.',
    subSegments: 'القطاعات الفرعية',
    subSegmentsDesc: 'إدارة الفئات من المستوى الثاني داخل كل قطاع.',
    noSubsegments: 'لا توجد قطاعات فرعية لهذا القطاع بعد.',
    createSegmentFirst: 'أنشئ قطاعاً أولاً.',
    partnersDesc: 'الشركات المتعاونة التي تعرض منتجاتها.',
    noPartners: 'لا يوجد شركاء بعد.',
    addPartners: 'أضف شركات شريكة من لوحة الإدارة.',
    productsDesc: 'الكتالوج الذي يتصفحه المشترون ويستفسرون عنه.',
    product: 'المنتج',
    segment: 'القطاع',
    subSegment: 'القطاع الفرعي',
    partner: 'الشريك',
    flags: 'الحالات',
    actions: 'الإجراءات',
    featured: 'مميز',
    hidden: 'مخفي',
    noProducts: 'لا توجد منتجات بعد.',
    name: 'الاسم',
    description: 'الوصف',
    order: 'الترتيب',
    visibleSite: 'ظاهر على الموقع',
    parentSegment: 'القطاع الرئيسي *',
    selectSegment: 'اختر القطاع…',
    none: 'لا شيء',
    noSubsegmentsForSegment: 'لا توجد قطاعات فرعية مضافة لهذا القطاع.',
    shortDescription: 'وصف مختصر',
    fullDescription: 'الوصف الكامل',
    origin: 'المنشأ',
    hsCode: 'رمز HS',
    packaging: 'التغليف',
    moq: 'الحد الأدنى للطلب',
    certifications: 'الشهادات (مفصولة بفواصل)',
    mainImage: 'الصورة الرئيسية',
    country: 'الدولة',
    website: 'الموقع الإلكتروني',
    logo: 'الشعار',
    title: 'العنوان',
    segmentOptional: 'القطاع (اختياري)',
    notTiedSegment: 'غير مرتبط بقطاع',
    pdfFile: 'ملف PDF *',
    attachPdf: 'يرجى إرفاق ملف PDF.',
    openPdf: 'فتح PDF',
    uploadBrochureTitle: 'تحميل كتيب',
    search: 'بحث',
    searchProducts: 'البحث عن المنتجات…',
    allPartners: 'جميع الشركاء',
    clear: 'مسح',
    prev: 'السابق',
    next: 'التالي',
    noMatch: 'لا توجد منتجات تطابق عوامل التصفية',
    tryClear: 'حاول مسح عوامل التصفية أو البحث بطريقة أخرى.',
    catalogue: 'الكتالوج',
    allProducts: 'جميع المنتجات',
    whatExport: 'ما نصدّره',
    browseRange: 'استكشف مجموعتنا حسب الفئة. يضم كل قطاع منتجات متعددة من الشركات الشريكة.',
    aboutUs: 'من نحن',
    aboutTagline: 'شريك تجاري قائم على الثقة والجودة والوثائق الواضحة.',
    specificProduct: 'هل تبحث عن منتج محدد؟',
    specificPrompt: 'أخبرنا بالمنتج والمواصفات والوجهة — وسنعود إليك بالخيارات والأسعار.',
    getInTouch: 'تواصل معنا',
    ourApproach: 'نهجنا',
    whatSetsApart: 'ما يميزنا',
    hsDocumentation: 'نتولى رموز HS والوثائق والتعبئة لضمان تخليص الشحنات بسلاسة.',
    samplesPricing: 'العينات والأسعار والخدمات اللوجستية لكل قطاع، بتنسيق من فريق واحد.',
    productNotFound: 'المنتج غير موجود',
    suppliedBy: 'مقدم من',
    boxSize: 'حجم الصندوق',
    packageType: 'نوع العبوة',
    flavour: 'النكهة',
    inquire: 'استفسر عن هذا المنتج',
    backToProducts: 'العودة إلى المنتجات',
    productDescription: 'وصف المنتج',
    relatedProducts: 'منتجات ذات صلة',
    segmentNotFound: 'القطاع غير موجود',
    backToSubsegments: 'العودة إلى القطاعات الفرعية',
    selectSubsegment: 'اختر قطاعاً فرعياً لعرض المنتجات المتاحة في هذه الفئة.',
    addProducts: 'أضف المنتجات من لوحة الإدارة واربطها بهذا القطاع الفرعي.',
    noSegmentProducts: 'لا توجد منتجات في هذا القطاع بعد',
    checkBack: 'يرجى العودة قريباً.',
    viewProduct: 'عرض المنتج ←',
    noImage: 'لا توجد صورة',
    backToCatalogue: 'العودة إلى الكتالوج',
    error404: 'خطأ 404',
    pageNotFound: 'الصفحة غير موجودة',
    pageMoved: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
    backHome: 'العودة للرئيسية',
    inquiryIntro: 'شارك المنتج والكمية والوجهة. يرد فريقنا بالعينات والمواصفات والأسعار.',
    phone: 'الهاتف',
    office: 'المكتب',
    inquirySent: 'تم إرسال الاستفسار',
    sendAnother: 'إرسال استفسار آخر',
    company: 'الشركة',
    productInterest: 'المنتج المطلوب',
    generalInquiry: 'استفسار عام',
    submitInquiry: 'إرسال الاستفسار',
    sending: 'جارٍ الإرسال…',
    specificProducts: 'منتجات محددة',
    message: 'الرسالة *',
    explore: 'استكشف',
    contact: 'اتصل بنا',
    admin: 'الإدارة',
    sendInquiryArrow: 'إرسال استفسار ←',
    viewSite: 'عرض الموقع',
    signOut: 'تسجيل الخروج',
    checkingSession: 'جارٍ التحقق من الجلسة…',
    close: 'إغلاق',
    image: 'الصورة',
    pasteImage: '…أو الصق رابط الصورة',

    getQuote: 'طلب عرض سعر',
    language: 'اللغة',
    brochures: 'الكتيبات',
    products: 'المنتجات',
    productCategories: 'المنتجات',
    productDetails: 'تفاصيل المنتج',
    subProducts: 'المنتجات الفرعية',
    blog: 'المدونة',
    allRightsReserved: 'جميع الحقوق محفوظة.',
    newsletterTitle: 'معلومات سوق التصدير',
    stayUpdated: 'احصل على تحديثات فورية لأسواق المحاصيل',
    newsletterDesc: 'اشترك لتلقي تنبيهات فورية عند إضافة سلع زراعية أو توابل جديدة أو نشر تقارير تجارية.',
    enterYourEmail: 'أدخل بريدك الإلكتروني التجاري…',
    subscribe: 'اشتراك',
    subscribing: 'جارٍ الاشتراك…',
    featuredShowcase: 'عرض مميز للمنتجات',
    curvedFanArc: 'عرض القوس المنحني',
    spinWheel: 'عجلة الدوران ثلاثية الأبعاد',
    inspectSpec: 'فحص المواصفات',
    pauseSpin: 'إيقاف مؤقت للدوران',
    autoSpin: 'دوران تلقائي',
    clearAllFilters: 'مسح جميع عوامل التصفية',
    exportPurity: 'نقاء التصدير بأعلى المعايير',
    exporterCommitment: 'التزام المصدر التجاري',
    liveExportPort: 'ميناء التصدير المباشر',
    verifiedMerchantExporter: 'مصدّر تجاري هندي معتمد',
    requestContainerQuote: 'طلب عرض سعر الشحن CIF',
    downloadLineCard: 'تحميل بطاقة المنتجات',
    fobCifReady: 'جاهز للشحن FOB / CIF',
    qualityExportAssurance: 'ضمان الجودة والتصدير',
    technicalSpecs: 'المواصفات الفنية للمنتج',
    exportGrade100: 'درجة تصدير 100%',
    certifiedAgroExporter: 'مصدّر أغذية زراعية هندي معتمد',

    globalMerchantCapabilities: 'إمكانيات التصدير الغذائي العالمي',
    engineeredTrade: 'مصممة للتجارة الدولية عالية الحجم',
    bridgeImporters: 'نحن نربط المستوردين والموزعين وسلاسل السوبرماركت حول العالم بالمزارع الهندية المعتمدة، مع إدارة لوجستيات الحاويات والتخليص الجمركي والتعبئة الخاصة.',
    containerConsolidation: 'تجميع وتعبئة الحاويات',
    containerConsolidationDesc: 'حاويات 20 قدماً (18-20 طن متري) و 40 قدماً High Cube (26-28 طن متري). تجميع سلع متعددة في حاوية واحدة للطلبات التجريبية.',
    mundraJnptPorts: 'موانئ موندرا و JNPT',
    mundraJnptPortsDesc: 'تعبئة وشحن الحاويات مباشرة من ميناء موندرا (غوجارات) وميناء JNPT نافا شيفا (مومباي) مع تخليص جمركي سريع خلال 48 ساعة.',
    privateLabelPackaging: 'التعبئة والتغليف بالعلامة التجارية الخاصة',
    privateLabelPackagingDesc: 'أكياس قائمة مخصصة مزودة بحاجز وغاز النيتروجين (100 غرام إلى 1 كغم) مع سحاب وكراتين تصدير تحمل علامتكم التجارية.',
    auditReadyCompliance: 'الامتثال والفحص المعتمد',
    auditReadyComplianceDesc: 'شهادة الصحة النباتية، شهادة المنشأ (COO)، التنظيف بالليزر Sortex، وفحوصات مخبرية شاملة لمتبقيات المبيدات MRL.',
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      // If first visit or new browser session, ALWAYS strictly default to 'en'
      if (typeof window !== 'undefined') {
        const sessionActive = sessionStorage.getItem('nmc_session_active');
        if (!sessionActive) {
          sessionStorage.setItem('nmc_session_active', '1');
          localStorage.setItem('nmc-language', 'en');
          return 'en';
        }
      }
      const saved = localStorage.getItem('nmc-language');
      // Strictly enforce English ('en') as permanent default unless user explicitly chose a supported language in this session
      if (saved && ['en', 'es', 'nl', 'ar'].includes(saved)) {
        return saved;
      }
      return 'en';
    } catch (_) {
      return 'en';
    }
  });

  const location = useLocation();
  const isAdmin = Boolean(
    location?.pathname && (
      location.pathname.startsWith('/admin') ||
      location.pathname.startsWith('/portal') ||
      location.pathname.startsWith('/staff') ||
      location.pathname.startsWith('/manage')
    )
  );

  // Sync Google Translate Cookie & Element
  const syncGoogleTranslate = (lang, forceEnglish = false) => {
    if (typeof window === 'undefined') return;
    try {
      const activeLang = forceEnglish ? 'en' : lang;
      const hostParts = window.location.hostname.split('.');
      const cookieDomains = [
        '',
        window.location.hostname,
        '.' + window.location.hostname,
        hostParts.length > 1 ? '.' + hostParts.slice(-2).join('.') : null,
      ].filter(Boolean);

      const paths = ['/', window.location.pathname];

      if (activeLang === 'en') {
        cookieDomains.forEach((domain) => {
          paths.forEach((path) => {
            document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};${domain ? ` domain=${domain};` : ''}`;
            document.cookie = `googtrans=/en/en; path=${path};${domain ? ` domain=${domain};` : ''}`;
          });
        });
      } else {
        const val = `/en/${activeLang}`;
        cookieDomains.forEach((domain) => {
          paths.forEach((path) => {
            document.cookie = `googtrans=${val}; path=${path};${domain ? ` domain=${domain};` : ''}`;
          });
        });
      }

      // Trigger hidden Google combo box if already mounted
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        const targetVal = activeLang === 'en'
          ? (combo.querySelector('option[value="en"]') ? 'en' : '')
          : activeLang;
        if (combo.value !== targetVal) {
          combo.value = targetVal;
          combo.dispatchEvent(new Event('change'));
        }
      }
    } catch (_) {}
  };

  useEffect(() => {
    try {
      localStorage.setItem('nmc-language', language);
    } catch (_) {}

    // 1. ADMIN PANEL ISOLATION: Strict English & LTR
    if (isAdmin) {
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
      document.documentElement.classList.add('notranslate');
      syncGoogleTranslate('en', true);
      return;
    }

    // 2. PUBLIC WEBSITE: Set document attributes and sync Google Translate engine
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.classList.remove('notranslate');
    syncGoogleTranslate(language, false);

    // 3. IN-APP INSTANT DICTIONARY TRANSLATOR (multidirectional across en, es, nl, ar)
    const dict = translations[language] || {};
    const supportedLangs = ['en', 'es', 'nl', 'ar'];

    const normalizeString = (str) => {
      if (!str) return '';
      return str
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u2013\u2014]/g, '-')
        .replace(/\s+/g, ' ')
        .trim();
    };

    const textMap = new Map();

    // Map from ALL languages into the active target language
    Object.keys(translations.en).forEach((key) => {
      const targetText = dict[key] || translations.en[key];
      if (!targetText) return;

      // Register phrases from EVERY supported language pointing to the current targetText
      supportedLangs.forEach((langCode) => {
        const sourceText = translations[langCode]?.[key];
        if (sourceText && sourceText !== targetText) {
          const sTrim = sourceText.trim();
          textMap.set(sTrim, targetText.trim());
          textMap.set(sTrim.toLowerCase(), targetText.trim());

          const sNorm = normalizeString(sourceText);
          textMap.set(sNorm, targetText.trim());
          textMap.set(sNorm.toLowerCase(), targetText.trim());
        }
      });

      // Special handling for Quote buttons, common casings and variations
      if (key === 'getQuote' || key === 'requestQuote') {
        ['Get a Quote', 'get a quote', 'Get a quote', 'Request a quote', 'Request a Quote', 'Request a quote →', 'Get a Quote ↗', 'Request Port CIF Quote', 'Request Volume Quotation'].forEach((v) => {
          const clean = v.replace(/[→←:\?\.•|!\s↗]+$/g, '').trim();
          if (clean !== targetText) {
            textMap.set(clean, targetText.trim());
            textMap.set(clean.toLowerCase(), targetText.trim());
          }
        });
      }

      if (key === 'sendInquiry') {
        ['Send an inquiry', 'send an inquiry', 'Send an inquiry →', 'Send an Inquiry'].forEach((v) => {
          const clean = v.replace(/[→←:\?\.•|!\s↗]+$/g, '').trim();
          if (clean !== targetText) {
            textMap.set(clean, targetText.trim());
            textMap.set(clean.toLowerCase(), targetText.trim());
          }
        });
      }

      if (key === 'buyingPrompt') {
        [
          "Tell us what you're buying — we'll send samples and pricing.",
          "Tell us what you're buying - we'll send samples and pricing.",
          "Tell us what you’re buying — we’ll send samples and pricing.",
          "Tell us what you’re buying - we’ll send samples and pricing."
        ].forEach((v) => {
          textMap.set(v.trim(), targetText.trim());
          textMap.set(v.trim().toLowerCase(), targetText.trim());
        });
      }

      if (key === 'stayUpdated') {
        [
          'Get Instant Agro Market & Harvest Updates',
          'get instant agro market & harvest updates',
        ].forEach((v) => {
          textMap.set(v.trim(), targetText.trim());
          textMap.set(v.trim().toLowerCase(), targetText.trim());
        });
      }

      if (key === 'newsletterTitle') {
        [
          'Exporter Market Intelligence',
          'exporter market intelligence',
          'EXPORTER MARKET INTELLIGENCE',
        ].forEach((v) => {
          textMap.set(v.trim(), targetText.trim());
          textMap.set(v.trim().toLowerCase(), targetText.trim());
        });
      }

      if (key === 'newsletterDesc') {
        [
          'Subscribe to receive immediate alerts when new agro commodities, spices, or market trade reports are published.',
        ].forEach((v) => {
          textMap.set(v.trim(), targetText.trim());
          textMap.set(v.trim().toLowerCase(), targetText.trim());
        });
      }

      if (key === 'enterYourEmail') {
        [
          'Enter your business email…',
          'Enter your business email...',
          'Enter your business email',
        ].forEach((v) => {
          textMap.set(v.trim(), targetText.trim());
          textMap.set(v.trim().toLowerCase(), targetText.trim());
        });
      }

      if (key === 'subscribe') {
        ['Subscribe', 'subscribe', 'Subscribe →'].forEach((v) => {
          const clean = v.replace(/[→←:\?\.•|!\s↗]+$/g, '').trim();
          if (clean !== targetText) {
            textMap.set(clean, targetText.trim());
            textMap.set(clean.toLowerCase(), targetText.trim());
          }
        });
      }
    });

    const translateValue = (raw) => {
      if (!raw) return raw;
      const trimmed = raw.trim();
      if (!trimmed) return raw;

      if (textMap.has(trimmed)) {
        const val = textMap.get(trimmed);
        if (val === trimmed) return raw;
        return raw.replace(trimmed, val);
      }
      const lower = trimmed.toLowerCase();
      if (textMap.has(lower)) {
        const val = textMap.get(lower);
        if (val.toLowerCase() === lower) return raw;
        return raw.replace(trimmed, val);
      }

      const norm = normalizeString(trimmed);
      if (textMap.has(norm)) {
        const val = textMap.get(norm);
        if (val === norm) return raw;
        return raw.replace(trimmed, val);
      }
      const normLower = norm.toLowerCase();
      if (textMap.has(normLower)) {
        const val = textMap.get(normLower);
        if (val.toLowerCase() === normLower) return raw;
        return raw.replace(trimmed, val);
      }

      // Check without trailing punctuation only if trimmed actually contains trailing punctuation
      const cleanPunct = trimmed.replace(/[→←:\?\.•|!\s↗]+$/g, '').trim();
      if (cleanPunct && cleanPunct !== trimmed) {
        if (textMap.has(cleanPunct)) {
          const val = textMap.get(cleanPunct);
          if (val === trimmed || val === cleanPunct) return raw;
          return raw.replace(trimmed, val);
        }
        const cleanLower = cleanPunct.toLowerCase();
        if (textMap.has(cleanLower)) {
          const val = textMap.get(cleanLower);
          if (val.toLowerCase() === cleanLower || val.toLowerCase() === trimmed.toLowerCase()) return raw;
          return raw.replace(trimmed, val);
        }
        const cleanNorm = normalizeString(cleanPunct);
        if (textMap.has(cleanNorm)) {
          const val = textMap.get(cleanNorm);
          if (val === cleanNorm || val === trimmed) return raw;
          return raw.replace(trimmed, val);
        }
      }
      return raw;
    };

    const isInsideAdmin = (el) => {
      if (!el || el === document.body || el === document.documentElement) return false;
      const isolated = el.closest?.('.notranslate, [translate="no"]');
      if (isolated && isolated !== document.documentElement && isolated !== document.body) {
        return true;
      }
      return Boolean(el.closest?.('.admin-panel, .admin-workspace, [data-admin="true"], script, style'));
    };

    const translateTextNode = (node) => {
      if (isInsideAdmin(node.parentElement)) return;

      const raw = node.nodeValue;
      if (!raw || !raw.trim()) return;

      const translated = translateValue(raw);
      if (translated && translated !== node.nodeValue) {
        node.nodeValue = translated;
      }
    };

    const translateAttributes = (el) => {
      if (isInsideAdmin(el)) return;

      ['placeholder', 'aria-label', 'title', 'alt'].forEach((attr) => {
        if (!el.hasAttribute?.(attr)) return;
        const val = el.getAttribute(attr);
        if (!val || !val.trim()) return;

        const translated = translateValue(val);
        if (translated && translated !== val) {
          el.setAttribute(attr, translated);
        }
      });
    };

    const runTranslation = () => {
      if (isAdmin) return;
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const textNodes = [];
      let current;
      while ((current = walker.nextNode())) {
        if (isInsideAdmin(current.parentElement)) continue;
        textNodes.push(current);
      }
      textNodes.forEach(translateTextNode);
      document
        .querySelectorAll('input,textarea,button,a,img,[title],[aria-label]')
        .forEach((el) => {
          if (!isInsideAdmin(el)) {
            translateAttributes(el);
          }
        });
    };

    runTranslation();

    const observer = new MutationObserver(() => {
      observer.disconnect();
      runTranslation();
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    });

    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    return () => observer.disconnect();
  }, [language, isAdmin, location.pathname]);

  const value = useMemo(
    () => ({
      language,
      setLanguage: (newLang) => {
        setLanguage(newLang);
        // Instant Google Translate sync upon user interaction
        syncGoogleTranslate(newLang, isAdmin);
      },
      isAdmin,
      t: (key) => {
        // Admin panel always receives pure English translations
        if (isAdmin) {
          return translations.en?.[key] ?? key;
        }
        return translations[language]?.[key] ?? translations.en?.[key] ?? key;
      },
    }),
    [language, isAdmin]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
