/* eslint-disable import/no-extraneous-dependencies */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withTM = require('next-transpile-modules')([
   '@mui/material',
   '@mui/system',
   '@mui/icons-material', // If @mui/icons-material is being used
]);

function getFormattedDate(date, format = 'DD/MM/YYYY') {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return format
    .replace('DD', String(day).padStart(2, '0'))
    .replace('MM', String(month).padStart(2, '0'))
    .replace('YYYY', year)
    .replace('HH', String(hour).padStart(2, '0'))
    .replace('mm', String(minute).padStart(2, '0'))
    .replace('ss', String(second).padStart(2, '0'));
}

const withPlugins = require('next-compose-plugins');
const generateBuildId = () => getFormattedDate(new Date(), 'YYYYMMDDHHmmss');

const plugins = [];
plugins.push([withBundleAnalyzer]);

const buildID = generateBuildId();

// module.exports = withPlugins({
//   eslint: {
//     dirs: ['.'],
//   },
//   poweredByHeader: false,
//   trailingSlash: true,
//   basePath: '',
//   reactStrictMode: true,
//   compiler: {
//     emotion: true,
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'nas-server.thuannc.com',
//         port: '',
//         pathname: '/fbdownload/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'drive.usercontent.google.com',
//         port: '',
//         pathname: '/download/**',
//       },
//     ],
//   },
// });

const nextConfigs = {
  assetPrefix: undefined,
  poweredByHeader: false,
  swcMinify: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    const customPlugins = [
      new webpack.DefinePlugin({
        'process.env.BUILD_ID': JSON.stringify(buildId),
      }),
    ];
    config.plugins.push(...customPlugins);
    return config;
  },
  output: 'standalone',

  compiler: {
    styledComponents: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  publicRuntimeConfig: {
    buildId: buildID,
  },
  images: {
    // domains: [
    //   'nas-server.thuannc.com',
    //   'drive.usercontent.google.com',
    // ],
    // unoptimized: true,
    // formats: ['image/avif', 'image/webp'],
    // minimumCacheTTL: 60000,
    // dangerouslyAllowSVG: true,
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nas-server.thuannc.com',
        port: '',
        pathname: '/fbdownload/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.usercontent.google.com',
        port: '',
        pathname: '/download/**',
      },
    ],
  },

  pageExtensions: ['js', 'ts', 'tsx'],
};

module.exports = withPlugins(plugins, nextConfigs)