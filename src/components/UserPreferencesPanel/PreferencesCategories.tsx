/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useNotificationPreferences } from '@magicbell/react-headless';
import { useEffect } from 'react';

import CategoryPreferences from './CategoryPreferences';

function channelToTitle(channel) {
  return {
    inApp: 'IN-APP',
    email: 'EMAIL',
    webPush: 'WEB PUSH',
    mobilePush: 'MOBILE PUSH',
  }[channel] || 'IN-APP';
}

function getChannelsFromPreferences(preferences): string[] | undefined {
  const channelPrefs: object[] = Object.values(preferences.categories);
  if (channelPrefs.length > 0) {
    const combinedChannels: object = channelPrefs.reduce((channels: object, otherChannels: object) => {
      return { ...channels, ...otherChannels };
    });
    return Object.keys(combinedChannels);
  }
  return undefined;
}

export default function PreferencesCategories() {
  const preferences = useNotificationPreferences();

  const headerStyle = css`
    opacity: 0.8;
    text-transform: uppercase;
    font-size: 0.7rem !important;
  `;

  useEffect(() => {
    if (!preferences.lastFetchedAt) {
      preferences.fetch();
    }
  }, [preferences]);

  let channels = getChannelsFromPreferences(preferences) || ['inapp', 'email', 'web-push'];

  return (
    <div
      css={css`
        flex: 1;
        padding: 16px 20px !important;
        height: 100%;
        overflow-y: auto;
      `}
    >
      <div
        css={css`
          display: grid;
          gap: 1rem;
          grid-template-columns: 2fr ${' 1fr'.repeat(channels.length)};
        `}
      >
        <div />
        {channels.map((channel) =>(
          <div key={channel} css={headerStyle}>{channelToTitle(channel)}</div>
        ))}
        {Object.keys(preferences.categories).map((categoryKey) => (
          <CategoryPreferences key={categoryKey} category={categoryKey} channels={channels} />
        ))}
      </div>
    </div>
  );
}
