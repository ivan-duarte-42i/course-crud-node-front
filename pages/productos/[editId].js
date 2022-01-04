import React from 'react'
import { useRouter } from 'next/router';
import { useQuery, useMutation, gql } from '@apollo/client';
import Layout from '../../components/Layout';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2'

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

const OBTENER_PRODUCTO_QUERY = gql`
query obtenerCliente($id: ID!) {
  obtenerProducto(id: $id){
    id 
    nombre 
    existencia
    precio
    creado
  }
}`;

const EDITAR_PRODUCTO_QUERY = gql`
mutation actualizarProducto($id: ID!, $input: ProductoInput) {
  actualizarProducto(id: $id, input: $input) {
    id
    nombre
    precio
    existencia
  }
}`;


const EditarProducto = () => {
  const router = useRouter();
  const { query: { editId } } = router;
  const id = editId;
  const { obtenerProducto } = {};
  const [editarProducto] = useMutation(EDITAR_PRODUCTO_QUERY);

  const { data, loading } = useQuery(OBTENER_PRODUCTO_QUERY, {
    variables: {
      id
    }
  });
  if (!loading) obtenerProducto = data.obtenerProducto;

  const schemaValidacion = Yup.object({
    nombre: Yup.string().required('El nombre no puede estar vacío'),
    existencia: Yup.number().required('La existencia no puede estar vacía').positive("Solo valores positivos").integer("Debe ser un numero entero"),
    precio: Yup.number().required('El precio no puede estar vacío').positive("El precio debe ser positivo"),
  });

  const actualizarProductoSubmit = async (valores) => {
    const { nombre, existencia, precio } = valores;
    try {
      const { data, loading } = await editarProducto({
        variables: {
          id,
          input: {
            nombre, existencia, precio
          }
        }
      });
      Swal.fire(
        'Actuanlizado!',
        `El producto ${nombre} se actualizó correctamente`,
        'success',
      );
      router.push('/productos')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout>
      {
        (!obtenerProducto) ? <></>
          :
          <>
            <h1 className="text-3xl text-gray-800 font-light mb-3 text-center">Editar Producto</h1>

            <div className="flex justify-center mt-5">
              <div className="w-full max-w-lg">
                <Formik
                  validationSchema={schemaValidacion}
                  enableReinitialize
                  initialValues={obtenerProducto}
                  onSubmit={(valores) => actualizarProductoSubmit(valores)}
                >
                  {formik => {
                    return (
                      <form className="bg-white shadow-md px-8 pt-6 pb-6 mb-4" onSubmit={formik.handleSubmit}>
                        { /* NOMBRE */}
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Nombre Producto</label>
                          <input id="nombre"
                            onChange={formik.handleChange}
                            value={formik.values.nombre}
                            onBlur={formik.handleBlur}
                            type="text"
                            placeholder="Nombre Producto"
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
                        { /* EXISTENCIA */}
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
                        { /* Precio */}
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">Precio</label>
                          <input id="precio"
                            onChange={formik.handleChange}
                            value={formik.values.precio}
                            onBlur={formik.handleBlur}
                            type="text"
                            placeholder="Precio"
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
                        { /* INPUT */}
                        <input
                          type="submit"
                          className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                          value="Actualizar Cliente" />
                      </form>
                    )
                  }}
                </Formik>
              </div>
            </div>
          </>
      }

    </Layout>
  )
}

export default EditarProducto
