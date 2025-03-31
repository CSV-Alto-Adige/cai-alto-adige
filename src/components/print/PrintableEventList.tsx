import { Button } from '@nextui-org/react';
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import directus from '@/lib/directus';
import Image from 'next/image';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import CAILogo from '@/assets/cai_logo.png'

export const PrintableEventList = ({ events }: any) => {
  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    documentTitle: "Print This Document",
    content: () => contentToPrint.current,
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
  });

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
    <>
      <div ref={contentToPrint} className="hidden print:block">
        {events?.map((event: any) => (
          <div key={event.id} className="bg-white flex items-center my-12 printable-event">
            <div className='bg-[#0E4D71] py-4 h-4 w-full fixed top-0'></div>
            <div className="mx-auto w-3/4 px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:px-8">
              <div className="lg:max-w-lg lg:self-end">
                <Image src={CAILogo} alt="Logo" className="w-12"/>
                <div className="mt-4">
                  <p className="text-base font-semibold leading-7 text-[#0E4D71] mb-2">Attività CAI Alto Adige</p>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{event.Titolo}</h1>
                </div>
                <section aria-labelledby="information-heading" className="mt-4">
                  <div className="flex items-center">
                    <div>
                      {event.Data_inizio && event.Data_fine ? (
                        <p className="text-lg text-gray-900 sm:text-xl">
                          {format(event.Data_inizio, 'dd LLL, y', { locale: it })} - {format(event.Data_fine, 'dd LLL, y', { locale: it })}
                        </p>
                      ) : event.Data_inizio ? (
                        <p className="text-lg text-gray-900 sm:text-xl">
                          {format(event.Data_inizio, 'dd LLL, y', { locale: it })}
                        </p>
                      ) : (
                        ''
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
                    {renderParagraph('Attività:', event.Attivita)}
                    {renderParagraph('Sezione:', event.Sezione)}
                    {renderParagraph('Gruppo:', event.Gruppo)}
                    {renderParagraph('Difficoltà:', event.Difficolta)}
                    {renderParagraph('Durata in ore:', event.Durata_in_ore)}
                    {renderParagraph('Dislivello in salita:', event.Dislivello_in_salita)}
                    {renderParagraph('Dislivello in discesa:', event.Dislivello_in_discesa)}
                    {renderParagraph('Quota di partenza:', event.Quota_di_partenza)}
                    {renderParagraph('Quota massima raggiunta:', event.Quota_massima_raggiunta)}
                    {renderParagraph('Quota di arrivo:', event.Quota_di_arrivo)}
                    {renderParagraph('Numero massimi partecipanti:', event.Numero_massimo_partecipanti)}
                    {renderParagraph('Mezzo di trasporto:', event.Mezzo_di_trasporto)}
                    {event.Iscrizioni_dal ? (
                      <p className="text-base text-gray-500"><span className="text-gray-900 font-semibold mr-4">Iscrizioni dal:</span>{format(event.Iscrizioni_dal, 'dd/LL/y', { locale: it })}</p>
                    ) : ''}
                    {event.Contatto_riferimento ? (
                      <>
                        <p className="text-gray-900 font-semibold">Note:</p>
                        <div dangerouslySetInnerHTML={{ __html: event.Contatto_riferimento }}></div>
                      </>
                    ) : ''}
                    {event.Note ? (
                      <>
                        <p className="text-gray-900 font-semibold">Note:</p>
                        <div dangerouslySetInnerHTML={{ __html: event.Note }}></div>
                      </>
                    ) : ''}
                  </div>
                </section>
              </div>
            </div>
            <div className='bg-[#0E4D71] py-4 h-4 w-full fixed bottom-0'></div>
          </div>
        ))}
      </div>

      <Button
        onClick={handlePrint}
        color="primary"
        variant="solid"
        className="w-full bg-[#0E4D71]"
      >
        Esporta PDF
      </Button>
    </>
  );
};
