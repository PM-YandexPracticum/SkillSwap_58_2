import type { StorybookConfig } from '@storybook/react-vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
   addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],
  framework: "@storybook/react-vite",

  async viteFinal(config) {
    if (config.plugins) {
      config.plugins.push(
        svgr({
          svgrOptions: {
            plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
          },
          include: "**/*.svg?react",
        })
      );
      config.plugins.push(tsconfigPaths());
    }
    return config;
  },
};

export default config;

