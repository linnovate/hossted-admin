import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import Layout from '../components/layout'
import AccessDenied from '../components/access-denied'
import DataTable from 'react-data-table-component';
import Head from 'next/head'



const columns = [
    {
      name: 'IP',
      selector: 'ip',
      sortable: true,
    },
    {
      name: 'Date',
      selector: 'date',
      sortable: true
    },
    {
      name: 'URL',
      selector: 'url',
      sortable: true
    },
    {
      name: 'User',
      selector: 'user',
      sortable: true
    },
    {
      name: 'Product',
      selector: 'product',
      sortable: true
    },
    {
      name: 'CPU number',
      selector: 'cpunum',
      sortable: true
    },
    {
      name: 'Mem',
      selector: 'mem',
      sortable: true
    },
    {
      name: 'Root size',
      selector: 'rootsize',
      sortable: true
    },
    {
      name: 'Cloud',
      selector: 'cloud',
      sortable: true
    },
    {
      name: 'Status',
      selector: 'status',
      sortable: true
    },
  ];

export default function Page () {
  const [ session, loading ] = useSession()
  const [ data, setData] = useState([])

  // Fetch content from protected route
  useEffect(()=>{
    const fetchData = async () => {
      const res = await fetch('/api/registry')
      const json = await res.json()
      if (json) { setData(json) }
    }
    fetchData()
  },[session])

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && loading) return null

  // If no session exists, display access denied message
  if (!session) { return  <Layout><AccessDenied/></Layout> }

  // If session exists, display content
  return (
    <>
    <Head>
        <title>Instances</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Layout>
      <DataTable
        title="Instances"
        columns={columns}
        data={data}
      />
  </Layout>
  </>
    )
}
