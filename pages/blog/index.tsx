import { executeQuery } from "../../src/pokko";

import * as React from "react";
import Head from "next/head";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import Link from "next/link";

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
      <title>Blog - Glom Tover</title>
    </Head>
    <div className="container">
      <Header />

      <div className="posts">
        {posts.map((ent) => (
          <Link href={`/blog/${ent.date.substr(0, 4)}/${ent.alias}`}>
            <a key={ent.id} className="post">
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
      <Footer />
    </div>
  </>
);

const query = `
query {
  entries {
    allArticle(skip: 0, take: 25, orderBy: TITLE_ASC) {
      nodes {
        id
        title
        alias
        date
        summary
        category {
          ... on Category {
            name
          }
        }
        author {
          ... on ArticleAuthor {
            name
          }
        }
      }
      totalCount
    }
  }
}
`;

export async function getStaticProps() {
  const res = await executeQuery(query);

  const data = res?.data?.entries?.allArticle?.nodes ?? [];
  if (!data) {
    return { props: {} };
  }

  const props: BlogListPageProps = {
    posts: data.map(
      (ent) =>
        ({
          alias: ent.alias,
          author: ent.author.name,
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
    props,
  };
}

export default BlogListPage;
