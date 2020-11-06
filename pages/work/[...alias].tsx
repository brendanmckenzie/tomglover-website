import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { executeQuery } from "../../src/pokko";

const Work: NextPage = (props) => <pre>{JSON.stringify(props, null, 2)}</pre>;

export default Work;

const query = `
query($path: [String!]) {
  taxonomy(skip: 0, take: 50, filter: { path: $path }) {
    nodes {
      path
    }
  }
}
`;
const querySingle = `
query($path: [String!]) {
  taxonomy(skip: 0, take: 50, filter: { path: $path, pathExact: true }) {
    nodes {
      entry {
        ... on Work {
          title
          alias
          summary
        }
      }
    }
  }
}
`;

export const getStaticPaths: GetStaticPaths = async () => {
  const raw = await executeQuery(query, { path: ["website", "home", "work"] });

  const paths = raw.data.taxonomy.nodes
    .map((ent) => ({
      params: {
        alias: ent.path,
      },
    }))
    .filter((ent) => ent.params.alias && ent.params.alias.length > 0);

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const raw = await executeQuery(querySingle, {
    path: ["website", "home", "work"].concat(context.params.alias as string[]),
  });

  return {
    props: JSON.parse(
      JSON.stringify({
        path: context.params.pokko,
        data: raw.data.taxonomy.nodes[0].entry,
      })
    ),
  };
};
