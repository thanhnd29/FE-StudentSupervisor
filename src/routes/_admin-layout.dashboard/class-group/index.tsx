import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { classGroupApi } from '@/core/api/class-group.api';
import CTAButton from '@/core/components/cta/CTABtn';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { ClassGroupStatus } from '@/core/models/class-group';
import { FilterComparator } from '@/core/models/common';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { toastError } from '@/core/utils/api.helper';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();

    useDocumentTitle('Class Group List');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="class-group"
                    title="Class Group List"
                    columns={[
                        {
                            key: 'classGroupId',
                            title: 'ID',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'classGroupName',
                            title: 'Class Group Name',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'hall',
                            title: 'Hall',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'status',
                            title: 'Status',
                            type: FieldType.BADGE_API,
                            apiAction() {
                                return classGroupApi.getEnumStatus();
                            },
                        },
                    ]}
                    queryApi={classGroupApi.getAll}
                    actionColumns={(record) => {
                        return (
                            <div className="flex flex-col gap-2">
                                <ModalBuilder
                                    btnLabel=""
                                    btnProps={{
                                        size: 'small',
                                        icon: <EditOutlined />,
                                    }}
                                    title="Edit Class Group"
                                >
                                    {(close) => {
                                        return (
                                            <FormBuilder
                                                className="!p-0"
                                                title=""
                                                apiAction={(dto) => classGroupApi.update(dto)}
                                                defaultValues={{
                                                    classGroupName: record.classGroupName,
                                                    hall: record.hall,
                                                    status: record.status,
                                                    classGroupId: record.classGroupId,
                                                }}
                                                schema={{
                                                    classGroupName: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                    hall: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                    status: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                    classGroupId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                }}
                                                fields={[
                                                    {
                                                        name: 'classGroupName',
                                                        label: 'Class Group Name',
                                                        type: NKFormType.TEXT,
                                                    },
                                                    {
                                                        name: 'hall',
                                                        label: 'Hall',
                                                        type: NKFormType.TEXT,
                                                    },
                                                    {
                                                        name: 'status',
                                                        label: 'Status',
                                                        type: NKFormType.SELECT_API_OPTION,
                                                        fieldProps: {
                                                            apiAction: classGroupApi.getEnumStatus,
                                                        },
                                                    },
                                                ]}
                                                onExtraSuccessAction={() => {
                                                    toast.success('Update Class Group successfully');
                                                    queryClient.invalidateQueries({
                                                        queryKey: ['class-group'],
                                                    });

                                                    close();
                                                }}
                                                onExtraErrorAction={toastError}
                                            />
                                        );
                                    }}
                                </ModalBuilder>
                                <CTAButton
                                    ctaApi={() => classGroupApi.delete(record.classGroupId)}
                                    isConfirm
                                    confirmMessage="Are you sure you want to delete this class group?"
                                    extraOnError={toastError}
                                    extraOnSuccess={() => {
                                        queryClient.invalidateQueries({
                                            queryKey: ['class-group'],
                                        });

                                        toast.success('Delete class group successfully');
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
                    filters={[
                        {
                            label: 'Name',
                            comparator: FilterComparator.LIKE,
                            name: 'classGroupName',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Hall',
                            comparator: FilterComparator.LIKE,
                            name: 'hall',
                            type: NKFormType.TEXT,
                        },
                    ]}
                    extraButtons={
                        <ModalBuilder
                            btnLabel="Create Class Group"
                            btnProps={{
                                type: 'primary',
                                icon: <PlusOutlined />,
                            }}
                            title="Create Class Group"
                        >
                            {(close) => {
                                return (
                                    <FormBuilder
                                        className="!p-0"
                                        title=""
                                        apiAction={classGroupApi.create}
                                        defaultValues={{
                                            classGroupName: '',
                                            hall: '',
                                            status: ClassGroupStatus.ACTIVE,
                                        }}
                                        schema={{
                                            classGroupName: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            hall: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            status: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                        }}
                                        fields={[
                                            {
                                                name: 'classGroupName',
                                                label: 'Name',
                                                type: NKFormType.TEXT,
                                            },
                                            {
                                                name: 'hall',
                                                label: 'Hall',
                                                type: NKFormType.TEXT,
                                            },
                                            {
                                                name: 'status',
                                                label: 'Status',
                                                type: NKFormType.SELECT_API_OPTION,
                                                fieldProps: {
                                                    apiAction: classGroupApi.getEnumStatus,
                                                },
                                            },
                                        ]}
                                        onExtraSuccessAction={() => {
                                            toast.success('Create Class Group successfully');
                                            queryClient.invalidateQueries({
                                                queryKey: ['class-group'],
                                            });
                                            close();
                                        }}
                                        onExtraErrorAction={toastError}
                                    />
                                );
                            }}
                        </ModalBuilder>
                    }
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/class-group/')({
    component: Page,
});
