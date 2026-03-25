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
      <Link href="/" className="back-link">← Voltar ao Saguão Principal</Link>

      <div className="page-header">
        <h1>Inscrever Novo Leitor</h1>
        <p>Registre um estudante ou bruxo nos pergaminhos da biblioteca</p>
      </div>

      <div className="card">
        {/* Decorative rune top-right */}
        <div style={{
          position: 'absolute', top: 12, right: 16,
          fontFamily: 'serif', fontSize: 18,
          color: 'rgba(201,168,76,0.15)',
          letterSpacing: 4, pointerEvents: 'none',
          userSelect: 'none',
        }}>
          ᚹ ᛁ ᛉ
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="nome">Nome Completo</label>
            <input
              id="nome" name="nome" type="text"
              value={form.nome} onChange={handleChange}
              placeholder="Ex: Hermione Granger"
            />
          </div>

          <div className="field">
            <label htmlFor="email">Coruja — Endereço de Correspondência</label>
            <input
              id="email" name="email" type="email"
              value={form.email} onChange={handleChange}
              placeholder="Ex: hermione@hogwarts.co.uk"
            />
          </div>

          <div className="field">
            <label htmlFor="telefone">Número de Contato</label>
            <input
              id="telefone" name="telefone" type="text"
              value={form.telefone} onChange={handleChange}
              placeholder="Ex: (11) 98888-0000"
            />
          </div>

          {status && (
            <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              <span>{status.type === 'success' ? '✦' : '⚠'}</span>
              <span>{status.msg}</span>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Inscrevendo nos Pergaminhos...' : '✦ Registrar Leitor'}
          </button>
        </form>
      </div>
    </div>
  );
}