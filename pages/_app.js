import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import 'tailwindcss/dist/base.css';
import 'tailwindcss/dist/components.css';

function Nav() {
  const { asPath } = useRouter();

  if (asPath === `/[...page]`) {
    // FIXME: Rendered too early.
    return null;
  }

  const breadcrumbs = [];
  let i = 0;
  while ((i = (asPath + `/`).indexOf(`/`, i + 1)) !== -1) {
    breadcrumbs.push({
      href: asPath.slice(0, i),
      name: asPath.slice(asPath.lastIndexOf(`/`, i - 1) + 1, i),
    });
  }

  return (
    <nav>
      {breadcrumbs.map(({ href, name }) => (
        <Fragment key={href}>
          <span> / </span>

          <Link href="/[...page]" as={href}>
            <a>{name}</a>
          </Link>
        </Fragment>
      ))}

      <style jsx>{`
        nav {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
        }
        span {
          color: lightgray;
        }
        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </nav>
  );
}

function Footer() {
  return (
    <footer>
      Made by <a href="https://twitter.com/kitibyte">David Jones</a> using the{' '}
      <a href="https://github.com/bagelbits/5e-database/">
        D&amp;D 5th Edition API Database
      </a>
      {' · '}
      <a href="https://github.com/kitibyte/5e-srd-api-explorer">
        github.com/kitibyte/5e-srd-api-explorer
      </a>
      <style jsx>{`
        footer {
          margin-top: 4rem;
          border-top: 1px solid lightgray;
          padding-top: 2rem;
          padding-bottom: 2rem;
          text-align: center;
        }
        a {
          text-decoration: underline;
          white-space: nowrap;
        }
      `}</style>
    </footer>
  );
}

/**@param {import('next/app').AppProps} props */
export default function App({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>D&amp;D 5th Edition API Explorer</title>
      </Head>

      <Nav />

      <Component {...pageProps} />

      <Footer />

      <style jsx>{`
        div {
          margin: auto;
          padding: 0.5rem;
          min-height: 100vh;
          display: grid;
          grid-template-rows: min-content auto min-content;
          color: rgb(46, 52, 54);
          background: white;
        }
      `}</style>
    </div>
  );
}
