export const getApiUrl = (path: string) => {
  return path.startsWith('/') ? path : `/${path}`;
};

export const getSocketUrl = () => {
  return undefined;
};
