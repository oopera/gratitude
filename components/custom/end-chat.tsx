"use client";

import cx from "classnames";

export function EndChat({ chats }: { chats?: any }) {
  return (
    <div className={cx("flex flex-col gap-4 rounded-2xl p-4 skeleton-bg")}>
      {chats ? (
        <p>Hat sich an deine letzten Einträge erinnert.</p>
      ) : (
        <p>Erinnert sich an deine letzten Einträge.</p>
      )}
    </div>
  );
}
