import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const filePath = path.join(process.cwd(), 'src', 'pages', 'api', 'bd.json');

type Livro = {
    id: string;
    titulo: string;
    autor: string;
    genero: string;
    quantidade: number;
    qtdEmprestados: number;
};

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ mensagem: 'Método não permitido.' });
    }

    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(jsonData) as { livros?: Livro[] };
    const livros = parsed.livros ?? [];

    const { titulo, autor, genero, quantidade } = req.body;

    if (!titulo || !autor || !genero || quantidade === undefined || quantidade === null || quantidade === '') {
        return res.status(400).json({ mensagem: 'Todos os campos (titulo, autor, genero, quantidade) são obrigatórios.' });
    }

    const qtd = Number(quantidade);
    if (!Number.isInteger(qtd) || qtd <= 0) {
        return res.status(400).json({ mensagem: 'A quantidade deve ser um número inteiro positivo.' });
    }

    const jaExiste = livros.some(
        (livro: Livro) =>
            livro.titulo.trim().toLowerCase() === titulo.trim().toLowerCase() &&
            livro.autor.trim().toLowerCase() === autor.trim().toLowerCase()
    );

    if (jaExiste) {
        return res.status(400).json({ mensagem: 'Livro já cadastrado com este título e autor!' });
    }

    const novoLivro: Livro = {
        id: uuidv4(),
        titulo: titulo.trim(),
        autor: autor.trim(),
        genero: genero.trim(),
        quantidade: qtd,
        qtdEmprestados: 0,
    };

    livros.push(novoLivro);
    fs.writeFileSync(filePath, JSON.stringify({ ...parsed, livros }, null, 2));

    return res.status(200).json({ mensagem: 'Livro cadastrado com sucesso!', livro: novoLivro });
}
