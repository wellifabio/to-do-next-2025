import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

const encripta = async (senha: string) => {
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

export async function GET() {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: {
                id: true,
                nome: true,
                email: true
            }
        });
        return NextResponse.json(usuarios);
    } catch {
        return NextResponse.json({ erro: 'Erro ao buscar usuarios' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        body.senha = await encripta(body.senha)
        const tarefa = await prisma.usuario.create({
            data: body
        });
        if (tarefa) {
            return NextResponse.json(tarefa, { status: 201 });
        } else {
            return NextResponse.json({ erro: "Envie os dados {nome, email e senha}" }, { status: 400 });
        }
    } catch {
        return NextResponse.json({ erro: 'Erro ao criar tarefas' }, { status: 500 });
    }
}