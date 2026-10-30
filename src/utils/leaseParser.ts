/**
 * Client-Side Lease Privacy Redaction & Parsing Utilities
 * Ensures sensitive Personally Identifiable Information (PII) is masked BEFORE
 * leaving the device. Leases are processed ephemerally and never stored.
 */

export interface ParsedLeaseClause {
  id: string;
  topic: 'Painting' | 'Wall Damage & Anchors' | 'Fixtures & Lighting' | 'Alterations' | 'Flooring & Carpets';
  originalExcerpt: string;
  plainRule: string;
  suggestedConstraint: string;
  confirmed: boolean;
}

/**
 * Masks names, SSNs, account/routing numbers, phone numbers, email addresses,
 * dollar amounts, and signature blocks in the browser before network transmission.
 */
export function redactLeaseTextLocally(rawText: string): {
  redactedText: string;
  redactionsCount: number;
} {
  let text = rawText;
  let count = 0;

  // 1. Social Security Numbers (e.g. 123-45-6789 or 123 45 6789)
  const ssnRegex = /\b\d{3}[- ]?\d{2}[- ]?\d{4}\b/g;
  text = text.replace(ssnRegex, () => {
    count++;
    return '[REDACTED SSN]';
  });

  // 2. Bank / Routing / Account numbers (8 to 17 digits)
  const acctRegex = /\b\d{8,17}\b/g;
  text = text.replace(acctRegex, () => {
    count++;
    return '[REDACTED ACCOUNT]';
  });

  // 3. Phone numbers
  const phoneRegex = /\b(?:\+?1[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}\b/g;
  text = text.replace(phoneRegex, () => {
    count++;
    return '[REDACTED PHONE]';
  });

  // 4. Email addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  text = text.replace(emailRegex, () => {
    count++;
    return '[REDACTED EMAIL]';
  });

  // 5. Explicit Tenant / Landlord named lines
  // e.g. "Tenant: John Smith", "Resident Name: Jane Doe", "Landlord: Apex Properties LLC"
  const nameLineRegex = /(?:Tenant|Resident|Landlord|Lessor|Lessee|Owner)(?:\s*(?:Name)?[:\-]\s*)([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)+)/gi;
  text = text.replace(nameLineRegex, (match, p1) => {
    count++;
    return match.replace(p1, '[REDACTED NAME]');
  });

  // 6. Signatures and signature blocks
  const sigRegex = /(?:Signed|Signature|Tenant Signature|Landlord Signature|Date Signed)(?:\s*[:\-_\.]{1,30}\s*)([A-Za-z0-9\s,\/]{0,40})/gi;
  text = text.replace(sigRegex, () => {
    count++;
    return '[REDACTED SIGNATURE]';
  });

  // 7. Monthly Rent Dollar amounts
  const rentRegex = /\$[\d,]+(?:\.\d{2})?(?:\s*(?:\/|per)?\s*(?:month|mo|year|deposit))?/gi;
  text = text.replace(rentRegex, () => {
    count++;
    return '[REDACTED RENT]';
  });

  return {
    redactedText: text,
    redactionsCount: count,
  };
}

/**
 * Heuristic client-side lease clause parser (Used as immediate preview or demo fallback)
 * Scans text for lease keywords regarding painting, nails, alterations, and fixtures.
 */
export function extractHeuristicLeaseClauses(redactedText: string): ParsedLeaseClause[] {
  const clauses: ParsedLeaseClause[] = [];
  const sentences = redactedText.split(/(?<=[.?!])\s+/);

  sentences.forEach((sentence, index) => {
    const lower = sentence.toLowerCase();

    // 1. Painting clauses
    if (lower.includes('paint') || lower.includes('wallpaper') || lower.includes('color')) {
      clauses.push({
        id: `clause-paint-${index}`,
        topic: 'Painting',
        originalExcerpt: sentence.trim().slice(0, 160),
        plainRule: 'No wall painting or permanent wallpaper without written landlord authorization.',
        suggestedConstraint: 'Preserve existing wall color; strictly use removable art and peel-and-stick films.',
        confirmed: true,
      });
    }

    // 2. Nails / Anchors / Drywall
    if (
      lower.includes('nail') ||
      lower.includes('anchor') ||
      lower.includes('screw') ||
      lower.includes('hole') ||
      lower.includes('drywall')
    ) {
      clauses.push({
        id: `clause-anchor-${index}`,
        topic: 'Wall Damage & Anchors',
        originalExcerpt: sentence.trim().slice(0, 160),
        plainRule: 'No screws, heavy anchors, or large holes permitted in drywall.',
        suggestedConstraint: 'Zero drywall anchors; use interlocking adhesive strips or tension mounts only.',
        confirmed: true,
      });
    }

    // 3. Fixtures / Lighting / Electrical
    if (
      lower.includes('fixture') ||
      lower.includes('electrical') ||
      lower.includes('light') ||
      lower.includes('wire') ||
      lower.includes('ceiling fan')
    ) {
      clauses.push({
        id: `clause-fixture-${index}`,
        topic: 'Fixtures & Lighting',
        originalExcerpt: sentence.trim().slice(0, 160),
        plainRule: 'Existing electrical and ceiling light fixtures must remain unaltered.',
        suggestedConstraint: 'Do not replace or hardwire ceiling fixtures; apply plug-in lighting alternatives only.',
        confirmed: true,
      });
    }

    // 4. General Alterations / Cabinets
    if (lower.includes('alteration') || lower.includes('modify') || lower.includes('cabinet')) {
      clauses.push({
        id: `clause-alter-${index}`,
        topic: 'Alterations',
        originalExcerpt: sentence.trim().slice(0, 160),
        plainRule: 'Premises must be returned in identical move-in condition.',
        suggestedConstraint: 'Ensure 100% reversible decor with zero permanent modifications or adhesive residue.',
        confirmed: true,
      });
    }
  });

  // Deduplicate by topic to present clean unique rules
  const uniqueClausesMap = new Map<string, ParsedLeaseClause>();
  for (const c of clauses) {
    if (!uniqueClausesMap.has(c.topic)) {
      uniqueClausesMap.set(c.topic, c);
    }
  }

  // If no specific clauses matched, supply standard default lease rules
  if (uniqueClausesMap.size === 0) {
    uniqueClausesMap.set('Wall Damage & Anchors', {
      id: 'default-1',
      topic: 'Wall Damage & Anchors',
      originalExcerpt: 'Tenant shall not drive nails or screws into walls without consent.',
      plainRule: 'Zero drywall anchors or screws permitted.',
      suggestedConstraint: 'Use adhesive strips and tension poles only.',
      confirmed: true,
    });
    uniqueClausesMap.set('Painting', {
      id: 'default-2',
      topic: 'Painting',
      originalExcerpt: 'Tenant shall not paint or apply permanent wall coverings.',
      plainRule: 'No painting or permanent wallpaper.',
      suggestedConstraint: 'Preserve existing wall finish intact.',
      confirmed: true,
    });
  }

  return Array.from(uniqueClausesMap.values());
}
