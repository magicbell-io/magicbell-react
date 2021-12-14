import { useConfig } from '@magicbell/react-headless';
import { screen } from '@testing-library/react';
import React from 'react';
import Footer from '../../../../src/components/Footer';
import ConfigFactory from '../../../factories/ConfigFactory';

import { renderWithProviders as render } from '../../../__utils__/render';

test('renders a link to the magicbell site', () => {
  render(<Footer />);
  screen.getByRole('img', { name: /magicbell logo/i });
});

test('branding can be disabled', async () => {
  useConfig.setState(
    ConfigFactory.build({
      inbox: {
        features: {
          noMagicbellBranding: { enabled: true },
        },
      },
    }),
  );

  render(<Footer />);

  expect(screen.queryByRole('img', { name: /magicbell logo/i })).not.toBeInTheDocument();
});
