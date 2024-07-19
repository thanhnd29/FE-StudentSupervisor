import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { evaluationApi } from '@/core/api/evaluation.api';
import { violationTypeApi } from '@/core/api/violation-type.api';
import { ICreateViolationConfigDto, IUpdateViolationConfigDto, violationConfigApi } from '@/core/api/violation-violation.api';
import CTAButton from '@/core/components/cta/CTABtn';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { toastError } from '@/core/utils/api.helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const queryClient = useQueryClient();

    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    useDocumentTitle('Violation Configs');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="violation-configs"
                    title="Violation Configs"
                    columns={[
                        {
                            key: 'violationConfigId',
                            title: 'ID',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'violationConfigName',
                            title: 'Name',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'violationTypeName',
                            title: 'Type',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'description',
                            title: 'Description',
                            type: FieldType.MULTILINE_TEXT,
                        },
                        {
                            key: 'status',
                            title: 'Status',
                            type: FieldType.BADGE_API,
                            apiAction: violationConfigApi.getEnumStatuses,
                        },
                        {
                            key: 'evaluationId',
                            title: 'Evaluation',
                            type: FieldType.BADGE_API,
                            apiAction(value) {
                                return evaluationApi.getEnumSelectOptions(value);
                            },
                        },
                    ]}
                    queryApi={schoolId ? () => violationConfigApi.getBySchool(schoolId) : violationConfigApi.getAll}
                    actionColumns={(record) => (
                        <div className="flex flex-col gap-2">
                            <ModalBuilder
                                btnLabel=""
                                btnProps={{
                                    size: 'small',
                                    icon: <EditOutlined />,
                                }}
                                title="Edit Violation Config"
                            >
                                {(close) => {
                                    return (
                                        <FormBuilder<IUpdateViolationConfigDto>
                                            className="!p-0"
                                            apiAction={(dto) => violationConfigApi.update(record.violationTypeId, dto)}
                                            defaultValues={{
                                                code: record.code,
                                                description: record.description,
                                                evaluationId: record.evaluationId,
                                                violationConfigName: record.violationConfigName,
                                                violationTypeId: record.violationTypeId,
                                            }}
                                            fields={[
                                                {
                                                    name: 'violationConfigName',
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
                                                    name: 'evaluationId',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    label: 'Evaluation',
                                                    fieldProps: {
                                                        apiAction: (value) => evaluationApi.getEnumSelectOptions(value),
                                                    },
                                                },
                                                {
                                                    name: 'violationTypeId',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    label: 'Type',
                                                    fieldProps: {
                                                        apiAction: (value) => violationTypeApi.getEnumSelectOptions(value),
                                                    },
                                                },
                                            ]}
                                            title=""
                                            schema={{
                                                code: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                description: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                evaluationId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                violationConfigName: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                violationTypeId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            }}
                                            onExtraErrorAction={toastError}
                                            onExtraSuccessAction={() => {
                                                queryClient.invalidateQueries({
                                                    queryKey: ['violation-configs'],
                                                });
                                                close();
                                                toast.success('Update violation config successfully');
                                            }}
                                        />
                                    );
                                }}
                            </ModalBuilder>
                            <CTAButton
                                ctaApi={() => violationConfigApi.delete(record.violationConfigId)}
                                isConfirm
                                confirmMessage="Are you sure you want to delete this violation config?"
                                extraOnError={toastError}
                                extraOnSuccess={() => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['violation-configs'],
                                    });

                                    toast.success('Delete violation config successfully');
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
                            btnLabel="Create Violation Config"
                            btnProps={{
                                type: 'primary',
                                icon: <PlusOutlined />,
                            }}
                            title="Create Violation Config"
                        >
                            {(close) => {
                                return (
                                    <FormBuilder<ICreateViolationConfigDto>
                                        className="!p-0"
                                        apiAction={violationConfigApi.create}
                                        fields={[
                                            {
                                                name: 'violationConfigName',
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
                                                name: 'evaluationId',
                                                type: NKFormType.NUMBER,
                                                label: 'Evaluation',
                                            },
                                            {
                                                name: 'violationTypeId',
                                                type: NKFormType.SELECT_API_OPTION,
                                                label: 'Type',
                                                fieldProps: {
                                                    apiAction: (value) => violationTypeApi.getEnumSelectOptions(value),
                                                },
                                            },
                                        ]}
                                        title=""
                                        schema={{
                                            code: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            description: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            evaluationId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            violationConfigName: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            violationTypeId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                        }}
                                        onExtraErrorAction={toastError}
                                        onExtraSuccessAction={() => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['violation-configs'],
                                            });
                                            close();

                                            toast.success('Create violation config successfully');
                                        }}
                                        defaultValues={{
                                            code: '',
                                            description: '',
                                            evaluationId: 0,
                                            violationConfigName: '',
                                            violationTypeId: 0,
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

export const Route = createFileRoute('/_admin-layout/dashboard/violation-configs/')({
    component: Page,
});
