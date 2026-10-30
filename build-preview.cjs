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

    const affMap = {
      'hq': 'https://123pps01.huanqiutiaff.com/#/?code=j5VBUvw0',
      'huanqiu': 'https://123pps01.huanqiutiaff.com/#/?code=j5VBUvw0',
      'huanqiuti': 'https://123pps01.huanqiutiaff.com/#/?code=j5VBUvw0',
      '1': 'https://123pps01.huanqiutiaff.com/#/?code=j5VBUvw0',
      'dly': 'https://ppsvip01.dalaoyunaff.com/#/?code=Iz1GlCVa',
      'dalaoyun': 'https://ppsvip01.dalaoyunaff.com/#/?code=Iz1GlCVa',
      '2': 'https://ppsvip01.dalaoyunaff.com/#/?code=Iz1GlCVa',
      'yjx': 'https://pp01.yunjiexianaff.com/#/?code=bp0ZSKBV',
      'yunjiexian': 'https://pp01.yunjiexianaff.com/#/?code=bp0ZSKBV',
      '3': 'https://pp01.yunjiexianaff.com/#/?code=bp0ZSKBV',
      'sds': 'https://ppsvip01.shandianshuaff.com/#/?code=QbLF8tjB',
      'shandianshu': 'https://ppsvip01.shandianshuaff.com/#/?code=QbLF8tjB',
      '4': 'https://ppsvip01.shandianshuaff.com/#/?code=QbLF8tjB',
      'sx': 'https://pps123.shenxingaff.com/#/?code=6tQ7zHUc',
      'shenxing': 'https://pps123.shenxingaff.com/#/?code=6tQ7zHUc',
      '5': 'https://pps123.shenxingaff.com/#/?code=6tQ7zHUc',
      'lly': 'https://123pp01.liulianyunaff.com/#/?code=MsZP3u7G',
      'liulianyun': 'https://123pp01.liulianyunaff.com/#/?code=MsZP3u7G',
      '6': 'https://123pp01.liulianyunaff.com/#/?code=MsZP3u7G',
      'jly': 'https://haozevpn.jlyvipaff.com/#/?code=jwCMOvQO',
      'jilianyun': 'https://haozevpn.jlyvipaff.com/#/?code=jwCMOvQO',
      '7': 'https://haozevpn.jlyvipaff.com/#/?code=jwCMOvQO',
      'kxy': 'https://everett7623.kosingaff.com/#/?code=sFKkfEYs',
      'kexinyun': 'https://everett7623.kosingaff.com/#/?code=sFKkfEYs',
      '8': 'https://everett7623.kosingaff.com/#/?code=sFKkfEYs',
      'edgenova': 'https://wep.edgenovaaff.com/#/?code=mLLL6h6F',
      '9': 'https://wep.edgenovaaff.com/#/?code=mLLL6h6F',
      'speedworld': 'https://pygllc.speedworldaff.cc/#/?code=kcoensXG',
      'sujie': 'https://pygllc.speedworldaff.cc/#/?code=kcoensXG',
      '10': 'https://pygllc.speedworldaff.cc/#/?code=kcoensXG',
      'gnt': 'https://gnt001.gntvipaff.cc/#/?code=PQhPFDhO',
      'guangnianti': 'https://gnt001.gntvipaff.cc/#/?code=PQhPFDhO',
      '11': 'https://gnt001.gntvipaff.cc/#/?code=PQhPFDhO',
      'kuaili': 'https://fanxiaobin.kuailiaff.com/#/?code=e0cAmK7F',
      '12': 'https://fanxiaobin.kuailiaff.com/#/?code=e0cAmK7F',
      'kunpeng': 'https://kunpengjiasu.com/#/register?code=WPugVZUe',
      '13': 'https://kunpengjiasu.com/#/register?code=WPugVZUe',
      'yuntu': 'https://super.ytjcok.org/#/register?code=poKwFVtv',
      '14': 'https://super.ytjcok.org/#/register?code=poKwFVtv',
      'shunyun': 'https://ddd.jichang.best/#/register?code=nldUZaYc',
      '15': 'https://ddd.jichang.best/#/register?code=nldUZaYc'
    };

    document.addEventListener('DOMContentLoaded', () => {
      document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href) return;

        // 1. 严格处理推广外链 (/go.html?id=xxx 或 /go/xxx) - 绝不阻断，直接瞬时新窗口唤起
        if (href.startsWith('/go.html') || href.startsWith('/go/') || href.includes('go.html?')) {
          e.preventDefault();
          let id = '';
          if (href.includes('?id=')) {
            id = href.split('?id=')[1].split('&')[0];
          } else if (href.includes('?to=')) {
            id = href.split('?to=')[1].split('&')[0];
          } else if (href.startsWith('/go/')) {
            id = href.replace('/go/', '').split('?')[0];
          }
          const targetUrl = affMap[(id || '').toLowerCase().trim()] || affMap['hq'];
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
          return;
        }

        // 2. target="_blank" 的普通外部链接直接放行
        if (link.getAttribute('target') === '_blank') {
          return;
        }

        // 3. 站内单页虚拟路由切换
        if (href.startsWith('/') || href === '') {
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
