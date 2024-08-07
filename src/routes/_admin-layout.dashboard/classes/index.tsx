import { EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
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

    useDocumentTitle('Classes');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="classes"
                    title="Classes"
                    columns={[
                        {
                            key: 'classId',
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
                            key: 'grade',
                            title: 'Grade',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'teacherName',
                            title: 'Teacher Name',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'totalPoint',
                            title: 'Total Point',
                            type: FieldType.NUMBER,
                        },
                        {
                            key: 'schoolYearId',
                            title: 'School Year',
                            type: FieldType.BADGE_API,
                            apiAction(value) {
                                return schoolYearApi.getEnumSelectOptions({
                                    search: value,
                                    withSchoolName: true,
                                });
                            },
                        },
                        {
                            key: 'status',
                            title: 'Status',
                            type: FieldType.BADGE_API,
                            apiAction: classApi.getEnumStatuses
                        },
                    ]}
                    queryApi={getByRole}
                    actionColumns={(record) => {
                        return (
                            <div className="flex flex-col gap-2">
                                <Button
                                    icon={<EyeOutlined />}
                                    type="primary"
                                    size="small"
                                    className="flex items-center justify-center"
                                    onClick={() => router.push(NKRouter.classes.detail(record.classId))}
                                />
                                <ModalBuilder
                                    btnLabel=""
                                    btnProps={{
                                        size: 'small',
                                        icon: <EditOutlined />,
                                    }}
                                    title="Edit Class"
                                >
                                    {(close) => {
                                        return (
                                            <FormBuilder
                                                className="!p-0"
                                                title=""
                                                apiAction={classApi.update}
                                                defaultValues={{
                                                    teacherID: record.teacherID,
                                                    classGroupId: record.classGroupId,
                                                    classId: record.classId,
                                                    code: record.code,
                                                    name: record.name,
                                                    schoolYearId: record.schoolYearId,
                                                    totalPoint: record.totalPoint,
                                                }}
                                                schema={{
                                                    teacherID: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                    classGroupId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                    classId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                    code: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                    name: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                                    schoolYearId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                    totalPoint: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                }}
                                                fields={[
                                                    {
                                                        name: 'name',
                                                        label: 'Name',
                                                        type: NKFormType.TEXT,
                                                    },
                                                    {
                                                        name: 'code',
                                                        label: 'Code',
                                                        type: NKFormType.TEXT,
                                                    },
                                                    {
                                                        name: 'totalPoint',
                                                        label: 'Total Point',
                                                        type: NKFormType.NUMBER,
                                                    },
                                                    {
                                                        name: 'schoolYearId',
                                                        label: 'School Year',
                                                        type: NKFormType.SELECT_API_OPTION,
                                                        fieldProps: {
                                                            apiAction: (value) =>
                                                                schoolYearApi.getEnumSelectOptions({
                                                                    search: value,
                                                                    withSchoolName: true,
                                                                }),
                                                        },
                                                    },
                                                ]}
                                                onExtraSuccessAction={() => {
                                                    queryClient.invalidateQueries({
                                                        queryKey: ['classes'],
                                                    });

                                                    toast.success('Edit class successfully');

                                                    close();
                                                }}
                                                onExtraErrorAction={toastError}
                                            />
                                        );
                                    }}
                                </ModalBuilder>
                                <CTAButton
                                    ctaApi={() => classApi.delete(record.classId)}
                                    isConfirm
                                    confirmMessage="Are you sure you want to delete this class?"
                                    extraOnError={toastError}
                                    extraOnSuccess={() => {
                                        queryClient.invalidateQueries({
                                            queryKey: ['classes'],
                                        });

                                        toast.success('Delete class successfully');
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
                            label: 'Name',
                            comparator: FilterComparator.LIKE,
                            name: 'name',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Code',
                            comparator: FilterComparator.LIKE,
                            name: 'code',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Year',
                            comparator: FilterComparator.IN,
                            name: 'year',
                            type: NKFormType.TEXT,
                        },
                    ]}
                    extraButtons={
                        <ModalBuilder
                            btnLabel="Create Class"
                            btnProps={{
                                type: 'primary',
                                icon: <PlusOutlined />,
                            }}
                            title="Create Class"
                        >
                            {(close) => {
                                return (
                                    <FormBuilder
                                        className="!p-0"
                                        title=""
                                        apiAction={classApi.create}
                                        defaultValues={{
                                            teacherID: 0,
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
                                            teacherID: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            classGroupId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            grade: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                        }}
                                        fields={[
                                            {
                                                name: 'schoolYearId',
                                                label: 'School Year',
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
                                                label: 'Name',
                                                type: NKFormType.TEXT,
                                            },
                                            {
                                                name: 'code',
                                                label: 'Code',
                                                type: NKFormType.TEXT,
                                            },
                                            {
                                                name: 'grade',
                                                label: 'Grade',
                                                type: NKFormType.NUMBER,
                                            },
                                            {
                                                name: 'teacherID',
                                                label: 'Teacher',
                                                type: NKFormType.SELECT_API_OPTION,
                                                fieldProps: {
                                                    apiAction: (value) => teacherApi.getEnumSelectOptions({ search: value, schoolId: schoolId }),
                                                },
                                            },
                                            {
                                                name: 'classGroupId',
                                                label: 'Class Group',
                                                type: NKFormType.SELECT_API_OPTION,
                                                fieldProps: {
                                                    apiAction: (value) => classGroupApi.getEnumSelectOptions(value),
                                                },
                                            },
                                        ]}
                                        onExtraSuccessAction={() => {
                                            toast.success('Create class successfully');
                                            queryClient.invalidateQueries({
                                                queryKey: ['classes'],
                                            });
                                            close();
                                        }}
                                        onExtraErrorAction={toastError}
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

export const Route = createFileRoute('/_admin-layout/dashboard/classes/')({
    component: Page,
});
