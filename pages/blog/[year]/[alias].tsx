import React from "react";
import Head from "next/head";
import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { Footer } from "../../../components/Footer";
import { Header } from "../../../components/Header";
import { client } from "../../../src/pokko";
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

type BlogProps = {
  title: string;
  category: string;
  imageUrl: string;
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

const Blog: NextPage<BlogProps> = ({ title, category, imageUrl, body }) => (
  <>
    <Head>
      <title>{title} - Blog - Tom Glover</title>
    </Head>
    <div className="container">
      <Header />
      <section className="article__header">
        <small>{category}</small>
        <h1>{title}</h1>
        {imageUrl ? <img src={imageUrl} alt={title} /> : null}
      </section>
      <article className="article__body">
        {body.map((mod, idx) => (
          <Module key={idx} {...mod} />
        ))}
      </article>
      <div className="article__actions">
        <Link href="/blog">
          <a className="button --inverse">See all articles</a>
        </Link>
      </div>
      <Footer />
    </div>
  </>
);

export default Blog;

const query = require("../../../src/api/blog-paths.graphql");
const querySingle = require("../../../src/api/blog-item.graphql");

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await client.query({
    query,
    variables: { path: ["website", "home", "blog"] },
  });

  const paths = res.data.taxonomy.nodes
    .filter((ent) => ent.path.length > 0)
    .map((ent) => ({
      params: {
        year: ent.path[0],
        alias: ent.path[1],
      },
    }))
    .filter((ent) => ent.params.alias && ent.params.alias.length > 0);

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const res = await client.query({
    query: querySingle,
    variables: {
      path: [
        "website",
        "home",
        "blog",
        context.params.year,
        context.params.alias,
      ],
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
    } as BlogProps,
  };
};
