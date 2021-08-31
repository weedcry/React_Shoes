import { Link, useHistory } from "react-router-dom";
import PageHeader from '../../assets/images/page-header-bg.jpg';
import {useState, useEffect } from 'react';
import axios from 'axios';
import Item from "./item";
import './style1.css';

function Shopcart(props){
	const hostname = "https://api-shoes.herokuapp.com"; 
	let history = useHistory();
	const [listShopcart, setlistShopcart] = useState([])	
    const [total, settotal] = useState(0)
	const [deleteItem, setdeleteItem] = useState(0)
	const [listSale, setlistSale] = useState([])
	
	var tokenStr = localStorage.getItem("token");
	  //  check login 
      if(props.login === "0"){
        history.push("/login")
    }

	const config1 = {
		headers: {"Authorization" : `Bearer_${tokenStr}`}
	};
	useEffect(() =>{   
        axios.get(hostname+`/api/shopcart`,config1)
        .then((Response)=>{
            console.log("success get shopcart "+Response.data);
			setlistShopcart(Response.data)
			localStorage.removeItem("shopcart")
            })
        .catch((error) =>{
                console.log("error "+error.response);
            })

		// get sale
		axios.get(hostname+'/api/discount/get')
		.then((Response)=>{
			console.log(" get list sale success")
			setlistSale(Response.data)
		})  

    }, []);

	// delteitem


	// listShopcart.filter((shopcart,index)=>{
	// 	console.log("delete-" + shopcart.id + "-"+deleteItem)
	// 	if(shopcart.id === deleteItem){
	// 		console.log("suc-"+index + shopcart.id)
	// 		listShopcart.splice(index,1);
	// 	}
	// })

	if(deleteItem !== 0){
		let listnew = []
		listShopcart.filter((shopcart,index)=>{
			console.log("log "+shopcart.id + " -" +deleteItem)
			if(shopcart.id !== deleteItem){
				console.log("get "+ shopcart.id )
				listnew.push(shopcart);
			}
		})
		if(listnew.length === 0) return false;
		for(let i = 0; i <listnew.length;i++){
			console.log("check-"+listnew[i].id)
		}
		setdeleteItem(0)
		setlistShopcart(listnew)
	}
	 

	const reTotal= () =>{
		localStorage.setItem("total",total);
	}

let numbero = 0;
    return(
        <>
        <main className="main">
            <nav aria-label="breadcrumb" className="breadcrumb-nav">
                <div className="container">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Shopping Cart</li>
                    </ol>
                </div>
            </nav>
            <div className="page-header text-center" style={{backgroundImage: "url(" + PageHeader + ")" }}>
        		<div className="container">
        			<h1 className="page-title">Shopping Cart<span>Shop</span></h1>
        		</div>
        	</div><br/>

            <div className="page-content">
            	<div className="cart">
	                <div className="container">
	                	<div className="row">
	                		<div className="col-lg-9">
	                			<table className="table table-cart table-mobile">
									<thead>
										<tr>
											<th></th>
											<th>Sản Phẩm</th>
											<th>Size</th>
											<th style={{textAlign:'center'}} >Giá</th>
											<th>Số Lượng</th>
											<th style={{textAlign:'center'}}>Tổng</th>
											<th></th>
										</tr>
									</thead>
									
									{/* shopcart.productdetail.productid */}
									<tbody>
										{listShopcart.map((shopcart) =>
											<Item test={settotal} delete={setdeleteItem} 
											sales={listSale} shopcart ={shopcart}  setSC={props.setSC} ></Item>
										)}
									</tbody>
								</table>

	                			<div className="cart-bottom">
			            			<button className="btn btn-outline-dark-2"><span>UPDATE CART</span><i className="icon-refresh"></i></button>
		            			</div>
	                		</div>
	                		<aside className="col-lg-3">
	                			<div className="summary summary-cart">
	                				<h3 className="summary-title">Thành Tiền</h3>

	                				<table className="table table-summary">
	                					<tbody>
	                						<tr className="summary-subtotal">
	                							<td>Tổng Đơn:</td>
	                							<td>{total.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</td>
	                						</tr>
	                						<tr className="summary-shipping">
	                							<td>Shipping:</td>
	                							<td>&nbsp;</td>
	                						</tr>

											<tr className="summary-shipping-row">
												<td>
													<div className="custom-control custom-radio">
													<input type="radio" defaultChecked="true" id="test3" name="radio-group"  />
													<label className="radiobtn" for="test3">Free Ship</label>
													</div>
												</td>
												<td>{numbero.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</td>
											</tr>
							
	                						<tr className="summary-total">
	                							<td>Thành Tiền:</td>
	                							<td>{total.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</td>
												{reTotal()}
	                						</tr>
	                					</tbody>
	                				</table>
									<div style={{marginLeft:80}}>
									{ (total === 0)? 
									<Link  to="/checkout" className="btn btn-outline-primary-2 btn-order btn-block disabled">Tiến Hành Đặt Hàng</Link>
									:
									<Link to="/checkout" className="btn btn-outline-primary-2 btn-order btn-block">Tiến Hành Đặt Hàng</Link>
									}
									</div>
	                			</div>
								<div style={{marginLeft:110,width:150}}>
									<Link style={{width:150}} to="/"  className="btn btn-outline-dark-2 btn-block mb-3">
										<span  style={{width:150}} >Tiếp Tục Mua Sắm</span>
										<i className="icon-refresh"></i>
									</Link>
								</div>
								
	                		</aside>
	                	</div>
	                </div>
                </div>
            </div>
        </main>
        </>
    )
}
export default Shopcart;

