import { Router } from './router';
import './styles/global.css';

const app = document.getElementById('app');

if (!app) {
    throw new Error('App element not found');
}

const router = new Router(app);
router.init();