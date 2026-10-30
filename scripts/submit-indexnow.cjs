/**
 * IndexNow 自动批量推送脚本
 * 官方协议规范: https://www.indexnow.org/documentation
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = 'f8cc020243767591847dbdc5a8018206';
const HOST = 'netlabvpn.vip';
const KEY_LOCATION = `https://${HOST}/${API_KEY}.txt`;
const INDEXNOW_ENDPOINT = 'api.indexnow.org';

function getUrlsFromSitemaps() {
  const urls = new Set();
  const distDir = path.join(__dirname, '..', 'dist');

  // 1. 尝试读取 dist/sitemap-0.xml
  const sitemap0 = path.join(distDir, 'sitemap-0.xml');
  const sitemapXml = path.join(distDir, 'sitemap.xml');
  const sitemapIndex = path.join(distDir, 'sitemap-index.xml');

  [sitemap0, sitemapXml, sitemapIndex].forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const locRegex = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
      let match;
      while ((match = locRegex.exec(content)) !== null) {
        const url = match[1];
        // 排除 .xml 本身
        if (!url.endsWith('.xml')) {
          urls.add(url);
        }
      }
    }
  });

  // 如果依然为空，使用兜底根域名
  if (urls.size === 0) {
    urls.add(`https://${HOST}/`);
  }

  return Array.from(urls);
}

function submitToIndexNow(urlList) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      host: HOST,
      key: API_KEY,
      keyLocation: KEY_LOCATION,
      urlList: urlList
    });

    const options = {
      hostname: INDEXNOW_ENDPOINT,
      port: 443,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload),
        'User-Agent': 'IndexNow-AutoPusher/1.0'
      }
    };

    console.log(`[IndexNow] 正在向 https://${INDEXNOW_ENDPOINT}/indexnow 提交 ${urlList.length} 条 URL...`);
    console.log(`[IndexNow] 站点域名: ${HOST}`);
    console.log(`[IndexNow] 密钥文件位置: ${KEY_LOCATION}`);

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        console.log(`[IndexNow] 服务器返回状态码: ${res.statusCode} (${res.statusMessage})`);
        if (responseBody) {
          console.log(`[IndexNow] 响应内容: ${responseBody}`);
        }

        if (res.statusCode === 200 || res.statusCode === 202) {
          console.log('✅ [IndexNow] 提交成功！URL 已成功分发至 Bing、Yandex、Naver、Seznam 等搜索引擎。');
          resolve({ statusCode: res.statusCode, body: responseBody });
        } else {
          console.warn(`⚠️ [IndexNow] 返回状态码非 200/202: ${res.statusCode}`);
          resolve({ statusCode: res.statusCode, body: responseBody });
        }
      });
    });

    req.on('error', (err) => {
      console.error('❌ [IndexNow] 网络请求失败:', err.message);
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

async function main() {
  const isTestSingle = process.argv.includes('--test') || process.argv.includes('-t');
  let urlList = [];

  if (isTestSingle) {
    urlList = [`https://${HOST}/`];
    console.log(`[IndexNow] 模式: 单 URL 首页连通性测试 (仅推送首页)`);
  } else {
    urlList = getUrlsFromSitemaps();
    console.log(`[IndexNow] 模式: 全站 Sitemaps 自动同步`);
  }

  console.log(`[IndexNow] 即将推送的 URL 列表样本 (前 5 条):`, urlList.slice(0, 5));
  if (urlList.length > 5) {
    console.log(`[IndexNow] ... 以及其余 ${urlList.length - 5} 条 URL`);
  }

  try {
    await submitToIndexNow(urlList);
  } catch (e) {
    process.exit(1);
  }
}

main();
