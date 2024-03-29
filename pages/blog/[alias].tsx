import React from "react";
import Head from "next/head";
import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { client, clientPreview } from "../../src/pokko";
import Link from "next/link";
import { Sharing } from "..";
import { Module, ModuleProps, Modules } from "../../components/Module";

type BlogProps = {
  title: string;
  category: string;
  imageUrl: string;
  imageCredit: string;
  imageCreditSource: string;
  imageCreditUrl: string;
  date: string;
  author: string;
  body: Modules[];
  sharing: Sharing;
};
const Blog: NextPage<BlogProps> = ({
  title,
  date,
  author,
  category,
  imageUrl,
  imageCredit,
  imageCreditSource,
  imageCreditUrl,
  body,
  sharing,
}) => (
  <>
    <Head>
      <title>{sharing.title} - Blog - Tom Glover</title>
      <meta name="description" content={sharing.description} />
      <meta property="og:image" content={sharing.image} />
    </Head>
    <div className="container">
      <Header />
      <section className="article__header">
        {category ? <small>{category}</small> : null}
        <h1>{title}</h1>

        <div className="article__details">
          <span>{author}</span>
          <span>
            {new Date(date).toLocaleDateString(undefined, {
              year: "numeric",
              day: "numeric",
              month: "long",
            })}
          </span>
        </div>

        {imageUrl ? <img src={imageUrl} alt={title} /> : null}
        {imageCredit ? (
          <div className="article__image-credit">
            <ul>
              <li>Photo by</li>
              <li>{imageCredit}</li>
              {imageCreditSource ? (
                <>
                  <li>via</li>
                  <li>
                    {imageCreditUrl ? (
                      <a
                        href={imageCreditUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {imageCreditSource}
                      </a>
                    ) : (
                      <span>{imageCreditSource}</span>
                    )}
                  </li>
                </>
              ) : null}
            </ul>
          </div>
        ) : null}
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

const query = require("../../src/api/blog-paths.graphql");
const querySingle = require("../../src/api/blog-item.graphql");

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await client.query({
    query,
    variables: { path: ["website", "home", "blog"] },
  });

  const paths = res.data.taxonomy.nodes
    .filter((ent) => ent.path.length > 0)
    .map((ent) => ({
      params: {
        alias: ent.path[0],
      },
    }))
    .filter((ent) => ent.params.alias && ent.params.alias.length > 0);

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const res = await (context.preview ? clientPreview : client).query({
    query: querySingle,
    variables: {
      path: ["website", "home", "blog", context.params.alias],
    },
  });

  const data = res.data.entry;
  return {
    revalidate: 5,
    props: {
      title: data.title,
      date: data.date,
      imageUrl: data.image?.url ?? null,
      category: data.category?.name || null,
      author: data.author?.name || null,
      imageCredit: data.imageCredit || null,
      imageCreditSource: data.imageCreditSource || null,
      imageCreditUrl: data.imageCreditUrl || null,

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
    } as BlogProps,
  };
};
