import Page from "../Pages/Page";
import { Line, Pie, Doughnut, Bar, Radar, Polar } from 'react-chartjs-2';
import { CardBody } from "reactstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";
import { Card, Col, Row } from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";

function ChartOrder(){
  const hostname = "https://api-shoes.herokuapp.com"; 
  var tokenStr = localStorage.getItem("token");
  const [ttdonhangday, setttdonhangday] = useState([])
  const [ttdonhangmonth, setttdonhangmonth] = useState([])
  const [ttdonhangyear, setttdonhangyear] = useState([])

  const config = {
    headers: {"Authorization" : `Bearer_${tokenStr}`}
  };

    useEffect(() => {

      axios.get(hostname+'/api/orders/ttdonhang/day',config)
      .then((Response)=>{
        console.log(Response.data)
        setttdonhangday(Response.data);
      })
      .catch((error) =>{
          console.log("error "+error.response)
      })

      axios.get(hostname+'/api/orders/ttdonhang/month',config)
      .then((Response)=>{
        console.log(Response.data)
        setttdonhangmonth(Response.data);
      })
      .catch((error) =>{
          console.log("error "+error.response)
      })

      axios.get(hostname+'/api/orders/ttdonhang/year',config)
      .then((Response)=>{
        console.log(Response.data)
        setttdonhangyear(Response.data);
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


      
    const getDataOrder = () => {
        return {
        datasets: [
            {
            // data: [50,125,15, 110],
            data: ttdonhangday,
            backgroundColor: [
              getColor('success'),
              getColor('danger'),
              getColor('primary'),
              getColor('secondary')
              ],
            label: 'Dataset 1',
            },
        ],
        labels: ['Hoàn Thành','Hủy Đơn','Đang Vận Chuyển','Chờ Duyệt' ],
        };
    };


    const getDataOrderMonth = () => {

      return {
      datasets: [
          {
          // data: [50,125,15, 110],
          data: ttdonhangmonth,
          backgroundColor: [
            getColor('success'),
            getColor('danger'),
            
            ],
          label: 'Dataset 1',
          },
      ],
      labels: ['Hoàn Thành','Hủy Đơn'],
      };
  };

    const MONTHS = []
    for(let i = 1;i <=12 ; i ++){
        MONTHS.push('Tháng '+i)
    }

    const getChartOrderData = (moreData = {}, moreData2 = {}) => {
      var arrCancel = []
      var arrSuccess = []
      for(let i = 0 ; i<ttdonhangyear.length;i++){
        let arr = ttdonhangyear[i].split("-")
        arrCancel.push(arr[1]);
        arrSuccess.push(arr[0]);
      }


      return {
        labels: MONTHS,
        datasets: [
         
          {
            label: 'Hủy Đơn',
            backgroundColor: getColor('danger'),
            borderColor: getColor('danger'),
            borderWidth: 1,
            data: [13,14,8,17,28,35,17],
            data: arrCancel,
            ...moreData2,
          },
          {
            label: 'Thành Công',
            backgroundColor: getColor('success'),
            borderColor: getColor('success'),
            borderWidth: 1,
            data: arrSuccess,
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
            <Page title="THỐNG KÊ HÓA ĐƠN" breadcrumbs={[{ name: 'Chart Order', active: true }]}>
            <Row>
              <Col xl={6} lg={12} md={12}>
                <Card>
                  <CardHeader>
                  <p style={{color:'black'}}>Biểu Đồ Tình Trạng Đơn Hàng Trong Ngày {ngay} </p>
                  </CardHeader>
                  <CardBody>
                  <Doughnut data={getDataOrder()} />
                  </CardBody>
                </Card>
              </Col>

              <Col xl={6} lg={12} md={12}>
                <Card>
                  <CardHeader>
                  <p style={{color:'black'}}>Biểu Đồ Đơn Hàng Trong Tháng {thang}</p>
                  </CardHeader>
                  <CardBody>
                  <Doughnut data={getDataOrderMonth()} />
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <div style={{marginTop:50}}>
                <h1> Biểu Đồ Năm {nam} </h1>
            </div>
            <Row>
                <Col xl={10} lg={12} md={12} >
                    <Card>
                        <CardHeader>
                        <p style={{color:'black'}}>Biểu Đồ  tổng Đơn Hàng Trong Năm {nam} </p>
                        </CardHeader>
                        <CardBody>
                        <Line data={getChartOrderData({ fill: false }, { fill: false })} />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Page>
       

        </>
    )
}export default ChartOrder;