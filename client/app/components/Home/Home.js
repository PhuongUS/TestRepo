import React,{Component} from 'react';
import {connect} from 'react-redux'
import './styles.css'
const { compose, withProps, lifecycle,withHandlers,withState } = require("recompose");
const {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    DirectionsRenderer,
} = require("react-google-maps");
const { StandaloneSearchBox } = require("react-google-maps/lib/components/places/StandaloneSearchBox");

const mapStateToProps = state => ({
    dataUser: state.loginReducer.data,
 });
const socket = io.connect('http://localhost:8080');
const Home = compose(
    withState('check', 'updateCheck', false),
    // withHandlers({
    //     onChange: props => event => {
    //         event.preventDefault();
    //         props.updateCheck(true);
    //       },
    // }),
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBhV7whWFFrWG1FToGcs48HfEDBBtjxg8k&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div  style={{ height: `100%` }} />,
        containerElement: <div class='row' style={{ height: `400px` }} />,
        mapElement: <div class="col-sm-8" style={{ height: `160%`,marginTop:20,marginLeft:80, }} />,
    }),
    withScriptjs,
    withGoogleMap,
    connect(mapStateToProps),
    
    lifecycle({
        componentDidMount() {
            const DirectionsService = new google.maps.DirectionsService();
            const refs = {}
            const refsgoal={}
            const testrequest={
                origin:null,
                destination:null,
                travelMode:null
            }
            const userLocation={
                lat:null, log:null
            }
            console.log(testrequest);
            socket.on('list location',  (data) =>{  // khách hàng lắng nghe sever gửi list location driver
                this.setState({listLocation:data})
            })
            socket.on('find driver success',(data)=>{   // khách hàng lắng nghe sever gủi data driver
                console.log(data)
                this.setState({dataDriver:data,loadFindDrvier:true})
            })
            socket.on('data khach hang',(data)=>{   // driver lắng nghe sever gửi data khách hàng
                console.log(data.idCustomer)
                this.setState({
                    directions:data.directions,idCustomer:data.idCustomer,
                    placeStartCustomer:data.placeStart,
                    placeGoalCustomer:data.placeGoal,
                    nameCustomer:data.infoName,
                    phoneCustomer:data.infoPhone,
                })
            })
            socket.on('the trip is over',()=>{  // // ket thuc chuyen di view khach // or reload home
                this.setState({
                    directions:null,
                    dataDriver:null,
                    nameCustomer:null,
                    phoneCustomer:null
                })
            })
            navigator.geolocation.getCurrentPosition(
                position => {
                  var { latitude, longitude } = position.coords;
                    userLocation.lat=position.coords.latitude
                    userLocation.log=position.coords.longitude
                    this.setState({latitude:latitude,longitude:longitude})
                }
            );
            this.setState({loadFindDrvier:true,
                onClickBooking:()=>{
                    // send data to socket
                    socket.emit('customer booking',{            // khách hàng đặt xe
                        directions:this.state.directions,
                        start:this.state.placeStart,
                        goal:this.state.placeGoal,
                        infoName:this.state.nameCustomer,
                        infoPhone:this.state.phoneCustomer,
                    });
                    this.setState({loadFindDrvier:false})
                }
            })
            this.setState({
                onChange:(check)=>{
                    if(check==true){
                        this.setState({check:false})
                        socket.emit('remove driver')
                    }
                    if(!check){
                        this.setState({check:true})
                        socket.emit('add location driver', {location:userLocation})
                        
                    }
                },
                driverAccept:()=>{
                    this.setState({showInfor:true})
                    socket.emit('driver accept',{idCustomer:this.state.idCustomer,dataDriver:this.props.dataUser})
                },
                driverCancel:()=>{

                    socket.emit('driver cancel',{idCustomer:this.state.idCustomer})
                },
                onChangeName:(event)=>{
                    this.setState({nameCustomer:event.target.value})
                },
                onChangePhone:(event)=>{
                    this.setState({phoneCustomer:event.target.value})
                },
                driverFinish:()=>{
                    fetch('/api/insert_the_trip', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            userID:this.props.dataUser._id,  // user id driver
                            phoneCustomer:this.state.phoneCustomer, 
                            money:this.state.directions.routes[0].legs[0].distance.value*2, // money get emit
                        }),
                        }).then(res => res.json())
                        .then(responseJson => {
                            console.log('json', responseJson);
                        }
                    )
                    this.setState({directions:null})
                    socket.emit('driver finish',{idCustomer:this.state.idCustomer})
                }
            })
            this.setState({ places: [],
                
                onSearchBoxMountedStart: ref => {
                    refs.searchBox = ref;
                },
                onSearchBoxMountedGoal: ref => { // thay đổi refs
                    refsgoal.searchBox = ref;
                },
                onPlacesChanged: () => {
                    const places = refs.searchBox.getPlaces();
                    this.setState({places,});
                    this.setState({placeStart:places})
                    console.log(places);
                    testrequest.origin=new google.maps.LatLng(places[0].geometry.location.lat(), places[0].geometry.location.lng());
                    console.log(testrequest)
                        
                },
                onPlacesChangedGoal: () => {
                    const places = refsgoal.searchBox.getPlaces();
                    this.setState({places,});
                    this.setState({placeGoal:places})
                    console.log(places);
                    testrequest.destination=new google.maps.LatLng(places[0].geometry.location.lat(), places[0].geometry.location.lng()),
                    testrequest.travelMode= google.maps.TravelMode.DRIVING,
                        DirectionsService.route(testrequest ,(result, status) => {
                            if (status === google.maps.DirectionsStatus.OK) {
                                this.setState({
                                    directions: result,
                                });
                            } else {
                                console.error(`error fetching directions ${result}`);
                            }
                        });
                },
            })
        }
    })
)
(props => 
        <div class="col-sm-3" style={{marginTop:    20,backgroundColor:'gray',height:'640px',marginRight:150,flex:1,position:'absolute'}}>
            {console.log(props.dataUser)}

            {props.placeGoalCustomer && console.log(props.placeGoalCustomer[0].formatted_address)}
            {props.dataUser==null && // user is not driver
            <div>
                <label style={{marginLeft:10,color:'white',fontWeight:'bold',marginTop:27}} >Điểm đón: </label>
                <StandaloneSearchBox
                    ref={props.onSearchBoxMountedStart}
                    bounds={props.bounds}
                    onPlacesChanged={props.onPlacesChanged}
                    >
                    <input
                        type="text"
                        placeholder="Nhập diểm đón"
                        style={{
                        boxSizing: `border-box`,
                        border: `1px solid transparent`,
                        width: `250px`,
                        height: `32px`,
                        padding: `0 12px`,
                        borderRadius: `3px`,
                        boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                        fontSize: `14px`,
                        outline: `none`,
                        textOverflow: `ellipses`,marginLeft:28
                        }}
                    />
                </StandaloneSearchBox>
                <label style={{marginLeft:10,color:'white',fontWeight:'bold'}}>Điểm đến: </label>
                <StandaloneSearchBox 
                    ref={props.onSearchBoxMountedGoal}
                    bounds={props.bounds}
                    onPlacesChanged={props.onPlacesChangedGoal}
                    >
                    <input
                        type="text"
                        placeholder="Nhập điểm đến"
                        style={{
                        boxSizing: `border-box`,
                        border: `1px solid transparent`,
                        width: `250px`,
                        height: `32px`,
                        padding: `0 12px`,
                        borderRadius: `3px`,
                        boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                        fontSize: `14px`,
                        outline: `none`,
                        textOverflow: `ellipses`, marginLeft:30
                        }}
                    />
                </StandaloneSearchBox>
                <label style={{marginLeft:10,color:'white',fontWeight:'bold'}}>Họ tên:</label>
                <input
                        type="text"
                        placeholder="Nhập họ tên"
                        style={{
                        boxSizing: `border-box`,
                        border: `1px solid transparent`,
                        width: `250px`,
                        height: `32px`,
                        padding: `0 12px`,
                        borderRadius: `3px`,
                        boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                        fontSize: `14px`,
                        outline: `none`,
                        textOverflow: `ellipses`,
                        marginLeft:50
                        }}
                        onChange={props.onChangeName}
                    /> <br/>
                <label style={{marginLeft:10,color:'white',fontWeight:'bold'}}>Số điện thoại:</label>
                <input
                        type="text"
                        placeholder="Nhập số điện thoại"
                        style={{
                        boxSizing: `border-box`,
                        border: `1px solid transparent`,
                        width: `250px`,
                        height: `32px`,
                        padding: `0 12px`,
                        borderRadius: `3px`,
                        boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                        fontSize: `14px`,
                        outline: `none`,
                        textOverflow: `ellipses`,
                        }}
                        onChange={props.onChangePhone}
                    /> <br/>
                <label style={{marginLeft:10,color:'white',fontWeight:'bold'}}>Khoảng cách:</label>
                {props.directions?<label style={{marginLeft:5,color:'white'}}>{props.directions.routes[0].legs[0].distance.text}</label>:<label style={{marginLeft:100}}></label>}<br/>
                <label style={{marginLeft:10,color:'white',fontWeight:'bold'}}>Giá tiền:</label>
                {props.directions?<label style={{marginLeft:5,color:'white'}}>{props.directions.routes[0].legs[0].distance.value*2}</label>:<label></label>}<br/>
                {!props.dataDriver &&<button style={{marginLeft:100}} onClick={()=>{ props.onClickBooking()}}>Đặt Xe</button>}<br/>
                {props.loadFindDrvier==false&&<a>đang tìm tài xế ...</a>}
                {props.dataDriver && <div>
                    <a style={{marginLeft:10,color:'blue',fontWeight:'bold'}}>Đã có tài xế cho bạn</a><br/>
                    {console.log(props.dataDriver)}
                    <label style={{marginLeft:10,color:'white',fontWeight:'bold'}}>Tên tài xế: <a>{props.dataDriver.name}</a></label>
                    <label style={{marginLeft:10,color:'white',fontWeight:'bold'}}>Biển số xe: <a>{props.dataDriver.licensePlate}</a></label>
                    </div>}
            </div>}
            {/* when user is not drive */}
            {props.dataUser!=null&&
            <div>
               {console.log(props.check)}
               {props.check?<a>Tắt nhận chuyến</a>:<a>Bật nhận chuyến</a>}
                <label class="switch" style={{margin:10}}>
                    <input type="checkbox" onChange={()=>props.onChange(props.check)}/>
                    <span class="slider round"></span>
                </label>
                
                {props.directions && 
                    <div>
                        {props.placeStartCustomer && 
                        <div>
                            <label style={{marginLeft:10,color:'white',fontWeight:'bold'}}>Điểm đón: <a>{props.placeStartCustomer[0].formatted_address}</a> </label>
                        </div>}
                        {props.placeGoalCustomer && 
                        <div>
                            <label style={{marginLeft:10,color:'white',fontWeight:'bold'}}>Điểm đến: <a>{props.placeGoalCustomer[0].formatted_address}</a> </label>
                        </div>}
                        <label style={{marginLeft:10,color:'white',fontWeight:'bold'}}>Khoảng cách: <label style={{marginLeft:5,color:'white'}}>{props.directions.routes[0].legs[0].distance.text}</label></label>
                        <label style={{marginLeft:10,color:'white',fontWeight:'bold'}}>Giá tiền: <label style={{marginLeft:5,color:'white'}}>{props.directions.routes[0].legs[0].distance.value*2}</label></label>
                    
                        {!props.showInfor&&<div>
                            <button style={{marginLeft:10}} onClick={()=>{props.driverAccept()}}>Nhận chuyến</button>
                            <button style={{marginLeft:10}} onClick={()=>{props.driverCancel()}}>Không cảm ơn</button>
                        </div>}
                    
                        {props.nameCustomer&& props.showInfor == true && <div>
                            <label style={{marginLeft:10,color:'blue',fontWeight:'bold'}}>Thông tin liên hệ khách hàng</label><br/>
                            <label style={{marginLeft:10,color:'white',fontWeight:'bold'}}>Name: {props.nameCustomer}</label><br/>
                            <label style={{marginLeft:10,color:'white',fontWeight:'bold'}}>Số điện thoại: {props.phoneCustomer}</label>
                            <button style={{marginLeft:10}} onClick={()=>{props.driverFinish()}}>Kết thúc chuyến đi</button>
                        </div>}
                    </div>
                }
                   
            </div>
                // send data to sever lat log 
            }
            <div>
            {props.latitude && <GoogleMap 
                defaultZoom={15}
                //defaultCenter={new google.maps.LatLng(10.7686473, 106.70280189999994)}
                defaultCenter={new google.maps.LatLng(props.latitude,props.longitude)}
            >  
                {props.directions && <DirectionsRenderer directions={props.directions} />} 
                
                {
                        props.listLocation && props.listLocation.map((item, index) => (
                            //console.log(item)
                            <Marker
                            icon={{ url: "http://maps.google.com/mapfiles/ms/icons/motorcycling.png" }}
                            position={{ lat: item.location.lat, lng: item.location.log }}/>
                        ))
                }
            </GoogleMap>}
            
        </div>
    </div>    
);




export default Home;