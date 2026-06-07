import { Suspense } from 'react';
import { getWeatherByCity } from '../services/weather';
import SearchBar from '../components/SearchBar';

interface HomeProps {
  searchParams: Promise<{ city?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedParams = await searchParams;
  const cityToSearch = resolvedParams.city || 'Itajubá';
  const weather = await getWeatherByCity(cityToSearch);

  const getGradient = (temp: number) => {
    if (temp > 30) return 'from-rose-900 via-red-950 to-orange-950';
    if (temp > 20) return 'from-orange-950 via-amber-950 to-yellow-950';
    if (temp > 10) return 'from-slate-900 via-blue-950 to-slate-950';
    return 'from-stone-950 via-neutral-900 to-zinc-950';
  };

  const bgGradient = weather ? getGradient(weather.main.temp) : 'from-gray-950 to-black';

  return (
    <main className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-1000 bg-linear-135 ${bgGradient} text-white relative overflow-hidden`}>
      
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/3 rounded-full blur-[140px] pointer-events-none"
        style={{ width: '800px', height: '800px' }}
      ></div>

      <div className="w-full max-w-lg z-10 flex flex-col items-center pb-24">
        <h1 className="text-center text-5xl font-black tracking-widest mb-10 uppercase bg-clip-text text-transparent bg-linear-to-r from-white to-white/60 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          Get Clima
        </h1>
        
        <SearchBar />

        <Suspense fallback={<div className="text-center font-mono tracking-widest text-white/50 animate-pulse mt-10">SINCRONIZANDO SINAIS...</div>}>
          {weather ? (
            <div className="relative w-full group bg-black/30 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-500 hover:shadow-[0_0_80px_rgba(255,255,255,0.05)] hover:border-white/20 hover:-translate-y-1">
              
              <div className="relative flex flex-col items-center">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-4xl font-extrabold tracking-tight">{weather.name}</h2>
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 mb-8">
                  <p className="text-white/60 font-mono text-xs uppercase tracking-[0.2em]">{weather.sys.country}</p>
                </div>
                
                <div className="text-[9rem] leading-none font-black tracking-tighter mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  {Math.round(weather.main.temp)}°
                </div>
                
                <p className="text-xl capitalize mb-10 font-light tracking-wide text-white/60">
                  {weather.weather[0].description}
                </p>
                
                <div className="grid grid-cols-2 gap-6 w-full">
                  <div className="bg-black/40 p-5 rounded-3xl border border-white/5 backdrop-blur-md flex flex-col items-center transform transition-transform hover:scale-105">
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-1 font-mono">Sensação</p>
                    <p className="text-3xl font-bold text-white/90">{Math.round(weather.main.feels_like)}°</p>
                  </div>
                  <div className="bg-black/40 p-5 rounded-3xl border border-white/5 backdrop-blur-md flex flex-col items-center transform transition-transform hover:scale-105">
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-1 font-mono">Umidade</p>
                    <p className="text-3xl font-bold text-white/90">{weather.main.humidity}%</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full text-center bg-red-950/20 p-8 rounded-3xl backdrop-blur-xl border border-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.05)]">
              <p className="font-mono text-red-400 tracking-widest">SINAL PERDIDO. RECALIBRANDO.</p>
            </div>
          )}
        </Suspense>
      </div>
      
      <footer className="absolute bottom-6 font-mono text-white/30 text-xs tracking-[0.2em] uppercase pointer-events-none">
        created by João Passos
      </footer>
    </main>
  );
}