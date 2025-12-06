// Simple hash-based router for single-page app navigation

export type RouteHandler = () => void;

interface Route {
  pattern: RegExp;
  handler: RouteHandler;
}

const routes: Route[] = [];
let notFoundHandler: RouteHandler = () => {
  console.error('Route not found');
};

// Register a route
export function addRoute(pattern: string, handler: RouteHandler): void {
  // Convert path pattern to regex (e.g., "/game/:id" -> /^\/game\/([^/]+)$/)
  const regexPattern = pattern
    .replace(/:[^/]+/g, '([^/]+)')
    .replace(/\//g, '\\/');
  routes.push({
    pattern: new RegExp(`^${regexPattern}$`),
    handler,
  });
}

// Set 404 handler
export function setNotFoundHandler(handler: RouteHandler): void {
  notFoundHandler = handler;
}

// Navigate to a path
export function navigate(path: string): void {
  window.location.hash = path;
}

// Get current path from hash
export function getCurrentPath(): string {
  const hash = window.location.hash.slice(1); // Remove '#'
  return hash || '/';
}

// Get path parameters (simple extraction)
export function getPathParams(pattern: string, path: string): Record<string, string> {
  const paramNames: string[] = [];
  const regexPattern = pattern.replace(/:([^/]+)/g, (_, name) => {
    paramNames.push(name);
    return '([^/]+)';
  });

  const regex = new RegExp(`^${regexPattern.replace(/\//g, '\\/')}$`);
  const match = path.match(regex);

  if (!match) return {};

  const params: Record<string, string> = {};
  paramNames.forEach((name, index) => {
    params[name] = match[index + 1];
  });

  return params;
}

// Handle current route
export function handleRoute(): void {
  const path = getCurrentPath();

  for (const route of routes) {
    if (route.pattern.test(path)) {
      route.handler();
      return;
    }
  }

  notFoundHandler();
}

// Initialize router
export function initRouter(): void {
  // Handle initial route
  handleRoute();

  // Listen for hash changes
  window.addEventListener('hashchange', handleRoute);
}
