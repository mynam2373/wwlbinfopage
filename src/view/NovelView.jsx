import { useState, useEffect } from 'react';
import { sanityClient } from '../sanityClient'; // Ajusta la ruta según tu carpeta

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
        setVolumes(data.volumes);
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
    <div className="p-6 max-w-4xl mx-auto text-[#3d291a]">
      {/* TÍTULO Y LORE GENERAL DESDE SANITY */}
      {novelSettings ? (
        <header className="mb-8 text-center">
          {novelSettings.title && (
            <h1 className="text-3xl font-black uppercase">{novelSettings.title}</h1>
          )}
          {novelSettings.subtitle && (
            <p className="text-sm font-semibold text-[#a36a3e]">{novelSettings.subtitle}</p>
          )}

          {(novelSettings.aboutTitle || novelSettings.aboutContent) && (
            <div className="mt-6 rounded-xl border-2 border-[#3d291a] bg-[#fdf6e3] p-4 text-left">
              {novelSettings.aboutTitle && (
                <h2 className="mb-1 text-lg font-bold">{novelSettings.aboutTitle}</h2>
              )}
              {novelSettings.aboutContent && (
                <p className="whitespace-pre-line text-xs">{novelSettings.aboutContent}</p>
              )}
            </div>
          )}
          {(novelSettings.settingTitle || novelSettings.settingContent) && (
            <div className="mt-4 rounded-xl border-2 border-[#3d291a] bg-[#fdf6e3] p-4 text-left">
              {novelSettings.settingTitle && (
                <h2 className="mb-1 text-lg font-bold">{novelSettings.settingTitle}</h2>
              )}
              {novelSettings.settingContent && (
                <p className="whitespace-pre-line text-xs">{novelSettings.settingContent}</p>
              )}
            </div>
          )}
          {!novelSettings.subtitle && !novelSettings.aboutTitle && !novelSettings.aboutContent
            && !novelSettings.settingTitle && !novelSettings.settingContent && (
              <p className="mt-4 rounded-xl border-2 border-[#3d291a] bg-[#fdf6e3] p-4 text-sm font-semibold">
                La configuración general está creada, pero todavía no tiene contenido publicado.
              </p>
            )}
        </header>
      ) : (
        <p className="mb-8 rounded-xl border-2 border-[#3d291a] bg-[#fdf6e3] p-4 text-center text-sm font-semibold">
          Aún no hay configuración general publicada.
        </p>
      )}

      {/* LISTA DE VOLÚMENES DESDE SANITY */}
      <div className="space-y-6">
        {volumes.length === 0 ? (
          <p className="rounded-xl border-2 border-[#3d291a] bg-[#fdf6e3] p-4 text-center text-sm font-semibold">
            Aún no hay volúmenes publicados.
          </p>
        ) : volumes.map((vol) => {
          const details = [
            ['Premisa', vol.premise],
            ['Conflicto', vol.conflict],
            ['Clímax', vol.climax],
          ].filter(([, content]) => content);

          return (
            <article key={vol._id} className="rounded-2xl border-4 border-[#3d291a] bg-[#fdf6e3] p-5 shadow-md">
              {vol.tag && (
                <span className="text-xs font-black uppercase text-[#a36a3e]">{vol.tag}</span>
              )}
              {vol.title && (
                <h2 className="mt-1 text-xl font-black uppercase">{vol.title}</h2>
              )}

              {details.length > 0 ? (
                <div className="mt-3 space-y-2 text-xs">
                  {details.map(([label, content]) => (
                    <p key={label}><strong>{label}:</strong> {content}</p>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-xs font-semibold">
                  El volumen está creado, pero todavía no tiene contenido publicado.
                </p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}