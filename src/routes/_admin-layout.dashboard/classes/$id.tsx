import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button, Tabs } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { classGroupApi } from '@/core/api/class-group.api';
import { classApi } from '@/core/api/class.api';
import { schoolYearApi } from '@/core/api/school-years.api';
import { studentInClassApi } from '@/core/api/student-in-class.api';
import { studentApi } from '@/core/api/student.api';
import CTAButton from '@/core/components/cta/CTABtn';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { FilterComparator } from '@/core/models/common';
import { toastError } from '@/core/utils/api.helper';

const StudentInClass = ({ schoolId }: { schoolId?: number }) => {
    const { id: classId } = Route.useParams();
    const queryClient = useQueryClient();

    return (
        <TableBuilder
            sourceKey={`students-in-class-${classId}`}
            extraFilter={[`classId||${FilterComparator.EQUAL}||${classId}`]}
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
                    key: 'status',
                    title: 'Status',
                    type: FieldType.BADGE_API,
                    apiAction(value) {
                        return studentInClassApi.getEnumStatuses(value);
                    },
                },
            ]}
            queryApi={() => studentInClassApi.getAll().then((res) => res.filter((x) => x.classId === Number(classId)))}
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
                                        })
                                    }
                                    defaultValues={{
                                        classId: Number(classId),
                                        enrollDate: new Date(record.enrollDate),
                                        isSupervisor: record.isSupervisor,
                                        status: record.status,
                                        studentId: record.studentId,
                                        studentInClassId: record.studentInClassId,
                                    }}
                                    fields={[
                                        {
                                            label: 'Student',
                                            name: 'studentId',
                                            type: NKFormType.SELECT_API_OPTION,
                                            fieldProps: {
                                                apiAction: (value) =>
                                                    studentApi.getEnumSelectOptions({
                                                        search: value,
                                                        schoolId,
                                                    }),
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
                                            label: 'Status',
                                            name: 'status',
                                            type: NKFormType.SELECT_API_OPTION,
                                            fieldProps: {
                                                apiAction: (value) => studentInClassApi.getEnumStatuses(value),
                                            },
                                        },
                                    ]}
                                    title=""
                                    schema={{
                                        classId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                        enrollDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                        isSupervisor: Joi.boolean().required().messages(NKConstant.MESSAGE_FORMAT),
                                        status: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                        studentId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                        studentInClassId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                    }}
                                    onExtraErrorAction={toastError}
                                    onExtraSuccessAction={() => {
                                        queryClient.invalidateQueries({
                                            queryKey: [`students-in-class-${classId}`],
                                        });

                                        close();

                                        toast.success('Update student successfully');
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
                        extraOnSuccess={() => {
                            queryClient.invalidateQueries({
                                queryKey: [`students-in-class-${classId}`],
                            });

                            toast.success('Delete student successfully');
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
                                apiAction={(dto) =>
                                    studentInClassApi.create({
                                        ...dto,
                                        enrollDate: dto.enrollDate.toISOString(),
                                    })
                                }
                                fields={[
                                    {
                                        label: 'Student',
                                        name: 'studentId',
                                        type: NKFormType.SELECT_API_OPTION,
                                        fieldProps: {
                                            apiAction: (value) =>
                                                studentApi.getEnumSelectOptions({
                                                    search: value,
                                                }),
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
                                        label: 'Status',
                                        name: 'status',
                                        type: NKFormType.SELECT_API_OPTION,
                                        fieldProps: {
                                            apiAction: (value) => studentInClassApi.getEnumStatuses(value),
                                        },
                                    },
                                ]}
                                title=""
                                schema={{
                                    classId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                    enrollDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                    isSupervisor: Joi.boolean().required().messages(NKConstant.MESSAGE_FORMAT),
                                    status: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                    studentId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                }}
                                onExtraErrorAction={toastError}
                                onExtraSuccessAction={() => {
                                    queryClient.invalidateQueries({
                                        queryKey: [`students-in-class-${classId}`],
                                    });

                                    close();

                                    toast.success('Create student successfully');
                                }}
                                defaultValues={{
                                    classId: Number(classId),
                                    enrollDate: new Date(),
                                    isSupervisor: false,
                                    status: '',
                                    studentId: 0,
                                }}
                            />
                        );
                    }}
                </ModalBuilder>
            }
        />
    );
};

const Page = () => {
    const { id } = Route.useParams();
    const classQuery = useQuery({
        queryKey: ['class', id],
        queryFn: async () => {
            const res = await classApi.getById(Number(id));
            return res;
        },
    });

    const schoolYearQuery = useQuery({
        queryKey: ['school-year', classQuery.data?.schoolYearId],
        queryFn: async () => {
            const res = await schoolYearApi.getById(classQuery.data?.schoolYearId as number);
            return res;
        },
        enabled: !!classQuery.data?.schoolYearId,
    });

    if (classQuery.isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-4">
            <FieldBuilder
                record={classQuery.data}
                fields={[
                    {
                        key: 'classId',
                        title: 'ID',
                        type: FieldType.TEXT,
                        span: 2,
                    },
                    {
                        key: 'code',
                        title: 'Code',
                        type: FieldType.TEXT,
                        span: 2,
                    },
                    {
                        key: 'name',
                        title: 'Name',
                        type: FieldType.TEXT,
                        span: 2,
                    },
                    {
                        key: 'room',
                        title: 'Room',
                        type: FieldType.TEXT,
                        span: 2,
                    },
                    {
                        key: 'totalPoint',
                        title: 'Total Point',
                        type: FieldType.TEXT,
                    },
                    {
                        key: 'schoolYearId',
                        title: 'School',
                        type: FieldType.BADGE_API,
                        apiAction: async (value) => {
                            const res = await schoolYearApi.getEnumSelectOptions({
                                search: value,
                                withSchoolName: true,
                            });

                            return res;
                        },
                        span: 2,
                    },
                    {
                        key: 'classGroupId',
                        title: 'Class Group',
                        type: FieldType.BADGE_API,
                        apiAction: (value) => {
                            return classGroupApi.getEnumSelectOptions(value);
                        },
                        span: 2,
                    },
                ]}
                title={`Class ${classQuery.data?.name}`}
            />
            <div className="rounded-lg bg-white p-8">
                <Tabs
                    items={[
                        {
                            key: 'students',
                            label: 'Students',
                            children: <StudentInClass schoolId={schoolYearQuery.data?.schoolId} />,
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/classes/$id')({
    component: Page,
});
