import { useState, useEffect } from "react";

interface IError {
  message: string;
}

/* hook for getting browser’s geolocation*/
export const usePosition = (): any => {

  const [position, setPosition] = useState({latitude: 0, longitude:0});
  const [positionError, setPositionError] = useState<string>('');

  const onChange = ({ coords }: any): void => {
    setPosition({
      latitude: coords.latitude,
      longitude: coords.longitude
    });
  };
  const onError = (error: IError): void => {
    setPositionError(error.message);
  };
  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      setPositionError("Geolocation is not supported");
      return;
    }
    const watcher = geo.watchPosition(onChange, onError);
    return () => geo.clearWatch(watcher);
  }, []);
  
  return { ...position, positionError };

};
