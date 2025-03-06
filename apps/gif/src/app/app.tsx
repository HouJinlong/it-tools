// Uncomment this line to use CSS modules
// import styles from './app.module.scss';
import { Refine } from '@refinedev/core';

import routerProvider, {
  NavigateToResource,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from '@refinedev/react-router';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router';

import {
  ErrorComponent,
  RefineThemes,
  ThemedLayoutV2,
  ThemedTitleV2,
  useNotificationProvider,
} from '@refinedev/antd';
import { App as AntdApp, ConfigProvider } from 'antd';
import { useLocalStorageState } from 'ahooks';

import { Gif } from '../pages/gif';
import { GifPaser } from '../pages/git-paser';

export function App() {
  const [siderCollapsed, setSiderCollapsed] = useLocalStorageState<
    boolean
  >('initialSiderCollapsed', {
    defaultValue: true,
  });


  return (
    <BrowserRouter>
      <ConfigProvider theme={RefineThemes.Orange}>
        <AntdApp>
          <Refine
            routerProvider={routerProvider}
            notificationProvider={useNotificationProvider}
            resources={[
              {
                name: 'gif动图',
                list: '/gif',
              },
              {
                name: 'gif解析',
                list: '/git-paser',
              },
            ]}
            options={{
              warnWhenUnsavedChanges: true,
            }}
          >
            <Routes>
              <Route
                element={
                  <ThemedLayoutV2
                    initialSiderCollapsed={siderCollapsed}
                    onSiderCollapsed={setSiderCollapsed}
                    Title={({ collapsed }) => (
                      <ThemedTitleV2
                        // collapsed is a boolean value that indicates whether the <Sidebar> is collapsed or not
                        collapsed={collapsed}
                        // icon={collapsed ? 1 : 2}
                        text="工具"
                      />
                    )}
                  >
                    <Outlet />
                  </ThemedLayoutV2>
                }
              >
                <Route
                  index
                  element={<NavigateToResource resource="gif动图" />}
                />
                <Route path="gif" index element={<Gif />} />
                <Route path="git-paser" index element={<GifPaser />} />
              </Route>
              <Route path="*" element={<ErrorComponent />} />
            </Routes>
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
