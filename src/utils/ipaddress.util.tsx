import $ from 'jquery';


const getIpAddress = () => {

    return new Promise((resolve, reject) => {
        $.get('https://www.cloudflare.com/cdn-cgi/trace', function(data) {

            // Convert to JSON like data
            data = data.trim().split('\n').reduce(function(obj: any, pair: any) {
                pair = pair.split('=');
                return obj[pair[0]] = pair[1], obj;
            }, {});

            if(data){
                resolve(data);
            }else{
                reject('No IP data returned');
            }

        });
    })
}




export default { getIpAddress };