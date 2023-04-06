/**
 * @type {import('gatsby').GatsbyConfig}
 */

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  siteMetadata: {
    title: 'KGLW.today',
    siteUrl: 'https://kglw.today',
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
    'gatsby-transformer-json',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'data',
        path: `${__dirname}/src/data/`,
      },
    },
    {
      resolve: 'gatsby-plugin-goatcounter',
      options: {
        code: isProduction ? 'kglw' : '',
        pixel: true,
        allowLocal: !isProduction,
        /* ideally also want to modify all `path` values before they are sent... */
      },
    },
  ],
};
