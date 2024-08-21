import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { classGroupApi } from '@/core/api/class-group.api';
import CTAButton from '@/core/components/cta/CTABtn';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { ClassGroupStatus } from '@/core/models/class-group';
import { FilterComparator } from '@/core/models/common';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { toastError } from '@/core/utils/api.helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/core/store';
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
            if (isSupervisor) {
                return classGroupApi.getByUser(userId);
            }
            return classGroupApi.getBySchool(schoolId)
        }
        return classGroupApi.getAll()
    };


    useDocumentTitle('Danh sách khối');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="class-group"
                    title="Danh sách khối"
                    columns={[
                        {
                            key: 'classGroupId',
                            title: 'ID',
                            type: FieldType.TEXT,
                            width: '50px'
                        },
                        {
                            key: 'name',
                            title: 'Tên Khối',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'teacherId',
                            title: 'Giám thị',
                            type: FieldType.BADGE_API,
                            apiAction(value) {
                                return teacherApi.getEnumSelectOptions({ search: value, supervisorId: schoolId });
                            },
                        },
                        {
                            key: 'status',
                            title: 'Trạng thái',
                            type: FieldType.BADGE_API,
                            apiAction() {
                                return classGroupApi.getEnumStatus();
                            },
                        },
                    ]}
                    queryApi={getByRole}
                    actionColumns={!isSupervisor ? (record) => {
                        return (
                            <div className="flex flex-col gap-2">
                                <ModalBuilder
                                    btnLabel=""
                                    btnProps={{
                                        size: 'small',
                                        icon: <EditOutlined />,
                                    }}
                                    title="Edit Class Group"
                                >
                                    {(close) => {
                                        return (
                                            <FormBuilder
                                                className="!p-0"
                                                title=""
                                                apiAction={(dto) => classGroupApi.update(dto)}
                                                defaultValues={{
                                                    name: record.name,
                                                    teacherId: record.teacherId,
                                                    schoolId: schoolId,
                                                    classGroupId: record.classGroupId
                                                }}
                                                schema={{
                                                    name: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                    teacherId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                    schoolId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                    classGroupId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                }}
                                                fields={[
                                                    {
                                                        name: 'name',
                                                        label: 'Tên Khối',
                                                        type: NKFormType.TEXT,
                                                    },
                                                    {
                                                        name: 'teacherId',
                                                        label: 'Giám thị',
                                                        type: NKFormType.SELECT_API_OPTION,
                                                        fieldProps: {
                                                            apiAction: (value) =>
                                                                teacherApi.getEnumSelectOptions({ search: value, supervisorId: schoolId }),
                                                        },
                                                    },
                                                ]}
                                                onExtraSuccessAction={() => {
                                                    toast.success('Update Class Group successfully');
                                                    queryClient.invalidateQueries({
                                                        queryKey: ['class-group'],
                                                    });

                                                    close();
                                                }}
                                                onExtraErrorAction={toastError}
                                            />
                                        );
                                    }}
                                </ModalBuilder>
                                <CTAButton
                                    ctaApi={() => classGroupApi.delete(record.classGroupId)}
                                    isConfirm
                                    confirmMessage="Bạn có chắc chắn muốn xóa Khối này không?"
                                    extraOnError={toastError}
                                    extraOnSuccess={() => {
                                        queryClient.invalidateQueries({
                                            queryKey: ['class-group'],
                                        });

                                        toast.success('Delete class group successfully');
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
                    } : null}
                    filters={[
                        {
                            label: 'Name',
                            comparator: FilterComparator.LIKE,
                            name: 'classGroupName',
                            type: NKFormType.TEXT,
                        }
                    ]}
                    extraButtons={
                        (!isSupervisor) && (
                            <ModalBuilder
                                btnLabel="Tạo khối"
                                btnProps={{
                                    type: 'primary',
                                    icon: <PlusOutlined />,
                                }}
                                title="Tạo khối"
                            >
                                {(close) => {
                                    return (
                                        <FormBuilder
                                            className="!p-0"
                                            title=""
                                            apiAction={classGroupApi.create}
                                            defaultValues={{
                                                name: "",
                                                teacherId: 0,
                                                schoolId: schoolId
                                            }}
                                            schema={{
                                                name: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                teacherId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                schoolId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            }}
                                            fields={[
                                                {
                                                    name: 'name',
                                                    label: 'Tên khối',
                                                    type: NKFormType.TEXT,
                                                },
                                                {
                                                    name: 'teacherId',
                                                    label: 'Giám thị quản lý',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    fieldProps: {
                                                        apiAction: (value) =>
                                                            teacherApi.getEnumSelectOptions({ search: value, supervisorId: schoolId }),
                                                    },
                                                },
                                            ]}
                                            onExtraSuccessAction={() => {
                                                toast.success('Create Class Group successfully');
                                                queryClient.invalidateQueries({
                                                    queryKey: ['class-group'],
                                                });
                                                close();
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

export const Route = createFileRoute('/_admin-layout/dashboard/class-group/')({
    component: Page,
});
