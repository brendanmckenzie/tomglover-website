import {
  ApolloClient,
  ApolloClientOptions,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";

const config = {
  environment: process.env.POK_ENVIRONMENT!,
  project: process.env.POK_PROJECT!,
  token: process.env.POK_TOKEN!,
};

const options: ApolloClientOptions<NormalizedCacheObject> = {
  cache: new InMemoryCache(),

  headers: {
    "X-Token": config.token,
  },

  uri: `https://app.pokko.io/${config.project}/${config.environment}/graphql`,
};

export const client = new ApolloClient(options);
