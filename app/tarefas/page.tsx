"use client"

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Usuario {
    id: number;
    nome: string;
    email: string;
}

interface Tarefa {
    usuarioId: number;
    descricao: string;
    setor: string;
    prioridade: string;
    status: string;
}

export default function Tarefas() {
    const router = useRouter();
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [tarefas, setTarefas] = useState([]);
    const [tarefa, setTarefa] = useState<Tarefa | null>({
        usuarioId: 1,
        descricao: "",
        setor: "",
        prioridade: "",
        status: "",
    });

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

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tarefa)
        };
        const response = await fetch('http://localhost:3000/api/tarefa', options)
        if (response.ok) {
            const resp = await response.json()
            localStorage.setItem("usuario", JSON.stringify(resp))
            router.push('/tarefas')
        } else
            alert('E-mail ou senha inválidos')
    };

    return (
        <div className="w-full h-screen flex flex-col items-center justify-between">
            <header className="w-full flex flex-row items-center justify-around p-2">
                <h1 className="font-bold">Minhas tarefas</h1>
                <form
                    className="flex flex-col items-center justify-center gap-5 p-8 border border-gray-300 rounded-xl shadow-lg"
                    onSubmit={handleSubmit}>
                    <h2 className="font-bold">Gestão de tarefas</h2>
                    <input
                        className="p-2 border border-gray-300 rounded-lg"
                        type="text" value={tarefa.descricao}
                        placeholder="Digite uma descricao"
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                    <input
                        className="p-2 border border-gray-300 rounded-lg"
                        type="password"
                        value={senha}
                        placeholder="Digite a senha"
                        onChange={(e) => setSenha(e.target.value)}
                        required />
                    <button
                        type="submit"
                        className="bg-black text-white p-3 rounded-lg hover:bg-gray-700 transition cursor-pointer"
                    >
                        Entrar
                    </button>
                </form>
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