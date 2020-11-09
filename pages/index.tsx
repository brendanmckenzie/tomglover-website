import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { Feature, FeatureProps } from "../components/Feature";
import { executeQuery } from "../src/pokko";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export type Brand = {
  name: string;
  image?: string;
};

export type HomePageProps = {
  title: string;
  summary: string;
  contactMessage: string;
  features: FeatureProps[];
  brands: Brand[];
};

const HomePage: React.FC<HomePageProps> = ({
  title,
  summary,
  contactMessage,
  features,
  brands,
}) => (
  <>
    <Head>
      <title>Glom Tover</title>
    </Head>
    <div className="container">
      <Header />
      <div className="hero">
        <div className="hero__title">{title}</div>
        <p className="hero__summary">{summary}</p>
        <div className="hero__actions">
          <a className="button --primary" href="mailto:hello@tomglover.com.au">
            Get in touch
          </a>
        </div>
      </div>
      <div className="features">
        {features.map((ent, idx) => (
          <Feature key={idx} {...ent} />
        ))}
        <div className="features__more">
          <Link href="/work">
            <a>
              <span>See more work</span>
              <span>→</span>
            </a>
          </Link>
        </div>
      </div>
      <div className="brands__container">
        <h2>I’ve worked with</h2>
        <div className="brands">
          {brands.map((ent, idx) => (
            <div key={idx} className="brand">
              <img src={ent.image} alt={ent.name} />
            </div>
          ))}
        </div>
      </div>
      <div className="contact__container">
        <h2>Get in touch</h2>
        <p>
          <strong>{contactMessage}</strong>
        </p>
        <div className="contact__actions">
          <a className="button --inverse" href="mailto:hello@tomglover.com.au">
            Email me
          </a>
        </div>
      </div>
      <Footer />
    </div>
  </>
);

const query = `
query {
  entries {
    allHome(skip: 0, take: 1) {
      nodes {
        id
        title
        summary
        contactMessage
        features {
          __typename
          ... on Work {
            title
            summary
            alias
            category {
              ... on Category {
                name
              }
            }
            image {
              url(
                process: {
                  height: 600
                  width: 600
                  fit: COVER
                  position: CENTRE
                }
              )
            }
          }
        }
        brands {
          __typename
          ... on Brand {
            link
            logo {
              url
            }
            name
          }
        }
      }
    }
  }
}
`;
export async function getStaticProps() {
  const res = await executeQuery(query);

  const data = res?.data?.entries?.allHome?.nodes[0] ?? null;
  if (!data) {
    if (res?.errors) {
      console.warn("**** errors", JSON.stringify(res.errors));
      return { props: {} };
    }

    console.log("**** no data", JSON.stringify(res));
    return { props: {} };
  }

  const props: HomePageProps = {
    title: data.title,
    summary: data.summary,
    contactMessage: data.contactMessage,
    features: data.features.map(
      (ent) =>
        ({
          title: ent.title,
          summary: ent.summary,
          category: ent.category?.name,
          url: `/work/${ent.alias}`,
          thumbnailUrl: ent.image?.url ?? null,
        } as FeatureProps)
    ),
    brands: data.brands.map(
      (ent) =>
        ({
          name: ent.name,
          image: ent.logo?.url ?? null,
        } as Brand)
    ),
  };

  return {
    props,
  };
}

export default HomePage;
