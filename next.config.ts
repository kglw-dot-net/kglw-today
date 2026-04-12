import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  // Trailing slash so each route exports as a directory/index.html, which GitHub Pages serves correctly
  trailingSlash: true,
  webpack(config) {
    // Remove SVG from the default asset/resource loader so SVGR can handle it instead
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fileLoaderRule = config.module.rules.find((rule: any) => rule.test?.test?.('.svg'))
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i
    }

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}

export default nextConfig
