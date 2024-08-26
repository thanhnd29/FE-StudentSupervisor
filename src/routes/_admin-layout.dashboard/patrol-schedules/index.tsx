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
    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId, userId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    const getByRole = () => {
        if (schoolId) {
            if (isSupervisor) {
                return patrolScheduleApi.getByUser(userId);
            }
            return patrolScheduleApi.getBySchool(schoolId)
        }
        return patrolScheduleApi.getAll()
    };

    useDocumentTitle('Danh sách lịch trực');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="patrol-schedules"
                    title="Danh sách lịch trực"
                    columns={[
                        {
                            key: 'scheduleId',
                            title: 'ID',
                            type: FieldType.TEXT,
                            width: '50px'
                        },
                        {
                            key: 'supervisorName',
                            title: 'Sao đỏ',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'classId',
                            title: 'Lớp',
                            type: FieldType.BADGE_API,
                            apiAction(value) {
                                return classApi.getEnumSelectOptions({ search: value });
                            },
                        },
                        {
                            key: 'slot',
                            title: 'Tiết',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'time',
                            title: 'Thời gian',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'from',
                            title: 'Từ ngày',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'to',
                            title: 'Đến ngày',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'status',
                            title: 'Trạng thái',
                            type: FieldType.BADGE_API,
                            apiAction: patrolScheduleApi.getEnumStatuses,
                        },
                    ]}
                    isSelectYear={true}
                    schoolId={schoolId}
                    queryApi={getByRole}
                    actionColumns={(record) => (
                        <div className="flex flex-col gap-2">
                            <ModalBuilder
                                btnLabel=""
                                btnProps={{
                                    size: 'small',
                                    icon: <EditOutlined />,
                                }}
                                title="Cập nhật"
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
                                                    time: {
                                                        ticks: dto.time
                                                    }
                                                });
                                            }}
                                            defaultValues={{
                                                scheduleId: record.scheduleId,
                                                classId: record.classId,
                                                userId: record.userId,
                                                name: record.name,
                                                slot: record.slot,
                                                time: record.time,
                                                status: record.status,
                                                from: new Date(record.from),
                                                supervisorId: record.supervisorId,
                                                to: new Date(record.to),
                                            }}
                                            fields={[
                                                {
                                                    name: 'from',
                                                    type: NKFormType.DATE,
                                                    label: 'Từ ngày',
                                                },
                                                {
                                                    name: 'to',
                                                    type: NKFormType.DATE,
                                                    label: 'Đến ngày',
                                                },
                                                {
                                                    name: 'classId',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    label: 'Lớp',
                                                    fieldProps: {
                                                        apiAction: (value) => classApi.getEnumSelectOptions({ search: value, highSchoolId: schoolId }),
                                                    },
                                                },
                                                {
                                                    name: 'supervisorId',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    label: 'Sao đỏ',
                                                    fieldProps: {
                                                        apiAction: (value) => studentSupervisorApi.getEnumSelectOptions(value, schoolId),
                                                    },
                                                },
                                                {
                                                    name: 'name',
                                                    type: NKFormType.TEXT,
                                                    label: 'Tên lịch trực',
                                                },
                                                {
                                                    name: 'slot',
                                                    type: NKFormType.TEXT,
                                                    label: 'Tiết',
                                                },
                                                {
                                                    name: 'time',
                                                    type: NKFormType.TEXT,
                                                    label: 'Thời gian *Ví dụ: 7:00',
                                                },
                                                // {
                                                //     name: 'status',
                                                //     type: NKFormType.SELECT_API_OPTION,
                                                //     label: 'Trạng thái',
                                                //     fieldProps: {
                                                //         apiAction: (value) => patrolScheduleApi.getEnumStatuses(value),
                                                //     },
                                                // },
                                            ]}
                                            title=""
                                            schema={{
                                                classId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                from: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                                scheduleId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                supervisorId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                to: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                                userId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                slot: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                time: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                name: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                status: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            }}
                                            onExtraErrorAction={toastError}
                                            onExtraSuccessAction={(data) => {
                                                queryClient.invalidateQueries({
                                                    queryKey: ['patrol-schedules'],
                                                });

                                                close();

                                                toast.success(data.message || 'Successful');
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
                                confirmMessage="Bạn có chắc chắn muốn xóa lịch trực này không?"
                                extraOnError={toastError}
                                extraOnSuccess={(data) => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['patrol-schedules'],
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
                            btnLabel="Tạo"
                            btnProps={{
                                type: 'primary',
                                icon: <PlusOutlined />,
                            }}
                            title="Tạo lịch trực"
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
                                                time: {
                                                    ticks: dto.time
                                                }
                                            })
                                        }
                                        fields={[
                                            {
                                                name: 'from',
                                                type: NKFormType.DATE,
                                                label: 'Từ ngày',
                                            },
                                            {
                                                name: 'to',
                                                type: NKFormType.DATE,
                                                label: 'Đến ngày',
                                            },
                                            {
                                                name: 'classId',
                                                type: NKFormType.SELECT_API_OPTION,
                                                label: 'Lớp',
                                                fieldProps: {
                                                    apiAction: (value) => classApi.getEnumSelectOptions({ search: value, highSchoolId: schoolId, year: Number(new Date().getFullYear()) }),
                                                },
                                            },
                                            {
                                                name: 'supervisorId',
                                                type: NKFormType.SELECT_API_OPTION,
                                                label: 'Sao đỏ',
                                                fieldProps: {
                                                    apiAction: (value) => studentSupervisorApi.getEnumSelectOptions(value, schoolId),
                                                },
                                            },
                                            {
                                                name: 'name',
                                                type: NKFormType.TEXT,
                                                label: 'Tên lịch trực',
                                            },
                                            {
                                                name: 'slot',
                                                type: NKFormType.TEXT,
                                                label: 'Tiết',
                                            },
                                            {
                                                name: 'time',
                                                type: NKFormType.TEXT,
                                                label: 'Thời gian *Ví dụ: 7:00',
                                            },
                                        ]}
                                        title=""
                                        schema={{
                                            classId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            userId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            slot: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            time: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            name: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            from: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                            supervisorId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            to: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                        }}
                                        onExtraErrorAction={toastError}
                                        onExtraSuccessAction={(data) => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['patrol-schedules'],
                                            });

                                            close();

                                            toast.success(data.message || 'Successful');
                                        }}
                                        defaultValues={{
                                            from: new Date(),
                                            to: new Date(),
                                            classId: 0,
                                            supervisorId: 0,
                                            userId: userId,
                                            name: "",
                                            slot: 0,
                                            time: ""
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
