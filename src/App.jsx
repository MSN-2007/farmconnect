import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import RootLayout from './layouts/root-layout';
import HomePage from './pages/home';
import MarketPricesPage from './pages/market-prices';
import WeatherPage from './pages/weather';
import CommunityPage from './pages/community';
import BuySellPage from './pages/buy-sell';
import RentalsPage from './pages/rentals';
import CalculatorPage from './pages/calculator';
import AILensPage from './pages/ai-lens';
import AnalyticsPage from './pages/analytics';
import CoursesPage from './pages/courses';
import EventsPage from './pages/events';
import ExpensesPage from './pages/expenses';
import FarmPlanPage from './pages/farm-plan';
import ShopsPage from './pages/shops';
import VetPage from './pages/vet';
import AIAssistantPage from './pages/ai-assistant';

// Placeholder components for other routes to prevent errors
const Placeholder = ({ title }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    <p className="text-gray-600 mt-2">This feature is coming soon.</p>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'market-prices', element: <MarketPricesPage /> },
      { path: 'community', element: <CommunityPage /> },
      { path: 'buy-sell', element: <BuySellPage /> },
      { path: 'rentals', element: <RentalsPage /> },
      { path: 'farm-plan', element: <FarmPlanPage /> },
      { path: 'calculator', element: <CalculatorPage /> },
      { path: 'expenses', element: <ExpensesPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'weather', element: <WeatherPage /> },
      { path: 'ai-lens', element: <AILensPage /> },
      { path: 'courses', element: <CoursesPage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'shops', element: <ShopsPage /> },
      { path: 'vet', element: <VetPage /> },
      { path: 'ai-assistant', element: <AIAssistantPage /> },
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
