import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const usuario = await prisma.usuario.findFirst({
            where: {
                email: body.email
            }
        });
        if (usuario) {
            if (await bcrypt.compare(body.senha, usuario.senha)) {
                const { senha, ...usuarioSemSenha } = usuario;
                return NextResponse.json(usuarioSemSenha);
            } else {
                return NextResponse.json({ message: "Senha inválida" }, { status: 401 });
            }
        } else {
            return NextResponse.json({ erro: "E-mail ou senha inválidos" }, { status: 401 });
        }
    } catch {
        return NextResponse.json({ erro: 'Erro ao buscar usuarios' }, { status: 500 });
    }
}