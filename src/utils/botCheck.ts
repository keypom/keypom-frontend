import DeviceInfoSDK from './deviceInfoSDK';

export async function botCheck() {
    const botURL = "https://api.shard.dog/check-bot";
    let bot = true;

    const base64Info = await DeviceInfoSDK.fetchIPDetails('8d3N9kjvn8BeUIs');
    console.log("base64Info: " + base64Info);
    console.log(atob(base64Info));

    const xhrPromise = new Promise<boolean>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", botURL, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("x-device-fingerprint", base64Info);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    console.log('Data successfully sent to the server');
                    const responseContent = JSON.parse(xhr.responseText);
                    console.log(responseContent);
                    console.log(responseContent.body);
                    bot = responseContent.body;
                    resolve(bot);
                } else {
                    console.error('Error sending data to the server');
                    reject(new Error('Error sending data to the server'));
                }
            }
        };
        const payload = JSON.stringify({});
        xhr.send(payload);
    });

    try {
        bot = await xhrPromise;
    } catch (error) {
        console.error(error);
    }

    return bot;
}
