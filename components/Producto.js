import React from 'react'
import Swal from 'sweetalert2'
import { useMutation, gql } from '@apollo/client'
import Router from 'next/router'

const ELIMINAR_PRODUCTO_QUERY = gql`
  mutation eliminarProducto($id: ID!) {
    eliminarProducto(id: $id) 
  }
`;

const OBTENER_PRODUCTOS_QUERY = gql`
query obtenerProductos{
  obtenerProductos {
    id
    nombre
    existencia
    precio
    creado
  }
}
`;

const Producto = ({ producto }) => {
  const { id, nombre, existencia, precio } = producto;

  const [ eliminarProducto ] = useMutation(ELIMINAR_PRODUCTO_QUERY, {
    update(cache) {
      const { obtenerProductos } = cache.readQuery({ query: OBTENER_PRODUCTOS_QUERY });

      cache.writeQuery({
        query: OBTENER_PRODUCTOS_QUERY,
        data: {
          obtenerProductos: obtenerProductos.filter(producto => producto.id !== id)
        }
      });
    }
  });

  const editarProducto = () => {
    Router.push({
      pathname: "/productos/[editId]",
      query: { editId: id }
    })
  }

  const confirmarEliminarProducto = () => {
    Swal.fire({
      title: 'Elimando Producto',
      text: `Seguro que desea eliminar el producto ${nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminalo!',
      cancelButtonText: "No, cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await eliminarProducto({
            variables: {
              id
            }
          });
          Swal.fire(
            'Eliminado!',
            `${data.eliminarProducto}: ${nombre}`,
            'success',
          );
        } catch (error) {
          
        }
      }
    });
  }


  return (
    <tr>
      <td className="border px-4 py-2">{nombre}</td>
      <td className="border px-4 py-2">{existencia} artículos</td>
      <td className="border px-4 py-2">$ {precio}</td>
      <td className="border px-4 py-2">
        <button
          className="flex text-xs uppercase font-bold justify-center items-center bg-yellow-600 py-2 px-4 rounded w-full text-white"
          type="button"
          onClick={() => editarProducto()}>
          Editar
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
        </button>
      </td>
      <td className="border px-4 py-2">
        <button
          className="flex text-xs uppercase font-bold justify-center items-center bg-red-800 py-2 px-4 rounded w-full text-white"
          type="button"
          onClick={() => confirmarEliminarProducto()}>
          Eliminar
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </td>
    </tr>
  )
}

export default Producto
