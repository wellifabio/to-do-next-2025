import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = Number((await params).id)
        const tarefas = await prisma.tarefa.findMany({
            where: {
                usuarioId: id
            }
        });
        return NextResponse.json(tarefas);
    } catch {
        return NextResponse.json({ erro: 'Erro ao buscar tarefas' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const body = await request.json();
        const id = Number((await params).id)
        const tarefa = await prisma.tarefa.update({
            where: {
                id: id
            },
            data: body,
        });
        return NextResponse.json(tarefa, { status: 202 });
    } catch (error) {
        return NextResponse.json({ erro: 'Erro ao atualizar tarefa' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = Number((await params).id)
        await prisma.tarefa.delete({
            where: {
                id: id
            },
        });
        return NextResponse.json({ msg: "Tarefa deletada com sucesso" });
    } catch (error) {
        return NextResponse.json({ erro: 'Erro ao deletar tarefa' }, { status: 500 });
    }
}