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
        <div>
          <small>{category}</small>
          <strong>{title}</strong>
          <p>{summary}</p>
        </div>
        <span className="feature__details">
          Details
          <span>→</span>
        </span>
      </div>
      <div className="feature__image">
        {thumbnailUrl ? <img src={thumbnailUrl} alt="" /> : null}
        <div className="feature__image-overlay" />
      </div>
    </a>
  </Link>
);
