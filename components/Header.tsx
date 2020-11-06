import * as React from "react";
import Link from "next/link";

export const Header: React.FC = () => (
  <div className="header">
    <div className="header__logo">
      <Link href="/">
        <a>¡Hola! 👋</a>
      </Link>
    </div>
    <div className="header__actions">
      <Link href="/work">
        <a>Work</a>
      </Link>
      <Link href="/blog">
        <a>Blog</a>
      </Link>
    </div>
  </div>
);
