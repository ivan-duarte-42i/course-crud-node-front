import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/router'

const NUEVA_CUENTA_QUERY = gql`
  mutation nuevoUsuario($input: UsuarioInput) {
    nuevoUsuario(input: $input) {
      id
      nombre 
      apellido
      creado
    }
  }
`;

const NuevaCuenta = () => {
  // state para el mensaje 
  const [ nuevoUsuario ] = useMutation(NUEVA_CUENTA_QUERY);
  const [mensaje, setMensaje] = useState(null);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      nombre: Yup.string()
              .required('El Nombre es Obligatorio'),
      apellido: Yup.string()
                .required('El Apellido es Obligatorio'),
      email: Yup.string()
              .email('El Email no es válido')
              .required("El Email es obligatorio"),
      password: Yup.string()
                .required("La contraseña no puede estar vacía")
                .min(6, "La contraseña debe tener al menos 6 dígitos")
    }),
    onSubmit: async valores => {
      const { nombre, apellido, email, password } = valores; 
      try {
        const { data } = await nuevoUsuario({
          variables: {
            input: {
              nombre: nombre,
              apellido: apellido,
              email: email,
              password: password
            }
          }
        });
        setMensaje(`Se creo correctamente el usuario: ${data.nuevoUsuario.apellido}, ${data.nuevoUsuario.nombre}`)
        setTimeout(() => {
          setMensaje(null);
          router.push('/login');
        }, 3000); 
      } catch (error) {
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

      <h1 className="text-center text-3xl text-white font-light">
        Crear nueva cuenta
     </h1>
     
      {mensaje && mostrarMensaje()}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-sm">
            <form className="bg-white rouded shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
              {/* NOMBRE */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Nombre</label>
                <input id="nombre" value={formik.values.nombre} onChange={formik.handleChange} onBlur={formik.handleBlur} type="text" placeholder="Nombre Usuario" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-out"/>
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

              {/* APELLIDO */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">Apellido</label>
                <input id="apellido" value={formik.values.apellido} onChange={formik.handleChange} onBlur={formik.handleBlur} type="text" placeholder="Apellido Usuario" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-out"/>
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

              {/* EMAIL */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                <input id="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} type="email" placeholder="Email Usuario" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-out"/>
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

              {/* PASSWORD */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Contaseña</label>
                <input id="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} type="password" placeholder="Password Usuario" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-out"/>
              </div>

              {
                formik.touched.password && formik.errors.password ? (
                  <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error!!!1</p>
                  <p>{formik.errors.password}</p>
                  </div>
                ) 
                : null
              }

              {/* SUBMIT FORM BUTTON */}
              <div>
                <input type="submit" value="Crear cuenta" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"/>
              </div>
            </form>
        </div>
      </div>
    </Layout>
  )
}

export default NuevaCuenta
