import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import Layout from '../components/layout'
import AccessDenied from '../components/access-denied'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from 'recharts';



export default function Page () {
    const [ session, loading ] = useSession()
    const [ data, setData] = useState([])
  
    // Fetch content from protected route
    useEffect(()=>{
      const fetchData = async () => {
        const res = await fetch('/api/data/get_graph')
        const json = await res.json()
        if (json.data) { setData(json.data) }
      }
      fetchData()
    },[session])
  
    // When rendering client side don't display anything until loading is complete
    if (typeof window !== 'undefined' && loading) return null
  
    // If no session exists, display access denied message
    if (!session) { return  <Layout><AccessDenied/></Layout> }
  
    // If session exists, display content

    return (
      <Layout>

    <LineChart width={2000} height={500} data={data}
    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="5h62dj741brvrs4okckkznf23" stroke="#8884d8" />
    <Line type="monotone" dataKey="2x6bx53wvx8mv34jrkl2d6si7" stroke="#82ca9d" />
    </LineChart>
    </Layout>
      )
  }
