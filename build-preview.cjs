const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const astroDir = path.join(distDir, '_astro');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('dist/index.html does not exist. Run npm run build first.');
  process.exit(1);
}

// Find CSS file dynamically
const cssFileName = fs.readdirSync(astroDir).find(f => f.endsWith('.css'));
if (!cssFileName) {
  console.error('No CSS file found in dist/_astro');
  process.exit(1);
}

const css = fs.readFileSync(path.join(astroDir, cssFileName), 'utf-8');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

function extractMain(fullHtml) {
  const match = fullHtml.match(/<main[\s\S]*?<\/main>/);
  return match ? match[0] : '';
}

// Read base pages
const selectionHtml = fs.readFileSync(path.join(distDir, 'selection', 'index.html'), 'utf-8');
const airportsHtml = fs.readFileSync(path.join(distDir, 'airports', 'index.html'), 'utf-8');
const radarHtml = fs.readFileSync(path.join(distDir, 'radar', 'index.html'), 'utf-8');
const architectureHtml = fs.readFileSync(path.join(distDir, 'architecture', 'index.html'), 'utf-8');
const postsHtml = fs.readFileSync(path.join(distDir, 'posts', 'index.html'), 'utf-8');
const blogHtmlPath = path.join(distDir, 'blog', 'index.html');
const blogHtml = fs.existsSync(blogHtmlPath) ? fs.readFileSync(blogHtmlPath, 'utf-8') : '';

// Inlined Base HTML
let html = indexHtml.replace(/<link rel="stylesheet" href="\/_astro\/[^"]+">/, `<style>${css}</style>`);

let viewsHtml = `
<div id="view-home">${extractMain(indexHtml)}</div>
<div id="view-selection" class="hidden">${extractMain(selectionHtml)}</div>
<div id="view-airports" class="hidden">${extractMain(airportsHtml)}</div>
<div id="view-radar" class="hidden">${extractMain(radarHtml)}</div>
<div id="view-architecture" class="hidden">${extractMain(architectureHtml)}</div>
<div id="view-posts" class="hidden">${extractMain(postsHtml)}</div>
${blogHtml ? `<div id="view-blog" class="hidden">${extractMain(blogHtml)}</div>` : ''}
`;

const routesMap = {
  '/': 'view-home',
  '/selection': 'view-selection',
  '/airports': 'view-airports',
  '/radar': 'view-radar',
  '/architecture': 'view-architecture',
  '/posts': 'view-posts',
  '/blog': 'view-blog',
};

// Dynamically scan dist/posts for all post slugs
const postsDistDir = path.join(distDir, 'posts');
if (fs.existsSync(postsDistDir)) {
  const entries = fs.readdirSync(postsDistDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const slug = entry.name;
      const slugIndexPath = path.join(postsDistDir, slug, 'index.html');
      if (fs.existsSync(slugIndexPath)) {
        const postHtml = fs.readFileSync(slugIndexPath, 'utf-8');
        const viewId = `view-post-${slug}`;
        viewsHtml += `\n<div id="${viewId}" class="hidden">${extractMain(postHtml)}</div>`;
        routesMap[`/posts/${slug}`] = viewId;
      }
    }
  }
}

html = html.replace(/<main[\s\S]*?<\/main>/, viewsHtml);

// Add router switcher script
const clientRouter = `
<script>
  const routes = ${JSON.stringify(routesMap, null, 2)};

  function navigateTo(targetPath) {
    const cleanPath = targetPath.endsWith('/') && targetPath.length > 1 ? targetPath.slice(0, -1) : targetPath;
    const targetViewId = routes[cleanPath] || 'view-home';

    Object.values(routes).forEach(viewId => {
      const el = document.getElementById(viewId);
      if (el) el.classList.add('hidden');
    });

    const activeEl = document.getElementById(targetViewId);
    if (activeEl) activeEl.classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update nav active states
    document.querySelectorAll('header nav a, #mobile-drawer a').forEach(link => {
      const href = link.getAttribute('href');
      const isRadar = href === '/radar';
      if (href === cleanPath) {
        if (isRadar) {
          link.className = 'px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 font-bold text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 border border-amber-200/80 dark:border-amber-800/80 shadow-sm';
        } else {
          link.className = 'px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 font-bold text-blue-600 dark:text-cyan-400 bg-blue-50/90 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 shadow-sm';
        }
      } else {
        if (isRadar) {
          link.className = 'px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 text-amber-600/90 dark:text-amber-400 hover:text-amber-600 hover:bg-amber-50/80 dark:hover:bg-amber-950/40';
        } else {
          link.className = 'px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60';
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      const href = link.getAttribute('href');
      if (href && (href.startsWith('/') || href === '')) {
        e.preventDefault();
        navigateTo(href);
      }
    });
  });
</script>
`;

html = html.replace('</body>', clientRouter + '</body>');

// Inline logo image as Base64 so file:// protocol never gets broken images
const logoPath = path.join(__dirname, 'public', 'logo.png');
if (fs.existsSync(logoPath)) {
  const logoDataUri = 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64');
  html = html.replaceAll('src="/logo.png"', `src="${logoDataUri}"`);
  html = html.replaceAll('href="/logo.png"', `href="${logoDataUri}"`);
  fs.copyFileSync(logoPath, path.join(__dirname, 'logo.png'));
  fs.copyFileSync(logoPath, path.join(distDir, 'logo.png'));
}

const outputPath = path.join(__dirname, 'preview.html');
const rootIndexPath = path.join(__dirname, 'index.html');
fs.writeFileSync(outputPath, html, 'utf-8');
fs.writeFileSync(rootIndexPath, html, 'utf-8');
console.log('index.html and preview.html generated successfully with Base64 inlined logo! File size:', html.length);
