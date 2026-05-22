export function checkBlogMockSupport(): boolean {
  return import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_BLOG === 'true'
}
