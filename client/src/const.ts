export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * Navigate to the independent portal / login page
 */
export const startLogin = () => {
  const basePath = import.meta.env.BASE_URL || "/";
  window.location.href = `${basePath.replace(/\/$/, "")}/portal`;
};
