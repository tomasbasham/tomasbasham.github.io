import Alpine from 'alpinejs';

import DarkModeStore from '@/stores/dark-mode';

// Register application state with Alpine. State is used to store data that
// is shared across components and is some cases essential for the application
// to funciton. For example, the web push store is used to manage the state of
// the web push notifications, which is essential for the application to
// function correctly.
Alpine.store('darkMode', DarkModeStore);

Alpine.start();

// Make Alpine available globally available for a better developer experience.
window.Alpine = Alpine;
