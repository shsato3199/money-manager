// APIのベースURLを取得する。
export const getApiBaseUrl = () => {
  const config = useRuntimeConfig();

  return config.public.apiBaseUrl;
};