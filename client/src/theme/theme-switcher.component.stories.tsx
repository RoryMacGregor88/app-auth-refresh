import type { Meta, StoryObj } from '@storybook/react';

import { ThemeSwitcher } from './theme-switcher.component';

const meta: Meta<typeof ThemeSwitcher> = {
  title: 'Components/Reusable/ThemeSwitcher',
  component: ThemeSwitcher,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: '',
  },
};
