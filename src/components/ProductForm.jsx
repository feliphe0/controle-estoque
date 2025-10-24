import React, { useState } from 'react'

export default function ProductForm({ categories, onCreate }){
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [location, setLocation] = useState('')
  const [file, setFile] = useState(null)

  async function submit(e){
    e.preventDefault()
    await onCreate({ name, category, quantity, location }, file)
    setName(''); setCategory(''); setQuantity(0); setLocation(''); setFile(null)
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nome do produto" className="w-full p-2 border rounded" required />
      <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full p-2 border rounded">
        <option value="">-- Categoria --</option>
        {categories.map(c=> <option key={c.id} value={c.name}>{c.name}</option>)}
      </select>
      <input type="number" value={quantity} onChange={e=>setQuantity(e.target.value)} placeholder="Quantidade inicial" className="w-full p-2 border rounded" />
      <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Localização" className="w-full p-2 border rounded" />
      <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} />
      <button className="px-4 py-2 bg-blue-600 text-white rounded">Criar Produto</button>
    </form>
  )
}
