import { API } from "./services/API.js";
import './components/AnimatedLoading.js';
import './components/YoutubeEmbed.js'
import { router } from "./services/Router.js";

window.addEventListener('DOMContentLoaded', () => {
    app.router.init()
});

window.app = {
    router,
    showError: (message="There was an error", goToHome=true) => {
        document.getElementById("alert-modal").showModal();
        document.querySelector("#alert-modal p").textContent = message;
        if (goToHome) {
            app.router.go("/")
        }
    },
    closeError: () => {
        document.getElementById("alert-modal").close()
    },
    search: (event) => {
        event.preventDefault();
        const q = document.querySelector('input[type=search]').value;
        app.router.go(`/movies?q=${q}`)
    },
    searchOrderChange: (order) => {
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get("q");
        const genre = urlParams.get("genre") ?? "";
        app.router.go(`/movies?q=${q}&order=${order}&genre=${genre}`);
    },
    searchFilterChange: (genre) => {
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get("q");
        const order = urlParams.get("order") ?? "";
        app.router.go(`/movies?q=${q}&order=${order}&genre=${genre}`);
    },
    api: API  
}