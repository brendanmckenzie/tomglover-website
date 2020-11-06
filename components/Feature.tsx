import * as React from "react";
import Link from "next/link";

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
  <Link href={url}>
    <a className="feature">
      <div className="feature__detail">
        <small>{category}</small>
        <strong>{title}</strong>
        <p>{summary}</p>
        <span className="feature__details">
          Details
          <span>→</span>
        </span>
      </div>
      <div className="feature__image">
        {thumbnailUrl ? <img src={thumbnailUrl} alt="" /> : null}
      </div>
    </a>
  </Link>
);
