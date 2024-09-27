import { EditOutlined, EyeOutlined, HistoryOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import { Trash } from 'lucide-react';
import moment from 'moment';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { disciplineApi, IUpdateDisciplineDto } from '@/core/api/discipline.api';
import { penaltyApi } from '@/core/api/penalty.api';
import { registerSchoolApi } from '@/core/api/register-school.api';
import { violationsApi } from '@/core/api/violation.api';
import CTAButton from '@/core/components/cta/CTABtn';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { toastError } from '@/core/utils/api.helper';
import { RootState } from '@/core/store';
import { useSelector } from 'react-redux';
import { UserState } from '@/core/store/user';
import { FilterComparator } from '@/core/models/common';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { NKRouter } from '@/core/NKRouter';
import { useEffect, useState } from 'react';
import { MonthList, SemesterList, WeekList } from '@/core/models/date';
import { schoolYearApi } from '@/core/api/school-years.api';

interface PageProps { }

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();
    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId, userId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    const today = new Date()

    const [year, setYear] = useState<number>(Number(today.getFullYear()))
    const [month, setMonth] = useState<number>(0)
    const [semesterName, setSemesterName] = useState<string>("")
    const [week, setWeek] = useState<number>(0)

    const getByRole = () => {
        if (schoolId) {
            if (isTeacher) {
                return disciplineApi.getByTeacher(userId, year, semesterName, month, week);
            }
            if (isSupervisor) {
                return disciplineApi.getBySupervisor(userId, year, semesterName, month, week);
            }
            return disciplineApi.getBySchool(schoolId, year, semesterName, month, week)
        }
        return disciplineApi.getAll()
    };

    useEffect(() => {
        queryClient.invalidateQueries({
            queryKey: ['disciplines'],
        });
    }, [year, month, week, semesterName, queryClient]);

    useDocumentTitle('Kỷ luật');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="disciplines"
                    title="Kỷ luật"
                    columns={[
                        {
                            key: 'disciplineId',
                            title: 'ID',
                            type: FieldType.TEXT,
                            width: '50px'
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
                            key: 'pennaltyId',
                            title: 'Hình phạt',
                            type: FieldType.BADGE_API,
                            apiAction(value) {
                                return penaltyApi.getEnumSelectOptions(value);
                            },
                        },
                        {
                            key: 'startDate',
                            title: 'Ngày bắt đầu',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'endDate',
                            title: 'Ngày kết thúc',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'year',
                            title: 'Niên khóa',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'status',
                            title: 'Trạng thái',
                            type: FieldType.BADGE_API,
                            apiAction: disciplineApi.getEnumStatuses
                        },
                    ]}
                    queryApi={getByRole}
                    actionColumns={(record) => (
                        <div className="grid grid-cols-2 gap-2">
                            <div className="col-span-1">
                                <Button
                                    icon={<EyeOutlined />}
                                    type="primary"
                                    size="small"
                                    onClick={() => {
                                        router.push(NKRouter.discipline.detail(record.disciplineId));
                                    }}
                                />
                            </div>
                            <div className="col-span-1">
                                <Button
                                    icon={<HistoryOutlined />}
                                    type="dashed"
                                    size="small"
                                    onClick={() => {
                                        router.push(NKRouter.discipline.history(record.studentCode));
                                    }}
                                />
                            </div>
                            {isSupervisor && (
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
                                                <FormBuilder<IUpdateDisciplineDto>
                                                    className="!p-0"
                                                    apiAction={(dto) => disciplineApi.update(record.disciplineId, dto)}
                                                    defaultValues={{
                                                        startDate: record.startDate,
                                                        endDate: record.endDate,
                                                        pennaltyId: record.pennaltyId
                                                    }}
                                                    fields={[
                                                        // {
                                                        //     name: 'studentName',
                                                        //     type: NKFormType.TEXT,
                                                        //     label: 'Name',
                                                        //     fieldProps: {
                                                        //         readOnly: true
                                                        //     }
                                                        // },
                                                        // {
                                                        //     name: 'studentCode',
                                                        //     type: NKFormType.TEXT,
                                                        //     label: 'Code',
                                                        //     fieldProps: {
                                                        //         readOnly: true
                                                        //     }
                                                        // },
                                                        {
                                                            name: 'startDate',
                                                            type: NKFormType.DATE,
                                                            label: 'Ngày bắt đầu',
                                                        },
                                                        {
                                                            name: 'endDate',
                                                            type: NKFormType.DATE,
                                                            label: 'Ngày kết thúc',
                                                        },
                                                        // {
                                                        //     name: 'description',
                                                        //     type: NKFormType.TEXTAREA,
                                                        //     label: 'Description',
                                                        //     fieldProps: {
                                                        //         readOnly: true
                                                        //     }
                                                        // },
                                                        // {
                                                        //     name: 'status',
                                                        //     label: 'Status',
                                                        //     type: NKFormType.SELECT_API_OPTION,
                                                        //     fieldProps: {
                                                        //         apiAction: disciplineApi.getEnumStatuses,
                                                        //     },
                                                        // },
                                                        // {
                                                        //     name: 'year',
                                                        //     label: 'Year',
                                                        //     type: NKFormType.TEXT,
                                                        //     fieldProps: {
                                                        //         readOnly: true
                                                        //     }
                                                        // },
                                                        // {
                                                        //     name: 'violationId',
                                                        //     type: NKFormType.SELECT_API_OPTION,
                                                        //     label: 'Violation',
                                                        //     fieldProps: {
                                                        //         apiAction: (value) => violationsApi.getEnumSelectOptions(value),
                                                        //         readonly: true
                                                        //     },
                                                        // },
                                                        {
                                                            name: 'pennaltyId',
                                                            type: NKFormType.SELECT_API_OPTION,
                                                            label: 'Hình phạt',
                                                            fieldProps: {
                                                                apiAction: (value) => penaltyApi.getEnumSelectOptions(value, schoolId),
                                                            },
                                                        },
                                                    ]}
                                                    title=""
                                                    schema={{
                                                        endDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                                        pennaltyId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                                                        startDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                                                    }}
                                                    beforeSubmit={(dto) => {
                                                        if (moment(dto.startDate).isAfter(dto.endDate)) {
                                                            toast.error('Start Date must be before End Date');
                                                            return false;
                                                        }

                                                        return true;
                                                    }}
                                                    onExtraErrorAction={toastError}
                                                    onExtraSuccessAction={(data) => {
                                                        queryClient.invalidateQueries({
                                                            queryKey: ['disciplines'],
                                                        });

                                                        close();

                                                        toast.success(data.message || 'Successful');
                                                    }}
                                                />
                                            );
                                        }}
                                    </ModalBuilder>
                                </div>
                            )}
                            {/* <div className="col-span-1">
                                <CTAButton
                                    ctaApi={() => disciplineApi.delete(record.disciplineId)}
                                    isConfirm
                                    confirmMessage="Are you sure you want to delete this discipline?"
                                    extraOnError={toastError}
                                    extraOnSuccess={(data) => {
                                        queryClient.invalidateQueries({
                                            queryKey: ['disciplines'],
                                        });

                                        toast.success(data.message || 'Successful');
                                    }}
                                >
                                    <Button className="flex h-6 w-6 items-center justify-center p-0" danger type="primary" size="small">
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </CTAButton>
                            </div> */}
                            {isTeacher && (
                                <div className="col-span-1">
                                    <CTAButton
                                        ctaApi={() => disciplineApi.executing(record.disciplineId)}
                                        isConfirm
                                        confirmMessage="Bạn có chắc chắn muốn thực hiện kỷ luật này không?"
                                        extraOnError={toastError}
                                        extraOnSuccess={(data) => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['disciplines'],
                                            });

                                            toast.success(data.message || 'Successful');
                                        }}
                                    >
                                        <Button className="flex h-6 w-6 items-center justify-center p-0" type="primary" size="small">
                                            E
                                        </Button>
                                    </CTAButton>
                                </div>
                            )}
                            {isTeacher && (
                                <div className="col-span-1">
                                    <CTAButton
                                        ctaApi={() => disciplineApi.done(record.disciplineId)}
                                        isConfirm
                                        confirmMessage="Bạn có chắc chắn kỷ luật này đã hoàn thành không?"
                                        extraOnError={toastError}
                                        extraOnSuccess={(data) => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['disciplines'],
                                            });

                                            toast.success(data.message || 'Successful');
                                        }}
                                    >
                                        <Button className="flex h-6 w-6 items-center justify-center p-0" type="default" size="small">
                                            D
                                        </Button>
                                    </CTAButton>
                                </div>
                            )}
                            {isTeacher && (
                                <div className="col-span-1">
                                    <CTAButton
                                        ctaApi={() => disciplineApi.complain(record.disciplineId)}
                                        isConfirm
                                        confirmMessage="Bạn có chắc chắn muốn khiếu nại về kỷ luật này không?"
                                        extraOnError={toastError}
                                        extraOnSuccess={(data) => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['disciplines'],
                                            });

                                            toast.success(data.message || 'Successful');
                                        }}
                                    >
                                        <Button className="flex h-6 w-6 items-center justify-center p-0" danger type="primary" size="small">
                                            C
                                        </Button>
                                    </CTAButton>
                                </div>
                            )}
                        </div>
                    )}
                    filters={[
                        {
                            label: 'Tên học sinh',
                            comparator: FilterComparator.LIKE,
                            name: 'studentName',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Mã học sinh',
                            comparator: FilterComparator.LIKE,
                            name: 'studentCode',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Trạng thái',
                            comparator: FilterComparator.LIKE,
                            name: 'status',
                            type: NKFormType.SELECT_API_OPTION,
                            apiAction: disciplineApi.getEnumStatuses
                        },
                    ]}
                    extraButtons={
                        <div className="flex flex-row items-center w-full">
                            <FormBuilder
                                title=""
                                apiAction={() => { }}
                                defaultValues={{
                                    year: year,
                                    month: month,
                                    weekNumber: week ?? 0,
                                    semesterName: "Học kỳ 1",
                                    school: schoolId
                                }}
                                schema={{
                                    year: Joi.number(),
                                    month: Joi.number(),
                                    weekNumber: Joi.number(),
                                    semesterName: Joi.string(),
                                    school: Joi.number()
                                }}
                                isButton={false}
                                className="flex items-center w-[40rem] !bg-transparent"
                                fields={[
                                    {
                                        name: 'year',
                                        label: '',
                                        type: NKFormType.SELECT_API_OPTION,
                                        fieldProps: {
                                            apiAction: (value) => (
                                                schoolYearApi.getEnumSelectYear({ search: value, highSchoolId: schoolId })
                                            )
                                        },
                                        span: 1,
                                        onChangeExtra: (value) => {
                                            setYear(Number(value))
                                        }
                                    },
                                    {
                                        name: 'semesterName',
                                        label: '',
                                        type: NKFormType.SELECT_API_OPTION,
                                        fieldProps: {
                                            apiAction: async (value) => (
                                                await SemesterList.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()))
                                            ),
                                        },
                                        span: 1,
                                        onChangeExtra: (value) => {
                                            setSemesterName(value)
                                        }
                                    },
                                    {
                                        name: 'month',
                                        label: '',
                                        type: NKFormType.SELECT_API_OPTION,
                                        fieldProps: {
                                            apiAction: async (value) => (
                                                await MonthList.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()))
                                            )
                                        },
                                        span: 1,
                                        onChangeExtra: (value) => {
                                            setMonth(Number(value))
                                        }
                                    },
                                    {
                                        name: 'weekNumber',
                                        label: '',
                                        type: NKFormType.SELECT_API_OPTION,
                                        fieldProps: {
                                            apiAction: async (value) => (
                                                await WeekList.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()))
                                            ),
                                        },
                                        span: 1,
                                        onChangeExtra: (value) => {
                                            setWeek(Number(value))
                                        }
                                    },
                                ]}
                            />
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/disciplines/')({
    component: Page,
});
