/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import INotification from '@magicbell/react-headless/dist/types/INotification';

import { useTheme } from '../../context/MagicBellThemeContext';
import MenuIcon from '../icons/MenuIcon';
import NotificationContextMenu from '../NotificationContextMenu';
import Popover from '../Popover';

export interface Props {
  notification: INotification;
  menuPlacement?:
    | 'auto'
    | 'auto-start'
    | 'auto-end'
    | 'top'
    | 'bottom'
    | 'right'
    | 'left'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'right-start'
    | 'right-end'
    | 'left-start'
    | 'left-end';
}

/**
 * Component that renders the context menu
 *
 * @example
 * <NotificationState notification={notification} />
 */
export default function NotificationMenu({ notification, menuPlacement = 'bottom-end' }: Props) {
  const { notification: themeVariants } = useTheme();

  const theme = !notification.isSeen
    ? themeVariants.unseen
    : !notification.isRead
    ? themeVariants.unread
    : themeVariants.default;

  const launcher = (
    <button
      type="button"
      css={css`
        color: ${theme.textColor} !important;
      `}
    >
      <MenuIcon />
    </button>
  );

  return (
    <Popover
      launcher={launcher}
      offset={{ skidding: -4, distance: 2 }}
      placement={menuPlacement}
      zIndex={1}
      trigger="click"
    >
      {() => <NotificationContextMenu notification={notification} />}
    </Popover>
  );
}
