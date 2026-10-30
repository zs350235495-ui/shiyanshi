const fs = require('fs');
const path = require('path');

// 映射表
const affMap = [
  { raw: 'https://123pps01.huanqiutiaff.com/#/?code=j5VBUvw0', id: 'hq' },
  { raw: 'https://123pp01.huanqiutiaff.com/#/?code=f1B0R1yM', id: 'hq' },
  { raw: 'https://ppsvip01.dalaoyunaff.com/#/?code=Iz1GlCVa', id: 'dly' },
  { raw: 'https://pp01.yunjiexianaff.com/#/?code=bp0ZSKBV', id: 'yjx' },
  { raw: 'https://ppsvip01.shandianshuaff.com/#/?code=QbLF8tjB', id: 'sds' },
  { raw: 'https://pps123.shenxingaff.com/#/?code=6tQ7zHUc', id: 'sx' },
  { raw: 'https://123pp01.liulianyunaff.com/#/?code=MsZP3u7G', id: 'lly' },
  { raw: 'https://haozevpn.jlyvipaff.com/#/?code=jwCMOvQO', id: 'jly' },
  { raw: 'https://everett7623.kosingaff.com/#/?code=sFKkfEYs', id: 'kxy' },
  { raw: 'https://everett7623.kosingaff.com/#/?code=sFKkfeYs', id: 'kxy' },
  { raw: 'https://wep.edgenovaaff.com/#/?code=mLLL6h6F', id: 'edgenova' },
  { raw: 'https://pygllc.speedworldaff.cc/#/?code=kcoensXG', id: 'speedworld' },
  { raw: 'https://gnt001.gntvipaff.cc/#/?code=PQhPFDhO', id: 'gnt' },
  { raw: 'https://fanxiaobin.kuailiaff.com/#/?code=e0cAmK7F', id: 'kuaili' },
  { raw: 'https://kunpengjiasu.com/#/register?code=WPugVZUe', id: 'kunpeng' },
  { raw: 'https://super.ytjcok.org/#/register?code=poKwFVtv', id: 'yuntu' },
  { raw: 'https://ddd.jichang.best/#/register?code=nldUZaYc', id: 'shunyun' }
];

let totalReplaced = 0;
const report = [];

// 1. 处理 Markdown 文章
const postsDir = path.join(__dirname, 'src', 'content', 'posts');
const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

postFiles.forEach(file => {
  const filePath = path.join(postsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let replacedInFile = 0;

  // 匹配特定 markdown 形式
  // [环球梯 (HuanQiuTi)](https://123pps01.huanqiutiaff.com/#/?code=j5VBUvw0)
  const pattern1 = /\[(环球梯\s*\(HuanQiuTi\))\]\(https:\/\/123pps01\.huanqiutiaff\.com\/#\/\?code=j5VBUvw0\)/g;
  if (pattern1.test(content)) {
    content = content.replace(pattern1, '<a href="/go.html?id=hq" target="_blank" rel="nofollow sponsored noopener noreferrer">$1</a>');
    replacedInFile++;
    totalReplaced++;
  }

  // [立即直达环球梯官方注册入口](https://123pps01.huanqiutiaff.com/#/?code=j5VBUvw0)
  const pattern2 = /\[(立即直达环球梯官方注册入口)\]\(https:\/\/123pps01\.huanqiutiaff\.com\/#\/\?code=j5VBUvw0\)/g;
  if (pattern2.test(content)) {
    content = content.replace(pattern2, '<a href="/go.html?id=hq" target="_blank" rel="nofollow sponsored noopener noreferrer">$1</a>');
    replacedInFile++;
    totalReplaced++;
  }

  // 通用兜底如果有其它遗漏的 markdown 链接形式: [Text](AFF_URL)
  affMap.forEach(({ raw, id }) => {
    const rawEscaped = raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const genericMdRegex = new RegExp(`\\[([^\\]]+)\\]\\(${rawEscaped}\\)`, 'g');
    content = content.replace(genericMdRegex, (match, linkText) => {
      replacedInFile++;
      totalReplaced++;
      return `<a href="/go.html?id=${id}" target="_blank" rel="nofollow sponsored noopener noreferrer">${linkText}</a>`;
    });
  });

  if (replacedInFile > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    report.push({ file: `src/content/posts/${file}`, replaced: replacedInFile });
  }
});

// 2. 处理 src/pages/airports/index.astro
const airportsFile = path.join(__dirname, 'src', 'pages', 'airports', 'index.astro');
if (fs.existsSync(airportsFile)) {
  let content = fs.readFileSync(airportsFile, 'utf8');
  let replacedInFile = 0;

  affMap.forEach(({ raw, id }) => {
    while (content.includes(`'${raw}'`) || content.includes(`"${raw}"`)) {
      content = content.replace(`'${raw}'`, `'/go.html?id=${id}'`);
      content = content.replace(`"${raw}"`, `"/go.html?id=${id}"`);
      replacedInFile++;
      totalReplaced++;
    }
  });

  if (replacedInFile > 0) {
    fs.writeFileSync(airportsFile, content, 'utf8');
    report.push({ file: 'src/pages/airports/index.astro', replaced: replacedInFile });
  }
}

// 3. 处理 src/components/AirportCard.astro
const cardFile = path.join(__dirname, 'src', 'components', 'AirportCard.astro');
if (fs.existsSync(cardFile)) {
  let content = fs.readFileSync(cardFile, 'utf8');
  let modified = false;

  // 强化 rel="nofollow sponsored noopener noreferrer"
  if (content.includes('rel="noopener noreferrer"')) {
    content = content.replace('rel="noopener noreferrer"', 'rel="nofollow sponsored noopener noreferrer"');
    modified = true;
  }
  if (modified) {
    fs.writeFileSync(cardFile, content, 'utf8');
    report.push({ file: 'src/components/AirportCard.astro', replaced: 'rel 强化为 nofollow sponsored' });
  }
}

// 4. 处理 src/pages/posts/index.astro
const postsIndexFile = path.join(__dirname, 'src', 'pages', 'posts', 'index.astro');
if (fs.existsSync(postsIndexFile)) {
  let content = fs.readFileSync(postsIndexFile, 'utf8');
  let replacedInFile = 0;

  affMap.forEach(({ raw, id }) => {
    while (content.includes(`'${raw}'`) || content.includes(`"${raw}"`)) {
      content = content.replace(`'${raw}'`, `'/go.html?id=${id}'`);
      content = content.replace(`"${raw}"`, `"/go.html?id=${id}"`);
      replacedInFile++;
      totalReplaced++;
    }
  });

  // 强化表格内外链标签的 rel 属性
  content = content.replace(/rel="noopener noreferrer"/g, 'rel="nofollow sponsored noopener noreferrer"');

  if (replacedInFile > 0) {
    fs.writeFileSync(postsIndexFile, content, 'utf8');
    report.push({ file: 'src/pages/posts/index.astro', replaced: replacedInFile });
  }
}

// 5. 处理 src/pages/selection/index.astro
const selectionFile = path.join(__dirname, 'src', 'pages', 'selection', 'index.astro');
if (fs.existsSync(selectionFile)) {
  let content = fs.readFileSync(selectionFile, 'utf8');
  let replacedInFile = 0;

  affMap.forEach(({ raw, id }) => {
    while (content.includes(`'${raw}'`) || content.includes(`"${raw}"`)) {
      content = content.replace(`'${raw}'`, `'/go.html?id=${id}'`);
      content = content.replace(`"${raw}"`, `"/go.html?id=${id}"`);
      replacedInFile++;
      totalReplaced++;
    }
  });

  // 强化卡片按钮的 rel 属性
  content = content.replace(/rel="noopener noreferrer"/g, 'rel="nofollow sponsored noopener noreferrer"');

  if (replacedInFile > 0) {
    fs.writeFileSync(selectionFile, content, 'utf8');
    report.push({ file: 'src/pages/selection/index.astro', replaced: replacedInFile });
  }
}

// 6. 处理 src/pages/index.astro
const indexFile = path.join(__dirname, 'src', 'pages', 'index.astro');
if (fs.existsSync(indexFile)) {
  let content = fs.readFileSync(indexFile, 'utf8');
  let replacedInFile = 0;

  affMap.forEach(({ raw, id }) => {
    while (content.includes(`'${raw}'`) || content.includes(`"${raw}"`)) {
      content = content.replace(`'${raw}'`, `'/go.html?id=${id}'`);
      content = content.replace(`"${raw}"`, `"/go.html?id=${id}"`);
      replacedInFile++;
      totalReplaced++;
    }
  });

  content = content.replace(/rel="noopener noreferrer"/g, 'rel="nofollow sponsored noopener noreferrer"');

  if (replacedInFile > 0) {
    fs.writeFileSync(indexFile, content, 'utf8');
    report.push({ file: 'src/pages/index.astro', replaced: replacedInFile });
  }
}

// 7. 处理 src/pages/blog/index.astro
const blogIndexFile = path.join(__dirname, 'src', 'pages', 'blog', 'index.astro');
if (fs.existsSync(blogIndexFile)) {
  let content = fs.readFileSync(blogIndexFile, 'utf8');
  let replacedInFile = 0;

  affMap.forEach(({ raw, id }) => {
    while (content.includes(`'${raw}'`) || content.includes(`"${raw}"`)) {
      content = content.replace(`'${raw}'`, `'/go.html?id=${id}'`);
      content = content.replace(`"${raw}"`, `"/go.html?id=${id}"`);
      replacedInFile++;
      totalReplaced++;
    }
  });

  content = content.replace(/rel="noopener noreferrer"/g, 'rel="nofollow sponsored noopener noreferrer"');

  if (replacedInFile > 0) {
    fs.writeFileSync(blogIndexFile, content, 'utf8');
    report.push({ file: 'src/pages/blog/index.astro', replaced: replacedInFile });
  }
}

console.log('--- REPLACEMENT SUMMARY ---');
console.log(JSON.stringify(report, null, 2));
console.log(`TOTAL AFF LINKS REPLACED: ${totalReplaced}`);
