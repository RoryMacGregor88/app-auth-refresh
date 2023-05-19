import { Meta, StoryObj } from '@storybook/react';

import { Footer } from './footer.component';

const meta: Meta<typeof Footer> = {
  title: 'Components/OneOff/Footer',
  component: Footer,
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const ShowComponent: Story = {
  args: {},
};
