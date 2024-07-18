import { useState } from 'react';

import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button, Tabs } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import moment from 'moment';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { classGroupApi } from '@/core/api/class-group.api';
import { classApi } from '@/core/api/class.api';
import { highSchoolApi } from '@/core/api/high-school.api';
import { schoolYearApi } from '@/core/api/school-years.api';
import { teacherApi } from '@/core/api/tearcher.api';
import CTAButton from '@/core/components/cta/CTABtn';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { RoleList, SystemRole } from '@/core/models/user';
import { toastError } from '@/core/utils/api.helper';

const SchoolYearContent = ({
    highSchoolId,
    setSchoolYearIds,
}: {
    highSchoolId: number;
    setSchoolYearIds: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
    const queryClient = useQueryClient();
    return (
        <TableBuilder
            sourceKey={`school-year-${highSchoolId}`}
            title=""
            columns={[
                {
                    key: 'schoolYearId',
                    title: 'Id',
                    type: FieldType.TEXT,
                },
                {
                    key: 'year',
                    title: 'Year',
                    type: FieldType.TEXT,
                },
                {
                    key: 'startDate',
                    title: 'Start Date',
                    type: FieldType.TIME_DATE,
                },
                {
                    key: 'endDate',
                    title: 'End Date',
                    type: FieldType.TIME_DATE,
                },
            ]}
            queryApi={() => {
                return schoolYearApi.getAll().then((data) => {
                    const schoolYears = data.filter((schoolYear) => schoolYear.schoolId === highSchoolId);
                    setSchoolYearIds(schoolYears.map((schoolYear) => schoolYear.schoolYearId));

                    return schoolYears;
                });
            }}
            actionColumns={(record) => {
                return (
                    <div className="flex flex-col gap-2">
                        <ModalBuilder
                            btnLabel=""
                            btnProps={{
                                size: 'small',
                                icon: <EditOutlined />,
                            }}
                            title="Edit School Year"
                        >
                            {(close) => {
                                return (
                                    <FormBuilder
                                        className="!p-0"
                                        title=""
                                        beforeSubmit={(dto) => {
                                            if (moment(dto.startDate).isAfter(dto.endDate)) {
                                                toast.error('Start Date must be before end date');
                                                return false;
                                            }

                                            return true;
                                        }}
                                        apiAction={(dto) => {
                                            return schoolYearApi.update(record.schoolYearId, {
                                                endDate: moment(dto.endDate).toISOString(),
                                                schoolId: dto.schoolId,
                                                startDate: moment(dto.startDate).toISOString(),
                                                year: moment(dto.year).year(),
                                            });
                                        }}
                                        defaultValues={{
                                            endDate: new Date(record.endDate),
                                            startDate: new Date(record.startDate),
                                            schoolId: record.schoolId,
                                            year: new Date(record.year),
                                        }}
                                        schema={{
                                            endDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                            startDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                            schoolId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            year: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                        }}
                                        fields={[
                                            {
                                                name: 'endDate',
                                                label: 'End Date',
                                                type: NKFormType.DATE,
                                            },
                                            {
                                                name: 'startDate',
                                                label: 'Start Date',
                                                type: NKFormType.DATE,
                                            },
                                            {
                                                name: 'year',
                                                label: 'Year',
                                                type: NKFormType.DATE_YEAR,
                                                fieldProps: {
                                                    format: 'YYYY',
                                                },
                                            },
                                        ]}
                                        onExtraSuccessAction={() => {
                                            toast.success('Update school year successfully');
                                            queryClient.invalidateQueries({
                                                queryKey: [`school-year-${highSchoolId}`],
                                            });

                                            close();
                                        }}
                                        onExtraErrorAction={toastError}
                                    />
                                );
                            }}
                        </ModalBuilder>
                        <CTAButton
                            ctaApi={() => schoolYearApi.delete(record.schoolYearId)}
                            isConfirm
                            confirmMessage="Are you sure you want to delete this school year?"
                            extraOnError={toastError}
                            extraOnSuccess={() => {
                                queryClient.invalidateQueries({
                                    queryKey: [`school-year-${highSchoolId}`],
                                });

                                toast.success('Delete school year successfully');
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
            extraButtons={
                <ModalBuilder
                    btnLabel="Create School Year"
                    btnProps={{
                        type: 'primary',
                        icon: <PlusOutlined />,
                    }}
                    title="Create School Year"
                >
                    {(close) => {
                        return (
                            <FormBuilder
                                className="!p-0"
                                title=""
                                beforeSubmit={(dto) => {
                                    if (moment(dto.startDate).isAfter(dto.endDate)) {
                                        toast.error('Start Date must be before end date');
                                        return false;
                                    }

                                    return true;
                                }}
                                apiAction={({ endDate, schoolId, startDate, year }) => {
                                    return schoolYearApi.create({
                                        endDate: moment(endDate).toISOString(),
                                        schoolId,
                                        startDate: moment(startDate).toISOString(),
                                        year: moment(year).year(),
                                    });
                                }}
                                defaultValues={{
                                    endDate: new Date(),
                                    startDate: new Date(),
                                    schoolId: highSchoolId,
                                    year: new Date(),
                                }}
                                schema={{
                                    endDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                    startDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                    schoolId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                    year: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                }}
                                fields={[
                                    {
                                        name: 'endDate',
                                        label: 'End Date',
                                        type: NKFormType.DATE,
                                    },
                                    {
                                        name: 'startDate',
                                        label: 'Start Date',
                                        type: NKFormType.DATE,
                                    },
                                    {
                                        name: 'year',
                                        label: 'Year',
                                        type: NKFormType.DATE_YEAR,
                                        fieldProps: {
                                            format: 'YYYY',
                                        },
                                    },
                                ]}
                                onExtraSuccessAction={() => {
                                    toast.success('Create school year successfully');

                                    queryClient.invalidateQueries({
                                        queryKey: [`school-year-${highSchoolId}`],
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
    );
};

const ClassesContent = ({ schoolYearIds }: { schoolYearIds: number[] }) => {
    const queryClient = useQueryClient();
    const { id } = Route.useParams();

    return (
        <TableBuilder
            enabledQuery={schoolYearIds.length > 0}
            sourceKey={`classes-${schoolYearIds.join('-')}`}
            title=""
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
                    key: 'room',
                    title: 'Room',
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
                            highSchoolId: Number(id),
                            search: value,
                        });
                    },
                },
                {
                    key: 'classGroupId',
                    title: 'Class Group',
                    type: FieldType.BADGE_API,
                    apiAction(value) {
                        return classGroupApi.getEnumSelectOptions(value);
                    },
                },
            ]}
            queryApi={() =>
                classApi.getAll().then((data) => {
                    return data.filter((record) => schoolYearIds.includes(record.schoolYearId));
                })
            }
            actionColumns={(record) => {
                return (
                    <div className="flex flex-col gap-2">
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
                                            classId: record.classId,
                                            classGroupId: record.classGroupId,
                                            code: record.code,
                                            name: record.name,
                                            room: record.room,
                                            schoolYearId: record.schoolYearId,
                                            totalPoint: record.totalPoint,
                                        }}
                                        schema={{
                                            classId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            classGroupId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                            code: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            name: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                            room: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
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
                                                name: 'room',
                                                label: 'Room',
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
                                                            highSchoolId: Number(id),
                                                            search: value,
                                                        }),
                                                    queryKey: `school-year-${id}`,
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
                                            queryClient.invalidateQueries({
                                                queryKey: [`classes-${schoolYearIds.join('-')}`],
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
                                    queryKey: [`classes-${schoolYearIds.join('-')}`],
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
                                    classGroupId: 0,
                                    code: '',
                                    name: '',
                                    room: '',
                                    schoolYearId: 0,
                                    totalPoint: 0,
                                }}
                                schema={{
                                    classGroupId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                    code: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                    name: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                                    room: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
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
                                        name: 'room',
                                        label: 'Room',
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
                                                    highSchoolId: Number(id),
                                                    search: value,
                                                }),
                                            queryKey: `school-year-${id}`,
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
                                        queryKey: [`classes-${schoolYearIds.join('-')}`],
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
    );
};

const TeacherContent = ({ schoolName }: { schoolName: string }) => {
    const queryClient = useQueryClient();

    return (
        <TableBuilder
            sourceKey={`teacher-list-${schoolName}`}
            title="Teacher List"
            columns={[
                {
                    key: 'teacherId',
                    title: 'Id',
                    type: FieldType.TEXT,
                },
                {
                    key: 'code',
                    title: 'code',
                    type: FieldType.TEXT,
                },
                {
                    key: 'teacherName',
                    title: 'Name',
                    type: FieldType.TEXT,
                },
                {
                    key: '',
                    title: 'Sex',
                    type: FieldType.CUSTOM,
                    formatter: (record) => {
                        return record?.sex ? 'Female' : 'Male';
                    },
                },
                {
                    key: 'address',
                    title: 'Address',
                    type: FieldType.TEXT,
                    formatter: (record) => {
                        return record ? record : 'N/A';
                    },
                },
                {
                    key: 'phone',
                    title: 'Phone',
                    type: FieldType.TEXT,
                    formatter: (record) => {
                        return record ? record : 'N/A';
                    },
                },
                {
                    key: 'schoolName',
                    title: 'School Name',
                    type: FieldType.TEXT,
                },
                {
                    key: 'roleId',
                    title: 'Role',
                    type: FieldType.BADGE_API,
                    apiAction: (value) => {
                        return RoleList;
                    },
                },
            ]}
            enabledQuery={Boolean(schoolName)}
            queryApi={() => teacherApi.getAll().then((data) => data.filter((record) => record.schoolName === schoolName))}
            actionColumns={(record) => {
                return (
                    <div className="flex flex-col gap-2">
                        <CTAButton
                            ctaApi={() => teacherApi.delete(record.teacherId)}
                            isConfirm
                            confirmMessage="Are you sure you want to delete this teacher?"
                            extraOnError={toastError}
                            extraOnSuccess={() => {
                                queryClient.invalidateQueries({
                                    queryKey: [`teacher-list-${schoolName}`],
                                });

                                toast.success('Delete school year successfully');
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
            extraButtons={
                <ModalBuilder
                    btnLabel="Create Teacher"
                    btnProps={{
                        type: 'primary',
                        icon: <PlusOutlined />,
                    }}
                    title="Create Teacher"
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
                                    schoolId: 0,
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
                                        name: 'teacherName',
                                        label: 'Name',
                                        type: NKFormType.TEXT,
                                    },
                                    {
                                        name: 'code',
                                        label: 'Code',
                                        type: NKFormType.TEXT,
                                    },
                                    {
                                        name: 'phone',
                                        label: 'Phone',
                                        type: NKFormType.TEXT,
                                    },
                                    {
                                        name: 'password',
                                        label: 'Password',
                                        type: NKFormType.PASSWORD,
                                    },
                                    {
                                        name: 'address',
                                        label: 'Address',
                                        type: NKFormType.TEXT,
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
                                onExtraSuccessAction={() => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['teacher-list'],
                                    });

                                    toast.success('Create teacher successfully');

                                    close();
                                }}
                                onExtraErrorAction={toastError}
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
    const [schoolYearIds, setSchoolYearIds] = useState<number[]>([]);

    const highSchoolQuery = useQuery({
        queryKey: ['high-school', id],
        queryFn: () => {
            return highSchoolApi.getById(Number(id));
        },
    });

    if (highSchoolQuery.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-4">
            <FieldBuilder
                record={highSchoolQuery.data}
                title="High School Detail"
                fields={[
                    {
                        key: 'schoolId',
                        title: 'Id',
                        type: FieldType.TEXT,
                    },
                    {
                        key: 'name',
                        title: 'Name',
                        type: FieldType.TEXT,
                    },
                    {
                        key: 'imageUrl',
                        title: 'Image',
                        type: FieldType.THUMBNAIL,
                    },
                    {
                        key: 'code',
                        title: 'Code',
                        type: FieldType.TEXT,
                    },
                    {
                        key: 'address',
                        title: 'Address',
                        type: FieldType.TEXT,
                    },
                    {
                        key: 'phone',
                        title: 'Phone',
                        type: FieldType.TEXT,
                    },
                    {
                        key: 'webUrl',
                        title: 'Web Url',
                        type: FieldType.TEXT,
                    },
                    {
                        key: 'status',
                        title: 'Status',
                        type: FieldType.BADGE_API,
                        apiAction() {
                            return highSchoolApi.getEnumStatus();
                        },
                    },
                ]}
            />

            <div className="rounded-lg bg-white p-8">
                <Tabs
                    defaultActiveKey="school-year"
                    items={[
                        {
                            key: 'school-year',
                            label: 'School Year',
                            children: <SchoolYearContent highSchoolId={Number(id)} setSchoolYearIds={setSchoolYearIds} />,
                        },
                        {
                            key: 'classes',
                            label: 'Classes',
                            children: <ClassesContent schoolYearIds={schoolYearIds} />,
                        },
                        {
                            key: 'teachers',
                            label: 'Teachers',
                            children: <TeacherContent schoolName={highSchoolQuery.data?.name as string} />,
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/high-school/$id')({
    component: Page,
});
