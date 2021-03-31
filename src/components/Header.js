import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import { AUTH_TOKEN } from '../constants';


    const Header = () => {
      const authToken = localStorage.getItem(AUTH_TOKEN);
      const [isAuth, setIsAuth] = useState(() => (authToken? true : false));
      useEffect(()=>{
        console.log(isAuth)
        setIsAuth(() => localStorage.getItem(AUTH_TOKEN) ? true : false)
        console.log(isAuth)
      })
      const checkAuth = ()=>{
        setIsAuth(() => localStorage.getItem(AUTH_TOKEN) ? true : false)
      }
        const history = useHistory();
        return (
          <div className="flex pa1 justify-between nowrap orange">
            <div className="flex flex-fixed black">
              <div className="fw7 mr1">Hacker News</div>
              <Link to="/" className="ml1 no-underline black">
                new
              </Link>
              <div className="ml1">|</div>
              {/* <Link to="/top" className="ml1 no-underline black">
                top
              </Link>
              <div className="ml1">|</div> */}
              <Link
                to="/search"
                className="ml1 no-underline black"
              >
                search
              </Link>
              {isAuth && (
                <div className="flex">
                  <div className="ml1">|</div>
                  <Link
                    to="/create"
                    className="ml1 no-underline black"
                  >
                    submit
                  </Link>
                </div>
              )}
            </div>
            <div className="flex flex-fixed">
              {isAuth ? (
                <div
                  className="ml1 pointer black"
                  onClick={() => {
                    localStorage.removeItem(AUTH_TOKEN);
                    history.push('/');
                    checkAuth()
                  }}
                >
                  logout
                </div>
              ) : (
                <Link
                  to="/login"
                  className="ml1 no-underline black"
                >
                  login
                </Link>
              )}
            </div>
          </div>
        );
      };


export default Header;