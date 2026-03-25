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
      <Link href="/" className="back-link">← Voltar ao Saguão Principal</Link>

      <div className="page-header">
        <h1>Registrar Novo Tomo</h1>
        <p>Inscreva um novo volume nos arquivos encantados da biblioteca</p>
      </div>

      <div className="card">
        {/* Decorative corner runes */}
        <div style={{
          position: 'absolute', top: 12, right: 16,
          fontFamily: 'serif', fontSize: 18,
          color: 'rgba(201,168,76,0.15)',
          letterSpacing: 4, pointerEvents: 'none',
          userSelect: 'none',
        }}>
          ᚱ ᚢ ᚾ ᚨ
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="titulo">Título do Volume</label>
            <input
              id="titulo" name="titulo" type="text"
              value={form.titulo} onChange={handleChange}
              placeholder="Ex: Animais Fantásticos e Onde Habitam"
            />
          </div>

          <div className="field">
            <label htmlFor="autor">Autor ou Bruxo Escriba</label>
            <input
              id="autor" name="autor" type="text"
              value={form.autor} onChange={handleChange}
              placeholder="Ex: Newt Scamander"
            />
          </div>

          <div className="field">
            <label htmlFor="genero">Categoria Mágica</label>
            <input
              id="genero" name="genero" type="text"
              value={form.genero} onChange={handleChange}
              placeholder="Ex: Criaturas Mágicas, Poções, Feitiços..."
            />
          </div>

          <div className="field">
            <label htmlFor="quantidade">Cópias no Acervo</label>
            <input
              id="quantidade" name="quantidade" type="number"
              value={form.quantidade} onChange={handleChange}
              placeholder="Ex: 5" min={1}
            />
            <p className="helper-text">Número de exemplares físicos disponíveis nas prateleiras</p>
          </div>

          {status && (
            <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              <span>{status.type === 'success' ? '✦' : '⚠'}</span>
              <span>{status.msg}</span>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Inscrevendo nos Arquivos...' : '✦ Registrar Volume'}
          </button>
        </form>
      </div>
    </div>
  );
}