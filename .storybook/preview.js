import React from 'react';
import {addons} from '@storybook/addons'
import { themes } from '../stories/themes';
// Some stories may set up keyboard event handlers, which interfers with storybook
addons.setConfig({
  enableShortcuts: false
})

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  layout: 'fullscreen',
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};


const withTheme = (Story, context)  => {
  const themeName = context.parameters.theme || context.globals.theme;
  const themeNames = Array.isArray(themeName) ? themeName : [themeName];
  const selectedThemes = themeName === 'all' ? Object.values(themes) : themeNames.map(n => themes[n]);

  const containerStyle = {
    width: '100vw',
    height: '100vh',
    display: 'grid',
    gridTemplateColumns: `repeat(${selectedThemes.length}, 1fr)`,
  };

  return (
    <div style={containerStyle}>
      {selectedThemes.map(theme =>
        <div key={theme.name} style={{
          width: '100%',
          height: '100%',
          background: theme.background,
          minWidth: 600,
        }}>
          <Story args={{ theme: theme.theme, ...context.args }} />
        </div>
      )}
    </div>
  )
}

export const decorators = [withTheme];

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'default',
    toolbar: {
      icon: 'photo',
      items: [...Object.keys(themes).map(theme => ({
        value: theme,
        title: themes[theme].name,
      })), { value: 'all', title: 'all' }],
      showName: true,
    },
  },
}