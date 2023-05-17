import type { Meta, StoryObj } from '@storybook/react';

import { ThemeSwitcher } from './theme-switcher.component';
import { DARK, DARK_LABEL, LIGHT, LIGHT_LABEL, THEME_KEY } from './theme.constants';

const meta = {
  title: 'Components/ThemeSwitcher',
  component: ThemeSwitcher,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <StoryWrapper>
        <Story />
      </StoryWrapper>
    ),
  ],
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: LIGHT,
  },
};
