import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://netlabvpn.vip',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      changefreq: 'daily',
      priority: 0.8,
      lastmod: new Date(),
      customPages: [
        'https://netlabvpn.vip/articles/tls13-ech-zero-rtt-handshake-optimization-2026.html',
      ],
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true,
    },
  },
});
