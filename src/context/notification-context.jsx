import React, { createContext, useContext, useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, Bell } from 'lucide-react';
import { cn } from '../lib/utils';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [permission, setPermission] = useState('default');

    useEffect(() => {
        // Check browser notification permission
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    // Request browser notification permission
    const requestPermission = async () => {
        if ('Notification' in window) {
            const result = await Notification.requestPermission();
            setPermission(result);
            return result === 'granted';
        }
        return false;
    };

    // Show in-app notification
    const showNotification = (message, type = 'info', duration = 5000) => {
        const id = Date.now();
        const notification = { id, message, type, duration };

        setNotifications(prev => [...prev, notification]);

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }

        return id;
    };

    // Show browser push notification
    const showPushNotification = (title, options = {}) => {
        if (permission === 'granted' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, {
                    icon: '/icon-192.png',
                    badge: '/icon-192.png',
                    vibrate: [200, 100, 200],
                    ...options
                });
            });
        }
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    // Shorthand methods
    const success = (message, duration) => showNotification(message, 'success', duration);
    const error = (message, duration) => showNotification(message, 'error', duration);
    const info = (message, duration) => showNotification(message, 'info', duration);
    const warning = (message, duration) => showNotification(message, 'warning', duration);

    return (
        <NotificationContext.Provider
            value={{
                showNotification,
                showPushNotification,
                requestPermission,
                permission,
                success,
                error,
                info,
                warning
            }}
        >
            {children}
            <NotificationContainer notifications={notifications} onClose={removeNotification} />
        </NotificationContext.Provider>
    );
};

// Notification Container Component
const NotificationContainer = ({ notifications, onClose }) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2" style={{ maxWidth: '400px' }}>
            {notifications.map(notification => (
                <NotificationToast
                    key={notification.id}
                    {...notification}
                    onClose={() => onClose(notification.id)}
                />
            ))}
        </div>
    );
};

// Individual Notification Toast
const NotificationToast = ({ message, type, onClose }) => {
    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        warning: AlertCircle,
        info: Info
    };

    const colors = {
        success: 'bg-green-50 text-green-900 border-green-200',
        error: 'bg-red-50 text-red-900 border-red-200',
        warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
        info: 'bg-blue-50 text-blue-900 border-blue-200'
    };

    const iconColors = {
        success: 'text-green-600',
        error: 'text-red-600',
        warning: 'text-yellow-600',
        info: 'text-blue-600'
    };

    const Icon = icons[type] || Info;

    return (
        <div className={cn(
            "flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-slide-in-right",
            colors[type]
        )}>
            <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", iconColors[type])} />
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={onClose}
                className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};

// Add to global CSS for animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slide-in-right {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    .animate-slide-in-right {
        animation: slide-in-right 0.3s ease-out;
    }
`;
document.head.appendChild(style);
