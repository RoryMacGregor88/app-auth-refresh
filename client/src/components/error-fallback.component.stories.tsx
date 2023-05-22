import type { Meta, StoryObj } from '@storybook/react';

import { ErrorFallback } from './error-fallback.component';

/**
 * Error Fallback component provides the user with a means to isolate
 * a crash to part of the app, to acknowledge/clear the error, and to
 * optionally submit an error report to an API endpoint
 */

const meta: Meta<typeof ErrorFallback> = {
  title: 'Components/Reusable/ErrorFallback',
  component: ErrorFallback,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    handleErrorReport: { action: 'handleErrorReport' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Unsubmitted: Story = {
  args: {
    isError: false,
    isSuccess: false,
    error: {
      name: 'error',
      message: 'StackOverflowException',
      stack: 'Hi I am a stack trace\nThis is a second line\nAnd a third',
    },
  },
};

export const SuccessfulSubmissionOfError: Story = {
  args: {
    isError: false,
    isSuccess: true,
    error: {
      name: 'error',
      message: 'StackOverflowException',
      stack: 'Hi I am a stack trace\nThis is a second line\nAnd a third',
    },
    report: {
      id: 1,
      message: 'Thank you for your report',
      stackTrace: 'One\nTwo\nThree',
    },
  },
};

export const FailedSubmissionOfError: Story = {
  args: {
    isError: true,
    isSuccess: false,
    error: {
      name: 'error',
      message: 'StackOverflowException',
      stack: 'Hi I am a stack trace\nThis is a second line\nAnd a third',
    },
    report: {
      id: 1,
      message: 'Thank you for your report',
      stackTrace: 'One\nTwo\nThree',
    },
    failure: {
      name: 'error submitting report',
      message: 'ServerAsleepException',
      stack: 'Unable to send failure as our server was down',
    },
  },
};
