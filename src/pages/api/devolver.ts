import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'pages', 'api', 'bd.json');

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ mensagem: 'Método não permitido.' });
    }

    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(jsonData);
    const livros = parsed.livros || [];
    const emprestimos = parsed.emprestimos || [];

    const { emprestimoId, livrosIds } = req.body;

    if (!emprestimoId || !livrosIds) {
        return res.status(400).json({ mensagem: 'emprestimoId e livrosIds são obrigatórios.' });
    }

    if (!Array.isArray(livrosIds) || livrosIds.length === 0) {
        return res.status(400).json({ mensagem: 'livrosIds deve ser um array não vazio.' });
    }

    // 1. Localizar empréstimo ativo
    const emprestimo = emprestimos.find((e) => e.id === emprestimoId);
    if (!emprestimo) {
        return res.status(404).json({ mensagem: 'Empréstimo não encontrado.' });
    }
    if (emprestimo.status !== 'ativo') {
        return res.status(400).json({ mensagem: 'Este empréstimo já foi concluído.' });
    }

    // 2. Validar que cada livro pertence ao empréstimo
    for (const livroId of livrosIds) {
        if (!emprestimo.livrosIds.includes(livroId)) {
            return res.status(400).json({ mensagem: `Livro '${livroId}' não pertence a este empréstimo.` });
        }
    }

    // 3. Decrementar qtdEmprestados
    const livrosAtualizados = livros.map((livro) => {
        if (livrosIds.includes(livro.id)) {
            return { ...livro, qtdEmprestados: Math.max(0, livro.qtdEmprestados - 1) };
        }
        return livro;
    });

    // 4. Verificar se todos os livros do empréstimo foram devolvidos
    // Consideramos devolvidos: os livros que já constavam fora deste empréstimo + os que estão sendo devolvidos agora
    // Como não rastreamos devoluções parciais, verificamos se livrosIds cobre todos os livrosIds do empréstimo
    const todosDevolvidos = emprestimo.livrosIds.every((id) => livrosIds.includes(id));

    const emprestimosAtualizados = emprestimos.map((e) => {
        if (e.id === emprestimoId) {
            if (todosDevolvidos) {
                return {
                    ...e,
                    status: 'concluído',
                    dataDevolucao: new Date().toISOString().split('T')[0],
                };
            }
            return e;
        }
        return e;
    });

    fs.writeFileSync(
        filePath,
        JSON.stringify({ ...parsed, livros: livrosAtualizados, emprestimos: emprestimosAtualizados }, null, 2)
    );

    const mensagem = todosDevolvidos
        ? 'Devolução concluída. Empréstimo finalizado.'
        : 'Livros devolvidos parcialmente.';

    return res.status(200).json({ mensagem });
}
