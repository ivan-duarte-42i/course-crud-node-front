import Layout from '../components/Layout'
import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router';
import Link from 'next/link';
import Cliente from '../components/Cliente'

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

const Home = () => {
  const router = useRouter();

  const { data, loading, client } = useQuery(OBTENER_CLIENTES_USUARIO_QUERY);

  if (!loading) {
    if (!data.obtenerClientesVendedor) {
      client.clearStore();
      router.push('/login');
      return null;
    }
  }

  return (
    <div>
      <Layout>
        <h1 className="mb-3 text-3xl font-light text-center text-gray-800">Clientes</h1>
        
        <Link href="/clientes/nuevocliente">
          <a className="px-5 py-2 mb-3 text-sm font-bold text-white uppercase bg-blue-800 rounded hover:bg-gray-800">
            Nuevo Cliente
          </a>
        </Link>
        <table className="w-full mt-10 shadow-md table-auto w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-2">Nombre</th>
              <th className="w-1/5 py-2">Empresa</th>
              <th className="w-1/5 py-2">Email</th>
              <th className="w-1/5 py-2">Editar</th>
              <th className="w-1/5 py-2">Eliminar</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data && data.obtenerClientesVendedor && data.obtenerClientesVendedor.map((cliente, clienteId) => (
              <Cliente key={`cliente_${clienteId}`} cliente={cliente} />
            ))}
          </tbody>
        </table>
      </Layout>
    </div>
  )
}

export default Home
