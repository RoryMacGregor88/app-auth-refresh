import React from 'react';

import { describe, expect, it } from 'vitest';

import { render, screen, userEvent } from '~/test/test-renderers';

import { ThemeSwitcher } from './theme-switcher.component';

describe('Theme Switcher', () => {
  it('should default to dark mode', () => {
    render(<ThemeSwitcher />);

    expect(screen.getByRole('button', { name: /activate light mode/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /activate dark mode/i })).not.toBeInTheDocument();
  });

  it('should switch from dark to light mode', async () => {
    render(<ThemeSwitcher />);

    const button = screen.getByRole('button', { name: /activate light mode/i });
    expect(button).toBeInTheDocument();

    await userEvent.click(button);

    expect(screen.queryByRole(button)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /activate dark mode/i })).toBeInTheDocument();
  });
});
