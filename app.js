import express from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// POST para adicionar um novo usuário
app.post('/usuarios', async (req, res) => {
    const { email, name, age } = req.body;

    if (!email || !name) {
        return res.status(400).json({ error: "Os campos 'email' e 'name' são obrigatórios." });
    }

    try {
        const newUser = await prisma.user.create({
            data: { email, name, age }
        });

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar usuário", details: error.message });
    }
});

// GET para listar todos os usuários
app.get('/usuarios', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários", details: error.message });
    }
});

// DELETE para deletar um usuário
app.delete('/usuarios/:id', async (req, res) => {
    try {
        await prisma.user.delete({
            where: { id: req.params.id }
        });

        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') {  // Código de erro do Prisma para "Registro não encontrado"
            return res.status(404).json({ error: "Usuário não encontrado." });
        }
        res.status(500).json({ error: "Erro ao deletar usuário", details: error.message });
    }
});

// PUT para atualizar um usuário
app.put('/usuarios/:id', async (req, res) => {
    const { email, name, age } = req.body;

    if (!email || !name) {
        return res.status(400).json({ error: "Os campos 'email' e 'name' são obrigatórios." });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: req.params.id },
            data: { email, name, age }
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }
        res.status(500).json({ error: "Erro ao atualizar usuário", details: error.message });
    }
});

// Mantenha o app.listen no final para garantir que todas as rotas sejam carregadas corretamente
app.listen(5500, () => {
    console.log("Servidor rodando na porta 5500");
});