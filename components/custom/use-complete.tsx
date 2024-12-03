function useComplete(props: { userType: string }) {
  const handleFinish = async () => {
    if (props.userType === "short") {
      window.history.replaceState({}, "", `/abschluss`);
    } else {
      window.history.replaceState({}, "", `/`);
    }
  };

  return {
    handleFinish,
  };
}

export default useComplete;
