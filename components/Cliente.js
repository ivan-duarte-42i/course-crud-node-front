import React from 'react'
import Swal from 'sweetalert2'
import { useMutation, gql } from '@apollo/client'
import Router from 'next/router'

const ELIMINAR_USUARIO_QUERY = gql`
  mutation eliminarCliente($id: ID!) {
    eliminarCliente(id: $id)
  }
`;

const OBTENER_CLIENTES_USUARIO_QUERY = gql`
query obtenerClientesVendedor{
  obtenerClientesVendedor{
      id
      nombre 
      apellido
      empresa
      email
      telefono
    }
}
`;

const Cliente = ({ cliente }) => {
  const { id, nombre, apellido, empresa, email } = cliente;
  const [eliminarCliente] = useMutation(ELIMINAR_USUARIO_QUERY, {
    update(cache) {
      const { obtenerClientesVendedor } = cache.readQuery({ query: OBTENER_CLIENTES_USUARIO_QUERY });

      cache.writeQuery({
        query: OBTENER_CLIENTES_USUARIO_QUERY,
        data: {
          obtenerClientesVendedor: obtenerClientesVendedor.filter(cliente => cliente.id !== id)
        }
      });
    }
  })

  const confirmarEliminarCliente = () => {
    Swal.fire({
      title: 'Elimando Cliente',
      text: `Seguro que desea eliminar el cliente ${nombre} ${apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminalo!',
      cancelButtonText: "No, cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await eliminarCliente({
            variables: {
              id
            }
          });
          Swal.fire(
            'Eliminado!',
            `${data.eliminarCliente}: ${nombre} ${apellido}`,
            'success',
          );
        } catch (error) {

        }
      }
    });
  }
  const editarCliente = () => {
    Router.push({
      pathname: "/clientes/[editId]",
      query: { editId: id }
    })
  }

  return (
    <tr>
      <td className="border px-4 py-2">{nombre} {apellido}</td>
      <td className="border px-4 py-2">{empresa}</td>
      <td className="border px-4 py-2">{email}</td>
      <td className="border px-4 py-2">
        <button
          className="flex text-xs uppercase font-bold justify-center items-center bg-yellow-600 py-2 px-4 rounded w-full text-white"
          type="button"
          onClick={() => editarCliente(id)}>
          Editar
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
        </button>
      </td>
      <td className="border px-4 py-2">
        <button
          className="flex text-xs uppercase font-bold justify-center items-center bg-red-800 py-2 px-4 rounded w-full text-white"
          type="button"
          onClick={() => confirmarEliminarCliente(id)}>
          Eliminar
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </td>
    </tr>
  )
}

export default Cliente
