import { Router } from './router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import './styles/global.css';

const app = document.getElementById('app');

if (!app) {
    throw new Error('App element not found');
}

// Create layout structure with Header and Footer
const header = new Header();
const footer = new Footer();

app.appendChild(header.getElement());

const mainContent = document.createElement('main');
mainContent.className = 'main-content';
app.appendChild(mainContent);

app.appendChild(footer.getElement());

const router = new Router(mainContent);
router.init();