import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

import { timeApi } from '@/core/api/time.api';
import CTAButton from '@/core/components/cta/CTABtn';
import { FieldType } from '@/core/components/field/FieldDisplay';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { toastError } from '@/core/utils/api.helper';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();

    useDocumentTitle('Time List');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="time-list"
                    title="Time List"
                    columns={[
                        {
                            key: 'timeId',
                            title: 'Id',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'time1',
                            title: 'Time',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'hall',
                            title: 'Hall',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'slot',
                            title: 'Slot',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'classGroupName',
                            title: 'Class Group',
                            type: FieldType.TEXT,
                        },
                    ]}
                    queryApi={timeApi.getAll}
                    actionColumns={(record) => {
                        return (
                            <div className="flex flex-col gap-2">
                                <CTAButton
                                    ctaApi={() => timeApi.delete(record.teacherId)}
                                    isConfirm
                                    confirmMessage="Are you sure you want to delete this time?"
                                    extraOnError={toastError}
                                    extraOnSuccess={() => {
                                        queryClient.invalidateQueries({
                                            queryKey: ['time-list'],
                                        });

                                        toast.success('Delete time successfully');
                                    }}
                                >
                                    <Button
                                        type="primary"
                                        danger
                                        size="small"
                                        className="flex items-center justify-center"
                                        icon={<Trash className="h-4 w-4" />}
                                    ></Button>
                                </CTAButton>
                            </div>
                        );
                    }}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/times/')({
    component: Page,
});
