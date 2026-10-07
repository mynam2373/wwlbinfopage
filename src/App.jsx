import { useEffect, useRef, useState } from 'react';
import { TheaterLayout } from './comp/puppets/TheaterLayout';
import { HomeView } from './view/HomeView';
import { VesteriaMap } from './comp/map/VesteriaMap';

import { CharactersPage } from './pages/CharactersPage';
import { GamesPage } from './pages/GamesPage';
import { NovelView } from './view/NovelView';
import { HEART_PROGRESS_STORAGE_KEY, HEART_SHARDS } from './data/heartShards';

const SECRET_WORD = 'elizabeth';

const readCollectedShardIds = () => {
  if (typeof window === 'undefined') return [];

  try {
    const savedIds = JSON.parse(window.localStorage.getItem(HEART_PROGRESS_STORAGE_KEY) || '[]');
    const validIds = new Set(HEART_SHARDS.map((shard) => shard.id));
    return Array.isArray(savedIds) ? savedIds.filter((id) => validIds.has(id)) : [];
  } catch {
    return [];
  }
};


export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [collectedShardIds, setCollectedShardIds] = useState(readCollectedShardIds);
  const typedWord = useRef('');

  useEffect(() => {
    try {
      window.localStorage.setItem(HEART_PROGRESS_STORAGE_KEY, JSON.stringify(collectedShardIds));
    } catch {
      // Keep the current session usable when browser storage is unavailable.
    }
  }, [collectedShardIds]);

  useEffect(() => {
    if (activeTab !== 'inicio') {
      typedWord.current = '';
      return undefined;
    }

    const handleSecretWord = (event) => {
      const target = event.target;
      const isTextEntry = target instanceof HTMLElement && (
        target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      );

      if (isTextEntry || event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1 || !/[a-z]/i.test(event.key)) {
        typedWord.current = '';
        return;
      }

      typedWord.current = `${typedWord.current}${event.key.toLowerCase()}`.slice(-SECRET_WORD.length);

      if (typedWord.current === SECRET_WORD) {
        setCollectedShardIds(HEART_SHARDS.map((shard) => shard.id));
        typedWord.current = '';
      }
    };

    window.addEventListener('keydown', handleSecretWord);
    return () => {
      window.removeEventListener('keydown', handleSecretWord);
      typedWord.current = '';
    };
  }, [activeTab]);

  const handleCollectShard = (shardId) => {
    setCollectedShardIds((currentIds) => (
      currentIds.includes(shardId) ? currentIds : [...currentIds, shardId]
    ));
  };

  // Función para manejar cuando hacés doble clic o clic en la ficha flotante
  const handleNavigateToCharacter = (charId) => {
    setSelectedEntity(null); // Cerramos el emergente flotante
    setActiveTab('personajes'); // Cambiamos a la pestaña de personajes
    // Si querés, podés pasar el ID seleccionado a CharacterView vía props si querés enfocar a ese personaje
  };

  return (
    <TheaterLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      collectedShardIds={collectedShardIds}
    >
      {/* 1. INICIO */}
      {activeTab === 'inicio' && (
        <div className="flex flex-col items-center justify-between min-h-[85vh] w-full px-4 py-2">
          
          {/* Cartel principal / Título */}
          <HomeView />

          {/* Un solo Mapa en el centro */}
          <div className="w-full flex justify-center my-2">
            <VesteriaMap 
              onSelectPoint={(point) => setSelectedEntity(point)} 
            />
          </div>

          {/* Ficha Flotante al seleccionar en Inicio */}
          {selectedEntity && (
            <div className="fixed bottom-6 right-6 bg-[#fdf6e3] border-3 border-[#3d291a] p-3 rounded-lg shadow-[4px_4px_0px_#3d291a] z-50 text-[#3d291a] max-w-xs">
              <div className="flex justify-between items-center gap-4">
                <span className="font-black text-xs uppercase">
                  {selectedEntity.name || selectedEntity.title}
                </span>
                <button 
                  onClick={() => setSelectedEntity(null)}
                  className="text-xs font-bold px-1.5 py-0.5 hover:bg-[#e5be82] rounded border border-[#3d291a]"
                >
                  ✕
                </button>
              </div>
              
              {selectedEntity.role && (
                <p className="text-[10px] text-[#6b4f38] font-bold mt-1">
                  Rol: {selectedEntity.role}
                </p>
              )}

              {/* Botón para ir directo a la ficha en la sección de Personajes */}
              {selectedEntity.characterId && (
                <button
                  onClick={() => handleNavigateToCharacter(selectedEntity.characterId)}
                  className="mt-2 w-full text-[10px] font-black uppercase bg-[#3d291a] text-[#fdf6e3] py-1 px-2 rounded hover:bg-[#553c2a] transition-colors"
                >
                  Ver Ficha Completa →
                </button>
              )}
            </div>
          )}

        </div>
      )}

      {/* 2. NOVELA */}
      {activeTab === 'novela' && (
        <div className="w-full px-4 py-6">
          <NovelView />
        </div>
      )}

      {/* 3. PERSONAJES */}
      {activeTab === 'personajes' && (
        <div className="w-full px-4 py-6">
          <CharactersPage
            collectedShardIds={collectedShardIds}
            onCollectShard={handleCollectShard}
          />
        </div>
      )}

      {/* 4. MINIJUEGOS */}
      {activeTab === 'minijuegos' && (
        <div className="w-full px-4 py-6">
          <GamesPage />
        </div>
      )}

    </TheaterLayout>
  );
}