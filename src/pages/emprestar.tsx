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
      <Link href="/" className="back-link">← Voltar ao Saguão Principal</Link>

      <div className="page-header">
        <h1>Conceder Empréstimo</h1>
        <p>Autorize a retirada de volumes do acervo encantado</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>

          {/* Leitor */}
          <div className="field">
            <label htmlFor="usuario">Leitor Autorizado</label>
            <select
              id="usuario"
              value={usuarioId}
              onChange={e => { setUsuarioId(e.target.value); setStatus(null); }}
            >
              <option value="">— Selecione um Estudante ou Bruxo —</option>
              {usuarios.map(u => (
                <option key={u.id} value={u.id}>{u.nome} · {u.email}</option>
              ))}
            </select>
          </div>

          {/* Data */}
          <div className="field">
            <label htmlFor="data">Data de Retirada</label>
            <input
              id="data" type="date"
              value={dataEmprestimo}
              onChange={e => setDataEmprestimo(e.target.value)}
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <hr className="divider" />

          {/* Livros */}
          <div className="field" style={{ marginBottom: 0 }}>
            <label>
              Volumes Disponíveis no Acervo
              {livrosSelecionados.length > 0 && (
                <span style={{
                  marginLeft: 10,
                  background: 'rgba(201,168,76,0.2)',
                  color: '#c9a84c',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 10px',
                  borderRadius: 2,
                  border: '1px solid rgba(201,168,76,0.3)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontFamily: "'Cinzel', serif",
                }}>
                  {livrosSelecionados.length} selecionado{livrosSelecionados.length > 1 ? 's' : ''}
                </span>
              )}
            </label>

            {livrosDisponiveis.length === 0 ? (
              <div className="empty-state" style={{ padding: '28px', marginTop: 8 }}>
                <p>Nenhum volume disponível nas prateleiras no momento.</p>
              </div>
            ) : (
              <div className="check-grid" style={{ marginTop: 10 }}>
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
            <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginTop: 22 }}>
              <span>{status.type === 'success' ? '✦' : '⚠'}</span>
              <span>{status.msg}</span>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 26 }}>
            {loading ? 'Registrando nos Pergaminhos...' : '✦ Confirmar Empréstimo'}
          </button>
        </form>
      </div>
    </div>
  );
}