import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { classApi } from '@/core/api/class.api';
import { studentInClassApi } from '@/core/api/student-in-class.api';
import { studentApi } from '@/core/api/student.api';
import CTAButton from '@/core/components/cta/CTABtn';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { FilterComparator } from '@/core/models/common';
import { toastError } from '@/core/utils/api.helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';
import moment from 'moment';
import { Data } from 'akar-icons';

const Page = () => {
    const queryClient = useQueryClient();
    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    return (
        <TableBuilder
            sourceKey={`students-in-class`}
            title=""
            columns={[
                {
                    key: 'studentId',
                    title: 'ID',
                    type: FieldType.TEXT,
                },
                {
                    key: 'studentName',
                    title: 'Name',
                    type: FieldType.TEXT,
                },
                {
                    key: 'enrollDate',
                    title: 'Enroll Date',
                    type: FieldType.TIME_DATE,
                },
                {
                    key: 'isSupervisor',
                    title: 'Is Supervisor',
                    type: FieldType.BOOLEAN,
                },
                {
                    key: 'numberOfViolation',
                    title: 'Number Of Violation',
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
                    key: 'status',
                    title: 'Status',
                    type: FieldType.BADGE_API,
                    apiAction(value) {
                        return studentInClassApi.getEnumStatuses(value);
                    },
                },
            ]}
            queryApi={schoolId ? () => studentInClassApi.getBySchool(schoolId) : studentInClassApi.getAll}
            actionColumns={(record) => (
                <div className="flex flex-col gap-2">
                    <ModalBuilder
                        btnLabel=""
                        btnProps={{
                            size: 'small',
                            icon: <EditOutlined />,
                        }}
                        title="Edit Student"
                    >
                        {(close) => {
                            return (
                                <FormBuilder
                                    className="!p-0"
                                    apiAction={(dto) =>
                                        studentInClassApi.update({
                                            ...dto,
                                            enrollDate: dto.enrollDate.toISOString(),
                                            birthday: dto.birthday.toISOString(),
                                            startDate: dto.startDate.toISOString(),
                                            endDate: dto.endDate.toISOString(),
                                        })
                                    }
                                    defaultValues={{
                                        studentName: record.studentName,
                                        code: record.code,
                                        sex: record.sex,
                                        birthday: new Date(record.birthday),
                                        address: record.address,
                                        phone: record.phone,
                                        classId: record.classId,
                                        enrollDate: new Date(record.enrollDate),
                                        isSupervisor: record.isSupervisor,
                                        startDate: new Date(record.startDate),
                                        endDate: new Date(record.endDate),
                                        studentId: record.studentId,
                                        studentInClassId: record.studentInClassId,
                                    }}
                                    fields={[
                                        {
                                            label: 'Student',
                                            name: 'studentName',
                                            type: NKFormType.TEXT,
                                        },
                                        {
                                            label: 'Code',
                                            name: 'code',
                                            type: NKFormType.TEXT,
                                        },
                                        {
                                            label: 'Sex (*male)',
                                            name: 'sex',
                                            type: NKFormType.BOOLEAN,
                                        },
                                        {
                                            label: 'Birthday',
                                            name: 'birthday',
                                            type: NKFormType.DATE,
                                        },
                                        {
                                            label: 'Address',
                                            name: 'address',
                                            type: NKFormType.TEXT,
                                        },
                                        {
                                            label: 'Phone',
                                            name: 'phone',
                                            type: NKFormType.TEXT,
                                        },
                                        {
                                            label: 'Class',
                                            name: 'classId',
                                            type: NKFormType.SELECT_API_OPTION,
                                            fieldProps: {
                                                apiAction(value) {
                                                    return classApi.getEnumSelectOptions({ search: value });
                                                }
                                            },
                                        },
                                        {
                                            label: 'Enroll Date',
                                            name: 'enrollDate',
                                            type: NKFormType.DATE,
                                        },
                                        {
                                            label: 'Is Supervisor',
                                            name: 'isSupervisor',
                                            type: NKFormType.BOOLEAN,
                                        },
                                        {
                                            label: 'Start Date',
                                            name: 'startDate',
                                            type: NKFormType.DATE,
                                        },
                                        {
                                            label: 'End Date',
                                            name: 'endDate',
                                            type: NKFormType.DATE,
                                        },
                                    ]}
                                    title=""
                                    schema={{
                                        classId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                        enrollDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                        isSupervisor: Joi.boolean().required().messages(NKConstant.MESSAGE_FORMAT),
                                        studentId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                        studentInClassId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                        studentName: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                        code: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                        sex: Joi.boolean().required().messages(NKConstant.MESSAGE_FORMAT),
                                        birthday: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                        address: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                        phone: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                        startDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                        endDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                    }}
                                    onExtraErrorAction={toastError}
                                    onExtraSuccessAction={(data) => {
                                        queryClient.invalidateQueries({
                                            queryKey: [`students-in-class`],
                                        });

                                        close();

                                        toast.success(data.message || 'Successful');
                                    }}
                                />
                            );
                        }}
                    </ModalBuilder>
                    <CTAButton
                        ctaApi={() => studentInClassApi.delete(record.studentInClassId)}
                        isConfirm
                        confirmMessage="Are you sure you want to delete this student?"
                        extraOnError={toastError}
                        extraOnSuccess={(data) => {
                            queryClient.invalidateQueries({
                                queryKey: [`students-in-class`],
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
            filters={[
                {
                    label: 'Name',
                    comparator: FilterComparator.LIKE,
                    name: 'studentName',
                    type: NKFormType.TEXT,
                },
            ]}
            extraButtons={
                <ModalBuilder
                    btnLabel="Create Student"
                    btnProps={{
                        type: 'primary',
                        icon: <PlusOutlined />,
                    }}
                    title="Create Student"
                >
                    {(close) => {
                        return (
                            <FormBuilder
                                className="!p-0"
                                beforeSubmit={(dto) => {
                                    if (moment(dto.startDate).isAfter(dto.endDate)) {
                                        toast.error('Start Date must be before end date');
                                        return false;
                                    }

                                    return true;
                                }}
                                apiAction={(dto) =>
                                    studentInClassApi.create({
                                        ...dto,
                                        enrollDate: dto.enrollDate.toISOString(),
                                        birthday: dto.birthday.toISOString(),
                                        startDate: dto.startDate.toISOString(),
                                        endDate: dto.endDate.toISOString(),
                                    })
                                }
                                fields={[
                                    {
                                        label: 'Student',
                                        name: 'studentName',
                                        type: NKFormType.TEXT,
                                    },
                                    {
                                        label: 'Code',
                                        name: 'code',
                                        type: NKFormType.TEXT,
                                    },
                                    {
                                        label: 'Sex (*male)',
                                        name: 'sex',
                                        type: NKFormType.BOOLEAN,
                                    },
                                    {
                                        label: 'Birthday',
                                        name: 'birthday',
                                        type: NKFormType.DATE,
                                    },
                                    {
                                        label: 'Address',
                                        name: 'address',
                                        type: NKFormType.TEXT,
                                    },
                                    {
                                        label: 'Phone',
                                        name: 'phone',
                                        type: NKFormType.TEXT,
                                    },
                                    {
                                        label: 'Class',
                                        name: 'classId',
                                        type: NKFormType.SELECT_API_OPTION,
                                        fieldProps: {
                                            apiAction(value) {
                                                return classApi.getEnumSelectOptions({ search: value });
                                            }
                                        },
                                    },
                                    {
                                        label: 'Enroll Date',
                                        name: 'enrollDate',
                                        type: NKFormType.DATE,
                                    },
                                    {
                                        label: 'Is Supervisor',
                                        name: 'isSupervisor',
                                        type: NKFormType.BOOLEAN,
                                    },
                                    {
                                        label: 'Start Date',
                                        name: 'startDate',
                                        type: NKFormType.DATE,
                                    },
                                    {
                                        label: 'End Date',
                                        name: 'endDate',
                                        type: NKFormType.DATE,
                                    },
                                ]}
                                title=""
                                schema={{
                                    schoolId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                    studentName: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                    code: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                    sex: Joi.boolean().required().messages(NKConstant.MESSAGE_FORMAT),
                                    birthday: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                    address: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                    phone: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                    classId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                    enrollDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                    isSupervisor: Joi.boolean().required().messages(NKConstant.MESSAGE_FORMAT),
                                    startDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                    endDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                }}
                                onExtraErrorAction={toastError}
                                onExtraSuccessAction={(data) => {
                                    queryClient.invalidateQueries({
                                        queryKey: [`students-in-class`],
                                    });

                                    close();

                                    toast.success(data.message || 'Successful');
                                }}
                                defaultValues={{
                                    schoolId: schoolId,
                                    studentName: "",
                                    code: "",
                                    sex: false,
                                    birthday: new Date(),
                                    address: "",
                                    phone: "",
                                    classId: 0,
                                    enrollDate: new Date(),
                                    isSupervisor: false,
                                    startDate: new Date(),
                                    endDate: new Date(),
                                }}
                            />
                        );
                    }}
                </ModalBuilder>
            }
        />
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/student-in-classes/')({
    component: Page,
});
