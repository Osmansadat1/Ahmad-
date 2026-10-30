import React, { useCallback, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DesignStudio } from './components/DesignStudio';
import { HowItWorks } from './components/HowItWorks';
import { StyleGallery } from './components/StyleGallery';
import { PricingSection } from './components/PricingSection';
import { Footer } from './components/Footer';
import { AmazonShopDrawer } from './components/AmazonShopDrawer';
import { LegalModal, LegalModalTab } from './components/LegalModal';
import { RoomTypeId, StyleId } from './data/config';

export default function App() {
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isShopDrawerOpen, setIsShopDrawerOpen] = useState(false);
  const [legalModalState, setLegalModalState] = useState<{
    isOpen: boolean;
    tab: LegalModalTab;
  }>({ isOpen: false, tab: 'terms' });
  const [userUploadedPhoto, setUserUploadedPhoto] = useState<string | undefined>(undefined);
  const [hasCustomUpload, setHasCustomUpload] = useState<boolean>(false);
  const [activeRoomType, setActiveRoomType] = useState<RoomTypeId>('Living Room');
  const [activeStyle, setActiveStyle] = useState<StyleId>('Organic Modern');

  // Trigger studio opening & smooth scroll
  const handleLaunchStudio = useCallback(() => {
    setIsStudioOpen(true);
    setTimeout(() => {
      const studioEl = document.getElementById('studio');
      if (studioEl) {
        studioEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  }, []);

  const handleScrollToPricing = useCallback(() => {
    const el = document.getElementById('pricing');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // When a style is clicked in the Style Gallery
  const handleSelectStyleFromGallery = useCallback((styleName: string) => {
    setActiveStyle(styleName as StyleId);
    handleLaunchStudio();
  }, [handleLaunchStudio]);

  // Sync user uploaded photo to both Hero slider & Studio canvas
  const handleUserPhotoChange = useCallback((photoUrl: string, isCustom: boolean) => {
    setUserUploadedPhoto(photoUrl);
    setHasCustomUpload(isCustom);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#1B1613] text-[#4A3B32] dark:text-[#FAF8F5] flex flex-col selection:bg-[#C69C6D]/30 selection:text-[#4A3B32] transition-colors">
      {/* 1. HEADER */}
      <Header
        onTryFreeClick={handleLaunchStudio}
        onOpenShopDrawer={() => setIsShopDrawerOpen(true)}
      />

      <main id="top" className="flex-1">
        {/* 2. HERO SECTION */}
        <Hero
          onTryFreeClick={handleLaunchStudio}
          onSeePricingClick={handleScrollToPricing}
          userBeforeImage={userUploadedPhoto}
          hasCustomUpload={hasCustomUpload}
        />

        {/* 3. DESIGN STUDIO (Revealed directly below hero when user clicks Try it free / Start Free) */}
        {isStudioOpen && (
          <DesignStudio
            isOpen={isStudioOpen}
            onOpenShopDrawer={() => setIsShopDrawerOpen(true)}
            onScrollToPricing={handleScrollToPricing}
            onUserPhotoChange={handleUserPhotoChange}
            initialRoomType={activeRoomType}
            initialStyle={activeStyle}
          />
        )}

        {/* 4. HOW IT WORKS */}
        <HowItWorks />

        {/* 5. STYLE GALLERY */}
        <StyleGallery onSelectStyle={handleSelectStyleFromGallery} />

        {/* 6. PRICING */}
        <PricingSection onStartFree={handleLaunchStudio} />
      </main>

      {/* 7. FOOTER */}
      <Footer
        onOpenShopDrawer={() => setIsShopDrawerOpen(true)}
        onTryFree={handleLaunchStudio}
        onOpenLegal={(tab) => setLegalModalState({ isOpen: true, tab })}
      />

      {/* 8. AMAZON SHOPPABLE DRAWER */}
      <AmazonShopDrawer
        isOpen={isShopDrawerOpen}
        onClose={() => setIsShopDrawerOpen(false)}
      />

      {/* 9. LEGAL TERMS & PRIVACY MODAL */}
      <LegalModal
        isOpen={legalModalState.isOpen}
        initialTab={legalModalState.tab}
        onClose={() =>
          setLegalModalState((prev) => ({ ...prev, isOpen: false }))
        }
      />
    </div>
  );
}
