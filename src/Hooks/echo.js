// echo.js
import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

let echoInstance = null;

const getEchoInstance = token => {
  if (!token) {
    console.error("No authentication token provided");
    return null;
  }

  // If instance exists but token changed, disconnect and create new instance
  if (
    echoInstance &&
    echoInstance.options.auth.headers.Authorization !== `Bearer ${token}`
  ) {
    echoInstance.disconnect();
    echoInstance = null;
  }

  if (!echoInstance) {
    echoInstance = new Echo({
      broadcaster: "pusher",
      key: import.meta.env.VITE_PUSHER_APP_KEY,
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
      forceTLS: true,
      authEndpoint: `${import.meta.env.VITE_SITE_URL}/api/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    });
  }
  return echoInstance;
};

export default getEchoInstance;
