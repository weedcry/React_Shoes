import '../../assets/css/demo-11.css'
import './style1.css'
import 'owl.carousel/dist/assets/owl.carousel.css';  
import 'owl.carousel/dist/assets/owl.theme.default.css';  
import Item from './item.js'
import { Zoom } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import Slide1 from '../../assets/images/background-shoes-1.jpg';
import Slide2 from '../../assets/images/background-shoes-2.jpg';
import './style.js'
import './nouislider.css'
import {useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { MdSearch } from 'react-icons/md';
import { Form, Input } from 'reactstrap';
import React from 'react';
import { Slide } from 'react-slideshow-image';

function Home(props){
    let history = useHistory();
    const hostname = "https://api-shoes.herokuapp.com";  
    // var filter = "";
    var PageSizeHome = 4;
    const [listProductNew, setlistProductNew] = useState([])
    const [listProductSale, setlistProductSale] = useState([])
    const [listProductSelling, setlistProductSelling] = useState([])
    const [listProductCategory, setlistProductCategory] = useState([])
    const [category, setcategory] = useState([])
    const [titleCategory, settitleCategory] = useState("")
    const [listSale, setlistSale] = useState([])
    useEffect(() =>{   
        axios.get(hostname+'/api/discount/get')
        .then((Response)=>{
                console.log(" get list sale success")
                setlistSale(Response.data)
            })
        axios.get(hostname+'/api/category/get')
        .then((Response)=>{
                console.log(" get list category success")
                setcategory(Response.data)

                // 
                getListProductNew();
                // getListProductRating();
                // getListProductSale();
                // getListProductCategory();
            })
        .catch((error) =>{
                console.log("error "+error.response)
        })

    }, []);


    const getListProductNew = ()=>{
        axios.get(hostname+'/api/product/page?page=1&size='+PageSizeHome+'&order=DESC')
        .then((Response)=>{
                console.log(" get list product new success")
                setlistProductNew(Response.data.listResult)
            })
        .catch((error) =>{
                console.log("error "+error.response)
        })
    }

    const getListProductRating = ()=>{
        axios.get(hostname+'/api/product/page?page=1&size='+PageSizeHome+'&order=DESC&sort=rating')
        .then((Response)=>{
                console.log(" get list product rating success")
                setlistProductSelling(Response.data.listResult)
               
            })
        .catch((error) =>{
                console.log("error "+error.response)
        })
    }


    const getListProductSale = ()=>{
        axios.get(hostname+'/api/product/page/sale/'+PageSizeHome)
        .then((Response)=>{
                console.log(" get list product sale success")
                setlistProductSale(Response.data)
            })
        .catch((error) =>{
                console.log("error "+error.response)
        })
    }

    const getListProductCategory = () =>{
        var categorys = [];
        category.filter((cate)=>{
            categorys.push(cate.id)
        })
        // const ids = categorys[Math.floor(Math.random() * categorys.length)];
        const ids = 5;

        // get title
        var tit ;
        category.filter((cate)=>{
            if(cate.id == ids){
                tit = cate.description;
                return tit;
            }
        })
        settitleCategory(tit)

        axios.get(hostname+'/api/product/page/random?limit='+PageSizeHome+'&category='+ids)
        .then((Response)=>{
                console.log(" get list product category success")
                setlistProductCategory(Response.data)
            })
        .catch((error) =>{
                console.log("error "+error.response)
        })
    }


    const searchProduct =() =>{
        var title = document.getElementById("ws").value;
        if(title === ""){
            return false;
        }
        history.push("/product?title="+title)
    }

  

    return(
       
        <>        
        <Slideshow></Slideshow>
        <main className="main"> <br/>
                <div className="container">
                    <aside className="col-lg-4">
                        <div className="sidebar">
                           
                        </div>
                    </aside>
                    <div className="toolbox toolbox-filter">
                        <div className="toolbox-left">
                        <div className="widget widget-search">
                                <h3 className="widget-title">Search</h3>
                                <Form inline className="cr-search-form">
                                <MdSearch
                                onClick={searchProduct} style={{marginLeft:10,cursor:'pointer'}} size="25"
                                className="cr-search-form__icon-search text-secondary"/>
                                <Input  style={{marginLeft:10,width: 350}} type="search" autoComplete="off"
                                className="cr-search-form__input" placeholder="Search in  product..."  id="ws"/>
                                </Form>
                        </div>
                        </div>
                        <div className="toolbox-right">
                        </div>
                    </div>
                    <div className="products-container" data-layout="fitRows">
                        <div>
                            <h2 className="title text-center mb-4" style={{color:'#CC9966'}} >Sản Phẩm Mới</h2>
                            {listProductNew.map((product) => (
                                <Item login={props.login} product={product} checks="1" sales={listSale}  setWL={props.setWL} setSC={props.setSC} ></Item>
                            ))}
                           
                        </div>
                        <div style={{marginTop:500,marginBottom:350}}>
                            <h2 className="title text-center mb-4" style={{color:'#CC9966'}}>Sản Phẩm Bán Chạy</h2>
                            {listProductSelling.map((product) => (
                                <Item login={props.login} product={product} checks="3" sales={listSale}  setWL={props.setWL} setSC={props.setSC}  ></Item>
                            ))}
                        </div>
                        <div style={{marginTop:500,marginBottom:350}}>
                            <h2 className="title text-center mb-4" style={{color:'#CC9966'}}>Sản Phẩm Đang Giảm Giá</h2>
                            {listProductSale.map((product) => (
                                <Item login={props.login} product={product} checks="2" sales={listSale}  setWL={props.setWL} setSC={props.setSC}  ></Item>
                            ))}
                        </div>
                        <div style={{marginTop:500,marginBottom:350}}>
                            <h2 className="title text-center mb-4" style={{color:'#CC9966'}}>{titleCategory}</h2>
                            {listProductCategory.map((product) => (
                                <Item login={props.login}  product={product} sales={listSale}  setWL={props.setWL} setSC={props.setSC}  ></Item>
                            ))}
                        </div>
                    </div>
                </div>
                <div class="more-container text-center mt-0 mb-7">
                         <Link to="/product" class="btn btn-outline-dark-3 btn-more">
                             <span>more products</span>
                             <i className="icon-long-arrow-right"></i>
                             {/* <i class="la la-refresh"></i> */}
                        </Link>
                      
                </div>
            </main>
            <button id="scroll-top" title="Back to Top"><i class="icon-arrow-up"></i></button>
        </>
    )
}
export default Home;

const images = [
    Slide1,Slide2
  ];

const Slideshow = () => {
    return (
    //   <div className="slide-container">
    //     <Zoom scale={0.1}>
    //       {
    //         images.map((each, index) => <img key={index} style={{width: "100%"}} src={each} />)
    //       }
    //     </Zoom>
    //   </div>
    <div>
        <Slide easing="ease">
        {images.map((each, index) =>(
            <div className="each-slide">
            <div style={{'backgroundImage': `url(${each})`}}>
            </div>
          </div>
        ))
        }
        </Slide>
      </div>
    )
}


