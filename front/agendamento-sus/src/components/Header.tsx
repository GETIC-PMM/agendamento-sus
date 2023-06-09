import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BsFillCircleFill, BsQuestionCircle } from 'react-icons/bs';
import { FiMenu } from 'react-icons/fi';
import MossoroDigitalLogo from '../assets/mossoro-digital-logo.svg';

interface HeaderProps {
  isVisible: boolean;
  isVisibleCallback: (isVisible: boolean) => void;
  activePage: string;
}

const Header = (props: HeaderProps) => {
  const date = new Date();
  const formattedDate = format(date, "EEEE, dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  }).replace(/^(\w)/, (match, p1) => p1.toUpperCase());

  const handleMenuClick = () => {
    props.isVisibleCallback(!props.isVisible);
  };

  return (
    <div className="w-screen bg-white drop-shadow-lg block">
      <div className="flex justify-between py-6 border-b-2 px-7">
        <div className="flex items-center gap-8 cursor-pointer">
          <FiMenu size={26} onClick={handleMenuClick} />
          <img src={MossoroDigitalLogo} alt="" />
        </div>
        <div className="flex gap-7 items-center">
          {/* <BsBell size={26} /> */}
          <BsQuestionCircle size={26} />
          {/* <BsFillGrid3X3GapFill size={26} /> */}
          <BsFillCircleFill size={26} />
        </div>
      </div>
      <div className="px-7 flex flex-col md:flex-row justify-between py-3">
        <span className="font-light text-xl">{`S.U.S -> ${props.activePage
          .replace(/^(\w)/, (match, p1) => p1.toUpperCase())
          .replace('-', ' ')}`}</span>
        <span className="font-light text-xm text-primary-base">
          {formattedDate}
        </span>
      </div>
    </div>
  );
};

export default Header;
