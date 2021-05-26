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
  tokenPreview: process.env.POK_TOKEN_PREVIEW!,
};

const options = (
  token: string
): ApolloClientOptions<NormalizedCacheObject> => ({
  cache: new InMemoryCache(),

  headers: {
    "X-Token": token,
  },

  uri: `https://au-syd1.pokko.io/${config.project}/${config.environment}/graphql`,
});

export const client = new ApolloClient(options(config.token));
export const clientPreview = new ApolloClient(options(config.tokenPreview));
