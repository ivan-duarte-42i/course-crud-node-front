import React, { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';

const ACTUALIZAR_PEDIDO_QUERY = gql`
mutation actualizarPedido($id: ID!, $input: PedidoInput) {
  actualizarPedido(id: $id, input: $input) {
    id
    estado
  }
}`;

const ELIMINAR_PEDIDO_QUERY = gql`
mutation eliminarPedido($id: ID!) {
  eliminarPedido(id: $id)
}`;

const OBTENER_PEDIDOS_QUERY = gql`
query obtenerPedidosVendedor{
  obtenerPedidosVendedor {
    id
  }
}`;

const Pedido = ({ pedido }) => {
  const [actualizarPedido] = useMutation(ACTUALIZAR_PEDIDO_QUERY);

  const [eliminarPedido] = useMutation(ELIMINAR_PEDIDO_QUERY, {
    update(cache) {
      const { obtenerPedidosVendedor } = cache.readQuery({ query: OBTENER_PEDIDOS_QUERY });
      cache.writeQuery({
        query: OBTENER_PEDIDOS_QUERY,
        data: {
          obtenerPedidosVendedor: obtenerPedidosVendedor.filter(pedido => pedido.id !== id)
        }
      })
    }
  });
  const { id, total, cliente: { nombre, apellido, telefono, email }, estado, cliente } = pedido;

  const [estadoPedido, setEstadoPedido] = useState(estado);
  const [clase, setClase] = useState('');

  useEffect(() => {
    if (estadoPedido) {
      setEstadoPedido(estadoPedido);
    }
    clasePedido(estadoPedido);
  }, [estadoPedido]);

  const clasePedido = () => {
    if (estadoPedido === 'PENDIENTE') {
      setClase(' border-yellow-500 ');
    } else if (estadoPedido === 'COMPLETADO') {
      setClase(' border-green-500 ');
    } else {
      setClase(' border-red-800 ');
    }
  }

  const cambiarEstadoPedido = async nuevoEstado => {
    try {
      const { data } = await actualizarPedido({
        variables: {
          id,
          input: {
            estado: nuevoEstado,
            cliente: cliente.id,
          }
        }
      });
      setEstadoPedido(data.actualizarPedido.estado);
    } catch (error) {
      console.log(error);
    }
  }

  const confirmarEliminarPedido = () => {

    Swal.fire({
      title: 'Elimando Pedido',
      text: `Seguro que desea eliminar el pedido?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminalo!',
      cancelButtonText: "No, cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await eliminarPedido({
            variables: {
              id
            }
          });
          console.log(data);
          Swal.fire(
            'Eliminado!',
            `${data.eliminarPedido}`,
            'success',
          );

        } catch (error) {
          console.log(error);
        }
      }
    });
    /* eliminarPedido */
  }

  return (
    <div className={`${clase} border-t-4 p-6 mt-4 bg-white rounded shadow-lg md:grid md:grid-cols-2 md:gap-4`}>
      <div>
        <p className="font-bold text-gray-800">Cliente: {nombre} {apellido}</p>
        {email && (
          <p className="flex items-center my-2">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            {email}
          </p>
        )}
        {telefono && (
          <p className="flex items-center my-2">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            {telefono}
          </p>
        )}
        <h2 className="mt-10 font-bold text-gray-800" >Estado Pedido: {estadoPedido}</h2>

        <select
          className="p-2 mt-2 text-xs font-bold leading-tight text-center text-white uppercase bg-blue-600 border border-blue-600 rounded appearance-none focus:outline-none focus:bg-blue-500 focus:border-blue-500"
          value={estadoPedido}
          onChange={e => cambiarEstadoPedido(e.target.value)}
        >
          <option value="COMPLETADO">COMPLETADO</option>
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="CANCELADO">CANCELADO</option>

        </select>
      </div>
      <div>
        <h2 className="mt-2 font-bold text-gray-800">Resumen del pedido</h2>
        {
          pedido.pedido.map(articulo => (
            <div key={articulo.id} className="mt-4">
              <p className="text-sm text-gray-600">Producto: {articulo.nombre}</p>
              <p className="text-sm text-gray-600">Cantidad: {articulo.cantidad}</p>
              <p className="text-sm text-gray-600">Precio: ${articulo.precio}</p>
            </div>
          ))
        }
        <p className="mt-3 font-bold text-gray-800">Total a Pagar: <span className="font-light">${total}</span></p>

        <button
          className="flex items-center inline-block px-5 py-2 mt-4 text-sm font-bold leading-tight text-white uppercase bg-red-800 rounded"
          onClick={() => confirmarEliminarPedido()}
        >
          Eliminar Pedido
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>
    </div>
  )
}

export default Pedido
