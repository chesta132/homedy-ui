export const { VITE_ENV, VITE_BASE_URL, VITE_BACKEND_URL } = import.meta.env as Record<string, string | undefined>;

export const isProdEnv = () => VITE_ENV === "production";
export const isDevEnv = () => VITE_ENV === "development";

const envMap = {
  VITE_ENV,
  VITE_BASE_URL,
  VITE_BACKEND_URL,
};

for (const [key, value] of Object.entries(envMap)) {
  if (value === undefined) {
    throw new Error(`${key} must be defined`);
  }
}
