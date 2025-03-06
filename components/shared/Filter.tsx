"use client";

import React, { Suspense } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { formUrlQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
    filters: {
        name: string,
        value: string,
    }[];
    otherClasses?: string;
    containerClasses?: string;
}

const Filter = ({ filters, otherClasses, containerClasses }: Props) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const paramFilter = searchParams.get('filter');
    
    const handleUpdateParams = (value: string) => {
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            Key: 'filter',
            Value: value
        });
        router.push(newUrl, { scroll: false });
    }
    
    return (
        <Suspense>
            <div className={`relative ${containerClasses}`}>
            <Select onValueChange={handleUpdateParams} defaultValue={paramFilter || undefined}>
                <SelectTrigger className={`w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-dark-500 dark:to-dark-700 px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl focus:ring-4 focus:ring-indigo-400 ${otherClasses}`}>
                    <div className="line-clamp-1 flex-1 text-left text-gray-800 dark:text-gray-200">
                        <SelectValue placeholder="Select a Filter" />
                    </div>
                </SelectTrigger>
                <SelectContent className="text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-dark-600 rounded-lg shadow-md overflow-hidden">
                    <SelectGroup>
                        {filters.map((item) => (
                            <SelectItem
                                key={item.value}
                                value={item.value}
                                className="cursor-pointer px-4 py-2 hover:bg-gray-300 dark:hover:bg-dark-500 transition-all duration-200 rounded-lg"
                            >
                                {item.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
        </Suspense>
    );
};

export default Filter;