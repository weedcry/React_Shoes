import Page from "../Pages/Page";
import { Line, Pie, Doughnut, Bar, Radar, Polar } from 'react-chartjs-2';
import { CardBody } from "reactstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";
import { Card, Col, Row } from "react-bootstrap";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

function ChartProduct(){

  const hostname = "https://api-shoes.herokuapp.com"; 
  var tokenStr = localStorage.getItem("token");
  const [slnhaphang, setslnhaphang] = useState([])
  const [slton, setslton] = useState(0)
  
  const config = {
    headers: {"Authorization" : `Bearer_${tokenStr}`}
  };

  useEffect(() => {
    axios.get(hostname+'/api/repository/soluong/year',config)
    .then((Response)=>{
      console.log(Response.data)
      setslnhaphang(Response.data)
    })
    .catch((error) =>{
        console.log("error "+error.response)
    })

    axios.get(hostname+'/api/repository/tonkho',config)
    .then((Response)=>{
      setslton(Response.data)
    })
    .catch((error) =>{
        console.log("error "+error.response)
    })

  }, [])

    const getColor = (availableColor = 'primary') => {
        if (typeof window === 'undefined') {
          return null;
        }
      
        const color = window
          .getComputedStyle(document.documentElement)
          .getPropertyValue(`--${availableColor}`);
      
        return color;
      };

    const MONTHS = []
    for(let i = 1;i <=12 ; i ++){
        MONTHS.push('Tháng '+i)
    }

    const getChartProductData = (moreData = {}, moreData2 = {}) => {
      return {
        labels: MONTHS,
        datasets: [
          {
            label: 'Nhập Hàng',
            backgroundColor: getColor('secondary'),
            borderColor: getColor('secondary'),
            borderWidth: 1,
            data: slnhaphang,
            ...moreData2,
          }
        ],
      };
    };

    var time = new Date();
    var thang = time.getMonth()+1;
    var nam = time.getFullYear();
    var ngay = time.getDate();

    return(
        <>
            <Page title="THỐNG KÊ SẢN PHẨM" breadcrumbs={[{ name: 'Chart Product', active: true }]}>
            <Row style={{marginBottom:20}}>
              <div>
                <h3 style={{color:'red'}}>SỐ LƯỢNG TỒN SẢN PHẨM HIỆN TẠI: {slton} </h3>
              </div>
            </Row>
            <Row>
            <Col xl={10} lg={12} md={12} >
                    <Card>
                        <CardHeader>
                        <p style={{color:'black'}}>Tinh Trạng Nhập Sản Phẩm Năm {nam}</p>
                        </CardHeader>
                        <CardBody>
                        <Line data={getChartProductData({ fill: false }, { fill: false })} />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Page>
       

        </>
    )
}export default ChartProduct;