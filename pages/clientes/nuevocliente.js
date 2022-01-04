import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/router'

const NUEVO_CLIENTE_QUERY = gql`
  mutation nuevoCliente($input: ClienteInput){
    nuevoCliente(input: $input) {
      id 
      nombre
      apellido
      empresa
      telefono
    }
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

const NuevoCliente = () => {
  const router = useRouter();
  const [ mensaje, setMensaje ] = useState(null);

  const [ nuevoCliente ] = useMutation(NUEVO_CLIENTE_QUERY, {
    update(cache, { data: { nuevoCliente } } ) {
      const { obtenerClientesVendedor } = cache.readQuery({ query: OBTENER_CLIENTES_USUARIO_QUERY });
      cache.writeQuery({
        query: OBTENER_CLIENTES_USUARIO_QUERY,
        data: {
          obtenerClientesVendedor: [...obtenerClientesVendedor, nuevoCliente]
        }
      });
    }
  });

  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      empresa: '',
      email: '',
      telefono: '',
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required('El nombre no puede estar vacío'),
      apellido: Yup.string().required('El apellido no puede estar vacío'),
      empresa: Yup.string().required('El empresa no puede estar vacío'),
      email: Yup.string().email("El email no es correcto").required('El email no puede estar vacío'),
    }),
    onSubmit: async valores => {
      const { nombre, apellido, empresa, email, telefono } = valores;
      try {
        const { data } = await nuevoCliente({
          variables: {
            input: {
              nombre,
              apellido,
              empresa,
              email,
              telefono
            }
          }
        });
        router.push('/');
      } catch (error) {
        console.log({error});
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
      <h1 className="text-3xl text-gray-800 font-light mb-3">Nuevo Cliente</h1>
      {mensaje && mostrarMensaje()}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form className="bg-white shadow-md px-8 pt-6 pb-6 mb-4" onSubmit={formik.handleSubmit}>
            { /* NOMBRE */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Nombre</label>
              <input id="nombre"
                onChange={formik.handleChange}
                value={formik.values.nombre}
                onBlur={formik.handleBlur}
                type="text"
                placeholder="Nombre Cliente"
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
            { /* APELLIDO */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">Apellido</label>
              <input id="apellido"
                onChange={formik.handleChange}
                value={formik.values.apellido}
                onBlur={formik.handleBlur}
                type="text"
                placeholder="Apellido Cliente"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-out" />
            </div>
            {
              formik.touched.apellido && formik.errors.apellido ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error!!!</p>
                  <p>{formik.errors.apellido}</p>
                </div>
              )
                : null
            }
            { /* EMPRESA */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="empresa">Empresa</label>
              <input id="empresa"
                onChange={formik.handleChange}
                value={formik.values.empresa}
                onBlur={formik.handleBlur}
                type="text"
                placeholder="Empresa"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-out" />
            </div>
            {
              formik.touched.empresa && formik.errors.empresa ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error!!!</p>
                  <p>{formik.errors.empresa}</p>
                </div>
              )
                : null
            }
            { /* EMAIL */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
              <input id="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                onBlur={formik.handleBlur}
                type="email"
                placeholder="Email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-out" />
            </div>
            {
                formik.touched.email && formik.errors.email ? (
                  <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error!!!</p>
                  <p>{formik.errors.email}</p>
                  </div>
                ) 
                : null
              }
            { /* TELEFONO */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">Teléfono</label>
              <input id="telefono"
                onChange={formik.handleChange}
                value={formik.values.telefono}
                onBlur={formik.handleBlur}
                type="tel"
                placeholder="Teléfono"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-out" />
            </div>
            {
              formik.touched.telefono && formik.errors.telefono ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error!!!</p>
                  <p>{formik.errors.telefono}</p>
                </div>
              )
                : null
            }
            { /* INPUT */}
            <input
              type="submit"
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
              value="Registrar Cliente" />
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default NuevoCliente
