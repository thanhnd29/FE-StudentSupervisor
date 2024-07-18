import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { highSchoolApi } from '@/core/api/high-school.api';
import { registerSchoolApi } from '@/core/api/register-school.api';
import CTAButton from '@/core/components/cta/CTABtn';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { toastError } from '@/core/utils/api.helper';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const queryClient = useQueryClient();

    useDocumentTitle('Registered Schools');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="registered-schools"
                    title="Registered Schools"
                    columns={[
                        {
                            key: 'registeredId',
                            title: 'ID',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'registeredDate',
                            title: 'Registered Date',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'description',
                            title: 'Description',
                            type: FieldType.TEXT,
                            formatter(value) {
                                return value || 'N/A';
                            },
                        },

                        {
                            key: 'schoolId',
                            title: 'Class',
                            type: FieldType.BADGE_API,
                            apiAction(value) {
                                return highSchoolApi.getEnumSelectOptions(value);
                            },
                        },
                        {
                            key: 'status',
                            title: 'Status',
                            type: FieldType.BADGE_API,
                            apiAction(value) {
                                return registerSchoolApi.getEnumStatus();
                            },
                        },
                    ]}
                    queryApi={registerSchoolApi.getAll}
                    actionColumns={(record) => (
                        <div className="flex flex-col gap-2">
                            <ModalBuilder
                                btnLabel=""
                                btnProps={{
                                    size: 'small',
                                    icon: <EditOutlined />,
                                }}
                                title="Edit Registered School"
                            >
                                {(close) => {
                                    return (
                                        <FormBuilder
                                            className="!p-0"
                                            apiAction={(dto) =>
                                                registerSchoolApi.update({
                                                    ...dto,
                                                    registeredId: record.registeredId,
                                                    registeredDate: dto.registeredDate.toISOString(),
                                                })
                                            }
                                            defaultValues={{
                                                description: record.description,
                                                registeredDate: new Date(record.registeredDate),
                                                registeredId: record.registeredId,
                                                schoolId: record.schoolId,
                                                status: record.status,
                                            }}
                                            fields={[
                                                {
                                                    name: 'registeredDate',
                                                    type: NKFormType.DATE,
                                                    label: 'Registered Date',
                                                },
                                                {
                                                    name: 'description',
                                                    type: NKFormType.TEXTAREA,
                                                    label: 'Description',
                                                },
                                                {
                                                    name: 'schoolId',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    label: 'School',
                                                    fieldProps: {
                                                        apiAction: (value) => highSchoolApi.getEnumSelectOptions(value),
                                                    },
                                                },
                                                {
                                                    name: 'status',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    label: 'Status',
                                                    fieldProps: {
                                                        apiAction: registerSchoolApi.getEnumStatus,
                                                    },
                                                },
                                            ]}
                                            title=""
                                            schema={{
                                                description: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                registeredDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                                schoolId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                status: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                registeredId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            }}
                                            onExtraErrorAction={toastError}
                                            onExtraSuccessAction={() => {
                                                queryClient.invalidateQueries({
                                                    queryKey: ['registered-schools'],
                                                });

                                                close();

                                                toast.success('Update registered school successfully');
                                            }}
                                        />
                                    );
                                }}
                            </ModalBuilder>
                            <CTAButton
                                ctaApi={() => registerSchoolApi.delete(record.registeredId)}
                                isConfirm
                                confirmMessage="Are you sure you want to delete this registered school?"
                                extraOnError={toastError}
                                extraOnSuccess={() => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['registered-schools'],
                                    });

                                    toast.success('Delete registered school successfully');
                                }}
                            >
                                <Button className="flex h-6 w-6 items-center justify-center p-0" danger type="primary" size="small">
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </CTAButton>
                        </div>
                    )}
                    extraButtons={
                        <ModalBuilder
                            btnLabel="Create Registered School"
                            btnProps={{
                                type: 'primary',
                                icon: <PlusOutlined />,
                            }}
                            title="Create Registered School"
                        >
                            {(close) => {
                                return (
                                    <FormBuilder
                                        className="!p-0"
                                        apiAction={(dto) => {
                                            return registerSchoolApi.create({
                                                ...dto,
                                                registeredDate: dto.registeredDate.toISOString(),
                                            });
                                        }}
                                        fields={[
                                            {
                                                name: 'registeredDate',
                                                type: NKFormType.DATE,
                                                label: 'Registered Date',
                                            },
                                            {
                                                name: 'description',
                                                type: NKFormType.TEXTAREA,
                                                label: 'Description',
                                            },
                                            {
                                                name: 'schoolId',
                                                type: NKFormType.SELECT_API_OPTION,
                                                label: 'School',
                                                fieldProps: {
                                                    apiAction: (value) => highSchoolApi.getEnumSelectOptions(value),
                                                },
                                            },
                                        ]}
                                        title=""
                                        schema={{
                                            description: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            registeredDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                            schoolId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                        }}
                                        onExtraErrorAction={toastError}
                                        onExtraSuccessAction={() => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['registered-schools'],
                                            });

                                            close();

                                            toast.success('Create registered school successfully');
                                        }}
                                        defaultValues={{
                                            description: '',
                                            registeredDate: new Date(),
                                            schoolId: 0,
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

export const Route = createFileRoute('/_admin-layout/dashboard/registered-schools/')({
    component: Page,
});
