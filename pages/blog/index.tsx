import { client } from "../../src/pokko";

import * as React from "react";
import Head from "next/head";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import Link from "next/link";

const query = require("../../src/api/blog-list.graphql");

export type BlogProps = {
  id: string;
  title: string;
  alias: string;
  date: string;
  summary: string;
  category?: string;
  author: string;
};

export type BlogListPageProps = {
  posts: BlogProps[];
};

export const BlogListPage: React.FC<BlogListPageProps> = ({ posts }) => (
  <>
    <Head>
      <title>Blog - Tom Glover</title>
    </Head>
    <div className="container">
      <Header />

      <div className="posts__container">
        <h1>Blog</h1>
        <div className="posts__list">
          {posts.map((ent) => (
            <Link key={ent.id} href={`/blog/${ent.alias}`}>
              <a className="post">
                <small>{ent.category}</small>
                <h3>{ent.title}</h3>
                <p>{ent.summary}</p>
                <span>
                  Read more
                  <span>→</span>
                </span>
                <div className="post__meta">
                  <span>{ent.author}</span>
                  <span>
                    {new Date(ent.date).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  </>
);

export async function getStaticProps() {
  const res = await client.query({
    query,
  });

  const data = res?.data?.entries?.allArticle?.nodes ?? [];
  if (!data) {
    return { props: {} };
  }

  const props: BlogListPageProps = {
    posts: data.map(
      (ent) =>
        ({
          alias: ent.alias,
          author: ent.author?.name || null,
          date: ent.date,
          id: ent.id,
          title: ent.title,
          summary: ent.summary,
          category: ent.category?.name || null,
          url: `/blog/${ent.alias}`,
        } as BlogProps)
    ),
  };

  return {
    revalidate: 5,
    props,
  };
}

export default BlogListPage;
