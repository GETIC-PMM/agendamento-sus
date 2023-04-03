import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import { useEffect, useState } from "react"
import ShowUnidades from "../components/ShowUnidades";
import CreateUnidade from "../components/CreateUnidade";
import ShowAgentes from "../components/ShowAgentes";
import CreateAgentes from "../components/CreateAgentes";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import TipoAtendimento from "../components/TipoAtendimento";

const Homepage = () => {
    const [activeSidebar, setActiveSidebar] = useState("");
    const [sidebarIsVisible, setSidebarIsVisible] = useState(true);

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
            <Header isVisible={sidebarIsVisible} activePage={activeSidebar} isVisibleCallback={setSidebarIsVisible} />
            <div className="flex min-h-[calc(100vh-141.6px)]">
                <Sidebar isVisible={sidebarIsVisible} activeSidebar={activeSidebar} callback={setActiveSidebar} />
                <div className="w-full flex justify-center">
                    <div className="w-[80%] py-9">
                        {activeSidebar === "inicio" && <div>oi</div>}
                        {activeSidebar === "unidades" && <ShowUnidades />}
                        {activeSidebar === "cadastrar-unidades" && <CreateUnidade />}
                        {activeSidebar === "tipo-atendimento" && <TipoAtendimento />}
                        {activeSidebar === "agentes" && <ShowAgentes />}
                        {activeSidebar === "cadastrar-agentes" && <CreateAgentes />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Homepage