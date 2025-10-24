import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";

export default function Pedidos({ user }) {
  const [produtos, setProdutos] = useState([]);
  const [selecionados, setSelecionados] = useState({});

  const produtosRef = collection(db, "produtos");
  const pedidosRef = collection(db, "pedidos");

  const fetchProdutos = async () => {
    const snapshot = await getDocs(produtosRef);
    setProdutos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { fetchProdutos(); }, []);

  const handleSelect = (id, value) => {
    setSelecionados(prev => ({ ...prev, [id]: Number(value) }));
  };

  const handleEnviar = async () => {
    const itens = produtos.filter(p => selecionados[p.id] > 0)
                          .map(p => ({ ...p, quantidadePedida: selecionados[p.id] }));
    if (itens.length === 0) return alert("Selecione pelo menos 1 produto");

    await addDoc(pedidosRef, {
      encarregado: user.email,
      status: "Em separação",
      itens,
      createdAt: new Date()
    });

    // Atualiza estoque
    for (let item of itens) {
      const produtoDoc = doc(db, "produtos", item.id);
      await updateDoc(produtoDoc, { quantidade: item.quantidade - item.quantidadePedida });
    }

    alert("Pedido enviado!");
    setSelecionados({});
    fetchProdutos();
  };

  return (
    <div>
      <h2>Fazer Pedido</h2>
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Qtd em estoque</th>
            <th>Selecionar quantidade</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map(p => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td>{p.quantidade}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  max={p.quantidade}
                  value={selecionados[p.id] || ""}
                  onChange={e => handleSelect(p.id, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleEnviar}>Enviar Pedido</button>
    </div>
  );
}
