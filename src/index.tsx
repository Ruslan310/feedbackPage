import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./globals.css";
import {ConfigProvider} from "antd";
import {colorTheme} from './util/themes';

const antTheme = {
  components: {
    Modal: {
      contentBg: colorTheme.navbar
    },
    Menu: {
      itemSelectedBg: colorTheme.navbar,
      itemActiveBg: colorTheme.navbar,
      itemSelectedColor: colorTheme.darkPrimary,
      dangerItemHoverColor: colorTheme.primary,
      dangerItemColor: colorTheme.primary,
      dangerItemActiveBg: colorTheme.primary,
      dangerItemSelectedColor: colorTheme.primary,
      dangerItemSelectedBg: colorTheme.navbar,
      itemBg: colorTheme.navbar,
      lineWidth: 0
    },
    Form: {
      labelColor: colorTheme.secondary,
    },
  },
  token: {
    colorPrimaryHover: colorTheme.primary,
    colorPrimary: colorTheme.primary,
  }}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider theme={antTheme}>
        <App />
    </ConfigProvider>
  </React.StrictMode>
);

