import { NotificationStore } from '@magicbell/react-headless/dist/hooks/useNotifications';
import INotification from '@magicbell/react-headless/dist/types/INotification';
import IRemoteNotification from '@magicbell/react-headless/dist/types/IRemoteNotification';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import ClickableNotification from '../ClickableNotification';
import Loader from './Loader';

export type NotificationListItem = (props: ListItemProps) => React.ReactElement;
export type ClickCallbackFn = (notification: INotification) => void;

export interface ListItemProps {
  notification: IRemoteNotification;
  onClick?: ClickCallbackFn;
}

export interface NotificationListProps {
  onItemClick?: ClickCallbackFn;
  height?: number | string;
  ListItem?: (props: ListItemProps) => React.ReactElement;
  notifications: NotificationStore;
  queryParams?;
}

/**
 * Infinite scroll list of notifications. Fetches the next page of the
 * notifications store when the user scrolls to the bottom of the list.
 *
 * @example
 * <NotificationList
 *   notifications={new NotificationStore()}
 *   queryParams={{ read: false }}
 *   onItemClick={openNotification}
 *   ListItem={Notification} />
 */
export default function NotificationList({
  notifications: store,
  onItemClick,
  height = 410,
  queryParams,
  ListItem = ClickableNotification,
}: NotificationListProps) {
  return (
    <InfiniteScroll
      dataLength={store.notifications.length}
      hasMore={store.hasNextPage}
      next={() => store.fetchNextPage(queryParams)}
      loader={<Loader />}
      height={height}
    >
      {store.notifications.map((notification) => (
        <ListItem key={notification.id} notification={notification} onClick={onItemClick} />
      ))}
    </InfiniteScroll>
  );
}
