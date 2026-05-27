import { JSDOM } from 'jsdom';
import fs from 'fs/promises';

const BASE_URL = 'https://web.archive.org/web/20250917010834/https://unveilingwithme.com';

const postUrls = [
  '/shine/',
  '/read-your-bible/',
  '/sparkles-snow-santa-or-something-more/',
  '/pride-and-unforgiveness-a-toxic-pair/',
  '/i-do/',
  '/happy-and-independent/',
  '/i-published-a-book-you-can-too/',
  '/lesson-from-matthew-chapter-2/',
  '/a-glimpse-of-childbirth/'
];

async function fetchPage(url) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    return new JSDOM(html).window.document;
  } catch (err) {
    console.error(`Failed to fetch ${url}`, err);
    return null;
  }
}

async function extractAbout() {
  console.log('Extracting About page...');
  const doc = await fetchPage(`${BASE_URL}/about-2/`);
  if (!doc) return;

  const contentElement = doc.querySelector('.entry-content') || doc.querySelector('main') || doc.querySelector('article');
  if (!contentElement) {
    console.error('Could not find content element for About page');
    return;
  }
  
  // Clean up
  contentElement.querySelectorAll('script, style, .sharedaddy').forEach(e => e.remove());
  
  const content = contentElement.innerHTML;
  await fs.writeFile('src/data/about.json', JSON.stringify({ content }, null, 2));
}

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function extractPosts() {
  const posts = [];
  
  for (const path of postUrls) {
    console.log(`Extracting post: ${path}...`);
    const doc = await fetchPage(`${BASE_URL}${path}`);
    if (!doc) continue;

    const titleEl = doc.querySelector('h1.entry-title') || doc.querySelector('h1');
    const title = titleEl ? titleEl.textContent.trim() : 'Unknown Title';
    
    let date = 'Unknown Date';
    const dateEl = doc.querySelector('.posted-on .published') || doc.querySelector('.entry-date');
    if (dateEl) {
      date = dateEl.textContent.trim();
    }

    let category = 'Uncategorized';
    const catEl = doc.querySelector('.cat-links a');
    if (catEl) {
      category = catEl.textContent.trim();
    }

    const contentElement = doc.querySelector('.entry-content') || doc.querySelector('main') || doc.querySelector('article');
    let content = '';
    if (contentElement) {
      contentElement.querySelectorAll('script, style, .sharedaddy').forEach(e => e.remove());
      content = contentElement.innerHTML;
    }

    posts.push({
      id: generateSlug(title),
      title,
      date,
      category,
      content,
      slug: generateSlug(title),
      image: "https://images.unsplash.com/photo-1596434444211-38290263625f?auto=format&fit=crop&q=80&w=800" // placeholder
    });
  }

  await fs.writeFile('src/data/posts.json', JSON.stringify(posts, null, 2));
  console.log('Done extracting posts.');
}

async function main() {
  await extractAbout();
  await extractPosts();
}

main().catch(console.error);
