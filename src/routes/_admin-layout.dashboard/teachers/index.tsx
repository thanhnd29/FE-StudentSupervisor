import { PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { highSchoolApi } from '@/core/api/high-school.api';
import { teacherApi } from '@/core/api/tearcher.api';
import CTAButton from '@/core/components/cta/CTABtn';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { RoleList, SystemRole } from '@/core/models/user';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { toastError } from '@/core/utils/api.helper';
import { RootState } from '@/core/store';
import { useSelector } from 'react-redux';
import { UserState } from '@/core/store/user';

interface PageProps { }

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();

    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    useDocumentTitle('Danh sách giáo viên');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="teacher-list"
                    title="Danh sách giáo viên"
                    columns={[
                        {
                            key: 'teacherId',
                            title: 'ID',
                            type: FieldType.TEXT,
                            width: '50px'
                        },
                        {
                            key: 'code',
                            title: 'Mã giáo viên',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'teacherName',
                            title: 'Tên giáo viên',
                            type: FieldType.TEXT,
                        },
                        {
                            key: '',
                            title: 'Giới tính',
                            type: FieldType.CUSTOM,
                            formatter: (record) => {
                                return record?.sex ? 'Female' : 'Male';
                            },
                        },
                        {
                            key: 'address',
                            title: 'Địa chỉ',
                            type: FieldType.TEXT,
                            formatter: (record) => {
                                return record ? record : 'N/A';
                            },
                        },
                        {
                            key: 'phone',
                            title: 'Số điện thoại',
                            type: FieldType.TEXT,
                            formatter: (record) => {
                                return record ? record : 'N/A';
                            },
                        },
                        {
                            key: 'roleId',
                            title: 'Vai trò',
                            type: FieldType.BADGE_API,
                            apiAction: (value) => {
                                return RoleList;
                            },
                        },
                        {
                            key: 'status',
                            title: 'Trạng thái',
                            type: FieldType.BADGE_API,
                            apiAction: teacherApi.getEnumStatuses,
                        },
                    ]}
                    queryApi={schoolId ? () => teacherApi.getBySchool(schoolId) : teacherApi.getAll}
                    actionColumns={(record) => {
                        return (
                            <div className="flex flex-col gap-2">
                                <CTAButton
                                    ctaApi={() => teacherApi.delete(record.teacherId)}
                                    isConfirm
                                    confirmMessage="Bạn có chắc chắn muốn xóa giáo viên này không?"
                                    extraOnError={toastError}
                                    extraOnSuccess={(data) => {
                                        queryClient.invalidateQueries({
                                            queryKey: ['teacher-list'],
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
                        );
                    }}
                    filters={[
                        {
                            label: 'Tên giáo viên',
                            comparator: FilterComparator.LIKE,
                            name: 'teacherName',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Mã giáo viên',
                            comparator: FilterComparator.LIKE,
                            name: 'code',
                            type: NKFormType.TEXT,
                        },
                    ]}
                    extraButtons={
                        <>
                            <ModalBuilder
                                btnLabel="Thêm giáo viên"
                                btnProps={{
                                    type: 'primary',
                                    icon: <PlusOutlined />,
                                }}
                                title="Thêm giáo viên"
                            >
                                {(close) => {
                                    return (
                                        <FormBuilder
                                            className="!p-0"
                                            title=""
                                            apiAction={teacherApi.create}
                                            defaultValues={{
                                                address: '',
                                                code: '',
                                                password: '',
                                                phone: '',
                                                schoolAdminId: SystemRole.SCHOOL_ADMIN,
                                                schoolId: schoolId || 0,
                                                sex: false,
                                                teacherName: '',
                                            }}
                                            schema={{
                                                address: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                code: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                password: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                phone: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                schoolAdminId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                schoolId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                sex: Joi.boolean().required().messages(NKConstant.MESSAGE_FORMAT),
                                                teacherName: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            }}
                                            fields={[
                                                {
                                                    name: 'code',
                                                    label: 'Mã giáo viên',
                                                    type: NKFormType.TEXT,
                                                },
                                                {
                                                    name: 'teacherName',
                                                    label: 'Tên giáo viên',
                                                    type: NKFormType.TEXT,
                                                },
                                                {
                                                    label: 'Giới tính (*nam)',
                                                    name: 'sex',
                                                    type: NKFormType.BOOLEAN,
                                                },
                                                {
                                                    name: 'phone',
                                                    label: 'Số điện thoại',
                                                    type: NKFormType.TEXT,
                                                },
                                                {
                                                    name: 'password',
                                                    label: 'Mật khẩu',
                                                    type: NKFormType.PASSWORD,
                                                },
                                                {
                                                    name: 'address',
                                                    label: 'Địa chỉ',
                                                    type: NKFormType.TEXT,
                                                },
                                                {
                                                    name: 'schoolId',
                                                    label: 'School',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    fieldProps: {
                                                        apiAction: highSchoolApi.getEnumSelectOptions,
                                                        disabled: true
                                                    },
                                                },
                                                // {
                                                //     name: 'schoolAdminId',
                                                //     label: 'Role',
                                                //     type: NKFormType.SELECT_API_OPTION,
                                                //     fieldProps: {
                                                //         apiAction: async () => RoleList,
                                                //     },
                                                // },
                                            ]}
                                            onExtraSuccessAction={(data) => {
                                                queryClient.invalidateQueries({
                                                    queryKey: ['teacher-list'],
                                                });

                                                close();

                                                toast.success(data.message || 'Successful');
                                            }}
                                            onExtraErrorAction={toastError}
                                        />
                                    );
                                }}
                            </ModalBuilder>
                            <ModalBuilder
                                btnLabel="Thêm giám thị"
                                btnProps={{
                                    type: 'primary',
                                    icon: <PlusOutlined />,
                                }}
                                title="Thêm giám thị"
                            >
                                {(close) => {
                                    return (
                                        <FormBuilder
                                            className="!p-0"
                                            title=""
                                            apiAction={teacherApi.createSupervisors}
                                            defaultValues={{
                                                address: '',
                                                code: '',
                                                password: '',
                                                phone: '',
                                                schoolAdminId: SystemRole.SCHOOL_ADMIN,
                                                schoolId: schoolId || 0,
                                                sex: false,
                                                teacherName: '',
                                            }}
                                            schema={{
                                                address: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                code: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                password: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                phone: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                schoolAdminId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                schoolId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                sex: Joi.boolean().required().messages(NKConstant.MESSAGE_FORMAT),
                                                teacherName: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            }}
                                            fields={[
                                                {
                                                    name: 'code',
                                                    label: 'Mã giáo viên',
                                                    type: NKFormType.TEXT,
                                                },
                                                {
                                                    name: 'teacherName',
                                                    label: 'Tên giám thị',
                                                    type: NKFormType.TEXT,
                                                },
                                                {
                                                    label: 'Giới tính (*nam)',
                                                    name: 'sex',
                                                    type: NKFormType.BOOLEAN,
                                                },
                                                {
                                                    name: 'phone',
                                                    label: 'Số điện thoại',
                                                    type: NKFormType.TEXT,
                                                },
                                                {
                                                    name: 'password',
                                                    label: 'Mật khẩu',
                                                    type: NKFormType.PASSWORD,
                                                },
                                                {
                                                    name: 'address',
                                                    label: 'Địa chỉ',
                                                    type: NKFormType.TEXT,
                                                },
                                                {
                                                    name: 'schoolId',
                                                    label: 'School',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    fieldProps: {
                                                        apiAction: highSchoolApi.getEnumSelectOptions,
                                                        disabled: true
                                                    },
                                                },
                                                // {
                                                //     name: 'roleId',
                                                //     label: 'Role',
                                                //     type: NKFormType.SELECT_API_OPTION,
                                                //     fieldProps: {
                                                //         apiAction: async (value) => {
                                                //             if (isSchoolAdmin) {
                                                //                 return RoleList.filter(
                                                //                     (role) =>
                                                //                         role.value === SystemRole.SUPERVISOR ||
                                                //                         role.value === SystemRole.TEACHER,
                                                //                 );
                                                //             }

                                                //             return RoleList;
                                                //         },
                                                //     },
                                                // },
                                                // {
                                                //     name: 'schoolAdminId',
                                                //     label: 'Role',
                                                //     type: NKFormType.SELECT_API_OPTION,
                                                //     fieldProps: {
                                                //         apiAction: async () => RoleList,
                                                //     },
                                                // },
                                            ]}
                                            onExtraSuccessAction={(data) => {
                                                queryClient.invalidateQueries({
                                                    queryKey: ['teacher-list'],
                                                });

                                                close();

                                                toast.success(data.message || 'Successful');
                                            }}
                                            onExtraErrorAction={toastError}
                                        />
                                    );
                                }}
                            </ModalBuilder>
                        </>
                    }
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/teachers/')({
    component: Page,
});
