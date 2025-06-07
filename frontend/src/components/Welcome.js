import './Welcome.scss';

function Welcome() {
  return (
    <div className='welcome'>
        <h2 className='welcome__title'>
            Seja bem-vindo!
        </h2>
        <p className='welcome__text'>
            Realize o login para continuar.
        </p>
        <span className='welcome__span'>
            Caso não possua uma conta, realize sua inscrição.
        </span>
    </div>
  );
}

export default Welcome;
