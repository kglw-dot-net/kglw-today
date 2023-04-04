/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: 'KGLW.today',
    siteUrl: 'https://www.yourdomain.tld',
  },
  plugins: [
    'gatsby-plugin-sass',
    'gatsby-plugin-sitemap',
    'gatsby-transformer-remark',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: './src/pages/',
      },
      __key: 'pages',
    },
  ],
};
