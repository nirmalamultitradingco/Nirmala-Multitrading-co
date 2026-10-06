import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const COMMAND_ITEMS = [
  // ⚡ QUICK ACTIONS
  {
    id: 'act-new-product',
    title: 'Add New Product',
    category: 'Quick Actions',
    icon: '🏷️',
    desc: 'Create a new agro-food export product with specs & packaging',
    to: '/admin/products?action=new',
    keywords: ['add', 'create', 'new product', 'item', 'inventory', 'spices', 'rice'],
  },
  {
    id: 'act-new-category',
    title: 'Add Product Category',
    category: 'Quick Actions',
    icon: '📦',
    desc: 'Create a primary commodity segment (e.g. Spices, Grains)',
    to: '/admin/segments?action=new',
    keywords: ['add', 'new category', 'segment', 'create category'],
  },
  {
    id: 'act-new-brochure',
    title: 'Upload PDF Line Card / Brochure',
    category: 'Quick Actions',
    icon: '📄',
    desc: 'Upload a downloadable product PDF catalogue line card',
    to: '/admin/brochures?action=new',
    keywords: ['upload', 'brochure', 'pdf', 'line card', 'catalogue'],
  },
  {
    id: 'act-new-blog',
    title: 'Write Blog & Market Insights Article',
    category: 'Quick Actions',
    icon: '📰',
    desc: 'Publish agro-export news, harvest updates, or market report',
    to: '/admin/blog?action=new',
    keywords: ['blog', 'article', 'news', 'write', 'post', 'publish'],
  },
  {
    id: 'act-new-partner',
    title: 'Add Producer / Partner Mill',
    category: 'Quick Actions',
    icon: '🤝',
    desc: 'Register a verified food manufacturer, mill, or FPO partner',
    to: '/admin/partners?action=new',
    keywords: ['partner', 'supplier', 'producer', 'mill', 'fpo', 'add partner'],
  },

  // 📁 MANAGEMENT HUBS
  {
    id: 'page-dashboard',
    title: 'Dashboard Overview',
    category: 'Management Pages',
    icon: '📊',
    desc: 'Operational summary, RFQ stats, and quick performance cards',
    to: '/admin',
    keywords: ['home', 'dashboard', 'overview', 'stats', 'analytics', 'start'],
  },
  {
    id: 'page-inquiries',
    title: 'Buyer Inquiries & RFQs',
    category: 'Management Pages',
    icon: '✉️',
    desc: 'Review buyer quote requests, export inquiries, and customer contact data',
    to: '/admin/inquiries',
    badge: 'Priority',
    keywords: ['inquiries', 'quotes', 'rfq', 'leads', 'buyers', 'orders', 'messages'],
  },
  {
    id: 'page-products',
    title: 'Products Catalogue',
    category: 'Management Pages',
    icon: '🏷️',
    desc: 'View, filter, edit, clone and delete products, packaging & MOQ',
    to: '/admin/products',
    keywords: ['products', 'catalogue', 'items', 'food', 'spices', 'grains', 'list'],
  },
  {
    id: 'page-categories',
    title: 'Product Categories (Segments)',
    category: 'Management Pages',
    icon: '📦',
    desc: 'Manage main product categories, cover photos, and descriptions',
    to: '/admin/segments',
    keywords: ['categories', 'segments', 'groups', 'manage categories'],
  },
  {
    id: 'page-subsegments',
    title: 'Sub-Categories Classification',
    category: 'Management Pages',
    icon: '📑',
    desc: 'Secondary tier classifications under main categories',
    to: '/admin/subsegments',
    keywords: ['subsegments', 'sub-categories', 'classification', 'subgroups'],
  },
  {
    id: 'page-brochures',
    title: 'Brochures & PDF Line Cards',
    category: 'Management Pages',
    icon: '📄',
    desc: 'Manage all downloadable PDF line cards and category associations',
    to: '/admin/brochures',
    keywords: ['brochures', 'downloads', 'line cards', 'pdf', 'files'],
  },
  {
    id: 'page-subscribers',
    title: 'Newsletter Subscribers & Broadcast',
    category: 'Management Pages',
    icon: '📬',
    desc: 'Export buyer subscriber emails and send HTML broadcast announcements',
    to: '/admin/subscribers',
    keywords: ['subscribers', 'emails', 'newsletter', 'broadcast', 'mail'],
  },
  {
    id: 'page-partners',
    title: 'Partners & Certified Producers',
    category: 'Management Pages',
    icon: '🤝',
    desc: 'Manage supplier listings, processing facilities, and onboarding banner',
    to: '/admin/partners',
    keywords: ['partners', 'suppliers', 'mills', 'producers'],
  },
  {
    id: 'page-blog',
    title: 'Blog & Trade Intelligence Articles',
    category: 'Management Pages',
    icon: '📰',
    desc: 'Articles on commodity prices, harvest reports, and export compliance',
    to: '/admin/blog',
    keywords: ['blog', 'news', 'articles', 'market reports'],
  },
  {
    id: 'page-profile',
    title: 'Admin Profile & Security',
    category: 'Management Pages',
    icon: '👤',
    desc: 'Update email address, phone number, and change master password',
    to: '/admin/profile',
    keywords: ['profile', 'account', 'password', 'security', 'credentials', 'email'],
  },

  // ⚙️ WEBSITE CMS & EDITABLE SECTIONS
  {
    id: 'cms-brochures',
    title: 'Brochures Page Header & Video Screen',
    category: 'Website Content CMS',
    icon: '📑',
    desc: 'Edit luxury hero slider, Buyer Assurance card, and photo/video mini screen',
    to: '/admin/content?tab=brochures_cms',
    badge: 'Popular',
    keywords: ['brochure header', 'small screen', 'video screen', 'buyer assurance', 'brochure video', 'slider'],
  },
  {
    id: 'cms-home-hero',
    title: 'Home Hero Video & Ad Slider',
    category: 'Website Content CMS',
    icon: '🎬',
    desc: 'Edit homepage main video background, text headlines, and ad banner slides',
    to: '/admin/content?tab=home_hero',
    badge: 'Popular',
    keywords: ['home hero', 'homepage video', 'hero slider', 'video banner', 'main video'],
  },
  {
    id: 'cms-header',
    title: 'Header, Logo & Favicon Branding',
    category: 'Website Content CMS',
    icon: '🔝',
    desc: 'Edit website logo, navigation links, company name, and browser tab favicon',
    to: '/admin/content?tab=header_cms',
    keywords: ['logo', 'favicon', 'header', 'navbar', 'brand name', 'title'],
  },
  {
    id: 'cms-footer',
    title: 'Footer & Corporate Contact Info',
    category: 'Website Content CMS',
    icon: '🔻',
    desc: 'Edit company address, phone, email, registration badges, and footer links',
    to: '/admin/content?tab=footer_cms',
    keywords: ['footer', 'address', 'phone', 'contact info', 'email', 'copyright'],
  },
  {
    id: 'cms-loader',
    title: 'Brand Loader Welcome Screen',
    category: 'Website Content CMS',
    icon: '⏳',
    desc: 'Configure the luxury animated brand loading screen and duration timer',
    to: '/admin/content?tab=loader_cms',
    keywords: ['loader', 'splash screen', 'loading animation', 'welcome screen'],
  },
  {
    id: 'cms-featured',
    title: 'Featured Products Section Heading',
    category: 'Website Content CMS',
    icon: '⭐',
    desc: 'Customize homepage featured commodity showcase titles & description',
    to: '/admin/content?tab=featured_section',
    keywords: ['featured products', 'home showcase', 'featured'],
  },
  {
    id: 'cms-explore',
    title: 'Explore Products Section CMS',
    category: 'Website Content CMS',
    icon: '🌾',
    desc: 'Edit homepage category exploration grid headline and subtext',
    to: '/admin/content?tab=explore_products',
    keywords: ['explore products', 'categories section', 'agro commodities'],
  },
  {
    id: 'cms-new-arrivals',
    title: 'New Product Arrivals Showcase',
    category: 'Website Content CMS',
    icon: '🌟',
    desc: 'Highlight recent seasonal harvests and new product launches',
    to: '/admin/content?tab=new_arrivals',
    keywords: ['new arrivals', 'latest harvest', 'seasonal'],
  },
  {
    id: 'cms-engineer',
    title: 'Engineer High-Volume Trade Section',
    category: 'Website Content CMS',
    icon: '🚢',
    desc: 'Configure seaport loading TEU metrics, container logistics, and FOB terms',
    to: '/admin/content?tab=engineer_trade',
    keywords: ['engineer trade', 'shipping', 'ports', 'mundra', 'jnpt', 'containers'],
  },
  {
    id: 'cms-map',
    title: 'Global Export Trade Map & Hubs',
    category: 'Website Content CMS',
    icon: '🌐',
    desc: 'Interactive world map corridors, destination countries, and port routes',
    to: '/admin/content?tab=map',
    keywords: ['map', 'global map', 'corridors', 'destination ports', 'shipping routes'],
  },
  {
    id: 'cms-certificates',
    title: 'International Quality Certifications',
    category: 'Website Content CMS',
    icon: '📜',
    desc: 'Upload and manage APEDA, FSSAI, ISO 22000, and Spice Board certificates',
    to: '/admin/content?tab=certificates',
    keywords: ['certificates', 'apeda', 'iso', 'fssai', 'compliance', 'lab'],
  },
  {
    id: 'cms-chatbot',
    title: 'TradeMitra AI Assistant Settings',
    category: 'Website Content CMS',
    icon: '🤖',
    desc: 'Configure automated buyer Q&A bot responses and contact escalation desk',
    to: '/admin/content?tab=chatbot',
    keywords: ['chatbot', 'ai', 'trademitra', 'auto reply', 'bot'],
  },
  {
    id: 'cms-flashcard',
    title: 'Flash Card / Promo Popup Notice',
    category: 'Website Content CMS',
    icon: '⚡',
    desc: 'Display high-priority seasonal discounts, price bulletins, or harvest alerts',
    to: '/admin/content?tab=flashcard',
    keywords: ['flashcard', 'popup', 'promo', 'announcement', 'modal'],
  },
  {
    id: 'cms-products-page',
    title: 'Products Page CMS Banners',
    category: 'Website Content CMS',
    icon: '🛍️',
    desc: 'Edit /products page hero headline, bento showcase, and trust badges',
    to: '/admin/content?tab=products_page',
    keywords: ['products page', 'bento', 'products hero', 'showcase'],
  },
  {
    id: 'cms-about',
    title: 'About Us Page Content & Pillars',
    category: 'Website Content CMS',
    icon: '🏢',
    desc: 'Edit corporate vision, heritage story, sourcing ethics, and export approach',
    to: '/admin/content?tab=about',
    keywords: ['about us', 'company history', 'vision', 'pillars'],
  },
  {
    id: 'cms-inquiry',
    title: 'Inquiry Page Header & Lead Desk',
    category: 'Website Content CMS',
    icon: '✉️',
    desc: 'Customize /inquiry header, response time promise, and RFQ instructions',
    to: '/admin/content?tab=inquiry',
    keywords: ['inquiry header', 'rfq form header', 'lead desk'],
  },

  // 🌐 PUBLIC WEBSITE DIRECT PREVIEW
  {
    id: 'web-home',
    title: 'View Public Homepage',
    category: 'Public Website',
    icon: '🏠',
    desc: 'Open live homepage in a new tab',
    to: '/',
    external: true,
    keywords: ['home', 'live site', 'preview home'],
  },
  {
    id: 'web-products',
    title: 'View Public Products Catalogue',
    category: 'Public Website',
    icon: '🛍️',
    desc: 'Open live product catalogue page',
    to: '/products',
    external: true,
    keywords: ['view products', 'live products'],
  },
  {
    id: 'web-brochures',
    title: 'View Public Brochures Page',
    category: 'Public Website',
    icon: '📄',
    desc: 'Open live brochures and downloadable line cards',
    to: '/brochures',
    external: true,
    keywords: ['view brochures', 'live brochures'],
  },
  {
    id: 'web-blog',
    title: 'View Public Blog & News',
    category: 'Public Website',
    icon: '📰',
    desc: 'Open live agro export market insights blog',
    to: '/blog',
    external: true,
    keywords: ['view blog', 'live news'],
  },
  {
    id: 'web-inquiry',
    title: 'View Public Inquiry Form',
    category: 'Public Website',
    icon: '✉️',
    desc: 'Open buyer inquiry & quote request form',
    to: '/inquiry',
    external: true,
    keywords: ['view inquiry', 'live rfq form'],
  },
];

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  // Focus input whenever opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setActiveCategory('All');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Categories list
  const categories = ['All', 'Quick Actions', 'Management Pages', 'Website Content CMS', 'Public Website'];

  // Filter items based on query and activeCategory
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COMMAND_ITEMS.filter((item) => {
      // Category filter
      if (activeCategory !== 'All' && item.category !== activeCategory) {
        return false;
      }
      if (!q) return true;

      // Search match
      const titleMatch = item.title.toLowerCase().includes(q);
      const descMatch = item.desc && item.desc.toLowerCase().includes(q);
      const categoryMatch = item.category.toLowerCase().includes(q);
      const keywordMatch = item.keywords && item.keywords.some((k) => k.toLowerCase().includes(q));

      return titleMatch || descMatch || categoryMatch || keywordMatch;
    });
  }, [query, activeCategory]);

  // Reset selectedIndex if it goes out of range
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeCategory]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          executeItem(filteredItems[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  const executeItem = (item) => {
    onClose();
    if (item.external) {
      window.open(item.to, '_blank', 'noreferrer');
    } else {
      navigate(item.to);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 sm:pt-20 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-line bg-white shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-line px-4 py-3.5 bg-[#faf8f4]">
          <span className="text-lg text-ink/50" aria-hidden="true">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a page, command, or feature (e.g. products, video, brochure, inquiries)..."
            className="flex-1 bg-transparent text-sm sm:text-base font-semibold text-ink placeholder-ink/40 outline-hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="rounded-lg p-1 text-xs text-ink/40 hover:text-ink hover:bg-surface transition cursor-pointer"
            >
              ✕
            </button>
          )}
          <kbd className="hidden sm:inline-block rounded-md border border-line bg-white px-2 py-0.5 text-[10px] font-mono font-bold text-ink/50 shadow-3xs">
            ESC
          </kbd>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto px-4 py-2 border-b border-line/60 bg-white no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-forest text-white shadow-2xs'
                  : 'bg-surface/50 text-ink/65 hover:bg-surface hover:text-ink'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 sm:p-3 divide-y divide-line/30 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-ink/50 space-y-2">
              <span className="text-3xl block">🔍</span>
              <p className="text-sm font-semibold text-ink">No commands or pages found for &quot;{query}&quot;</p>
              <p className="text-xs text-ink/50 max-w-sm mx-auto">
                Try searching for keywords like &quot;product&quot;, &quot;brochure&quot;, &quot;rfq&quot;, &quot;video&quot;, &quot;logo&quot;, or &quot;loader&quot;.
              </p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => executeItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`group flex items-center justify-between gap-3 rounded-xl p-3 text-xs transition cursor-pointer ${
                    isSelected
                      ? 'bg-forest text-white shadow-sm font-medium'
                      : 'hover:bg-[#fbf9f4] text-ink'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface/50 group-hover:bg-white text-base shrink-0 border border-line/40">
                      {item.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-bold text-xs truncate ${isSelected ? 'text-white' : 'text-ink'}`}>
                          {item.title}
                        </span>
                        {item.badge && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                              isSelected
                                ? 'bg-gold text-ink'
                                : 'bg-gold/20 text-ink border border-gold/40'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-mono uppercase ${
                            isSelected ? 'text-white/70' : 'text-ink/40'
                          }`}
                        >
                          • {item.category}
                        </span>
                      </div>
                      <p
                        className={`mt-0.5 truncate text-[11px] ${
                          isSelected ? 'text-white/80' : 'text-ink/60'
                        }`}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[11px] font-mono ${
                        isSelected ? 'text-gold' : 'text-ink/30'
                      }`}
                    >
                      {item.external ? 'Open ↗' : 'Jump →'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="flex items-center justify-between border-t border-line/80 bg-[#faf8f4] px-4 py-2.5 text-[11px] text-ink/60 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-white px-1.5 py-0.5 border border-line/70 shadow-3xs">↑</kbd>
              <kbd className="rounded bg-white px-1.5 py-0.5 border border-line/70 shadow-3xs">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-white px-1.5 py-0.5 border border-line/70 shadow-3xs">↵</kbd>
              <span>to select</span>
            </span>
          </div>
          <span className="text-[10px] font-semibold text-forest">
            NMC Admin Quick Access
          </span>
        </div>
      </div>
    </div>
  );
}
