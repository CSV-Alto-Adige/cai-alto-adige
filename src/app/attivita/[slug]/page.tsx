import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Image from "next/image";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import AddToCartButton from "@/components/AddToCartButton";
import { Link, Button } from "@nextui-org/react";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SocialIcon } from "react-social-icons";

async function getEvent(slug: string) {
  return directus.request(
    readItems("activities", {
      filter: {
        slug: {
          _eq: slug,
        },
      },
      fields: ["*", { image: ["filename_disk"] }],
    })
  );
}

async function getSection(slug: string) {
  return directus.request(
    readItems("Sezioni", {
      filter: {
        slug: {
          _eq: slug,
        },
      },
      fields: ["*", { image: ["filename_disk"] }],
    })
  );
}

export default async function DynamicPage({ params }: any) {
  const events = await getEvent(params.slug);
  const event = events[0];
  const sections = await getSection(event.Sezione);
  const section = sections[0];

  if (!event) {
    notFound();
  }

  const renderParagraph = (label: any, value: any) => {
    if (!value) return null; // Skip if value is undefined, null, or an empty string

    return (
      <p className="text-base text-gray-500 capitalize">
        <span className="text-gray-900 font-semibold mr-4">{label}</span>
        {value}
      </p>
    );
  };

  return (
    <div className="bg-white min-h-[90vh] flex items-center mt-12 lg:mt-12">
      <div className="mx-auto w-3/4 px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:px-8">
        {/* Event details and image */}
        <div className="lg:max-w-lg lg:self-end">
          <div className="mt-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {event.Titolo}
            </h1>
          </div>
          <section aria-labelledby="information-heading" className="mt-4">
            <div className="flex items-center">
              <div>
                {event.Data_inizio && event.Data_fine ? (
                  <p className="text-lg text-gray-900 sm:text-xl">
                    {format(event.Data_inizio, "dd LLL, y", { locale: it })} -{" "}
                    {format(event.Data_fine, "dd LLL, y", { locale: it })}
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
                    <p className="ml-2 text-sm text-gray-500">
                      {event.Regione_Provincia} - {event.Zona}
                    </p>
                  ) : event.Regione_Provincia ? (
                    <p className="ml-2 text-sm text-gray-500">
                      {event.Regione_Provincia}
                    </p>
                  ) : (
                    <p className="ml-2 text-sm text-gray-500">
                      {event.Regione_Provincia}
                    </p>
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
              {renderParagraph(
                "Dislivello in salita:",
                event.Dislivello_in_salita
              )}
              {renderParagraph(
                "Dislivello in discesa:",
                event.Dislivello_in_discesa
              )}
              {renderParagraph("Quota di partenza:", event.Quota_di_partenza)}
              {renderParagraph(
                "Quota massima raggiunta:",
                event.Quota_massima_raggiunta
              )}
              {renderParagraph("Quota di arrivo:", event.Quota_di_arrivo)}
              {renderParagraph(
                "Numero massimi partecipanti:",
                event.Numero_massimo_partecipanti
              )}
              {renderParagraph("Mezzo di trasporto:", event.Mezzo_di_trasporto)}
              {event.Iscrizioni_dal ? (
                <p className="text-base text-gray-500">
                  <span className="text-gray-900 font-semibold mr-4">
                    Iscrizioni dal:
                  </span>
                  {format(event.Iscrizioni_dal, "dd/LL/y", { locale: it })}
                </p>
              ) : (
                ""
              )}
              {event.Contatto_riferimento ? (
                <>
                  <p className="text-gray-900 font-semibold">
                    Contatto di riferimento:
                  </p>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: event.Contatto_riferimento,
                    }}
                  ></div>
                </>
              ) : (
                ""
              )}
              {event.Note ? (
                <>
                  <p className="text-gray-900 font-semibold">Note:</p>
                  <div dangerouslySetInnerHTML={{ __html: event.Note }}></div>
                </>
              ) : (
                ""
              )}
            </div>
            {section.Email && (
              <Card className="mt-12">
                <CardHeader>
                  <CardTitle>Club Alpino Sezione di {section.Nome}</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* <img src={data.logo} alt={`${data.nome} logo`} /> */}
                  {section.Link_sito && (
                    <p>
                      Sito web:{" "}
                      <a href={section.Link_sito} target="_blank">
                        Visita il nostro sito
                      </a>
                    </p>
                  )}
                  {section.Email && (
                    <p className="text-gray-600">
                      Email:{" "}
                      <a
                        href={`mailto:${section.Email}`}
                        className="text-gray-900 font-semibold"
                      >
                        {section.Email}
                      </a>
                    </p>
                  )}
                  {section.Phone && (
                    <p className="text-gray-600">
                      Phone:{" "}
                      <span className="text-gray-900 font-semibold">
                        {section.Telefono}
                      </span>
                    </p>
                  )}
                  {section.Via && section.Numero && section.Comune && (
                    <p className="text-gray-600">
                      Indirizzo:{" "}
                      <span className="text-gray-900 font-semibold">
                        {section.Via}
                      </span>
                      <span className="ml-1 text-gray-900 font-semibold">
                        {section.Numero},
                      </span>
                      <span className="ml-2 text-gray-900 font-semibold">
                        {section.Comune}
                      </span>{" "}
                    </p>
                  )}
                </CardContent>
                <CardFooter>
                  {section.Facebook && (
                    <Button
                      href={section.Facebook}
                      variant="flat"
                      className="bg-white p-4"
                    >
                      <SocialIcon
                        url={section.Facebook}
                        style={{ height: "40px", width: "40px" }}
                      />
                    </Button>
                  )}
                  {section.Instagram && (
                    <Button
                      href={section.Instagram}
                      variant="flat"
                      className="bg-white p-4"
                    >
                      <SocialIcon
                        url={section.Instagram}
                        style={{ height: "40px", width: "40px" }}
                      />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )}
          </section>
        </div>
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-start h-full">
          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg sticky top-0">
            {event.Immagine ? (
              <Image
                src={`${directus.url}assets/${event.Immagine}`}
                width={500}
                height={600}
                alt="Attività"
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          {event.Locandina ? (
            <Button
              href={`${directus.url}assets/${event.Locandina}`}
              as={Link}
              color="primary"
              showAnchorIcon
              variant="ghost"
              className="w-full mb-4"
            >
              Locandina
            </Button>
          ) : (
            ""
          )}
          {event.Tracciato_GPX ? (
            <Button
              href={`${directus.url}assets/${event.Tracciato_GPX}`}
              as={Link}
              color="primary"
              showAnchorIcon
              variant="ghost"
              className="w-full mb-4"
            >
              Tracciato GPX
            </Button>
          ) : (
            ""
          )}
          <AddToCartButton event={event} />
        </div>
      </div>
    </div>
  );
}
