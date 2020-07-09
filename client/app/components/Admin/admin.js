
import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
//import '../node_modules/bootstrap/dist/css/bootstrap.min.css'; 
class Admin extends Component{
    constructor(props){
        super(props)
        this.state={
            products: [
            ],
            columns: [{
                    dataField: 'id',
                    text: 'Driver ID'
                },{
                    dataField: 'name',
                    text: 'Driver Name'
                },{
                    dataField: 'email',
                    text: 'Driver Email'
                },{
                    dataField: 'activated',
                    text: 'Driver Active',
                    sort: true
                }
            ]
        }
    }
    componentDidMount(){
        fetch('/api/get_list_driver')
        .then(res => res.json())
        .then(responseJson => {
            console.log( responseJson);
            this.setState({
                products:responseJson
            })
        }
        )
    } 
    render() {
        return (
          <div className="container" style={{ marginTop: 50 ,backgroundColor:'white'}}>
            <BootstrapTable 
            striped
            hover
            keyField='id' 
            data={ this.state.products } 
            columns={ this.state.columns } />
          </div>
        );
      }

}
export default Admin;