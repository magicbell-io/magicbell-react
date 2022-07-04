/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import INotification from '@magicbell/react-headless/dist/types/INotification';
import { ReactNode } from 'react';

import { useTheme } from '../../context/MagicBellThemeContext';
import { toRGBA } from '../../lib/color';
import { cleanslate } from '../Styled';

export interface Props {
  notification: INotification;
  children: ReactNode;
}

/**
 * A container for the `ClickableNotification` component. The style is taken
 * from the theme.
 *
 * @example
 * <StyledContainer notification={notification} onClick={openActionUrl} />
 */
export default function StyledContainer({ notification, children }: Props) {
  const { notification: themeVariants } = useTheme();

  const theme = !notification.isSeen
    ? themeVariants.unseen
    : !notification.isRead
    ? themeVariants.unread
    : themeVariants.default;

  const style = css`
    background-color: ${toRGBA(theme.backgroundColor, theme.backgroundOpacity)} !important;
    border-radius: ${theme.borderRadius} !important;
    color: ${theme.textColor} !important;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-family: ${theme.fontFamily} !important;
    font-size: ${theme.fontSize};
    margin: ${theme.margin} !important;
    overflow: hidden;
    text-align: ${theme.textAlign} !important;
    text-transform: ${theme.textTransform};
    transition: background-color 300ms ease-out;
    padding: 16px 20px !important;
    min-height: 32px;

    &:hover {
      background-color: ${toRGBA(
        theme.hover.backgroundColor,
        theme.hover.backgroundOpacity,
      )} !important;
    }

    & > button {
      flex: 1;
      display: inline-flex;
      align-items: center;
      margin: 0 0 0 -16px;
      text-align: inherit !important;

      & > div {
        margin: 0 0 0 16px;
      }

      & > div:first-of-type {
        flex: 1;
      }
    }
  `;

  return <div css={[cleanslate, style]}>{children}</div>;
}
