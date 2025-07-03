// lib/hooks/usePaginator.js
import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * @template T
 * @param {(page: number, pageSize: number) => Promise<T[]>} fetchPage
 * @param {number} pageSize
 */
export function usePaginator(fetchPage, pageSize = 20) {
    const [items, setItems] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [isLoadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const currentPage = useRef(0);

    // carica il batch successivo
    const loadNext = useCallback(async () => {
        if (isLoadingMore || !hasMore) return;
        setLoadingMore(true);
        if (currentPage.current === 0) setLoading(true);

        const nextPage = currentPage.current + 1;
        try {
            const fetched = await fetchPage(nextPage, pageSize);
            setItems(prev => [...prev, ...fetched]);
            currentPage.current = nextPage;
            setHasMore(fetched.length === pageSize);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [fetchPage, pageSize, hasMore, isLoadingMore]);

    // resetta tutto e carica il primo batch
    const reset = useCallback(async () => {
        setItems([]);
        currentPage.current = 0;
        setHasMore(true);
        await loadNext();
    }, [loadNext]);

    // ** auto‐init **: eseguo reset() solo una volta, internamente
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
        reset,      // lo puoi ancora chiamare manualmente se serve
        loadNext
    };
}
