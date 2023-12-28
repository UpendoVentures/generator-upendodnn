// List of routes to be excluded for redirection purposes.
const excludeRoutes = ['/details', '/about'];
const url = new URL(window.location.href);

// This function adjusts the basePath by removing routes specified in excludeRoutes to achieve the redirect to the main or home page.
export function resolveHomePath(basePath) {
    let tempBase = basePath;
    // Iterate through each element in excludeRoutes to remove them from the end of basePath.
    excludeRoutes.forEach(element => {
        if (tempBase.endsWith(element)) {
            tempBase = tempBase.slice(0, -element.length);
        }
    });
    return tempBase;
}

// This function ensures a path is appended to the basePath if it's not already included.
export function resolvePath(basePath, path) {
    excludeRoutes.forEach(element => {
        if (basePath.endsWith(element)) {
            basePath = basePath.slice(0, -element.length);
        }
    });
    // Checks if basePath already includes the path; if not, appends it to basePath.
    var result = basePath.includes(path) ? basePath : `${basePath}${path}`;
    return result;
}

export function goHome() {
    // List of routes to be excluded for redirection purposes.
    let tempBase = url.pathname;
    // Iterate through each element in excludeRoutes to remove them from the end of basePath.
    excludeRoutes.forEach(element => {
        if (tempBase.endsWith(element)) {
            tempBase = tempBase.slice(0, -element.length);
        }
    });
    return tempBase;
}