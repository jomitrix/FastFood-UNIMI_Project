import React from 'react';
import { Skeleton } from '@heroui/skeleton';

const SKELETON_HEIGHTS = [67, 57, 48, 69, 42, 37];

export default function SkeletonChart() {
    return (
        <div className="mx-10 mb-10 w-full h-full flex items-end gap-3">
            {SKELETON_HEIGHTS.map((height, i) => (
                <Skeleton
                    key={i}
                    className="flex-1 rounded-xl rounded-b-none"
                    style={{ height: `${height}%` }}
                />
            ))}
        </div>
    );
}