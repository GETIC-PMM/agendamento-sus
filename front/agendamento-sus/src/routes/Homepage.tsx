import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import { useState } from "react"

const Homepage = () => {
    const [activeSidebar, setActiveSidebar] = useState("");
    const [sidebarIsVisible, setSidebarIsVisible] = useState(true);

    return (
        <div>
            <Header isVisible={sidebarIsVisible} isVisibleCallback={setSidebarIsVisible} />
            <div className="flex">
                <Sidebar isVisible={sidebarIsVisible} activeSidebar={activeSidebar} callback={setActiveSidebar} />
                {activeSidebar === "inicio" && <div>Inicio</div>}
                {activeSidebar === "unidades" && <div>Unidades</div>}
                {activeSidebar === "cadastrar-unidades" && <div>Cadastrar Unidades</div>}
                {activeSidebar === "agentes" && <div>Agentes</div>}
                {activeSidebar === "cadastrar-agentes" && <div>Cadastrar Agentes</div>}
            </div>
        </div>
    )
}

export default Homepage