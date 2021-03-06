import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Sidebar = () => {

  // routeing de next 
  const router = useRouter();

  return (
    <aside className="p-5 bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen">
      <div>
        <p className="text-3xl font-black text-white ">
          CRM CLIENTE
        </p>
      </div>
      <nav className="mt-5 list-none">
        <li className={router.pathname === "/" ? 'bg-blue-800 p-2' : 'p-2'}> 
          <Link href="/">
            <a className="block text-2xl text-white">Clientes</a>
          </Link>
        </li> 
        <li className={router.pathname === "/pedidos" ? 'bg-blue-800 p-2' : 'p-2'}> 
          <Link href="/pedidos">
            <a className="block text-2xl text-white">Pedidos</a>
          </Link>
        </li> 
        <li className={router.pathname === "/productos" ? 'bg-blue-800 p-2' : 'p-2'}> 
          <Link href="/productos">
            <a className="block text-2xl text-white">Productos</a>
          </Link>
        </li> 
      </nav>

      <div className="sm:mt-10">
        <p className="text-3xl font-black text-white ">
          ESTADISTICAS
        </p>
      </div>
      <nav className="mt-5 list-none">
        <li className={router.pathname === "/mejoresvendedores" ? 'bg-blue-800 p-2' : 'p-2'}> 
          <Link href="/mejoresvendedores">
            <a className="block text-2xl text-white">Mejores Vendedores</a>
          </Link>
        </li> 
        <li className={router.pathname === "/mejoresclientes" ? 'bg-blue-800 p-2' : 'p-2'}> 
          <Link href="/mejoresclientes">
            <a className="block text-2xl text-white">Mejores Cliente</a>
          </Link>
        </li> 
      </nav>
    </aside>
  )
}

export default Sidebar
