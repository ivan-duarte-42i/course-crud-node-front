import React, { useContext } from 'react'
import PedidoContext from '../../context/pedidos/PedidosContext';
import ProductosResumen from './ProductosResumen';

const ResumenPedido = () => {
  const pedidoContext = useContext(PedidoContext);
  const { productos } = pedidoContext;

  return (
    <>
      <p className="p-2 my-2 mt-10 text-sm font-bold text-gray-700 bg-white border-l-4 border-gray-800">3. Ajusta las cantidades del producto</p>
      {
        productos.length > 0
          ? <>
            {productos.map((producto) =>
              <ProductosResumen key={producto.id} producto={producto} />
            )}
          </>
          : <>
            <p className="mt-5 text-sm">Aún no hay productos</p>
          </>

      }
    </>
  )
}

export default ResumenPedido
