import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import moment from 'moment';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { classApi } from '@/core/api/class.api';
import { patrolScheduleApi } from '@/core/api/patrol-schedule.api';
import { studentSupervisorApi } from '@/core/api/student-supervisor.api';
import { teacherApi } from '@/core/api/tearcher.api';
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

interface PageProps { }

const Page: React.FunctionComponent<PageProps> = () => {
    const queryClient = useQueryClient();
    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    useDocumentTitle('Patrol Schedules');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="patrol-schedules"
                    title="Patrol Schedules"
                    columns={[
                        {
                            key: 'scheduleId',
                            title: 'ID',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'supervisorName',
                            title: 'Supervisor',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'teacherName',
                            title: 'Teacher',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'status',
                            title: 'Status',
                            type: FieldType.BADGE_API,
                            apiAction: patrolScheduleApi.getEnumStatuses,
                        },
                        {
                            key: 'from',
                            title: 'From',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'to',
                            title: 'To',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'classId',
                            title: 'Class',
                            type: FieldType.BADGE_API,
                            apiAction(value) {
                                return classApi.getEnumSelectOptions(value);
                            },
                        },
                    ]}
                    queryApi={schoolId ? () => patrolScheduleApi.getBySchool(schoolId) : patrolScheduleApi.getAll}
                    actionColumns={(record) => (
                        <div className="flex flex-col gap-2">
                            <ModalBuilder
                                btnLabel=""
                                btnProps={{
                                    size: 'small',
                                    icon: <EditOutlined />,
                                }}
                                title="Edit Patrol Schedule"
                            >
                                {(close) => {
                                    return (
                                        <FormBuilder
                                            className="!p-0"
                                            apiAction={(dto) => {
                                                return patrolScheduleApi.update({
                                                    ...dto,
                                                    scheduleId: record.scheduleId,
                                                    from: dto.from.toISOString(),
                                                    to: dto.to.toISOString(),
                                                });
                                            }}
                                            defaultValues={{
                                                classId: record.classId,
                                                from: new Date(record.from),
                                                scheduleId: record.scheduleId,
                                                supervisorId: record.supervisorId,
                                                teacherId: record.teacherId,
                                                to: new Date(record.to),
                                            }}
                                            fields={[
                                                {
                                                    name: 'from',
                                                    type: NKFormType.DATE,
                                                    label: 'From',
                                                },
                                                {
                                                    name: 'to',
                                                    type: NKFormType.DATE,
                                                    label: 'To',
                                                },
                                                {
                                                    name: 'classId',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    label: 'Class',
                                                    fieldProps: {
                                                        apiAction: (value) => classApi.getEnumSelectOptions({ search: value }),
                                                    },
                                                },
                                                {
                                                    name: 'supervisorId',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    label: 'Supervisor',
                                                    fieldProps: {
                                                        apiAction: (value) => studentSupervisorApi.getEnumSelectOptions(value),
                                                    },
                                                },
                                                {
                                                    name: 'teacherId',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    label: 'Teacher',
                                                    fieldProps: {
                                                        apiAction: (value) => teacherApi.getEnumSelectOptions(value),
                                                    },
                                                },
                                            ]}
                                            title=""
                                            schema={{
                                                classId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                from: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                                scheduleId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                supervisorId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                teacherId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                to: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                            }}
                                            onExtraErrorAction={toastError}
                                            onExtraSuccessAction={() => {
                                                queryClient.invalidateQueries({
                                                    queryKey: ['patrol-schedules'],
                                                });

                                                close();

                                                toast.success('Update patrol schedule successfully');
                                            }}
                                            beforeSubmit={(dto) => {
                                                if (moment(dto.from).isAfter(dto.to)) {
                                                    toast.error('From date must be before to date');
                                                    return false;
                                                }

                                                return true;
                                            }}
                                        />
                                    );
                                }}
                            </ModalBuilder>
                            <CTAButton
                                ctaApi={() => patrolScheduleApi.delete(record.scheduleId)}
                                isConfirm
                                confirmMessage="Are you sure you want to delete this patrol schedule?"
                                extraOnError={toastError}
                                extraOnSuccess={() => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['patrol-schedules'],
                                    });

                                    toast.success('Delete patrol schedule successfully');
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
                            btnLabel="Create"
                            btnProps={{
                                type: 'primary',
                                icon: <PlusOutlined />,
                            }}
                            title="Create Patrol Schedule"
                        >
                            {(close) => {
                                return (
                                    <FormBuilder
                                        className="!p-0"
                                        apiAction={(dto) =>
                                            patrolScheduleApi.create({
                                                ...dto,
                                                from: dto.from.toISOString(),
                                                to: dto.to.toISOString(),
                                            })
                                        }
                                        fields={[
                                            {
                                                name: 'from',
                                                type: NKFormType.DATE,
                                                label: 'From',
                                            },
                                            {
                                                name: 'to',
                                                type: NKFormType.DATE,
                                                label: 'To',
                                            },
                                            {
                                                name: 'classId',
                                                type: NKFormType.SELECT_API_OPTION,
                                                label: 'Class',
                                                fieldProps: {
                                                    apiAction: (value) => classApi.getEnumSelectOptions({ search: value }),
                                                },
                                            },
                                            {
                                                name: 'supervisorId',
                                                type: NKFormType.SELECT_API_OPTION,
                                                label: 'Supervisor',
                                                fieldProps: {
                                                    apiAction: (value) => studentSupervisorApi.getEnumSelectOptions(value),
                                                },
                                            },
                                            {
                                                name: 'teacherId',
                                                type: NKFormType.SELECT_API_OPTION,
                                                label: 'Teacher',
                                                fieldProps: {
                                                    apiAction: (value) => teacherApi.getEnumSelectOptions(value),
                                                },
                                            },
                                        ]}
                                        title=""
                                        schema={{
                                            classId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            from: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                            supervisorId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            teacherId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            to: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                        }}
                                        onExtraErrorAction={toastError}
                                        onExtraSuccessAction={() => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['patrol-schedules'],
                                            });

                                            close();

                                            toast.success('Create patrol schedule successfully');
                                        }}
                                        defaultValues={{
                                            from: new Date(),
                                            to: new Date(),
                                            classId: 0,
                                            supervisorId: 0,
                                            teacherId: 0,
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

export const Route = createFileRoute('/_admin-layout/dashboard/patrol-schedules/')({
    component: Page,
});
