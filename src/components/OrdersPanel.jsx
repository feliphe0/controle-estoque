import React from 'react'

export default function OrdersPanel({ orders, products }){
  if(!orders.length) return <p>Sem pedidos.</p>
  return (
    <div className="space-y-3">
      {orders.map(o=> (
        <div key={o.id} className="p-3 border rounded bg-white">
          <div className="flex justify-between items-center">
            <div>
              <strong>Pedido:</strong> {o.id} <br/>
              <small>Obra: {o.workId || '—'}</small>
            </div>
            <div className="text-sm">Status: <span className="font-semibold">{o.status}</span></div>
          </div>
          <div className="mt-2">
            {o.items && o.items.map((it, idx)=> (
              <div key={idx} className="text-sm">• {it.productName} — {it.qtyRequested} {it.unit}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
