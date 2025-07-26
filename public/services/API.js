export const API = {
    baseURL: '/api',
    getTopMovies: async () => {
        return API.fetch("movies/top/")
    },
    getRandomMovies: async () => {
        return await API.fetch("movies/random/")
    },
    getGenres: async () => {
        return await API.fetch("genres")
    },
    getMovieById: async (id) => {
        return await API.fetch(`movies/${id}`)
    }, 
    searchMovies: async (q, order, genre) => {
        return await API.fetch(`movies/search`, { q, order, genre });
    },
    register: async (name, email, password) => {
        return await API.send("account/register/", {name, email, password})
    },
    authenticate: async (email, password) => {
        return await API.send("account/authenticate/", {email, password})
    },   
    send: async (serviceName, data ) => {
        try {
            const response = await fetch(`${API.baseURL}/${serviceName}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })

            const result = await response.json();
            return result
        } catch (e) {
            console.log(e)
            app.showError();
        }
    },
    fetch: async (serviceName, args) => {
        try {
            const queryString = args ? new URLSearchParams(args).toString() : "";

            const response = await fetch(`${API.baseURL}/${serviceName}?${queryString}`);
            const result = await response.json();
            return result; 
        } catch (e) {
            console.error(e);
        }
    }
}