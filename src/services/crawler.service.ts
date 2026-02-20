import { chromium, type Browser, type Page } from 'playwright';
import { VIEWPORTS } from '@/lib/constants';
import type { CrawlResult, ExtractedContent } from '@/types/analysis';

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
  return browser;
}

export async function crawlPage(url: string): Promise<CrawlResult> {
  const b = await getBrowser();
  const context = await b.newContext({
    userAgent: 'PageLens Bot/1.0 (+https://pagelens.ai/bot)',
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  try {
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    const statusCode = response?.status() || 0;
    const title = await page.title();

    // Extract content
    const content = await extractContent(page);

    // Capture screenshots for each viewport
    const screenshots = [];
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(500);
      const buffer = await page.screenshot({ fullPage: true, type: 'png' });
      screenshots.push({
        viewport: vp.width,
        buffer: Buffer.from(buffer),
        width: vp.width,
        height: vp.height,
      });
    }

    const parsedUrl = new URL(url);

    return {
      url,
      path: parsedUrl.pathname,
      title,
      statusCode,
      content,
      screenshots,
    };
  } finally {
    await context.close();
  }
}

async function extractContent(page: Page): Promise<ExtractedContent> {
  return page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map((h) => ({
      level: parseInt(h.tagName[1]),
      text: h.textContent?.trim() || '',
    }));

    const paragraphs = Array.from(document.querySelectorAll('p')).map((p) => p.textContent?.trim() || '').filter(Boolean);

    const links = Array.from(document.querySelectorAll('a[href]')).map((a) => {
      const href = a.getAttribute('href') || '';
      return {
        href,
        text: a.textContent?.trim() || '',
        isExternal: href.startsWith('http') && !href.includes(window.location.hostname),
      };
    });

    const images = Array.from(document.querySelectorAll('img')).map((img) => ({
      src: img.src,
      alt: img.alt,
      width: img.naturalWidth,
      height: img.naturalHeight,
    }));

    const forms = Array.from(document.querySelectorAll('form')).map((form) => ({
      action: form.action || '',
      fields: Array.from(form.querySelectorAll('input, textarea, select')).map((f) => (f as HTMLInputElement).name || (f as HTMLInputElement).type),
    }));

    const ctaButtons = Array.from(document.querySelectorAll('a, button')).filter((el) => {
      const text = el.textContent?.toLowerCase() || '';
      return ['sign up', 'get started', 'buy', 'subscribe', 'try', 'start', 'contact', 'demo', 'free'].some((kw) => text.includes(kw));
    }).map((el) => ({
      text: el.textContent?.trim() || '',
      href: el.getAttribute('href') || undefined,
    }));

    const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const metaKeywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';

    const ogTags: Record<string, string> = {};
    document.querySelectorAll('meta[property^="og:"]').forEach((m) => {
      ogTags[m.getAttribute('property') || ''] = m.getAttribute('content') || '';
    });

    const structuredData: Record<string, unknown>[] = [];
    document.querySelectorAll('script[type="application/ld+json"]').forEach((s) => {
      try { structuredData.push(JSON.parse(s.textContent || '{}')); } catch {}
    });

    const bodyText = document.body?.textContent || '';
    const wordCount = bodyText.split(/\s+/).filter(Boolean).length;

    return {
      title: document.title,
      metaDescription: metaDesc,
      metaKeywords: metaKeywords,
      headings,
      paragraphs,
      links,
      images,
      forms,
      ctaButtons,
      ogTags,
      structuredData,
      wordCount,
    };
  });
}

export async function discoverLinks(url: string, maxDepth: number, maxPages: number): Promise<string[]> {
  const b = await getBrowser();
  const context = await b.newContext();
  const page = await context.newPage();
  const discovered = new Set<string>();
  const base = new URL(url);

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

    const links = await page.evaluate((hostname) => {
      return Array.from(document.querySelectorAll('a[href]'))
        .map((a) => a.getAttribute('href'))
        .filter((href): href is string => !!href)
        .filter((href) => {
          try {
            const u = new URL(href, window.location.origin);
            return u.hostname === hostname && !href.includes('#') && !href.match(/\.(pdf|jpg|png|gif|svg|css|js)$/i);
          } catch { return false; }
        })
        .map((href) => new URL(href, window.location.origin).toString());
    }, base.hostname);

    links.forEach((l) => discovered.add(l));
  } finally {
    await context.close();
  }

  return Array.from(discovered).slice(0, maxPages);
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}
