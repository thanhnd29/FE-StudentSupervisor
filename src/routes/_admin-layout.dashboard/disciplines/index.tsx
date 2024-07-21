import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import moment from 'moment';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { disciplineApi } from '@/core/api/discipline.api';
import { penaltyApi } from '@/core/api/penalty.api';
import { registerSchoolApi } from '@/core/api/register-school.api';
import { violationsApi } from '@/core/api/violation.api';
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
import { FilterComparator } from '@/core/models/common';

interface PageProps { }

const Page: React.FunctionComponent<PageProps> = () => {
    const queryClient = useQueryClient();
    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    useDocumentTitle('Disciplines');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="disciplines"
                    title="Disciplines"
                    columns={[
                        {
                            key: 'disciplineId',
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
                            key: 'startDate',
                            title: 'Start Date',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'endDate',
                            title: 'End Date',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'status',
                            title: 'Status',
                            type: FieldType.BADGE_API,
                            apiAction: disciplineApi.getEnumStatuses
                        },
                        {
                            key: 'violationId',
                            title: 'Violation',
                            type: FieldType.BADGE_API,
                            apiAction(value) {
                                return violationsApi.getEnumSelectOptions(value);
                            },
                        },
                        {
                            key: 'pennaltyId',
                            title: 'Pennalty',
                            type: FieldType.BADGE_API,
                            apiAction(value) {
                                return penaltyApi.getEnumSelectOptions(value);
                            },
                        },
                    ]}
                    queryApi={schoolId ? () => disciplineApi.getBySchool(schoolId) : disciplineApi.getAll}
                    actionColumns={(record) => (
                        <div className="flex flex-col gap-2">
                            <ModalBuilder
                                btnLabel=""
                                btnProps={{
                                    size: 'small',
                                    icon: <EditOutlined />,
                                }}
                                title="Edit Discipline"
                            >
                                {(close) => {
                                    return (
                                        <FormBuilder
                                            className="!p-0"
                                            apiAction={disciplineApi.update}
                                            defaultValues={{
                                                ...record,
                                                startDate: new Date(record.startDate),
                                                endDate: new Date(record.endDate),
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
                                                    name: 'startDate',
                                                    type: NKFormType.DATE,
                                                    label: 'Start Date',
                                                },
                                                {
                                                    name: 'endDate',
                                                    type: NKFormType.DATE,
                                                    label: 'End Date',
                                                },
                                                {
                                                    name: 'description',
                                                    type: NKFormType.TEXTAREA,
                                                    label: 'Description',
                                                },
                                                {
                                                    name: 'status',
                                                    type: NKFormType.TEXT,
                                                    label: 'Status',
                                                },
                                                {
                                                    name: 'violationId',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    label: 'Violation',
                                                    fieldProps: {
                                                        apiAction: (value) => violationsApi.getEnumSelectOptions(value),
                                                    },
                                                },
                                                {
                                                    name: 'pennaltyId',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    label: 'Pennalty',
                                                    fieldProps: {
                                                        apiAction: (value) => penaltyApi.getEnumSelectOptions(value),
                                                    },
                                                },
                                            ]}
                                            title=""
                                            schema={{
                                                code: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                description: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                disciplineId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                endDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                                name: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                pennaltyId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                startDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                                status: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                violationId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            }}
                                            beforeSubmit={(dto) => {
                                                if (moment(dto.startDate).isAfter(dto.endDate)) {
                                                    toast.error('Start Date must be before End Date');
                                                    return false;
                                                }

                                                return true;
                                            }}
                                            onExtraErrorAction={toastError}
                                            onExtraSuccessAction={() => {
                                                queryClient.invalidateQueries({
                                                    queryKey: ['disciplines'],
                                                });

                                                close();

                                                toast.success('Update discipline successfully');
                                            }}
                                        />
                                    );
                                }}
                            </ModalBuilder>
                            <CTAButton
                                ctaApi={() => disciplineApi.delete(record.disciplineId)}
                                isConfirm
                                confirmMessage="Are you sure you want to delete this discipline?"
                                extraOnError={toastError}
                                extraOnSuccess={() => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['disciplines'],
                                    });

                                    toast.success('Delete discipline successfully');
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
                        {
                            label: 'Status',
                            comparator: FilterComparator.LIKE,
                            name: 'status',
                            type: NKFormType.SELECT_API_OPTION,
                            apiAction: disciplineApi.getEnumStatuses
                        },
                    ]}
                    extraButtons={
                        <ModalBuilder
                            btnLabel="Create Discipline"
                            btnProps={{
                                type: 'primary',
                                icon: <PlusOutlined />,
                            }}
                            title="Create Discipline"
                        >
                            {(close) => {
                                return (
                                    <FormBuilder
                                        className="!p-0"
                                        apiAction={(dto) =>
                                            disciplineApi.create({
                                                ...dto,
                                                startDate: dto.startDate.toISOString(),
                                                endDate: dto.endDate.toISOString(),
                                            })
                                        }
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
                                                name: 'startDate',
                                                type: NKFormType.DATE,
                                                label: 'Start Date',
                                            },
                                            {
                                                name: 'endDate',
                                                type: NKFormType.DATE,
                                                label: 'End Date',
                                            },
                                            {
                                                name: 'description',
                                                type: NKFormType.TEXTAREA,
                                                label: 'Description',
                                            },
                                            {
                                                name: 'violationId',
                                                type: NKFormType.SELECT_API_OPTION,
                                                label: 'Violation',
                                                fieldProps: {
                                                    apiAction: (value) => violationsApi.getEnumSelectOptions(value),
                                                },
                                            },
                                            {
                                                name: 'pennaltyId',
                                                type: NKFormType.SELECT_API_OPTION,
                                                label: 'Pennalty',
                                                fieldProps: {
                                                    apiAction: (value) => penaltyApi.getEnumSelectOptions(value),
                                                },
                                            },
                                        ]}
                                        title=""
                                        schema={{
                                            description: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            code: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            endDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                            name: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            pennaltyId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            startDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                            violationId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                        }}
                                        onExtraErrorAction={toastError}
                                        onExtraSuccessAction={() => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['disciplines'],
                                            });

                                            close();

                                            toast.success('Create discipline successfully');
                                        }}
                                        defaultValues={{
                                            code: '',
                                            description: '',
                                            endDate: moment(new Date()).add(1, 'days').toDate(),
                                            startDate: new Date(),
                                            name: '',
                                            violationId: 0,
                                            pennaltyId: 0,
                                        }}
                                        beforeSubmit={(dto) => {
                                            if (moment(dto.startDate).isAfter(dto.endDate)) {
                                                toast.error('Start Date must be before End Date');
                                                return false;
                                            }

                                            return true;
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

export const Route = createFileRoute('/_admin-layout/dashboard/disciplines/')({
    component: Page,
});
