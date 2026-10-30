# Eden Canvas by Wold Eden

> A fast, mobile-first AI interior design web app for US renters. Redesigns a user's real room photo using **ONLY** damage-free, lease-safe changes (no painting, no demolition, no structural changes, zero drilling).

---

## 🌿 Brand & Aesthetic
- **Quiet Luxury Palette**: Alabaster (`#FAF8F5`), Soft Oat (`#F0ECE1`), Camel (`#C69C6D`), Deep Walnut (`#4A3B32`), Sage (`#6E7864`), Warm Greige (`#B8B2A6`).
- **Typography**: Cormorant Garamond (editorial serif headings) and Plus Jakarta Sans (clean UI).
- **Dark Mode**: Fully supported via `@media (prefers-color-scheme: dark)` with rich espresso and warm slate tones.

---

## 🛠️ Tech Stack & Architecture
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons.
- **Backend**: Node.js, Express, `@google/genai` TypeScript SDK.
- **AI Model**: `gemini-3.1-flash-lite-image` ("Gemini Flash Image / Nano Banana" family) accepting base photo inputs for layout preservation.

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# Google Gemini API Key for server-side image-to-image redesign
GEMINI_API_KEY=your_gemini_api_key_here

# Server Port (default: 3000)
PORT=3000
```

> **Note**: If `GEMINI_API_KEY` is omitted or quota is exhausted, Eden Canvas automatically and gracefully provides labeled **"Demo concept"** transformations so renters can test the full end-to-end workflow without interruption.

---

## 📦 Getting Started

```bash
# Install dependencies
npm install

# Run the development server (runs Express with Vite middlewares on port 3000)
npm run dev

# Run unit tests
npm test

# Build for production
npm run build
```

---

## 🛒 Amazon Affiliate Integration & FTC Compliance
- Amazon Associates Tag: `tag=Sayedosmanema-20` is systematically appended to all outgoing product links.
- Mandatory FTC disclosures are rendered directly on the Shoppable Drawer and in the site footer.
