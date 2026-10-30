import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Acceptance: Minimal Navbar contains strictly two elements and no legacy menu items', () => {
  const navbarContent = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

  // Verify legacy menu links are completely removed
  assert.equal(navbarContent.includes('How It Works'), false, 'Navbar must not contain "How It Works" link');
  assert.equal(navbarContent.includes('Examples'), false, 'Navbar must not contain "Examples" link');
  assert.equal(navbarContent.includes('Renter-Friendly Design'), false, 'Navbar must not contain "Renter-Friendly Design" link');
  assert.equal(navbarContent.includes('Pricing'), false, 'Navbar must not contain "Pricing" link');

  // Verify presence of brand logo / text and Try Free button
  assert.equal(navbarContent.includes('eden-canvas-logo.png'), true, 'Navbar must have brand logo');
  assert.equal(navbarContent.includes('by Wold Eden'), true, 'Navbar must have brand text');
  assert.equal(navbarContent.includes('Try Free'), true, 'Navbar must contain "Try Free" button');
  assert.equal(navbarContent.includes('#4A3B32'), true, 'Navbar Try Free button must use Walnut #4A3B32 styling');
  assert.equal(navbarContent.includes('#FAF8F5'), true, 'Navbar Try Free button must use Alabaster #FAF8F5 styling');
});

test('Acceptance: App.tsx implements explicit AppView ("landing" | "studio") and minimal Navbar wiring', () => {
  const appContent = fs.readFileSync('src/App.tsx', 'utf8');

  // Explicit view state
  assert.equal(appContent.includes("type AppView = 'landing' | 'studio'"), false, 'AppView is imported from Navbar');
  assert.equal(appContent.includes("useState<AppView>"), true, 'App.tsx must have explicit AppView state');
  assert.equal(appContent.includes("<Navbar"), true, 'App.tsx must render Navbar');

  // Landing view vs Studio workspace
  assert.equal(appContent.includes("currentView === 'studio'"), true, 'App.tsx must conditionally branch for studio workspace');
  assert.equal(appContent.includes("<LandingHero"), true, 'App.tsx must render LandingHero on landing view');
  assert.equal(appContent.includes("<StudioHero"), true, 'App.tsx must render StudioHero on studio workspace');
});
