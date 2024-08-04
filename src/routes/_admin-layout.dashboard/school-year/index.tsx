import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import moment from 'moment';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { highSchoolApi } from '@/core/api/high-school.api';
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
import { useSelector } from 'react-redux';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps { }

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();
    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    useDocumentTitle('School Year List');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="school-year"
                    title="School Year List"
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
                        {
                            key: 'schoolName',
                            title: 'School Name',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'status',
                            title: 'Status',
                            type: FieldType.BADGE_API,
                            apiAction(value) {
                                return schoolYearApi.getEnumStatuses(value);
                            },
                        },
                    ]}
                    queryApi={schoolId ? () => schoolYearApi.getBySchool(schoolId) : schoolYearApi.getAll}
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
                                                apiAction={(dto) => {
                                                    if (moment(dto.startDate).isAfter(dto.endDate)) {
                                                        toast.error('Start Date must be before end date');
                                                        return;
                                                    }

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
                                                        name: 'schoolId',
                                                        label: 'School',
                                                        type: NKFormType.SELECT_API_OPTION,
                                                        fieldProps: {
                                                            apiAction: (value) => highSchoolApi.getEnumSelectOptions(value),
                                                            readonly: true,
                                                        },
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
                                                onExtraSuccessAction={(data) => {
                                                    queryClient.invalidateQueries({
                                                        queryKey: ['school-year'],
                                                    });

                                                    close();

                                                    toast.success(data.message || 'Successful');
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
                                    extraOnSuccess={(data) => {
                                        queryClient.invalidateQueries({
                                            queryKey: ['school-year'],
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
                            label: 'Year',
                            comparator: FilterComparator.EQUAL,
                            name: 'year',
                            type: NKFormType.NUMBER,
                        },
                        {
                            label: 'School Name',
                            comparator: FilterComparator.LIKE,
                            name: 'schoolName',
                            type: NKFormType.TEXT,
                        },
                    ]}
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
                                        apiAction={({ endDate, schoolId, startDate, year }) => {
                                            if (moment(startDate).isAfter(endDate)) {
                                                toast.error('Start Date must be before end date');
                                                return;
                                            }

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
                                            schoolId: schoolId || 0,
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
                                                name: 'schoolId',
                                                label: 'School',
                                                type: NKFormType.SELECT_API_OPTION,
                                                fieldProps: {
                                                    apiAction: (value) => highSchoolApi.getEnumSelectOptions(value),
                                                    readonly: true
                                                },
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
                                        onExtraSuccessAction={(data) => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['school-year'],
                                            });

                                            close();

                                            toast.success(data.message || 'Successful');
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

export const Route = createFileRoute('/_admin-layout/dashboard/school-year/')({
    component: Page,
});
