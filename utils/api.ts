/// <reference types="vite/client" />

export const getApiUrl = (path: string) => {
  const baseUrl = import.meta.env.VITE_API_URL || '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

export const getSocketUrl = () => {
  return import.meta.env.VITE_API_URL || undefined;
};
