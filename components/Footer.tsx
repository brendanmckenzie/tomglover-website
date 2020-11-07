import * as React from "react";

export const Footer: React.FC = () => (
  <div className="footer__container">
    <div className="footer__left">
      <ul>
        <li>
          <a
            href="https://www.linkedin.com/in/thomasedwardglover/"
            target="_blank"
            rel="noopener nofollow"
          >
            LinkedIn
          </a>
        </li>
        <li>
          <a
            href="https://twitter.com/tomeglover"
            target="_blank"
            rel="noopener nofollow"
          >
            Twitter
          </a>
        </li>
        <li>
          <a href="https://cdn.pokko.io/bca8b10a-6a84-48e6-87e2-6ed5e7f5b294/22e79771-4d7a-4120-b1c7-fbf9171401f9">
            CV
          </a>
        </li>
      </ul>
    </div>
    <div className="footer__right">
      <ul>
        <li>
          <a
            href="https://www.pokko.io"
            target="_blank"
            rel="noopener nofollow"
          >
            <img
              src="https://cdn.pokko.io/p/pokko-250x-trans.png"
              alt="Powered by Pokko"
            />
          </a>
        </li>
        <li>&copy; {new Date().getFullYear()}</li>
        <li>
          <a
            href="https://www.pokko.io"
            target="_blank"
            rel="noopener nofollow"
          >
            Powered by Pokko
          </a>
        </li>
      </ul>
    </div>
  </div>
);
