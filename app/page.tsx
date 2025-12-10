"use client"

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    };
    const response = await fetch('http://localhost:3000/api/login', options)
    if (response.ok) {
      const resp = await response.json()
      localStorage.setItem("usuario", JSON.stringify(resp))
      router.push('/tarefas')
    } else
      alert('E-mail ou senha inválidos')
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-between">
      <header className="flex items-center justify-center py-8">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
      </header>
      <main className="flex items-center justify-center flex-1">
        <form
          className="flex flex-col items-center justify-center gap-5 p-8 border border-gray-300 rounded-xl shadow-lg"
          onSubmit={handleSubmit}>
          <h2 className="font-bold">Gestão de tarefas</h2>
          <input
            className="p-2 border border-gray-300 rounded-lg"
            type="email" value={email}
            placeholder="Digite o e-mail"
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
      </main>
      <footer className="flex items-center justify-center py-8">
        <h2>By wellifabio</h2>
      </footer>
    </div>
  );
}