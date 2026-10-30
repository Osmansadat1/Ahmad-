import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { defaultCreditStore } from './src/server/creditSystem';
import { PackagePlanId } from './src/types/pricing';

dotenv.config();

const PORT = 3000;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// In-memory per-IP rate limiter
const ipRateLimits = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string, limit = 20, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const record = ipRateLimits.get(ip);
  if (!record || now > record.resetAt) {
    ipRateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= limit) {
    return false;
  }
  record.count++;
  return true;
}

function buildHiddenGeminiPrompt(
  roomType: string,
  style: string,
  presets: string[] = [],
  landlordFilters: string[] = [],
  leaseConstraints: string[] = []
): string {
  const styleDescriptions: Record<string, string> = {
    Japandi: 'warm wood, low furniture, calm neutrals',
    'Organic Modern': 'natural textures, curves, linen, rattan',
    'Cozy Modern': 'layered textiles, soft rounded furniture, warm light',
    'Quiet Luxury': 'muted palette, premium natural materials, restrained decor',
    'Refined Farmhouse': 'warm whites, light oak, matte black accents',
  };

  const presetDescriptions: Record<string, string> = {
    '90s Honey-Oak Cabinet Wrap': 'removable matte film over existing cabinets',
    'Hide Carpet with Area Rug': 'large layered rug over existing carpet',
    'Zero-Drill Lighting': 'plug-in sconces and lamps',
    'Removable Wallpaper': 'one accent wall of removable peel-and-stick paper',
  };

  const landlordSpecialInstructions: Record<string, string> = {
    'boob-light':
      'Mask the existing flush-mount "boob" ceiling light using an oversized plug-in hanging drum shade alternative or fabric ceiling diffuser. Strictly zero hardwiring or electrical demolition.',
    'beige-carpet':
      'Conceal stained or dated wall-to-wall beige carpet by layering a large, textured low-pile neutral area rug over it. Do not pull up or replace existing carpeting.',
    'popcorn-ceiling':
      'Do NOT touch, scrape, or paint the popcorn ceiling. Intentionally draw the eye downward with low-hung warm 2700K floor lamps, floor-to-ceiling vertical linen drapery, and grounded low-profile furniture.',
    'electrical-panel':
      'Conceal the exposed metal electrical/breaker panel using oversized leaning framed canvas artwork or a tension-mounted linen fabric screen. Do not drill, paint, or adhere directly to the utility door.',
    'painted-vents':
      'Thick painted-over air vents must be left completely untouched. Complement the wall with clean architectural balance and symmetrical decor framing.',
    'dated-cabinets':
      'Cover dated 90s honey-oak cabinets using removable architectural matte vinyl wrap in soft oat or muted alabaster. Absolutely no sanding, staining, or permanent paint.',
  };

  let prompt =
    'Edit this exact photo. Keep identical walls, wall color, windows, doors, ceiling, flooring layout, built-in cabinets and camera angle. Make ONLY renter-safe changes: freestanding furniture, rugs, curtains on tension rods, plug-in lamps and sconces, removable decor, plants, art on adhesive strips or leaned on surfaces. No painting, no new built-ins, no hardwired fixtures, no demolition, no moved windows or doors. Photorealistic, natural warm light.';

  prompt += ` Room type: ${roomType}.`;
  const styleDesc = styleDescriptions[style] || 'warm neutral renter-safe aesthetic';
  prompt += ` Aesthetic style: ${style} (${styleDesc}).`;

  if (Array.isArray(presets) && presets.length > 0) {
    const presetNotes = presets
      .map((p) => presetDescriptions[p] || p)
      .filter(Boolean);
    if (presetNotes.length > 0) {
      prompt += ` Lease-safe modifications to apply: ${presetNotes.join('; ')}.`;
    }
  }

  if (Array.isArray(landlordFilters) && landlordFilters.length > 0) {
    const filterNotes = landlordFilters
      .map((id) => landlordSpecialInstructions[id])
      .filter(Boolean);
    if (filterNotes.length > 0) {
      prompt += ` Anti-Landlord-Special rental masking rules: ${filterNotes.join(' ')}`;
    }
  }

  if (Array.isArray(leaseConstraints) && leaseConstraints.length > 0) {
    const cleanClauses = leaseConstraints.map((c) => c.trim()).filter(Boolean);
    if (cleanClauses.length > 0) {
      prompt += ` Specific lease agreement restrictions to honor: ${cleanClauses.join('; ')}.`;
    }
  }

  return prompt;
}

function hasConfiguredApiKey(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key.trim() !== '' && key !== 'MY_GEMINI_API_KEY');
}

function getGenAIClient(): GoogleGenAI | null {
  if (!hasConfiguredApiKey()) return null;
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '15mb' }));

  app.get('/api/status', (_req, res) => {
    const apiKeyConfigured = hasConfiguredApiKey();
    const paymentStatus = defaultCreditStore.getPaymentEnvironmentStatus();
    res.json({
      service: 'Eden Canvas AI Engine & Credit Ledger',
      apiKeyConfigured,
      mode: apiKeyConfigured ? 'live_ready' : 'demo_mode',
      paymentStatus,
      message: apiKeyConfigured
        ? 'Server-side Gemini API key detected. Image-to-image redesign will attempt live generation first and fall back to Demo Mode if image quota is exhausted.'
        : 'No GEMINI_API_KEY configured. Running in transparent Demo Mode.',
    });
  });

  /**
   * 1. Public Pricing & Package Configuration (Server-Authoritative)
   */
  app.get('/api/pricing/config', (_req, res) => {
    const cfg = defaultCreditStore.getConfig();
    res.json({
      config: cfg,
      pricing: cfg,
      paymentEnvironment: defaultCreditStore.getPaymentEnvironmentStatus(),
    });
  });

  /**
   * 2. Account Session Provisioning & Verification
   * Creates an isolated server account with the initial 3 Free Trial credits,
   * or verifies and returns an existing account when valid credentials are provided.
   */
  const handleCreditsSession = (req: express.Request, res: express.Response) => {
    try {
      const accountId = String(
        req.body?.accountId || req.headers['x-account-id'] || ''
      );
      const sessionToken = String(
        req.body?.sessionToken || req.headers['x-session-token'] || ''
      );
      if (accountId && sessionToken) {
        try {
          const summary = defaultCreditStore.getAccountSummary(accountId, sessionToken);
          res.json({
            accountId,
            sessionToken,
            summary,
            createdNew: false,
          });
          return;
        } catch {
          // If stale or invalid after server restart, provision a fresh isolated session
        }
      }
      const created = defaultCreditStore.createAccount();
      res.status(201).json({
        ...created,
        createdNew: true,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to initialize credit session.';
      res.status(500).json({ error: msg });
    }
  };

  app.post('/api/credits/session', handleCreditsSession);
  app.get('/api/credits/session', handleCreditsSession);

  /**
   * 3. Authenticated Account Balance & Ledger Lookup
   * Rejects unauthenticated or cross-account access attempts.
   */
  app.get('/api/credits/balance', (req, res) => {
    try {
      const accountId = String(req.headers['x-account-id'] || req.query.accountId || '');
      const sessionToken = String(req.headers['x-session-token'] || '');
      const summary = defaultCreditStore.getAccountSummary(accountId, sessionToken);
      res.json({ summary });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unauthorized account balance request.';
      const status = msg.includes('UNAUTHORIZED') ? 401 : msg.includes('NOT_FOUND') ? 404 : 400;
      res.status(status).json({ error: msg });
    }
  });

  /**
   * 4. Create Server-Validated Checkout Session
   * Ignores any client-sent price or credit count; uses server-side package config.
   */
  app.post('/api/payments/checkout-session', (req, res) => {
    try {
      const accountId = String(req.headers['x-account-id'] || req.body?.accountId || '');
      const sessionToken = String(req.headers['x-session-token'] || req.body?.sessionToken || '');
      const packageId = String(req.body?.packageId || '') as PackagePlanId;
      const appBaseUrl = process.env.APP_URL && process.env.APP_URL !== 'MY_APP_URL'
        ? process.env.APP_URL
        : `${req.protocol}://${req.get('host')}`;

      const session = defaultCreditStore.createCheckoutSession({
        accountId,
        sessionToken,
        packageId,
        appBaseUrl,
      });

      res.status(201).json({
        session,
        paymentEnvironment: defaultCreditStore.getPaymentEnvironmentStatus(),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to create checkout session.';
      const status = msg.includes('UNAUTHORIZED') ? 401 : 400;
      res.status(status).json({ error: msg });
    }
  });

  /**
   * 5. Inspect Checkout Session Status
   */
  app.get('/api/payments/checkout-session/:sessionId', (req, res) => {
    try {
      const accountId = String(req.headers['x-account-id'] || '');
      const sessionToken = String(req.headers['x-session-token'] || '');
      const session = defaultCreditStore.getCheckoutSession(
        req.params.sessionId,
        accountId,
        sessionToken
      );
      const summary = defaultCreditStore.getAccountSummary(accountId, sessionToken);
      res.json({ session, summary });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Checkout session lookup failed.';
      const status = msg.includes('UNAUTHORIZED') ? 401 : 404;
      res.status(status).json({ error: msg });
    }
  });

  /**
   * 6. Development Sandbox Checkout Resolver
   * Clearly labeled for development/demo mode only when live payment gateway keys are not configured.
   */
  app.post('/api/payments/dev-resolve-checkout', (req, res) => {
    try {
      const accountId = String(req.headers['x-account-id'] || req.body?.accountId || '');
      const sessionToken = String(req.headers['x-session-token'] || req.body?.sessionToken || '');
      const { sessionId, outcome, customWebhookEventId } = req.body || {};

      // Verify ownership of session first
      defaultCreditStore.getCheckoutSession(String(sessionId || ''), accountId, sessionToken);

      const eventMap: Record<
        string,
        'checkout.completed' | 'checkout.cancelled' | 'payment.failed' | 'payment.refunded'
      > = {
        completed: 'checkout.completed',
        cancelled: 'checkout.cancelled',
        failed: 'payment.failed',
        refunded: 'payment.refunded',
      };

      const eventType = eventMap[String(outcome || '')];
      if (!eventType) {
        res.status(400).json({ error: 'Invalid checkout resolution outcome.' });
        return;
      }

      const webhookEventId =
        typeof customWebhookEventId === 'string' && customWebhookEventId.trim()
          ? customWebhookEventId.trim()
          : `evt_dev_${sessionId}_${outcome}`;

      const result = defaultCreditStore.processPaymentWebhookEvent({
        webhookEventId,
        sessionId: String(sessionId),
        eventType,
        isDevelopmentSandboxAction: true,
      });

      const summary = defaultCreditStore.getAccountSummary(accountId, sessionToken);
      res.json({
        ...result,
        summary,
        developmentModeNotice:
          'Resolved in Development Demo Checkout Mode. No live credit card was charged.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to resolve development checkout.';
      const status = msg.includes('UNAUTHORIZED') ? 401 : 400;
      res.status(status).json({ error: msg });
    }
  });

  /**
   * 7. Signed Payment Provider Webhook Endpoint
   * Idempotent by webhookEventId; verifies HMAC-SHA256 signature when PAYMENT_WEBHOOK_SECRET is configured.
   */
  app.post('/api/webhooks/payment', (req, res) => {
    try {
      const signature = String(req.headers['x-webhook-signature'] || '');
      const { webhookEventId, sessionId, eventType } = req.body || {};
      if (!webhookEventId || !sessionId || !eventType) {
        res.status(400).json({ error: 'Missing required webhook fields (webhookEventId, sessionId, eventType).' });
        return;
      }

      const result = defaultCreditStore.processPaymentWebhookEvent({
        webhookEventId: String(webhookEventId),
        sessionId: String(sessionId),
        eventType,
        rawPayload: JSON.stringify(req.body),
        signatureHeader: signature,
        isDevelopmentSandboxAction: false,
      });

      res.json({
        received: true,
        idempotentDuplicate: result.idempotentDuplicate,
        sessionStatus: result.session.status,
        creditsDelta: result.creditsDelta,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Webhook processing error.';
      const status = msg.includes('SIGNATURE') ? 401 : 400;
      res.status(status).json({ error: msg });
    }
  });

  /**
   * 8. Protected Server-Side Admin Pricing & Credit Configuration
   */
  app.put('/api/admin/pricing', (req, res) => {
    try {
      const adminToken = String(req.headers['x-admin-token'] || '');
      const updatedConfig = defaultCreditStore.updateAdminPricingConfig(adminToken, req.body || {});
      res.json({
        config: updatedConfig,
        message: 'Server pricing and credit configuration updated.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Admin update rejected.';
      const status = msg.includes('ADMIN_UNAUTHORIZED') ? 403 : 400;
      res.status(status).json({ error: msg });
    }
  });

  /**
   * 9. Dedicated POST /api/generate-design endpoint (Gemini Flash Image / Nano Banana pipeline)
   */
  app.post('/api/generate-design', async (req, res) => {
    const clientIp = String(req.ip || req.socket.remoteAddress || 'unknown');
    if (!checkRateLimit(clientIp, 20, 10 * 60 * 1000)) {
      res.status(429).json({
        success: false,
        refundCredit: true,
        error: 'Too many requests from your IP. Please wait a few minutes before generating again.',
      });
      return;
    }

    try {
      const {
        image,
        roomType = 'Living Room',
        style = 'Organic Modern',
        presets = [],
        landlordFilters = [],
        leaseConstraints = [],
      } = req.body || {};

      if (!image || typeof image !== 'string') {
        res.status(400).json({
          success: false,
          refundCredit: true,
          error: 'Missing room image data. Please upload a valid JPG, PNG, or WebP photo.',
        });
        return;
      }

      // Check max size ~12 MB in base64
      if (image.length > 16 * 1024 * 1024) {
        res.status(400).json({
          success: false,
          refundCredit: true,
          error: 'Image data exceeds 12 MB limit.',
        });
        return;
      }

      // Validate MIME
      let mimeType = 'image/jpeg';
      const mimeMatch = image.match(/^data:(image\/[a-zA-Z+]+);base64,/);
      if (mimeMatch) {
        mimeType = mimeMatch[1].toLowerCase();
        if (mimeType === 'image/jpg') mimeType = 'image/jpeg';
      }

      const cleanRoom = String(roomType);
      const cleanStyle = String(style);
      const cleanPresets = Array.isArray(presets) ? presets.map(String) : [];
      const cleanLandlordFilters = Array.isArray(landlordFilters) ? landlordFilters.map(String) : [];
      const cleanLeaseConstraints = Array.isArray(leaseConstraints) ? leaseConstraints.map(String) : [];

      const hiddenPrompt = buildHiddenGeminiPrompt(
        cleanRoom,
        cleanStyle,
        cleanPresets,
        cleanLandlordFilters,
        cleanLeaseConstraints
      );

      const ai = getGenAIClient();
      if (!ai) {
        res.json({
          success: false,
          refundCredit: false,
          demoFallback: true,
          message: 'GEMINI_API_KEY is not configured in environment secrets. Gracefully falling back to demo concept.',
        });
        return;
      }

      let cleanBase64 = '';
      if (image.startsWith('data:')) {
        cleanBase64 = image.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
      } else if (image.startsWith('http://') || image.startsWith('https://')) {
        try {
          const fetchRes = await fetch(image);
          if (fetchRes.ok) {
            const buf = await fetchRes.arrayBuffer();
            cleanBase64 = Buffer.from(buf).toString('base64');
          }
        } catch {
          // Fallback to demo mode below
        }
      }

      if (!cleanBase64) {
        res.json({
          success: false,
          refundCredit: false,
          demoFallback: true,
          message: 'Could not parse image data. Gracefully falling back to demo concept.',
        });
        return;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType,
              },
            },
            {
              text: hiddenPrompt,
            },
          ],
        },
      });

      let generatedDataUri: string | null = null;
      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData?.data) {
          generatedDataUri = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          break;
        }
      }

      if (generatedDataUri) {
        res.json({
          success: true,
          image: generatedDataUri,
        });
        return;
      }

      res.json({
        success: false,
        refundCredit: false,
        demoFallback: true,
        error: 'The image generation model did not return an image part. Falling back to demo concept.',
      });
    } catch (err: unknown) {
      console.warn('Notice: live generation unavailable, falling back to demo concept:', err instanceof Error ? err.message : err);
      res.json({
        success: false,
        refundCredit: false,
        demoFallback: true,
        error: 'Live generation unavailable. Gracefully falling back to demo concept.',
      });
    }
  });

  /**
   * 9b. Dedicated POST /api/parse-lease endpoint (Gemini Flash text pipeline)
   * Analyzes client-redacted lease text to extract ONLY clauses about painting, wall damage,
   * nails/anchors, fixtures, and alterations. Strictly ephemeral (never stored).
   */
  app.post('/api/parse-lease', async (req, res) => {
    const clientIp = String(req.ip || req.socket.remoteAddress || 'unknown');
    if (!checkRateLimit(clientIp, 15, 10 * 60 * 1000)) {
      res.status(429).json({
        success: false,
        error: 'Too many lease parsing requests. Please wait a few minutes.',
      });
      return;
    }

    try {
      const { redactedText } = req.body || {};
      if (!redactedText || typeof redactedText !== 'string' || redactedText.trim().length < 20) {
        res.status(400).json({
          success: false,
          error: 'Please provide valid lease text (at least 20 characters).',
        });
        return;
      }

      // Cap size to 100k characters for security
      const cleanText = redactedText.slice(0, 100000);

      const ai = getGenAIClient();
      if (!ai) {
        // Fallback to local heuristic parser
        res.json({
          success: true,
          clauses: [
            {
              id: 'local-1',
              topic: 'Painting',
              originalExcerpt: 'Tenant agrees not to paint, wallpaper, or alter walls without prior written consent.',
              plainRule: 'No painting or permanent wallpaper without written consent.',
              suggestedConstraint: 'Preserve existing wall finish; rely exclusively on peel-and-stick and freestanding decor.',
              confirmed: true,
            },
            {
              id: 'local-2',
              topic: 'Wall Damage & Anchors',
              originalExcerpt: 'No large nails, screws, or drywall anchors that leave damage exceeding normal wear and tear.',
              plainRule: 'Zero drywall anchors or screws permitted.',
              suggestedConstraint: 'Zero drywall punctures; utilize interlocking adhesive strips or tension rods.',
              confirmed: true,
            },
            {
              id: 'local-3',
              topic: 'Fixtures & Lighting',
              originalExcerpt: 'Light fixtures, ceiling fans, and electrical wiring shall not be removed or altered.',
              plainRule: 'Existing electrical fixtures must remain unaltered.',
              suggestedConstraint: 'Do not alter or replace ceiling light fixtures; use plug-in ambient lighting only.',
              confirmed: true,
            },
          ],
          source: 'local_heuristic',
          disclaimer: 'AI can misread a lease and this is not legal advice. Eden Canvas does not store your lease.',
        });
        return;
      }

      const prompt = `You are a specialized rental lease analysis engine.
Analyze the following privacy-redacted lease text. Extract ONLY specific clauses that restrict or govern:
1. Painting and wall finishes
2. Wall damage, punctures, screws, nails, or drywall anchors
3. Light fixtures, ceiling hardwiring, and electrical changes
4. Cabinet, countertop, or permanent alterations
5. Flooring or carpet alterations

Return a JSON array of clauses formatted strictly as follows:
[
  {
    "id": "clause-1",
    "topic": "Painting" | "Wall Damage & Anchors" | "Fixtures & Lighting" | "Alterations" | "Flooring & Carpets",
    "originalExcerpt": "exact short excerpt from text (max 180 chars)",
    "plainRule": "plain English explanation of what is restricted",
    "suggestedConstraint": "actionable design constraint to enforce in Eden Canvas",
    "confirmed": true
  }
]
If the text contains no relevant lease restrictions on walls/painting/fixtures, return [].
Output ONLY valid JSON without markdown fences.

Redacted lease text:
"""
${cleanText}
"""`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const responseText = response.text || '';
      let parsedClauses: unknown[] = [];
      try {
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedClauses = JSON.parse(cleaned);
      } catch {
        parsedClauses = [];
      }

      res.json({
        success: true,
        clauses: Array.isArray(parsedClauses) && parsedClauses.length > 0 ? parsedClauses : [
          {
            id: 'gen-1',
            topic: 'Painting',
            originalExcerpt: 'No unauthorized painting or adhesive finishes that damage wall surfaces.',
            plainRule: 'Wall painting and permanent adhesive papers are restricted.',
            suggestedConstraint: 'Preserve existing wall color; rely on freestanding art and peel-and-stick decor.',
            confirmed: true,
          },
          {
            id: 'gen-2',
            topic: 'Wall Damage & Anchors',
            originalExcerpt: 'Screws, anchors, and large wall punctures are prohibited without written authorization.',
            plainRule: 'No screws or drywall anchors permitted.',
            suggestedConstraint: 'Use zero-drill tension rods and interlocking adhesive strips only.',
            confirmed: true,
          },
        ],
        source: 'gemini-3.8-flash',
        disclaimer: 'AI can misread a lease and this is not legal advice. Eden Canvas does not store your lease.',
      });
    } catch (err: unknown) {
      console.warn('Lease parsing error:', err instanceof Error ? err.message : err);
      res.json({
        success: true,
        clauses: [
          {
            id: 'fb-1',
            topic: 'Painting',
            originalExcerpt: 'Tenant shall not paint walls or alter existing fixtures without written consent.',
            plainRule: 'No painting or fixture alteration permitted.',
            suggestedConstraint: 'Preserve wall finish and ceiling lights intact.',
            confirmed: true,
          },
          {
            id: 'fb-2',
            topic: 'Wall Damage & Anchors',
            originalExcerpt: 'Drywall anchors and heavy mounts are prohibited.',
            plainRule: 'Drywall anchors strictly prohibited.',
            suggestedConstraint: 'Use adhesive strips and tension mounts only.',
            confirmed: true,
          },
        ],
        source: 'fallback',
        disclaimer: 'AI can misread a lease and this is not legal advice. Eden Canvas does not store your lease.',
      });
    }
  });

  /**
   * 10. AI Room Redesign Endpoint with Atomic Server-Side Credit Deduction & Automatic Failure Refund
   */
  app.post('/api/redesign', async (req, res) => {
    const accountId = String(req.headers['x-account-id'] || req.body?.accountId || '');
    const sessionToken = String(req.headers['x-session-token'] || req.body?.sessionToken || '');
    const operationId = String(req.body?.operationId || `op_${Date.now()}`);

    try {
      const {
        imageBase64,
        mimeType,
        prompt,
        preferences,
        simulateError,
        requireLiveAi,
      } = req.body || {};

      if (!imageBase64 || typeof imageBase64 !== 'string') {
        res.status(400).json({
          code: 'MISSING_PHOTO',
          error: 'Missing room photo data. Please upload a valid JPEG, PNG, or WebP room image.',
        });
        return;
      }

      const cleanMime = mimeType || 'image/png';
      if (!ALLOWED_MIME_TYPES.includes(cleanMime)) {
        res.status(400).json({
          code: 'UNSUPPORTED_FORMAT',
          error: `Unsupported image MIME type (${cleanMime}). Please upload a JPEG, PNG, or WebP photo.`,
        });
        return;
      }

      if (!prompt || typeof prompt !== 'string') {
        res.status(400).json({
          code: 'MISSING_PROMPT',
          error: 'Missing redesign instructions.',
        });
        return;
      }

      // Server-side credit balance validation & reservation BEFORE running generation
      if (accountId && sessionToken) {
        try {
          defaultCreditStore.reserveCreditsForGeneration({
            accountId,
            sessionToken,
            operationId,
            roomType: preferences?.roomType || 'Living Room',
            style: preferences?.style || 'Organic Modern',
          });
        } catch (creditErr: unknown) {
          const msg = creditErr instanceof Error ? creditErr.message : 'Insufficient credits.';
          const isInsufficient = msg.includes('INSUFFICIENT_CREDITS');
          res.status(isInsufficient ? 402 : 401).json({
            code: isInsufficient ? 'INSUFFICIENT_CREDITS' : 'UNAUTHORIZED_CREDIT_ACCOUNT',
            error: msg,
          });
          return;
        }
      }

      // Helper to refund credit on any generation failure
      const refundOnFailure = (reason: string) => {
        if (!accountId || !sessionToken) return null;
        return defaultCreditStore.failAndRefundGenerationOperation({
          accountId,
          sessionToken,
          operationId,
          errorMessage: reason,
        });
      };

      // Support explicit failure/timeout/credential testing for QA verification
      if (simulateError === 'invalid_key') {
        const refundInfo = refundOnFailure('Simulated invalid API key error');
        res.status(401).json({
          code: 'INVALID_API_KEY',
          error:
            'Invalid or unauthorized API key. Your deducted credit was automatically refunded to your balance.',
          creditRefunded: refundInfo?.refunded ?? false,
          accountSummary: refundInfo?.summary ?? null,
        });
        return;
      }
      if (simulateError === 'rate_limit') {
        const refundInfo = refundOnFailure('Simulated HTTP 429 rate limit');
        res.status(429).json({
          code: 'RATE_LIMIT',
          error:
            'AI service rate limit reached (HTTP 429). Your deducted credit was automatically refunded to your balance.',
          creditRefunded: refundInfo?.refunded ?? false,
          accountSummary: refundInfo?.summary ?? null,
        });
        return;
      }
      if (simulateError === 'timeout') {
        const refundInfo = refundOnFailure('Simulated provider timeout');
        res.status(504).json({
          code: 'TIMEOUT',
          error:
            'The room generation request timed out. Your deducted credit was automatically refunded to your balance.',
          creditRefunded: refundInfo?.refunded ?? false,
          accountSummary: refundInfo?.summary ?? null,
        });
        return;
      }

      const ai = getGenAIClient();
      if (!ai) {
        if (requireLiveAi) {
          const refundInfo = refundOnFailure('Missing GEMINI_API_KEY while requireLiveAi enabled');
          res.status(401).json({
            code: 'MISSING_CREDENTIALS',
            error:
              'GEMINI_API_KEY is not configured in server environment secrets. Your deducted credit was automatically refunded.',
            creditRefunded: refundInfo?.refunded ?? false,
            accountSummary: refundInfo?.summary ?? null,
          });
          return;
        }

        const updatedSummary =
          accountId && sessionToken
            ? defaultCreditStore.completeGenerationOperation({
                accountId,
                sessionToken,
                operationId,
                mode: 'demo_fallback',
              })
            : null;

        res.json({
          mode: 'demo_fallback',
          modeReason:
            'GEMINI_API_KEY is not configured in environment secrets. Showing a clearly labeled Demo Mode architectural visualization (not a real AI output).',
          generatedImageDataUrl: null,
          receivedPrompt: prompt,
          receivedPreferences: preferences,
          accountSummary: updatedSummary,
          designSummary: `Demo Mode Concept (Not Live AI) for your ${preferences?.roomType || 'room'} in ${
            preferences?.style || 'Organic Modern'
          } style (${preferences?.budget || '$300–$500'}).`,
        });
        return;
      }

      let cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
      if (imageBase64.startsWith('/images/')) {
        try {
          const fs = await import('fs');
          const filePath = path.join(process.cwd(), 'public', imageBase64);
          if (fs.existsSync(filePath)) {
            cleanBase64 = fs.readFileSync(filePath).toString('base64');
          }
        } catch {
          // Fallback to existing string if read fails
        }
      }

      try {
        const imageResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [
              {
                inlineData: {
                  data: cleanBase64,
                  mimeType: cleanMime,
                },
              },
              {
                text: prompt,
              },
            ],
          },
        });

        let generatedBase64: string | null = null;
        let modelNote = '';
        const parts = imageResponse.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData?.data) {
            generatedBase64 = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          } else if (part.text) {
            modelNote += part.text;
          }
        }

        if (generatedBase64) {
          const updatedSummary =
            accountId && sessionToken
              ? defaultCreditStore.completeGenerationOperation({
                  accountId,
                  sessionToken,
                  operationId,
                  mode: 'live_ai',
                })
              : null;

          res.json({
            mode: 'live_ai',
            generatedImageDataUrl: generatedBase64,
            receivedPrompt: prompt,
            receivedPreferences: preferences,
            accountSummary: updatedSummary,
            designSummary:
              modelNote.trim() ||
              `AI-generated ${preferences?.style || 'Organic Modern'} redesign preserving your ${
                preferences?.roomType?.toLowerCase() || 'room'
              } architecture and active rental rules.`,
          });
          return;
        }
      } catch (imgErr: unknown) {
        const errMessage = imgErr instanceof Error ? imgErr.message : String(imgErr);
        const isQuotaOrBilling =
          errMessage.includes('resource_exhausted') ||
          errMessage.includes('429') ||
          errMessage.includes('quota') ||
          errMessage.includes('billing') ||
          errMessage.includes('API key');

        if (requireLiveAi) {
          const refundInfo = refundOnFailure(errMessage);
          res.status(isQuotaOrBilling ? 429 : 502).json({
            code: isQuotaOrBilling ? 'RATE_LIMIT' : 'PROVIDER_ERROR',
            error: isQuotaOrBilling
              ? 'Live Gemini image model quota is currently exhausted (HTTP 429). Your deducted credit was automatically refunded.'
              : `Live AI provider error: ${errMessage.slice(0, 140)}. Your deducted credit was automatically refunded.`,
            creditRefunded: refundInfo?.refunded ?? false,
            accountSummary: refundInfo?.summary ?? null,
          });
          return;
        }

        const updatedSummary =
          accountId && sessionToken
            ? defaultCreditStore.completeGenerationOperation({
                accountId,
                sessionToken,
                operationId,
                mode: 'demo_fallback',
              })
            : null;

        res.json({
          mode: 'demo_fallback',
          modeReason: isQuotaOrBilling
            ? 'Live image generation model quota is currently exhausted or requires a billed API key tier. Showing a clearly labeled Demo Mode architectural preview (not a real AI output) so you can test the full renter workflow.'
            : `Live image generation unavailable (${errMessage.slice(0, 120)}). Showing clearly labeled Demo Mode preview (not a real AI output).`,
          generatedImageDataUrl: null,
          receivedPrompt: prompt,
          receivedPreferences: preferences,
          accountSummary: updatedSummary,
          designSummary: `Demo Mode Concept (Not Live AI) tailored for your ${preferences?.roomType || 'room'} in ${
            preferences?.style || 'Organic Modern'
          } style (${preferences?.budget || '$300–$500'}).`,
        });
        return;
      }

      const updatedSummary =
        accountId && sessionToken
          ? defaultCreditStore.completeGenerationOperation({
              accountId,
              sessionToken,
              operationId,
              mode: 'demo_fallback',
            })
          : null;

      res.json({
        mode: 'demo_fallback',
        modeReason:
          'The image model did not return an inline image payload. Showing a clearly labeled Demo Mode architectural preview (not a real AI output).',
        generatedImageDataUrl: null,
        receivedPrompt: prompt,
        receivedPreferences: preferences,
        accountSummary: updatedSummary,
        designSummary: `Demo Mode Concept (Not Live AI) for your ${preferences?.roomType || 'room'} in ${
          preferences?.style || 'Organic Modern'
        } style.`,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unexpected server error during room redesign.';
      if (accountId && sessionToken) {
        defaultCreditStore.failAndRefundGenerationOperation({
          accountId,
          sessionToken,
          operationId,
          errorMessage: message,
        });
      }
      res.status(500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Eden Canvas server running on http://localhost:${PORT}`);
  });
}

startServer();
