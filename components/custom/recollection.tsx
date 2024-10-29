"use client";

import cx from "classnames";
import { useEffect, useState } from "react";

export function Recollection({ chats }: { chats?: any }) {
  const [isMobile, setIsMobile] = useState(false);
  console.log(chats, "CHATS");
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={cx("flex flex-col gap-4 rounded-2xl p-4 skeleton-bg")}>
      {chats ? (
        <div>
          <p>Hat sich an deine letzten Einträge erinnert.</p>
          {/* {chats.map((chat, j) => {
            return (
              <div key={j}>
                {chat.messages.map((message, i) => {
                  console.log(message);
                  return <p>Recollected your last Moments.</p>;
                  // if(message.content.length ) {
                  // return <p key={i}>{message.content}</p>;
                })}
              </div>
            );
          })}{" "} */}
        </div>
      ) : (
        <p>Erinnert sich an deine letzten Einträge.</p>
      )}
    </div>
  );
}
