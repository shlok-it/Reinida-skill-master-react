 const  Bs64Image = (files) => {
    let value ='';
        if (files && files!='remove') {
            const reader = new FileReader()
            reader.readAsDataURL(files)
            reader.onload = () => {
                value = reader.result 
            };
            return value;
        }else{
            return '';
        }
    }

    export default Bs64Image