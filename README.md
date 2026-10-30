# 🌐 VPN网络实验中心 (VPN NETWORK LAB)

> 权威、专业、客观的高性能跨域网络工程基准实测平台 · 自动化内核调优指南 · 零阻力悬浮拓扑调度

[![Build and Deploy with IndexNow](https://github.com/zs350235495-ui/shiyanshi/actions/workflows/deploy.yml/badge.svg)](https://github.com/zs350235495-ui/shiyanshi/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📌 站点信息与架构

- **官方独立域名**：[https://netlabvpn.vip](https://netlabvpn.vip)
- **底层架构**：Astro 4.x + TailwindCSS + Vanilla CSS (极客暗黑科技风设计系统)
- **技术特色**：
  - ⚡ **BGP 0-RTT 全景观测**：可视化 15 家专线机场晚高峰 72 小时综合压测大厅。
  - 🛡️ **AFF 301 隔离与合规**：全站推广链接统一收敛至 `/go.html?id=xxx`，并强制挂载 `rel="nofollow sponsored noopener noreferrer"`。
  - 🗺️ **SEO 网站地图规范**：自动输出符合 Google/Bing 标准的 `sitemap-index.xml` 与 `sitemap-0.xml`。
  - 🚀 **IndexNow 极速索引协议**：每次打包自动提取 43 条最新页面 URL，秒级推送至 Bing、Yandex 等搜索引擎。

---

## 📂 核心栏目矩阵

1. `/` —— **全景观测大厅**：综合横向评测总览与金刚架构指示器。
2. `/airports` —— **专线机场列表**：15 家精选 IPLC/IEPL 专线机场套餐与折扣码。
3. `/posts` —— **机场评测长文**：30+ 篇覆盖 1500~2000 字的深度技术文章与测速报告。
4. `/selection` —— **选型智库**：外贸办公、流媒体、AI 开发与极客场景化选型模型。
5. `/radar` —— **避坑雷达**：超卖机场预警、黑产特征与防跑路防御指南。
6. `/architecture` —— **金刚架构**：双通道冷备容灾、内核 BBRv3 优化与抗封锁规范。
7. `/blog` —— **技术博客**：知识库与专线网络科普。

---

## 🛠️ 本地开发与构建指南

### 安装依赖
```bash
npm install
```

### 启动本地实时热重载开发服务器
```bash
npm run dev
```

### 静态构建打包（自动生成 Sitemap 与触发 IndexNow 批量推送）
```bash
npm run build
```

### 手动单次触发 IndexNow 推送
```bash
npm run indexnow
```

---

## 🚀 部署配置说明

### 1. GitHub Pages
在仓库的 **Settings -> Pages** 中，将 **Build and deployment -> Source** 设置为 **`GitHub Actions`** 即可实现自动构建部署。

### 2. Cloudflare Pages / Netlify
项目根目录及 `public/_redirects` 已内置完整的 301 隔离重定向规则，直接连接 GitHub 仓库即可零配置发布。

### 3. VPS / 宝塔面板 Nginx
在站点 Nginx 配置文件的 `server { ... }` 块内引入：
```nginx
include /path/to/shiyanshi/nginx-redirects.conf;
```

---

© 2026 VPN网络实验中心 (VPN NETWORK LAB). All Rights Reserved.
