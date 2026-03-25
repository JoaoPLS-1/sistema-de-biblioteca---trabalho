import { useState, useEffect } from 'react';
import Link from 'next/link';

type Usuario = { id: string; nome: string; email: string };
type Livro = { id: string; titulo: string; autor: string; genero: string; quantidade: number; qtdEmprestados: number };

export default function Emprestar() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [usuarioId, setUsuarioId] = useState('');
  const [livrosSelecionados, setLivrosSelecionados] = useState<string[]>([]);
  const [dataEmprestimo, setDataEmprestimo] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  function carregarDados() {
    fetch('/api/list/usuarios').then(r => r.json()).then(d => setUsuarios(d.usuarios || []));
    fetch('/api/list/livros').then(r => r.json()).then(d => setLivros(d.livros || []));
  }

  useEffect(() => { carregarDados(); }, []);

  function toggleLivro(id: string) {
    setStatus(null);
    setLivrosSelecionados(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    if (!usuarioId) { setStatus({ type: 'error', msg: 'Selecione um usuário.' }); return; }
    if (livrosSelecionados.length === 0) { setStatus({ type: 'error', msg: 'Selecione ao menos um livro.' }); return; }
    if (!dataEmprestimo) { setStatus({ type: 'error', msg: 'Informe a data do empréstimo.' }); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/emprestar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId, livrosIds: livrosSelecionados, dataEmprestimo }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', msg: data.mensagem });
        setUsuarioId('');
        setLivrosSelecionados([]);
        carregarDados();
      } else {
        setStatus({ type: 'error', msg: data.mensagem });
      }
    } catch {
      setStatus({ type: 'error', msg: 'Erro ao conectar com o servidor.' });
    } finally {
      setLoading(false);
    }
  }

  const livrosDisponiveis = livros.filter(l => l.quantidade > l.qtdEmprestados);

  return (
    <div className="page-wrapper">
      <Link href="/" className="back-link">← Voltar ao menu</Link>

      <div className="page-header">
        <h1>Realizar Empréstimo</h1>
        <p>Selecione o usuário e os livros para o empréstimo</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>

          {/* Usuário */}
          <div className="field">
            <label htmlFor="usuario">Usuário</label>
            <select
              id="usuario"
              value={usuarioId}
              onChange={e => { setUsuarioId(e.target.value); setStatus(null); }}
            >
              <option value="">— Selecione um usuário —</option>
              {usuarios.map(u => (
                <option key={u.id} value={u.id}>{u.nome} · {u.email}</option>
              ))}
            </select>
          </div>

          {/* Data */}
          <div className="field">
            <label htmlFor="data">Data do Empréstimo</label>
            <input
              id="data" type="date"
              value={dataEmprestimo}
              onChange={e => setDataEmprestimo(e.target.value)}
            />
          </div>

          <hr className="divider" />

          {/* Livros */}
          <div className="field" style={{ marginBottom: 0 }}>
            <label>
              Livros Disponíveis
              {livrosSelecionados.length > 0 && (
                <span style={{
                  marginLeft: 8, background: 'var(--accent)', color: '#fff',
                  fontSize: 11, fontWeight: 700, padding: '2px 8px',
                  borderRadius: 99, textTransform: 'none', letterSpacing: 0,
                }}>
                  {livrosSelecionados.length} selecionado{livrosSelecionados.length > 1 ? 's' : ''}
                </span>
              )}
            </label>

            {livrosDisponiveis.length === 0 ? (
              <div className="empty-state" style={{ padding: '24px', textAlign: 'center', marginTop: 8 }}>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                  Nenhum livro disponível no momento.
                </p>
              </div>
            ) : (
              <div className="check-grid" style={{ marginTop: 8 }}>
                {livrosDisponiveis.map(l => {
                  const checked = livrosSelecionados.includes(l.id);
                  const disponiveis = l.quantidade - l.qtdEmprestados;
                  return (
                    <label
                      key={l.id}
                      className={`check-card ${checked ? 'checked' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleLivro(l.id)}
                      />
                      <div className="check-card-body">
                        <div className="check-card-title">{l.titulo}</div>
                        <div className="check-card-sub">
                          {l.autor} · {l.genero}
                          <span className="badge badge-available" style={{ marginLeft: 8 }}>
                            {disponiveis} disponíve{disponiveis === 1 ? 'l' : 'is'}
                          </span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {status && (
            <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginTop: 20 }}>
              <span>{status.type === 'success' ? '✓' : '!'}</span>
              <span>{status.msg}</span>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 24 }}>
            {loading ? 'Processando...' : 'Confirmar Empréstimo'}
          </button>
        </form>
      </div>
    </div>
  );
}
