import React from 'react';
import { Skeleton } from '@heroui/skeleton';

const SKELETON_HEIGHTS = [67, 57, 48, 69, 42, 37];

export default function SkeletonChart() {
    return (
        <div className="w-3/5 h-full flex items-end gap-3">
            {SKELETON_HEIGHTS.map((height, i) => (
                <Skeleton
                    key={i}
                    className="flex-1"
                    style={{ height: `${height}%` }}
                />
            ))}
        </div>
    );
}