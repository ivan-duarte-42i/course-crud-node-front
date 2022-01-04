import React, { useState, useEffect, useContext } from 'react'
import PedidoContext from '../../context/pedidos/PedidosContext';

const ProductosResumen = ({ producto }) => {
  const pedidoContext = useContext(PedidoContext);

  const { agregarCantidad, actualizarTotal } = pedidoContext;

  const [cantidad, setCantidad] = useState(0);

  useEffect(() => {
    actualizarCantidad();
    actualizarTotal();
  }, [cantidad]);

  const actualizarCantidad = () => {
    const nuevoProducto = {...producto, cantidad: Number(cantidad) };
    agregarCantidad(nuevoProducto);
  }


  const { nombre, precio } = producto;

  return (
    <div className="mt-5 md:flex md:justify-between md:items-center ">
      <div className="mb-2 md:w-2/4 md:mb-0">
        <p className="text-sm">{nombre}</p>
        <p>${precio}</p>
      </div>
      <input
        type="number"
        placeholder="Cantidad"
        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline md:ml-4"
        onChange={e => setCantidad(e.target.value)}
        value={cantidad}
      />
    </div>

  )
}

export default ProductosResumen
