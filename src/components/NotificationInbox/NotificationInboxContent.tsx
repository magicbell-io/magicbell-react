import React from 'react';
import { NotificationStore } from '@magicbell/react-headless/dist/hooks/useNotifications';
import INotification from '@magicbell/react-headless/dist/types/INotification';
import NotificationList from '../NotificationList';
import { NotificationListItem } from '../NotificationList/NotificationList';
import ClearInboxMessage from './ClearInboxMessage';

export interface NotificationInboxContentProps {
  height?: number;
  onNotificationClick?: (notification: INotification) => void;
  store: NotificationStore;
  NotificationItem?: NotificationListItem;
}

/**
 * Component that renders an infinite scroll list of notifications, or error
 * messages if the list can't be fetched.
 *
 * @example
 * <NotificationInboxContent
 *   store={notifications}
 *   onNotificationClick={openTicket}
 *   height={500} />
 */
export default function NotificationInboxContent({
  height,
  onNotificationClick,
  store,
  NotificationItem,
}: NotificationInboxContentProps) {
  if (!store.lastFetchedAt) return null;
  if (store.isEmpty) return <ClearInboxMessage />;

  return (
    <NotificationList
      height={height}
      notifications={store}
      onItemClick={onNotificationClick}
      queryParams={store.context}
      ListItem={NotificationItem}
    />
  );
}
