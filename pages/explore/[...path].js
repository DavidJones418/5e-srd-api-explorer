import { useRouter } from 'next/router';
import Entity from '../../components/entity';
import DATA from '../../data/5e.json';
import PageNotFound from '../404';

/**
 * @param {unknown} obj
 * @param {string[]} keys
 */
function dig(obj, keys) {
  for (const key of keys) {
    if (typeof obj === `object` && obj !== null && obj.hasOwnProperty(key)) {
      obj = obj[key];
    } else {
      return undefined;
    }
  }
  return obj;
}

/**
 * @param {string} slug
 */
function titleize(slug) {
  return slug.replace(/_/g, ` `).replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

/**@type {import('next').GetStaticPaths<{ path: string[] }>} */
export async function getStaticPaths() {
  return {
    paths: Object.values(DATA).map(({ _path }) => ({
      params: { path: _path },
    })),
    fallback: true,
  };
}

/**@param {import('next').GetStaticPropsContext<{ path: string[] }>} context */
export async function getStaticProps(context) {
  const { path = [] } = context.params;

  let data = dig(DATA, path) ?? null;

  if (typeof data === `object` && data !== null && path.length < 2) {
    // Don’t send all of the data down if an index is requested.
    data = Object.entries(data).reduce((shallow, [key, value]) => {
      if (!key.startsWith(`_`)) {
        shallow[key] = {
          _path: value._path,
          name: value.name ?? titleize(key),
          description: value.description ?? null,
        };
      }
      return shallow;
    }, {});
  }
  return { props: { path, data } };
}

/**@param {import('next').InferGetStaticPropsType<typeof getStaticProps>} props */
export default function CatchallPage({ path, data }) {
  const { isFallback } = useRouter();

  if (isFallback) {
    return (
      <p className="m-auto text-center opacity-50 italic text-xl">Loading...</p>
    );
  }

  if (!data) {
    return <PageNotFound />;
  }

  return (
    <main className="container m-auto">
      <Entity data={data} path={path} />
    </main>
  );
}
