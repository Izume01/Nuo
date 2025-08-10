"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import React, { useRef, useEffect, useState } from 'react'
import usePromptStore from '@/store/usePrompt'
import useDecounce from '@/Home/Hook/useDecounce'
import Link from 'next/link'

const AutoResizeTextarea = () => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const {setPrompt } = usePromptStore();
    const [draft, setDraft] = useState<string>("");

    const debouncedValue = useDecounce(draft , 500);

    useEffect(() => {
        if (debouncedValue) {
            setPrompt(debouncedValue);
        }
    } , [debouncedValue , setPrompt])

    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const adjustHeight = () => {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        };

        textarea.addEventListener('input', adjustHeight);
        adjustHeight(); // Initial adjustment

        return () => textarea.removeEventListener('input', adjustHeight);
    }, []);

    const onSubmitCreateInvoice = () => {
        setPrompt(draft);
        setDraft("");
    }

    return (
        <div className="w-full px-4 sm:px-6">
            <div className="z-10 relative flex flex-col items-center justify-center h-full w-full">
                <Card className="w-full max-w-xl p-4 sm:p-6">
                    <div className="flex flex-col gap-4 sm:gap-6">
                        <Textarea
                            ref={textareaRef}
                            placeholder="Enter your text here"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            className="border-none w-full bg-white resize-none max-h-[150px] sm:max-h-[200px] text-base sm:text-lg overflow-y-auto"
                        />
                        <Link href="/dashboard" className='w-full' onClick={onSubmitCreateInvoice}>
                            <Button className="w-full text-base sm:text-lg py-4 sm:py-6 text-white/90" size="lg">
                                Create Invoice
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default AutoResizeTextarea