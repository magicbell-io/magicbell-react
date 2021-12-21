import { MetaComponent, StoryComponent } from '@storybook/react';
import React from 'react';

import MagicBellProvider from '../src/components/MagicBellProvider';
import NotificationInbox from '../src/components/NotificationInbox';

export default {
  title: 'MagicBell/NotificationInbox',
  component: NotificationInbox,
  argTypes: {
    onNotificationClick: { action: 'onNotificationClick' },
    onAllRead: { action: 'onAllRead' },
  },
} as MetaComponent<typeof NotificationInbox>;

const Template: StoryComponent<typeof NotificationInbox> = (props) => (
  <MagicBellProvider apiKey="">
    <NotificationInbox {...props} />
  </MagicBellProvider>
);

export const Default = Template.bind({});
Default.args = {
  height: 300,
};

export const WithCustomPreferences = Template.bind({});
WithCustomPreferences.args = {
  ...Default.args,
  NotificationPreferences: (props) => (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <p>Your Settings Page</p>
    </div>
  ),
};

export const WithPreferencesDisabled = Template.bind({});
WithPreferencesDisabled.args = {
  ...Default.args,
  notificationPreferencesEnabled: false,
};
