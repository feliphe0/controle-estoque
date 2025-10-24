import React, { useState } from 'react'

export default function MovementForm({ products, onCreate }){
  const [productId, setProductId] = useState('')
  const [type, setType] = useState('Entrada')
  const [qty, setQty] = useState(1)
  const [responsible, setResponsible] = useState('')

  async function submit(e){
    e.preventDefault()
    try{
      await onCreate({ productId, type, qty, responsible, date: new Date() })
      setProductId(''); setQty(1); setResponsible('')
      alert('Movimentação registrada')
    }catch(err){ alert(err.message) }
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <select value={productId} onChange={e=>setProductId(e.target.value)} className="w-full p-2 border rounded" required>
        <option value="">-- Selecione o produto --</option>
        {products.map(p=> <option value={p.id} key={p.id}>{p.name} (qty: {p.quantity || 0})</option>)}
      </select>
      <select value={type} onChange={e=>setType(e.target.value)} className="w-full p-2 border rounded">
        <option>Entrada</option>
        <option>Saida</option>
      </select>
      <input type="number" value={qty} onChange={e=>setQty(e.target.value)} min="1" className="w-full p-2 border rounded" required />
      <input value={responsible} onChange={e=>setResponsible(e.target.value)} placeholder="Responsável" className="w-full p-2 border rounded" />
      <button className="px-4 py-2 bg-green-600 text-white rounded">Registrar</button>
    </form>
  )
}
