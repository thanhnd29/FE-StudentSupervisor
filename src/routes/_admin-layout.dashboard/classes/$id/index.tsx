import { EditOutlined, PlusOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button, Tabs } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { classApi } from '@/core/api/class.api';
import { schoolYearApi } from '@/core/api/school-years.api';
import { studentInClassApi } from '@/core/api/student-in-class.api';
import CTAButton from '@/core/components/cta/CTABtn';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { FilterComparator } from '@/core/models/common';
import { toastError } from '@/core/utils/api.helper';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

const StudentInClass = ({ schoolIdT }: { schoolIdT?: number }) => {
    const { id: classId } = Route.useParams();
    const queryClient = useQueryClient();

    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, userId, schoolId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

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
                    key: 'studentCode',
                    title: 'Mã học sinh',
                    type: FieldType.TEXT,
                },
                {
                    key: 'studentName',
                    title: 'Tên học sinh',
                    type: FieldType.TEXT,
                },
                {
                    key: 'enrollDate',
                    title: 'Ngày đăng ký',
                    type: FieldType.TIME_DATE,
                },
                {
                    key: 'isSupervisor',
                    title: 'Sao đỏ',
                    type: FieldType.BOOLEAN,
                },
                {
                    key: 'status',
                    title: 'Trạng thái',
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
                        title="Cập nhật"
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
                                            label: 'Tên học sinh',
                                            name: 'studentName',
                                            type: NKFormType.TEXT,
                                        },
                                        {
                                            label: 'Mã học sinh',
                                            name: 'code',
                                            type: NKFormType.TEXT,
                                        },
                                        {
                                            label: 'Giới tính (*nam)',
                                            name: 'sex',
                                            type: NKFormType.BOOLEAN,
                                        },
                                        {
                                            label: 'Ngày sinh',
                                            name: 'birthday',
                                            type: NKFormType.DATE,
                                        },
                                        {
                                            label: 'Địa chỉ',
                                            name: 'address',
                                            type: NKFormType.TEXT,
                                        },
                                        {
                                            label: 'Số điện thoại',
                                            name: 'phone',
                                            type: NKFormType.TEXT,
                                        },
                                        {
                                            label: 'Lớp',
                                            name: 'classId',
                                            type: NKFormType.SELECT_API_OPTION,
                                            fieldProps: {
                                                apiAction(value) {
                                                    return classApi.getEnumSelectOptions({ search: value });
                                                }
                                            },
                                        },
                                        {
                                            label: 'Ngày đăng ký',
                                            name: 'enrollDate',
                                            type: NKFormType.DATE,
                                        },
                                        {
                                            label: 'Sao đỏ',
                                            name: 'isSupervisor',
                                            type: NKFormType.BOOLEAN,
                                        },
                                        {
                                            label: 'Ngày vào lớp',
                                            name: 'startDate',
                                            type: NKFormType.DATE,
                                        },
                                        {
                                            label: 'Ngày rời lớp',
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
                    {isSchoolAdmin && (
                        <ModalBuilder
                            btnLabel=""
                            btnProps={{
                                type: 'primary',
                                size: 'small',
                                icon: <UserSwitchOutlined />,
                            }}
                            title="Chuyển lớp"
                        >
                            {(close) => {
                                return (
                                    <FormBuilder
                                        className="!p-0"
                                        apiAction={(dto) =>
                                            studentInClassApi.changeClass({
                                                ...dto,
                                            })
                                        }
                                        defaultValues={{
                                            classId: record.classId,
                                            studentInClassId: record.studentInClassId,
                                        }}
                                        fields={[
                                            {
                                                label: 'Lớp',
                                                name: 'classId',
                                                type: NKFormType.SELECT_API_OPTION,
                                                fieldProps: {
                                                    apiAction(value) {
                                                        return classApi.getEnumSelectOptions({ search: value, highSchoolId: schoolId, year: record.year, grade: record.grade });
                                                    }
                                                },
                                            },
                                        ]}
                                        title=""
                                        schema={{
                                            classId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            studentInClassId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
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
                    )}
                    <CTAButton
                        ctaApi={() => studentInClassApi.delete(record.studentInClassId)}
                        isConfirm
                        confirmMessage="Bạn có chắc muốn xóa học sinh này không?"
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
                    label: 'Mã học sinh',
                    comparator: FilterComparator.LIKE,
                    name: 'studentCode',
                    type: NKFormType.TEXT,
                },
                {
                    label: 'Tên học sinh',
                    comparator: FilterComparator.LIKE,
                    name: 'studentName',
                    type: NKFormType.TEXT,
                },
            ]}
            extraButtons={
                !isTeacher && (
                    <ModalBuilder
                        btnLabel="Thêm học sinh"
                        btnProps={{
                            type: 'primary',
                            icon: <PlusOutlined />,
                        }}
                        title="Thêm học sinh"
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
                                            label: 'Mã học sinh',
                                            name: 'code',
                                            type: NKFormType.TEXT,
                                        },
                                        {
                                            label: 'Tên học sinh',
                                            name: 'studentName',
                                            type: NKFormType.TEXT,
                                        },
                                        {
                                            label: 'Giới tính (*nam)',
                                            name: 'sex',
                                            type: NKFormType.BOOLEAN,
                                        },
                                        {
                                            label: 'Ngày sinh',
                                            name: 'birthday',
                                            type: NKFormType.DATE,
                                        },
                                        {
                                            label: 'Địa chỉ',
                                            name: 'address',
                                            type: NKFormType.TEXT,
                                        },
                                        {
                                            label: 'Số điện thoại',
                                            name: 'phone',
                                            type: NKFormType.TEXT,
                                        },
                                        {
                                            label: 'Lớp',
                                            name: 'classId',
                                            type: NKFormType.SELECT_API_OPTION,
                                            fieldProps: {
                                                apiAction(value) {
                                                    return classApi.getEnumSelectOptions({ search: value });
                                                }
                                            },
                                        },
                                        {
                                            label: 'Ngày đăng ký',
                                            name: 'enrollDate',
                                            type: NKFormType.DATE,
                                        },
                                        {
                                            label: 'Sao đỏ',
                                            name: 'isSupervisor',
                                            type: NKFormType.BOOLEAN,
                                        },
                                        {
                                            label: 'Ngày vào lớp',
                                            name: 'startDate',
                                            type: NKFormType.DATE,
                                        },
                                        {
                                            label: 'Ngày rời lớp',
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
                                        schoolId: schoolId ?? 0,
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
                )
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
                    // {
                    //     key: 'classId',
                    //     title: 'ID',
                    //     type: FieldType.TEXT,
                    //     span: 2,
                    // },
                    {
                        key: 'code',
                        title: 'Mã lớp',
                        type: FieldType.TEXT,
                        span: 2,
                    },
                    {
                        key: 'name',
                        title: 'Tên lớp',
                        type: FieldType.TEXT,
                        span: 2,
                    },
                    {
                        key: 'totalPoint',
                        title: 'Điểm',
                        type: FieldType.TEXT,
                        span: 2,
                    },
                    {
                        key: 'grade',
                        title: 'Khối',
                        type: FieldType.TEXT,
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
                            label: 'Danh sách học sinh trong lớp',
                            children: <StudentInClass schoolIdT={schoolYearQuery.data?.schoolId} />,
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/classes/$id/')({
    component: Page,
});
