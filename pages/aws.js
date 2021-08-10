import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import Layout from '../components/layout'
import AccessDenied from '../components/access-denied'
import DataTable from 'react-data-table-component';

const results = [];

const columns = [
  {
    name: 'User Id',
    selector: 'Customer Reference ID',
    sortable: true,
  },
  {
    name: 'Product Title',
    selector: 'Product Title',
    sortable: true,
    right: true,
  },
];

export default function Page () {
  const [ session, loading ] = useSession()
  const [ content , setContent ] = useState()
  const [ data, setData] = useState([])

  // Fetch content from protected route
  useEffect(()=>{
    const fetchData = async () => {
      const res = await fetch('/api/examples/protected')
      const json = await res.json()
      if (json.content) { setContent(json.content) }
    }
    const getTableData = async () => {
      const res = await fetch('/api/data/get')
      const json = await res.json()
      if (json.data) { setData(json.data) }
    }
    fetchData()
    getTableData()
  },[session])

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && loading) return null

  // If no session exists, display access denied message
  if (!session) { return  <Layout><AccessDenied/></Layout> }

  // If session exists, display content
  return (
    <Layout>
      <DataTable
        title="Test data"
        columns={columns}
        data={data}
      />
      <p><strong>{content || "\u00a0"}</strong></p>
  </Layout>
    )
}
