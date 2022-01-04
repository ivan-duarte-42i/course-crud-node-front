import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/router'

const AUTENTICAR_USUARIO_QUERY = gql`
  mutation autenticarUsuario($input: AutenticarInput) {
    autenticarUsuario(input: $input) {
      token
    }
  } 
`; 

const Login = () => {

  const router = useRouter();
  const [ autenticarUsuario ] = useMutation(AUTENTICAR_USUARIO_QUERY); 
  const [ mensaje, setMensaje ] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email("El email no es válido").required('El email no puede estar vacío'),
      password: Yup.string().required('La constrañse es obligatoria'),
    }),
    onSubmit: async valores => {
      const { email, password } = valores;
      try {
        const { data } = await autenticarUsuario({
          variables: {
            input: {
              email: email,
              password: password
            }
          }
        });
        const { token } = data.autenticarUsuario;
        setMensaje(`Se inicio sesion con el token: ${token}`)
        localStorage.setItem('token', token);
        router.push('/');
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
        Login
      </h1>

      {mensaje && mostrarMensaje()}

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-sm">
            <form className="bg-white rouded shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                <input id="email" onChange={formik.handleChange} value={formik.values.email} onBlur={formik.handleBlur} type="email" placeholder="Email Usuario" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-out"/>
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

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Contraseña</label>
                <input id="password" onChange={formik.handleChange} value={formik.values.password} onBlur={formik.handleBlur} type="password" placeholder="Password Usuario" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-out"/>
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

              <div>
                <input type="submit" value="Iniciar Sesión" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"/>
              </div>
            </form>
        </div>
      </div>
    </Layout>
  )
}

export default Login
