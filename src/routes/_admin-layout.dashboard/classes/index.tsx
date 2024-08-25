import { EditOutlined, EyeOutlined, HistoryOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { NKRouter } from '@/core/NKRouter';
import { classGroupApi } from '@/core/api/class-group.api';
import { classApi } from '@/core/api/class.api';
import { schoolYearApi } from '@/core/api/school-years.api';
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
import { RootState } from '@/core/store';
import { useSelector } from 'react-redux';
import { UserState } from '@/core/store/user';
import { teacherApi } from '@/core/api/tearcher.api';

interface PageProps { }

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();

    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId, userId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    const getByRole = () => {
        if (schoolId) {
            if (isTeacher) {
                return classApi.getByClass(userId);
            }
            return classApi.getBySchool(schoolId)
        }
        return classApi.getAll()
    };

    useDocumentTitle('Danh sách Lớp');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="classes"
                    title="Danh sách Lớp"
                    columns={[
                        {
                            key: 'classId',
                            title: 'ID',
                            type: FieldType.TEXT,
                            width: '50px'
                        },
                        {
                            key: 'code',
                            title: 'Mã lớp',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'name',
                            title: 'Tên lớp',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'grade',
                            title: 'Khối',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'teacherName',
                            title: 'Giáo viên chủ nhiệm',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'totalPoint',
                            title: 'Điểm thi đua',
                            type: FieldType.NUMBER,
                        },
                        // {
                        //     key: 'schoolYearId',
                        //     title: 'Niên khóa',
                        //     type: FieldType.BADGE_API,
                        //     apiAction(value) {
                        //         return schoolYearApi.getEnumSelectOptions({
                        //             search: value,
                        //             withSchoolName: true,
                        //         });
                        //     },
                        // },
                        {
                            key: 'status',
                            title: 'Trạng thái',
                            type: FieldType.BADGE_API,
                            apiAction: classApi.getEnumStatuses
                        },
                    ]}
                    queryApi={getByRole}
                    isSelectYear={true}
                    schoolId={schoolId}
                    actionColumns={(record) => {
                        return (
                            <div className="grid grid-cols-2 gap-2">
                                <div className="col-span-1">
                                    <Button
                                        icon={<EyeOutlined />}
                                        type="primary"
                                        size="small"
                                        className="flex items-center justify-center"
                                        onClick={() => router.push(NKRouter.classes.detail(record.classId))}
                                    />
                                </div>
                                {!isTeacher && (
                                    <div className="col-span-1">
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
                                                        title=""
                                                        apiAction={(dto) => classApi.update(record.classId, dto)}
                                                        defaultValues={{
                                                            teacherId: record.teacherId,
                                                            classGroupId: record.classGroupId,
                                                            code: record.code,
                                                            name: record.name,
                                                            schoolYearId: record.schoolYearId,
                                                            totalPoint: record.totalPoint,
                                                        }}
                                                        schema={{
                                                            teacherId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                            classGroupId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                            code: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                            name: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                            schoolYearId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                            totalPoint: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                        }}
                                                        fields={[
                                                            {
                                                                name: 'name',
                                                                label: 'Tên lớp',
                                                                type: NKFormType.TEXT,
                                                            },
                                                            {
                                                                name: 'code',
                                                                label: 'Mã lớp',
                                                                type: NKFormType.TEXT,
                                                            },
                                                            {
                                                                name: 'teacherId',
                                                                label: 'Giáo viên chủ nhiệm',
                                                                type: NKFormType.SELECT_API_OPTION,
                                                                fieldProps: {
                                                                    apiAction: (value) =>
                                                                        teacherApi.getEnumSelectOptions({
                                                                            search: value,
                                                                            schoolId: schoolId,
                                                                        }),
                                                                },
                                                            },
                                                            {
                                                                name: 'totalPoint',
                                                                label: 'Điểm thi đua',
                                                                type: NKFormType.NUMBER,
                                                            },
                                                        ]}
                                                        onExtraSuccessAction={(data) => {
                                                            queryClient.invalidateQueries({
                                                                queryKey: ['classes'],
                                                            });

                                                            close();

                                                            toast.success(data.message || 'Successful');
                                                        }}
                                                        onExtraErrorAction={toastError}
                                                    />
                                                );
                                            }}
                                        </ModalBuilder>
                                    </div>
                                )}
                                {!isTeacher && (
                                    <div className="col-span-1">
                                        <CTAButton
                                            ctaApi={() => classApi.delete(record.classId)}
                                            isConfirm
                                            confirmMessage="Bạn có chắc chắn muốn xóa lớp này không?"
                                            extraOnError={toastError}
                                            extraOnSuccess={(data) => {
                                                queryClient.invalidateQueries({
                                                    queryKey: ['classes'],
                                                });

                                                toast.success(data.message || 'Successful');
                                            }}
                                        >
                                            <Button
                                                type="primary"
                                                danger
                                                size="small"
                                                className="flex items-center justify-center"
                                                icon={<Trash className="h-4 w-4" />}
                                            ></Button>
                                        </CTAButton>
                                    </div>
                                )}
                                <div className="col-span-1">
                                    <Button
                                        icon={<HistoryOutlined />}
                                        type="dashed"
                                        size="small"
                                        className="flex items-center justify-center"
                                        onClick={() => router.push(NKRouter.classes.history(record.classId))}
                                    />
                                </div>
                            </div>
                        );
                    }}
                    filters={[
                        {
                            label: 'Tên lớp',
                            comparator: FilterComparator.LIKE,
                            name: 'name',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Mã lớp',
                            comparator: FilterComparator.LIKE,
                            name: 'code',
                            type: NKFormType.TEXT,
                        },
                        // {
                        //     label: 'Niên khóa',
                        //     comparator: FilterComparator.IN,
                        //     name: 'year',
                        //     type: NKFormType.TEXT,
                        // },
                    ]}
                    extraButtons={
                        (!isTeacher) && (
                            <ModalBuilder
                                btnLabel="Tạo"
                                btnProps={{
                                    type: 'primary',
                                    icon: <PlusOutlined />,
                                }}
                                title="Tạo lớp"
                            >
                                {(close) => {
                                    return (
                                        <FormBuilder
                                            className="!p-0"
                                            title=""
                                            apiAction={classApi.create}
                                            defaultValues={{
                                                teacherId: 0,
                                                classGroupId: 0,
                                                code: '',
                                                name: '',
                                                schoolYearId: 0,
                                                grade: 0,
                                            }}
                                            schema={{
                                                code: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                name: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                schoolYearId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                teacherId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                classGroupId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                grade: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            }}
                                            fields={[
                                                {
                                                    name: 'schoolYearId',
                                                    label: 'Niên khóa',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    fieldProps: {
                                                        apiAction: (value) =>
                                                            schoolYearApi.getEnumSelectOptions({
                                                                search: value,
                                                                highSchoolId: schoolId
                                                            }),
                                                    },
                                                },
                                                {
                                                    name: 'name',
                                                    label: 'Tên lớp',
                                                    type: NKFormType.TEXT,
                                                },
                                                {
                                                    name: 'code',
                                                    label: 'Mã lớp',
                                                    type: NKFormType.TEXT,
                                                },
                                                {
                                                    name: 'grade',
                                                    label: 'Khối',
                                                    type: NKFormType.NUMBER,
                                                },
                                                {
                                                    name: 'teacherId',
                                                    label: 'Giáo viên chủ nhiệm',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    fieldProps: {
                                                        apiAction: (value) => teacherApi.getEnumSelectOptions({ search: value, teacherByYear: schoolId }),
                                                    },
                                                },
                                                {
                                                    name: 'classGroupId',
                                                    label: 'Thuộc nhóm lớp',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    fieldProps: {
                                                        apiAction: (value) => classGroupApi.getEnumSelectOptions(value, schoolId),
                                                    },
                                                },
                                            ]}
                                            onExtraSuccessAction={(data) => {
                                                queryClient.invalidateQueries({
                                                    queryKey: ['classes'],
                                                });

                                                close();

                                                toast.success(data.message || 'Successful');
                                            }}
                                            onExtraErrorAction={toastError}
                                        />
                                    );
                                }}
                            </ModalBuilder>
                        )
                    }
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/classes/')({
    component: Page,
});
