import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { highSchoolApi } from '@/core/api/high-school.api';
import { penaltyApi } from '@/core/api/penalty.api';
import CTAButton from '@/core/components/cta/CTABtn';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { toastError } from '@/core/utils/api.helper';
import { RootState } from '@/core/store';
import { useSelector } from 'react-redux';
import { UserState } from '@/core/store/user';

interface PageProps { }

const Page: React.FunctionComponent<PageProps> = () => {
    const queryClient = useQueryClient();
    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    useDocumentTitle('Penalties');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="penalties"
                    title="Penalties"
                    columns={[
                        {
                            key: 'penaltyId',
                            title: 'ID',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'name',
                            title: 'Name',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'code',
                            title: 'Code',
                            type: FieldType.TEXT,
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
                            key: 'status',
                            title: 'Status',
                            type: FieldType.BADGE_API,
                            apiAction(value) {
                                return penaltyApi.getEnumStatuses(value);
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
                    ]}
                    queryApi={schoolId ? () => penaltyApi.getBySchool(schoolId) : penaltyApi.getAll}
                    actionColumns={(record) => (
                        <div className="flex flex-col gap-2">
                            <ModalBuilder
                                btnLabel=""
                                btnProps={{
                                    size: 'small',
                                    icon: <EditOutlined />,
                                }}
                                title="Edit Penalty"
                            >
                                {(close) => {
                                    return (
                                        <FormBuilder
                                            className="!p-0"
                                            apiAction={penaltyApi.update}
                                            defaultValues={{
                                                code: record.code,
                                                description: record.description,
                                                name: record.name,
                                                penaltyId: record.penaltyId,
                                                schoolId: record.schoolId,
                                            }}
                                            fields={[
                                                {
                                                    name: 'name',
                                                    type: NKFormType.TEXT,
                                                    label: 'Name',
                                                },
                                                {
                                                    name: 'code',
                                                    type: NKFormType.TEXT,
                                                    label: 'Code',
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
                                                        readonly: true,
                                                    },
                                                },
                                            ]}
                                            title=""
                                            schema={{
                                                description: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                name: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                penaltyId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                schoolId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                code: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            }}
                                            onExtraErrorAction={toastError}
                                            onExtraSuccessAction={(data) => {
                                                queryClient.invalidateQueries({
                                                    queryKey: ['penalties'],
                                                });

                                                close();

                                                toast.success(data.message || 'Successful');
                                            }}
                                        />
                                    );
                                }}
                            </ModalBuilder>
                            <CTAButton
                                ctaApi={() => penaltyApi.delete(record.penaltyId)}
                                isConfirm
                                confirmMessage="Are you sure you want to delete this penalty?"
                                extraOnError={toastError}
                                extraOnSuccess={(data) => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['penalties'],
                                    });

                                    toast.success(data.message || 'Successful');
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
                            btnLabel="Create Penalty"
                            btnProps={{
                                type: 'primary',
                                icon: <PlusOutlined />,
                            }}
                            title="Create Penalty"
                        >
                            {(close) => {
                                return (
                                    <FormBuilder
                                        className="!p-0"
                                        apiAction={penaltyApi.create}
                                        fields={[
                                            {
                                                name: 'name',
                                                type: NKFormType.TEXT,
                                                label: 'Name',
                                            },
                                            {
                                                name: 'code',
                                                type: NKFormType.TEXT,
                                                label: 'Code',
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
                                                    readonly: true,
                                                },
                                            },
                                        ]}
                                        title=""
                                        schema={{
                                            description: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            name: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            schoolId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            code: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                        }}
                                        onExtraErrorAction={toastError}
                                        onExtraSuccessAction={(data) => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['penalties'],
                                            });

                                            close();

                                            toast.success(data.message || 'Successful');
                                        }}
                                        defaultValues={{
                                            code: '',
                                            description: '',
                                            name: '',
                                            schoolId: schoolId || 0,
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

export const Route = createFileRoute('/_admin-layout/dashboard/penalties/')({
    component: Page,
});
