import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { packageTypeApi } from '@/core/api/package-type.api';
import { ICreatePackageDto, IUpdatePackageDto, packageApi } from '@/core/api/package.api';
import CTAButton from '@/core/components/cta/CTABtn';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { toastError } from '@/core/utils/api.helper';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const queryClient = useQueryClient();

    useDocumentTitle('Packages');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="packages"
                    title="Packages"
                    columns={[
                        {
                            key: 'packageId',
                            title: 'ID',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'name',
                            title: 'Name',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'description',
                            title: 'Description',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'price',
                            title: 'Price',
                            type: FieldType.NUMBER,
                        },
                        {
                            key: 'totalStudents',
                            title: 'Total Students',
                            type: FieldType.NUMBER,
                        },
                        {
                            key: 'totalViolations',
                            title: 'Total Violations',
                            type: FieldType.NUMBER,
                        },

                        {
                            key: 'packageTypeId',
                            title: 'Type',
                            type: FieldType.BADGE_API,
                            apiAction(value) {
                                return packageTypeApi.getEnumSelectOptions(value);
                            },
                        },
                        {
                            key: 'status',
                            title: 'Status',
                            type: FieldType.BADGE_API,
                            apiAction(value) {
                                return packageApi.getEnumStatuses(value);
                            },
                        },
                    ]}
                    queryApi={packageApi.getAll}
                    actionColumns={(record) => (
                        <div className="flex flex-col gap-2">
                            <ModalBuilder
                                btnLabel=""
                                btnProps={{
                                    size: 'small',
                                    icon: <EditOutlined />,
                                }}
                                title="Edit Package"
                            >
                                {(close) => {
                                    return (
                                        <FormBuilder<IUpdatePackageDto>
                                            className="!p-0"
                                            apiAction={(dto) => {
                                                return packageApi.update(record.packageId, {
                                                    ...dto,
                                                });
                                            }}
                                            defaultValues={{
                                                description: record.description,
                                                name: record.name,
                                                price: record.price,
                                                packageTypeId: record.packageTypeId,
                                                totalStudents: record.totalStudents,
                                                totalViolations: record.totalViolations,
                                            }}
                                            fields={[
                                                {
                                                    name: 'name',
                                                    type: NKFormType.TEXT,
                                                    label: 'Name',
                                                },
                                                {
                                                    name: 'description',
                                                    type: NKFormType.TEXTAREA,
                                                    label: 'Description',
                                                },
                                                {
                                                    name: 'price',
                                                    type: NKFormType.NUMBER,
                                                    label: 'Price',
                                                },
                                                {
                                                    name: 'totalStudents',
                                                    type: NKFormType.NUMBER,
                                                    label: 'Total Students',
                                                },
                                                {
                                                    name: 'totalViolations',
                                                    type: NKFormType.NUMBER,
                                                    label: 'Total Violations',
                                                },
                                                {
                                                    name: 'packageTypeId',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    label: 'Type',
                                                    fieldProps: {
                                                        apiAction(value) {
                                                            return packageTypeApi.getEnumSelectOptions(value);
                                                        },
                                                    },
                                                },
                                            ]}
                                            title=""
                                            schema={{
                                                description: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                name: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                price: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                totalStudents: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                totalViolations: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                packageTypeId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            }}
                                            onExtraErrorAction={toastError}
                                            onExtraSuccessAction={() => {
                                                queryClient.invalidateQueries({
                                                    queryKey: ['packages'],
                                                });

                                                close();

                                                toast.success('Update package successfully');
                                            }}
                                        />
                                    );
                                }}
                            </ModalBuilder>
                            <CTAButton
                                ctaApi={() => packageApi.delete(record.packageId)}
                                isConfirm
                                confirmMessage="Are you sure you want to delete this package?"
                                extraOnError={toastError}
                                extraOnSuccess={() => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['packages'],
                                    });

                                    toast.success('Delete package successfully');
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
                            name: 'name',
                            type: NKFormType.TEXT,
                        },
                    ]}
                    extraButtons={
                        <ModalBuilder
                            btnLabel="Create Package"
                            btnProps={{
                                type: 'primary',
                                icon: <PlusOutlined />,
                            }}
                            title="Create Package"
                        >
                            {(close) => {
                                return (
                                    <FormBuilder<ICreatePackageDto>
                                        className="!p-0"
                                        apiAction={(dto) =>
                                            packageApi.create({
                                                ...dto,
                                            })
                                        }
                                        fields={[
                                            {
                                                name: 'name',
                                                type: NKFormType.TEXT,
                                                label: 'Name',
                                            },
                                            {
                                                name: 'description',
                                                type: NKFormType.TEXTAREA,
                                                label: 'Description',
                                            },
                                            {
                                                name: 'price',
                                                type: NKFormType.NUMBER,
                                                label: 'Price',
                                            },
                                            {
                                                name: 'totalStudents',
                                                type: NKFormType.NUMBER,
                                                label: 'Total Students',
                                            },
                                            {
                                                name: 'totalViolations',
                                                type: NKFormType.NUMBER,
                                                label: 'Total Violations',
                                            },
                                            {
                                                name: 'packageTypeId',
                                                type: NKFormType.SELECT_API_OPTION,
                                                label: 'Type',
                                                fieldProps: {
                                                    apiAction(value) {
                                                        return packageTypeApi.getEnumSelectOptions(value);
                                                    },
                                                },
                                            },
                                        ]}
                                        title=""
                                        schema={{
                                            description: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            name: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            price: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            totalStudents: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            totalViolations: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            packageTypeId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                        }}
                                        onExtraErrorAction={toastError}
                                        onExtraSuccessAction={() => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['packages'],
                                            });

                                            close();

                                            toast.success('Create package successfully');
                                        }}
                                        defaultValues={{
                                            description: '',
                                            name: '',
                                            price: 0,
                                            packageTypeId: 0,
                                            totalStudents: 0,
                                            totalViolations: 0,
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

export const Route = createFileRoute('/_admin-layout/dashboard/packages/')({
    component: Page,
});
