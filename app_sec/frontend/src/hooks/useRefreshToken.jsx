import axios from '../api/axios';
import useSessionStorage from './useSessionStorage';

const useRefreshToken = () => {
  const [user, setUser] = useSessionStorage('auth');
  const [ time, setTime] = useSessionStorage('time');

  const refreshToken = async () => {
    const res = await axios
      .get(`/user/reloadToken?email=${user.email}&oldToken=${user.token}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error('ERROR ->> ', JSON.stringify(err));
      });

    if (res) {

      setUser({
        ...user,
        token: res.new_token,
      });
      setTime(new Date());
      return res.new_tokenn;
    } else {
      return null;
    }
  };

  return refreshToken;
};

export default useRefreshToken;
