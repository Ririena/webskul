export default function robots() {
    return {
        rules: [
            {
                userAgent: '*', // General rule for all bots
                allow: ['/'],
                disallow: ['/private/'],
            },
            {
                userAgent: 'Googlebot',
                allow: ['/'],
            },
            {
                userAgent: ['Applebot', 'Bingbot'],
                disallow: ['/'],
            },
        ],
        sitemap: 'https://xipplg2-7.vercel.app/sitemap.xml',
        sitemap: 'https://xipplg2-7.vercel.app/sitemap/dynamic/sitemap.xml',
    };
}
