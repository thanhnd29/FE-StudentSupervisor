import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { highSchoolApi } from '@/core/api/high-school.api';
import { packageApi } from '@/core/api/package.api';
import { ICreateYearPackageDto, IUpdateYearPackageDto, yearPackageApi } from '@/core/api/year-package.api';
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

    useDocumentTitle('Year Packages');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="year-packages"
                    title="Year Packages"
                    columns={[
                        {
                            key: 'schoolYearId',
                            title: 'School Year',
                            apiAction(value) {
                                return highSchoolApi.getEnumSelectOptions(value);
                            },
                            type: FieldType.BADGE_API,
                        },
                        {
                            key: 'packageId',
                            title: 'Package',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'numberOfStudent',
                            title: 'Number of Student',
                            type: FieldType.TEXT,
                        },
                    ]}
                    queryApi={yearPackageApi.getAll}
                    actionColumns={(record) => (
                        <div className="flex flex-col gap-2">
                            <ModalBuilder
                                btnLabel=""
                                btnProps={{
                                    size: 'small',
                                    icon: <EditOutlined />,
                                }}
                                title="Edit Year Package"
                            >
                                {(close) => {
                                    return (
                                        <FormBuilder<IUpdateYearPackageDto>
                                            className="!p-0"
                                            apiAction={(dto) => yearPackageApi.update(record.yearPackageId, dto)}
                                            defaultValues={{
                                                numberOfStudent: record.numberOfStudent,
                                                packageId: record.packageId,
                                                schoolYearId: record.schoolYearId,
                                            }}
                                            fields={[
                                                {
                                                    name: 'schoolYearId',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    label: 'School Year',
                                                    fieldProps: {
                                                        apiAction: (value) => highSchoolApi.getEnumSelectOptions(value),
                                                    },
                                                },
                                                {
                                                    name: 'packageId',
                                                    type: NKFormType.NUMBER,
                                                    label: 'Package',
                                                },
                                                {
                                                    name: 'numberOfStudent',
                                                    type: NKFormType.TEXT,
                                                    label: 'Number of Student',
                                                },
                                            ]}
                                            title=""
                                            schema={{
                                                numberOfStudent: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                packageId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                schoolYearId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            }}
                                            onExtraErrorAction={toastError}
                                            onExtraSuccessAction={() => {
                                                queryClient.invalidateQueries({
                                                    queryKey: ['year-packages'],
                                                });

                                                close();

                                                toast.success('Edit year package successfully');
                                            }}
                                        />
                                    );
                                }}
                            </ModalBuilder>
                            <CTAButton
                                ctaApi={() => yearPackageApi.delete(record.violationTypeId)}
                                isConfirm
                                confirmMessage="Are you sure you want to delete this year package?"
                                extraOnError={toastError}
                                extraOnSuccess={() => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['year-packages'],
                                    });

                                    toast.success('Delete year package successfully');
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
                            name: 'vioTypeName',
                            type: NKFormType.TEXT,
                        },
                    ]}
                    extraButtons={
                        <ModalBuilder
                            btnLabel="Create Year Package"
                            btnProps={{
                                type: 'primary',
                                icon: <PlusOutlined />,
                            }}
                            title="Create Year Package"
                        >
                            {(close) => {
                                return (
                                    <FormBuilder<ICreateYearPackageDto>
                                        className="!p-0"
                                        apiAction={yearPackageApi.create}
                                        fields={[
                                            {
                                                name: 'schoolYearId',
                                                type: NKFormType.SELECT_API_OPTION,
                                                label: 'School Year',
                                                fieldProps: {
                                                    apiAction: (value) => highSchoolApi.getEnumSelectOptions(value),
                                                },
                                            },
                                            {
                                                name: 'packageId',
                                                type: NKFormType.SELECT_API_OPTION,
                                                label: 'Package',
                                                fieldProps: {
                                                    apiAction: (value) => packageApi.getEnumSelectOptions(value),
                                                },
                                            },
                                            {
                                                name: 'numberOfStudent',
                                                type: NKFormType.TEXT,
                                                label: 'Number of Student',
                                            },
                                        ]}
                                        title=""
                                        schema={{
                                            numberOfStudent: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            packageId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            schoolYearId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                        }}
                                        onExtraErrorAction={toastError}
                                        onExtraSuccessAction={() => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['year-packages'],
                                            });

                                            close();

                                            toast.success('Create year package successfully');
                                        }}
                                        defaultValues={{
                                            numberOfStudent: 0,
                                            packageId: 0,
                                            schoolYearId: 0,
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

export const Route = createFileRoute('/_admin-layout/dashboard/year-packages/')({
    component: Page,
});
