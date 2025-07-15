import { useState, useRef, useCallback, useEffect } from 'react';


export function usePaginator(fetchPage, pageSize = 20) {
    const [items, setItems] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [isLoadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const currentPage = useRef(0);
    const loadGen = useRef(0);

    const loadNext = useCallback(async () => {
        if (currentPage.current > 0 && (isLoadingMore || !hasMore)) return;
        setLoadingMore(true);
        if (currentPage.current === 0) setLoading(true);

        const myGen = loadGen.current;
        const nextPage = currentPage.current + 1;
        try {
            const fetched = await fetchPage(nextPage, pageSize);
            if (myGen !== loadGen.current) return;
            setItems(prev => [...prev, ...fetched]);
            currentPage.current = nextPage;
            setHasMore(fetched.length === pageSize);
        } finally {
            if (myGen === loadGen.current) {
                setLoading(false);
                setLoadingMore(false);
            }
        }
    }, [fetchPage, pageSize, hasMore, isLoadingMore]);

    const loadPage = useCallback(async (page) => {
        if (isLoading || isLoadingMore || !hasMore) return;
        setLoading(true);
        try {
            const fetched = await fetchPage(page, pageSize);
            if (fetched.length === 0) {
                setHasMore(false);
            } else {
                setItems(fetched);
                currentPage.current = page;
            }
        } finally {
            setLoading(false);
        }
    }, [fetchPage, pageSize, hasMore, isLoading, isLoadingMore]);

    const reset = useCallback(async () => {
        loadGen.current += 1;
        setItems([]);
        currentPage.current = 0;
        setHasMore(true);
        await loadNext();
    }, [loadNext]);

    const didInit = useRef(false);
    useEffect(() => {
        if (!didInit.current) {
            reset();
            didInit.current = true;
        }
    }, [reset]);

    return {
        items,
        isLoading,
        isLoadingMore,
        hasMore,
        reset,
        loadNext,
        loadPage
    };
}
