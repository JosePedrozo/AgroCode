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
          <Link to="/cadastrar">Cadastrar</Link>
          <Link to="/login">Login/Cadastro</Link>
        </div>
      </div>
      </header>
  );
}

export default Header;
