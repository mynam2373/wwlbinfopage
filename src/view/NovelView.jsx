import { useState, useEffect } from 'react';
import { sanityClient } from '../sanityClient';

const getVolumeNumber = (volume) => {
  const identifier = volume.number || volume.volumeId || volume.tag || '';
  const match = String(identifier).match(/\d+/);
  return match ? Number(match[0]) : null;
};

const compareVolumes = (first, second) => {
  const firstNumber = getVolumeNumber(first);
  const secondNumber = getVolumeNumber(second);

  if (firstNumber !== null && secondNumber !== null && firstNumber !== secondNumber) {
    return firstNumber - secondNumber;
  }
  if (firstNumber !== null && secondNumber === null) return -1;
  if (firstNumber === null && secondNumber !== null) return 1;

  const firstLabel = first.number || first.volumeId || first.title || '';
  const secondLabel = second.number || second.volumeId || second.title || '';
  return String(firstLabel).localeCompare(String(secondLabel), 'es', {
    numeric: true,
    sensitivity: 'base',
  });
};

export function NovelView() {
  const [novelSettings, setNovelSettings] = useState(null);
  const [volumes, setVolumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;
    const query = `{
      "settings": *[_type == "novelSettings"][0],
      "volumes": *[_type == "volume"] | order(number asc)
    }`;

    sanityClient.fetch(query)
      .then((data) => {
        if (!data || !Array.isArray(data.volumes)) {
          throw new Error('La respuesta de Sanity no tiene el formato esperado.');
        }

        if (!isActive) return;
        setNovelSettings(data.settings ?? null);
        setVolumes([...data.volumes].sort(compareVolumes));
      })
      .catch((fetchError) => {
        console.error('Error al conectar con Sanity:', fetchError);
        if (isActive) setError('No se pudo cargar la novela desde Sanity. Revisa la conexión y vuelve a intentarlo.');
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-[#3d291a] font-bold">
        Cargando textos desde la nube...
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="mx-auto max-w-4xl rounded-xl border-2 border-[#8b2f20] bg-[#fdf6e3] p-6 text-center font-bold text-[#8b2f20]">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-8 text-[#3d291a] sm:px-6">
      <header className="text-center">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#a36a3e]">
          Archivo de Vesteria
        </p>
        {novelSettings?.title ? (
          <h1 className="mt-2 text-3xl font-black uppercase tracking-wide sm:text-4xl">
            {novelSettings.title}
          </h1>
        ) : (
          <h1 className="mt-2 text-3xl font-black uppercase tracking-wide sm:text-4xl">
            La novela
          </h1>
        )}
        {novelSettings?.subtitle && (
          <p className="mx-auto mt-2 max-w-2xl text-sm font-semibold text-[#a36a3e] sm:text-base">
            {novelSettings.subtitle}
          </p>
        )}
        <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-[#a36a3e]" />
      </header>

      <section aria-labelledby="lore-heading">
        <div className="mb-4">
          <h2 id="lore-heading" className="text-xl font-black uppercase sm:text-2xl">
            Mundo e historia
          </h2>
          <p className="mt-1 text-sm text-[#6b4f38]">
            Una mirada general al universo de la novela.
          </p>
        </div>
        {novelSettings && (novelSettings.aboutTitle || novelSettings.aboutContent
          || novelSettings.settingTitle || novelSettings.settingContent) ? (
          <div className="grid gap-4 md:grid-cols-2">
            {(novelSettings.aboutTitle || novelSettings.aboutContent) && (
              <article className="rounded-2xl border-2 border-[#3d291a] bg-[#fdf6e3] p-5 shadow-[4px_4px_0px_rgba(61,41,26,0.18)]">
                <h3 className="text-base font-black uppercase text-[#a36a3e]">
                  {novelSettings.aboutTitle || 'Acerca de la novela'}
                </h3>
                <p className="mt-3 whitespace-pre-line text-sm leading-7">
                  {novelSettings.aboutContent || 'Contenido aún no publicado.'}
                </p>
              </article>
            )}
            {(novelSettings.settingTitle || novelSettings.settingContent) && (
              <article className="rounded-2xl border-2 border-[#3d291a] bg-[#fdf6e3] p-5 shadow-[4px_4px_0px_rgba(61,41,26,0.18)]">
                <h3 className="text-base font-black uppercase text-[#a36a3e]">
                  {novelSettings.settingTitle || 'El escenario'}
                </h3>
                <p className="mt-3 whitespace-pre-line text-sm leading-7">
                  {novelSettings.settingContent || 'Contenido aún no publicado.'}
                </p>
              </article>
            )}
          </div>
        ) : (
          <p className="rounded-xl border-2 border-[#3d291a]/30 bg-[#fdf6e3] p-4 text-sm">
            La información general todavía no está publicada.
          </p>
        )}
      </section>

      <section aria-labelledby="volumes-heading">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="volumes-heading" className="text-xl font-black uppercase sm:text-2xl">
              Volúmenes
            </h2>
            <p className="mt-1 text-sm text-[#6b4f38]">
              Selecciona un volumen para leer su seccion.
            </p>
          </div>
          {volumes.length > 0 && (
            <span className="rounded-full border border-[#a36a3e] px-3 py-1 text-xs font-bold text-[#6b4f38]">
              {volumes.length} {volumes.length === 1 ? 'volumen' : 'volúmenes'}
            </span>
          )}
        </div>

        <div className="space-y-3">
        {volumes.length === 0 ? (
          <p className="rounded-xl border-2 border-[#3d291a]/30 bg-[#fdf6e3] p-4 text-center text-sm font-semibold">
            Aún no hay volúmenes publicados.
          </p>
        ) : volumes.map((vol, index) => {
          const details = [
            ['Premisa', vol.premise],
            ['Conflicto', vol.conflict],
            ['Clímax', vol.climax],
            ['Contenido', vol.content],
          ].filter(([, content]) => content);

          return (
            <details
              key={vol._id}
              open={index === 0}
              className="group overflow-hidden rounded-2xl border-2 border-[#3d291a] bg-[#fdf6e3] shadow-[4px_4px_0px_rgba(61,41,26,0.18)] open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center gap-4 p-4 transition-colors hover:bg-[#d4a373]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#a36a3e] sm:p-5 [&::-webkit-details-marker]:hidden">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#a36a3e] bg-[#d4a373]/30 text-sm font-black">
                  {getVolumeNumber(vol) ?? index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  {(vol.tag || vol.number) && (
                    <span className="block text-[10px] font-black uppercase tracking-wider text-[#a36a3e]">
                      {[vol.number, vol.tag].filter(Boolean).join(' · ')}
                    </span>
                  )}
                  <span className="mt-0.5 block text-left text-base font-black uppercase sm:text-lg">
                    {vol.title || `Volumen ${getVolumeNumber(vol) ?? index + 1}`}
                  </span>
                </span>
                <span aria-hidden="true" className="shrink-0 text-xl font-black text-[#a36a3e] transition-transform group-open:rotate-180">
                  ⌄
                </span>
              </summary>

              <div className="space-y-4 border-t-2 border-[#3d291a]/15 px-4 py-5 sm:px-6">
                {details.length > 0 ? details.map(([label, content], sectionIndex) => (
                  <section key={label} className="flex gap-3">
                    <span className="mt-0.5 hidden h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d4a373]/40 text-xs font-black sm:flex">
                      {sectionIndex + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-xs font-black uppercase tracking-widest text-[#a36a3e]">
                        {label}
                      </h3>
                      <p className="mt-1 whitespace-pre-line text-sm leading-7 text-[#4d3828]">
                        {content}
                      </p>
                    </div>
                  </section>
                )) : (
                  <p className="text-sm font-semibold text-[#6b4f38]">
                    Este volumen aún no tiene contenido publicado.
                  </p>
                )}
              </div>
            </details>
          );
        })}
        </div>
      </section>
    </div>
  );
}