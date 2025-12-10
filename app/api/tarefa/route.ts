import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
    try {
        const tarefas = await prisma.tarefa.findMany();
        return NextResponse.json(tarefas);
    } catch {
        return NextResponse.json({ erro: 'Erro ao buscar tarefas' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const tarefa = await prisma.tarefa.create({
            data: body
        });
        if (tarefa) {
            return NextResponse.json(tarefa, { status: 201 });
        } else {
            return NextResponse.json({ erro: "Envie os dados {usuarioId, descricao, setor e prioridade}" }, { status: 400 });
        }
    } catch {
        return NextResponse.json({ erro: 'Erro ao criar tarefas' }, { status: 500 });
    }
}