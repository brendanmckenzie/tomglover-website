const config = {
  token: process.env.POK_TOKEN!,
  project: process.env.POK_PROJECT!,
  environment: process.env.POK_ENVIRONMENT!,
};

const endpoint = `https://app.pokko.io/${config.project}/${config.environment}/graphql`;

const headers = {
  "X-Token": config.token,
  "Content-type": "application/json",
};

export const executeQuery = (query: any, variables?: any) =>
  fetch(endpoint, {
    headers,
    method: "POST",
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then((res) => res.json());
