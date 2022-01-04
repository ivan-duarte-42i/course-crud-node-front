import React from 'react'
import Layout from '../../components/Layout'
import { useQuery, gql } from '@apollo/client'
import Producto from '../../components/Producto'
import Link from 'next/link';

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

const Productos = () => {
  const { data, loading} = useQuery(OBTENER_PRODUCTOS_QUERY);
  return (
    <div>
      <Layout>
        <h1 className="mb-2 text-3xl font-light text-center text-gray-800">Productos</h1>
        <Link href="/productos/nuevoproducto">
          <a className="px-5 py-2 mb-3 text-sm font-bold text-white uppercase bg-blue-800 rounded hover:bg-gray-800">
            Nuevo Producto
          </a>
        </Link>
        <table className="w-full mt-10 shadow-md table-auto w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-2">Nombre</th>
              <th className="w-1/5 py-2">Existencia</th>
              <th className="w-1/5 py-2">Precio</th>
              <th className="w-1/5 py-2">Editar</th>
              <th className="w-1/5 py-2">Eliminar</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data && data.obtenerProductos && data.obtenerProductos.map((producto, productoId) => (
              <Producto key={`cliente_${productoId}`} producto={producto} />
            ))}
          </tbody>
        </table>
      </Layout>
    </div>
  )
}

export default Productos
