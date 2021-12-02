import { useNotification } from '@magicbell/react-headless';
import { screen} from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import NotificationContextMenu from '../../../../src/components/NotificationContextMenu';
import { sampleNotification } from '../../../factories/NotificationFactory';
import { renderWithProviders as render } from '../../../__utils__/render';

test('renders a menu with all items', () => {
  const { result } = renderHook(() => useNotification(sampleNotification));
  render(<NotificationContextMenu notification={result.current} />);

  screen.getByText(/mark as read/i);
  screen.getByText(/delete/i);
});

test('can render the menu in Spanish', () => {
  const { result } = renderHook(() => useNotification(sampleNotification));
  render(<NotificationContextMenu notification={result.current} />, { locale: 'es' });

  screen.getByText(/marcar como leído/i);
  screen.getByText(/eliminar/i);
});
