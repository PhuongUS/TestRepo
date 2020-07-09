import React,{Component} from 'react';
import './styles.css'
import {
    getFromStorage,
    setInStorage,
    } from '../../utils/storage';
import {connect} from 'react-redux';
const mapStateToProps = (state) => ({
    dataUser: state.loginReducer.data,
});
class Login extends Component{
     constructor(props) {
        super(props);

        this.state = {
        isLoading: true,
        token: '',
        signInError: '',
        signInEmail: '',
        signInPassword: '',
        loginSuccess:false
        };

        this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
        this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
        this.onSignIn = this.onSignIn.bind(this);
        //this.logout = this.logout.bind(this);
    }
    componentDidMount(){
        const obj = getFromStorage('the_main_app');
        if (obj && obj.token) {
          const { token } = obj;
          // Verify token
          fetch('/api/account/verify?token=' + token)
            .then(res => res.json())
            .then(json => {
              if (json.success) {
                this.setState({
                  token,
                  isLoading: false
                });
              } else {
                this.setState({
                  isLoading: false,
                });
              }
            });
        } else {
            this.setState({
                isLoading: false,
            });
        }
    }
    onTextboxChangeSignInEmail(event) {
        this.setState({
            signInEmail: event.target.value,
        });
    }
    onTextboxChangeSignInPassword(event) {
        this.setState({
            signInPassword: event.target.value,
        });
    }
    onSignIn() {
        // Grab state
        const {
        signInEmail,
        signInPassword,
        } = this.state;

        this.setState({
        isLoading: true,
        });

        // Post request to backend
        fetch('/api/account/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: signInEmail,
            password: signInPassword,
        }),
        })
        .then(res => res.json())
        .then(responseJson => {
            console.log('json', responseJson);
            if (responseJson.success) {
            setInStorage('the_main_app', { token: responseJson.token });
            //console.log(responseJson);
            this.props.dispatch({type:'LOGIN_SUCCESS',payload:responseJson.user})
            this.setState({
                signInError: responseJson.message,
                isLoading: false,
                signInPassword: '',
                signInEmail: '',
                token: responseJson.token,
                loginSuccess:true,
            });
            } else {
            this.setState({
                signInError: responseJson.message,
                isLoading: false,
            });
            }
        });
    }
    
    render(){
    const {
        isLoading,
        token,
        signInError,
        signInEmail,
        signInPassword,
        loginSuccess,
        } = this.state;
    return(
        <div class="container" style={{marginTop:70}}>
        {this.props.dataUser&&this.props.dataUser.email!='admin@gmail.com'?window.location.href='/':null}
        {this.props.dataUser&&this.props.dataUser.email=='admin@gmail.com'?window.location.href='/admin':null}
        {/* {(loginSuccess)?window.location.href = '/':(null)} */}
            <div class="d-flex justify-content-center h-100">
                <div class="card">
                    <div class="card-header">
                        {
                            (signInError) ? (
                                <p>{signInError}</p>
                            ) : (null)
                        }
                        <h3>Đăng Nhập</h3>
                        <div class="d-flex justify-content-end social_icon">
                            <span><i class="fab fa-facebook-square"></i></span>
                            <span><i class="fab fa-google-plus-square"></i></span>
                            <span><i class="fab fa-twitter-square"></i></span>
                        </div>
                    </div>
                    <div class="card-body">
                            <div class="input-group form-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="fas fa-user"></i></span>
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={signInEmail}
                                    onChange={this.onTextboxChangeSignInEmail}
                                    />
                            </div>
                            <div class="input-group form-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="fas fa-key"></i></span>
                                </div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={signInPassword}
                                    onChange={this.onTextboxChangeSignInPassword}
                                    />
                            </div>
                            <div class="row align-items-center remember">
                                <label><input type="checkbox"></input>Remember Me</label>
                                {/* <label><input type="checkbox"> Remember Me </label> */}
                            </div>
                            <div class="form-group">
                                <button onClick={this.onSignIn}>Sign In</button>
                                {/* <input type="submit" value="Login" class="btn float-right login_btn"/> */}
                            </div>
                    </div>
                    <div class="card-footer">
                        <div class="d-flex justify-content-center links">
                            Don't have an account?<a href="/signup">Sign Up</a>
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

export default connect(mapStateToProps)(Login) ;