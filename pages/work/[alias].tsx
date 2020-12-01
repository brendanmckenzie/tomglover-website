import * as React from "react";
import Head from "next/head";
import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { client } from "../../src/pokko";

import Link from "next/link";
import { Sharing } from "..";
import { Module, ModuleProps, Modules } from "../../components/Module";

type WorkProps = {
  title: string;
  imageUrl: string;
  category: string;
  body: Modules[];
  sharing: Sharing;
};

const Work: NextPage<WorkProps> = ({
  title,
  category,
  imageUrl,
  body,
  sharing,
}) => (
  <>
    <Head>
      <title>{sharing.title} - Work - Tom Glover</title>
      <meta name="description" content={sharing.description} />
      <meta property="og:image" content={sharing.image} />
    </Head>
    <div className="container">
      <Header />
      <section className="article__header">
        {category ? <small>{category}</small> : null}
        <h1>{title}</h1>
        {imageUrl ? <img src={imageUrl} alt={title} /> : null}
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
        alias: ent.path[0],
      },
    }))
    .filter((ent) => ent.params.alias && ent.params.alias.length > 0);

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const res = await client.query({
    query: querySingle,
    variables: {
      path: ["website", "home", "work", context.params.alias],
    },
  });
  const data = res.data.entry;

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
      sharing: {
        title: data.shareTitle || null,
        description: data.shareDescription || null,
        image: data.shareImage?.url || null,
      },
    } as WorkProps,
  };
};
