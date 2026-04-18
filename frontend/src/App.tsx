import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastProvider } from './components/common/Toast';

// Dummy Pages import
import { 
  Home, 
  LoginPage, 
  RegisterPage, 
  EventsPage, 
  MyEventsPage, 
  AdminPage, 
  NotFoundPage 
} from './pages';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-bg-color text-text-main dark:bg-bg-color dark:text-text-main transition-colors duration-300">
      <Navbar />
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route
                path="/my-events"
                element={
                  <ProtectedRoute>
                    <MyEventsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;