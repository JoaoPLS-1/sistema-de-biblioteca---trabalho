import Link from 'next/link';

const pages = [
  {
    href: '/usuarios',
    icon: '👤',
    label: 'Cadastrar Usuário',
    desc: 'Adicionar um novo leitor ao sistema',
    color: '#f0e8dc',
  },
  {
    href: '/livros',
    icon: '📚',
    label: 'Cadastrar Livro',
    desc: 'Registrar um novo título no acervo',
    color: '#e8f0dc',
  },
  {
    href: '/emprestar',
    icon: '🔖',
    label: 'Realizar Empréstimo',
    desc: 'Emprestar livros para um usuário',
    color: '#dce8f0',
  },
  {
    href: '/devolver',
    icon: '↩️',
    label: 'Realizar Devolução',
    desc: 'Registrar a devolução de livros',
    color: '#ecdcf0',
  },
];

export default function Home() {
  return (
    <div className="page-wrapper-wide">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>📖</div>
        <h1 style={{ fontSize: 36, marginBottom: 10 }}>Sistema de Biblioteca</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
          Gerencie usuários, acervo, empréstimos e devoluções
        </p>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 16,
      }}>
        {pages.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            style={{
              display: 'block',
              background: 'var(--bg-card)',
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '24px',
              textDecoration: 'none',
              color: 'inherit',
              boxShadow: 'var(--shadow-sm)',
              transition: 'box-shadow 0.18s, transform 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.borderColor = '#c4a882';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
            }}
          >
            <div style={{
              width: 52, height: 52,
              background: p.color,
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, marginBottom: 16,
            }}>
              {p.icon}
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
              {p.label}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>
              {p.desc}
            </div>
            <div style={{ marginTop: 16, color: 'var(--accent)', fontSize: 13, fontWeight: 600 }}>
              Acessar →
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <p style={{ textAlign: 'center', marginTop: 48, fontSize: 13, color: 'var(--text-muted)' }}>
        Sistema de Gestão de Biblioteca
      </p>
    </div>
  );
}
