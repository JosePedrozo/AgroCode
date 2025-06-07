import './Header.scss';
import CompanyLogo from '../icon.png'
import { Link } from 'react-router-dom';


function Header() {
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
          <Link to="/listar">Listagem</Link>
          <Link to="/registrar-animal">Registrar animal</Link>
          <Link to="/sobre">Sobre</Link>
          <Link to="/login">Login</Link>
          <Link to="/cadastro">Cadastre-se</Link>
        </div>
      </div>
      </header>
  );
}

export default Header;
