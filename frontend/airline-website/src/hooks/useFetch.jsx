import { useState, useEffect } from 'react';

const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const res = await fetch(url, {
                    credentials: 'include', // Cho phép gửi cookie session
                });

                if (!res.ok) {
                    setError('Failed to fetch');
                    setLoading(false);
                    return;
                }

                const result = await res.json();
                setData(result.data || result); // Lấy `result.data` nếu backend trả dạng đó
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return {
        data,
        error,
        loading,
    };
};

export default useFetch;
