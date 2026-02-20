import type { ExtractedContent } from '@/types/analysis';

export function classifyPageType(content: ExtractedContent, path: string): string {
  const lowerPath = path.toLowerCase();

  if (lowerPath === '/' || lowerPath === '/index') return 'homepage';
  if (lowerPath.includes('about')) return 'about';
  if (lowerPath.includes('contact')) return 'contact';
  if (lowerPath.includes('blog') || lowerPath.includes('article') || lowerPath.includes('post')) return 'blog';
  if (lowerPath.includes('product') || lowerPath.includes('shop') || lowerPath.includes('store')) return 'product';
  if (lowerPath.includes('pricing') || lowerPath.includes('plan')) return 'pricing';
  if (lowerPath.includes('faq') || lowerPath.includes('help') || lowerPath.includes('support')) return 'support';
  if (lowerPath.includes('login') || lowerPath.includes('signin') || lowerPath.includes('signup') || lowerPath.includes('register')) return 'auth';
  if (lowerPath.includes('terms') || lowerPath.includes('privacy') || lowerPath.includes('legal')) return 'legal';

  // Classify by content
  if (content.forms.length > 0) return 'form';
  if (content.images.length > 10) return 'gallery';

  return 'other';
}

export function calculateReadabilityScore(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
  const words = text.split(/\s+/).filter(Boolean).length || 1;
  const syllables = text.split(/\s+/).reduce((count, word) => {
    return count + countSyllables(word);
  }, 0);

  // Flesch Reading Ease
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  return Math.max(0, Math.min(100, Math.round(score)));
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  const vowels = word.match(/[aeiouy]+/g);
  let count = vowels ? vowels.length : 1;
  if (word.endsWith('e')) count--;
  return Math.max(1, count);
}

export function extractTextContent(content: ExtractedContent): string {
  const parts = [
    ...content.headings.map((h) => h.text),
    ...content.paragraphs,
  ];
  return parts.join(' ');
}
