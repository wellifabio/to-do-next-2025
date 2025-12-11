"use client"

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Usuario {
    id: number;
    nome: string;
    email: string;
}

interface Tarefa {
    id?: number;
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
    const [tarefa, setTarefa] = useState<Tarefa | null>(null);

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
        if (!usuario || !tarefa) return;
        if (tarefa.id) {
            const options = {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tarefa)
            };
            const response = await fetch(`http://localhost:3000/api/tarefa/${tarefa.id}`, options);
            if (response.ok) {
                setTarefa(null);
                fetchTarefas();
            } else {
                alert('Erro ao atualizar tarefa');
            }
        } else {
            tarefa.usuarioId = usuario.id;
            tarefa.status = "afazer";
            console.log(tarefa);
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tarefa)
            };
            const response = await fetch('http://localhost:3000/api/tarefa', options)
            if (response.ok) {
                setTarefa(null);
                fetchTarefas();
            } else
                alert('Erro ao criar tarefa');
        }
    };

    const excluir = (id: string) => async () => {
        if (confirm('Deseja realmente excluir a tarefa?') === false) return;
        const options = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        };
        const response = await fetch(`http://localhost:3000/api/tarefa/${id}`, options)
        if (response.ok) {
            fetchTarefas();
        } else
            alert('Erro ao excluir tarefa');
    };

    const editar = (id: string) => async () => {
        setTarefa(tarefas.find((tarefa: { id: string; }) => tarefa.id == id) || null);
    };

    return (
        <div className="w-full h-screen flex flex-col items-center justify-between">
            <header className="w-full flex flex-row items-center justify-around p-2">
                <h1 className="font-bold">Tarefas da {usuario?.nome}</h1>
                <button
                    className="bg-black text-white p-3 rounded-lg hover:bg-gray-700 transition cursor-pointer"
                    onClick={sair}
                >
                    Sair
                </button>
            </header>
            <main className="flex flex-col items-center justify-center gap-2 max-h-[70vh] overflow-y-auto">
                {tarefas.map((tarefa: { id: string; usuarioId: string; descricao: string, setor: string, prioridade: string, status: string }) => (
                    <div key={tarefa.id}
                        className="flex flex-col items-center justify-center gap-1 p-4 border border-gray-300 rounded-xl shadow-lg w-80">
                        <h2>{tarefa.descricao}</h2>
                        <p>Setor: {tarefa.setor}</p>
                        <p>Prioridade: {tarefa.prioridade}</p>
                        <p>Status:
                            <select className="ml-2 p-1 border border-gray-300 rounded-lg"
                                value={tarefa.status}
                                onChange={async (e) => {
                                    const novaStatus = e.target.value;
                                    const options = {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ status: novaStatus })
                                    };
                                    const response = await fetch(`http://localhost:3000/api/tarefa/${tarefa.id}`, options);
                                    if (response.ok) {
                                        fetchTarefas();
                                    } else {
                                        alert('Erro ao atualizar status');
                                    }
                                }}
                            >
                                <option value="afazer">A fazer</option>
                                <option value="fazendo">Fazendo</option>
                                <option value="feito">Feito</option>
                            </select>
                        </p>
                        <button
                            onClick={editar(`${tarefa.id}`)}
                            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                        >
                            Editar
                        </button>
                        <button
                            onClick={excluir(`${tarefa.id}`)}
                            className="bg-black text-white p-2 rounded-lg hover:bg-gray-700 transition cursor-pointer"
                        >
                            Excluir
                        </button>
                    </div>
                ))}
            </main>
            <footer className="w-full flex flex-row items-center justify-center p-2">
                <form
                    className="flex flex-col items-center justify-center gap-2 p-3 border border-gray-300 rounded-xl shadow-lg"
                    onSubmit={handleSubmit}>
                    <h2 className="font-bold">Gestão de tarefas</h2>
                    <input
                        className="p-2 border border-gray-300 rounded-lg"
                        type="text" value={tarefa?.descricao || ""}
                        placeholder="Digite uma descricao"
                        onChange={(e) => setTarefa({ ...tarefa, descricao: e.target.value, prioridade: tarefa?.prioridade || "baixa" } as Tarefa)}
                        required />
                    <input
                        className="p-2 border border-gray-300 rounded-lg"
                        type="text" value={tarefa?.setor || ""}
                        placeholder="Digite o setor"
                        onChange={(e) => setTarefa({ ...tarefa, setor: e.target.value } as Tarefa)}
                        required />
                    <div className="p-2 flex items-center justify-center gap-2">
                        <label htmlFor="prioridade">Prioridade</label>
                        <select
                            className="p-2 border border-gray-300 rounded-lg"
                            name="prioridade" id="prioridade"
                            value={tarefa?.prioridade || ""}
                            onChange={(e) => setTarefa({ ...tarefa, prioridade: e.target.value } as Tarefa)}
                            required>
                            <option value="baixa" defaultChecked>Baixa</option>
                            <option value="media">Média</option>
                            <option value="alta">Alta</option>
                        </select>

                        <button
                            type="submit"
                            className="bg-black text-white p-2 rounded-lg hover:bg-gray-700 transition cursor-pointer"
                        >
                            {tarefa && tarefa.id ? 'Atualizar' : 'Adicionar'}
                        </button>
                    </div>
                </form>
            </footer>
        </div>
    );
}