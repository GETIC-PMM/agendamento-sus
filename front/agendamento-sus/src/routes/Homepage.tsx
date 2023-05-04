import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';
import ShowUnidades from '../components/ShowUnidades';
import CreateUnidade from '../components/CreateUnidade';
import ShowAgentes from '../components/ShowAgentes';
import CreateAgentes from '../components/CreateAgentes';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import TipoAtendimento from '../components/TipoAtendimento';
import Dashboard from '../components/Dashboard';

const Homepage = () => {
  const [activeSidebar, setActiveSidebar] = useState('unidades');
  const [sidebarIsVisible, setSidebarIsVisible] = useState(true);
  const [editId, setEditId] = useState(-1);

  const navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get('token')) {
      navigate('/admin/login');
    } else {
      console.log(Cookies.get('token'));
    }
  }, []);

  return (
    <div className="overflow-x-hidden">
      <Header
        isVisible={sidebarIsVisible}
        activePage={activeSidebar}
        isVisibleCallback={setSidebarIsVisible}
      />
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-141.6px)]">
        <Sidebar
          isVisible={sidebarIsVisible}
          activeSidebar={activeSidebar}
          callback={setActiveSidebar}
        />
        <div className="w-full flex justify-center">
          <div className="md:px-0 p-2 md:w-[80%] py-9">
            {activeSidebar === 'inicio' && <Dashboard />}
            {activeSidebar === 'unidades' && <ShowUnidades />}
            {activeSidebar === 'cadastrar-unidades' && (
              <CreateUnidade callback={setActiveSidebar} />
            )}
            {activeSidebar === 'tipo-atendimento' && <TipoAtendimento />}
            {activeSidebar === 'agentes' && <ShowAgentes />}
            {activeSidebar === 'cadastrar-agentes' && <CreateAgentes />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
