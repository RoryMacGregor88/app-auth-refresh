/*eslint import/namespace: ["off"]*/
import { describe, expect, it } from 'vitest';

import { render, screen } from '~/test/utils';

import Footer from './footer.component';

describe('Footer', () => {
  it('should render the footer', () => {
    render(<Footer />);

    expect(screen.getByRole('heading', { name: /footer/i })).toBeInTheDocument();
  });
});
