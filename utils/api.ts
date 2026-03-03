export const getApiUrl = (path: string) => {
  const origin = window.location.origin;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${cleanPath}`;
};

export const getSocketUrl = () => {
  return window.location.origin;
};
