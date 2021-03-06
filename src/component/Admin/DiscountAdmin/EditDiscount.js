import axios from 'axios';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Card,CardBody,CardHeader,Col,Form,FormGroup,Input,Label} from 'reactstrap';

function EditDiscount(props){
    const hostname = "https://api-shoes.herokuapp.com"; 
    var tokenStr = localStorage.getItem("token");
    const [btnEditDis, setbtnEditDis] = useState("")

    const config = {
        headers: {"Authorization" : `Bearer_${tokenStr}`}
    };

    const handleClose = () =>{
        setbtnEditDis("")
        props.closes(false);
    } 

           //time 
           const getTime=(time)=>{
            var time = new Date(time);
            var theyear = time.getFullYear();
            var themonth = time.getMonth() + 1;
            var thetoday = time.getDate();
            var theHours = time.getHours();
            var theMinute = time.getUTCMinutes();
            var str = thetoday+"/"+themonth +"/"+theyear  + " "+theHours+":"+theMinute;
            return str;
           }

    const updateCategory = ()=>{
        var percents = document.getElementById("percent").value
        var deadlines = document.getElementById("deadline").value

        var time = new Date(deadlines);
        var times = getTime(time) + ":00";

        props.discounts.percent = percents
        props.discounts.deadline = times

        axios.put(hostname+'/api/discount',props.discounts,config)
        .then((Response)=>{
            let data= props.discounts;
            props.updates(data)
            // success
            handleClose();
        })
        .catch((error) =>{
                console.log("error "+error.response)
            })
    }

    const addCategory = ()=>{
        var ids = document.getElementById("id").value
        var percents = document.getElementById("percent").value
        var deadlines = document.getElementById("deadline").value
        //format time
        var time = new Date(deadlines);
        var times = getTime(time) + ":00";
        
        // console.log("check - "+ ids +"-"+percents+"-"+times+"-"+deadlines)

        var dis = {
                    id:ids,
                    percent:percents,
                    deadline:times
                    }

                
        axios.post(hostname+'/api/discount',dis,config)
        .then((Response)=>{
            props.adds(Response.data)
            // success
            handleClose();
            })
        .catch((error) =>{
                alert("m?? gi???m gi?? ???? ???????c s??? d???ng")
                console.log("error "+error.response.data)
            })
    }

    const enableEdit=()=>{
        var percents = document.getElementById("percent")
        var deadlines = document.getElementById("deadline")
        
        if(percents.disabled){
            percents.disabled  = false;
            deadlines.disabled  = false;
            setbtnEditDis("1")
        }else{
            percents.disabled  = true;
            deadlines.disabled  = true;
            setbtnEditDis("")
        }
      
    }

    if(btnEditDis === "" && props.discounts === ""){
        setbtnEditDis("2")
    }
    
    // convert value
    var d = props.discounts.deadline || ""
    var str = d.split(" ")
    var date = str[0].split("/")
    var dates = date[2]+"-"+date[1]+"-"+date[0]+"T"+str[1];

    var jsxProperties  =  <Form>
                                <FormGroup row>
                                    <Label style={{color:'black',fontWeight:400}} for="exampleText" sm={2}>M?? Gi???m Gi??</Label>
                                    <Col><Input disabled="disabled"  style={{width:500,fontSize:16}} defaultValue={props.discounts.id} type="text" id="id" name="id" required /></Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label style={{color:'black',fontWeight:400}} for="exampleText" sm={2}>Ph???n Tr??m Gi???m</Label>
                                    <Col><Input disabled="disabled"  style={{width:500,fontSize:16}} type="number" 
                                     max='100' step='0.1' min='0.1' autoComplete='off' defaultValue={props.discounts.percent} type="" id="percent"  name="percent" required /> </Col>
                                </FormGroup>
                                <FormGroup row>                              
                                    <Label style={{color:'black',fontWeight:400}} for="exampleText" sm={2}>Th???i H???n</Label>
                                    <Col>
                                    <Input  type="datetime-local"  style={{width:500,fontSize:16}} disabled="disabled"
                                     autoComplete='off' defaultValue={dates} id="deadline"  name="deadline" required /></Col>
                                </FormGroup>
                            </Form>
     var jsxAdd          =  <Form>
                                <FormGroup row>
                                    <Label style={{color:'black',fontWeight:400}} for="exampleText" sm={2}>M?? Gi???m Gi??</Label>
                                    <Col><Input type="text"  style={{width:500,fontSize:16}} autoComplete='off' id="id" name="id"  required /></Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label style={{color:'black',fontWeight:400}} for="exampleText" sm={2}>Ph???n Tr??m Gi???m</Label>
                                    <Col><Input type="number" id="name"  style={{width:500,fontSize:16}} max='100' step='0.1' min='0.1' autoComplete='off' id="percent" name="percent"  required/> </Col>
                                </FormGroup>
                                <FormGroup row>                              
                                    <Label style={{color:'black',fontWeight:400}} for="exampleText" sm={2}>Th???i H???n</Label>
                                    <Col><Input type="datetime-local"  style={{width:500,fontSize:16}} id="deadline" autoComplete='off'  name="deadline"  required/></Col>
                                </FormGroup>
                            </Form>

    return(
        <>
            <Modal className="modal_product" size='xl' show={props.shows} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title style={{color:'blue',fontSize:20}}>
                        Gi???m Gi??
                    </Modal.Title>
                    
                </Modal.Header>
                    <Modal.Body>
                    {(props.discounts !== "")?
                        <Button style={{marginLeft: 940}} onClick={enableEdit} className="btntest" variant="primary" >Hi???u Ch???nh</Button>
                        :""}
                        <Card className="form_product">
                            <CardHeader>Gi???m Gi?? S???n Ph???m</CardHeader>
                            <CardBody>
                            {(props.discounts !== "")?jsxProperties:jsxAdd}
                            </CardBody>
                        </Card>
                    </Modal.Body>
                <Modal.Footer>
                    <Button variant="warning" onClick={handleClose}>
                        Close
                    </Button>
                    {(btnEditDis === "1"?
                        <Button variant="warning" onClick={updateCategory}>
                            X??c Nh???n
                        </Button>
                     :(btnEditDis === "2" && props.discounts ==="" ? 
                        <Button variant="warning" onClick={addCategory}>
                            Th??m
                        </Button>
                     : "")
                    )}
                   
                </Modal.Footer>
            </Modal>
        </>
    )
}export default EditDiscount;