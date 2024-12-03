// "use client";

import { logoutComplete } from "@/app/(auth)/actions";

function useComplete(props: { userType: string }) {
  const handleFinish = async () => {
    console.log("handleFinish");
    if (props.userType === "admin") {
      console.log("handleFinish admin");
      setTimeout(async () => {
        await logoutComplete();
      }, 1000);
    } else {
      setTimeout(() => {
        // router.push("/");
      });
    }
  };

  return {
    handleFinish,
  };
}

export default useComplete;
