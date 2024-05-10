
import directus from '@/lib/directus';
import { readItem } from '@directus/sdk';
import Image from 'next/image';
import { notFound } from 'next/navigation';

async function getPost(id: any) {
	try {
		const post = await directus.request(
			readItem('announcements', id, {
				fields: ['*', { image: ['filename_disk'] }],
			})
		);

		return post;
	} catch (error) {
		notFound();
	}
}


export default async function NewsPage({ params}: any) {
  const post = await getPost(params.id);
  console.log(params)
  return (
    <div className="bg-white px-6 py-32 lg:px-8 min-h-[90vh]">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700 mt-12">
        <h1 className="mt-2 text-3xl font-bold tracking-tightsm:text-4xl text-[#0e4d71]">La nuova piattaforma del CAI Alto Adige è online</h1>
        {post.image ? (
            <Image src={`${directus.url}assets/${post.image}`} width={500} height={600} alt="Attività" className="h-full w-full object-cover object-center" />
            ) : (
              <></>
            )}
            {post.body ? (
            <div dangerouslySetInnerHTML={{ __html: post.body }}></div>
            ) : (
              <></>
            )} 
      </div>
    </div>
  )
}
