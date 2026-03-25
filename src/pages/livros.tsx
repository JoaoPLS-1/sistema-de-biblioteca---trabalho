import { useState } from 'react';
import Link from 'next/link';

export default function Livros() {
  const [form, setForm] = useState({ titulo: '', autor: '', genero: '', quantidade: '' });
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    if (!form.titulo || !form.autor || !form.genero || !form.quantidade) {
      setStatus({ type: 'error', msg: 'Todos os campos são obrigatórios.' });
      return;
    }
    const qtd = Number(form.quantidade);
    if (!Number.isInteger(qtd) || qtd <= 0) {
      setStatus({ type: 'error', msg: 'A quantidade deve ser um número inteiro positivo.' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/create/livros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, quantidade: qtd }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', msg: data.mensagem });
        setForm({ titulo: '', autor: '', genero: '', quantidade: '' });
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
        <h1>Cadastrar Livro</h1>
        <p>Adicione um novo título ao acervo da biblioteca</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="titulo">Título</label>
            <input
              id="titulo" name="titulo" type="text"
              value={form.titulo} onChange={handleChange}
              placeholder="Ex: Dom Casmurro"
            />
          </div>

          <div className="field">
            <label htmlFor="autor">Autor</label>
            <input
              id="autor" name="autor" type="text"
              value={form.autor} onChange={handleChange}
              placeholder="Ex: Machado de Assis"
            />
          </div>

          <div className="field">
            <label htmlFor="genero">Gênero</label>
            <input
              id="genero" name="genero" type="text"
              value={form.genero} onChange={handleChange}
              placeholder="Ex: Romance"
            />
          </div>

          <div className="field">
            <label htmlFor="quantidade">Quantidade em estoque</label>
            <input
              id="quantidade" name="quantidade" type="number"
              value={form.quantidade} onChange={handleChange}
              placeholder="Ex: 5" min={1}
            />
            <p className="helper-text">Número de cópias físicas disponíveis</p>
          </div>

          {status && (
            <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              <span>{status.type === 'success' ? '✓' : '!'}</span>
              <span>{status.msg}</span>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar Livro'}
          </button>
        </form>
      </div>
    </div>
  );
}
