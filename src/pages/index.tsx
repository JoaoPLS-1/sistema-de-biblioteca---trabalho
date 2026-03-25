import Link from 'next/link';

const pages = [
  {
    href: '/usuarios',
    icon: '🪄',
    label: 'Cadastrar Usuário',
    desc: 'Registrar um novo leitor nos pergaminhos da biblioteca',
    color: 'rgba(116,0,1,0.25)',
    borderColor: 'rgba(211,70,37,0.3)',
    house: 'Grifinória',
  },
  {
    href: '/livros',
    icon: '📜',
    label: 'Cadastrar Livro',
    desc: 'Adicionar um novo tomo ao acervo encantado',
    color: 'rgba(26,60,100,0.25)',
    borderColor: 'rgba(60,120,200,0.3)',
    house: 'Corvinal',
  },
  {
    href: '/emprestar',
    icon: '🔮',
    label: 'Realizar Empréstimo',
    desc: 'Conceder um grimório a um estudante de magia',
    color: 'rgba(26,80,46,0.25)',
    borderColor: 'rgba(60,160,100,0.3)',
    house: 'Sonserina',
  },
  {
    href: '/devolver',
    icon: '⚗️',
    label: 'Realizar Devolução',
    desc: 'Retornar os volumes às prateleiras da masmorra',
    color: 'rgba(80,50,10,0.25)',
    borderColor: 'rgba(180,140,40,0.35)',
    house: 'Lufa-Lufa',
  },
];

export default function Home() {
  return (
    <div className="page-wrapper-wide">

      {/* ── Header ── */}
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        {/* Decorative top rule */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          marginBottom: 36, justifyContent: 'center',
        }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4))' }} />
          <span style={{ color: 'rgba(201,168,76,0.5)', fontSize: 16 }}>✦ ✦ ✦</span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(201,168,76,0.4), transparent)' }} />
        </div>

        {/* Crest */}
        <div style={{
          width: 88, height: 88,
          margin: '0 auto 24px',
          background: 'linear-gradient(145deg, #2a1a08 0%, #1a1008 100%)',
          border: '1px solid rgba(201,168,76,0.4)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 40,
          boxShadow: '0 0 40px rgba(201,168,76,0.15), 0 4px 20px rgba(0,0,0,0.6)',
        }}>
          📖
        </div>

        <h1 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 38,
          color: '#c9a84c',
          textShadow: '0 0 40px rgba(201,168,76,0.3), 0 2px 4px rgba(0,0,0,0.6)',
          letterSpacing: '0.06em',
          marginBottom: 12,
        }}>
          Biblioteca de Hogwarts
        </h1>

        <p style={{
          fontFamily: "'IM Fell English', serif",
          fontStyle: 'italic',
          color: 'rgba(138,106,66,0.9)',
          fontSize: 16,
          letterSpacing: '0.03em',
        }}>
          Secção Restrita — Acesso Autorizado Somente
        </p>

        {/* Bottom rule */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          marginTop: 28, justifyContent: 'center',
        }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.25))' }} />
          <span style={{ color: 'rgba(201,168,76,0.3)', fontSize: 12 }}>✦</span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(201,168,76,0.25), transparent)' }} />
        </div>
      </div>

      {/* ── Grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 18,
      }}>
        {pages.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            style={{
              display: 'block',
              background: `linear-gradient(145deg, #231a08 0%, #1a1208 100%)`,
              border: `1px solid ${p.borderColor}`,
              borderRadius: 4,
              padding: '28px',
              textDecoration: 'none',
              color: 'inherit',
              boxShadow: `0 2px 12px rgba(0,0,0,0.5), inset 0 1px 0 ${p.borderColor}`,
              transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(-3px)';
              el.style.boxShadow = `0 8px 28px rgba(0,0,0,0.6), 0 0 24px ${p.color}, inset 0 1px 0 ${p.borderColor}`;
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(0)';
              el.style.boxShadow = `0 2px 12px rgba(0,0,0,0.5), inset 0 1px 0 ${p.borderColor}`;
            }}
          >
            {/* Top accent line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${p.borderColor}, transparent)`,
            }} />

            {/* Icon */}
            <div style={{
              width: 56, height: 56,
              background: p.color,
              border: `1px solid ${p.borderColor}`,
              borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, marginBottom: 20,
              boxShadow: `0 0 20px ${p.color}`,
            }}>
              {p.icon}
            </div>

            <div style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 16,
              fontWeight: 600,
              color: '#c9a84c',
              letterSpacing: '0.05em',
              marginBottom: 8,
            }}>
              {p.label}
            </div>

            <div style={{
              fontFamily: "'IM Fell English', serif",
              fontStyle: 'italic',
              color: 'rgba(138,106,66,0.8)',
              fontSize: 14,
              lineHeight: 1.6,
              marginBottom: 20,
            }}>
              {p.desc}
            </div>

            <div style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 11,
              color: 'rgba(201,168,76,0.6)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Acessar Seção →
            </div>
          </Link>
        ))}
      </div>

      {/* ── Footer ── */}
      <div style={{ textAlign: 'center', marginTop: 64 }}>
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)', marginBottom: 20 }} />
        <p style={{
          fontFamily: "'IM Fell English', serif",
          fontStyle: 'italic',
          fontSize: 13,
          color: 'rgba(138,106,66,0.5)',
          letterSpacing: '0.04em',
        }}>
          Sistema de Gestão — Biblioteca de Hogwarts · Est. 990 d.C.
        </p>
      </div>
    </div>
  );
}