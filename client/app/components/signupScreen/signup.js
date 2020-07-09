
    import React, { Component } from 'react';
    import 'whatwg-fetch';

    import {
    getFromStorage,
    setInStorage,
    } from '../../utils/storage';
   
    class SignUp extends Component{
        constructor(props) {
            super(props);
    
            this.state = {
            signUpSuccess:false,
            isLoading: true,
            token: '',
            signUpError: '',
            signUpEmail: '',
            signUpName: '',
            signUpPassword: '',
            licensePlate:'',
            };
            this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
            this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);
            this.onTextboxChangeSignUpName = this.onTextboxChangeSignUpName.bind(this);
            this.onTextboxChangeLicensePlate=this.onTextboxChangeLicensePlate.bind(this);
            this.onSignUp = this.onSignUp.bind(this);
        }
        componentDidMount(){
            this.setState({
                isLoading: false,
            });
        }
        onTextboxChangeSignUpName(event) {
            this.setState({
            signUpName: event.target.value,
            });
        }
        onTextboxChangeSignUpEmail(event) {
            this.setState({
            signUpEmail: event.target.value,
            });
        }
    
        onTextboxChangeSignUpPassword(event) {
            this.setState({
            signUpPassword: event.target.value,
            });
        }
        onTextboxChangeLicensePlate(event) {
            this.setState({
            licensePlate: event.target.value,
            });
        }
        onSignUp() {
            // Grab state
            const {
            signUpEmail,
            signUpPassword,
            signUpName,
            licensePlate
            } = this.state;
    
            this.setState({
            isLoading: true,
            });
    
            // Post request to backend
            fetch('/api/account/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: signUpEmail,
                password: signUpPassword,
                name:signUpName,
                licensePlate:licensePlate,
            }),
            }).then(res => res.json())
            .then(responseJson => {
                console.log('json', responseJson);
                if (responseJson.success) {
                    console.log(responseJson.user)
                this.setState({
                    signUpSuccess:true,
                    signUpError: responseJson.message,
                    isLoading: false,
                    signUpEmail: '',
                    signUpPassword: '',
                    signUpName:'',
                    licensePlate:'',
                });
                } else {
                this.setState({
                    signUpError: json.message,
                    isLoading: false,
                });
                }
            });
        }
      render(){
        const {
                signUpEmail,
                signUpPassword,
                signUpError,
                signUpSuccess,
                signUpName,
                licensePlate,
                } = this.state;
        return(
            
            <div  style={{marginTop:70}}>
            {(signUpSuccess)?window.location.href = '/login':(null)}
                <div class="d-flex justify-content-center h-100">
                    <div class="card" style={{height:600}}>
                        <div class="card-header">
                            {
                                (signUpError) ? (
                                    <p>{signUpError}</p>
                                ) : (null)
                                }
                            <h3>Đăng Ký</h3>
                            <div class="d-flex justify-content-end social_icon">
                                <span><i class="fab fa-facebook-square"></i></span>
                                <span><i class="fab fa-google-plus-square"></i></span>
                                <span><i class="fab fa-twitter-square"></i></span>
                            </div>
                        </div>
                        <div class="card-body">
                                <div class="input-group form-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="fas fa-address-book"></i></span>
                                    </div>
                                    <input
                                        type="name"
                                        placeholder="Họ và tên"
                                        value={signUpName}
                                        onChange={this.onTextboxChangeSignUpName}
                                        />
                                    
                                </div>
                                <div class="input-group form-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="fas fa-user"></i></span>
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={signUpEmail}
                                        onChange={this.onTextboxChangeSignUpEmail}
                                        />
                                    
                                </div>
                                <div class="input-group form-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="fas fa-key"></i></span>
                                    </div>
                                    {/* <input type="password" class="form-control" placeholder="password"/> */}
                                    <input
                                        type="password"
                                        placeholder="Mật khẩu"
                                        value={signUpPassword}
                                        onChange={this.onTextboxChangeSignUpPassword}
                                        />
                                        {/* <button onClick={this.onSignIn}>Sign In</button> */}
                                </div>
                                <div class="input-group form-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="fas fa-car"></i></span>
                                    </div>
                                    <input
                                        type="licensePlate"
                                        placeholder="Biển số xe"
                                        value={licensePlate}
                                        onChange={this.onTextboxChangeLicensePlate}
                                        />
                                    
                                </div>
                                <div class="input-group form-group">
                                    <label style={{color:'white'}}>Hình chân dung</label>
                                    <input type="file" style={{color:'gray'}} onChange={this.fileAvataChangedHandler}/>
                                </div>
                                <div class="input-group form-group">
                                    <label style={{color:'white'}}>Hình xe</label>
                                    <input type="file"style={{color:'gray'}} onChange={this.fileMChangedHandler}/>
                                </div>
                                <div class="form-group">
                                    <button  type ="submit" class="btn float-right login_btn" onClick={this.onSignUp}>Sign In</button>
                                    {/* <input type="submit" value="SignUp" class="btn float-right login_btn"/> */}
                                </div>
                        </div>
                        <div class="card-footer">
                            <div class="d-flex justify-content-center links">
                                You have an account?<a href="login">Sign In</a>
                            </div>
                            <div class="d-flex justify-content-center">
                                <a href="#">Forgot your password?</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
      }
    }

    // export default SignUp;
    // import React, { Component } from 'react';
    // import 'whatwg-fetch';

    // import {
    // getFromStorage,
    // setInStorage,
    // } from '../../utils/storage';

    // class SignUp extends Component {
    // constructor(props) {
    //     super(props);

    //     this.state = {
    //     isLoading: true,
    //     token: '',
    //     signUpError: '',
    //     //signInError: '',
    //     //signInEmail: '',
    //     //signInPassword: '',
    //     signUpEmail: '',
    //     signUpPassword: '',
    //     };

    //     // this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
    //     // this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
    //     this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
    //     this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);
        
    //     //this.onSignIn = this.onSignIn.bind(this);
    //     this.onSignUp = this.onSignUp.bind(this);
    //     //this.logout = this.logout.bind(this);
    // }

    // componentDidMount() {
    //     // const obj = getFromStorage('the_main_app');
    //     // if (obj && obj.token) {
    //     //   const { token } = obj;
    //     //   // Verify token
    //     //   fetch('/api/account/verify?token=' + token)
    //     //     .then(res => res.json())
    //     //     .then(json => {
    //     //       if (json.success) {
    //     //         this.setState({
    //     //           token,
    //     //           isLoading: false
    //     //         });
    //     //       } else {
    //     //         this.setState({
    //     //           isLoading: false,
    //     //         });
    //     //       }
    //     //     });
    //     // } else {
    //     this.setState({
    //         isLoading: false,
    //     });
    //     // }
    // }

    // // onTextboxChangeSignInEmail(event) {
    // //     this.setState({
    // //     signInEmail: event.target.value,
    // //     });
    // // }

    // // onTextboxChangeSignInPassword(event) {
    // //     this.setState({
    // //     signInPassword: event.target.value,
    // //     });
    // // }

    // onTextboxChangeSignUpEmail(event) {
    //     this.setState({
    //     signUpEmail: event.target.value,
    //     });
    // }

    // onTextboxChangeSignUpPassword(event) {
    //     this.setState({
    //     signUpPassword: event.target.value,
    //     });
    // }

    // onSignUp() {
    //     // Grab state
    //     const {
    //     signUpEmail,
    //     signUpPassword,
    //     } = this.state;

    //     this.setState({
    //     isLoading: true,
    //     });

    //     // Post request to backend
    //     fetch('/api/account/signup', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         email: signUpEmail,
    //         password: signUpPassword,
    //     }),
    //     }).then(res => res.json())
    //     .then(json => {
    //         console.log('json', json);
    //         if (json.success) {
    //         this.setState({
    //             signUpError: json.message,
    //             isLoading: false,
    //             signUpEmail: '',
    //             signUpPassword: '',
    //         });
    //         } else {
    //         this.setState({
    //             signUpError: json.message,
    //             isLoading: false,
    //         });
    //         }
    //     });
    // }

    // onSignIn() {
    //     // Grab state
    //     const {
    //     signInEmail,
    //     signInPassword,
    //     } = this.state;

    //     this.setState({
    //     isLoading: true,
    //     });

    //     // Post request to backend
    //     fetch('/api/account/signin', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         email: signInEmail,
    //         password: signInPassword,
    //     }),
    //     })
    //     .then(res => res.json())
    //     .then(json => {
    //         console.log('json', json);
    //         if (json.success) {
    //         setInStorage('the_main_app', { token: json.token });
    //         this.setState({
    //             signInError: json.message,
    //             isLoading: false,
    //             signInPassword: '',
    //             signInEmail: '',
    //             token: json.token,
    //         });
    //         } else {
    //         this.setState({
    //             signInError: json.message,
    //             isLoading: false,
    //         });
    //         }
    //     });
    // }

    // logout() {
    //     this.setState({
    //     isLoading: true,
    //     });
    //     const obj = getFromStorage('the_main_app');
    //     if (obj && obj.token) {
    //     const { token } = obj;
    //     // Verify token
    //     fetch('/api/account/logout?token=' + token)
    //         .then(res => res.json())
    //         .then(json => {
    //         if (json.success) {
    //             this.setState({
    //             token: '',
    //             isLoading: false
    //             });
    //         } else {
    //             this.setState({
    //             isLoading: false,
    //             });
    //         }
    //         });
    //     } else {
    //     this.setState({
    //         isLoading: false,
    //     });
    //     }
    // }

    // render() {
    //     const {
    //     isLoading,
    //     token,
    //     //signInError,
    //     //signInEmail,
    //     //signInPassword,
    //     signUpEmail,
    //     signUpPassword,
    //     signUpError,
    //     } = this.state;

    //     if (isLoading) {
    //     return (<div><p>Loading...</p></div>);
    //     }

    //     if (!token) {
    //     return (
    //         <div>
    //         {/* <div>
    //             {
    //             (signInError) ? (
    //                 <p>{signInError}</p>
    //             ) : (null)
    //             }
    //             <p>Sign In</p>
    //             <input
    //             type="email"
    //             placeholder="Email"
    //             value={signInEmail}
    //             onChange={this.onTextboxChangeSignInEmail}
    //             />
    //             <br />
    //             <input
    //             type="password"
    //             placeholder="Password"
    //             value={signInPassword}
    //             onChange={this.onTextboxChangeSignInPassword}
    //             />
    //             <br />
    //             <button onClick={this.onSignIn}>Sign In</button>
    //         </div> */}
    //         <br />
    //         <br />
    //         <div>
    //             {
    //             (signUpError) ? (
    //                 <p>{signUpError}</p>
    //             ) : (null)
    //             }
    //             <p>Sign Up</p>
    //             <input
    //             type="email"
    //             placeholder="Email"
    //             value={signUpEmail}
    //             onChange={this.onTextboxChangeSignUpEmail}
    //             /><br />
    //             <input
    //             type="password"
    //             placeholder="Password"
    //             value={signUpPassword}
    //             onChange={this.onTextboxChangeSignUpPassword}
    //             /><br />
    //             <button onClick={this.onSignUp}>Sign Up</button>
    //         </div>

    //         </div>
    //     );
    //     }

    //     return (
    //     <div>
    //         <p>Account</p>
    //         <button onClick={this.logout}>Logout</button>
    //     </div>
    //     );
    // }
    // }

    export default SignUp;