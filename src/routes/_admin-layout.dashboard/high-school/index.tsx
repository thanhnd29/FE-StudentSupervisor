import { EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { NKRouter } from '@/core/NKRouter';
import { highSchoolApi } from '@/core/api/high-school.api';
import CTAButton from '@/core/components/cta/CTABtn';
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

    useDocumentTitle('High School List');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="high-school"
                    title="High School List"
                    columns={[
                        {
                            key: 'schoolId',
                            title: 'Id',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'name',
                            title: 'Name',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'imageUrl',
                            title: 'Image',
                            type: FieldType.THUMBNAIL,
                        },
                        {
                            key: 'code',
                            title: 'Code',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'phone',
                            title: 'Phone',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'status',
                            title: 'Status',
                            type: FieldType.BADGE_API,
                            apiAction() {
                                return highSchoolApi.getEnumStatus();
                            },
                        },
                    ]}
                    queryApi={highSchoolApi.getAll}
                    actionColumns={(record) => {
                        return (
                            <div className="flex flex-col gap-2">
                                <Button
                                    type="primary"
                                    size="small"
                                    className="flex items-center justify-center"
                                    onClick={() => {
                                        router.push(NKRouter.highSchool.detail(record.schoolId));
                                    }}
                                    icon={<EyeOutlined />}
                                ></Button>
                                <ModalBuilder
                                    btnLabel=""
                                    btnProps={{
                                        size: 'small',
                                        icon: <EditOutlined />,
                                    }}
                                    title="Edit High School"
                                >
                                    {(close) => {
                                        return (
                                            <FormBuilder
                                                className="!p-0"
                                                title=""
                                                apiAction={(dto) => highSchoolApi.update(record.schoolId, dto)}
                                                defaultValues={record}
                                                schema={{
                                                    address: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                    code: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                    imageUrl: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                    name: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                    phone: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                    webUrl: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                }}
                                                fields={[
                                                    {
                                                        name: 'address',
                                                        label: 'Address',
                                                        type: NKFormType.TEXT,
                                                    },
                                                    {
                                                        name: 'code',
                                                        label: 'Code',
                                                        type: NKFormType.TEXT,
                                                    },
                                                    {
                                                        name: 'imageUrl',
                                                        label: 'Image Url',
                                                        type: NKFormType.UPLOAD_IMAGE,
                                                    },
                                                    {
                                                        name: 'name',
                                                        label: 'Name',
                                                        type: NKFormType.TEXT,
                                                    },
                                                    {
                                                        name: 'phone',
                                                        label: 'Phone',
                                                        type: NKFormType.TEXT,
                                                    },
                                                    {
                                                        name: 'webUrl',
                                                        label: 'Web Url',
                                                        type: NKFormType.TEXT,
                                                    },
                                                ]}
                                                onExtraSuccessAction={() => {
                                                    toast.success('Update High School successfully');
                                                    queryClient.invalidateQueries({
                                                        queryKey: ['high-school'],
                                                    });

                                                    close();
                                                }}
                                                onExtraErrorAction={toastError}
                                            />
                                        );
                                    }}
                                </ModalBuilder>
                                <CTAButton
                                    ctaApi={() => highSchoolApi.delete(record.schoolId)}
                                    isConfirm
                                    confirmMessage='Are you sure you want to delete this "High School"?'
                                    extraOnError={toastError}
                                    extraOnSuccess={() => {
                                        queryClient.invalidateQueries({
                                            queryKey: ['high-school'],
                                        });
                                        toast.success('Delete High School successfully');
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
                            name: 'name',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Email',
                            comparator: FilterComparator.LIKE,
                            name: 'email',
                            type: NKFormType.TEXT,
                        },
                    ]}
                    extraButtons={
                        <ModalBuilder
                            btnLabel="Create High School"
                            btnProps={{
                                type: 'primary',
                                icon: <PlusOutlined />,
                            }}
                            title="Create High School"
                        >
                            {(close) => {
                                return (
                                    <FormBuilder
                                        className="!p-0"
                                        title=""
                                        apiAction={highSchoolApi.create}
                                        defaultValues={{
                                            address: '',
                                            code: '',
                                            imageUrl: '',
                                            name: '',
                                            phone: '',
                                            webUrl: '',
                                        }}
                                        schema={{
                                            address: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            code: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            imageUrl: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            name: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            phone: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            webUrl: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                        }}
                                        fields={[
                                            {
                                                name: 'address',
                                                label: 'Address',
                                                type: NKFormType.TEXT,
                                            },
                                            {
                                                name: 'code',
                                                label: 'Code',
                                                type: NKFormType.TEXT,
                                            },
                                            {
                                                name: 'imageUrl',
                                                label: 'Image Url',
                                                type: NKFormType.UPLOAD_IMAGE,
                                            },
                                            {
                                                name: 'name',
                                                label: 'Name',
                                                type: NKFormType.TEXT,
                                            },
                                            {
                                                name: 'phone',
                                                label: 'Phone',
                                                type: NKFormType.TEXT,
                                            },
                                            {
                                                name: 'webUrl',
                                                label: 'Web Url',
                                                type: NKFormType.TEXT,
                                            },
                                        ]}
                                        onExtraSuccessAction={() => {
                                            toast.success('Create High School successfully');
                                            queryClient.invalidateQueries({
                                                queryKey: ['high-school'],
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

export const Route = createFileRoute('/_admin-layout/dashboard/high-school/')({
    component: Page,
});
