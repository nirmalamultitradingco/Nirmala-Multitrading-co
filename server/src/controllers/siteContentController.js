import SiteContent from '../models/SiteContent.js';
import { asyncHandler } from '../utils/sendEmail.js';

const getOrCreate = async () => {
  let content = await SiteContent.findOne({ key: 'main' });
  if (!content) {
    content = await SiteContent.create({ key: 'main' });
  }

  let modified = false;
  if (!content.globalMap || !content.globalMap.regions || content.globalMap.regions.length === 0) {
    const fresh = new SiteContent();
    content.globalMap = fresh.globalMap;
    modified = true;
  } else if (!content.globalMap.pillars || content.globalMap.pillars.length === 0) {
    const fresh = new SiteContent();
    content.globalMap.pillars = fresh.globalMap.pillars;
    modified = true;
  }

  if (!content.certificates || !content.certificates.items || content.certificates.items.length === 0) {
    const fresh = new SiteContent();
    content.certificates = fresh.certificates;
    modified = true;
  }

  if (!content.flashCard || !content.flashCard.title) {
    const fresh = new SiteContent();
    content.flashCard = fresh.flashCard;
    modified = true;
  }

  if (!content.chatbot || !content.chatbot.botName) {
    const fresh = new SiteContent();
    content.chatbot = fresh.chatbot;
    modified = true;
  }

  if (!content.newArrivals || !content.newArrivals.title) {
    const fresh = new SiteContent();
    content.newArrivals = fresh.newArrivals;
    modified = true;
  }

  if (!content.productsPage || !content.productsPage.hero) {
    const fresh = new SiteContent();
    content.productsPage = fresh.productsPage;
    modified = true;
  } else {
    const fresh = new SiteContent();
    let subModified = false;
    if (!content.productsPage.showcase) {
      content.productsPage.showcase = fresh.productsPage.showcase;
      subModified = true;
    } else {
      if (content.productsPage.showcase.isActive === undefined) {
        content.productsPage.showcase.isActive = true;
        subModified = true;
      }
      if (content.productsPage.showcase.showcaseBadge === undefined) {
        content.productsPage.showcase.showcaseBadge = 'FEATURED FOOD SHOWCASE';
        subModified = true;
      }
    }
    if (!content.productsPage.bento || !content.productsPage.bento.headline) {
      content.productsPage.bento = fresh.productsPage.bento;
      subModified = true;
    }
    if (!content.productsPage.trustBar || !content.productsPage.trustBar.items || content.productsPage.trustBar.items.length === 0) {
      content.productsPage.trustBar = fresh.productsPage.trustBar;
      subModified = true;
    }
    if (!content.productsPage.ctaBanner || !content.productsPage.ctaBanner.title) {
      content.productsPage.ctaBanner = fresh.productsPage.ctaBanner;
      subModified = true;
    }
    if (subModified) {
      content.markModified('productsPage');
      modified = true;
    }
  }

  if (!content.header || !content.header.brandName) {
    const fresh = new SiteContent();
    content.header = fresh.header;
    modified = true;
  }

  if (!content.footer || !content.footer.brandFullName) {
    const fresh = new SiteContent();
    content.footer = fresh.footer;
    modified = true;
  }

  if (!content.loader) {
    const fresh = new SiteContent();
    content.loader = fresh.loader;
    modified = true;
  } else {
    // Ensure missing subproperties are filled without overwriting user customization
    const fresh = new SiteContent();
    const defaultLoaderObj = fresh.loader.toObject ? fresh.loader.toObject() : fresh.loader;
    let loaderSubModified = false;
    for (const key of Object.keys(defaultLoaderObj)) {
      if (content.loader[key] === undefined) {
        content.loader[key] = defaultLoaderObj[key];
        loaderSubModified = true;
      }
    }
    if (loaderSubModified) {
      content.markModified('loader');
      modified = true;
    }
  }

  if (content.engineerTrade) {
    let engModified = false;
    if (content.engineerTrade.ctaTitle === undefined) {
      content.engineerTrade.ctaTitle = 'Planning full container load (FCL) or multi-product shipments?';
      engModified = true;
    }
    if (content.engineerTrade.ctaSubtitle === undefined) {
      content.engineerTrade.ctaSubtitle = 'Direct liaison with Mundra and JNPT port customs brokers for swift container dispatch.';
      engModified = true;
    }
    if (content.engineerTrade.ctaButtonText === undefined) {
      content.engineerTrade.ctaButtonText = 'Get a quote';
      engModified = true;
    }
    if (content.engineerTrade.ctaButtonLink === undefined) {
      content.engineerTrade.ctaButtonLink = '/inquiry';
      engModified = true;
    }
    if (engModified) {
      content.markModified('engineerTrade');
      modified = true;
    }
  }

  if (content.homeHero) {
    let heroModified = false;
    if (content.homeHero.primaryButtonText === undefined) {
      content.homeHero.primaryButtonText = 'Browse products';
      heroModified = true;
    }
    if (content.homeHero.primaryButtonLink === undefined) {
      content.homeHero.primaryButtonLink = '/products';
      heroModified = true;
    }
    if (content.homeHero.secondaryButtonText === undefined) {
      content.homeHero.secondaryButtonText = 'Get a quote';
      heroModified = true;
    }
    if (content.homeHero.secondaryButtonLink === undefined) {
      content.homeHero.secondaryButtonLink = '/inquiry';
      heroModified = true;
    }
    if (content.homeHero.livePortLabel === undefined) {
      content.homeHero.livePortLabel = 'LIVE EXPORT PORT';
      heroModified = true;
    }
    if (content.homeHero.apedaRegText === undefined) {
      content.homeHero.apedaRegText = 'APEDA REG: 218903';
      heroModified = true;
    }
    if (content.homeHero.spicesBoardText === undefined) {
      content.homeHero.spicesBoardText = 'SPICES BOARD OF INDIA';
      heroModified = true;
    }
    if (heroModified) {
      content.markModified('homeHero');
      modified = true;
    }
  }

  if (content.aboutHero) {
    let aboutHeroModified = false;
    if (!content.aboutHero.badges || !content.aboutHero.badges.length) {
      content.aboutHero.badges = [
        '✓ APEDA & Spice Board Registered',
        '✓ Port Direct Mundra & JNPT',
        '✓ 40+ Destination Ports',
      ];
      aboutHeroModified = true;
    }
    if (aboutHeroModified) {
      content.markModified('aboutHero');
      modified = true;
    }
  }

  if (content.globalMap?.regions?.length) {
    let mapModified = false;
    content.globalMap.regions.forEach((reg) => {
      if (!reg.badge) {
        reg.badge = 'SCHEDULED EXPORT CORRIDOR';
        mapModified = true;
      }
      if (!reg.serviceType) {
        reg.serviceType = 'FCL & LCL Containerized Service';
        mapModified = true;
      }
      if (!reg.originsText) {
        reg.originsText = 'Origins: Mundra / JNPT Ports';
        mapModified = true;
      }
      if (!reg.volumeGrowth) {
        reg.volumeGrowth = '+34%';
        mapModified = true;
      }
      if (!reg.containersServed) {
        reg.containersServed = '250+ TEU';
        mapModified = true;
      }
    });
    if (mapModified) {
      content.markModified('globalMap');
      modified = true;
    }
  }

  const checkFields = [
    'featuredSection',
    'exploreProductsSection',
    'partnersSection',
    'homeCta',
    'aboutCommitment',
    'aboutCta',
  ];
  checkFields.forEach((f) => {
    if (!content[f] || (typeof content[f] === 'object' && Object.keys(content[f]).length === 0)) {
      const fresh = new SiteContent();
      content[f] = fresh[f];
      modified = true;
    }
  });

  if (content.brochuresHero) {
    if (content.brochuresHero.showBadges === undefined) {
      content.brochuresHero.showBadges = true;
      modified = true;
    }
    if (!Array.isArray(content.brochuresHero.badges) || content.brochuresHero.badges.length === 0) {
      content.brochuresHero.badges = [
        { text: 'Verified Export Specs', color: 'gold', link: '' },
        { text: 'Direct PDF Downloads', color: 'emerald', link: '' },
        { text: 'Container Payload Data', color: 'blue', link: '' },
      ];
      content.markModified('brochuresHero');
      modified = true;
    }
  }

  if (modified) {
    await content.save();
  }

  return content;
};

export const getSiteContent = asyncHandler(async (req, res) => {
  const content = await getOrCreate();
  res.json(content);
});

export const updateSiteContent = asyncHandler(async (req, res) => {
  const allowed = [
    'header',
    'footer',
    'loader',
    'homeHero',
    'aboutHero',
    'inquiryHero',
    'aboutApproach',
    'homeOfferings',
    'homeHowWeWork',
    'aboutWhyChooseUs',
    'testimonials',
    'globalMap',
    'certificates',
    'engineerTrade',
    'flashCard',
    'chatbot',
    'newArrivals',
    'productsPage',
    'featuredSection',
    'exploreProductsSection',
    'partnersSection',
    'homeCta',
    'aboutCommitment',
    'aboutCta',
    'brochuresHero',
    'partnersPage',
    'blogHero',
    'favicon',
    'faviconText',
    'faviconSubtext',
    'faviconFit',
    'faviconBg',
    'faviconShape',
    'faviconPadding',
    'faviconScale',
    'faviconOffsetX',
    'faviconOffsetY',
    'faviconAlignedDataUrl',
    'siteTitle',
    'metaDescription',
  ];
  const update = {};

  allowed.forEach((key) => {
    if (req.body[key] !== undefined) update[key] = req.body[key];
  });

  if (update.loader && typeof update.loader === 'object') {
    if (
      update.loader.durationSeconds === '' ||
      update.loader.durationSeconds === null ||
      update.loader.durationSeconds === undefined ||
      isNaN(Number(update.loader.durationSeconds))
    ) {
      update.loader.durationSeconds = 2.5;
    } else {
      update.loader.durationSeconds = Number(update.loader.durationSeconds);
    }
  }

  const content = await SiteContent.findOneAndUpdate(
    { key: 'main' },
    { $set: update, $setOnInsert: { key: 'main' } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.json(content);
});

