import { client, clientPreview } from "../../src/pokko";

import * as React from "react";
import { Feature, FeatureProps } from "../../components/Feature";
import Head from "next/head";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { GetStaticProps } from "next";

const query = require("../../src/api/work-list.graphql");

export type WorkPageProps = {
  features: FeatureProps[];
};

export const WorkPage: React.FC<WorkPageProps> = ({ features }) => (
  <>
    <Head>
      <title>Work - Tom Glover</title>
    </Head>
    <div className="container">
      <Header />

      <div className="features__container">
        <h1>Work</h1>
        <div className="features__list">
          {features.map((ent, idx) => (
            <Feature key={idx} {...ent} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  </>
);

export const getStaticProps: GetStaticProps = async (context) => {
  const res = await (context.preview ? clientPreview : client).query({
    query,
  });

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
};

export default WorkPage;
