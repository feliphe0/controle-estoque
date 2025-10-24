import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function Produtos() {
  const [nome, setNome] = useState("");
  const [unidade, setUnidade] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [produtos, setProdutos] = useState([]);

  const produtosRef = collection(db, "produtos");

  // Buscar produtos existentes
  const fetchProdutos = async () => {
    const snapshot = await getDocs(produtosRef);
    const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProdutos(lista);
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  // Adicionar novo produto
  const handleAddProduto = async (e) => {
    e.preventDefault();
    if (!nome || !unidade || !quantidade) return;

    await addDoc(produtosRef, {
      nome,
      unidade,
      quantidade: Number(quantidade)
    });

    setNome("");
    setUnidade("");
    setQuantidade("");
    fetchProdutos();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Cadastro de Produtos</h2>
      <form onSubmit={handleAddProduto} style={{ display: "flex", flexDirection: "column", maxWidth: 300 }}>
        <input placeholder="Nome do produto" value={nome} onChange={e => setNome(e.target.value)} style={{ marginBottom: 10, padding: 8 }} />
        <input placeholder="Unidade (un, kg, m)" value={unidade} onChange={e => setUnidade(e.target.value)} style={{ marginBottom: 10, padding: 8 }} />
        <input type="number" placeholder="Quantidade" value={quantidade} onChange={e => setQuantidade(e.target.value)} style={{ marginBottom: 10, padding: 8 }} />
        <button type="submit" style={{ padding: 10 }}>Adicionar Produto</button>
      </form>

      <h3>Produtos cadastrados</h3>
      <ul>
        {produtos.map(p => (
          <li key={p.id}>{p.nome} - {p.quantidade} {p.unidade}</li>
        ))}
      </ul>
    </div>
  );
}
