import type { Meta, StoryObj } from '@storybook/react';

import { LanguageSwitcher } from './language-switcher.component';

const meta: Meta<typeof LanguageSwitcher> = {
  title: 'Components/Reusable/LanguageSwitcher',
  component: LanguageSwitcher,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'float-right',
  },
};
