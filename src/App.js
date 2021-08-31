import {BrowserRouter as Router,Switch,Route, BrowserRouter} from "react-router-dom";
import React, {useState} from 'react';
import './App.css';
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.min.js";
// import 'jquery/dist/jquery.min.js';
//user
import Header from './component/header';
import Footer from "./component/footer";
import Login from "./component/login";
import Signup from "./component/signup";
import Home from "./component/home";
import Error from "./component/error";
import Shopcart from "./component/shopcart";
import Product from "./component/product";
import Checkout from "./component/checkout";
import Account from "./component/account";
import Order from "./component/order";  
import Wishlist from "./component/wishlist";
import MoreProduct from "./component/MoreProduct";

// admin
import ProductAdmin from "./component/Admin/ProductAdmin";
import MainAdmin from "./component/Admin/MainAdmin";
import PageSpinner from "./component/Admin/Pages/PageSpinner";
import OrderAdmin from "./component/Admin/OrderAdmin";
import CategoryAdmin from "./component/Admin/CategoryAdmin";
import DiscountAdmin from "./component/Admin/DiscountAdmin";
import RepositoryAdmin from "./component/Admin/RepositoryAdmin";
import DashboardAdmin from "./component/Admin/DashboardAdmin";
import ChartOrder from "./component/Admin/ChartAdmin/ChartOrder";
import ChartProduct from "./component/Admin/ChartAdmin/ChartProduct";
import { createBrowserHistory } from "history";
import axios from "axios";
function App() {
  // redux,concext
  const hostname = "https://api-shoes.herokuapp.com";  
  const [state, setstate] = useState("")
  const [isAdmin, setisAdmin] = useState(0)
  // wishlist and shopcart customer
  const [WishlistSize, setWishlistSize] = useState(0)
  const [ShopcartSize, setShopcartSize] = useState(0)


  // check login
  var tokenStr = localStorage.getItem("token");
  var cadmin = localStorage.getItem("admin");
  const config = {
      headers: {"Authorization" : `Bearer_${tokenStr}`}
  };

   axios.get(hostname+'/api/users',config)
        .then((Response)=>{
          console.log("user get success")
          // localStorage.setItem("token",Response.data.token)
        // check admin
        let check = Response.data.roles[0];
        if(check === "ADMIN"){
            localStorage.setItem("username",Response.data.username)
            setisAdmin(1)
          }
      })
      .catch((error) =>{
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      })


  return (
    <>
      {(isAdmin === 1?
         <Router>   
           <Switch>
                    <MainAdmin  logout={setstate}  checkAdmin={setisAdmin} history={createBrowserHistory()} >
                      <React.Suspense fallback={<PageSpinner />}>
                      <Route exact path="/" >
                          <DashboardAdmin></DashboardAdmin>
                        </Route>
                        <Route exact path="/product" >
                          <ProductAdmin></ProductAdmin>
                        </Route>
                        <Route exact path="/order" >
                          <OrderAdmin></OrderAdmin>
                        </Route>
                        <Route exact path="/category" >
                            <CategoryAdmin></CategoryAdmin>
                        </Route>
                        <Route exact path="/discount" >
                            <DiscountAdmin></DiscountAdmin>
                        </Route>
                        <Route exact path="/repository" >
                            <RepositoryAdmin></RepositoryAdmin>
                        </Route>
                        <Route exact path="/chartorder" >
                            <ChartOrder></ChartOrder>
                        </Route>
                        <Route exact path="/chartproduct" >
                            <ChartProduct></ChartProduct>
                        </Route>
                      </React.Suspense>
                    </MainAdmin>
              </Switch>
            </Router>   
        :
        <>
        <Router>   
        <Header logout={state} check={setstate} 
         setWL={setWishlistSize} WL={WishlistSize} setSC={setShopcartSize} SC={ShopcartSize} >
        </Header>
        <Switch>

          <Route exact path="/">
            <Home login={state} setWL={setWishlistSize} setSC={setShopcartSize} ></Home>
          </Route>

          <Route path="/signup" component={Signup}/>

          <Route exact path="/login" >
            <Login  checkAdmin={setisAdmin} logout={setstate}  setWL={setWishlistSize} setSC={setShopcartSize} ></Login>
          </Route>

          <Route exact path="/shopcart">
            <Shopcart login={state}  setSC={setShopcartSize} ></Shopcart>
          </Route>

          <Route exact path="/checkout">
            <Checkout login={state} setSC={setShopcartSize}  > </Checkout>
          </Route>

          <Route exact path="/account" >
            <Account  logout={setstate} setWL={setWishlistSize} setSC={setShopcartSize}  ></Account>
          </Route>

          <Route exact path="/order" >
            <Order login={state}  logout={setstate} setWL={setWishlistSize} setSC={setShopcartSize}  ></Order>
          </Route>

          <Route  exact path="/wishlist">
            <Wishlist login={state}  setWL={setWishlistSize} ></Wishlist>
          </Route>

          <Route  exact path="/product">
            <MoreProduct login={state}  setWL={setWishlistSize} setSC={setShopcartSize}></MoreProduct>
          </Route>

          {/* <Route path="/product/:id" component={Product}/> */}
          <Route path="/product/:id" children={<Product login={state}  setWL={setWishlistSize} setSC={setShopcartSize}   />}/>
          <Route path="**" component = {Error}/>
        </Switch>
        <Footer></Footer>
        </Router>
        </>
        )}
   
    </>
  );
}

export default App;
