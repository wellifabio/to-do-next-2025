"use client"

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Usuario {
    id: number;
    nome: string;
    email: string;
}

export default function Tarefas() {
    const router = useRouter();
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [tarefas, setTarefas] = useState([]);

    useEffect(() => {
        validarUser();
    }, []);

    useEffect(() => {
        fetchTarefas();
    }, [usuario]);

    async function validarUser() {
        const usuario = localStorage.getItem("usuario");
        const user = usuario ? JSON.parse(usuario) : null;
        if (!user) {
            router.replace('/');
        } else {
            setUsuario(user);
        }
    }

    const fetchTarefas = async () => {
        if (!usuario) return;
        const res = await fetch(`http://localhost:3000/api/tarefa/${usuario.id}`);
        setTarefas(await res.json());
    };

    function sair() {
        localStorage.removeItem("usuario");
        validarUser();
    }

    return (
        <div className="w-full h-screen flex flex-col items-center justify-between">
            <header className="w-full flex flex-row items-center justify-around p-2">
                <h1 className="font-bold">Minhas tarefas</h1>
            </header>
            <main className="flex flex-col items-center justify-center gap-2">
                {tarefas.map((tarefa: { id: string; usuarioId: string; descricao: string, setor: string, prioridade: string, status: string }) => (
                    <div key={tarefa.id}
                        className="flex flex-col items-center justify-center gap-1 p-8 border border-gray-300 rounded-xl shadow-lg">
                        <h2>{tarefa.descricao}</h2>
                        <p>{tarefa.setor}</p>
                        <p>{tarefa.prioridade}</p>
                        <p>{tarefa.status}</p>
                    </div>
                ))}
            </main>
            <footer className="w-full flex flex-row items-center justify-end p-2">
                <button
                    className="bg-black text-white p-3 rounded-lg hover:bg-gray-700 transition cursor-pointer"
                    onClick={sair}
                >
                    Sair
                </button>
            </footer>
        </div>
    );
}