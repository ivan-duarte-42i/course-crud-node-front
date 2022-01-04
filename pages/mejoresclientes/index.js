import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { gql, useQuery } from '@apollo/client';

const MEJORES_CLIENTES_QUERY = gql`
query mejoresClientes {
  mejoresClientes {
    cliente {
      nombre
      apellido
      empresa
    }
    total
  }
}`;


const MejoresClientes = () => {
  const { data, loading, error, startPolling, stopPolling } = useQuery(MEJORES_CLIENTES_QUERY);
  
  useEffect(() => {
    startPolling(1000);
    return () => {
      stopPolling();
    }
  }, startPolling, stopPolling);
  
  if (loading) return "Loading";

  const { mejoresClientes } = data;
  const clientesGrafica = [];

  mejoresClientes.map((cliente, index) => {
    clientesGrafica[index] = {
      cliente: `${cliente.cliente[0].nombre} ${cliente.cliente[0].apellido}`,
      total: cliente.total
    };
  });

  return (
    <Layout>
      <h1 className="mb-2 text-3xl font-light text-center text-gray-800">Mejores Clientes</h1>

      <BarChart width={600} height={500} data={clientesGrafica} className="mt-10">
        <XAxis dataKey="cliente" stroke="#8884d8" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Bar dataKey="total" fill="#3182CE" />
      </BarChart>

    </Layout>
  )
}

export default MejoresClientes
