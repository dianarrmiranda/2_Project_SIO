import axios from '../api/axios';
import useSessionStorage from './useSessionStorage';

const useRefreshToken = () => {
  const [user, setUser] = useSessionStorage('auth');

  const refreshToken = async () => {
    const res = await axios
      .get(`/user/reloadToken?email=${user.email}&oldToken=${user.token}`)
      .then((res) => {
        console.log(res);
        return res.data;
      })
      .catch((err) => {
        console.error('ERROR -> ', err);
      });

    if (res) {
      console.log('Old Token ->', user.token);
      console.log('Refresh Token ->', res);

      setUser({
        ...user,
        token: data.token,
      });
      return data.token;
    } else {
      return null;
    }
  };

  return refreshToken;
};

export default useRefreshToken;
