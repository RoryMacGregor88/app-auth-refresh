import type { StorybookConfig } from '@storybook/react-vite';
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-mdx-gfm',
    '@storybook/react-i18next',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;

// const path = require('path');
// module.exports = {
//   stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
//   addons: [
//     '@storybook/addon-links',
//     '@storybook/addon-essentials',
//     '@storybook/addon-interactions',
//     {
//       name: '@storybook/addon-postcss',
//       options: {
//         postcssLoaderOptions: {
//           implementation: require('postcss'),
//         },
//       },
//     },
//     '@storybook/addon-a11y',
//     'storybook-react-i18next',
//     '@storybook/addon-mdx-gfm',
//   ],
//   framework: {
//     name: '@storybook/react-vite',
//     options: {},
//   },
//   features: {
//     storyStoreV7: true,
//   },
//   viteFinal: async config => {
//     config.resolve.alias = {
//       ...config.resolve.alias,
//       '~': path.resolve(__dirname, '../src'),
//     };
//     return config;
//   },
//   docs: {
//     // this is disabled because it's not working for some reason
//     autodocs: false,
//   },
// };
