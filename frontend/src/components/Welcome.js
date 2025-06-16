import './Welcome.scss';
import { Link } from 'react-router-dom';


function Welcome() {
  return (
    <div className='welcome'>
        <h2 className='welcome__title'>
            Seja bem-vindo(a)!
        </h2>
        <p className='welcome__text'>
            Realize o login para continuar.
        </p>
        <span className='welcome__span'>
            Caso não possua uma conta, realize seu cadastro.
        </span>
        <div className='welcome__cta'>
          <Link to="/login"><btn>Login</btn></Link>
          <Link to="/cadastro"><btn>Cadastre-se</btn></Link> 
        </div>
    </div>
  );
}

export default Welcome;
