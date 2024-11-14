import { router } from "expo-router";


export const createWebSocket = (identifier: string) => {
    const ws = new WebSocket(`wss://payments.pre-bnvo.com/ws/merchant/${identifier}`);

  ws.onmessage = function (event) {
    const data = JSON.parse(event.data);
    try {
      const { url_ok, status } = data
      if(status){
        router.replace({
          pathname: url_ok ?? '/Pago-recibido',
          params: {
            status
          }
        })
      }
      ws.close();
    } catch (err) {
      console.log(err);
    }
  };
}
