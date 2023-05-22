import type { Meta, StoryObj } from '@storybook/react';

import { AstrosatSpinner } from './spinner.component';

const meta: Meta<typeof AstrosatSpinner> = {
  title: 'Components/Reusable/AstrosatSpinner',
  component: AstrosatSpinner,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    handleErrorReport: { action: 'handleErrorReport' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
