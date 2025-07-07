import { Button } from "@/components/ui/button";
import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getPost(slug: string) {
  return directus.request(
    readItems("announcements", {
      filter: {
        slug: {
          _eq: slug,
        },
      },
      fields: ["*"],
    })
  );
}

export default async function NewsPage({ params }: any) {
  const posts = await getPost(params.slug);
  const post = posts[0];
  if (!post) {
    notFound();
  }

  return (
    <div className="bg-white px-6 py-32 lg:px-8 min-h-[85vh]">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700 mt-12">
        <h1 className="mt-2 text-3xl font-bold tracking-tightsm:text-4xl text-[#0e4d71] mb-12">
          {post.title}
        </h1>
        {post.body ? (
          <div dangerouslySetInnerHTML={{ __html: post.body }}></div>
        ) : (
          <></>
        )}
        {post.locandina ? (
          <Button className="bg-[#0e4d71] w-full mt-12">
            <Link
              href={`${directus.url}assets/${post.locandina}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              Locandina
            </Link>
          </Button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
