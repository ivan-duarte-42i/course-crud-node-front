import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { useMutation, gql } from '@apollo/client';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

const GUARDAR_PRODUCTO_QUERY = gql`
mutation nuevoProducto($input: ProductoInput) {
  nuevoProducto(input: $input) {
    id
    nombre
    existencia
    precio
    creado
  }
}`;

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


const NuevoProducto = () => {
  const router = useRouter();
  const [mensaje, setMensaje] = useState(null);
  const [ nuevoProducto ] = useMutation(GUARDAR_PRODUCTO_QUERY, {
    update(cache, { data: { nuevoProducto } }) {
      const { obtenerProductos } = cache.readQuery({ query: OBTENER_PRODUCTOS_QUERY });
      cache.writeQuery({
        query: OBTENER_PRODUCTOS_QUERY,
        data: {
          obtenerProductos: [...obtenerProductos, nuevoProducto]
        }
      });
    } 
  });

  const formik = useFormik({
    initialValues: {
      nombre: '',
      existencia: '',
      precio: '',
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required('El nombre no puede estar vacío'),
      existencia: Yup.number().required('La existencia no puede estar vacía').positive("Solo valores positivos").integer("Debe ser un numero entero"),
      precio: Yup.number().required('El precio no puede estar vacío').positive("El precio debe ser positivo"),
    }),
    onSubmit: async valores => {
      const { nombre, existencia, precio } = valores;
      
      try {
        const { data } = await nuevoProducto({
          variables: {
            input: {
              nombre,
              existencia,
              precio,
            }
          }
        });
        Swal.fire(
          'Guardado!',
          `El producto ${nombre} fue guardado correctamente`,
          'success',
        );
        router.push('/productos');
      } catch (error) {
        console.log({ error });
        setMensaje(error.message.replace('GraphQL error: ', ''));
        setTimeout(() => {
          setMensaje(null);
        }, 3000);
      }
    }
  });

  const mostrarMensaje = () => {
    return (
      <div className="py-2 px-3 w-wull my-3 bg-amber-300 max-w-sm text-center mx-auto">
        <p>{mensaje}</p>
      </div>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl text-gray-800 font-light mb-3">Nuevo Producto</h1>

      {mensaje && mostrarMensaje()}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form className="bg-white shadow-md px-8 pt-6 pb-6 mb-4" onSubmit={formik.handleSubmit} >
            { /*  NOMBRE  */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Nombre</label>
              <input id="nombre"
                onChange={formik.handleChange}
                value={formik.values.nombre}
                onBlur={formik.handleBlur}
                type="text"
                placeholder="Nombre nuevo producto"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-out" />
            </div>
            {
              formik.touched.nombre && formik.errors.nombre ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error!!!</p>
                  <p>{formik.errors.nombre}</p>
                </div>
              )
                : null
            }
            { /*  EXISTENCIA */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existencia">Existencia</label>
              <input id="existencia"
                onChange={formik.handleChange}
                value={formik.values.existencia}
                onBlur={formik.handleBlur}
                type="number"
                placeholder="Existencia"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-out" />
            </div>
            {
              formik.touched.existencia && formik.errors.existencia ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error!!!</p>
                  <p>{formik.errors.existencia}</p>
                </div>
              )
                : null
            }
            {  /* PRECIO */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">Precio</label>
              <input id="precio"
                onChange={formik.handleChange}
                value={formik.values.precio}
                onBlur={formik.handleBlur}
                type="number"
                placeholder="Precio producto"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-out" />
            </div>
            {
              formik.touched.precio && formik.errors.precio ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error!!!</p>
                  <p>{formik.errors.precio}</p>
                </div>
              )
                : null
            }
            {  /* INPUT */}
            <input
              type="submit"
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
              value="Guardar Producto" />
          </form>
        </div>
      </div>


    </Layout>
  )
}

export default NuevoProducto
