import { useTranslation } from "react-i18next";

export function useDeliverTime() {
    const { i18n } = useTranslation();

    const getDeliverDays = () => {
        var result = [];
        var date = new Date();
    
        for (var day = 0; day <= 6; day++) {
    
            result.push({
                label: date.getDate() + ' ' + date.toLocaleString(i18n.language, {
                    month: 'long'
                }),
                value: date.getDate() + '.' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '.' + date.getFullYear(),
            })
    
            date.setDate(date.getDate() + 1);
        }
    
        return result;
    }
    
    const getDeliverHours = (selectedDay: string, selectedHour: string) => {
        var result = [],
            hourStart = 11,
            hourEnd = 22;
    
        const date = new Date();
        const nowday = date.getDate() + '.' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '.' + date.getFullYear();
        const isNowday = selectedDay == nowday;
    
        if (isNowday) {
            hourStart = date.getHours() + 1;
        }
    
        if (getDeliverMinutes(selectedDay, selectedHour).length === 0) {
            hourStart += 1;
        }
    
        for (var hour = hourStart; hour <= hourEnd; hour++) {
            result.push({
                label: hour.toString(),
                value: hour.toString()
            })
        }
        return result;
    }
    
    const getDeliverMinutes = (selectedDay: string, selectedHour: string) => {
        var result = [],
            minuteStart = 0,
            minuteEnd = 5;
    
        const date = new Date();
        const nowday = date.getDate() + '.' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '.' + date.getFullYear();
        const isNowday = selectedDay === nowday;
        const isNow = Number(selectedHour) == date.getHours() + 1;
    
        if (isNowday && isNow) {
            minuteStart = Math.ceil(date.getMinutes() / 10) + 1;
        }
    
        if (minuteStart >= minuteEnd)
            minuteStart = 0;
    
        for (var minute = minuteStart; minute <= minuteEnd; minute++) {
            result.push({
                label: minute === 0 ? '00' : (minute * 10) + '',
                value: minute === 0 ? '00' : (minute * 10) + ''
            })
        }
        return result;
    }

    return { getDeliverDays, getDeliverHours, getDeliverMinutes }
}