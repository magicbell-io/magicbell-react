/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useConfig, useNotifications } from '@magicbell/react-headless';
import INotification from '@magicbell/react-headless/dist/types/INotification';
import React, { useRef, useState } from 'react';
import EnablePushNotificationsBanner from '../EnablePushNotificationsBanner';
import Footer from '../Footer';
import Header from '../Header';
import { NotificationListItem } from '../NotificationList/NotificationList';
import Layout from './Layout';
import NotificationInboxContent from './NotificationInboxContent';
import StyledContainer from './StyledContainer';
import PreferencesCategories from '../UserPreferencesPanel/PreferencesCategories';
import { useHeight } from '../../lib/window';
import Text from '../Text';
import CloseIcon from '../UserPreferencesPanel/CloseIcon';
import pathOr from 'ramda/src/pathOr';
import SettingsIcon from '../Footer/SettingsIcon';
import { useTranslate } from '../../context/TranslationsContext';

export interface NotificationInboxProps {
  height?: number;
  onAllRead?: () => void;
  onNotificationClick?: (notification: INotification) => void;
  storeId?: string;
  NotificationItem?: NotificationListItem;
  NotificationPreferences?: () => React.ReactElement;
  notificationPreferencesEnabled?: boolean;
  layout?: string[];
}

/**
 * Component that renders all notifications as well as a header and a footer.
 *
 * @example
 * <NotificationInbox
 *   storeId="unread"
 *   onNotificationClick={openTicket}
 *   onAllRead={showAlert} />
 */
export default function NotificationInbox({
  height,
  layout = ['header', 'content', 'push-notifications-banner', 'footer'],
  onAllRead,
  onNotificationClick,
  NotificationItem,
  NotificationPreferences = PreferencesCategories,
  storeId = 'default',
  notificationPreferencesEnabled,
}: NotificationInboxProps) {
  const config = useConfig();
  const store = useNotifications(storeId);
  const [view, setView] = useState<'inbox' | 'preferences'>('inbox');

  const t = useTranslate();
  const showPreferencesButton =
    notificationPreferencesEnabled ??
    pathOr(true, ['features', 'notificationPreferences', 'enabled'], config.inbox);

  const contentRef = useRef<HTMLDivElement>(null);
  const contentHeight = useHeight(contentRef, height);

  const markAllAsRead = () => {
    store?.markAllAsRead();
    onAllRead?.();
  };

  if (!store) return null;

  const title =
    view === 'preferences' ? (
      <Text id="preferences.title" defaultMessage="PREFERENCES" />
    ) : (
      <Text id="header.title" defaultMessage="NOTIFICATIONS" />
    );

  const actions =
    view === 'preferences' ? (
      <button onClick={() => setView('inbox')} aria-label="close">
        <CloseIcon />
      </button>
    ) : (
      <button onClick={markAllAsRead}>
        <Text id="header.mark-all-read" defaultMessage="Mark All Read" />
      </button>
    );

  const content =
    view === 'preferences' ? (
      <NotificationPreferences />
    ) : (
      <NotificationInboxContent
        store={store}
        onNotificationClick={onNotificationClick}
        height={contentHeight}
        NotificationItem={NotificationItem}
      />
    );

  return (
    <StyledContainer height={height} layout={layout}>
      <Layout order={layout}>
        <Header key="header" title={title} actions={actions} />

        <div key="content" ref={contentRef} css={{ flex: 1, overflowY: 'hidden' }}>
          {content}
        </div>

        {view === 'inbox' ? (
          <EnablePushNotificationsBanner key="push-notifications-banner" />
        ) : null}

        <Footer key="footer">
          {showPreferencesButton ? (
            <button
              onClick={() => setView(view === 'preferences' ? 'inbox' : 'preferences')}
              aria-label={t('preferences.toggle', 'Notification preferences')}
            >
              <SettingsIcon />
            </button>
          ) : null}
        </Footer>
      </Layout>
    </StyledContainer>
  );
}
