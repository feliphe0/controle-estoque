import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, updateDoc, doc, increment } from "firebase/firestore";

export default function Almoxarifado() {
  const [pedidos, setPedidos] = useState([]);
  const [produtosMap, setProdutosMap] = useState({});

  const pedidosRef = collection(db, "pedidos");
  const produtosRef = collection(db, "produtos");

  // Buscar produtos para mapa rápido
  const fetchProdutos = async () => {
    const snapshot = await getDocs(produtosRef);
    const map = {};
    snapshot.docs.forEach(docSnap => {
      map[docSnap.id] = { ...docSnap.data(), id: docSnap.id };
    });
    setProdutosMap(map);
  };

  // Buscar pedidos
  const fetchPedidos = async () => {
    const snapshot = await getDocs(pedidosRef);
    const lista = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    setPedidos(lista);
  };

  useEffect(() => {
    fetchProdutos();
    fetchPedidos();
  }, []);

  const statusFlow = {
    "Aguardando separação": "Em separação",
    "Em separação": "Produto retirado",
    "Produto retirado": "Produto retirado"
  };

  const handleStatusChange = async (pedido) => {
    const novoStatus = statusFlow[pedido.status];

    // Atualiza pedido
    const pedidoDoc = doc(db, "pedidos", pedido.id);
    await updateDoc(pedidoDoc, { status: novoStatus });

    // Se foi retirado, atualiza o estoque
    if (novoStatus === "Produto retirado") {
      for (const item of pedido.itens) {
        const produtoDoc = doc(db, "produtos", item.id);
        await updateDoc(produtoDoc, {
          quantidade: increment(-item.quantidade)
        });
      }
    }

    fetchPedidos();
    fetchProdutos();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Pedidos Recebidos</h2>
      {pedidos.length === 0 ? <p>Nenhum pedido.</p> : (
        <table style={{ borderCollapse: "collapse", width: "100%", maxWidth: 800 }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: 8 }}>Encarregado</th>
              <th style={{ border: "1px solid black", padding: 8 }}>Itens</th>
              <th style={{ border: "1px solid black", padding: 8 }}>Status</th>
              <th style={{ border: "1px solid black", padding: 8 }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(p => (
              <tr key={p.id}>
                <td style={{ border: "1px solid black", padding: 8 }}>{p.user}</td>
                <td style={{ border: "1px solid black", padding: 8 }}>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {p.itens.map(item => (
                      <li key={item.id}>{item.nome} - {item.quantidade} {item.unidade}</li>
                    ))}
                  </ul>
                </td>
                <td style={{ border: "1px solid black", padding: 8 }}>{p.status}</td>
                <td style={{ border: "1px solid black", padding: 8 }}>
                  {p.status !== "Produto retirado" && (
                    <button onClick={() => handleStatusChange(p)} style={{ padding: 5 }}>
                      Avançar Status
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
