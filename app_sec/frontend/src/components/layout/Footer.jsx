import logo from '../../assets/deti_store_logo.svg';
import { RiGithubFill, RiInstagramFill,RiFacebookBoxFill } from 'react-icons/ri';

const Footer = () => {
  return (
    <footer className="footer p-10 bg-neutral text-neutral-content bottom-0">
      <aside>
        <img className='w-[10vw] bg-slate-300' src={logo} />
        <h2>
          DETI Merchandising Store
          <br />
          The merch you need to cry in style
        </h2>
      </aside>
      <nav>
        <header className="footer-title">Social</header>
        <div className="grid grid-flow-col gap-4">
          <a href='#'>
            <RiGithubFill className='text-xl' />
          </a>
          <a href='#'>
            <RiInstagramFill className='text-xl' />
          </a>
          <a href='#'>
            <RiFacebookBoxFill className='text-xl' />
          </a>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
