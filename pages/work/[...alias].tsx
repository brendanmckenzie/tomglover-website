import React from "react";
import Head from "next/head";
import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { executeQuery } from "../../src/pokko";
import Markdown from "react-markdown";
import Link from "next/link";

type ModuleProps = {
  type: string;
};

type Image = ModuleProps & {
  type: "Image";
  source: {
    url: string;
  };
};
type Markdown = ModuleProps & {
  type: "Markdown";
  body: string;
};

type WorkProps = {
  title: string;
  body: (Image | Markdown)[];
};

const Module: React.FC<Image | Markdown> = (props) => {
  switch (props.type) {
    case "Markdown":
      return <Markdown className="content">{props.body}</Markdown>;
    case "Image":
      if (props.source?.url) {
        return <img src={props.source.url} />;
      }
  }
  return null;
};

const Work: NextPage<WorkProps> = ({ title, body }) => (
  <>
    <Head>
      <title>{title} - Work - Tom Glover</title>
    </Head>
    <div className="container">
      <Header />
      <article>
        <h1>{title}</h1>
        {body.map((mod, idx) => (
          <Module key={idx} {...mod} />
        ))}
      </article>
      <div className="article__actions">
        <Link href="/work">
          <a className="button --primary">More work</a>
        </Link>
      </div>
      <Footer />
    </div>
  </>
);

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
  taxonomy(skip: 0, take: 1, filter: { path: $path, pathExact: true }) {
    nodes {
      entry {
        ... on Work {
          title
          alias
          summary
          body {
            __typename
            ... on Image {
              source {
                url
              }
            }
            ... on Markdown {
              body
            }
          }
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

  const data = raw.data.taxonomy.nodes[0].entry;
  return {
    props: {
      title: data.title,
      body: data.body.map(
        ({ __typename, ...rest }) =>
          ({
            type: __typename,
            ...rest,
          } as ModuleProps)
      ),
    } as WorkProps,
  };
};
