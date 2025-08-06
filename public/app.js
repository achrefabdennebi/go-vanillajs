import { API } from "./services/API.js";
import './components/AnimatedLoading.js';
import './components/YoutubeEmbed.js'
import { router } from "./services/Router.js";
import Store from "./services/Store.js"

window.addEventListener('DOMContentLoaded', () => {
    app.router.init()
});

window.app = {
    router,
    Store,
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
    register: async (event) => {
        event.preventDefault();
        const name = document.getElementById("register-name").value
        const email = document.getElementById("register-email").value
        const password = document.getElementById("register-password").value
        const passwordConfirmation = document.getElementById("register-password-confirm").value

        const errors = []
        if (name.length < 4)  errors.push("Enter your complete name")
        if (password.length < 7) errors.push("Enter a password with at least 7 character")
        if (email.length < 4) errors.push("Enter your complete email")
        if (password !== passwordConfirmation) errors.push("Password don't match")
        if (errors.length === 0) {
            const response = await API.register(name, email, password)
            if (response.success) {
                app.Store.jwt = response.jwt;
                app.router.go("/account/")
            } else {
                app.showError(response.message)
            }
        } else {
            app.showError(errors.join(". "), false)
        }

    },
    login: async (event) => {
        event.preventDefault();
        let errors = [];
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        if (email.length < 8) errors.push("Enter your complete email");
        if (password.length < 6) errors.push("Enter a password with 6 characters");
        if (errors.length==0) {
            const response = await API.authenticate(email, password);
            if (response.success) {
                app.Store.jwt = response.jwt;
                app.router.go("/account/")
            } else {
                app.showError(response.message, false);
            }
        } else {
            app.showError(errors.join(". "), false);
        }

    },
    logout: () => {
        Store.jwt = null;
        app.router.go('/')
    },
    deleteAccount: async () => {
        console.log(`DELETE ACCOUNT`)
        const deletedAccount = await API.deleteAccount()
        if (deletedAccount.success) {
            app.logout()
        } else {
            app.showModal("We counldn't delete the user")
        }
    },
    saveToCollection: async (movie_id, collection) => {
        if (app.Store.loggedIn) {
            try {
                const response = await API.saveToCollection(movie_id, collection);
                if (response.success) {
                    switch(collection) {
                        case "favorite":
                            app.router.go("/account/favorites")
                        break;
                        case "watchlist":
                            app.router.go("/account/watchlist")
                    }
                } else {
                    app.showError("We couldn't save the movie.")
                }
            } catch (e) {
                console.log(e)
            }
        } else {
            app.Router.go("/account/");
        }
    },
    api: API  
}