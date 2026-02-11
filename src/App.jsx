import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import RootLayout from './layouts/root-layout';
import GlobalErrorBoundary from './components/error-boundary';

// ⚡ Lazy Load Pages for Performance (Code Splitting)
const HomePage = lazy(() => import('./pages/home'));
const LoginPage = lazy(() => import('./pages/login'));
const MarketPricesPage = lazy(() => import('./pages/market-prices'));
const WeatherPage = lazy(() => import('./pages/weather'));
const CommunityPage = lazy(() => import('./pages/community'));
const BuySellPage = lazy(() => import('./pages/buy-sell'));
const RentalsPage = lazy(() => import('./pages/rentals'));
const CalculatorPage = lazy(() => import('./pages/calculator'));
const AILensPage = lazy(() => import('./pages/ai-lens'));
const AnalyticsPage = lazy(() => import('./pages/analytics'));
const CoursesPage = lazy(() => import('./pages/courses'));
const EventsPage = lazy(() => import('./pages/events'));
const ExpensesPage = lazy(() => import('./pages/expenses'));
const FarmPlanPage = lazy(() => import('./pages/farm-plan'));
const ShopsPage = lazy(() => import('./pages/shops'));
const VetPage = lazy(() => import('./pages/vet'));
const AIAssistantPage = lazy(() => import('./pages/ai-assistant'));
const OfflineDataPacks = lazy(() => import('./pages/offline-data-packs'));
const TestPage = lazy(() => import('./pages/test'));

// Loading Fallback Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><HomePage /></Suspense> },
      { path: 'login', element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense> },
      { path: 'market-prices', element: <Suspense fallback={<PageLoader />}><MarketPricesPage /></Suspense> },
      { path: 'community', element: <Suspense fallback={<PageLoader />}><CommunityPage /></Suspense> },
      { path: 'buy-sell', element: <Suspense fallback={<PageLoader />}><BuySellPage /></Suspense> },
      { path: 'rentals', element: <Suspense fallback={<PageLoader />}><RentalsPage /></Suspense> },
      { path: 'farm-plan', element: <Suspense fallback={<PageLoader />}><FarmPlanPage /></Suspense> },
      { path: 'calculator', element: <Suspense fallback={<PageLoader />}><CalculatorPage /></Suspense> },
      { path: 'expenses', element: <Suspense fallback={<PageLoader />}><ExpensesPage /></Suspense> },
      { path: 'analytics', element: <Suspense fallback={<PageLoader />}><AnalyticsPage /></Suspense> },
      { path: 'weather', element: <Suspense fallback={<PageLoader />}><WeatherPage /></Suspense> },
      { path: 'ai-lens', element: <Suspense fallback={<PageLoader />}><AILensPage /></Suspense> },
      { path: 'courses', element: <Suspense fallback={<PageLoader />}><CoursesPage /></Suspense> },
      { path: 'events', element: <Suspense fallback={<PageLoader />}><EventsPage /></Suspense> },
      { path: 'shops', element: <Suspense fallback={<PageLoader />}><ShopsPage /></Suspense> },
      { path: 'vet', element: <Suspense fallback={<PageLoader />}><VetPage /></Suspense> },
      { path: 'ai-assistant', element: <Suspense fallback={<PageLoader />}><AIAssistantPage /></Suspense> },
      { path: 'offline-data', element: <Suspense fallback={<PageLoader />}><OfflineDataPacks /></Suspense> },
      { path: 'test', element: <Suspense fallback={<PageLoader />}><TestPage /></Suspense> },
    ],
  },
]);


function App() {
  return (
    <GlobalErrorBoundary>
      <RouterProvider router={router} />
    </GlobalErrorBoundary>
  );
}

export default App;
