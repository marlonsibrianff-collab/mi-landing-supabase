import Link from 'next/link';
import { Suspense } from 'react';
import { supabase } from './lib/supabase';
import { Fotografia } from './types/database';

// Datos de prueba para desarrollo local cuando el firewall de la empresa bloquee Supabase
const fotosPrueba: Fotografia[] = [
  {
    id: '1',
    created_at: '2026-01-01T00:00:00Z',
    titulo: 'Amanecer Alpino',
    descripcion: 'Captura matutina en los picos Nevados durante la expedición de primavera.',
    categoria: 'naturaleza',
    url_imagen: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    ubicacion: 'Suiza',
    destacado: true,
  },
  {
    id: '2',
    created_at: '2026-01-01T00:00:00Z',
    titulo: 'Luces de Tokio',
    descripcion: 'Fotografía nocturna de larga exposición en el cruce de Shibuya.',
    categoria: 'urbano',
    url_imagen: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
    ubicacion: 'Japón',
    destacado: true,
  },
  {
    id: '3',
    created_at: '2026-01-01T00:00:00Z',
    titulo: 'Mirada en el Tiempo',
    descripcion: 'Retrato conceptual utilizando luz natural de ventana.',
    categoria: 'retratos',
    url_imagen: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    ubicacion: 'España',
    destacado: false,
  },
];

async function GaleriaContent() {
  let fotos: Fotografia[] = [];

  try {
    const { data, error } = await supabase
      .from('fotografias')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      fotos = fotosPrueba;
    } else {
      fotos = data;
    }
  } catch (err) {
    fotos = fotosPrueba;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {fotos.map((foto: Fotografia) => (
        <Link
          key={foto.id}
          href={`/foto/${foto.id}`}
          className="group bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-teal-500 transition"
        >
          <img
            src={foto.url_imagen}
            alt={foto.titulo}
            className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
          />
          <div className="p-4">
            <span className="text-xs uppercase tracking-widest text-teal-400 font-semibold">
              {foto.categoria}
            </span>
            <h3 className="text-lg font-bold mt-1 text-slate-100">{foto.titulo}</h3>
            <p className="text-sm text-slate-400 mt-1 line-clamp-2">{foto.descripcion}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function HomePage() {
  const categorias = ['naturaleza', 'urbano', 'retratos'];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      {/* Hero Section */}
      <section className="py-16 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
          Lumina Photography
        </h1>
        <p className="mt-4 text-lg text-slate-400">
          Explora capturas visuales únicas de todo el mundo. Alimentado en tiempo real con Supabase y Next.js.
        </p>
      </section>

      {/* Categorías */}
      <section className="max-w-6xl mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-4">Categorías</h2>
        <div className="flex gap-4 flex-wrap">
          {categorias.map((cat) => (
            <Link
              key={cat}
              href={`/galeria/${cat}`}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg capitalize transition"
            >
              Ver {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Galería Principal */}
      <section className="max-w-6xl mx-auto pb-20">
        <h2 className="text-2xl font-bold mb-6">Galería Reciente</h2>
        <Suspense fallback={<div className="text-slate-400">Cargando galería...</div>}>
          <GaleriaContent />
        </Suspense>
      </section>
    </main>
  );
}