import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Header.scss';
import CompanyLogo from '../icon.png'
import { Link } from 'react-router-dom';


function Header() {
  const { usuario, logout } = useContext(AuthContext);

  return (
    <header className='header'>
      <div className='header__flex'>
        <div className='header__flex-logo'>
            <div>
              <figure>
                <img src={CompanyLogo} alt='Logo' width={'160px'}/>
              </figure>
            </div>
            <div>
                <h1>Rural<span className='header__flex-span'>Code</span></h1>
                <p>Gestão inteligente, campo eficiente.</p>
            </div>
        </div>
        <div className='header__flex-links'>
           {usuario ? (
             <>
            <Link to="/animal/cadastrar">Registrar animal</Link>
            <Link to="/animal/lista">Listagem do rebanho</Link>
            <span className="usuario-nome">
              Bem-vindo, {usuario.nome || usuario.nome_empresa}
            </span>
            <button onClick={logout} className="logout-btn">
              Sair
            </button>
          </>
          ) : (
            <>
              <Link to="/sobre">Sobre</Link>
              <Link className='btn-enter' to="/entrar">Entrar</Link>
            </>
          )}
        </div>
      </div>
      </header>
  );
}

export default Header;
