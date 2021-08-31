import { useState,useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Item(props){
	const hostname = "https://api-shoes.herokuapp.com";  
	const [product, setproduct] = useState({listimage:[1],listsize:[1],price:0})
    const [value, setvalue] = useState("1")
	const [sizes, setsizes] = useState("")
	

	// var array = localStorage.getItem("pricelist")
	// let listprice =  JSON.parse(array);

	let tokenStr = localStorage.getItem("token");	
	const config = {
			headers: {"Authorization" : `Bearer_${tokenStr}`}
		}; 

	useEffect(() =>{  
			axios.get(hostname+`/api/product/id/${props.shopcart.productdetail.productid}`,config)
			.then((response)=>{
				console.log("success get product"+response.data);
				setproduct(response.data);

			})
			.catch((error)=>{
				console.log("error"+error.response);
			})

			console.log("size-"+props.shopcart.productdetail.size)
			setsizes(props.shopcart.productdetail.id)
	},[]);

	const deleteShopCart = () =>{		
        axios.post(hostname+`/api/shopcart/delete`,props.shopcart,config)
        .then((Response)=>{
            console.log("success delete shopcart")  
			console.log(" send delete "+props.shopcart.id)
			var iddel = props.shopcart.productdetail.id
			var cb = document.getElementById(iddel)
			if(cb.checked){
				cb.checked = false;
				//reset price
				let listSC = JSON.parse(localStorage.getItem('shopcart')) || [];
				let listSCchange = []
				listSC.filter((item,index)=>{
					if(item.id !== props.shopcart.productdetail.id){
						listSCchange.push(item)
					}
				})
				let total = 0;
				listSCchange.map((item)=>
					total += item.quantity * item.price
				)
				localStorage.setItem('shopcart', JSON.stringify(listSCchange));
				localStorage.setItem("total",total);
				props.test(total)
			}else{

			}
				// change shopcart span
				let listSCs = JSON.parse(localStorage.getItem("SC"))|| []
				let listSCnew = [];
				listSCs.filter((sc)=>{
					if(sc.id !== iddel){
						listSCnew.push(sc)
					}
				})
				console.log("size -" + listSCnew.length)  
				props.setSC(listSCnew.length)
				localStorage.setItem("SC",JSON.stringify(listSCnew))

				// setdeleteShopcart("1")
				props.delete(props.shopcart.id);

            })
        .catch((error) =>{
			if (error.response) {
				// Request made and server responded
				console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.headers);
			}
                console.log("error ")
            })
	}

	let numberQ = props.shopcart.quantity;
    const changeQuantity=(e)=>{
		// var number = document.getElementById("inputQuantity").value;
		var number = e.target.value;
		if(number > 10){
			alert("số lượng không hợp lệ");
            return false
		}

        // check inventory
        var proactive = ""
        var inventory = 0;
		product.listsize.filter((pro)=>{
            if(pro.id = props.shopcart.productdetail.id){
                inventory = pro.inventory
                if( (pro.inventory - number) >= 0){
                    proactive = pro;
                    return proactive
                }
            }
        })

		if(proactive === ""){
            alert("size này tạm thời chỉ còn "+inventory+" sản phẩm!")
            return false
        }

		props.shopcart.quantity = number;
		axios.put(hostname+`/api/shopcart`,props.shopcart,config)
        .then((Response)=>{
            console.log("success update shopcart")  
			
			var cb = document.getElementById(props.shopcart.productdetail.id)
			if(cb.checked){
				let total = JSON.parse(localStorage.getItem('total')) || [];
				if(numberQ > number){
					total-= 1 * prices;
				}else{
					total+= 1 * prices;
				}
				props.test(total);
			}
			//rerender
			numberQ = number;
			setvalue(number);
            })
        .catch((error) =>{
                console.log("error ")
        })
    }



	const changeSize=(e)=>{
		var number = document.getElementById("inputQuantity").value
		var productdetailid = e.target.value;
		var pro = "";
		var inventory = 0;
		product.listsize.filter((prodetail)	=>{
				if(prodetail.id === productdetailid){
					if( (prodetail.inventory - number)>=0){
						pro = prodetail;
						return pro
					}
				}
			}		
		)

		 if(pro === ""){
			 alert("size này tạm thời chỉ còn "+inventory+" sản phẩm!")
			 return false
		 }

		props.shopcart.productdetail = pro;
		console.log(JSON.stringify(props.shopcart));
		axios.put(hostname+`/api/shopcart`,props.shopcart,config)
        .then((Response)=>{
            console.log("success update shopcart")  
			// setvalue(number);
			// sizeNumber = pro.id;
			// sizeNumber = pro.size;
			setsizes(pro.id);
            })
        .catch((error) =>{
             console.log("error ")
        })
    }	

	const checkdate = (e)=>{
        let value = e || ""
        var parts = value.split(' ');
        var part = parts[0].split('/');
        var mydate = new Date(part[2], part[1] - 1, part[0]); 
        var time1 = new Date();
        return mydate.getTime()>time1.getTime();
    }
	
	var price = 0
	var prices = product.price;
	if(product.discount != null && product.discount != "" ){
		props.sales.filter((sale)=>{
			if(sale.id === product.discount && checkdate(sale.deadline) ){
				price = (sale.percent/100)
				prices = prices - (prices * price)
			}
		})
	}

	var totals = props.shopcart.quantity * prices

	const clickCheckbox=()=>{
		var cb = document.getElementById(props.shopcart.productdetail.id)
		if(cb.checked){
 			// set price product
                let listSC = JSON.parse(localStorage.getItem('shopcart')) || [];
				let priceg
				var pricet = product.price;
				if(product.discount !== null && product.discount !== "" ){
					props.sales.filter((sale)=>{
						if(sale.id === product.discount && checkdate(sale.deadline) ){
							priceg = (sale.percent/100)
							pricet = pricet - (pricet * priceg)
						}
					})
				}

                listSC.push({
                        quantity:props.shopcart.quantity,
                        price:pricet,
                        id: props.shopcart.productdetail.id,
                });
                
				let total = 0;
                listSC.map((item)=>
                    total += item.quantity * item.price
                )
                localStorage.setItem('shopcart', JSON.stringify(listSC));
				localStorage.setItem("total",total);
                props.test(total)
		}else{
			// set price product
			let listSC = JSON.parse(localStorage.getItem('shopcart')) || [];
			let priceg
			var pricet = product.price;
			if(product.discount != null && product.discount != "" ){
				props.sales.filter((sale)=>{
					if(sale.id === product.discount && checkdate(sale.deadline)){
						priceg = (sale.percent/100)
						pricet = pricet - (pricet * priceg)
					}
				})
			}
			
			listSC.filter((sc,index)=>{
				if(sc.id === props.shopcart.productdetail.id){
					listSC.splice(index,1)
				}
			})

			let total = 0;
			listSC.map((item)=>
				total += item.quantity * item.price
			)
			localStorage.setItem('shopcart', JSON.stringify(listSC));
			localStorage.setItem("total",total);
			props.test(total)
		}
	}
	
	
	
    return(
        <>
           					 <tr>
									<td style={{width:50}}  >
										<input type="checkbox" id={props.shopcart.productdetail.id} style={{marginTop:20}} onClick={clickCheckbox}  />
									</td>
									<td className="product-col">
										<div className="product">
											<figure className="product-media">
												<Link to={{pathname: `/product/${product.id}`}}>
													<img src={product.listimage[0].url} alt="Product image"/>
												</Link>
											</figure>

													<h3 className="product-title" style={{width:200,wordBreak:'break-all'}}>
														<Link to={{pathname: `/product/${product.id}`}}>{product.name}</Link>
													</h3>
												</div>
											</td>
                                            <td>
                                            <div style={{marginTop:10}} className="select-custom">
                                                <select name="size" id="size" style={{width:50}}  value={sizes} className="form-control" onChange={(e)=> changeSize(e)}>
                                                    {product.listsize.map((pro) => 
                                                        	<option  value={pro.id} >{pro.size}</option>
                                                       )}
                                                </select>
                                            </div>
                                            </td>
											{/* <td className="price-col">{props.shopcart.productdetail.size}</td> */}
											<td className="price-col">
												<p style={{marginTop:15, fontSize:14,color:'black'}} >
												{prices.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}
												</p>
											</td>
											<td className="quantity-col">
                                            {/* props.shopcart.quantity */}
                                                <div style={{marginTop:10}} className="cart-product-quantity">
                                                    <input id="inputQuantity" type="number" className="form-control" value={numberQ} min="1" max="10" step="1" onChange={(e)=>changeQuantity(e)} required/>
                                                </div>
                                            </td>
											<td className="total-col">
												<p style={{marginTop:15, fontSize:15,color:'black'}} >
												{(totals).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}
												</p>
											</td>
											<td class="remove-col"><button className="btn-remove" onClick={deleteShopCart}  ><i className="icon-close"></i></button></td>
							</tr>
        </>
    )
};
export default Item;