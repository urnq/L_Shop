import { authStore } from '../store/authStore';

export class ProtectedRoute {
    static check(): boolean {
        const { isAuthenticated } = authStore.getState();
        
        if (!isAuthenticated) {
            window.location.href = '/auth';
            return false;
        }
        
        return true;
    }
}