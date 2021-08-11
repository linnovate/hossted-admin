import { useState, useEffect } from 'react'
import { options, useSession } from 'next-auth/client'
import Layout from '../components/layout'
import AccessDenied from '../components/access-denied'
import dynamic from 'next/dynamic';

const ChartWithNoSSR = dynamic(() => import('react-apexcharts'), {
    ssr: false,
  });

const ApexChart = (props) => {
return <ChartWithNoSSR {...props} />;
};



export default function Page () {
    const [ session, loading ] = useSession()
    const [ graphData, setGraphData] = useState({
        series: [],
        options: {}
    })
  
    // Fetch content from protected route
    useEffect(()=>{
      const fetchData = async () => {
        const res = await fetch('/api/data/get_graph')
        const json = await res.json()
        let data = {}
        data.series = json.series
        data.options = {
            chart: {
                height: 420,
                type: 'line',
                dropShadow: {
                    enabled: true,
                    color: '#000',
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#ff0080', '#006ff3'],
            dataLabels: {
                enabled: true,
            },
            stroke: {
                curve: 'smooth',
            },
            title: {
                text: 'Hours per offer / month',
                align: 'left',
            },
            markers: {
                size: 1,
            },
            xaxis: {
                categories: json.months,
                title: {
                    text: 'Month',
                },
            },
            yaxis: {
                title: {
                    text: 'Hours',
                },
            },
            legend: {
                show: false
            },
        }
        setGraphData(data)
      }
      fetchData()
    },[session])
  
    // When rendering client side don't display anything until loading is complete
    if (typeof window !== 'undefined' && loading) return null



    // If no session exists, display access denied message
    // if (!session) { return  <Layout><AccessDenied/></Layout> }
  
    // If session exists, display content


    return (
      <Layout>
        <ApexChart
        options={graphData.options}
        series={graphData.series}
        type="line"
        height={420}
        />
    </Layout>
      )
  }
