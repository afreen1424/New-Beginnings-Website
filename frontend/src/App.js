import { useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import SiteHeader from "./components/layout/SiteHeader";
import SiteFooter from "./components/layout/SiteFooter";
import HomePage from "./pages/HomePage";
import PortfolioPage from "./pages/PortfolioPage";
import EventDetailPage from "./pages/EventDetailPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import BlogManagerPage from "./pages/BlogManagerPage";
import CorporateEventsPage from "./pages/services/CorporateEventsPage";
import CateringPage from "./pages/services/CateringPage";
import SfxEntriesPage from "./pages/services/SfxEntriesPage";
import EnquiryPage from "./pages/EnquiryPage";

function AppLayout() {
  const location = useLocation();
  const [introComplete, setIntroComplete] = useState(location.pathname !== "/");
  const isCorporatePage = location.pathname === "/services/corporate-events";
  const isCateringPage = location.pathname === "/services/catering";
  const isSfxPage = location.pathname === "/services/sfx-entries";
  const isPortfolioPage = location.pathname.startsWith("/portfolio");
  const isBlogPage = location.pathname.startsWith("/blog");
  const isEnquiryPage = location.pathname === "/enquiry";
  const isAdminPage = location.pathname === "/admin";
  const nonStickyHeaderPage = isCorporatePage || isCateringPage || isSfxPage || isPortfolioPage;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (location.pathname !== "/") {
      setIntroComplete(true);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#F5EFE6]" data-testid="app-layout">
      {!isAdminPage && <SiteHeader introComplete={introComplete} isHome={location.pathname === "/"} nonSticky={nonStickyHeaderPage} />}
      <main data-testid="app-main-content">
        <Routes>
          <Route path="/" element={<HomePage onIntroComplete={() => setIntroComplete(true)} />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/portfolio/:category/:eventId" element={<EventDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/admin" element={<BlogManagerPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/services/corporate-events" element={<CorporateEventsPage />} />
          <Route path="/services/catering" element={<CateringPage />} />
          <Route path="/services/sfx-entries" element={<SfxEntriesPage />} />
          <Route path="/enquiry" element={<EnquiryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdminPage && <SiteFooter isHome={location.pathname === "/" || isCorporatePage || isCateringPage || isSfxPage || isPortfolioPage || isBlogPage || isEnquiryPage} />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
