/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://riverflow.art',
  generateRobotsTxt: false, // We already have a custom robots.txt
  generateIndexSitemap: false, // Single sitemap is enough for now
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/dashboard', '/dashboard/*', '/api/*'],

  // Alternative language pages
  alternateRefs: [
    {
      href: 'https://riverflow.art',
      hreflang: 'en',
    },
    {
      href: 'https://riverflow.art/zh',
      hreflang: 'zh',
    },
  ],

  // Custom transformation for locale-based URLs
  transform: async (config, path) => {
    // Custom priority for important pages
    let priority = config.priority;
    let changefreq = config.changefreq;

    if (path === '/' || path === '/zh') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.includes('/riverflow')) {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path.includes('/text-to-image') || path.includes('/pricing')) {
      priority = 0.8;
      changefreq = 'weekly';
    } else if (path.includes('/legal/')) {
      priority = 0.3;
      changefreq = 'monthly';
    }

    return {
      loc: path,
      changefreq: changefreq,
      priority: priority,
      lastmod: new Date().toISOString(),
    };
  },
};
