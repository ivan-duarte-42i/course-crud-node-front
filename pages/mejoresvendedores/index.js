import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { gql, useQuery } from '@apollo/client';

const MEJORES_VENDEDORES_QUERY = gql`
query mejoresVendedores {
  mejoresVendedores {
    total
    vendedor {
      nombre
      apellido
    }
  }
}`;

const MejoresVendedores = () => {
  const { data, loading, error, startPolling, stopPolling } = useQuery(MEJORES_VENDEDORES_QUERY);
  
  useEffect(() => {
    startPolling(1000);
    return () => {
      stopPolling();
    }
  }, startPolling, stopPolling);
  
  if (loading) return "Loading";

  const { mejoresVendedores } = data;
  const vendedorGrafica = [];

  mejoresVendedores.map((vendedor, index) => {
    vendedorGrafica[index] = {
      ...vendedor.vendedor[0],
      total: vendedor.total
    };
  });

  return (
    <Layout>
      <h1 className="mb-2 text-3xl font-light text-center text-gray-800">Mejores Vendedores</h1>
      <BarChart width={600} height={500} data={mejoresVendedores} className="mt-10">
        <XAxis dataKey="name" stroke="#8884d8" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Bar dataKey="total" fill="#3182CE" />
      </BarChart>
    </Layout>
  )
}

export default MejoresVendedores
