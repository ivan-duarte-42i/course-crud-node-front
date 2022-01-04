import React, { useContext } from 'react'
import PedidoContext from '../../context/pedidos/PedidosContext';

const Total = () => {
  const pedidoContext = useContext(PedidoContext);
  const { total } = pedidoContext;

  return (
    <div className="flex items-center justify-between p-3 mt-5 bg-white border-2 border-gray-200 border-solid rounded">
      <h2 className="text-lg text-gray-800">Total a pagar</h2>
      <p className="mt-0 text-gray-800">$ {total}</p>
    </div>
  )
}

export default Total
