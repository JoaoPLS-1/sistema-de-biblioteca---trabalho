import { useState, useEffect } from 'react';
import Link from 'next/link';

type Livro = { id: string; titulo: string; autor: string };
type Emprestimo = { id: string; usuarioId: string; livrosIds: string[]; dataEmprestimo: string; status: string };
type Usuario = { id: string; nome: string };

export default function Devolver() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [emprestimoId, setEmprestimoId] = useState('');
  const [livrosSelecionados, setLivrosSelecionados] = useState<string[]>([]);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function carregarDados() {
    const [resE, resL, resU] = await Promise.all([
      fetch('/api/list/emprestimos').then(r => r.json()),
      fetch('/api/list/livros').then(r => r.json()),
      fetch('/api/list/usuarios').then(r => r.json()),
    ]);
    setEmprestimos((resE.emprestimos || []).filter((e: Emprestimo) => e.status === 'ativo'));
    setLivros(resL.livros || []);
    setUsuarios(resU.usuarios || []);
  }

  useEffect(() => { carregarDados(); }, []);

  const emprestimoSelecionado = emprestimos.find(e => e.id === emprestimoId);

  function toggleLivro(id: string) {
    setStatus(null);
    setLivrosSelecionados(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  function handleSelectEmprestimo(id: string) {
    setEmprestimoId(id);
    setLivrosSelecionados([]);
    setStatus(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    if (!emprestimoId) { setStatus({ type: 'error', msg: 'Selecione um empréstimo.' }); return; }
    if (livrosSelecionados.length === 0) { setStatus({ type: 'error', msg: 'Selecione ao menos um livro para devolver.' }); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/devolver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emprestimoId, livrosIds: livrosSelecionados }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', msg: data.mensagem });
        setEmprestimoId('');
        setLivrosSelecionados([]);
        await carregarDados();
      } else {
        setStatus({ type: 'error', msg: data.mensagem });
      }
    } catch {
      setStatus({ type: 'error', msg: 'Erro ao conectar com o servidor.' });
    } finally {
      setLoading(false);
    }
  }

  function getNomeLivro(id: string) {
    const l = livros.find(l => l.id === id);
    return l ? l.titulo : id;
  }

  function getAutorLivro(id: string) {
    const l = livros.find(l => l.id === id);
    return l?.autor || '';
  }

  function getNomeUsuario(id: string) {
    const u = usuarios.find(u => u.id === id);
    return u?.nome || id;
  }

  return (
    <div className="page-wrapper-wide">
      <Link href="/" className="back-link">← Voltar ao Saguão Principal</Link>

      <div className="page-header">
        <h1>Registrar Devolução</h1>
        <p>Selecione o empréstimo e os volumes a serem recolhidos às prateleiras</p>
      </div>

      {emprestimos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <p>Nenhum empréstimo ativo nos registros da biblioteca.</p>
          <p style={{ fontSize: 13.5, marginTop: 10, fontFamily: "'IM Fell English', serif", fontStyle: 'italic' }}>
            <Link href="/emprestar" style={{ color: 'rgba(201,168,76,0.8)', textDecoration: 'none' }}>
              Conceder um novo empréstimo →
            </Link>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: emprestimoSelecionado ? '1fr 1fr' : '1fr',
            gap: 18,
            alignItems: 'flex-start',
          }}>

            {/* ── Empréstimos Ativos ── */}
            <div>
              <p style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 10.5,
                fontWeight: 700,
                color: 'rgba(201,168,76,0.7)',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                marginBottom: 12,
              }}>
                Empréstimos em Aberto
              </p>
              <div className="check-grid">
                {emprestimos.map(emp => {
                  const selected = emprestimoId === emp.id;
                  return (
                    <div
                      key={emp.id}
                      onClick={() => handleSelectEmprestimo(emp.id)}
                      style={{
                        padding: '16px 18px',
                        background: selected
                          ? 'linear-gradient(145deg, rgba(201,168,76,0.1) 0%, rgba(201,168,76,0.06) 100%)'
                          : 'rgba(245,234,214,0.03)',
                        border: `1px solid ${selected ? 'rgba(201,168,76,0.6)' : 'rgba(201,168,76,0.15)'}`,
                        borderRadius: 3,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        boxShadow: selected ? '0 0 16px rgba(201,168,76,0.08)' : 'none',
                      }}
                      onMouseEnter={e => {
                        if (!selected) {
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.4)';
                          (e.currentTarget as HTMLElement).style.background = 'rgba(245,234,214,0.05)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!selected) {
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.15)';
                          (e.currentTarget as HTMLElement).style.background = 'rgba(245,234,214,0.03)';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 7 }}>
                        <span style={{
                          fontFamily: "'Crimson Text', serif",
                          fontWeight: 600,
                          fontSize: 15,
                          color: selected ? '#c9a84c' : '#d4b896',
                        }}>
                          {getNomeUsuario(emp.usuarioId)}
                        </span>
                        <span className="badge badge-active">ativo</span>
                      </div>
                      <div style={{
                        fontFamily: "'IM Fell English', serif",
                        fontStyle: 'italic',
                        fontSize: 12.5,
                        color: 'rgba(138,106,66,0.7)',
                        marginBottom: 5,
                      }}>
                        Retirada: {emp.dataEmprestimo}
                      </div>
                      <div style={{
                        fontFamily: "'Crimson Text', serif",
                        fontSize: 13,
                        color: 'rgba(212,184,150,0.7)',
                      }}>
                        {emp.livrosIds.length} volume{emp.livrosIds.length > 1 ? 's' : ''}:{' '}
                        {emp.livrosIds.slice(0, 2).map(id => getNomeLivro(id)).join(', ')}
                        {emp.livrosIds.length > 2 ? ` +${emp.livrosIds.length - 2}` : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Painel de devolução ── */}
            {emprestimoSelecionado && (
              <div className="card" style={{ alignSelf: 'flex-start' }}>
                <p style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: 'rgba(201,168,76,0.7)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  marginBottom: 14,
                }}>
                  Volumes a Recolher
                </p>
                <div className="check-grid" style={{ marginBottom: 18 }}>
                  {emprestimoSelecionado.livrosIds.map(livroId => {
                    const checked = livrosSelecionados.includes(livroId);
                    return (
                      <label
                        key={livroId}
                        className={`check-card ${checked ? 'checked' : ''}`}
                        style={checked ? {
                          borderColor: 'rgba(142,212,168,0.55)',
                          background: 'rgba(26,92,54,0.15)',
                        } : {}}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleLivro(livroId)}
                          style={{ accentColor: '#8ed4a8' }}
                        />
                        <div className="check-card-body">
                          <div className="check-card-title">{getNomeLivro(livroId)}</div>
                          <div className="check-card-sub">{getAutorLivro(livroId)}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {livrosSelecionados.length === emprestimoSelecionado.livrosIds.length && (
                  <p style={{
                    fontFamily: "'IM Fell English', serif",
                    fontStyle: 'italic',
                    fontSize: 13.5,
                    color: '#8ed4a8',
                    marginBottom: 14,
                    padding: '10px 14px',
                    background: 'rgba(26,92,54,0.2)',
                    border: '1px solid rgba(142,212,168,0.2)',
                    borderRadius: 3,
                  }}>
                    ✦ Todos os volumes selecionados — empréstimo será encerrado
                  </p>
                )}

                {status && (
                  <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                    <span>{status.type === 'success' ? '✦' : '⚠'}</span>
                    <span>{status.msg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary btn-success"
                  disabled={loading || livrosSelecionados.length === 0}
                >
                  {loading ? 'Processando Devolução...' : '✦ Confirmar Devolução'}
                </button>
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
}