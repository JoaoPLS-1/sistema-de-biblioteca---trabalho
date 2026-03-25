import { useState } from 'react';
import Link from 'next/link';

export default function Usuarios() {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '' });
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    if (!form.nome || !form.email || !form.telefone) {
      setStatus({ type: 'error', msg: 'Todos os campos são obrigatórios.' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/create/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', msg: data.mensagem });
        setForm({ nome: '', email: '', telefone: '' });
      } else {
        setStatus({ type: 'error', msg: data.mensagem });
      }
    } catch {
      setStatus({ type: 'error', msg: 'Erro ao conectar com o servidor.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-wrapper">
      <Link href="/" className="back-link">← Voltar ao menu</Link>

      <div className="page-header">
        <h1>Cadastrar Usuário</h1>
        <p>Adicione um novo leitor ao sistema da biblioteca</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="nome">Nome completo</label>
            <input
              id="nome" name="nome" type="text"
              value={form.nome} onChange={handleChange}
              placeholder="Ex: Ana Souza"
            />
          </div>

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email" name="email" type="email"
              value={form.email} onChange={handleChange}
              placeholder="Ex: ana@email.com"
            />
          </div>

          <div className="field">
            <label htmlFor="telefone">Telefone</label>
            <input
              id="telefone" name="telefone" type="text"
              value={form.telefone} onChange={handleChange}
              placeholder="Ex: (11) 98888-0000"
            />
          </div>

          {status && (
            <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              <span>{status.type === 'success' ? '✓' : '!'}</span>
              <span>{status.msg}</span>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar Usuário'}
          </button>
        </form>
      </div>
    </div>
  );
}
