import Head from "next/head";
import Link from "next/link";
import { executeQuery } from "../src/pokko";

export type FeatureProps = {
  title: string;
  category: string;
  summary: string;
  url: string;
  thumbnailUrl?: string;
};

export const Feature: React.FC<FeatureProps> = ({
  title,
  category,
  summary,
  url,
  thumbnailUrl,
}) => (
  <div className="feature">
    <div className="feature__detail">
      <small>{category}</small>
      <strong>{title}</strong>
      <p>{summary}</p>
      <Link href={url}>Details</Link>
    </div>
    <div className="feature__image">
      {thumbnailUrl ? <img src={thumbnailUrl} alt="" /> : null}
    </div>
  </div>
);

export type Brand = {
  name: string;
  image?: string;
};

export type HomePageProps = {
  title: string;
  features: FeatureProps[];
  brands: Brand[];
};

const HomePage: React.FC<HomePageProps> = ({ title, features, brands }) => {
  return (
    <>
      <Head>
        <title>Glom Tover</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header__logo">¡Hola! 👋</div>
          <div className="header__actions">
            <Link href="/work">Work</Link>
            <Link href="/blog">Blog</Link>
          </div>
        </div>
        <div className="hero">
          <div className="hero__copy">{title}</div>
          <div className="hero__actions">
            <a
              className="button --primary"
              href="mailto:hello@tomglover.com.au"
            >
              Get in touch
            </a>
          </div>
        </div>
        <div className="features">
          {features.map((ent, idx) => (
            <Feature
              key={idx}
              title={ent.title}
              category={ent.category}
              summary={ent.summary}
              url={ent.url}
            />
          ))}
        </div>
        <div className="brands">
          {brands.map((ent, idx) => (
            <div key={idx} className="brand">
              <img src={ent.image} alt={ent.name} />
            </div>
          ))}
        </div>
        <div className="contact">contact</div>
        <div className="footer">footer</div>
      </div>
    </>
  );
};

export async function getStaticProps() {
  const query = `
  query {
    entries {
      allHome(skip: 0, take: 1) {
        nodes {
          id
          title
          contactMessage
          links {
            __typename
            ... on Link {
              text
              target
            }
          }
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
                url
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
  const res = await executeQuery(query);

  const data = res?.data?.entries?.allHome?.nodes[0] ?? null;
  if (!data) {
    console.log("null data", JSON.stringify(res));
    return { props: {} };
  }
  const props: HomePageProps = {
    title: data.title,
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
