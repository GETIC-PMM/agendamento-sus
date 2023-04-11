{/* <div className='mt-6'>
                    <h1 className='font-bold'>Adicionar tipos de atendimento</h1>
                    <div className='flex gap-2'>
                        <Select
                            value={selectedTiposAtendimento}
                            sx={{ width: "100%", color: "black" }}
                            onChange={(e) => {
                                setSelectedTiposAtendimento(e.target.value as number)
                                console.log(e.target.value)
                            }}
                        >
                            {tiposAtendimento.map((tipoAtendimento: any) => {
                                return (
                                    <MenuItem value={tipoAtendimento.id}>{tipoAtendimento.name}</MenuItem>
                                )
                            })}
                        </Select>
                        <button className='bg-green-800 px-3 py-2 rounded text-white' onClick={addAtendimentoType}>Adicionar</button>
                    </div>
                </div>

                <div>
                    {includedAtendimentos.map((atendimento: any) => {
                        return (
                            <div className='flex flex-col gap-2'>
                                <div className="flex flex-col mt-4">
                                    <TextField label="Número de vagas por dia" value={vacancyPerDay || 0} onChange={(e) => { setVacancyPerDay(Number(e.target.value)) }} />
                                </div>

                                <h3 className='mt-4'>Dias de atendimento da unidade:</h3>
                                <div className='grid grid-cols-2'>
                                    <FormControlLabel control={<Checkbox onChange={
                                        (e) => {
                                            if (e.target.checked) {
                                                setSelectedWorkingDays([...selectedWorkingDays, "domingo"])
                                            } else {
                                                setSelectedWorkingDays(selectedWorkingDays.filter((day: any) => day !== "domingo"))
                                            }

                                            console.log(selectedWorkingDays)
                                        }} />} label="Domingo" />
                                    <FormControlLabel control={<Checkbox onChange={
                                        (e) => {
                                            if (e.target.checked) {
                                                setSelectedWorkingDays([...selectedWorkingDays, "segunda"])
                                            } else {
                                                setSelectedWorkingDays(selectedWorkingDays.filter((day: any) => day !== "segunda"))
                                            }

                                            console.log(selectedWorkingDays)
                                        }} />} label="Segunda" />
                                    <FormControlLabel control={<Checkbox onChange={
                                        (e) => {
                                            if (e.target.checked) {
                                                setSelectedWorkingDays([...selectedWorkingDays, "terca"])
                                            } else {
                                                setSelectedWorkingDays(selectedWorkingDays.filter((day: any) => day !== "terca"))
                                            }

                                            console.log(selectedWorkingDays)
                                        }} />} label="Terça" />
                                    <FormControlLabel control={<Checkbox onChange={
                                        (e) => {
                                            if (e.target.checked) {
                                                setSelectedWorkingDays([...selectedWorkingDays, "quarta"])
                                            } else {
                                                setSelectedWorkingDays(selectedWorkingDays.filter((day: any) => day !== "quarta"))
                                            }

                                            console.log(selectedWorkingDays)
                                        }} />} label="Quarta" />
                                    <FormControlLabel control={<Checkbox onChange={
                                        (e) => {
                                            if (e.target.checked) {
                                                setSelectedWorkingDays([...selectedWorkingDays, "quinta"])
                                            } else {
                                                setSelectedWorkingDays(selectedWorkingDays.filter((day: any) => day !== "quinta"))
                                            }

                                            console.log(selectedWorkingDays)
                                        }} />} label="Quinta" />
                                    <FormControlLabel control={<Checkbox onChange={
                                        (e) => {
                                            if (e.target.checked) {
                                                setSelectedWorkingDays([...selectedWorkingDays, "sexta"])
                                            } else {
                                                setSelectedWorkingDays(selectedWorkingDays.filter((day: any) => day !== "sexta"))
                                            }

                                            console.log(selectedWorkingDays)
                                        }} />} label="Sexta" />
                                    <FormControlLabel control={<Checkbox onChange={
                                        (e) => {
                                            if (e.target.checked) {
                                                setSelectedWorkingDays([...selectedWorkingDays, "sabado"])
                                            } else {
                                                setSelectedWorkingDays(selectedWorkingDays.filter((day: any) => day !== "sabado"))
                                            }

                                            console.log(selectedWorkingDays)
                                        }} />} label="Sábado" />
                                </div>
                            </div>
                        )
                    })}
                </div> */}