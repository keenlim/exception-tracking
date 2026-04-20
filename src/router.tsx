import { RootLayout } from '@/components/layout';
import { DashboardPage, MyTasksPage, NotFoundPage, UploadPage } from '@/pages';
import { BrowserRouter, Route, Routes } from 'react-router';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="my-tasks" element={<MyTasksPage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
