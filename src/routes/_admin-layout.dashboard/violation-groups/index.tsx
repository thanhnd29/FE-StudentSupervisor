import { EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { ICreateViolationGroupDto, IUpdateViolationGroupDto, violationGroupApi } from '@/core/api/violation-group.api';
import CTAButton from '@/core/components/cta/CTABtn';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { toastError } from '@/core/utils/api.helper';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();

    useDocumentTitle('Violation Groups');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="violation-groups"
                    title="Violation Groups"
                    columns={[
                        {
                            key: 'violationGroupId',
                            title: 'ID',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'description',
                            title: 'Description',
                            type: FieldType.MULTILINE_TEXT,
                            formatter(value) {
                                return value || 'N/A';
                            },
                        },
                        {
                            key: 'vioGroupName',
                            title: 'Name',
                            type: FieldType.TEXT,
                        },
                    ]}
                    queryApi={violationGroupApi.getAll}
                    actionColumns={(record) => (
                        <div className="flex flex-col gap-2">
                            <ModalBuilder
                                btnLabel=""
                                btnProps={{
                                    type: 'primary',
                                    size: 'small',
                                    icon: <EyeOutlined />,
                                }}
                                title="Detail Violation Group"
                            >
                                <FieldBuilder
                                    title=""
                                    record={record}
                                    isPadding={false}
                                    fields={[
                                        {
                                            key: 'violationGroupId',
                                            title: 'ID',
                                            type: FieldType.TEXT,
                                        },
                                        {
                                            key: 'code',
                                            title: 'Code',
                                            type: FieldType.TEXT,
                                        },
                                        {
                                            key: 'vioGroupName',
                                            title: 'Name',
                                            type: FieldType.TEXT,
                                        },
                                        {
                                            key: 'description',
                                            title: 'Description',
                                            type: FieldType.MULTILINE_TEXT,
                                        },
                                    ]}
                                />
                            </ModalBuilder>
                            <ModalBuilder
                                btnLabel=""
                                btnProps={{
                                    size: 'small',
                                    icon: <EditOutlined />,
                                }}
                                title="Edit Violation Group"
                            >
                                {(close) => {
                                    return (
                                        <FormBuilder<IUpdateViolationGroupDto>
                                            className="!p-0"
                                            apiAction={(dto) => violationGroupApi.update(record.violationGroupId, dto)}
                                            defaultValues={{
                                                code: record.code,
                                                vioGroupName: record.vioGroupName,
                                                description: record.description,
                                            }}
                                            fields={[
                                                {
                                                    name: 'code',
                                                    label: 'Code',
                                                    type: NKFormType.TEXT,
                                                },
                                                {
                                                    name: 'vioGroupName',
                                                    label: 'Name',
                                                    type: NKFormType.TEXT,
                                                },
                                                {
                                                    name: 'description',
                                                    label: 'Description',
                                                    type: NKFormType.TEXTAREA,
                                                },
                                            ]}
                                            title=""
                                            schema={{
                                                code: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                vioGroupName: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                description: Joi.string().allow('').optional().messages(NKConstant.MESSAGE_FORMAT),
                                            }}
                                            onExtraErrorAction={toastError}
                                            onExtraSuccessAction={() => {
                                                queryClient.invalidateQueries({
                                                    queryKey: ['violation-groups'],
                                                });
                                                close();
                                                toast.success('Edit violation group successfully');
                                            }}
                                        />
                                    );
                                }}
                            </ModalBuilder>
                            <CTAButton
                                ctaApi={() => violationGroupApi.delete(record.violationGroupId)}
                                isConfirm
                                confirmMessage="Are you sure you want to delete this violation group?"
                                extraOnError={toastError}
                                extraOnSuccess={() => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['violation-groups'],
                                    });

                                    toast.success('Delete violation group successfully');
                                }}
                            >
                                <Button className="flex h-6 w-6 items-center justify-center p-0" danger type="primary" size="small">
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </CTAButton>
                        </div>
                    )}
                    filters={[
                        {
                            label: 'Name',
                            comparator: FilterComparator.LIKE,
                            name: 'vioGroupName',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Code',
                            comparator: FilterComparator.LIKE,
                            name: 'code',
                            type: NKFormType.TEXT,
                        },
                    ]}
                    extraButtons={
                        <ModalBuilder
                            btnLabel="Create Violation Group"
                            btnProps={{
                                type: 'primary',
                                icon: <PlusOutlined />,
                            }}
                            title="Create Violation Group"
                        >
                            {(close) => {
                                return (
                                    <FormBuilder<ICreateViolationGroupDto>
                                        className="!p-0"
                                        apiAction={violationGroupApi.create}
                                        fields={[
                                            {
                                                name: 'code',
                                                label: 'Code',
                                                type: NKFormType.TEXT,
                                            },
                                            {
                                                name: 'vioGroupName',
                                                label: 'Name',
                                                type: NKFormType.TEXT,
                                            },
                                            {
                                                name: 'description',
                                                label: 'Description',
                                                type: NKFormType.TEXTAREA,
                                            },
                                        ]}
                                        title=""
                                        schema={{
                                            code: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            vioGroupName: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            description: Joi.string().allow('').optional().messages(NKConstant.MESSAGE_FORMAT),
                                        }}
                                        onExtraErrorAction={toastError}
                                        onExtraSuccessAction={() => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['violation-groups'],
                                            });
                                            close();
                                            toast.success('Create violation group successfully');
                                        }}
                                        defaultValues={{
                                            code: '',
                                            vioGroupName: '',
                                            description: '',
                                        }}
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

export const Route = createFileRoute('/_admin-layout/dashboard/violation-groups/')({
    component: Page,
});
