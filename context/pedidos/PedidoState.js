import React, { useReducer } from 'react';
import PedidoContext from './PedidosContext';
import PedidoReducer from './PedidoReducer';
import { SELECCIONAR_CLIENTE, SELECCIONAR_PRODUCTO, CANTIDAD_PRODUCTOS, ACTUALIZAR_TOTAL } from '../../types';

const PedidoState = ({ children }) => {

  const initialState = {
    cliente: {},
    productos: [],
    total: 0,
  }

  const [state, dispatch] = useReducer(PedidoReducer, initialState);

  const agregarCliente = cliente => {
    dispatch({ type: SELECCIONAR_CLIENTE, payload: cliente });
  }

  const agregarProductos = productosSeleccionados => {
    let nuevoState;
    if (state.productos.length > 0) {
      nuevoState = productosSeleccionados.map(producto => {
        const nuevoObjeto = state.productos.find(productoState => productoState.id === producto.id);
        return { ...producto, ...nuevoObjeto }
      })
    } else {
      nuevoState = productosSeleccionados;
    }
    dispatch({ type: SELECCIONAR_PRODUCTO, payload: nuevoState });
  }

  const agregarCantidad = producto => {
    dispatch({ type: CANTIDAD_PRODUCTOS, payload: producto });
  }

  const actualizarTotal = () => {
    dispatch({ type: ACTUALIZAR_TOTAL });
  }

  return (
    <PedidoContext.Provider value={{
      productos: state.productos,
      total: state.total,
      cliente: state.cliente,
      agregarCliente,
      agregarProductos,
      agregarCantidad,
      actualizarTotal
    }}>{children}</PedidoContext.Provider>
  );
}

export default PedidoState