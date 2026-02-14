import { useState, useCallback } from "react";
import api from "~/lib/axios";

type RequestOptions = {
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    url: string;
    payload?: any;
    headers?: Record<string, string>;
};

export default function useRequest() {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);

    const makeRequest = useCallback(async (options: RequestOptions) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.request({
                method: options.method,
                url: options.url,
                data: options.payload,
                headers: options.headers,
            });
            setData(response.data);
            setIsSuccess(true);
            return { ok: true, data: response.data };
        } catch (err: any) {
            const errorData = err?.response?.data || err;
            setError(errorData);
            setIsError(true);
            if (errorData?.data?.validationErrors) {
                setValidationErrors(errorData.data.validationErrors);
            }
            return { ok: false, error: errorData };
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { 
        makeRequest,
        data, 
        error, 
        isSuccess,
        isError,
        validationErrors,
        isLoading 
    };
}
