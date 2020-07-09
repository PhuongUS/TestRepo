import React,{Component} from 'react';

import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
// import {logo} from '../../../public/assets/img/logo.png'
const mapStateToProps=(state)=>({
    dataUser:state.loginReducer.data,
})
class Header extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <header class="row" style={{margin:10,}}>
                <img src="http://localhost:8080/assets/img/logo.png" style={{width:40,height:40,marginLeft:200,}}/>
                {/* <img src={require('../../../public/assets/img/motobike.png')}/> */}
                {/* <img src={logo} /> */}
                <nav class="col-sm-5" style={{fontSize:40,marginLeft:20, color:'white'}}>Chú Xe Ôm</nav>
                    <NavLink to="/"  class="col-sm-1" style={{margin:10,color:'white'}}>Trang Chủ </NavLink >
                <nav style={{margin:10}}>
                    <NavLink to="/admin" class="col-sm-1"   style={{margin:10,color:'white'}}>Thống kê</NavLink>
                </nav>
                <nav style={{margin:10}}>
                    <NavLink to="/" class="col-sm-1"style={{margin:10,color:'white'}} >Thông Báo</NavLink>
                </nav>
                <nav style={{margin:10}}>
                    <NavLink to="/login" class="col-sm-1" style={{margin:10,color:'white'}}>{(this.props.dataUser)?(this.props.dataUser.name):(<label>Tài Khoản</label>)}</NavLink>
                </nav>
            <hr />
        </header>
        )
       
    }
}

export default connect(mapStateToProps)(Header);
