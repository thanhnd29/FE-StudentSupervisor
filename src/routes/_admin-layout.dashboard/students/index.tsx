import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { highSchoolApi } from '@/core/api/high-school.api';
import { studentApi } from '@/core/api/student.api';
import { FieldType } from '@/core/components/field/FieldDisplay';
import { NKFormType } from '@/core/components/form/NKForm';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { useSelector } from 'react-redux';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();
    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    useDocumentTitle('Student List');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="student-list"
                    title="Student List"
                    columns={[
                        {
                            key: 'studentId',
                            title: 'Id',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'code',
                            title: 'code',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'name',
                            title: 'Name',
                            type: FieldType.TEXT,
                        },
                        {
                            key: '',
                            title: 'Sex',
                            type: FieldType.CUSTOM,
                            formatter: (record) => {
                                return record?.sex ? 'Male' : 'Female';
                            },
                        },
                        {
                            key: 'birthday',
                            title: 'Birthday',
                            type: FieldType.TIME_DATE,
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
                            key: 'schoolId',
                            title: 'School Name',
                            type: FieldType.BADGE_API,
                            apiAction(value) {
                                return highSchoolApi.getEnumSelectOptions(value);
                            },
                        },
                    ]}
                    queryApi={schoolId ? () => studentApi.getBySchool(schoolId) : studentApi.getAll}
                    actionColumns={(record) => {
                        return (
                            <div className="flex flex-col gap-2">
                                {/* <ModalBuilder
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
                                                onExtraSuccessAction={() => {
                                                    toast.success('Update school year successfully');
                                                    queryClient.invalidateQueries({
                                                        queryKey: ['school-year'],
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
                                            queryKey: ['school-year'],
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
                                </CTAButton> */}
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
                    // extraButtons={
                    //     <ModalBuilder
                    //         btnLabel="Create School Year"
                    //         btnProps={{
                    //             type: 'primary',
                    //             icon: <PlusOutlined />,
                    //         }}
                    //         title="Create School Year"
                    //     >
                    //         {(close) => {
                    //             return (
                    //                 <FormBuilder
                    //                     className="!p-0"
                    //                     title=""
                    //                     apiAction={({ endDate, schoolId, startDate, year }) => {
                    //                         if (moment(startDate).isAfter(endDate)) {
                    //                             toast.error('Start Date must be before end date');
                    //                             return;
                    //                         }

                    //                         return schoolYearApi.create({
                    //                             endDate: moment(endDate).toISOString(),
                    //                             schoolId,
                    //                             startDate: moment(startDate).toISOString(),
                    //                             year: moment(year).year(),
                    //                         });
                    //                     }}
                    //                     defaultValues={{
                    //                         endDate: new Date(),
                    //                         startDate: new Date(),
                    //                         schoolId: 0,
                    //                         year: new Date(),
                    //                     }}
                    //                     schema={{
                    //                         endDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                    //                         startDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                    //                         schoolId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                    //                         year: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                    //                     }}
                    //                     fields={[
                    //                         {
                    //                             name: 'endDate',
                    //                             label: 'End Date',
                    //                             type: NKFormType.DATE,
                    //                         },
                    //                         {
                    //                             name: 'startDate',
                    //                             label: 'Start Date',
                    //                             type: NKFormType.DATE,
                    //                         },
                    //                         {
                    //                             name: 'schoolId',
                    //                             label: 'School',
                    //                             type: NKFormType.SELECT_API_OPTION,
                    //                             fieldProps: {
                    //                                 apiAction: (value) => highSchoolApi.getEnumSelectOptions(value),
                    //                             },
                    //                         },
                    //                         {
                    //                             name: 'year',
                    //                             label: 'Year',
                    //                             type: NKFormType.DATE_YEAR,
                    //                             fieldProps: {
                    //                                 format: 'YYYY',
                    //                             },
                    //                         },
                    //                     ]}
                    //                     onExtraSuccessAction={() => {
                    //                         toast.success('Create school year successfully');

                    //                         queryClient.invalidateQueries({
                    //                             queryKey: ['school-year'],
                    //                         });

                    //                         close();
                    //                     }}
                    //                     onExtraErrorAction={toastError}
                    //                 />
                    //             );
                    //         }}
                    //     </ModalBuilder>
                    // }
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/students/')({
    component: Page,
});
