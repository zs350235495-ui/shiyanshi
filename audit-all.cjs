const fs = require('fs');
const path = require('path');

const rawAffPatterns = [
  'https://123pps01.huanqiutiaff.com/#/?code=j5VBUvw0',
  'https://123pp01.huanqiutiaff.com/#/?code=f1B0R1yM',
  'https://ppsvip01.dalaoyunaff.com/#/?code=Iz1GlCVa',
  'https://pp01.yunjiexianaff.com/#/?code=bp0ZSKBV',
  'https://ppsvip01.shandianshuaff.com/#/?code=QbLF8tjB',
  'https://pps123.shenxingaff.com/#/?code=6tQ7zHUc',
  'https://123pp01.liulianyunaff.com/#/?code=MsZP3u7G',
  'https://haozevpn.jlyvipaff.com/#/?code=jwCMOvQO',
  'https://everett7623.kosingaff.com/#/?code=sFKkfEYs',
  'https://everett7623.kosingaff.com/#/?code=sFKkfeYs',
  'https://wep.edgenovaaff.com/#/?code=mLLL6h6F',
  'https://pygllc.speedworldaff.cc/#/?code=kcoensXG',
  'https://gnt001.gntvipaff.cc/#/?code=PQhPFDhO',
  'https://fanxiaobin.kuailiaff.com/#/?code=e0cAmK7F',
  'https://kunpengjiasu.com/#/register?code=WPugVZUe',
  'https://super.ytjcok.org/#/register?code=poKwFVtv',
  'https://ddd.jichang.best/#/register?code=nldUZaYc'
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const htmlFiles = walk('dist');
console.log(`Auditing ${htmlFiles.length} generated HTML files in dist/...`);

let leakCount = 0;
let goLinkCount = 0;
let relCompliantCount = 0;
let relNonCompliantCount = 0;

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative('dist', file).replace(/\\/g, '/');

  // 1. 检查是否存在泄漏的直连 AFF（排除中转页 go.html）
  if (relPath !== 'go.html') {
    rawAffPatterns.forEach(pattern => {
      if (content.includes(pattern)) {
        console.error(`[LEAK DETECTED] in ${relPath}: found ${pattern}`);
        leakCount++;
      }
    });
  }

  // 2. 检查 /go.html 链接的 rel 属性合规性
  // 匹配所有 href 包含 go.html 的 a 标签
  const aTagRegex = /<a\s+[^>]*href=["']([^"']*go\.html[^"']*)["'][^>]*>/gi;
  let match;
  while ((match = aTagRegex.exec(content)) !== null) {
    goLinkCount++;
    const fullTag = match[0];
    if (fullTag.includes('nofollow') && fullTag.includes('sponsored')) {
      relCompliantCount++;
    } else {
      console.warn(`[REL WARNING] In ${relPath}: ${fullTag} lacks complete rel="nofollow sponsored"`);
      relNonCompliantCount++;
    }
  }
});

console.log('--- AUDIT RESULTS ---');
console.log(`Total HTML files scanned: ${htmlFiles.length}`);
console.log(`Direct Affiliate Leaks outside go.html: ${leakCount}`);
console.log(`Total /go.html links found in compiled HTML: ${goLinkCount}`);
console.log(`Compliant links with rel="nofollow sponsored": ${relCompliantCount}`);
console.log(`Non-compliant links: ${relNonCompliantCount}`);

if (leakCount === 0 && relNonCompliantCount === 0) {
  console.log('✅ ALL AUDIT GATES PASSED! Zero leaks, 100% compliant rel tags.');
} else {
  console.log('❌ Audit found issues to address.');
}
