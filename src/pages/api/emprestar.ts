import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const filePath = path.join(process.cwd(), 'src', 'pages', 'api', 'bd.json');

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ mensagem: 'Método não permitido.' });
    }

    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(jsonData);
    const usuarios = parsed.usuarios || [];
    const livros = parsed.livros || [];
    const emprestimos = parsed.emprestimos || [];

    const { usuarioId, livrosIds, dataEmprestimo } = req.body;

    if (!usuarioId || !livrosIds || !dataEmprestimo) {
        return res.status(400).json({ mensagem: 'usuarioId, livrosIds e dataEmprestimo são obrigatórios.' });
    }

    if (!Array.isArray(livrosIds) || livrosIds.length === 0) {
        return res.status(400).json({ mensagem: 'livrosIds deve ser um array não vazio.' });
    }

    // 1. Verificar usuário
    const usuarioExiste = usuarios.some((u) => u.id === usuarioId);
    if (!usuarioExiste) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    // 2. Verificar se todos os livros existem
    for (const livroId of livrosIds) {
        const livro = livros.find((l) => l.id === livroId);
        if (!livro) {
            return res.status(404).json({ mensagem: `Livro com id '${livroId}' não encontrado.` });
        }
    }

    // 3. Verificar disponibilidade
    for (const livroId of livrosIds) {
        const livro = livros.find((l) => l.id === livroId);
        if (livro.quantidade <= livro.qtdEmprestados) {
            return res.status(400).json({ mensagem: `Livro '${livro.titulo}' não está disponível para empréstimo.` });
        }
    }

    // 4. Incrementar qtdEmprestados
    const livrosAtualizados = livros.map((livro) => {
        if (livrosIds.includes(livro.id)) {
            return { ...livro, qtdEmprestados: livro.qtdEmprestados + 1 };
        }
        return livro;
    });

    // 5. Criar empréstimo
    const novoEmprestimo = {
        id: uuidv4(),
        usuarioId,
        livrosIds,
        dataEmprestimo,
        status: 'ativo',
    };

    emprestimos.push(novoEmprestimo);
    fs.writeFileSync(filePath, JSON.stringify({ ...parsed, livros: livrosAtualizados, emprestimos }, null, 2));

    return res.status(200).json({ mensagem: 'Empréstimo realizado com sucesso!', emprestimo: novoEmprestimo });
}
