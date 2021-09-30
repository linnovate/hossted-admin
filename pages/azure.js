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
        const res = await fetch('/api/data/get_azure_detailed')
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
            colors: ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#000000'],
            dataLabels: {
                enabled: true,
            },
            stroke: {
                curve: 'smooth',
            },
            title: {
                text: 'HOSSTED Azure usage',
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
    if (!session) { return  <Layout><AccessDenied/></Layout> }
  
    // If session exists, display content


    return (
    //   <Layout>
        /* <ApexChart
        options={graphData.options}
        series={graphData.series}
        type="line"
        height={420}
        /> */
    <iframe className='kibana-iframe' src="https://kibana-14.dev.aks.linnovate.net/app/visualize#/edit/d51da2d0-13cf-11ec-99da-bb9b9b878429?embed=true&_g=(filters%3A!()%2CrefreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-1y%2Fd%2Cto%3Anow))" height="600" width="800"></iframe>
    // <iframe className='kibana-iframe' src="https://kibana-14.dev.aks.linnovate.net/app/visualize#/edit/b0dc61f0-13c9-11ec-99da-bb9b9b878429?embed=true&_g=(filters%3A!()%2CrefreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-1y%2Fd%2Cto%3Anow))"></iframe>
    /* </Layout> */
      )
  }
