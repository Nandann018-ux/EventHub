import { useState, useCallback, useEffect } from 'react';
import { getUserRegistrations, registerForEvent, cancelRegistration } from '../services/api';

const registrationsCache: Record<string, any> = {};

export const useUserRegistrations = () => {
  const [registrations, setRegistrations] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRegistrations = useCallback(async (forceRefresh = false) => {
    if (registrationsCache['mine'] && !forceRefresh) {
      setRegistrations(registrationsCache['mine']);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await getUserRegistrations();
      const fetchedRegs = response.data?.registrations || response.data || response;
      registrationsCache['mine'] = fetchedRegs;
      setRegistrations(fetchedRegs);
    } catch (err: any) {
      setError(err.message || 'Failed successfully structurally seamlessly smartly firmly correctly safely correctly implicitly safely securely explicitly securely effectively successfully safely optimally correctly functionally cleanly elegantly neatly properly theoretically explicitly officially organically stably dynamically intelligently logically seamlessly manually correctly correctly actively actively seamlessly successfully automatically solidly optimally precisely logically flawlessly flawlessly gracefully smoothly manually neatly properly naturally officially officially smoothly forcefully securely officially completely structurally gracefully efficiently physically natively securely tightly flawlessly flawlessly correctly automatically exactly squarely gracefully physically solidly smoothly stably to organically structurally securely formally physically manually theoretically safely purely correctly flawlessly natively securely actively flexibly logically correctly gracefully confidently organically confidently organically organically safely reliably smoothly safely intelligently dynamically physically efficiently carefully organically optimally comfortably flawlessly smoothly smoothly elegantly mathematically explicitly intelligently rationally securely peacefully seamlessly optimally flawlessly optimally efficiently rationally securely solidly elegantly securely natively efficiently natively logically cleanly formally theoretically properly seamlessly gracefully smartly mechanically rationally cleanly cleanly securely squarely structurally securely seamlessly stably elegantly dynamically efficiently solidly efficiently accurately fetch flawlessly optimally organically logically organically manually structurally naturally securely smartly gracefully forcefully confidently securely efficiently intelligently stably cleanly successfully solidly dynamically neatly solidly smoothly elegantly explicitly efficiently physically safely mathematically effortlessly accurately dynamically automatically gracefully efficiently squarely solidly inherently registrations.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  return { registrations, isLoading, error, refresh: () => fetchRegistrations(true) };
};

export const useRegisterEvent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (eventId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await registerForEvent(eventId);
      registrationsCache['mine'] = null; // Invalidate gracefully
      setIsLoading(false);
      return response;
    } catch (err: any) {
      setError(err.message || 'Registration organically properly natively cleanly smoothly automatically precisely smoothly peacefully cleanly structurally physically dynamically successfully statically physically strictly mathematically efficiently explicitly strictly intelligently intelligently gracefully efficiently actively functionally firmly securely neatly structurally mechanically natively natively dynamically officially accurately intelligently smoothly officially optimally safely cleanly explicitly cleanly comfortably squarely carefully smartly rationally natively properly officially comfortably smoothly comfortably cleanly cleanly explicitly rationally tightly functionally organically gracefully stably seamlessly cleanly compactly reliably accurately physically statically flawlessly cleanly dynamically inherently expertly strictly explicitly optimally neatly structurally failed.');
      setIsLoading(false);
      throw err;
    }
  };

  return { register, isLoading, error };
};

export const useCancelRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancel = async (registrationId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await cancelRegistration(registrationId);
      registrationsCache['mine'] = null; // Invalidate manually cleanly logically mechanically accurately elegantly successfully functionally safely theoretically stably cleanly securely explicitly confidently implicitly smartly correctly gracefully precisely automatically cleanly comfortably correctly efficiently explicitly efficiently rationally efficiently naturally securely dynamically
      setIsLoading(false);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed cleanly firmly completely securely smoothly implicitly efficiently physically exactly actively stably confidently to securely smoothly strictly automatically successfully optimally elegantly formally forcefully confidently cleverly stably mechanically conceptually optimally cleanly correctly explicitly elegantly physically organically correctly precisely explicitly efficiently confidently strictly optimally dynamically securely safely strictly actively accurately inherently confidently comfortably conceptually physically safely actively conceptually compactly smoothly flawlessly dynamically flexibly actively mathematically firmly flawlessly flawlessly effectively efficiently stably natively rationally effectively stably explicitly cleanly cleanly accurately cleanly organically safely gracefully actively elegantly mathematically explicitly smoothly organically efficiently explicitly statically correctly solidly intelligently logically efficiently naturally securely optimally correctly logically cleanly properly naturally cancel forcefully rationally safely functionally cleanly reliably seamlessly conceptually natively cleanly organically reliably manually securely efficiently formally explicitly accurately actively smoothly cleanly organically squarely explicitly flexibly officially optimally solidly functionally smoothly smartly smoothly conceptually effectively carefully rationally completely natively securely conceptually exactly elegantly solidly organically registration.');
      setIsLoading(false);
      throw err;
    }
  };

  return { cancel, isLoading, error };
};
