import { API } from "./services/API.js";
import './components/AnimatedLoading.js';
import './components/YoutubeEmbed.js'
import { router } from "./services/Router.js";

window.addEventListener('DOMContentLoaded', () => {
    app.router.init()
});

window.app = {
    router,
    search: (event) => {
        event.preventDefault();
        const q = document.querySelector('input[type=search]').value;
        // TODO
    },
    api: API  
}