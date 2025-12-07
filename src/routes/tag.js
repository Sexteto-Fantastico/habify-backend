import express from 'express';
import { Tag } from '../models/index.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const tags = await Tag.findAll({
            where: { userId: req.user.userId },
            order: [['name', 'ASC']],
        });
        res.json(tags);
    } catch (err) {
        console.error('Erro ao buscar tags:', err);
        res.status(500).json({ error: 'Erro ao buscar tags.' });
    }
});

router.post('/', verifyToken, async (req, res) => {
    const { name, color } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Nome da tag é obrigatório.' });
    }

    try {
        const tag = await Tag.create({
            name,
            color,
            userId: req.user.userId,
        });

        res.status(201).json({
            message: 'Tag criada com sucesso.',
            tag,
        });
    } catch (err) {
        console.error('Erro ao criar tag:', err);
        res.status(500).json({ error: 'Erro ao criar tag.' });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { name, color } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Nome da tag é obrigatório.' });
    }

    try {
        const tag = await Tag.findOne({
            where: { id, userId: req.user.userId },
        });

        if (!tag) {
            return res.status(404).json({ error: 'Tag não encontrada.' });
        }

        await tag.update({ name, color });

        res.json({
            message: 'Tag atualizada com sucesso.',
            tag,
        });
    } catch (err) {
        console.error('Erro ao atualizar tag:', err);
        res.status(500).json({ error: 'Erro ao atualizar tag.' });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const tag = await Tag.findOne({
            where: { id, userId: req.user.userId },
        });

        if (!tag) {
            return res.status(404).json({ error: 'Tag não encontrada.' });
        }

        await tag.destroy();

        res.json({ message: 'Tag removida com sucesso.' });
    } catch (err) {
        console.error('Erro ao remover tag:', err);
        res.status(500).json({ error: 'Erro ao remover tag.' });
    }
});

export default router;
