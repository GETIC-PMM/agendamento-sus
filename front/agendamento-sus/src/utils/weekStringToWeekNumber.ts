export function weekStringToWeekNumber(array: string[]) {
    const _avaliableDays = [] as number[];
    array.map((avaliable_day: string) => {
        if (avaliable_day === "domingo") _avaliableDays.push(0);
        if (avaliable_day === "segunda") _avaliableDays.push(1);
        if (avaliable_day === "terca") _avaliableDays.push(2);
        if (avaliable_day === "quarta") _avaliableDays.push(3);
        if (avaliable_day === "quinta") _avaliableDays.push(4);
        if (avaliable_day === "sexta") _avaliableDays.push(5);
        if (avaliable_day === "sabado") _avaliableDays.push(6);
    })
    console.log("INTERN AVALIABLE DAYS: ", _avaliableDays)
    return _avaliableDays;
}   