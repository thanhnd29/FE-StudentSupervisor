import { EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { classApi } from '@/core/api/class.api';
import { violationTypeApi } from '@/core/api/violation-type.api';
import { violationsApi } from '@/core/api/violation.api';
import CTAButton from '@/core/components/cta/CTABtn';
import { FieldType } from '@/core/components/field/FieldDisplay';
import { NKFormType } from '@/core/components/form/NKForm';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { toastError } from '@/core/utils/api.helper';
import { RootState } from '@/core/store';
import { useSelector } from 'react-redux';
import { UserState } from '@/core/store/user';
import { ViolationStatus } from '@/core/models/violation';

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
                return violationsApi.getByTeacher(userId);
            }
            if (isSupervisor) {
                return violationsApi.getBySupervisor(userId);
            }
            return violationsApi.getBySchool(schoolId)
        }
        return violationsApi.getAll()
    };

    useDocumentTitle('Violations');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="violations"
                    title="Violations"
                    columns={[
                        {
                            key: 'violationId',
                            title: 'ID',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'studentCode',
                            title: 'Code',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'studentName',
                            title: 'Student',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'violationName',
                            title: 'Name',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'date',
                            title: 'Date',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'classId',
                            title: 'Class',
                            type: FieldType.BADGE_API,
                            apiAction(value) {
                                return classApi.getEnumSelectOptions({ search: value });
                            },
                        },
                        {
                            key: 'violationGroupName',
                            title: 'Group',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'year',
                            title: 'Year',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'status',
                            title: 'Status',
                            type: FieldType.BADGE_API,
                            apiAction: violationsApi.getEnumStatuses,
                        },
                        // {
                        //     key: 'violationTypeId',
                        //     title: 'Type',
                        //     type: FieldType.BADGE_API,
                        //     apiAction(value) {
                        //         return violationTypeApi.getEnumSelectOptions(schoolId, value);
                        //     },
                        // },
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
                                        router.push(NKRouter.violations.detail(record.violationId));
                                    }}
                                />
                            </div>
                            {isSupervisor && (
                                <div className="col-span-1">
                                    <Button
                                        icon={<EditOutlined />}
                                        size="small"
                                        onClick={() => {
                                            router.push(NKRouter.violations.edit(record.violationId));
                                        }}
                                    />
                                </div>
                            )}
                            {isSupervisor && (
                                <div className="col-span-1">
                                    <CTAButton
                                        ctaApi={() => violationsApi.delete(record.violationId)}
                                        isConfirm
                                        confirmMessage="Are you sure you want to delete this violation?"
                                        extraOnError={toastError}
                                        extraOnSuccess={(data) => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['violations'],
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
                            {isSupervisor && (
                                <div className="col-span-1">
                                    <CTAButton
                                        ctaApi={() => violationsApi.approve(record.violationId)}
                                        isConfirm
                                        confirmMessage="Are you sure you want to approve this violation?"
                                        extraOnError={toastError}
                                        extraOnSuccess={(data) => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['violations'],
                                            });

                                            toast.success(data.message || 'Successful');
                                        }}
                                    >
                                        <Button className="flex h-6 w-6 items-center justify-center p-0" type="primary" size="small">
                                            A
                                        </Button>
                                    </CTAButton>
                                </div>
                            )}
                            {isSupervisor && (
                                <div className="col-span-1">
                                    <CTAButton
                                        ctaApi={() => violationsApi.complete(record.violationId)}
                                        isConfirm
                                        confirmMessage="Are you sure you want to complete this violation?"
                                        extraOnError={toastError}
                                        extraOnSuccess={(data) => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['violations'],
                                            });

                                            toast.success(data.message || 'Successful');
                                        }}
                                    >
                                        <Button className="flex h-6 w-6 items-center justify-center p-0" type="default" size="small">
                                            C
                                        </Button>
                                    </CTAButton>
                                </div>
                            )}
                            {isSupervisor && (
                                <div className="col-span-1">
                                    <CTAButton
                                        ctaApi={() => violationsApi.reject(record.violationId)}
                                        isConfirm
                                        confirmMessage="Are you sure you want to reject this violation?"
                                        extraOnError={toastError}
                                        extraOnSuccess={(data) => {
                                            queryClient.invalidateQueries({
                                                queryKey: ['violations'],
                                            });

                                            toast.success(data.message || 'Successful');
                                        }}
                                    >
                                        <Button className="flex h-6 w-6 items-center justify-center p-0" danger type="primary" size="small">
                                            R
                                        </Button>
                                    </CTAButton>
                                </div>
                            )}
                        </div>
                    )}
                    filters={[
                        {
                            label: 'Name',
                            comparator: FilterComparator.LIKE,
                            name: 'violationName',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Code',
                            comparator: FilterComparator.LIKE,
                            name: 'studentCode',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Year',
                            comparator: FilterComparator.IN,
                            name: 'year',
                            type: NKFormType.TEXT,
                        },
                        ...(!isTeacher ? [{
                            label: 'Status',
                            comparator: FilterComparator.LIKE,
                            name: 'status',
                            type: NKFormType.SELECT_API_OPTION,
                            apiAction: violationsApi.getEnumStatuses,
                        }] : []),
                    ]}
                    extraButtons={
                        <div className="flex items-center gap-3">
                            {/* {isSupervisor && (
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => {
                                        router.push(NKRouter.violations.createForStudent());
                                    }}
                                >
                                    Create Violation Student
                                </Button>
                            )} */}
                            {isSupervisor && (
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => {
                                        router.push(NKRouter.violations.createForSupervisor());
                                    }}
                                >
                                    Create Violation Supervisor
                                </Button>
                            )}
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/violations/')({
    component: Page,
});
