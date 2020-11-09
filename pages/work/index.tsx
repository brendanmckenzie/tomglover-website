import { executeQuery } from "../../src/pokko";

import * as React from "react";
import { Feature, FeatureProps } from "../../components/Feature";
import Head from "next/head";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";

export type WorkPageProps = {
  features: FeatureProps[];
};

export const WorkPage: React.FC<WorkPageProps> = ({ features }) => (
  <>
    <Head>
      <title>Work - Glom Tover</title>
    </Head>
    <div className="container">
      <Header />

      <div className="features">
        <h1>Work</h1>
        {features.map((ent, idx) => (
          <Feature key={idx} {...ent} />
        ))}
      </div>
      <Footer />
    </div>
  </>
);

const query = `
query {
  entries {
    allWork(skip: 0, take: 25, orderBy: TITLE_ASC) {
      nodes {
        id
        title
        alias
        summary
        category {
          ... on Category {
            name
          }
        }
        image {
          url(
            process: { height: 600, width: 600, fit: COVER, position: CENTRE }
          )
        }
      }
      totalCount
    }
  }
}
`;

export async function getStaticProps() {
  const res = await executeQuery(query);

  const data = res?.data?.entries?.allWork?.nodes ?? [];
  if (!data) {
    return { props: {} };
  }

  const props: WorkPageProps = {
    features: data.map(
      (ent) =>
        ({
          title: ent.title,
          summary: ent.summary,
          category: ent.category?.name || null,
          url: `/work/${ent.alias}`,
          thumbnailUrl: ent.image?.url ?? null,
        } as FeatureProps)
    ),
  };

  return {
    props,
  };
}

export default WorkPage;
