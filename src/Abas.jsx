import { useState } from "react";
import Produtos from "./Produtos";
import Pedidos from "./Pedidos";
import Almoxarifado from "./Almoxarifado";

export default function Abas({ user }) {
  const [abaAtiva, setAbaAtiva] = useState(user.role === "almoxarifado" ? "Almoxarifado" : "Pedidos");

  const getAbasDisponiveis = () => {
    switch (user.role) {
      case "admin":
        return ["Pedidos", "Produtos", "Almoxarifado"];
      case "almoxarifado":
        return ["Almoxarifado"];
      case "encarregado":
      default:
        return ["Pedidos"];
    }
  };

  const renderAba = () => {
    switch (abaAtiva) {
      case "Produtos":
        return <Produtos />;
      case "Pedidos":
        return <Pedidos user={user} />;
      case "Almoxarifado":
        return <Almoxarifado />;
      default:
        return <Pedidos user={user} />;
    }
  };

  return (
    <div>
      <nav>
        {getAbasDisponiveis().map(aba => (
          <button key={aba} onClick={() => setAbaAtiva(aba)}>
            {aba}
          </button>
        ))}
      </nav>
      {renderAba()}
    </div>
  );
}
