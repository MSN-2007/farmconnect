// Developer and Admin Authentication System
// This file manages developer access and permissions

const DEVELOPER_CREDENTIALS = {
    id: 'DEV.01@FARMCONNECT',
    password: '8125997774M',
    role: 'DEVELOPER',
    permissions: [
        'ADD_SHOPS',
        'EDIT_SHOPS',
        'DELETE_SHOPS',
        'MANAGE_USERS',
        'VIEW_ANALYTICS',
        'MANAGE_CONTENT',
        'SYSTEM_SETTINGS',
        'DATABASE_ACCESS',
        'API_MANAGEMENT',
        'FEATURE_FLAGS'
    ],
    name: 'Developer Admin',
    email: 'dev.01@farmconnect.com'
};

// User roles and permissions
const ROLES = {
    DEVELOPER: {
        level: 100,
        permissions: [
            'ADD_SHOPS',
            'EDIT_SHOPS',
            'DELETE_SHOPS',
            'MANAGE_USERS',
            'VIEW_ANALYTICS',
            'MANAGE_CONTENT',
            'SYSTEM_SETTINGS',
            'DATABASE_ACCESS',
            'API_MANAGEMENT',
            'FEATURE_FLAGS',
            'MANAGE_MARKETS',
            'MANAGE_EVENTS',
            'MANAGE_COURSES',
            'MANAGE_RENTALS',
            'MODERATE_COMMUNITY'
        ]
    },
    ADMIN: {
        level: 50,
        permissions: [
            'ADD_SHOPS',
            'EDIT_SHOPS',
            'MANAGE_CONTENT',
            'VIEW_ANALYTICS',
            'MODERATE_COMMUNITY'
        ]
    },
    USER: {
        level: 1,
        permissions: [
            'CREATE_POST',
            'CREATE_LISTING',
            'VIEW_CONTENT'
        ]
    }
};

class AuthService {
    constructor() {
        this.currentUser = null;
        this.loadUserFromStorage();
    }

    // Login function
    login(username, password) {
        // Check developer credentials
        if (username === DEVELOPER_CREDENTIALS.id && password === DEVELOPER_CREDENTIALS.password) {
            this.currentUser = {
                ...DEVELOPER_CREDENTIALS,
                loginTime: new Date().toISOString()
            };
            this.saveUserToStorage();
            return {
                success: true,
                user: this.currentUser,
                message: 'Developer access granted'
            };
        }

        // Regular user login would go here
        return {
            success: false,
            message: 'Invalid credentials'
        };
    }

    // Logout function
    logout() {
        this.currentUser = null;
        localStorage.removeItem('farmconnect_user');
        return { success: true };
    }

    // Check if user has permission
    hasPermission(permission) {
        if (!this.currentUser) return false;
        return this.currentUser.permissions.includes(permission);
    }

    // Check if user is developer
    isDeveloper() {
        return this.currentUser?.role === 'DEVELOPER';
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Save user to localStorage
    saveUserToStorage() {
        if (this.currentUser) {
            localStorage.setItem('farmconnect_user', JSON.stringify(this.currentUser));
        }
    }

    // Load user from localStorage
    loadUserFromStorage() {
        const stored = localStorage.getItem('farmconnect_user');
        if (stored) {
            try {
                this.currentUser = JSON.parse(stored);
            } catch (e) {
                console.error('Failed to load user from storage');
            }
        }
    }

    // Check if logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
export { ROLES, DEVELOPER_CREDENTIALS };
