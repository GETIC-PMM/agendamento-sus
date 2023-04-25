import { AiFillHome, AiOutlineSchedule } from 'react-icons/ai'
import { FaRegHospital } from 'react-icons/fa'
import { MdOutlineLocalHospital } from 'react-icons/md'
import { IoIosMedical } from 'react-icons/io'
import { FaHandHoldingMedical } from 'react-icons/fa'
import { GrScheduleNew } from 'react-icons/gr'

interface SidebarProps {
    activeSidebar: string;
    isVisible: boolean;
    callback: (activeSidebar: string) => void;
}

const Sidebar = (props: SidebarProps) => {
    console.log(props.isVisible)

    return (
        <div className={`w-screen md:w-[250px] bg-primary-base h-auto py-9 transition-all ${props.isVisible ? '' : '-translate-x-[250px] relative hidden h-full'}`}>
            <div>
                <button
                    onClick={() => props.callback("inicio")}
                    className={`text-white flex w-full items-center gap-3 text-md font-light py-3 px-2 border-l-4 border-primary-base-alt
                        ${props.activeSidebar === "inicio" ? "bg-primary-dark border-primary-base-alt" : "bg-primary-base-alt border-primary-light"}`}
                >
                    <AiFillHome />
                    Dashboard
                </button>
                <button
                    onClick={() => props.callback("unidades")}
                    className={`text-white flex w-full items-center gap-3 text-md font-light py-3 px-2 border-l-4 border-primary-base-alt
                        ${props.activeSidebar === "unidades" ? "bg-primary-dark border-primary-base-alt" : "bg-primary-base-alt border-primary-light"}`}
                >                    <FaRegHospital />
                    Unidades
                </button>
                <button
                    onClick={() => props.callback("cadastrar-unidades")}
                    className={`text-white flex w-full items-center gap-3 text-md font-light py-3 px-2 border-l-4 border-primary-base-alt
                        ${props.activeSidebar === "cadastrar-unidades" ? "bg-primary-dark border-primary-base-alt" : "bg-primary-base-alt border-primary-light"}`} >
                    <MdOutlineLocalHospital />
                    Cadastrar Unidade
                </button>
                <button
                    onClick={() => props.callback("tipo-atendimento")}
                    className={`text-white flex items-center gap-3 w-full text-md font-light py-3 px-2 border-l-4 border-primary-base-alt
                        ${props.activeSidebar === "tipo-atendimento" ? "bg-primary-dark border-primary-base-alt" : "bg-primary-base-alt border-primary-light"}`} >
                    <AiOutlineSchedule />
                    Tipos de Atendimento
                </button>
                <button
                    onClick={() => props.callback("agentes")}
                    className={`text-white flex w-full items-center gap-3 text-md font-light py-3 px-2 border-l-4 border-primary-base-alt
                        ${props.activeSidebar === "agentes" ? "bg-primary-dark border-primary-base-alt" : "bg-primary-base-alt border-primary-light"}`}
                >
                    <IoIosMedical />
                    Agentes
                </button>
                <button
                    onClick={() => props.callback("cadastrar-agentes")}
                    className={`text-white flex w-full items-center gap-3 text-md font-light py-3 px-2 border-l-4 border-primary-base-alt
                        ${props.activeSidebar === "cadastrar-agentes" ? "bg-primary-dark border-primary-base-alt" : "bg-primary-base-alt border-primary-light"}`}
                >
                    < FaHandHoldingMedical />
                    Cadastrar Agentes
                </button>

            </div>
        </div>
    )
}

export default Sidebar