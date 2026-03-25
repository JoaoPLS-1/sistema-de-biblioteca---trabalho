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
      <Link href="/" className="back-link">← Voltar ao menu</Link>

      <div className="page-header">
        <h1>Realizar Devolução</h1>
        <p>Selecione o empréstimo e os livros que estão sendo devolvidos</p>
      </div>

      {emprestimos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <p>Nenhum empréstimo ativo no momento.</p>
          <p style={{ fontSize: 13, marginTop: 8 }}>
            <Link href="/emprestar" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              Realizar um empréstimo →
            </Link>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: emprestimoSelecionado ? '1fr 1fr' : '1fr', gap: 16 }}>

            {/* Lista de empréstimos ativos */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                Empréstimos Ativos
              </p>
              <div className="check-grid">
                {emprestimos.map(emp => {
                  const selected = emprestimoId === emp.id;
                  return (
                    <div
                      key={emp.id}
                      onClick={() => handleSelectEmprestimo(emp.id)}
                      style={{
                        padding: '14px 16px',
                        background: selected ? 'var(--accent-light)' : 'var(--bg-card)',
                        border: `1.5px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        transition: 'all 0.12s',
                        boxShadow: selected ? '0 0 0 2px rgba(124,79,36,0.12)' : 'var(--shadow-sm)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
                          {getNomeUsuario(emp.usuarioId)}
                        </span>
                        <span className="badge badge-active">ativo</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                        Retirada: {emp.dataEmprestimo}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {emp.livrosIds.length} livro{emp.livrosIds.length > 1 ? 's' : ''}:{' '}
                        {emp.livrosIds.slice(0, 2).map(id => getNomeLivro(id)).join(', ')}
                        {emp.livrosIds.length > 2 ? ` +${emp.livrosIds.length - 2}` : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Painel de devolução */}
            {emprestimoSelecionado && (
              <div className="card" style={{ alignSelf: 'flex-start' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
                  Livros para Devolver
                </p>
                <div className="check-grid" style={{ marginBottom: 16 }}>
                  {emprestimoSelecionado.livrosIds.map(livroId => {
                    const checked = livrosSelecionados.includes(livroId);
                    return (
                      <label
                        key={livroId}
                        className={`check-card ${checked ? 'checked' : ''}`}
                        style={checked ? { borderColor: '#2d7a4f', background: '#edfaf0' } : {}}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleLivro(livroId)}
                          style={{ accentColor: '#2d7a4f' }}
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
                  <p className="helper-text" style={{ marginBottom: 12, color: '#2d7a4f', fontWeight: 500 }}>
                    ✓ Todos os livros selecionados — empréstimo será concluído
                  </p>
                )}

                {status && (
                  <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                    <span>{status.type === 'success' ? '✓' : '!'}</span>
                    <span>{status.msg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary btn-success"
                  disabled={loading || livrosSelecionados.length === 0}
                >
                  {loading ? 'Processando...' : 'Confirmar Devolução'}
                </button>
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
