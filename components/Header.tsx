import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { DarkModeIcon } from "./icons/DarkMode";

export const Header: React.FC = () => {
  const { pathname } = useRouter();

  return (
    <div className="header">
      <div className="header__logo">
        <Link href="/">
          <a>¡Hola! 👋</a>
        </Link>
      </div>
      <div className="header__actions">
        <Link href="/work">
          <a className={pathname === "/work" ? "--active" : undefined}>Work</a>
        </Link>
        <Link href="/blog">
          <a className={pathname === "/blog" ? "--active" : undefined}>Blog</a>
        </Link>
        <button>
          <DarkModeIcon />
        </button>
      </div>
    </div>
  );
};
