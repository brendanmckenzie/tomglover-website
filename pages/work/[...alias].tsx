import React from "react";
import Head from "next/head";
import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { client } from "../../src/pokko";
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
  imageUrl: string;
  category: string;
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

const Work: NextPage<WorkProps> = ({ title, category, imageUrl, body }) => (
  <>
    <Head>
      <title>{title} - Work - Tom Glover</title>
    </Head>
    <div className="container">
      <Header />
      <section className="article__header">
        <small>{category}</small>
        <h1>{title}</h1>
        <img src={imageUrl} alt={title} />
      </section>
      <article className="article__body">
        {body.map((mod, idx) => (
          <Module key={idx} {...mod} />
        ))}
      </article>
      <div className="article__actions">
        <Link href="/work">
          <a className="button --inverse">See all work</a>
        </Link>
      </div>
      <Footer />
    </div>
  </>
);

export default Work;

const query = require("../../src/api/work-paths.graphql");
const querySingle = require("../../src/api/work-item.graphql");

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await client.query({
    query,
    variables: { path: ["website", "home", "work"] },
  });

  const paths = res.data.taxonomy.nodes
    .map((ent) => ({
      params: {
        alias: ent.path,
      },
    }))
    .filter((ent) => ent.params.alias && ent.params.alias.length > 0);

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const res = await client.query({
    query: querySingle,
    variables: {
      path: ["website", "home", "work"].concat(
        context.params.alias as string[]
      ),
    },
  });
  const data = res.data.taxonomy.nodes[0].entry;

  return {
    props: {
      title: data.title,
      imageUrl: data.image?.url ?? null,
      category: data.category?.name || null,
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
