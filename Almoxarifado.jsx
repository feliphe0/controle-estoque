import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function Almoxarifado() {
  const [pedidos, setPedidos] = useState([]);
  const pedidosRef = collection(db, "pedidos");

  const fetchPedidos = async () => {
    const snapshot = await getDocs(pedidosRef);
    setPedidos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { fetchPedidos(); }, []);

  const handleStatus = async (pedido, novoStatus) => {
    const pedidoDoc = doc(db, "pedidos", pedido.id);
    await updateDoc(pedidoDoc, { status: novoStatus });
    fetchPedidos();
  };

  return (
    <div>
      <h2>Pedidos Recebidos</h2>
      {pedidos.length === 0 && <p>Nenhum pedido.</p>}
      {pedidos.map(p => (
        <div key={p.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <p><strong>Encarregado:</strong> {p.encarregado}</p>
          <p><strong>Status:</strong> {p.status}</p>
          <ul>
            {p.itens.map(item => (
              <li key={item.id}>{item.nome} - {item.quantidadePedida} {item.unidade}</li>
            ))}
          </ul>
          {p.status === "Em separação" && (
            <button onClick={() => handleStatus(p, "Aguardando retirada")}>Separado</button>
          )}
          {p.status === "Aguardando retirada" && (
            <button onClick={() => handleStatus(p, "Produto retirado")}>Retirado</button>
          )}
        </div>
      ))}
    </div>
  );
}
