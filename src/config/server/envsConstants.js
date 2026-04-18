export const envs = {
  externalService: {
    url: process.env.EXTERNAL_BASE_URL,
    token: process.env.EXTERNAL_TOKEN,
  },
};

if (!envs.externalService?.url || !envs.externalService?.token) {
  throw new Error(
    `externalService.url não definido em constants ${envs.externalService.url}`,
  );
}
