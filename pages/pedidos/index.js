import React from 'react';
import Layout from '../../components/Layout';
import Pedido from '../../components/pedidos/Pedido';
import Link from 'next/link';
import { useQuery, gql } from '@apollo/client';

const OBTENER_PEDIDOS_QUERY = gql`
query obtenerPedidosVendedor{
  obtenerPedidosVendedor {
    id 
    pedido {
      id
      cantidad 
      nombre
      precio
    }
    cliente {
      id
      nombre
      apellido
      email
      telefono
    }
    estado
    fecha
    vendedor
    total
  }
}`;

const Pedidos = () => {
  const { data, loading, error } = useQuery(OBTENER_PEDIDOS_QUERY);

  if (loading) return "Cargando..";
  
  const { obtenerPedidosVendedor } = data;

  return (
    <div>
      <Layout>
        <h1 className="mb-2 text-3xl font-light text-center text-gray-800">Pedidos</h1>

        <Link href="/pedidos/nuevopedido">
          <a className="px-5 py-2 mb-3 text-sm font-bold text-white uppercase bg-blue-800 rounded hover:bg-gray-800">
            Nuevo Pedido
          </a>
        </Link>

        {
          obtenerPedidosVendedor.length === 0
            ? <p className="mt-5 text-2xl text-center">No hay pedidos aún</p>
            : obtenerPedidosVendedor.map(pedido => <Pedido key={pedido.id} pedido={pedido} />)
        }
      </Layout>
    </div>
  )
}

export default Pedidos
