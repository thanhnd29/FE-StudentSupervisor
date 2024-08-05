import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { classApi } from '@/core/api/class.api';
import { ICreateEvaluationDetailDto, IUpdateEvaluationDetailDto, evaluationDetailApi } from '@/core/api/evaluation-detail.api';
import { evaluationApi } from '@/core/api/evaluation.api';
import CTAButton from '@/core/components/cta/CTABtn';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { toastError } from '@/core/utils/api.helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

const Page = () => {
    const queryClient = useQueryClient();
    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    useDocumentTitle('Evaluation Details');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="evaluation-details"
                    title="Evaluation Details"
                    columns={[
                        {
                            key: 'evaluationDetailId',
                            title: 'ID',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'classId',
                            title: 'Class',
                            type: FieldType.BADGE_API,
                            apiAction(value) {
                                return classApi.getEnumSelectOptions({ search: value });
                            },
                        },
                        {
                            key: 'evaluationId',
                            title: 'Evaluation',
                            type: FieldType.BADGE_API,
                            apiAction(value) {
                                return evaluationApi.getEnumSelectOptions(value);
                            },
                        },
                        {
                            key: 'status',
                            title: 'Status',
                            type: FieldType.BADGE_API,
                            apiAction(value) {
                                return evaluationDetailApi.getEnumStatuses(value);
                            },
                        },
                    ]}
                    queryApi={schoolId ? () => evaluationDetailApi.getBySchool(schoolId) : evaluationDetailApi.getAll}
                    actionColumns={(record) => (
                        <div className="flex flex-col gap-2">
                            <ModalBuilder
                                btnLabel=""
                                btnProps={{
                                    size: 'small',
                                    icon: <EditOutlined />,
                                }}
                                title="Edit Evaluation Detail"
                            >
                                {(close) => {
                                    return (
                                        <FormBuilder<IUpdateEvaluationDetailDto>
                                            className="!p-0"
                                            defaultValues={{
                                                classId: record.classId,
                                                evaluationId: record.evaluationId,
                                                evaluationDetailId: record.evaluationDetailId,
                                                status: record.status,
                                            }}
                                            fields={[
                                                {
                                                    label: 'Class',
                                                    name: 'classId',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    fieldProps: {
                                                        apiAction: (value) => classApi.getEnumSelectOptions({ search: value }),
                                                    },
                                                },
                                                {
                                                    label: 'Evaluation',
                                                    name: 'evaluationId',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    fieldProps: {
                                                        apiAction: (value) => evaluationApi.getEnumSelectOptions(value),
                                                    },
                                                },
                                                {
                                                    label: 'Status',
                                                    name: 'status',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    fieldProps: {
                                                        apiAction: (value) => evaluationDetailApi.getEnumStatuses(value),
                                                    },
                                                },
                                            ]}
                                            title=""
                                            schema={{
                                                classId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                evaluationId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                evaluationDetailId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                status: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            }}
                                            onExtraErrorAction={toastError}
                                            onExtraSuccessAction={() => {
                                                queryClient.invalidateQueries({
                                                    queryKey: ['evaluation-details'],
                                                });
                                                close();
                                                toast.success('Update evaluation detail successfully');
                                            }}
                                            apiAction={evaluationDetailApi.update}
                                        />
                                    );
                                }}
                            </ModalBuilder>
                            <CTAButton
                                ctaApi={() => evaluationDetailApi.delete(record.evaluationDetailId)}
                                isConfirm
                                confirmMessage="Are you sure you want to delete this evaluation detail?"
                                extraOnError={toastError}
                                extraOnSuccess={() => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['evaluation-details'],
                                    });

                                    toast.success('Delete evaluation detail successfully');
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
                            btnLabel="Create Evaluation Detail"
                            btnProps={{
                                type: 'primary',
                                icon: <PlusOutlined />,
                            }}
                            title="Create Evaluation Detail"
                        >
                            {(close) => {
                                return (
                                    <FormBuilder<ICreateEvaluationDetailDto>
                                        className="!p-0"
                                        apiAction={(dto) => {
                                            return evaluationDetailApi.create(dto);
                                        }}
                                        fields={[
                                            {
                                                label: 'Class',
                                                name: 'classId',
                                                type: NKFormType.SELECT_API_OPTION,
                                                fieldProps: {
                                                    apiAction: (value) => classApi.getEnumSelectOptions({ search: value }),
                                                },
                                            },
                                            {
                                                label: 'Evaluation',
                                                name: 'evaluationId',
                                                type: NKFormType.SELECT_API_OPTION,
                                                fieldProps: {
                                                    apiAction: (value) => evaluationApi.getEnumSelectOptions(value),
                                                },
                                            },
                                        ]}
                                        title=""
                                        schema={{
                                            classId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            evaluationId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                        }}
                                        onExtraErrorAction={toastError}
                                        onExtraSuccessAction={() => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['evaluation-details'],
                                            });
                                            close();
                                            toast.success('Create evaluation detail successfully');
                                        }}
                                        defaultValues={{
                                            classId: 0,
                                            evaluationId: 0,
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

export const Route = createFileRoute('/_admin-layout/dashboard/evaluation-details/')({
    component: Page,
});
