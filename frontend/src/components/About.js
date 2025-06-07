import './About.scss';
import cattle from '../cattle.jpeg'
function About() {
  return (
    <div className='about'>
      <div className='about__image'>
        <img src={cattle} alt="rebanho saúdavel" height="500" />
      </div>
      <div className='about__text'>
        <h2>
          Gestão efetiva do seu rebanho!
        </h2>
        <p>
          O RuralCode é o aplicativo ideal para o produtor rural moderno que busca controle, 
          praticidade e eficiência na gestão do seu rebanho. Com uma interface simples e intuitiva, 
          o RuralCode permite o cadastro completo dos animais.
        </p>
        <span>
          <b>
          Com o RuralCode, você tem mais controle, mais produtividade e mais tranquilidade.
          </b>
        </span>
        <p>
          <i>
            A tecnologia no campo está ao seu alcance. Comece agora!
          </i>
        </p>
      </div>
    </div>
  );
}

export default About;
