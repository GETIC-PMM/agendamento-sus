import React, { useEffect } from 'react'
const ChatBoxWidget = () => {
    useEffect(() => {
        const script = document.createElement('script');

        script.src = "https://cdn.jsdelivr.net/npm/botman-web-widget@0/build/js/chat.js";
        script.id = 'botmanWidget';
        script.async = true;

        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = "https://cdn.jsdelivr.net/npm/botman-web-widget@0/build/assets/css/chat.min.css";
        css.type = 'text/css';

        document.body.appendChild(script);
        document.body.appendChild(css);

        return () => {
            document.body.removeChild(script);
            document.body.removeChild(css);
        }
    })

    return (
        <></>
    )
}

export default ChatBoxWidget