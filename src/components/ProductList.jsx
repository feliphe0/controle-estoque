import React from 'react'

export default function ProductList({ products }){
  if(!products.length) return <p>Sem produtos cadastrados.</p>
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map(p=> (
        <div key={p.id} className="p-3 border rounded bg-white shadow-sm">
          <div className="h-40 flex items-center justify-center bg-gray-100 mb-2">
            {p.image ? <img src={p.image} alt={p.name} className="max-h-40" /> : <div className="text-gray-400">Sem imagem</div>}
          </div>
          <h3 className="font-semibold">{p.name}</h3>
          <p className="text-sm text-gray-600">Categoria: {p.category || '-'}</p>
          <p className="text-sm">Quantidade: <strong>{p.quantity || 0}</strong></p>
          <p className="text-sm text-gray-500">Local: {p.location || '-'}</p>
        </div>
      ))}
    </div>
  )
}
