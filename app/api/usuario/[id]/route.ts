import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const body = await request.json();
        const id = Number((await params).id)
        const usuario = await prisma.usuario.update({
            where: {
                id: id
            },
            data: body,
        });
        const { senha, ...usuarioSemSenha } = usuario;
        return NextResponse.json(usuarioSemSenha, { status: 202 });
    } catch (error) {
        return NextResponse.json({ erro: 'Erro ao atualizar tarefa' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = Number((await params).id)
        await prisma.usuario.delete({
            where: {
                id: id
            },
        });
        return NextResponse.json({ msg: "Usuário excluído com sucesso" });
    } catch (error) {
        return NextResponse.json({ erro: 'Erro ao excluir usuário' }, { status: 500 });
    }
}