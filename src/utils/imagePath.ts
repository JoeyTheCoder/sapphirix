export function getImagePath(path: string): string {
  if (!path) return path;
  
  // If we're in development and path starts with /img/, prepend /src
  if (import.meta.env.DEV && path.startsWith('/img/')) {
    return `/src${path}`;
  }
  
  return path;
} 