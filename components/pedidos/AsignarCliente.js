import React, { useState, useEffect, useContext } from 'react'
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidosContext';

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

const AsignarCliente = () => {

  const pedidoContext = useContext(PedidoContext);
  const { agregarCliente } = pedidoContext;

  const [cliente, setCliente] = useState({});
  const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO_QUERY);

  useEffect(() => {
    agregarCliente(cliente);
  }, [cliente]);
  
  if (loading) return "Loading. .. ";
  const { obtenerClientesVendedor } = data;


  const seleccionarCliente = cliente => {
    setCliente(cliente);
  }

  return (
    <>
      {(loading) ? <></>
        : <><p className="p-2 my-2 mt-10 text-sm font-bold text-gray-700 bg-white border-l-4 border-gray-800">1. Asigna un cliente al pedido</p>
          <Select
            className="mt-3"
            options={obtenerClientesVendedor}
            onChange={options => seleccionarCliente(options)}
            getOptionLabel={(options) => `${options.nombre} - ${options.apellido}`}
            getOptionValue={(options) => options.id}
            placeholder="Selecione el cliente"
            noOptionsMessage={() => "No hay resultados"} />
        </>
      }
    </>
  )
}

export default AsignarCliente
