import { useEffect } from 'react';

const ChatBox = () => {
  useEffect(() => {
    const script = document.createElement('script');

    script.src =
      'https://cdn.jsdelivr.net/npm/botman-web-widget@0/build/js/widget.js';
    script.async = true;

    document.body.appendChild(script);

    const scriptWidget = document.createElement('script');

    scriptWidget.innerHTML = `var botmanWidget = {
            frameEndpoint: '/chatbot'
        };`;

    document.body.appendChild(script);
    document.body.appendChild(scriptWidget);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(scriptWidget);
    };
  });

  return <></>;
};

export default ChatBox;
