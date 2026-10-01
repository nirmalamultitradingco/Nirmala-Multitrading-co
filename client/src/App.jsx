import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/admin/ProtectedRoute.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';

import Home from './pages/Home.jsx';
import Segments from './pages/Segments.jsx';
import SegmentDetail from './pages/SegmentDetail.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Partners from './pages/Partners.jsx';
import BecomePartner from './pages/BecomePartner.jsx';
import Brochures from './pages/Brochures.jsx';
import About from './pages/About.jsx';
import Inquiry from './pages/Inquiry.jsx';
import News from './pages/News.jsx';
import NewsDetail from './pages/NewsDetail.jsx';
import Unsubscribe from './pages/Unsubscribe.jsx';
import NotFound from './pages/NotFound.jsx';

import { lazy, Suspense } from 'react';

const Login = lazy(() => import('./pages/admin/Login.jsx'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const ManageSegments = lazy(() => import('./pages/admin/ManageSegments.jsx'));
const ManageSubSegments = lazy(() => import('./pages/admin/ManageSubSegments.jsx'));
const ManageProducts = lazy(() => import('./pages/admin/ManageProducts.jsx'));
const ManagePartners = lazy(() => import('./pages/admin/ManagePartners.jsx'));
const ManageBrochures = lazy(() => import('./pages/admin/ManageBrochures.jsx'));
const Inquiries = lazy(() => import('./pages/admin/Inquiries.jsx'));
const ManageSiteContent = lazy(() => import('./pages/admin/ManageSiteContent.jsx'));
const ManageNews = lazy(() => import('./pages/admin/ManageNews.jsx'));
const ManageSubscribers = lazy(() => import('./pages/admin/ManageSubscribers.jsx'));
const Profile = lazy(() => import('./pages/admin/Profile.jsx'));

function AdminLoadingFallback() {
  return (
    <div className="flex h-64 w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-forest border-t-gold" />
        <p className="font-mono text-xs font-semibold text-ink/60 uppercase tracking-wider">
          Loading Workspace…
        </p>
      </div>
    </div>
  );
}


function SegmentRedirect() {
  const { slug, subsegmentSlug } = useParams();
  if (slug && subsegmentSlug) {
    return <Navigate to={`/products/${slug}/${subsegmentSlug}`} replace />;
  }
  if (slug) {
    return <Navigate to={`/products/${slug}`} replace />;
  }
  return <Navigate to="/products" replace />;
}

function NewsRedirect() {
  const { slug } = useParams();
  if (slug) {
    return <Navigate to={`/blog/${slug}`} replace />;
  }
  return <Navigate to="/blog" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />

        {/* Products (categories) */}
        <Route path="products" element={<Segments />} />
        <Route path="products/:slug/:subsegmentSlug" element={<SegmentDetail />} />
        <Route path="products/:slug" element={<SegmentDetail />} />
        <Route path="products/category/:slug" element={<SegmentDetail />} />
        <Route path="category/:slug" element={<SegmentDetail />} />
        <Route path="categories" element={<Navigate to="/products" replace />} />

        {/* Product Details (catalogue & single product with dynamic aliases) */}
        <Route path="product-details" element={<Products />} />
        <Route path="product-details/:slug" element={<ProductDetail />} />
        <Route path="product/:slug" element={<ProductDetail />} />
        <Route path="products/item/:slug" element={<ProductDetail />} />
        <Route path="products/detail/:slug" element={<ProductDetail />} />

        {/* Blog */}
        <Route path="blog" element={<News />} />
        <Route path="blog/:slug" element={<NewsDetail />} />

        {/* Backwards-compatibility redirects */}
        <Route path="segments" element={<Navigate to="/products" replace />} />
        <Route path="segments/:slug/:subsegmentSlug" element={<SegmentRedirect />} />
        <Route path="segments/:slug" element={<SegmentRedirect />} />
        <Route path="news" element={<Navigate to="/blog" replace />} />
        <Route path="news/:slug" element={<NewsRedirect />} />

        <Route path="partners" element={<Partners />} />
        <Route path="become-a-partner" element={<BecomePartner />} />
        <Route path="partners/register" element={<Navigate to="/become-a-partner" replace />} />
        <Route path="brochures" element={<Brochures />} />
        <Route path="about" element={<About />} />
        <Route path="inquiry" element={<Inquiry />} />
        <Route path="inquiry/:productSlug" element={<Inquiry />} />
        <Route path="unsubscribe" element={<Unsubscribe />} />
      </Route>

      {/* Admin Login (Direct & Discreet Hidden Routes) */}
      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<AdminLoadingFallback />}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="/portal"
        element={
          <Suspense fallback={<AdminLoadingFallback />}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="/staff"
        element={
          <Suspense fallback={<AdminLoadingFallback />}>
            <Login />
          </Suspense>
        }
      />
      <Route path="/manage" element={<Navigate to="/admin" replace />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AdminLoadingFallback />}>
              <AdminLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="segments" element={<ManageSegments />} />
        <Route path="subsegments" element={<ManageSubSegments />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="partners" element={<ManagePartners />} />
        <Route path="brochures" element={<ManageBrochures />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="subscribers" element={<ManageSubscribers />} />
        <Route path="content" element={<ManageSiteContent />} />
        <Route path="blog" element={<ManageNews />} />
        <Route path="news" element={<ManageNews />} />
        <Route path="profile" element={<Profile />} />
      </Route>



      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
