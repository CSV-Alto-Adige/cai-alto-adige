import directus from '@/lib/directus';
import { notFound } from 'next/navigation';
import { readItem } from '@directus/sdk';
import Image from 'next/image';
import { format } from "date-fns"
import { it } from 'date-fns/locale';
import AddToCartButton from '@/components/AddToCartButton';

async function getPage(id: any) {
	try {
		const page = await directus.request(readItem('activities', id, {	fields: ['*', { image: ['filename_disk']}],}));
		return page;
	} catch (error) {
		notFound();
	}
}

export default async function DynamicPage({ params }: any) {
	const event = await getPage(params.id);
  const gridColumns = event.Immagine ? 'lg:grid-cols-2' : 'lg:grid-cols-1';

  const renderParagraph = (label: any, value: any) => {
    if (!value) return null; // Skip if value is undefined, null, or an empty string
  
    return (
      <p className="text-base text-gray-500">
        <span className="text-gray-900 font-semibold mr-4">{label}</span>
        {value}
      </p>
    );
  };

	return (
    <div className="bg-white min-h-[90vh] flex items-center mt-12 lg:mt-12">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Event details and image */}
        <div className="lg:max-w-lg lg:self-end">
          <div className="mt-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{event.Titolo}</h1>
          </div>
          <section aria-labelledby="information-heading" className="mt-4">
            <div className="flex items-center">
              <div>
                {event.Data_inizio && event.Data_fine ? (
                  <p className="text-lg text-gray-900 sm:text-xl">
                    {format(event.Data_inizio, "dd LLL, y", { locale: it })} - {format(event.Data_fine, "dd LLL, y", { locale: it })}
                  </p>
                ) : event.Data_inizio ? (
                  <p className="text-lg text-gray-900 sm:text-xl">
                    {format(event.Data_inizio, "dd LLL, y", { locale: it })}
                  </p>
                ) : (
                  ""
                )}
              </div>
              <div className="ml-4 border-l border-gray-300 pl-4">
                <div className="flex items-center">
                  {event.Regione_Provincia && event.Zona ? (
                   <p className="ml-2 text-sm text-gray-500">{event.Regione_Provincia} - {event.Zona}</p>
                  ) : event.Regione_Provincia ? (
                    <p className="ml-2 text-sm text-gray-500">{event.Regione_Provincia}</p>
                  ) : (
                    <p className="ml-2 text-sm text-gray-500">{event.Regione_Provincia}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
                {renderParagraph("Attività:", event.Attivita)}
                {renderParagraph("Sezione:", event.Sezione)}
                {renderParagraph("Gruppo:", event.Gruppo)}
                {renderParagraph("Difficoltà:", event.Difficolta)}
                {renderParagraph("Durata in ore:", event.Durata_in_ore)}
                {renderParagraph("Dislivello in salita:", event.Dislivello_in_salita)}
                {renderParagraph("Dislivello in discesa:", event.Dislivello_in_discesa)}
                {renderParagraph("Quota di partenza:", event.Quota_di_partenza)}
                {renderParagraph("Quota massima raggiunta:", event.Quota_massima_raggiunta)}
                {renderParagraph("Quota di arrivo:", event.Quota_di_arrivo)}
                {renderParagraph("Numero massimi partecipanti:", event.Numero_massimo_partecipanti)}
                {renderParagraph("Mezzo di trasporto:", event.Mezzo_di_trasporto)}
                {event.Iscrizioni_dal ? (
                   <p className="text-base text-gray-500"><span className="text-gray-900 font-semibold mr-4">Iscrizioni dal:</span>{format(event.Iscrizioni_dal, "dd/LL/y", { locale: it })}</p>
                  ) : "" }
                {event.Locandina ? (
                   <a href={`${directus.url}assets/${event.Locandina}`} target="_blank" rel="noopener noreferrer" className="text-base text-gray-900 font-semibold">Locandina</a>
                  ) : "" }
                  {event.Tracciato_GPX ? (
                  <a href={`${directus.url}assets/${event.Tracciato_GPX}`} target="_blank" rel="noopener noreferrer" className="text-base text-gray-900 font-semibold">Tracciato GPX</a>
                  ) : "" }
                {event.Note ? (
                  <>
                 <p className='text-gray-900 font-semibold'>Note:</p><div dangerouslySetInnerHTML={{ __html: event.Note }}></div>
                 </>
                ) : "" }
            </div>
          </section>
        </div>
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-start">
          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
          {event.Immagine ? (
            <Image src={`${directus.url}assets/${event.Immagine}`} width={500} height={600} alt="Attività" className="h-full w-full object-cover object-center" />
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
              <AddToCartButton event={event}/>
        </div>
      </div>
    </div>
  );
}