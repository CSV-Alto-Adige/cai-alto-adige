import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";
import { format, isValid } from "date-fns"
import { it } from 'date-fns/locale';
import Link from "next/link";

  async function getPosts() {
      return directus.request(
          readItems('announcements', {
        filter: {
          status: {
            _eq: 'published'
          },
        },
        sort: [ "-date_created" ],
        limit: 2000,
        })
      );
  }
  
  export default async function Announcements() {

    const posts = await getPosts();

    return (
      <div className="bg-white py-40 min-h-[85vh]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Annunci</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Qui trovi tutti gli annunci relativi alle nostre attività.
            </p>
            <div className="mt-10 space-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16">
              {posts.map((post) => (
                <article key={post.id} className="flex max-w-xl flex-col items-start justify-between">
                  <div className="flex items-center gap-x-4 text-xs">
                    <time dateTime={post.date_created} className="text-gray-500">
                     {format(post.date_created, "dd/LL/y", { locale: it })}
                    </time>
                    <Link
                      href="/"
                      className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                    >
                      Annuncio
                    </Link>
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                      <Link href={`https://attivita.caialtoadige.it/news/${post.slug}`}>
                        <span className="absolute inset-0" />
                        {post.title}
                      </Link>
                    </h3>
                    <div className='mt-5 line-clamp-3 text-sm leading-6 text-gray-600' dangerouslySetInnerHTML={{ __html: post.body }}></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  