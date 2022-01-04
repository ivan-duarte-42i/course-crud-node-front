import React from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, gql } from '@apollo/client';
import Layout from '../../components/Layout';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2'

const OBTENER_CLIENTE_QUERY = gql`
  query obtenerCliente($id: ID!) {
    obtenerCliente(id: $id)  {
      nombre
      apellido
      empresa
      email
      telefono
    }
  }

`;

const ACTUALIZAR_CLIENTE_QUERY = gql`
  mutation actualizarCliente($id: ID!, $input: ClienteInput) {
    actualizarCliente(id: $id, input: $input) {
      id
      nombre 
      apellido
      empresa
      email
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



const EditarCliente = () => {
  const router = useRouter();
  const { query: { editId } } = router;
  const id = editId;
  const { data, loading } = useQuery(OBTENER_CLIENTE_QUERY, {
    variables: {
      id
    }
  });

  const [ actualizarCliente ] = useMutation(ACTUALIZAR_CLIENTE_QUERY, {
    update(cache, { data: { actualizarCliente } }) {
      // Actulizar Clientes
      const { obtenerClientesVendedor } = cache.readQuery({
        query: OBTENER_CLIENTES_USUARIO_QUERY
      });
      const clientesActualizados = obtenerClientesVendedor.map(cliente =>
        cliente.id === id ? actualizarCliente : cliente
      );
 
      cache.writeQuery({
        query: OBTENER_CLIENTES_USUARIO_QUERY,
        data: {
          obtenerClientesVendedor: clientesActualizados
        }
      });
 
      // Actulizar Cliente Actual
      cache.writeQuery({
        query: OBTENER_CLIENTE_QUERY,
        variables: { id },
        data: {
          obtenerCliente: actualizarCliente
        }
      });
    }
  });

  if(loading) return "cargando...";

  const { obtenerCliente } = data;

  const schemaValidacion = Yup.object({
    nombre: Yup.string().required('El nombre no puede estar vacío'),
    apellido: Yup.string().required('El apellido no puede estar vacío'),
    empresa: Yup.string().required('El empresa no puede estar vacío'),
    email: Yup.string().email("El email no es correcto").required('El email no puede estar vacío'),
  });

  const actualizarClienteSubmit = async (valores) => {
    const { nombre, apellido, email, empresa, telefono } = valores;
    try {
      const { data, loading } = await actualizarCliente({
        variables: {
          id,
          input: {
            nombre, apellido, empresa, email, telefono
          }
        }
      });
      Swal.fire(
        'Actuanlizado!',
        `El cliente ${nombre} ${apellido} se actualizó correctamente`,
        'success',
      );
      router.push('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Layout>
        <h1 className="mb-3 text-3xl font-light text-center text-gray-800">Editar Cliente</h1>

        <div className="flex justify-center mt-5">
          <div className="w-full max-w-lg">
            <Formik
              validationSchema={ schemaValidacion }
              enableReinitialize
              initialValues={ obtenerCliente }
              onSubmit={(valores) => actualizarClienteSubmit(valores)}
            >
              {formik => {
                return (
                  <form className="px-8 pt-6 pb-6 mb-4 bg-white shadow-md" onSubmit={formik.handleSubmit}>
                    { /* NOMBRE */}
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="nombre">Nombre</label>
                      <input id="nombre"
                        onChange={formik.handleChange}
                        value={formik.values.nombre}
                        onBlur={formik.handleBlur}
                        type="text"
                        placeholder="Nombre Cliente"
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-out" />
                    </div>
                    {
                      formik.touched.nombre && formik.errors.nombre ? (
                        <div className="p-4 my-2 text-red-700 bg-red-100 border-l-4 border-red-500">
                          <p className="font-bold">Error!!!</p>
                          <p>{formik.errors.nombre}</p>
                        </div>
                      )
                        : null
                    }
                    { /* APELLIDO */}
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="apellido">Apellido</label>
                      <input id="apellido"
                        onChange={formik.handleChange}
                        value={formik.values.apellido}
                        onBlur={formik.handleBlur}
                        type="text"
                        placeholder="Apellido Cliente"
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-out" />
                    </div>
                    {
                      formik.touched.apellido && formik.errors.apellido ? (
                        <div className="p-4 my-2 text-red-700 bg-red-100 border-l-4 border-red-500">
                          <p className="font-bold">Error!!!</p>
                          <p>{formik.errors.apellido}</p>
                        </div>
                      )
                        : null
                    }
                    { /* EMPRESA */}
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="empresa">Empresa</label>
                      <input id="empresa"
                        onChange={formik.handleChange}
                        value={formik.values.empresa}
                        onBlur={formik.handleBlur}
                        type="text"
                        placeholder="Empresa"
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-out" />
                    </div>
                    {
                      formik.touched.empresa && formik.errors.empresa ? (
                        <div className="p-4 my-2 text-red-700 bg-red-100 border-l-4 border-red-500">
                          <p className="font-bold">Error!!!</p>
                          <p>{formik.errors.empresa}</p>
                        </div>
                      )
                        : null
                    }
                    { /* EMAIL */}
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="email">Email</label>
                      <input id="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        onBlur={formik.handleBlur}
                        type="email"
                        placeholder="Email"
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-out" />
                    </div>
                    {
                      formik.touched.email && formik.errors.email ? (
                        <div className="p-4 my-2 text-red-700 bg-red-100 border-l-4 border-red-500">
                          <p className="font-bold">Error!!!</p>
                          <p>{formik.errors.email}</p>
                        </div>
                      )
                        : null
                    }
                    { /* TELEFONO */}
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="telefono">Teléfono</label>
                      <input id="telefono"
                        onChange={formik.handleChange}
                        value={formik.values.telefono}
                        onBlur={formik.handleBlur}
                        type="tel"
                        placeholder="Teléfono"
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-out" />
                    </div>
                    {
                      formik.touched.telefono && formik.errors.telefono ? (
                        <div className="p-4 my-2 text-red-700 bg-red-100 border-l-4 border-red-500">
                          <p className="font-bold">Error!!!</p>
                          <p>{formik.errors.telefono}</p>
                        </div>
                      )
                        : null
                    }
                    { /* INPUT */}
                    <input
                      type="submit"
                      className="w-full p-2 mt-5 font-bold text-white uppercase bg-gray-800 hover:bg-gray-900"
                      value="Actualizar Cliente" />
                  </form>
                )
              }}
            </Formik>
          </div>
        </div>

      </Layout>
    </>
  )
}

export default EditarCliente
