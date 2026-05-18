import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { EquipmentPage } from '../pages/EquipmentPage';
import { ItemsPage } from '../pages/ItemsPage';
import { LoginPage } from '../pages/LoginPage';
import { MaterialRequestsPage } from '../pages/MaterialRequestsPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { ReportsPage } from '../pages/ReportsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { StockEntryPage } from '../pages/StockEntryPage';
import { ToolsPage } from '../pages/ToolsPage';
import { WarehousesPage } from '../pages/WarehousesPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="items" element={<ItemsPage />} />
          <Route path="warehouses" element={<WarehousesPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="stock/entries" element={<StockEntryPage />} />
          <Route path="material-requests" element={<MaterialRequestsPage />} />
          <Route path="tools" element={<ToolsPage />} />
          <Route path="equipment" element={<EquipmentPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
