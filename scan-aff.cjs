const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!['node_modules', '.git', 'dist', '.astro'].includes(file)) {
        results = results.concat(walk(fullPath));
      }
    } else if (file.endsWith('.md') || file.endsWith('.astro')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk('src');
console.log(`Total files in src: ${files.length}`);

const affPatterns = [
  'https://123pps01.huanqiutiaff.com/#/?code=j5VBUvw0',
  'https://123pp01.huanqiutiaff.com/#/?code=f1B0R1yM',
  'https://ppsvip01.dalaoyunaff.com/#/?code=Iz1GlCVa',
  'https://pp01.yunjiexianaff.com/#/?code=bp0ZSKBV',
  'https://ppsvip01.shandianshuaff.com/#/?code=QbLF8tjB',
  'https://pps123.shenxingaff.com/#/?code=6tQ7zHUc',
  'https://123pp01.liulianyunaff.com/#/?code=MsZP3u7G',
  'https://haozevpn.jlyvipaff.com/#/?code=jwCMOvQO',
  'https://everett7623.kosingaff.com/#/?code=sFKkfeYs',
  'https://wep.edgenovaaff.com/#/?code=mLLL6h6F',
  'https://pygllc.speedworldaff.cc/#/?code=kcoensXG',
  'https://gnt001.gntvipaff.cc/#/?code=PQhPFDhO',
  'https://fanxiaobin.kuailiaff.com/#/?code=e0cAmK7F',
  'https://kunpengjiasu.com/#/register?code=WPugVZUe',
  'https://super.ytjcok.org/#/register?code=poKwFVtv',
  'https://ddd.jichang.best/#/register?code=nldUZaYc'
];

let totalMatches = 0;
const fileStats = {};

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let countInFile = 0;
  affPatterns.forEach(pattern => {
    let pos = 0;
    while ((pos = content.indexOf(pattern, pos)) !== -1) {
      countInFile++;
      totalMatches++;
      pos += pattern.length;
    }
  });
  if (countInFile > 0) {
    fileStats[f] = countInFile;
  }
});

console.log('--- DETAILED MATCH COUNT PER FILE ---');
console.log(JSON.stringify(fileStats, null, 2));
console.log(`TOTAL AFF LINK OCCURRENCES TO REPLACE: ${totalMatches}`);
