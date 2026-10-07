import React, { useState } from 'react';
import { novelData } from '../data/novelData';

export const NovelPage = () => {
  const [tab, setTab] = useState('general'); // 'general' o 'volumes'
  const [selectedVol, setSelectedVol] = useState(novelData.volumes[0].id);

  const currentVolume = novelData.volumes.find(v => v.id === selectedVol);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 font-serif text-[#2a2118]">
      {/* HEADER DE LA SECCIÓN */}
      <div className="text-center mb-8 border-b border-[#553c2a] pb-4">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-[#3d291a]">
          {novelData.title}
        </h1>
        <p className="text-sm sm:text-base italic text-[#6e523b] mt-1">
          {novelData.subtitle}
        </p>
        
        {/* NAVEGACIÓN PRINCIPAL DE LA NOVELA */}
        <div className="flex justify-center gap-4 mt-6">
          <button 
            onClick={() => setTab('general')}
            className={`px-4 py-2 font-sans font-bold text-sm uppercase transition-colors rounded ${
              tab === 'general' 
                ? 'bg-[#553c2a] text-[#fdf6e3]' 
                : 'bg-[#e0d3be] text-[#553c2a] hover:bg-[#d0c0a5]'
            }`}
          >
            Sinopsis General & Lore
          </button>
          <button 
            onClick={() => setTab('volumes')}
            className={`px-4 py-2 font-sans font-bold text-sm uppercase transition-colors rounded ${
              tab === 'volumes' 
                ? 'bg-[#553c2a] text-[#fdf6e3]' 
                : 'bg-[#e0d3be] text-[#553c2a] hover:bg-[#d0c0a5]'
            }`}
          >
            Volúmenes (1 - 5)
          </button>
        </div>
      </div>

      {/* VISTA 1: SINOPSIS GENERAL Y ESCENARIO */}
      {tab === 'general' && (
        <div className="space-y-6">
          <section className="bg-[#f5ebd7] p-6 rounded border border-[#c2b299] shadow-sm">
            <h2 className="text-xl font-bold uppercase text-[#3d291a] mb-3 flex items-center gap-2">
              <span>🌟</span> {novelData.general.about.title}
            </h2>
            <p className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-[#2a2118]">
              {novelData.general.about.content}
            </p>
          </section>

          <section className="bg-[#f5ebd7] p-6 rounded border border-[#c2b299] shadow-sm">
            <h2 className="text-xl font-bold uppercase text-[#3d291a] mb-3 flex items-center gap-2">
              <span>🗺️</span> {novelData.general.setting.title}
            </h2>
            <p className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-[#2a2118]">
              {novelData.general.setting.content}
            </p>
          </section>
        </div>
      )}

      {/* VISTA 2: NAVEGADOR DE VOLÚMENES */}
      {tab === 'volumes' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* LISTA LATERAL / SELECTOR DE VOLÚMENES */}
          <div className="flex flex-col gap-2 md:col-span-1">
            {novelData.volumes.map((vol) => (
              <button
                key={vol.id}
                onClick={() => setSelectedVol(vol.id)}
                className={`p-3 text-left rounded text-sm font-sans font-bold transition-all border ${
                  selectedVol === vol.id
                    ? 'bg-[#3d291a] text-[#fdf6e3] border-[#3d291a] shadow'
                    : 'bg-[#f5ebd7] text-[#3d291a] border-[#c2b299] hover:bg-[#e8dc2]'
                }`}
              >
                <span className="block text-[10px] opacity-80 uppercase">{vol.number}</span>
                {vol.title}
              </button>
            ))}
          </div>

          {/* FICHA DETALLADA DEL VOLUMEN SELECCIONADO */}
          <div className="md:col-span-3 bg-[#f5ebd7] p-6 rounded border border-[#c2b299] shadow-sm space-y-4">
            <div className="border-b border-[#c2b299] pb-3">
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#8c4843]">
                {currentVolume.tag}
              </span>
              <h2 className="text-2xl font-bold text-[#3d291a]">
                {currentVolume.title}
              </h2>
            </div>

            <div>
              <h3 className="text-xs font-sans font-black uppercase text-[#553c2a] mb-1">
                La Premisa
              </h3>
              <p className="text-sm leading-relaxed">{currentVolume.premise}</p>
            </div>

            <div>
              <h3 className="text-xs font-sans font-black uppercase text-[#553c2a] mb-1">
                El Conflicto
              </h3>
              <p className="text-sm leading-relaxed">{currentVolume.conflict}</p>
            </div>

            <div>
              <h3 className="text-xs font-sans font-black uppercase text-[#8c4843] mb-1">
                {currentVolume.id === 'vol-5' ? 'La Resolución' : 'El Clímax / Desenlace'}
              </h3>
              <p className="text-sm leading-relaxed">{currentVolume.climax}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};