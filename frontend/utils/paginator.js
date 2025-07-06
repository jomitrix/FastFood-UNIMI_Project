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
    const loadGen = useRef(0);

    // carica il batch successivo
    const loadNext = useCallback(async () => {
        // if (isLoadingMore || !hasMore) return;
        if (currentPage.current > 0 && (isLoadingMore || !hasMore)) return;
        setLoadingMore(true);
        if (currentPage.current === 0) setLoading(true);

        const myGen = loadGen.current;
        const nextPage = currentPage.current + 1;
        try {
            const fetched = await fetchPage(nextPage, pageSize);
            if (myGen !== loadGen.current) return;      // aborted by a reset
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

    // resetta tutto e carica il primo batch
    const reset = useCallback(async () => {
        loadGen.current += 1;        // bump generation
        setItems([]);
        currentPage.current = 0;
        setHasMore(true);
        await loadNext();            // only this generation’s loadNext will apply
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
        reset,
        loadNext,
        loadPage
    };
}
