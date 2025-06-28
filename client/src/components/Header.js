import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import Payments from './Payments';

class Header extends Component{
    renderContent(){
        switch (this.props.auth) {
            case null:
                return ;
            case false:
                return (
                    <ul>
                    <li><a href="/auth/google">Login With Google</a></li>
                    <li><a href="/auth/github">Login With GitHub</a></li>
                    </ul>
                );
            default:
                return [
                    <li key="1"><Payments/></li>,
                    <li key="dark-mode">
                        <button
                            onClick={this.props.toggleDarkMode}
                            className="btn-flat white-text"
                            style={{ margin: '15px 10px', display: 'flex', alignItems: 'center'}}
                        >
                            <i className="material-icons">brightness_6</i>
                        </button>
                    </li>,
                    <li key="3" style={{margin: '0 10px'}}>
                        Credits: {this.props.auth.credits}
                    </li>,
                    <li key="2"><a href="/api/logout">Logout</a></li>
                ];
        }
    }
 
    render() {
        return (
            <nav>
                <div className="nav-wrapper">
                    <Link 
                    to={this.props.auth ? '/surveys' : '/'} 
                    className='left brand-logo' style={{marginLeft: '14px', marginBottom: '14px'}}>
                        📩
                    </Link>
                    <ul className='right'>
                        {this.renderContent()}
                    </ul>
                </div>
            </nav>
        );
    }
}

function mapStateToProps({ auth }){
    return {auth};
}

export default connect(mapStateToProps)(Header);
