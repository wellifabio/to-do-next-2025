import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import bcrypt from 'bcrypt';

const encripta = async (senha) => {
    if (!senha) return null;
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(senha, salt)
        return hash;
    } catch (error) {
        console.error('Erro ao criar hash:', error)
        throw new Error('Erro ao criar hash')
    }
}

async function main() {
    await prisma.usuario.createMany({
        data: [
            { nome: "Ana Silva", email: "ana@email.com", senha: await encripta("senha123") },
            { nome: "Maria Oliveira", email: "maria@email.com", senha: await encripta("senha123") }
        ],
    })

    await prisma.tarefa.createMany({
        data: [
            { usuarioId: 1, descricao: "Criar um relatório de estatísticas de desvio", setor: "Administração", prioridade: "baixa" },
            { usuarioId: 1, descricao: "Apresentar relatório de despesas", setor: "Administração", prioridade: "baixa" },
            { usuarioId: 1, descricao: "Apresentar resultados do setor", setor: "Administração", prioridade: "media" },
            { usuarioId: 2, descricao: "Criar um relatório de estatísticas de desvio", setor: "Produção", prioridade: "baixa" },
            { usuarioId: 2, descricao: "Apresentar resultados do setor", setor: "Produção", prioridade: "media" }
        ],
    })
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })