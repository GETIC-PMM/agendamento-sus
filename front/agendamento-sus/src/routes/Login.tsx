const Login = () => {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-blue-200">
            {/* FORM BOX */}
            <div className="bg-blue-500 px-8 py-12 rounded-md drop-shadow-lg flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight text-center">Login</h1>

                {/* FORM INPUTS */}
                <form className="flex flex-col">
                    <label htmlFor="email" className="block text-gray-700 font-bold mb-1">Email</label>
                    <input type="email" className="w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" name="email" id="email" />
                    <label className="mt-2 block text-gray-700 font-bold mb-1" htmlFor="password">Senha</label>
                    <input type="password" className="w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" name="password" id="password" />
                    <button className="mt-8 bg-blue-200 hover:bg-blue-300 text-zinc-900 font-bold py-2 px-4 rounded" type="submit">Entrar</button>
                </form>
            </div>
        </div>
    )
}

export default Login