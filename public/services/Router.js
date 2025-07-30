import { routes } from "./Routes.js"

export const router = {
    init: () => {
        window.addEventListener("popstate", () => {
            router.go(location.pathname, false)
        })

        document.querySelectorAll('a.navlink').forEach(a => {
            a.addEventListener('click', (event) => {
                event.preventDefault();
                const href = a.getAttribute('href');
                router.go(href);
            })  
        })

        // Go Initial route
        router.go(location.pathname + location.search)
    },
    go: (route, addToHistory=true) => {
        if (addToHistory) {
            history.pushState(null, "", route)
        }

        let pageElement = null; 
        const routePath = route.includes('?') ? route.split('?')[0] : route;
        let needsLogin = false
        for (const r of routes) {
            if (typeof r.path === 'string' && r.path === routePath) {
                // String Path
                pageElement = new r.component();
                needsLogin = r.loggedIn === true;
                break;
            } else if (r.path instanceof RegExp) {
                // RegEx path
                const match = r.path.exec(route)
                if (match) {
                    pageElement = new r.component()
                    // To get the decimal (id)
                    const params = match.slice(1)
                    pageElement.params = params
                    needsLogin = r.loggedIn === true;
                    break;
                }

            }
        }


        if (pageElement) {
            if (needsLogin && app.Store.loggedIn === false) {
                app.router.go("/account/login");
                return;
            }
        }
        
        if (needsLogin && app.Store.loggedIn === false) {
            app.router.go("/account/login");
            return;
        }

        if (pageElement === null) {
            pageElement = document.createElement("h1")
            pageElement.textContent = "Page not found"
        }
        
        // Apply transitions between views
        const oldPage = document.querySelector("main").firstElementChild
        if (oldPage) {
            oldPage.style.viewTransitionName = "old"
        }

        pageElement.style.viewTransitionName = "new"

        function updatePage() {
            // I have a page for the current url
            document.querySelector("main").innerHTML = ""
            document.querySelector("main").appendChild(pageElement)
        }

        if (!document.startViewTransition) {
            // Don't do the transition
            updatePage()
        } else {
            // Do the transition
            document.startViewTransition(() => { updatePage()})

        }
       
    }
}