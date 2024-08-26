import { EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { highSchoolApi } from '@/core/api/high-school.api';
import { IUpdateUserDto, userApi } from '@/core/api/user.api';
import CTAButton from '@/core/components/cta/CTABtn';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { RoleList, SystemRole } from '@/core/models/user';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';
import { toastError } from '@/core/utils/api.helper';

interface PageProps { }

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();

    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    useDocumentTitle('Danh sách School Admin');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="school-admins"
                    title="Danh sách School Admin"
                    columns={[
                        {
                            key: 'userId',
                            title: 'ID',
                            type: FieldType.TEXT,
                            width: '50px'
                        },
                        {
                            key: 'code',
                            title: 'Mã người dùng',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'userName',
                            title: 'Tên người dùng',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'phone',
                            title: 'Số điện thoại',
                            type: FieldType.TEXT,
                        },

                        {
                            key: 'address',
                            title: 'Địa chỉ',
                            type: FieldType.TEXT,
                        },
                        // {
                        //     key: 'roleId',
                        //     title: 'Vai trò',
                        //     type: FieldType.BADGE_API,
                        //     apiAction: async (value) => RoleList,
                        // },
                        {
                            key: 'schoolName',
                            title: 'Trường',
                            type: FieldType.TEXT,
                            formatter(value) {
                                return value || 'N/A';
                            },
                        },
                        {
                            key: 'status',
                            title: 'Trạng thái',
                            type: FieldType.BADGE_API,
                            apiAction: userApi.getEnumStatuses,
                        },
                    ]}
                    queryApi={async () => {
                        return userApi.getAll(SystemRole.SCHOOL_ADMIN);
                    }}
                    defaultOrderBy="userId"
                    actionColumns={(record) => (
                        <div className="flex flex-col gap-2">
                            <ModalBuilder
                                btnLabel=""
                                btnProps={{
                                    type: 'primary',
                                    size: 'small',
                                    icon: <EyeOutlined />,
                                }}
                                title="Chi tiết tài khoản"
                                width={'800px'}
                            >
                                <FieldBuilder
                                    title=""
                                    record={record}
                                    isPadding={false}
                                    fields={[
                                        {
                                            key: 'userId',
                                            title: 'ID',
                                            type: FieldType.TEXT,
                                        },
                                        {
                                            key: 'userName',
                                            title: 'Tên người dùng',
                                            type: FieldType.TEXT,
                                        },
                                        {
                                            key: 'phone',
                                            title: 'Số điện thoại',
                                            type: FieldType.TEXT,
                                        },
                                        {
                                            key: 'address',
                                            title: 'Địa chỉ',
                                            type: FieldType.TEXT,
                                        },
                                    ]}
                                />
                            </ModalBuilder>
                            <ModalBuilder
                                btnLabel=""
                                btnProps={{
                                    size: 'small',
                                    icon: <EditOutlined />,
                                }}
                                title="Cập nhật"
                                width={'800px'}
                            >
                                {(close) => {
                                    return (
                                        <FormBuilder<IUpdateUserDto>
                                            className="!p-0"
                                            apiAction={(dto) => userApi.update(record.userId, dto)}
                                            defaultValues={{
                                                name: record.userName,
                                                phone: record.phone,
                                                address: record.address,
                                                code: record.code,
                                                password: record.password,
                                                schoolId: record.schoolId,
                                            }}
                                            fields={[
                                                {
                                                    name: 'code',
                                                    label: 'Mã người dùng',
                                                    type: NKFormType.TEXT,
                                                },
                                                {
                                                    name: 'name',
                                                    label: 'Tên',
                                                    type: NKFormType.TEXT,
                                                },
                                                {
                                                    name: 'phone',
                                                    label: 'Số điện thoại',
                                                    type: NKFormType.TEXT,
                                                },
                                                {
                                                    name: 'address',
                                                    label: 'Địa chỉ',
                                                    type: NKFormType.TEXT,
                                                },
                                                {
                                                    name: 'password',
                                                    label: 'Mật khẩu',
                                                    type: NKFormType.PASSWORD,
                                                },
                                                {
                                                    name: 'schoolId',
                                                    label: 'Trường',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    fieldProps: {
                                                        apiAction: (value) => highSchoolApi.getEnumSelectOptions(value),
                                                    },
                                                },
                                            ]}
                                            title=""
                                            schema={{
                                                name: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                phone: Joi.string().required().length(9).messages(NKConstant.MESSAGE_FORMAT),
                                                address: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                code: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                password: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                schoolId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            }}
                                            onExtraErrorAction={toastError}
                                            onExtraSuccessAction={(data) => {
                                                queryClient.invalidateQueries({
                                                    queryKey: ['school-admins'],
                                                });
                                                close();
                                                toast.success(data.message || 'Successful');
                                            }}
                                        />
                                    );
                                }}
                            </ModalBuilder>
                            <CTAButton
                                ctaApi={() => userApi.delete(record.userId)}
                                isConfirm
                                confirmMessage="Bạn có chắc muốn xóa tài khoản này không?"
                                extraOnError={toastError}
                                extraOnSuccess={(data) => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['school-admins'],
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
                            label: 'Mã người dùng',
                            comparator: FilterComparator.LIKE,
                            name: 'code',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Tên người dùng',
                            comparator: FilterComparator.LIKE,
                            name: 'name',
                            type: NKFormType.TEXT,
                        },
                    ]}
                    extraButtons={
                        <ModalBuilder
                            btnLabel="Tạo School Admin"
                            btnProps={{
                                type: 'primary',
                                icon: <PlusOutlined />,
                            }}
                            title="Tạo School Admin"
                        >
                            {(close) => {
                                return (
                                    <FormBuilder<IUpdateUserDto>
                                        className="!p-0"
                                        apiAction={userApi.createSchoolAdmin}
                                        fields={[
                                            {
                                                name: 'code',
                                                label: 'Mã người dùng',
                                                type: NKFormType.TEXT,
                                            },
                                            {
                                                name: 'name',
                                                label: 'Tên người dùng',
                                                type: NKFormType.TEXT,
                                            },
                                            {
                                                name: 'phone',
                                                label: 'Số điện thoại',
                                                type: NKFormType.TEXT,
                                            },
                                            {
                                                name: 'address',
                                                label: 'Địa chỉ',
                                                type: NKFormType.TEXT,
                                            },
                                            {
                                                name: 'password',
                                                label: 'Mật khẩu',
                                                type: NKFormType.PASSWORD,
                                            },
                                            {
                                                name: 'schoolId',
                                                label: 'Trường',
                                                type: NKFormType.SELECT_API_OPTION,
                                                fieldProps: {
                                                    apiAction: (value) => highSchoolApi.getEnumSelectOptions(value),
                                                },
                                            },
                                        ]}
                                        title=""
                                        schema={{
                                            name: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            phone: Joi.string().required().length(9).messages(NKConstant.MESSAGE_FORMAT),
                                            address: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            code: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            password: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            schoolId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                        }}
                                        onExtraErrorAction={toastError}
                                        onExtraSuccessAction={(data) => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['school-admins'],
                                            });
                                            close();
                                            toast.success(data.message || 'Successful');
                                        }}
                                        defaultValues={{
                                            name: '',
                                            phone: '',
                                            address: '',
                                            code: '',
                                            password: '',
                                            schoolId: 0,
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

export const Route = createFileRoute('/_admin-layout/dashboard/school-admin/')({
    component: Page,
});
