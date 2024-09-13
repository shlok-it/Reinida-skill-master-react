export { formatDate, formatMonth, formatDateTime, formatTime, only_number,valueOnly, convertNumberToWords,session_year,dateDiffer }
/*
const set = name => {
    return ({ target: { value } }) => {
        setValues(oldValues => ({ ...oldValues, [name]: value }));
    }
}; */
const convertNumberToWords = (amount) => {
    const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

    const zero = "Zero";
    const arab = "Arab";
    const crore = "Crore";
    const lakh = "Lakh";
    const thousand = "Thousand";
    const hundred = "Hundred";
    const currency = "Rupees";
    const paisa = "Paisa";
    const only = "Only";
    if (amount === 0) return `${zero} ${currency} ${only}`;

    function convert(num) {
        let parts = [];
        if (num >= 1e9) {
            parts.push(`${convert(Math.floor(num / 1e9))} ${arab}`);
            num %= 1e9;
        }
        if (num >= 1e7) {
            parts.push(`${convert(Math.floor(num / 1e7))} ${crore}`);
            num %= 1e7;
        }
        if (num >= 1e5) {
            parts.push(`${convert(Math.floor(num / 1e5))} ${lakh}`);
            num %= 1e5;
        }
        if (num >= 1000) {
            parts.push(`${convert(Math.floor(num / 1000))} ${thousand}`);
            num %= 1000;
        }
        if (num >= 100) {
            parts.push(`${convert(Math.floor(num / 100))} ${hundred}`);
            num %= 100;
        }
        if (num >= 20) {
            parts.push(`${tens[Math.floor(num / 10)]}`);
            if (num % 10 > 0) parts.push(units[num % 10]);
        } else if (num >= 10) {
            parts.push(`${teens[num - 10]}`);
        } else if (num > 0) {
            parts.push(`${units[num]}`);
        }
        return parts.join(" ");
    }

    let integerPart = Math.floor(amount);
    let wholeWordPart = convert(integerPart);
    let result = wholeWordPart ? `${wholeWordPart} ${currency}` : '';

    let decimalPart = Math.round((amount - integerPart) * 100);
    if (decimalPart > 0) {
        if (wholeWordPart) {
            result += " and ";
        }
        result += `${convert(decimalPart)} ${paisa}`;
    }

    return `${result} ${only}`;
};
const dateDiffer = (date_from, date_to) => {
    var dt1 = new Date(date_from);
    var dt2 = new Date(date_to);
    const dif = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
    if(dif>=0){
        return (dif+1)
    }else{
        return 'Invaid date';
    }
}
const formatDateTime = (date, type = null) => {
    if (date) {
        var date = new Date(date);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, 0);
        var date = String(date.getDate()).padStart(2, 0);
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        if (type == 'time')
            var strTime = hours + ':' + minutes + ' ' + ampm;
        else if (type == 'date')
            var strTime = year + '-' + month + '-' + date;
        else
            var strTime = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ' ' + ampm;

        return strTime;
    }
    else {
        return '---';
    }
}
const formatTime = (date) => {
    if (date) {
        let [hours, minutes, seconds] = date.split(":");
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        return hours + ':' + minutes + ' ' + ampm;
    }
    else {
        return "---";
    }
}
const only_number = (e) => {
    e.target.value = e.target.value.replace(/[^0-9.]/g, '');
}
const monthNames = {
    "01": "January", "02": "February", "03": "March", "04": "April", "05": "May", "06": "June",
    "07": "July", "08": "August", "09": "September", "10": "October", "11": "November", "12": "December"
};
const monthNamesSort = {
    "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun",
    "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
};
const formatDate = (date, formate = '') => {
    if (date!=undefined && date!=0 && date !=null) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        if (formate == 'string')
            return d.toDateString();
        else if (formate == 'time')
            return d.toTimeString();
        else if (formate == 'day_month')
            return [day, monthNames[month]].join(' ');
        else if (formate == 'dmy')
            return [day, monthNamesSort[month] , year].join(' ');
        else
            return [year, month, day].join('-');
    }
    else {
        return '---';
    }
}
const formatMonth = (date,type='other') => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    if(type=='month_name'){
        return [monthNames[month],year].join('-');
    }else if(type=='only_month_name'){
        return monthNames[month];  
      }
    else{
        return [year, month].join('-');

    }
}

const session_year = ()=>{
    let d   =  new Date();
    let  month =  (d.getMonth() + 1);
    let year = d.getFullYear();
    let nextYear = year+1;
    let prevYear = year-1;
    if(month<=4){
        return prevYear+' - '+year;
    }
    else if(month>4){
        return year+' - '+nextYear;
    }
    return '';
}

const valueOnly=(value='')=>{
    if(value){
        return value;
    }else{
        return '';
    }
}