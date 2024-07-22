import directus from '@/lib/directus';
import { notFound } from 'next/navigation';
import { readItems } from '@directus/sdk';
import Announcements from '@/components/Announcements';

async function getPage(slug: string) {
    try {
        const pages = await directus.request( readItems('pages', {
            filter: {
                slug: {
                _eq: slug
                }
            },
            fields: ['*',],
                })
        );
		return pages;
    } catch (error) {
		notFound();
	}
}


export default async function DynamicPage({ params }: any) {
    const pages = await getPage(params.slug);
    const page = pages[0];
    if (!page) {
        notFound();
      }

      if (params.slug === 'annunci') {
        return <Announcements/>;
    }
    
	return (
        <div className="bg-white px-6 py-32 lg:px-8 min-h-[85vh]">
            <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{page.Titolo}</h1>
            <div className='mt-10' dangerouslySetInnerHTML={{ __html: page.Testo }}></div>
            </div>
        </div>
	);
}