import * as React from 'react';

import { useMutation } from '@tanstack/react-query';
import { Popconfirm } from 'antd/lib';

interface CTAButtonProps {
    ctaApi: () => any;
    children: React.ReactNode | ((isLoading: boolean) => React.ReactNode);
    locale?: string;
    isConfirm?: boolean;
    confirmMessage?: string;
    extraOnSuccess?: (data: any) => void;
    extraOnError?: (error: any) => void;
    disabled?: boolean;
}

const CTAButton: React.FC<CTAButtonProps> = ({
    children,
    extraOnSuccess,
    extraOnError,
    ctaApi,
    locale = 'en',
    confirmMessage = 'Are you sure?',
    disabled = false,
    isConfirm = false,
}) => {
    const ctaMutation = useMutation({
        mutationFn: ctaApi,
        onSuccess: (data: any) => {
            if (data.success) {
                extraOnSuccess?.(data);
            } else {
                extraOnError?.(data);
            }
        },
        onError: (error: any) => {
            extraOnError?.(error);
        },
    });

    if (!isConfirm) {
        return <div onClick={() => ctaMutation.mutate()}>{typeof children === 'function' ? children(ctaMutation.isPending) : children}</div>;
    }

    return (
        <Popconfirm disabled={disabled} title={confirmMessage} onConfirm={() => ctaMutation.mutate()}>
            <div>{typeof children === 'function' ? children(ctaMutation.isPending) : children}</div>
        </Popconfirm>
    );
};

export default CTAButton;
