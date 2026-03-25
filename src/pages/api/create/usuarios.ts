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

    const { nome, email, telefone } = req.body;

    if (!nome || !email || !telefone) {
        return res.status(400).json({ mensagem: 'Nome, email e telefone são obrigatórios.' });
    }

    if (usuarios.some((user) => user.email === email)) {
        return res.status(400).json({ mensagem: 'Usuário já cadastrado com este e-mail!' });
    }

    const novoUsuario = {
        id: uuidv4(),
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        telefone: telefone.trim(),
    };

    usuarios.push(novoUsuario);
    fs.writeFileSync(filePath, JSON.stringify({ ...parsed, usuarios }, null, 2));

    return res.status(200).json({ mensagem: 'Usuário cadastrado com sucesso!', usuario: novoUsuario });
}
