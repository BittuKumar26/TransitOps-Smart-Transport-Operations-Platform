import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import Loader from '../components/common/Loader.jsx';

const Login = lazy(() => import('../pages/Login.jsx'));
const Register = lazy(() => import('../pages/Register.jsx'));
const Dashboard = lazy(() => import('../pages/Dashboard.jsx'));
const Vehicles = lazy(() => import('../pages/Vehicles.jsx'));
const AddVehicle = lazy(() => import('../pages/AddVehicle.jsx'));
const EditVehicle = lazy(() => import('../pages/EditVehicle.jsx'));
const Drivers = lazy(() => import('../pages/Drivers.jsx'));
const AddDriver = lazy(() => import('../pages/AddDriver.jsx'));
const EditDriver = lazy(() => import('../pages/EditDriver.jsx'));
const Trips = lazy(() => import('../pages/Trips.jsx'));
const EditTrip = lazy(() => import('../pages/EditTrip.jsx'));
const Maintenance = lazy(() => import('../pages/Maintenance.jsx'));
const Fuel = lazy(() => import('../pages/Fuel.jsx'));
const Expenses = lazy(() => import('../pages/Expenses.jsx'));
const Reports = lazy(() => import('../pages/Reports.jsx'));
const Profile = lazy(() => import('../pages/Profile.jsx'));
const NotFound = lazy(() => import('../pages/NotFound.jsx'));

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={(
          <div className="grid min-h-screen place-items-center bg-slate-50">
            <Loader />
          </div>
        )}
      >
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/vehicles/new" element={<AddVehicle />} />
              <Route path="/vehicles/:id/edit" element={<EditVehicle />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/drivers/new" element={<AddDriver />} />
              <Route path="/drivers/:id/edit" element={<EditDriver />} />
              <Route path="/trips" element={<Trips />} />
              <Route path="/trips/:id/edit" element={<EditTrip />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/fuel" element={<Fuel />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
