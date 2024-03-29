import jwt from 'jwt-decode';

export default function CheckACTokenAndRFToken() {
    try {
        const access_token = localStorage.getItem('access_token');

        if (!access_token || access_token === 'undefined')
            return null;

        const decoded = jwt(access_token);
        const now = Date.now() / 1000;
        const exp = decoded.exp;

        if (exp > now)
            return decoded;
        else {
            const refresh_token = localStorage.getItem('refresh_token');
            if (!refresh_token || refresh_token === 'undefined')
                return null;
            else {
                fetch('http://localhost:8000/api/users/get-new-access-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        refresh: refresh_token
                    })
                }).then(
                    (res) => {
                        res.json().then(
                            (r) => {
                                switch (r.status) {
                                    case 200:
                                        localStorage.setItem('access_token', r.data.access_token);
                                        return jwt(r.data.access_token)
                                    default:
                                        localStorage.removeItem('access_token');
                                        localStorage.removeItem('refresh_token');
                                        return null;
                                }
                            }
                        )
                    }
                )
            }
        }
    } catch (e) {
        console.log(e);
        return null;
    }

}