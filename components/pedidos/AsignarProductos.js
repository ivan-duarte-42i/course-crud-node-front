import React, { useState, useEffect, useContext } from 'react'
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidosContext';

const OBTENER_PRODUCTOS_QUERY = gql`
query obtenerProductos{
  obtenerProductos {
    id
    nombre
    existencia
    precio
    creado
  }
}`;


const AsignarProductos = () => {

  const pedidoContext = useContext(PedidoContext);
  const { agregarProductos } = pedidoContext;

  const [productos, setProductos] = useState([]);
  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS_QUERY);
  
  useEffect(() => {
    agregarProductos(productos);
  }, [productos]);

  if (loading) return "Loading. .. ";
  const { obtenerProductos } = data;


  const seleccionarProductos = productos => {
    setProductos(productos);
  }

  return (
    <>
      {(loading) ? <></>
        : <><p className="p-2 my-2 mt-10 text-sm font-bold text-gray-700 bg-white border-l-4 border-gray-800">2. Selecciona o busca los productos</p>
          <Select
            className="mt-3"
            isMulti
            options={obtenerProductos}
            onChange={options => seleccionarProductos(options)}
            getOptionLabel={(options) => `${options.nombre} - ${options.existencia} Disponibles `}
            getOptionValue={(options) => options.id}
            placeholder="Selecione los productos"
            noOptionsMessage={() => "No hay resultados"} />
        </>
      }
    </>
  )
}

export default AsignarProductos
