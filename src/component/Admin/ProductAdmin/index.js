import Page from '../Pages/Page';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import { Button, ButtonGroup, Dropdown, DropdownButton, Image, Pagination} from 'react-bootstrap';
import './style1.css'
import axios from 'axios';
import AddNewProduct from './AddNewProduct';
import PropertiesProduct from './PropertiesProduct';
import { MdSearch } from 'react-icons/md';
import { Form, Input } from 'reactstrap';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Notifications from 'react-notifications/lib/Notifications';
import Notification from 'react-notifications/lib/Notification';
import { left } from '@popperjs/core';

function ProductAdmin () {
  
  const [show, setShow] = useState(false);
  const [showProper, setshowProper] = useState(false)
  const [products, setProducts] = useState([])
  const [pro, setpro] = useState([])
  const [category, setcategory] = useState([])
  const [addProducts, setaddProducts] = useState({name:""})
  const [updateProduct, setupdateProduct] = useState("")
  const [totalpage, settotalpage] = useState(0)
  const [pagepresent, setpagepresent] = useState(0)
  const [statusPro, setstatusPro] = useState("ACTIVE")
  const [active, setactive] = useState("1")
  const [listSale, setlistSale] = useState([])
  const hostname = "https://api-shoes.herokuapp.com";  
  var PageSize = 8;

  const handleShow = () =>{
    setShow(true)
  } ;

  const handleShowProper = (e) =>{
      var produ ;
      products.filter((product)=>{
        if(product.id === e){
          produ = product;
          return produ;
        }
      })
      setpro(produ)
      setshowProper(true)
  } ;

  useEffect(() => {
    axios.get(hostname+'/api/product/page?page=1&size='+PageSize)
    .then((Response)=>{
          console.log(" get list product success")  
          const data = Response.data;
          settotalpage(data.totalpage)
          setpagepresent(data.page)
          console.log(" get list "+data.listResult.length)
          getCategory();  
          setTimeout(() => {
            setProducts(data.listResult)
        }, 1000);

        })
    .catch((error) =>{
            console.log("error "+error.response)
        })

        // sale
        axios.get(hostname+'/api/discount/get')
        .then((Response)=>{
                console.log(" get list sale success")
                setlistSale(Response.data)
            })
        .catch((error) =>{
              console.log("error "+error.response)
      })

  }, [])

  const getCategory=()=>{
   axios.get(hostname+'/api/category/get')
    .then((Response)=>{
          console.log(" get list category success")  
          const data = Response.data;
          
          setTimeout(() => {
            setcategory(data)
        }, 1000);
        })
    .catch((error) =>{
            console.log("error "+error.response)
        })
  }

  const showCategory = (e) =>{
    var u;
      category.filter((cat)=>{
        if(cat.id == e){
          u = cat.description;
          return u;
        }
      })
      return u;
  }

   // update product
   let temp = [];
   if(updateProduct !== ""){
    setupdateProduct("")  
    products.filter((pro,index)=>{
     if(pro.id === updateProduct.id){
       if(updateProduct.status == statusPro){
         pro = updateProduct
         // setupdateProduct("")     
       }else{
         products.splice(index,1)
         // setupdateProduct("")    
       }
       setupdateProduct("")  
     }
   })
 }


  let JsxContent = products.map((product,index) => {
          return<> 
                 <tr onClick={(e)=>handleShowProper(product.id)} >
                    <th style={{color:'#212529', fontWeight:600}} scope="row">{((pagepresent-1)*PageSize)+index+1}</th>
                    <th style={{color:'#212529',fontWeight:400}}>{product.id}</th>
                    <td>
                    <Image src={product.listimage[0].url} style={{width:80,height:50}}/> 
                    </td>
                    <th style={{color:'#212529',fontWeight:400}}>{product.name}</th>
                    <th style={{color:'#212529',fontWeight:400}}>{product.price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</th>
                    <th style={{color:'#212529',fontWeight:400}}>{showCategory(product.categoryid)}</th>
                    <th style={{color:'#212529',fontWeight:400}}>
                      {(product.discount !== null?
                        <p style={{color:'black'}}>{product.discount}</p>
                        :
                        <p style={{color:'black'}}>Kh??ng</p>
                        )}
                    </th>
                    <th style={{color:'#212529',fontWeight:400}}>
                      {(product.status == "ACTIVE"?
                      <p style={{color:'blue'}}>{product.status}</p>
                      :
                      <p style={{color:'red'}}>{product.status}</p>
                      )}
                      </th>
                 </tr>
              </>
        })

      // 
      if(addProducts.name != "" && pagepresent === totalpage && addProducts.status === statusPro){
        let arr = []
        products.filter((pro)=>{
          arr.push(pro)
        })
        arr.push(addProducts)
        setaddProducts({name:""})
        setProducts(arr)
      }

      const prevpage =() =>{
        let number = pagepresent - 1;
        axios.get(hostname+'/api/product/page?page='+number+'&size='+PageSize+"&status="+statusPro)
        .then((Response)=>{
          console.log(" get list product success")  
          const data = Response.data;
          settotalpage(data.totalpage)
          setpagepresent(data.page)
          setProducts(data.listResult)
            })
        .catch((error) =>{
                console.log("error "+error.response)
            })
    }

    const getFilterSearch =()=>{
      var title = document.getElementById("ws").value;
      searchProduct(title)
  }

    const searchProduct =(e) =>{
      // if(title === "") return false;
      axios.get(hostname+'/api/product/page?page=1&size='+PageSize+"&status="+statusPro+'&title='+e)
      .then((Response)=>{
          console.log(" get list product success")  
          const data = Response.data;
          settotalpage(data.totalpage)
          setpagepresent(data.page)
          setProducts(data.listResult)
          })
      .catch((error) =>{
              console.log("error "+error.response)
          })
  }

    const nextpage =() =>{
      let number = pagepresent + 1;
      axios.get(hostname+'/api/product/page?page='+number+'&size='+PageSize+"&status="+statusPro)
        .then((Response)=>{
          console.log(" get list product success")  
          const data = Response.data;
          settotalpage(data.totalpage)
          setpagepresent(data.page)
          setProducts(data.listResult)
            })
        .catch((error) =>{
                console.log("error "+error.response)
            })
      }

      const changepage =(e) =>{
        var number = (e.target.text);
        axios.get(hostname+'/api/product/page?page='+number+'&size='+PageSize+"&status="+statusPro)
        .then((Response)=>{
            console.log(" get list product success")  
            const data = Response.data;
            settotalpage(data.totalpage)
            setpagepresent(data.page)
            setProducts(data.listResult)
            })
        .catch((error) =>{
                console.log("error "+error.response)
            })
    }

    const handleClick=(e)=>{
      setstatusPro(e.target.value)
      axios.get(hostname+'/api/product/page?page=1&size='+PageSize+'&status='+e.target.value)
      .then((response) => {
        const data = response.data;
        settotalpage(data.totalpage)
        setpagepresent(data.page)
       
        setTimeout(() => {
          setProducts(data.listResult)
      }, 1000);
      })
      .catch((error) => {
        console.log(error.response.data.message)
      })
    }

    const filterPrice =(e)=>{
      axios.get(hostname+'/api/product/page?page=1&size='+PageSize+"&sort=price"+"&order="+e+"&status="+statusPro)
      .then((Response)=>{
        const data = Response.data;
        settotalpage(data.totalpage)
        setpagepresent(data.page)
       
          setTimeout(() => {
            setProducts(data.listResult)
        }, 1000);
          })
      .catch((error) =>{
              console.log("error "+error.response)
          }) 
  }

    const filterALL =()=>{
      axios.get(hostname+'/api/product/page?page=1&size='+PageSize+"&status="+statusPro)
      .then((Response)=>{
        const data = Response.data;
        settotalpage(data.totalpage)
        setpagepresent(data.page)
       
          setTimeout(() => {
            setProducts(data.listResult)
        }, 1000);
          })
      .catch((error) =>{
              console.log("error "+error.response)
          }) 
  }

    const filterProduct=(e)=>{
      if(e === "1"){
          setactive("1")
          filterALL();
      }else if(e === "2"){
          setactive("2")
          filterPrice('ASC')
      }else if(e === "3"){
          setactive("3")
          filterPrice('DESC')
      }else{
          setactive("4")
          // let id ;
          // categorys.filter((cate)=>{
          //     if(cate.name == e){
          //         id = cate.id;
          //         return id;
          //     }
          // })
          // filterCategory(id)
      }
    }
      

         //setting pagination
         let actives = pagepresent;
         let items = [];
         for (let number = 1; number <= totalpage; number++) {
             items.push(
                 <Pagination.Item onClick={(e) => changepage(e)}  key={number} active={number === actives}>
                     {number}
                 </Pagination.Item>,
             );
         }
         let startItem = (actives-1)*8 +1;
         let endItem = startItem + products.length - 1;

         const test=()=>{
          NotificationManager.success('Success message', 'Title here');
      }
  

  return (
    <Page
      title="S???n Ph???m"
      breadcrumbs={[{ name: 'Product', active: true }]}
      className="TablePage"
    >
      <Row>
        <Col >
        {
                <Notification text="av" />
        }
          <Button variant="outline-primary" size='sm' className="btntest"  onClick={handleShow}  >Th??m S???n Ph???m</Button>
          <AddNewProduct shows={show} closes={setShow} addpro={setaddProducts}  title="Th??m M???i S???n Ph???m" />
          <PropertiesProduct  shows={showProper} products={pro}  updatess={setupdateProduct}  sales={listSale} closes={setshowProper} title="Chi Ti???t S???n Ph???m"  />
          <div  style={{textAlign:'end'}}>
              <ButtonGroup onClick={(e)=>handleClick(e)} style={{textAlign:'end'}}>
                  <Button style={{width:150,color:'blue'}} className="btntest"  id="ACTIVE" value = "ACTIVE" >Ho???t ?????ng</Button>
                  <Button  style={{width:150,color:'red',marginLeft:10}} className="btntest" id="INACTIVE" value = "INACTIVE" >Ch??a Ho???t ?????ng</Button>
              </ButtonGroup>
           </div>
        </Col>
      </Row>
        <Row>
          <Col>
            <Card className="mb-3">
              <CardHeader>S???n Ph???m</CardHeader>
                <Row style={{textAlign:'end'}} >
                  <div style={{display:'flex'}}>
                  <Form inline className="cr-search-form">
                    <MdSearch
                      onClick={getFilterSearch}
                      style={{marginLeft:10,marginBottom:10,cursor:'pointer'}}
                      size="25"
                      className="cr-search-form__icon-search text-secondary"
                    />
                    <Input 
                    style={{marginTop:5,marginLeft:10,width: 250}}
                      type="search"
                      autoComplete="off"
                      className="cr-search-form__input"
                      placeholder="Search id or name product..."
                      id="ws"
                    />
                 </Form>
                 <DropdownButton style={{fontSize:18,width:110,height:30,marginLeft:10,marginTop:10}} as={ButtonGroup} 
                    key='Info' id={`dropdown-variants-Info`}
                    variant='Info'  title="L???c"   onSelect={(e)=>filterProduct(e)}  >        
                                {
                                    (active ==="1"?<Dropdown.Item  style={{fontSize:16,textAlign:'center'}} eventKey="1"  active>- T???t C??? -</Dropdown.Item>
                                    :<Dropdown.Item  style={{fontSize:16,textAlign:'center'}} eventKey="1" >- T???t C??? -</Dropdown.Item> )
                                }
                                {
                                    (active ==="3"? <Dropdown.Item style={{fontSize:14}} eventKey="3" active>Gi?? : Cao - Th???p</Dropdown.Item>
                                    : <Dropdown.Item style={{fontSize:14}} eventKey="3" >Gi?? : Cao - Th???p</Dropdown.Item> )
                                }
                                {
                                    (active ==="2"?<Dropdown.Item  style={{fontSize:14}} eventKey="2" active>Gi?? : Th???p - Cao</Dropdown.Item>
                                    :<Dropdown.Item  style={{fontSize:14}} eventKey="2">Gi?? : Th???p - Cao</Dropdown.Item> )
                                }
                                <Dropdown.Divider />
                                {category.map((cate)=>(
                                    <Dropdown.Item style={{fontSize:14}} eventKey={cate.name} >{cate.description}</Dropdown.Item>
                                ))}
                  </DropdownButton>
                  </div>
                </Row>
              <CardBody>
                <Row>
                  <Col>
                    <Card body>
                      <Table {...{ ['hover']: true }}>
                        <thead>
                          <tr>
                            <th style={{color:"black",fontWeight:500}}>#</th>
                            <th width="150" style={{color:"black",fontWeight:500}} >M?? SP</th>
                            <th width="200" style={{color:"black",fontWeight:500}} >???nh</th>
                            <th width="420" style={{color:"black",fontWeight:500}} >T??n S???n Ph???m</th>
                            <th width="150" style={{color:"black",fontWeight:500}} >Gi??</th>
                            <th width="150" style={{color:"black",fontWeight:500}} >Lo???i</th>
                            <th width="150" style={{color:"black",fontWeight:500}} >Khuy???n m???i</th>
                            <th width="150" style={{color:"black",fontWeight:500}} >T??nh Tr???ng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {JsxContent}
                        </tbody>
                      </Table>
                    </Card>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row >
          <Col style={{textAlign:'end'}}>
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-center">
                      {(pagepresent == 1)?
                      <li  id ="btnprev" className="page-item disabled" >
                        <a className="page-link page-link-prev" style={{cursor:"pointer"}}  onClick={prevpage} aria-label="Previous" tabindex="-1" aria-disabled="true">
                          <span aria-hidden="true"><i className="icon-long-arrow-left"></i></span>Prev
                        </a>
                      </li>
                    :
                    <li  id ="btnprev" className="page-item " >
                      <a className="page-link page-link-prev" style={{cursor:"pointer"}}  onClick={prevpage} aria-label="Previous" tabindex="-1" aria-disabled="true">
                        <span aria-hidden="true"><i className="icon-long-arrow-left"></i></span>Prev
                        </a>
                    </li>
                      }
                    <div style={{marginTop:18,marginRight:10}}>
                      <Pagination>{items}</Pagination>
                   </div>
                   {(pagepresent == totalpage || totalpage == 0)?
                              <li id ="btnnext" className="page-item disabled"   >
                                   <a class="page-link page-link-next" style={{cursor:"pointer"}} onClick={nextpage}  aria-label="Next">
                                       Next <span aria-hidden="true"><i className="icon-long-arrow-right"></i></span>
                                   </a>
                               </li>   
                               :
                               <li id ="btnnext" className="page-item ">
                                 <a class="page-link page-link-next" style={{cursor:"pointer"}} onClick={nextpage}  tabindex="-1" aria-disabled="true" aria-label="Next">
                                     Next <span aria-hidden="true"><i className="icon-long-arrow-right"></i></span>
                                 </a>
                             </li>   
                       }                
                   </ul>
                </nav>
          </Col>
        </Row>
    </Page>
  );
};

export default ProductAdmin;
